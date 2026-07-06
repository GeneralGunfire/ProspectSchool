import {
  MessageSquare, FileSpreadsheet, StickyNote, Phone, Mail, AlertTriangle, FileText, Paperclip,
} from './icons';

// The "before" state: a cluttered pile of mismatched paper/spreadsheet/chat
// scraps, scattered and overlapping at random tilts — the opposite of
// DashboardPreview's clean, organized collage. Same footprint (max-w-135
// aspect-4/5) so the two states can occupy the same box and flip between
// each other. Deliberately overcrowded and overlapping — the density itself
// is the joke; a tidy "messy" collage would undercut the point.

const scraps: Array<{
  className: string;
  rotate: number;
  z: number;
  content: React.ReactNode;
}> = [
  // Background stack — plain paper sheets peeking out, pure depth filler
  { className: 'left-[14%] top-[2%] w-36 h-44', rotate: -3, z: 1,
    content: <div className="bg-white rounded-md shadow-md h-full border border-stone-200/70" /> },
  { className: 'right-[8%] top-[10%] w-32 h-40', rotate: 5, z: 2,
    content: <div className="bg-white rounded-md shadow-md h-full border border-stone-200/70" /> },
  { className: 'left-[36%] top-[54%] w-36 h-40', rotate: 8, z: 1,
    content: <div className="bg-white rounded-md shadow-md h-full border border-stone-200/70" /> },

  {
    className: 'left-[4%] top-[6%] w-40',
    rotate: -9,
    z: 10,
    content: (
      <div className="bg-white rounded-lg shadow-lg p-3 border border-stone-200">
        <div className="flex items-center gap-1.5 mb-2">
          <FileSpreadsheet className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <p className="text-[9px] font-bold text-stone-500 truncate">marks_TERM2_FINAL_v3(2).xlsx</p>
        </div>
        <div className="space-y-1">
          {[80, 65, 50].map((w, i) => (
            <div key={i} className="h-1.5 bg-stone-100 rounded-full" style={{ width: `${w}%` }} />
          ))}
        </div>
        <p className="text-[8px] text-red-400 font-bold mt-2">#REF! error, row 34</p>
      </div>
    ),
  },
  {
    className: 'right-[1%] top-[-2%] w-36',
    rotate: 7,
    z: 32,
    content: (
      <div className="bg-[#dcf8c6] rounded-2xl rounded-tr-sm shadow-lg p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <MessageSquare className="w-3 h-3 text-stone-600 shrink-0" />
          <p className="text-[9px] font-black text-stone-700">Parents Grp (84)</p>
        </div>
        <p className="text-[10px] text-stone-700 leading-snug">"Where do I find my son's marks??"</p>
      </div>
    ),
  },
  {
    className: 'left-[30%] top-[14%] w-32',
    rotate: 14,
    z: 42,
    content: (
      <div className="bg-yellow-100 shadow-lg p-3" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 94%, 90% 100%, 0 100%)' }}>
        <StickyNote className="w-3 h-3 text-yellow-700 mb-1" />
        <p className="text-[10px] font-bold text-stone-700 leading-snug">Call Mrs. Naidoo re: G10 timetable clash</p>
      </div>
    ),
  },
  {
    className: 'right-[16%] top-[18%] w-40',
    rotate: -15,
    z: 20,
    content: (
      <div className="bg-white rounded-lg shadow-lg p-3 border border-stone-200">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <p className="text-[9px] font-black text-stone-600">Inbox (247 unread)</p>
        </div>
        <p className="text-[10px] font-bold text-stone-700">Re: Re: Fwd: Past papers?</p>
        <p className="text-[9px] text-stone-400 mt-0.5">3 attachments · 2 conflicting replies</p>
      </div>
    ),
  },
  {
    className: 'left-[46%] top-[6%] w-28',
    rotate: -20,
    z: 45,
    content: (
      <div className="bg-pink-100 shadow-lg p-2.5" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 85% 100%, 0 100%)' }}>
        <p className="text-[9px] font-black text-stone-700 leading-snug">FIX SPREADSHEET BEFORE FRIDAY</p>
      </div>
    ),
  },
  {
    className: 'left-[0%] top-[36%] w-44',
    rotate: 5,
    z: 15,
    content: (
      <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-red-200">
        <div className="flex items-center gap-1.5 mb-1">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <p className="text-[9px] font-black text-red-500">DOUBLE-BOOKED</p>
        </div>
        <p className="text-[10px] text-stone-600">Hall — Assembly + Test, same slot</p>
      </div>
    ),
  },
  {
    className: 'right-[-2%] top-[38%] w-34',
    rotate: -19,
    z: 36,
    content: (
      <div className="bg-white rounded-full shadow-lg px-4 py-2.5 flex items-center gap-2">
        <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0 animate-pulse" />
        <p className="text-[10px] font-bold text-stone-600 whitespace-nowrap">14 missed calls</p>
      </div>
    ),
  },
  {
    className: 'left-[20%] top-[48%] w-36',
    rotate: 17,
    z: 28,
    content: (
      <div className="bg-white rounded-2xl rounded-tl-sm shadow-lg p-3 border border-stone-200">
        <p className="text-[9px] font-black text-stone-500 mb-1">Teacher WhatsApp</p>
        <p className="text-[10px] text-stone-700 leading-snug">"Anyone have this term's timetable? Mine's outdated"</p>
      </div>
    ),
  },
  {
    className: 'left-[16%] top-[60%] w-40',
    rotate: -7,
    z: 25,
    content: (
      <div className="bg-white shadow-lg p-3 border border-stone-200">
        <div className="flex items-center gap-1.5 mb-1.5">
          <FileText className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <p className="text-[9px] font-bold text-stone-500">Bursary_list_2026_FINAL.pdf</p>
        </div>
        <p className="text-[10px] text-stone-400 italic">printed · lost · reprinted</p>
      </div>
    ),
  },
  {
    className: 'right-[20%] top-[58%] w-36',
    rotate: 12,
    z: 12,
    content: (
      <div className="bg-white rounded-lg shadow-lg p-3 border border-stone-200">
        <Paperclip className="w-3.5 h-3.5 text-stone-400 mb-1 shrink-0" />
        <p className="text-[10px] font-bold text-stone-600">7 spreadsheets, 3 versions each</p>
      </div>
    ),
  },
  {
    className: 'right-[2%] top-[70%] w-32',
    rotate: -11,
    z: 22,
    content: (
      <div className="bg-white rounded-lg shadow-lg p-2.5 border border-stone-200">
        <p className="text-[9px] font-black text-stone-600">Class list.docx</p>
        <p className="text-[9px] text-stone-400">Last edited: someone, sometime</p>
      </div>
    ),
  },
  {
    className: 'left-[6%] top-[78%] w-44',
    rotate: 4,
    z: 18,
    content: (
      <div className="bg-[#dcf8c6] rounded-2xl rounded-tl-sm shadow-lg p-3">
        <p className="text-[10px] text-stone-700 leading-snug">"Please resend the form, I lost it"</p>
        <p className="text-[9px] text-stone-500 mt-1">— sent to 5 different group chats</p>
      </div>
    ),
  },
  {
    className: 'left-[40%] top-[80%] w-32',
    rotate: -13,
    z: 24,
    content: (
      <div className="bg-yellow-100 shadow-lg p-2.5" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 94%, 90% 100%, 0 100%)' }}>
        <p className="text-[9px] font-bold text-stone-700 leading-snug">Which pin was student 4021 again?</p>
      </div>
    ),
  },
  {
    className: 'right-[6%] top-[84%] w-40',
    rotate: 9,
    z: 14,
    content: (
      <div className="bg-white rounded-lg shadow-lg p-3 border border-stone-200">
        <div className="flex items-center gap-1.5 mb-1">
          <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <p className="text-[9px] font-black text-stone-600">Sent: 6:47am</p>
        </div>
        <p className="text-[10px] text-stone-500">"apologies, wrong attachment again"</p>
      </div>
    ),
  },
];

export const ChaosCollage = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-3xl opacity-40"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(220,38,38,0.14), transparent 65%)' }}
      />
      {/* Coffee-ring stain — the physical-clutter cherry on top */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[52%] top-[30%] w-24 h-24 rounded-full border-[6px] border-amber-900/10"
        style={{ zIndex: 8 }}
      />
      {scraps.map((s, i) => (
        <div
          key={i}
          className={`absolute ${s.className}`}
          style={{ zIndex: s.z, rotate: `${s.rotate}deg` }}
        >
          {s.content}
        </div>
      ))}
    </div>
  );
};
