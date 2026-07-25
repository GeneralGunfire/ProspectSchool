// ── Term 3, Topic 6: Hire Purchase & Financial Applications ──────────────────
// Builds directly on T3.5 (simple/compound interest) — hire purchase uses
// simple-interest-style calculations applied to a deposit+instalments
// structure.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'deposit-forgotten-in-total',
    label: 'Forgetting to include the deposit when calculating the total cost',
    errorType: 'You calculated the total cost using only the instalments, leaving out the deposit paid upfront.',
    principle: 'The TOTAL COST under a hire purchase agreement = deposit + (monthly instalment × number of months). The deposit is a real payment and must be included.',
    correctStep: 'Deposit R2000 + (24 months × R450) = 2000 + 10800 = R12800 total.',
  },
  {
    id: 'interest-calculated-on-full-price-not-balance',
    label: 'Not realising hire purchase interest is calculated on the amount financed, not the full cash price',
    errorType: 'You calculated interest based on the full cash price instead of the amount actually being borrowed (after the deposit).',
    principle: 'Interest in a hire purchase agreement is charged on the AMOUNT FINANCED — the cash price MINUS the deposit — since the deposit is paid upfront and isn\'t part of the loan.',
    correctStep: 'For a R20000 item with a R4000 deposit, interest is calculated on the remaining R16000 financed, not the full R20000.',
  },
  {
    id: 'hire-purchase-vs-cash-not-compared',
    label: 'Not comparing the hire purchase total to the original cash price',
    errorType: 'You calculated the hire purchase total but didn\'t compare it to the cash price to show the extra cost of credit.',
    principle: 'A hire purchase agreement almost always costs MORE than paying cash upfront — the difference (hire purchase total - cash price) represents the cost of credit, and is worth stating explicitly.',
    correctStep: 'If cash price = R15000 and hire purchase total = R18200, the extra cost of buying on credit is R3200.',
  },
  {
    id: 'monthly-instalment-count-error',
    label: 'Miscounting the number of instalments (months vs. years confusion)',
    errorType: 'You used the number of years instead of the number of months (or vice versa) when calculating the total instalments paid.',
    principle: 'Always match the instalment count to its actual frequency — if paying MONTHLY over 3 years, that\'s 36 instalments, not 3.',
    correctStep: 'Monthly instalments over 2 years = 2 × 12 = 24 instalments, not 2.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 3,
  topicId: 'hire-purchase-finance',
  topicName: 'Hire Purchase & Financial Applications',
  prerequisites: [
    'Simple and compound interest (this term, Topic 5)',
  ],
  objectives: [
    { id: 'calculate-hp-total', text: 'Calculate the total cost of a hire purchase agreement, including the deposit.' },
    { id: 'calculate-amount-financed', text: 'Identify the amount financed (cash price minus deposit) for interest calculations.' },
    { id: 'compare-cash-vs-credit', text: 'Compare the total cost of buying on hire purchase to paying the full cash price.' },
    { id: 'read-financial-statements', text: 'Read and extract relevant figures from a simple financial statement or table.' },
  ],
  estimatedMinutes: [20, 30],
};

export const hirePurchaseFinance: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What does "buy now, pay later" actually cost you?',
  goalSettingPrompt:
    'Buying something on hire purchase (deposit + monthly instalments) always costs more than paying cash — this lesson shows you exactly how much more, and how to calculate it precisely.',

  activate: {
    connectPrompt: 'You already know how to calculate simple interest. Hire purchase applies that same idea to a deposit-plus-instalments structure.',
    diagnosticQuestions: [
      { question: 'R5000 at 10% simple interest for 2 years — find the interest.', options: ['R1000', 'R500', 'R5500', 'R100'], correctIndex: 0, explanation: '5000×0.10×2=1000.' },
      { question: 'How many months are in 3 years?', options: ['36', '12', '3', '24'], correctIndex: 0, explanation: '3×12=36.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A HIRE PURCHASE agreement lets you pay a DEPOSIT upfront, then pay off the rest in fixed MONTHLY INSTALMENTS over an agreed period. The TOTAL COST = deposit + (instalment × number of months) — the deposit must always be included, since it\'s a real payment. Always match the instalment count to its actual frequency: monthly instalments over n years means n×12 total instalments.',
    workedExamples: [
      { id: 'wx-hp-total', prompt: 'A fridge costs R2000 deposit, then R350 per month for 24 months. Find the total cost.', steps: [
        { step: 'Instalments total: R350 × 24 = R8400.', justification: 'Multiply the monthly instalment by the number of months.' },
        { step: 'Total cost = deposit + instalments = 2000 + 8400 = R10400.', justification: 'Include the deposit in the total.' },
      ], answer: 'Total cost = R10400' },
    ],
    knowledgeChecks: [
      { question: 'A TV has a R1500 deposit and R400/month for 18 months. What is the total cost?', options: ['R8700', 'R7200', 'R400', 'R9000'], correctIndex: 0, explanation: '(400×18)+1500 = 7200+1500 = 8700.', misconceptionId: 'deposit-forgotten-in-total' },
      { question: 'How many monthly instalments are paid over 2.5 years?', options: ['30', '2.5', '12', '25'], correctIndex: 0, explanation: '2.5×12=30.', misconceptionId: 'monthly-instalment-count-error' },
    ],
    confidenceCheckPrompt: 'How confident do you feel calculating a hire purchase agreement\'s total cost?',
  },

  demonstrateChunk2: {
    explanation:
      'Interest in a hire purchase agreement is calculated on the AMOUNT FINANCED — the cash price MINUS the deposit — since the deposit is paid upfront and isn\'t part of what\'s borrowed. A complete answer should COMPARE the hire purchase total to the original cash price, showing the extra cost of buying on credit. This "cost of credit" is the whole reason interest rates matter to a buyer.',
    workedExamples: [
      { id: 'wx-amount-financed', prompt: 'An item costs R18000 cash. With a R3000 deposit and 10% simple interest per year over 2 years, find the total hire purchase cost.', steps: [
        { step: 'Amount financed = 18000 - 3000 = 15000 (interest is charged on this, not the full R18000).', justification: 'The deposit reduces the amount actually being borrowed.' },
        { step: 'Interest = 15000 × 0.10 × 2 = 3000.', justification: 'Apply simple interest to the amount financed.' },
        { step: 'Total owed (financed amount + interest) = 15000+3000 = 18000. Total hire purchase cost = deposit + this = 3000+18000 = 21000.', justification: 'Add the deposit back in for the full picture.' },
      ], answer: 'Total hire purchase cost = R21000' },
      { id: 'wx-compare-cash-credit', prompt: 'Using the previous example, how much extra does hire purchase cost compared to paying cash?', steps: [
        { step: 'Cash price = R18000. Hire purchase total = R21000.', justification: 'Compare both figures directly.' },
        { step: 'Extra cost of credit = 21000 - 18000 = R3000.', justification: 'This equals the interest paid — the cost of spreading payments over time.' },
      ], answer: 'R3000 extra, compared to paying cash' },
    ],
    knowledgeChecks: [
      { question: 'An item costs R10000 cash, with a R2000 deposit. What amount should interest be calculated on?', options: ['R8000 (the amount financed)', 'R10000 (the full price)', 'R2000 (the deposit)', 'R12000'], correctIndex: 0, explanation: 'Interest applies to the amount financed: 10000-2000=8000.', misconceptionId: 'interest-calculated-on-full-price-not-balance' },
      { question: 'A hire purchase total comes to R14500, while the cash price was R12000. What should you report as the "cost of credit"?', options: ['R2500 extra', 'R14500 total only', 'R12000 only', 'Cannot be determined'], correctIndex: 0, explanation: '14500-12000=2500 — the extra amount paid for buying on credit.', misconceptionId: 'hire-purchase-vs-cash-not-compared' },
    ],
    confidenceCheckPrompt: 'How confident do you feel calculating the amount financed and comparing hire purchase to cash price?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'calculate-hp-total', revealSteps: 1, prompt: 'A laptop has a R2500 deposit and R600/month for 12 months. Find the total cost.', steps: [
        { step: 'Total = 2500 + (600×12) = 2500+7200 = R9700.', justification: 'Deposit plus total instalments.' },
      ], answer: 'Total = R9700' },
      { id: 'fp-partial-1', objectiveId: 'calculate-amount-financed', revealSteps: 1, prompt: 'A car costs R150000 cash, with a R30000 deposit. Find the amount financed.', steps: [
        { step: 'Amount financed = 150000 - 30000.', justification: 'Subtract the deposit from the cash price.' },
        { step: '= R120000.', justification: 'This is what interest would be calculated on.' },
      ], answer: 'R120000' },
      { id: 'fp-independent-1', objectiveId: 'compare-cash-vs-credit', revealSteps: 0, prompt: 'A phone\'s cash price is R8000. On hire purchase, the total (deposit + instalments) comes to R9600. State the extra cost of credit.', steps: [
        { step: 'Extra cost = 9600 - 8000 = R1600.', justification: 'Compare hire purchase total to cash price.' },
      ], answer: 'R1600 extra' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'calculate-hp-total', question: 'A couch has a R1000 deposit and R250/month for 20 months. Find the total cost.', options: ['R6000', 'R5000', 'R250', 'R7000'], correctIndex: 0, hints: { strategic: 'Total = deposit + (instalment × months).', procedural: '1000 + (250×20)', workedStep: '= 1000+5000 = 6000.' }, distractorMisconceptions: { 1: 'deposit-forgotten-in-total' } },
      { id: 'ip-2', objectiveId: 'calculate-amount-financed', question: 'An item costs R25000, with a R5000 deposit. What is the amount financed?', options: ['R20000', 'R25000', 'R5000', 'R30000'], correctIndex: 0, hints: { strategic: 'Cash price minus deposit.', procedural: '25000-5000', workedStep: '= 20000.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'compare-cash-vs-credit', question: 'Cash price R6000, hire purchase total R7350. What is the cost of credit?', options: ['R1350', 'R7350', 'R6000', 'R13350'], correctIndex: 0, hints: { strategic: 'Subtract cash price from hire purchase total.', procedural: '7350-6000', workedStep: '= 1350.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'calculate-hp-total', question: 'How many monthly instalments over 4 years?', options: ['48', '4', '12', '40'], correctIndex: 0, hints: { strategic: 'Months = years × 12.', procedural: '4×12', workedStep: '= 48.' }, distractorMisconceptions: { 1: 'monthly-instalment-count-error' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'calculate-hp-total', multiSelect: false, question: 'A bike has a R800 deposit and R150/month for 15 months. Find the total cost.', options: ['R3050', 'R2250', 'R800', 'R2900'], correctIndices: [0], explanation: '800+(150×15)=800+2250=3050.', distractorMisconceptions: { 1: 'deposit-forgotten-in-total' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'calculate-hp-total', multiSelect: false, question: 'How many monthly instalments over 5 years?', options: ['60', '5', '50', '12'], correctIndices: [0], explanation: '5×12=60.', distractorMisconceptions: { 1: 'monthly-instalment-count-error' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'calculate-amount-financed', multiSelect: false, question: 'An item costs R40000, with a R8000 deposit. Find the amount financed.', options: ['R32000', 'R40000', 'R8000', 'R48000'], correctIndices: [0], explanation: '40000-8000=32000.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'calculate-amount-financed', multiSelect: false, question: 'True or false: hire purchase interest is calculated on the full cash price, not the amount financed.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — interest applies to the amount financed (cash price minus deposit).', distractorMisconceptions: { 0: 'interest-calculated-on-full-price-not-balance' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'compare-cash-vs-credit', multiSelect: false, question: 'Cash price R9000, hire purchase total R10800. Find the cost of credit.', options: ['R1800', 'R10800', 'R9000', 'R19800'], correctIndices: [0], explanation: '10800-9000=1800.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'compare-cash-vs-credit', multiSelect: false, question: 'True or false: hire purchase almost always costs more in total than paying the full cash price upfront.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — the interest charged makes hire purchase more expensive overall.', distractorMisconceptions: {} },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'calculate-hp-total', multiSelect: false, question: 'A washing machine has a R1200 deposit and R280/month for 18 months. Find the total cost.', options: ['R6240', 'R5040', 'R1200', 'R7440'], correctIndices: [0], explanation: '1200+(280×18)=1200+5040=6240.', distractorMisconceptions: {} },
    { id: 'q8', type: 'decimal-discrimination', objectiveId: 'read-financial-statements', multiSelect: false, question: 'A statement shows: Cash price R22000, Deposit R4000, Amount financed R18000, Interest R3600, Total instalments R21600. What is the total hire purchase cost (deposit + instalments)?', options: ['R25600', 'R21600', 'R22000', 'R18000'], correctIndices: [0], explanation: 'Deposit + total instalments = 4000+21600 = 25600.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'calculate-hp-total',
      analogy: 'Think of a hire purchase total as two separate piles of money you hand over: the deposit pile (paid once, upfront) and the instalments pile (the same small amount, paid repeatedly). The total cost is simply both piles added together.',
      explanation: 'Always calculate in this order: (1) instalments total = instalment amount × number of instalments; (2) total cost = deposit + instalments total. Never skip the deposit.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A fridge: R1800 deposit, R320/month for 20 months. Find the total cost.', steps: [
          { step: 'Instalments total = 320×20 = 6400.', justification: 'Multiply instalment by count.' },
          { step: 'Total cost = 1800+6400 = 8200.', justification: 'Add the deposit.' },
        ], answer: 'Total cost = R8200' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'calculate-hp-total', question: 'A stove: R900 deposit, R180/month for 14 months. Find the total cost.', options: ['R3420', 'R2520', 'R900', 'R2700'], correctIndex: 0, hints: { strategic: 'Deposit + (instalment × months).', procedural: '180×14=2520.', workedStep: '900+2520=3420.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'calculate-hp-total', question: 'A computer: R2200 deposit, R410/month for 24 months. Find the total cost.', options: ['R12040', 'R9840', 'R2200', 'R10240'], correctIndex: 0, hints: { strategic: 'Deposit + (instalment × months).', procedural: '410×24=9840.', workedStep: '2200+9840=12040.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'calculate-hp-total', question: 'A bed: R650 deposit, R145/month for 16 months. Find the total cost.', options: ['R2970', 'R2320', 'R650', 'R2900'], correctIndex: 0, hints: { strategic: 'Deposit + (instalment × months).', procedural: '145×16=2320.', workedStep: '650+2320=2970.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why does hire purchase usually cost more than paying cash?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel calculating hire purchase costs now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the first number you should check on any hire purchase agreement?', type: 'multiple-choice', options: ['The deposit', 'The colour of the item', 'The shop\'s name', 'Nothing in particular'] },
  ],
};
