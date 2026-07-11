import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ChevronLeft, ChevronRight,
  Calculator, Atom, FlaskConical, Briefcase, TrendingUp,
  Monitor, Pencil, Languages, BookOpen, type LucideIcon,
  Lock,
} from 'lucide-react';
import { subjects } from '../data/subjects';
import QuizBlock, { type QuizQuestion } from '../../../components/QuizBlock';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

type Step = 'subject' | 'grade' | 'content';

interface SubjectMeta {
  Icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  pill: string;
}

const SUBJECT_META: Record<string, SubjectMeta> = {
  'algebra':           { Icon: Calculator,  color: 'text-stone-700', bg: 'bg-stone-100', border: 'border-stone-200', pill: 'bg-stone-100 text-stone-700' },
  'geometry':          { Icon: Calculator,  color: 'text-stone-700', bg: 'bg-stone-100', border: 'border-stone-200', pill: 'bg-stone-100 text-stone-700' },
  'phys-sci':          { Icon: Atom,        color: 'text-stone-700', bg: 'bg-stone-100', border: 'border-stone-200', pill: 'bg-stone-100 text-stone-700' },
  'life-sci':          { Icon: FlaskConical,color: 'text-stone-700', bg: 'bg-stone-100', border: 'border-stone-200', pill: 'bg-stone-100 text-stone-700' },
  'accounting':        { Icon: Calculator,  color: 'text-stone-700', bg: 'bg-stone-100', border: 'border-stone-200', pill: 'bg-stone-100 text-stone-700' },
  'business-studies':  { Icon: Briefcase,   color: 'text-stone-700', bg: 'bg-stone-100', border: 'border-stone-200', pill: 'bg-stone-100 text-stone-700' },
  'economics':         { Icon: TrendingUp,  color: 'text-stone-700', bg: 'bg-stone-100', border: 'border-stone-200', pill: 'bg-stone-100 text-stone-700' },
  'cat':               { Icon: Monitor,     color: 'text-stone-700', bg: 'bg-stone-100', border: 'border-stone-200', pill: 'bg-stone-100 text-stone-700' },
  'egd':               { Icon: Pencil,      color: 'text-stone-700', bg: 'bg-stone-100', border: 'border-stone-200', pill: 'bg-stone-100 text-stone-700' },
  'english-hl':        { Icon: Languages,   color: 'text-stone-700', bg: 'bg-stone-100', border: 'border-stone-200', pill: 'bg-stone-100 text-stone-700' },
  'default':           { Icon: BookOpen,    color: 'text-stone-400', bg: 'bg-stone-100', border: 'border-stone-100', pill: 'bg-stone-100 text-stone-500' },
};

const subjectsWithContent = new Set(['algebra', 'phys-sci', 'life-sci', 'accounting', 'business-studies', 'economics', 'cat', 'egd']);

const ALGEBRA_G10_TOPICS: Record<number, string[]> = {
  1: ['Linear Equations', 'Simultaneous Equations'],
};
const PHYSCI_G10_TOPICS: Record<number, string[]> = {
  1: ['Waves, Sound & Light', 'Atoms & Subatomic Particles', 'Classification of Matter', 'Periodic Table Trends', 'Chemical Bonding'],
};
const LIFESCI_G10_TOPICS: Record<number, string[]> = {
  1: ['Biodiversity & Classification', 'Five Kingdoms', 'Taxonomy & Binomial Nomenclature', 'The Species Concept'],
};
const ACCOUNTING_G10_TOPICS: Record<number, string[]> = {
  1: ['Introduction to Accounting', 'The Accounting Equation', 'Double-Entry System', 'Source Documents', 'Journals in Accounting', 'The General Ledger'],
};
const BIZSTUDIES_G10_TOPICS: Record<number, string[]> = {
  1: ['Business Environment', 'Business Sectors', 'Business Stakeholders', 'Business Operations'],
};
const ECONOMICS_G10_TOPICS: Record<number, string[]> = {
  1: ['The Economic Problem', 'Production Possibility Curve', 'Economic Systems', 'Circular Flow Model', 'Factors of Production'],
};
const CAT_G10_TOPICS: Record<number, string[]> = {
  1: ['Computer Systems', 'File Management', 'Word Processing', 'Spreadsheets'],
};
const EGD_G10_TOPICS: Record<number, string[]> = {
  1: ['Drawing Instruments & Equipment'],
};

const PHYSCI_G10_T1_PAGES: AppPage[] = ['learning-physci-g10-t1-waves','learning-physci-g10-t1-atoms','learning-physci-g10-t1-classification','learning-physci-g10-t1-periodic-table','learning-physci-g10-t1-bonding'];
const LIFESCI_G10_T1_PAGES: AppPage[] = ['learning-lifesci-g10-t1-biodiversity','learning-lifesci-g10-t1-five-kingdoms','learning-lifesci-g10-t1-taxonomy','learning-lifesci-g10-t1-species'];
const ACCOUNTING_G10_T1_PAGES: AppPage[] = ['learning-accounting-g10-t1-intro','learning-accounting-g10-t1-equation','learning-accounting-g10-t1-double-entry','learning-accounting-g10-t1-source-documents','learning-accounting-g10-t1-journals','learning-accounting-g10-t1-ledger'];
const BIZSTUDIES_G10_T1_PAGES: AppPage[] = ['learning-bizstudies-g10-t1-environment','learning-bizstudies-g10-t1-sectors','learning-bizstudies-g10-t1-stakeholders','learning-bizstudies-g10-t1-operations'];
const ECONOMICS_G10_T1_PAGES: AppPage[] = ['learning-economics-g10-t1-problem','learning-economics-g10-t1-ppc','learning-economics-g10-t1-systems','learning-economics-g10-t1-circular-flow','learning-economics-g10-t1-factors'];
const CAT_G10_T1_PAGES: AppPage[] = ['learning-cat-g10-t1-computer-systems','learning-cat-g10-t1-file-management','learning-cat-g10-t1-word-processing','learning-cat-g10-t1-spreadsheets'];
const EGD_G10_T1_PAGES: AppPage[] = ['learning-egd-g10-t1-drawing-instruments'];

function getTopicsAndPages(subjectId: string | null, grade: number | null, term: number | null): { names: string[]; pages: AppPage[] } {
  if (subjectId === 'algebra'          && grade === 10 && term === 1) return { names: ALGEBRA_G10_TOPICS[1],      pages: ['learning-algebra-g10-t1-linear-equations', 'learning-algebra-g10-t1-simultaneous'] };
  if (subjectId === 'phys-sci'         && grade === 10 && term === 1) return { names: PHYSCI_G10_TOPICS[1],       pages: PHYSCI_G10_T1_PAGES };
  if (subjectId === 'life-sci'         && grade === 10 && term === 1) return { names: LIFESCI_G10_TOPICS[1],      pages: LIFESCI_G10_T1_PAGES };
  if (subjectId === 'accounting'       && grade === 10 && term === 1) return { names: ACCOUNTING_G10_TOPICS[1],   pages: ACCOUNTING_G10_T1_PAGES };
  if (subjectId === 'business-studies' && grade === 10 && term === 1) return { names: BIZSTUDIES_G10_TOPICS[1],   pages: BIZSTUDIES_G10_T1_PAGES };
  if (subjectId === 'economics'        && grade === 10 && term === 1) return { names: ECONOMICS_G10_TOPICS[1],    pages: ECONOMICS_G10_T1_PAGES };
  if (subjectId === 'cat'              && grade === 10 && term === 1) return { names: CAT_G10_TOPICS[1],          pages: CAT_G10_T1_PAGES };
  if (subjectId === 'egd'              && grade === 10 && term === 1) return { names: EGD_G10_TOPICS[1],          pages: EGD_G10_T1_PAGES };
  return { names: [], pages: [] };
}

// ── Section quiz data (mixed questions shown on the topic-list page) ──────────
const SECTION_QUIZZES: Record<string, QuizQuestion[]> = {
  'algebra-10-1': [
    { q: 'Solve for x: 3x + 7 = 22', options: ['x = 3', 'x = 5', 'x = 7', 'x = 9'], answer: 1, explanation: '3x = 15 → x = 5. Check: 3(5)+7 = 22 ✓' },
    { q: 'Simultaneous equations are used when:', options: ['One equation, one unknown', 'Two equations, two unknowns that must both be satisfied', 'Finding the square root', 'Working with percentages'], answer: 1, explanation: 'Simultaneous equations have two unknowns. The solution satisfies BOTH equations at the same time.' },
    { q: 'Solve for x: x − 2 = 8', options: ['x = 6', 'x = 8', 'x = 10', 'x = 16'], answer: 2, explanation: 'Add 2 to both sides: x = 10. Check: 10 − 2 = 8 ✓' },
    { q: 'Using substitution: y = 2x and x + y = 9. What is x?', options: ['x = 2', 'x = 3', 'x = 4', 'x = 6'], answer: 1, explanation: 'Substitute: x + 2x = 9 → 3x = 9 → x = 3. Then y = 6.' },
    { q: 'A linear equation in one variable has:', options: ['No solution', 'Two solutions', 'Exactly one solution', 'Infinitely many'], answer: 2, explanation: 'A linear equation like 2x + 3 = 7 has exactly one solution.' },
    { q: 'Solve: x + y = 7 and x − y = 1. What is x?', options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'], answer: 1, explanation: 'Adding both equations: 2x = 8 → x = 4. Then y = 3.' },
    { q: 'Why verify your answer by substitution?', options: ["It's optional", 'To confirm the value satisfies the original equation', 'To find a second solution', 'Required only for fractions'], answer: 1, explanation: 'Substituting back into the original equation confirms correctness. It also earns method marks in exams.' },
  ],
  'accounting-10-1': [
    { q: 'The accounting equation is:', options: ['Assets = Liabilities − Equity', 'Assets = Equity + Liabilities', 'Equity = Assets + Liabilities', 'Liabilities = Equity − Assets'], answer: 1, explanation: 'Assets = Equity + Liabilities. Everything owned is funded by the owner or creditors.' },
    { q: 'What is the primary purpose of a source document?', options: ['Calculate profit', 'Original written evidence of a transaction', 'Record ledger entries', 'Prepare financial statements'], answer: 1, explanation: 'A source document is the original proof a transaction occurred — the starting point of the accounting cycle.' },
    { q: 'In double-entry, every transaction requires:', options: ['One debit only', 'One credit only', 'At least one debit and one credit of equal value', 'Two debits'], answer: 2, explanation: 'Every transaction affects at least two accounts — one debited, one credited by the same amount.' },
    { q: 'Which journal records all credit sales to debtors?', options: ['Cash Receipts Journal', 'Debtors Journal', 'Creditors Journal', 'General Journal'], answer: 1, explanation: 'The Debtors Journal (DJ) records credit sales. The source document is the invoice.' },
    { q: 'After posting, Cash shows debits R15 000 and credits R9 000. The balance is:', options: ['R6 000 credit', 'R24 000 debit', 'R6 000 debit', 'R9 000 credit'], answer: 2, explanation: 'R15 000 − R9 000 = R6 000 debit. Assets normally have debit balances.' },
    { q: 'DEAD CLIC helps remember that debits increase:', options: ['Liabilities, Income, Capital', 'Expenses, Assets, Drawings', 'Revenue, Equity, Cash', 'Creditors, Loans, Overdraft'], answer: 1, explanation: 'DEAD = Debits increase Expenses, Assets, Drawings. CLIC = Credits increase Liabilities, Income, Capital.' },
    { q: 'The business entity concept means:', options: ['Owner and business share one account', 'Business finances are kept separate from the owner\'s personal finances', 'Only companies keep records', 'Government owns part of every business'], answer: 1, explanation: 'The business entity concept requires strict separation of business and personal finances.' },
  ],
  'phys-sci-10-1': [
    { q: 'In a transverse wave, particles vibrate:', options: ['Parallel to wave direction', 'Perpendicular to wave direction', 'In circles', 'They do not move'], answer: 1, explanation: 'Transverse wave particles move at right angles to wave propagation. Longitudinal (sound) particles move parallel.' },
    { q: 'A wave has f = 200 Hz and λ = 1.5 m. Its speed is:', options: ['133 m/s', '200 m/s', '300 m/s', '1.5 m/s'], answer: 2, explanation: 'v = fλ = 200 × 1.5 = 300 m/s.' },
    { q: 'Which subatomic particle determines the element?', options: ['Neutron', 'Electron', 'Proton', 'Nucleus'], answer: 2, explanation: 'The number of protons (atomic number) defines the element.' },
    { q: 'Neutrons = ?', options: ['Atomic number', 'Mass number + atomic number', 'Mass number − atomic number', 'Number of electrons'], answer: 2, explanation: 'Neutrons = Mass number − Atomic number.' },
    { q: 'Which is a pure substance?', options: ['Salt water', 'Air', 'Gold (Au)', 'Muddy water'], answer: 2, explanation: 'Gold contains only one type of particle. The others are mixtures.' },
    { q: 'Across a period, atomic radius:', options: ['Increases', 'Stays the same', 'Decreases', 'First increases then decreases'], answer: 2, explanation: 'Atomic radius decreases across a period — increased nuclear charge pulls electrons closer.' },
    { q: 'A covalent bond forms when:', options: ['A metal transfers electrons to a non-metal', 'Two non-metals share electrons', 'Two metals bond', 'Ions attract each other'], answer: 1, explanation: 'Covalent bonds form by electron sharing between non-metals. Examples: H₂O, CO₂.' },
  ],
  'life-sci-10-1': [
    { q: 'Which taxonomic level is the MOST specific?', options: ['Kingdom', 'Order', 'Genus', 'Species'], answer: 3, explanation: 'Species is most specific. Members can interbreed and produce fertile offspring.' },
    { q: 'Which kingdom is prokaryotic?', options: ['Fungi', 'Protista', 'Monera', 'Plantae'], answer: 2, explanation: 'Monera (bacteria) are the only prokaryotes — no membrane-bound nucleus.' },
    { q: 'Binomial nomenclature is written as:', options: ['genus species (both caps)', 'GENUS SPECIES', 'Genus species (genus capitalised)', 'genus SPECIES'], answer: 2, explanation: 'Correct format: Genus (capital) + species (lowercase), both italicised or underlined.' },
    { q: 'A mule (horse × donkey) is sterile. This means:', options: ['Horse and donkey are the same species', 'Horse and donkey are different species', 'Mules reproduce slowly', 'Mules are a new species'], answer: 1, explanation: 'Same species = interbreed + produce FERTILE offspring. Sterile offspring = different species.' },
    { q: 'Ecosystem diversity refers to:', options: ['Variation in genes', 'Variety of species in one area', 'Variety of habitats and biomes', 'Number of individuals'], answer: 2, explanation: 'Ecosystem diversity = variety of different habitats, ecosystems and ecological processes.' },
    { q: 'Carolus Linnaeus is known for:', options: ['Discovering evolution', 'Developing binomial nomenclature', 'Classifying DNA', 'Naming cells'], answer: 1, explanation: 'Linnaeus (1707–1778) created the two-part naming system used universally today.' },
    { q: 'Fungi differ from Plantae because they:', options: ['Are prokaryotic', 'Photosynthesise', 'Absorb nutrients heterotrophically', 'Have cellulose cell walls'], answer: 2, explanation: 'Fungi are heterotrophs that absorb nutrients from dead or living matter. Their cell walls contain chitin, not cellulose.' },
  ],
  'business-studies-10-1': [
    { q: 'Which environment has factors a business DIRECTLY controls?', options: ['Macro', 'Market', 'Micro', 'Natural'], answer: 2, explanation: 'The micro environment = internal factors the business controls (resources, staff, processes).' },
    { q: 'The primary sector involves:', options: ['Manufacturing goods', 'Providing services', 'Extracting natural resources', 'Retail trade'], answer: 2, explanation: 'Primary sector extracts from nature: mining, farming, fishing, forestry.' },
    { q: 'An INTERNAL stakeholder is:', options: ['A bank lending money', 'A customer', 'An employee', 'The local community'], answer: 2, explanation: 'Internal stakeholders are inside the business: employees, owners, managers.' },
    { q: 'The "4 Ps" of marketing are:', options: ['People, Profit, Performance, Planning', 'Product, Price, Place, Promotion', 'Production, Personnel, Procurement, Planning', 'Profit, Product, Process, People'], answer: 1, explanation: 'The marketing mix: Product, Price, Place, Promotion.' },
    { q: 'A new minimum wage law affects which environment?', options: ['Micro', 'Market', 'Macro', 'Competitor'], answer: 2, explanation: 'Government legislation is a macro (PESTEL) factor — uncontrollable by the business.' },
    { q: 'Stakeholder conflict arises when:', options: ['The business grows', 'Different stakeholders have competing interests', 'The business is profitable', 'All stakeholders are employees'], answer: 1, explanation: 'E.g. shareholders want profit; employees want higher wages. These interests clash.' },
    { q: 'A bakery converting flour into bread belongs to:', options: ['Primary sector', 'Secondary sector', 'Tertiary sector', 'Primary and tertiary'], answer: 1, explanation: 'Manufacturing/processing raw materials into finished goods = secondary sector.' },
  ],
  'economics-10-1': [
    { q: 'Scarcity in economics means:', options: ['Resources gone forever', 'Limited resources vs unlimited wants', 'Only poor countries face this', 'Not enough money'], answer: 1, explanation: 'Scarcity = limited resources vs unlimited human wants. This forces all economic agents to make choices.' },
    { q: 'You study instead of watching TV. The opportunity cost is:', options: ['Cost of textbooks', 'Time spent studying', 'Satisfaction given up from TV', 'The grade earned'], answer: 2, explanation: 'Opportunity cost = value of the next best alternative foregone (the TV enjoyment you gave up).' },
    { q: 'A point INSIDE the PPC represents:', options: ['Full efficiency', 'Unattainable production', 'Underutilised resources', 'Economic growth'], answer: 2, explanation: 'Inside the PPC = inefficiency. Resources are unemployed or wasted.' },
    { q: 'In a market economy, decisions are made by:', options: ['Government', 'Private individuals through price signals', 'International organisations', 'Central planners'], answer: 1, explanation: 'Market economies rely on price signals and private decisions, with minimal government intervention.' },
    { q: 'The reward for LABOUR is:', options: ['Rent', 'Interest', 'Wages/Salary', 'Profit'], answer: 2, explanation: 'Land → Rent, Labour → Wages, Capital → Interest, Entrepreneurship → Profit.' },
    { q: 'An INJECTION into the circular flow is:', options: ['Savings', 'Taxes', 'Imports', 'Government spending'], answer: 3, explanation: 'Injections (IGX): Investment, Government spending, Exports. Leakages (STI): Savings, Taxes, Imports.' },
    { q: 'The PPC shifts OUTWARD due to:', options: ['War destroying factories', 'Natural disaster', 'New technology increasing productivity', 'Rising unemployment'], answer: 2, explanation: 'Outward shift = economic growth — more resources, better technology, improved skills.' },
  ],
  'cat-10-1': [
    { q: 'What does the CPU do?', options: ['Stores data permanently', 'Displays output', 'Processes instructions and calculations', 'Connects to internet'], answer: 2, explanation: 'The CPU fetches, decodes and executes instructions. It is the "brain" of the computer.' },
    { q: 'RAM is volatile. This means:', options: ['It is read-only', 'It loses data when power is off', 'It stores the OS permanently', 'It is slower than ROM'], answer: 1, explanation: 'RAM (Random Access Memory) is volatile — all data is lost when the computer is switched off.' },
    { q: 'Cell B3 in a spreadsheet refers to:', options: ['Row B, Column 3', 'Column B, Row 3', 'Third cell in the document', 'Sheet B, Page 3'], answer: 1, explanation: 'Spreadsheet notation: letter = column, number = row. B3 = Column B, Row 3.' },
    { q: 'The correct SUM formula for A1 to A10 is:', options: ['=ADD(A1:A10)', '=SUM(A1-A10)', '=SUM(A1:A10)', '=TOTAL(A1,A10)'], answer: 2, explanation: 'Colon (:) means a range. =SUM(A1:A10) adds all cells from A1 to A10.' },
    { q: 'Ctrl + B in a word processor:', options: ['Saves the document', 'Makes text italic', 'Makes text bold', 'Underlines text'], answer: 2, explanation: 'Ctrl + B = Bold. Ctrl + I = Italic. Ctrl + U = Underline. Ctrl + S = Save.' },
    { q: 'The top-level folder in a file system is the:', options: ['Desktop', 'Root directory', 'Home folder', 'System folder'], answer: 1, explanation: 'The root directory is the top-level container. All folders and files branch from it (C:\\ on Windows, / on Linux).' },
    { q: 'Justified alignment means text is:', options: ['Left-aligned only', 'Right-aligned only', 'Centred', 'Aligned to both left and right margins'], answer: 3, explanation: 'Justified spreads text so both edges are straight — used in books and formal documents.' },
  ],
  'egd-10-1': [
    { q: 'Which instrument draws circles in technical drawing?', options: ['Set square', 'Protractor', 'Compass', 'T-square'], answer: 2, explanation: 'A compass draws circles and arcs of precise radii. The needle sits at the centre point.' },
    { q: 'A thick continuous line represents:', options: ['A hidden edge', 'A centre line', 'A visible outline or edge', 'A cutting plane'], answer: 2, explanation: 'Thick continuous lines show visible edges/outlines. Dashed = hidden. Chain = centre line.' },
    { q: 'Construction lines should be drawn:', options: ['Dark and permanent', 'Lightly so they can be erased', 'In red pencil', 'With a ruler only'], answer: 1, explanation: 'Construction lines are light and erasable. Final lines are drawn dark and definitive over them.' },
    { q: 'A T-square is used to draw:', options: ['Circles', 'Angles', 'Horizontal lines', 'Curves'], answer: 2, explanation: 'The T-square draws horizontal lines and acts as a base guide for set squares to draw verticals and angles.' },
    { q: 'A centre line uses:', options: ['Thick continuous lines', 'Dashed lines', 'Alternating long-short dashes (chain)', 'Dotted lines'], answer: 2, explanation: 'Centre lines use the chain line type: long dash – short dash – long dash.' },
  ],
};

function getSectionQuiz(subjectId: string | null, grade: number | null, term: number | null): QuizQuestion[] {
  const key = `${subjectId}-${grade}-${term}`;
  // Normalise key separators
  const normKey = key.replace('phys-sci', 'phys-sci').replace('life-sci', 'life-sci').replace('business-studies', 'business-studies');
  return SECTION_QUIZZES[normKey] ?? [];
}

function getTermTopics(subjectId: string | null, grade: number | null, term: number): string[] {
  if (subjectId === 'algebra'          && grade === 10) return ALGEBRA_G10_TOPICS[term] ?? [];
  if (subjectId === 'phys-sci'         && grade === 10) return PHYSCI_G10_TOPICS[term] ?? [];
  if (subjectId === 'life-sci'         && grade === 10) return LIFESCI_G10_TOPICS[term] ?? [];
  if (subjectId === 'accounting'       && grade === 10) return ACCOUNTING_G10_TOPICS[term] ?? [];
  if (subjectId === 'business-studies' && grade === 10) return BIZSTUDIES_G10_TOPICS[term] ?? [];
  if (subjectId === 'economics'        && grade === 10) return ECONOMICS_G10_TOPICS[term] ?? [];
  if (subjectId === 'cat'              && grade === 10) return CAT_G10_TOPICS[term] ?? [];
  if (subjectId === 'egd'              && grade === 10) return EGD_G10_TOPICS[term] ?? [];
  return [];
}

function StudyLibraryPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Allow learning pages to deep-link back to the topic list
  const returnCtx = (() => {
    try { return JSON.parse(sessionStorage.getItem('library_return') ?? 'null'); } catch { return null; }
  })();
  if (returnCtx) sessionStorage.removeItem('library_return');

  const [step, setStep] = useState<Step>(returnCtx ? 'content' : 'subject');
  const [imgLoaded, setImgLoaded] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(returnCtx?.subjectId ?? null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(returnCtx?.grade ?? null);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(returnCtx?.term ?? null);

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentSubjectName = subjects.find(s => s.id === selectedSubject)?.name ?? '';
  const currentMeta = SUBJECT_META[selectedSubject ?? ''] ?? SUBJECT_META['default'];
  const coreSubjects = filteredSubjects.filter(s => s.category === 'Core');
  const electiveSubjects = filteredSubjects.filter(s => s.category === 'Elective');

  const goBack = () => {
    if (step === 'grade') setStep('subject');
    else if (step === 'content') setStep('grade');
  };


  return (
    <div className="student-home min-h-full pb-16">

      {step === 'subject' && (
        <>
          {/* ═══ Hero — full-width crested banner ═══════════════════ */}
          <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
            <div className="absolute inset-0 pointer-events-none">
              <motion.img src="/images/nizamiye-library.png" alt=""
                onLoad={() => setImgLoaded(true)}
                initial={{ opacity: 0 }} animate={{ opacity: imgLoaded ? 0.62 : 0 }}
                transition={{ duration: 0.6, ease }}
                className="w-full h-full object-cover" />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(100deg, rgba(21,23,28,0.82) 0%, rgba(21,23,28,0.62) 35%, rgba(21,23,28,0.3) 62%, rgba(21,23,28,0.66) 100%)' }} />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(21,23,28,0.05) 0%, transparent 35%, rgba(21,23,28,0.75) 100%)' }} />
            </div>
            <div className="absolute -bottom-32 -left-24 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-[0.08] pointer-events-none"
              style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />

            <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full">
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease }}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">Study Library</p>
                <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[36px] mt-2 leading-[1.1]" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
                  What are you studying?
                </h1>
                <p className="text-[13px] text-white/60 mt-2.5 font-medium max-w-md">
                  Lessons, worked examples and quizzes for every topic — pick a subject to get started.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8 pb-10">

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, ease }}
              className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search subjects…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded border text-[15px] text-brand-dark placeholder:text-stone-400 outline-none transition-all"
                style={{ borderColor: 'var(--color-brand-border)', background: '#fff', fontSize: '16px' }}
              />
            </motion.div>

            {filteredSubjects.length === 0 ? (
              <div className="paper-card rounded p-5 sm:p-7 py-20 text-center">
                <p className="text-[16px] font-semibold text-brand-dark mb-1">No subjects found</p>
                <p className="text-[13px] text-[rgba(31,36,33,0.4)]">Try a different search term.</p>
              </div>
            ) : (() => {
              const available = filteredSubjects.filter(s => subjectsWithContent.has(s.id));
              const comingSoon = filteredSubjects.filter(s => !subjectsWithContent.has(s.id));

              const SubjectCard = ({ subject, index }: { subject: typeof filteredSubjects[0]; index: number }) => {
                const hasContent = subjectsWithContent.has(subject.id);
                const meta = SUBJECT_META[subject.id] ?? SUBJECT_META['default'];
                const Icon = meta.Icon;
                return (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.035, 0.3) + 0.1, duration: 0.3, ease }}
                    onClick={() => { if (!hasContent) return; setSelectedSubject(subject.id); setStep('grade'); }}
                    disabled={!hasContent}
                    whileTap={hasContent ? { scale: 0.98 } : {}}
                    className={`paper-card relative flex flex-col items-start gap-4 p-5 rounded text-left ${
                      hasContent ? 'cursor-pointer group' : 'cursor-default opacity-50'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      hasContent ? 'group-hover:scale-105' : ''
                    }`}
                    style={hasContent ? { background: 'var(--color-accent)' } : { background: 'var(--color-paper-raise)' }}>
                      <Icon className={`w-5 h-5 ${hasContent ? 'text-white' : 'text-stone-300'}`} />
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0 w-full">
                      <p className={`text-[15px] font-semibold leading-snug ${hasContent ? 'text-brand-dark' : 'text-stone-300'}`} style={{ letterSpacing: '-0.01em' }}>
                        {subject.name}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end w-full">
                      {!hasContent && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-300 mr-auto">
                          <Lock className="w-2.5 h-2.5" /> Soon
                        </span>
                      )}
                      {hasContent && (
                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:translate-x-0.5 transition-all" style={{ color: 'var(--color-accent)' }} />
                      )}
                    </div>
                  </motion.button>
                );
              };

              return (
                <div className="space-y-8">
                  {available.length > 0 && (
                    <section>
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)] mb-4">
                        Available Now
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {available.map((s, i) => <SubjectCard key={s.id} subject={s} index={i} />)}
                      </div>
                    </section>
                  )}
                  {comingSoon.length > 0 && (
                    <section>
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.3)] mb-4 flex items-center gap-2">
                        <Lock className="w-2.5 h-2.5" /> Coming Soon
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {comingSoon.map((s, i) => <SubjectCard key={s.id} subject={s} index={available.length + i} />)}
                      </div>
                    </section>
                  )}
                </div>
              );
            })()}
          </div>
        </>
      )}

      {/* ── Grade / topic steps — narrow content column ─────────── */}
      {step !== 'subject' && (
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 pb-16">
      <AnimatePresence mode="wait">

          {/* ── Grade selection ── */}
          {step === 'grade' && (
            <motion.div
              key="grade"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-xl"
            >
              {/* Back */}
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-stone-400 hover:text-stone-800 transition-colors mb-6 group"
              >
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> All Subjects
              </button>

              {/* Subject hero */}
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="rounded p-6 mb-6 flex items-center gap-4 relative overflow-hidden"
                style={{
                  background: 'var(--color-brand-dark)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.25), 0 10px 24px -8px rgba(0,0,0,0.35), 0 28px 48px -20px rgba(0,0,0,0.4)',
                }}
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-25 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />
                <div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center shrink-0 relative z-10">
                  <currentMeta.Icon className="w-6 h-6 text-white" />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-0.5">Selected subject</p>
                  <p className="text-xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>{currentSubjectName}</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-5">
                <h2 className="text-[20px] font-semibold text-brand-dark" style={{ letterSpacing: '-0.02em' }}>Select your grade</h2>
                <p className="text-[13px] text-stone-500 mt-1">Grade 10 fully available · Grades 11 & 12 coming soon</p>
              </motion.div>

              <div className="grid grid-cols-3 gap-3">
                {[10, 11, 12].map((grade, i) => {
                  const isAvailable = grade === 10;
                  return (
                    <motion.button
                      key={grade}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.3, ease }}
                      onClick={() => { if (!isAvailable) return; setSelectedGrade(grade); setSelectedTerm(1); setStep('content'); }}
                      disabled={!isAvailable}
                      whileTap={isAvailable ? { scale: 0.97 } : {}}
                      className={`paper-card flex flex-col items-center justify-center gap-1.5 py-8 rounded ${
                        isAvailable ? 'cursor-pointer group' : 'cursor-default opacity-50'
                      }`}
                    >
                      <p className={`text-[32px] font-black leading-none transition-colors ${isAvailable ? 'text-brand-dark' : 'text-stone-200'}`} style={{ letterSpacing: '-0.04em' }}>
                        {grade}
                      </p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${isAvailable ? 'text-stone-400' : 'text-stone-200'}`}>
                        {isAvailable ? 'Grade' : 'Soon'}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Topic list ── */}
          {step === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="max-w-xl"
            >
              {/* Back */}
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-stone-400 hover:text-stone-800 transition-colors mb-6 group"
              >
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Grade {selectedGrade}
              </button>

              {(() => {
                const { names: topicNames, pages: topicPages } = getTopicsAndPages(selectedSubject, selectedGrade, selectedTerm);
                const quizQuestions = getSectionQuiz(selectedSubject, selectedGrade, selectedTerm);
                const quizKey = `${selectedSubject}-${selectedGrade}-${selectedTerm}-section`;

                if (topicNames.length > 0) {
                  return (
                    <div className="space-y-5">
                      {/* Hero header — dark card */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded p-6 relative overflow-hidden"
                        style={{
                          background: 'var(--color-brand-dark)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.25), 0 10px 24px -8px rgba(0,0,0,0.35), 0 28px 48px -20px rgba(0,0,0,0.4)',
                        }}
                      >
                        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none"
                          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />
                        <div className="flex items-start justify-between gap-4 relative z-10">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-2">
                              Grade {selectedGrade} · Term {selectedTerm}
                            </p>
                            <h2 className="text-[22px] font-semibold text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
                              {currentSubjectName}
                            </h2>
                            <p className="text-[13px] text-white/50 mt-1">
                              {topicNames.length} topic{topicNames.length !== 1 ? 's' : ''} · Lesson, worked example & quiz per topic
                            </p>
                          </div>
                          <div className="w-12 h-12 rounded flex items-center justify-center shrink-0 bg-white/10">
                            <currentMeta.Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </motion.div>

                      {/* Topic cards */}
                      <div className="space-y-2.5">
                        {topicNames.map((name, i) => (
                          <motion.button
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 + i * 0.045, duration: 0.3, ease }}
                            onClick={() => onNavigate(topicPages[i])}
                            whileTap={{ scale: 0.98 }}
                            className="paper-card w-full flex items-center gap-4 px-5 py-5 rounded text-left group"
                          >
                            <div className="w-10 h-10 rounded flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                              style={{ background: 'var(--color-accent)' }}>
                              <span className="text-[14px] font-bold text-white">{i + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[15px] font-semibold text-brand-dark leading-snug" style={{ letterSpacing: '-0.01em' }}>{name}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                {['Lesson', 'Worked example', 'Practice'].map((tag, t) => (
                                  <span key={t} className="text-[10px] font-bold uppercase tracking-[0.1em] text-stone-400">
                                    {t > 0 && <span className="mr-1.5 text-stone-200">·</span>}{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all shrink-0" style={{ color: 'var(--color-accent)' }} />
                          </motion.button>
                        ))}
                      </div>

                      {/* Section quiz */}
                      {quizQuestions.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 + topicNames.length * 0.045 }}>
                          <QuizBlock
                            storageKey={quizKey}
                            questions={quizQuestions}
                            shuffle
                          />
                        </motion.div>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded p-6 relative overflow-hidden"
                      style={{
                        background: 'var(--color-brand-dark)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.25), 0 10px 24px -8px rgba(0,0,0,0.35), 0 28px 48px -20px rgba(0,0,0,0.4)',
                      }}>
                      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none"
                        style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />
                      <div className="relative z-10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-2">
                          {currentSubjectName} · Grade {selectedGrade}
                        </p>
                        <h2 className="text-[22px] font-semibold text-white" style={{ letterSpacing: '-0.02em' }}>
                          Coming soon
                        </h2>
                        <p className="text-[13px] text-white/50 mt-2">
                          Study materials for Grade {selectedGrade} are in development. Check back soon.
                        </p>
                      </div>
                    </motion.div>
                    <motion.button
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
                      onClick={() => setStep('subject')}
                      className="paper-card w-full flex items-center justify-between px-5 py-4 rounded transition-all group text-left"
                    >
                      <div>
                        <p className="text-[14px] font-semibold text-brand-dark">Browse other subjects</p>
                        <p className="text-[12px] text-[rgba(31,36,33,0.4)] mt-0.5 font-medium">See what's already available</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:translate-x-0.5 transition-all" style={{ color: 'var(--color-accent)' }} />
                    </motion.button>
                  </div>
                );
              })()}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      )}
    </div>
  );
}

export default StudyLibraryPage;
