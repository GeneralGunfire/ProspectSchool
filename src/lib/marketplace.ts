import { supabaseAdmin } from './supabase';

// ── Types ─────────────────────────────────────────────────────

export type SellerType = 'student' | 'teacher' | 'admin';
export type ListingCategory = 'textbook' | 'stationery' | 'uniform' | 'equipment' | 'misc';
export type ListingCondition = 'new' | 'like_new' | 'good' | 'fair';
export type ListingStatus = 'active' | 'sold';

export interface MarketplaceListing {
  id: number;
  school_id: number;
  seller_type: SellerType;
  seller_id: number;
  title: string;
  description: string | null;
  category: ListingCategory;
  subject: string | null;
  grade: number | null;
  condition: ListingCondition;
  price: number;
  status: ListingStatus;
  supply_guide_item_id: number | null;
  created_at: string;
  // joined
  images: string[];
  interest_count: number;
  seller_label: string; // e.g. "Rajen, Grade 10A" or "Mrs Smith, Teacher"
}

export interface CreateListingInput {
  school_id: number;
  seller_type: SellerType;
  seller_id: number;
  title: string;
  description?: string;
  category: ListingCategory;
  subject?: string;
  grade?: number;
  condition: ListingCondition;
  price: number;
  images: File[];
  supply_guide_item_id?: number | null;
}

export type ListingResult =
  | { success: true; listing: MarketplaceListing; error?: string }
  | { success: false; error: string };

export type SimpleResult =
  | { success: true; error?: string }
  | { success: false; error: string };

export interface Interest {
  user_type: SellerType;
  user_id: number;
  created_at: string;
  label: string;
}

// ── Seller label resolution ───────────────────────────────────

async function resolveSellerLabels(
  rows: { seller_type: SellerType; seller_id: number }[]
): Promise<Map<string, string>> {
  const labels = new Map<string, string>();

  const studentIds = [...new Set(rows.filter(r => r.seller_type === 'student').map(r => r.seller_id))];
  const teacherIds  = [...new Set(rows.filter(r => r.seller_type === 'teacher').map(r => r.seller_id))];
  const adminIds    = [...new Set(rows.filter(r => r.seller_type === 'admin').map(r => r.seller_id))];

  if (studentIds.length) {
    const { data } = await supabaseAdmin
      .from('students')
      .select('id, name, surname, grade, cohorts(name)')
      .in('id', studentIds);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data ?? []).forEach((s: any) => {
      const cohort = s.cohorts?.name ? ` Grade ${s.grade}${s.cohorts.name.replace(/^\d+/, '')}` : ` Grade ${s.grade}`;
      labels.set(`student:${s.id}`, `${s.name},${cohort}`);
    });
  }
  if (teacherIds.length) {
    const { data } = await supabaseAdmin.from('teachers').select('id, name, surname').in('id', teacherIds);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data ?? []).forEach((t: any) => {
      labels.set(`teacher:${t.id}`, `${t.name} ${t.surname}, Teacher`);
    });
  }
  if (adminIds.length) {
    const { data } = await supabaseAdmin.from('admins').select('id, name, surname').in('id', adminIds);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data ?? []).forEach((a: any) => {
      labels.set(`admin:${a.id}`, `${a.name} ${a.surname}, Admin`);
    });
  }
  return labels;
}

// ── Storage ────────────────────────────────────────────────────

async function uploadListingImage(
  file: File,
  school_id: number
): Promise<{ path: string } | { uploadError: string }> {
  const ext = file.name.split('.').pop();
  const storagePath = `${school_id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabaseAdmin.storage.from('marketplace').upload(storagePath, file, { upsert: false });
  if (error) {
    console.error('[marketplace] upload error:', error.message, error);
    return { uploadError: error.message };
  }
  return { path: storagePath };
}

async function deleteListingImages(paths: string[]): Promise<void> {
  if (!paths.length) return;
  await supabaseAdmin.storage.from('marketplace').remove(paths);
}

export async function getListingImageUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.storage.from('marketplace').createSignedUrl(storagePath, 60 * 60);
  if (error || !data) {
    console.error('[marketplace] signed URL error:', error?.message);
    return null;
  }
  return data.signedUrl;
}

// ── Assemble listings (shared by browse/my-listings) ──────────

async function assembleListings(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[]
): Promise<MarketplaceListing[]> {
  if (!rows.length) return [];

  const listingIds = rows.map(r => r.id);

  const [{ data: images, error: imagesError }, { data: interests }, labels] = await Promise.all([
    supabaseAdmin
      .from('marketplace_listing_images')
      .select('listing_id, storage_path, position')
      .in('listing_id', listingIds)
      .order('position'),
    supabaseAdmin
      .from('marketplace_interests')
      .select('listing_id')
      .in('listing_id', listingIds),
    resolveSellerLabels(rows.map(r => ({ seller_type: r.seller_type, seller_id: r.seller_id }))),
  ]);

  if (imagesError) console.error('[marketplace] fetch images error:', imagesError.message);

  const imagesByListing = new Map<number, string[]>();
  (images ?? []).forEach(img => {
    if (!imagesByListing.has(img.listing_id)) imagesByListing.set(img.listing_id, []);
    imagesByListing.get(img.listing_id)!.push(img.storage_path);
  });

  const interestCountByListing = new Map<number, number>();
  (interests ?? []).forEach(i => {
    interestCountByListing.set(i.listing_id, (interestCountByListing.get(i.listing_id) ?? 0) + 1);
  });

  return rows.map(r => ({
    ...r,
    images: imagesByListing.get(r.id) ?? [],
    interest_count: interestCountByListing.get(r.id) ?? 0,
    seller_label: labels.get(`${r.seller_type}:${r.seller_id}`) ?? 'Unknown seller',
  }));
}

// ── Browse (active listings for a school) ──────────────────────

export async function fetchActiveListings(school_id: number): Promise<MarketplaceListing[]> {
  const { data, error } = await supabaseAdmin
    .from('marketplace_listings')
    .select('*')
    .eq('school_id', school_id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return assembleListings(data);
}

// ── My Listings ──────────────────────────────────────────────

export async function fetchMyListings(
  seller_type: SellerType,
  seller_id: number,
  school_id: number
): Promise<MarketplaceListing[]> {
  const { data, error } = await supabaseAdmin
    .from('marketplace_listings')
    .select('*')
    .eq('school_id', school_id)
    .eq('seller_type', seller_type)
    .eq('seller_id', seller_id)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return assembleListings(data);
}

// ── Create listing ──────────────────────────────────────────────

export async function createListing(input: CreateListingInput): Promise<ListingResult> {
  const { data: listingRow, error: insertError } = await supabaseAdmin
    .from('marketplace_listings')
    .insert({
      school_id:   input.school_id,
      seller_type: input.seller_type,
      seller_id:   input.seller_id,
      title:       input.title.trim(),
      description: input.description?.trim() || null,
      category:    input.category,
      subject:     input.subject || null,
      grade:       input.grade ?? null,
      condition:   input.condition,
      price:       input.price,
      supply_guide_item_id: input.supply_guide_item_id ?? null,
    })
    .select('*')
    .single();

  if (insertError || !listingRow) {
    console.error('[marketplace] insert error:', insertError?.message);
    return { success: false, error: insertError?.message ?? 'Failed to create listing.' };
  }

  // Upload images (best-effort — listing already exists if some fail)
  const uploadedPaths: string[] = [];
  for (const [i, file] of input.images.slice(0, 3).entries()) {
    const uploaded = await uploadListingImage(file, input.school_id);
    if ('uploadError' in uploaded) {
      console.error('[marketplace] image upload failed, skipping:', uploaded.uploadError);
      continue;
    }
    uploadedPaths.push(uploaded.path);
    const { error: imgInsertError } = await supabaseAdmin.from('marketplace_listing_images').insert({
      listing_id:   listingRow.id,
      storage_path: uploaded.path,
      position:     i,
    });
    if (imgInsertError) console.error('[marketplace] image row insert failed:', imgInsertError.message);
  }

  const [assembled] = await assembleListings([listingRow]);
  return { success: true, listing: assembled };
}

// ── Mark as sold ──────────────────────────────────────────────

export async function markListingSold(id: number, school_id: number): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('marketplace_listings')
    .update({ status: 'sold' })
    .eq('id', id)
    .eq('school_id', school_id);
  if (error) return { success: false, error: 'Failed to update listing.' };
  return { success: true };
}

// ── Delete listing ──────────────────────────────────────────────

export async function deleteListing(id: number, school_id: number, imagePaths: string[]): Promise<SimpleResult> {
  await deleteListingImages(imagePaths);
  const { error } = await supabaseAdmin
    .from('marketplace_listings')
    .delete()
    .eq('id', id)
    .eq('school_id', school_id);
  if (error) return { success: false, error: 'Failed to delete listing.' };
  return { success: true };
}

// ── Interested (toggle) ──────────────────────────────────────────

export async function isInterested(listing_id: number, user_type: SellerType, user_id: number): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('marketplace_interests')
    .select('id')
    .eq('listing_id', listing_id)
    .eq('user_type', user_type)
    .eq('user_id', user_id)
    .maybeSingle();
  return !!data;
}

export async function toggleInterest(
  listing_id: number,
  user_type: SellerType,
  user_id: number
): Promise<{ interested: boolean }> {
  const already = await isInterested(listing_id, user_type, user_id);
  if (already) {
    await supabaseAdmin
      .from('marketplace_interests')
      .delete()
      .eq('listing_id', listing_id)
      .eq('user_type', user_type)
      .eq('user_id', user_id);
    return { interested: false };
  }
  await supabaseAdmin.from('marketplace_interests').insert({ listing_id, user_type, user_id });
  return { interested: true };
}

export async function fetchInterestedUsers(listing_id: number): Promise<Interest[]> {
  const { data, error } = await supabaseAdmin
    .from('marketplace_interests')
    .select('listing_id, user_type, user_id, created_at')
    .eq('listing_id', listing_id)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  const labels = await resolveSellerLabels(data.map(d => ({ seller_type: d.user_type, seller_id: d.user_id })));
  return data.map(d => ({
    user_type:  d.user_type,
    user_id:    d.user_id,
    created_at: d.created_at,
    label:      labels.get(`${d.user_type}:${d.user_id}`) ?? 'Unknown',
  }));
}

// ── Wanted ──────────────────────────────────────────────────────

export type WantedStatus = 'open' | 'closed';

export interface WantedRequest {
  id: number;
  school_id: number;
  requester_type: SellerType;
  requester_id: number;
  title: string;
  subject: string | null;
  grade: number | null;
  budget: number | null;
  status: WantedStatus;
  created_at: string;
  requester_label: string;
}

export interface CreateWantedInput {
  school_id: number;
  requester_type: SellerType;
  requester_id: number;
  title: string;
  subject?: string;
  grade?: number;
  budget?: number;
}

export type WantedResult =
  | { success: true; wanted: WantedRequest; error?: string }
  | { success: false; error: string };

export async function fetchOpenWanted(school_id: number): Promise<WantedRequest[]> {
  const { data, error } = await supabaseAdmin
    .from('marketplace_wanted')
    .select('*')
    .eq('school_id', school_id)
    .eq('status', 'open')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  const labels = await resolveSellerLabels(data.map(r => ({ seller_type: r.requester_type, seller_id: r.requester_id })));
  return data.map(r => ({
    ...r,
    requester_label: labels.get(`${r.requester_type}:${r.requester_id}`) ?? 'Unknown',
  }));
}

export async function fetchMyWanted(
  requester_type: SellerType,
  requester_id: number,
  school_id: number
): Promise<WantedRequest[]> {
  const { data, error } = await supabaseAdmin
    .from('marketplace_wanted')
    .select('*')
    .eq('school_id', school_id)
    .eq('requester_type', requester_type)
    .eq('requester_id', requester_id)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  const labels = await resolveSellerLabels(data.map(r => ({ seller_type: r.requester_type, seller_id: r.requester_id })));
  return data.map(r => ({
    ...r,
    requester_label: labels.get(`${r.requester_type}:${r.requester_id}`) ?? 'Unknown',
  }));
}

export async function createWanted(input: CreateWantedInput): Promise<WantedResult> {
  const { data, error } = await supabaseAdmin
    .from('marketplace_wanted')
    .insert({
      school_id:       input.school_id,
      requester_type:  input.requester_type,
      requester_id:    input.requester_id,
      title:           input.title.trim(),
      subject:         input.subject || null,
      grade:           input.grade ?? null,
      budget:          input.budget ?? null,
    })
    .select('*')
    .single();

  if (error || !data) {
    console.error('[marketplace] wanted insert error:', error?.message);
    return { success: false, error: error?.message ?? 'Failed to post request.' };
  }
  const labels = await resolveSellerLabels([{ seller_type: data.requester_type, seller_id: data.requester_id }]);
  return {
    success: true,
    wanted: { ...data, requester_label: labels.get(`${data.requester_type}:${data.requester_id}`) ?? 'Unknown' },
  };
}

export async function closeWanted(id: number, school_id: number): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('marketplace_wanted')
    .update({ status: 'closed' })
    .eq('id', id)
    .eq('school_id', school_id);
  if (error) return { success: false, error: 'Failed to update request.' };
  return { success: true };
}

export async function deleteWanted(id: number, school_id: number): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('marketplace_wanted')
    .delete()
    .eq('id', id)
    .eq('school_id', school_id);
  if (error) return { success: false, error: 'Failed to delete request.' };
  return { success: true };
}

// ── Supply Guide ──────────────────────────────────────────────

export interface Retailer {
  name: string;
  url?: string;
}

export interface SupplyGuideItem {
  id: number;
  school_id: number;
  grade: number;
  subject: string | null;
  item_name: string;
  product_code: string | null;
  isbn: string | null;
  edition: string | null;
  publisher: string | null;
  brand: string | null;
  avg_price: number | null;
  retailers: Retailer[];
  created_at: string;
  // joined (admin/student views)
  listing_count?: number;
  removed?: boolean;
}

export interface CreateSupplyGuideItemInput {
  school_id: number;
  grade: number;
  subject?: string;
  item_name: string;
  product_code?: string;
  isbn?: string;
  edition?: string;
  publisher?: string;
  brand?: string;
  avg_price?: number;
  retailers?: Retailer[];
}

export type SupplyGuideItemResult =
  | { success: true; item: SupplyGuideItem; error?: string }
  | { success: false; error: string };

export async function fetchSupplyGuideItems(school_id: number, grade?: number): Promise<SupplyGuideItem[]> {
  let query = supabaseAdmin.from('supply_guide_items').select('*').eq('school_id', school_id);
  if (grade != null) query = query.eq('grade', grade);
  const { data, error } = await query.order('subject').order('item_name');
  if (error || !data) return [];

  const itemIds = data.map(d => d.id);
  if (!itemIds.length) return data;

  const { data: listingCounts } = await supabaseAdmin
    .from('marketplace_listings')
    .select('supply_guide_item_id')
    .in('supply_guide_item_id', itemIds)
    .eq('status', 'active');

  const countMap = new Map<number, number>();
  (listingCounts ?? []).forEach(l => {
    if (l.supply_guide_item_id == null) return;
    countMap.set(l.supply_guide_item_id, (countMap.get(l.supply_guide_item_id) ?? 0) + 1);
  });

  return data.map(d => ({ ...d, listing_count: countMap.get(d.id) ?? 0 }));
}

export async function fetchSupplyGuideItemByCode(school_id: number, code: string): Promise<SupplyGuideItem | null> {
  const { data, error } = await supabaseAdmin
    .from('supply_guide_items')
    .select('*')
    .eq('school_id', school_id)
    .eq('product_code', code.trim())
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

export async function createSupplyGuideItem(input: CreateSupplyGuideItemInput): Promise<SupplyGuideItemResult> {
  const { data, error } = await supabaseAdmin
    .from('supply_guide_items')
    .insert({
      school_id:    input.school_id,
      grade:        input.grade,
      subject:      input.subject || null,
      item_name:    input.item_name.trim(),
      product_code: input.product_code?.trim().toUpperCase() || null,
      isbn:         input.isbn?.trim() || null,
      edition:      input.edition?.trim() || null,
      publisher:    input.publisher?.trim() || null,
      brand:        input.brand?.trim() || null,
      avg_price:    input.avg_price ?? null,
      retailers:    input.retailers ?? [],
    })
    .select('*')
    .single();

  if (error || !data) {
    console.error('[marketplace] supply guide item insert error:', error?.message);
    return { success: false, error: error?.message ?? 'Failed to create item.' };
  }
  return { success: true, item: data };
}

export async function deleteSupplyGuideItem(id: number, school_id: number): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('supply_guide_items')
    .delete()
    .eq('id', id)
    .eq('school_id', school_id);
  if (error) return { success: false, error: 'Failed to delete item.' };
  return { success: true };
}

// ── Student supply removals ("I already have this") ────────────

export async function fetchStudentRemovals(student_id: number): Promise<Set<number>> {
  const { data, error } = await supabaseAdmin
    .from('student_supply_removals')
    .select('supply_guide_item_id')
    .eq('student_id', student_id);
  if (error || !data) return new Set();
  return new Set(data.map(d => d.supply_guide_item_id));
}

export async function toggleStudentRemoval(
  student_id: number,
  supply_guide_item_id: number
): Promise<{ removed: boolean }> {
  const { data: existing } = await supabaseAdmin
    .from('student_supply_removals')
    .select('id')
    .eq('student_id', student_id)
    .eq('supply_guide_item_id', supply_guide_item_id)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin.from('student_supply_removals').delete().eq('id', existing.id);
    return { removed: false };
  }
  await supabaseAdmin.from('student_supply_removals').insert({ student_id, supply_guide_item_id });
  return { removed: true };
}
