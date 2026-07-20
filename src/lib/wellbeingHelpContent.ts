// ── Wellbeing self-help content library ────────────────────────────────────
// Single source of truth for all student-facing self-help content — the
// always-accessible "Wellbeing Tools" page AND the post-check-in screen both
// render from this file, which is what makes "not gated behind a check-in"
// structurally true rather than just a UI claim.
//
// Content design constraints (research: .planning/research/
// WELLBEING_HELP_EXPANSION_RESEARCH.md sections 1, 2, 6):
//   - Grade 7-8 reading level, short sentences, minimal jargon.
//   - Each micro-tool: 2-5 minutes.
//   - Lightweight — text only, no images/animations required to work.
//   - Normalising, non-stigmatising tone throughout ("for every learner").
//
// Static reference content, no per-student personalisation, no admin UI
// requested — kept as a typed constants file (same pattern as
// wellbeingCrisisResources.ts) rather than a DB table: type-safe, git-
// reviewable, zero runtime queries. Edit this file + redeploy to change
// content.

export interface MicroTool {
  id: string;
  title: string;
  durationMinutes: number;
  steps: string[];
}

export type HelpTopicId =
  | 'exam_stress'
  | 'low_mood'
  | 'worry_anxiety'
  | 'sleep'
  | 'friendship_family'
  | 'body_image';

export interface HelpTopic {
  id: HelpTopicId;
  label: string;
  intro: string;              // 3-5 sentences, normalising
  psychoeducation: string;    // short explanation, plain language
  microTools: MicroTool[];    // 2-3 per topic
  keepHappeningBox: string;   // when to talk to an adult, how
  talkToSomeoneBox: string;   // 1-2 sentence conversation-starter script
}

export const NORMALISING_MESSAGE =
  "Thanks for checking in. Everyone has ups and downs. Below are some tools that can help on tough days — and you can come back to them anytime, even if you didn't fill in a check-in today.";

export const HELP_HUB_INTRO =
  "These tools are here for any learner, whether you're having a rough week or just want to learn skills to handle stress.";

export const START_HERE_TOOLS: MicroTool[] = [
  {
    id: 'calm-your-body',
    title: 'Calm your body in 2 minutes',
    durationMinutes: 2,
    steps: [
      'Sit comfortably and let your shoulders drop.',
      'Breathe in slowly through your nose for 4 counts.',
      'Hold for 4 counts.',
      'Breathe out slowly through your mouth for 6 counts.',
      'Repeat 5-6 times, letting your breath slow down each round.',
    ],
  },
  {
    id: 'reset-a-moment',
    title: 'Reset a stressful moment',
    durationMinutes: 3,
    steps: [
      'Name 5 things you can see around you.',
      'Name 4 things you can touch or feel.',
      'Name 3 things you can hear.',
      'Name 2 things you can smell.',
      'Name 1 thing you can taste.',
      'Notice how your body feels now compared to when you started.',
    ],
  },
  {
    id: 'sleep-better-this-week',
    title: 'Sleep better this week',
    durationMinutes: 3,
    steps: [
      'Tip 1: Put your phone somewhere out of reach 30 minutes before bed.',
      'Tip 2: Try to wake up at the same time every day, even on weekends.',
      'Tip 3: If your mind is busy, write down what\'s on it in a few words before you turn off the light.',
      'Small challenge: Try just one of these tonight and notice how you feel tomorrow.',
    ],
  },
  {
    id: 'mind-shouting',
    title: 'When your mind is shouting',
    durationMinutes: 1,
    steps: [
      'Notice the thought that keeps repeating.',
      'Say to yourself: "I\'m having the thought that…" before the worry, instead of just thinking the worry.',
      'This small shift reminds you that a thought is just a thought, not a fact.',
    ],
  },
  {
    id: 'one-small-step',
    title: 'Pick one small step',
    durationMinutes: 2,
    steps: [
      'Think of one thing that\'s been weighing on you.',
      'Break it into the smallest possible next step — something that takes less than 10 minutes.',
      'Do just that one small step today. That\'s enough for now.',
    ],
  },
];

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'exam_stress',
    label: 'Exam stress / school pressure',
    intro:
      "Feeling stressed about tests and schoolwork is really common — it doesn't mean you're not capable. A bit of stress can even help you focus, but too much makes it harder to think clearly.",
    psychoeducation:
      "When you're stressed, your body reacts like there's a threat, even though a test isn't dangerous. This can make your mind go blank or your body feel tense. Learning to calm your body down helps your brain work better, not worse.",
    microTools: [
      {
        id: 'exam-breathing',
        title: 'Breathe before you start',
        durationMinutes: 2,
        steps: [
          'Before opening the test or starting to study, take 5 slow breaths.',
          'Breathe in for 4, out for 6.',
          'Remind yourself: "I\'ve prepared. I\'ll do my best with what I know."',
        ],
      },
      {
        id: 'exam-chunking',
        title: 'Break study into chunks',
        durationMinutes: 3,
        steps: [
          'Pick one small topic instead of "studying everything."',
          'Set a timer for 20 minutes and focus on just that topic.',
          'Take a 5 minute break — stand up, stretch, get water.',
          'Repeat with the next topic.',
        ],
      },
      {
        id: 'exam-thought-check',
        title: 'Check the worry thought',
        durationMinutes: 3,
        steps: [
          'Write down the worry, e.g. "I\'m going to fail."',
          'Ask: "Is this definitely true, or is it my stress talking?"',
          'Write one more balanced thought, e.g. "I\'ve studied some of this. I can only do my best."',
        ],
      },
    ],
    keepHappeningBox:
      "If exam stress is affecting your sleep, appetite, or making you dread school most days, it's worth talking to your homeroom teacher or a parent/guardian — they can help you find extra support.",
    talkToSomeoneBox:
      '"I\'ve been really stressed about tests lately and it\'s hard to manage." — a good way to open up to a teacher or parent.',
  },
  {
    id: 'low_mood',
    label: 'Low mood / motivation',
    intro:
      "Feeling flat, tired, or like nothing feels interesting isn't laziness — it happens to a lot of people, especially during busy or hard times. There are small things that can help, even when it feels hard to start.",
    psychoeducation:
      "Low mood can lower your energy and make things you used to enjoy feel pointless. This is a common and treatable pattern, not a character flaw. Doing one small, achievable thing — even if you don't feel like it — can help shift things gradually.",
    microTools: [
      {
        id: 'lowmood-one-thing',
        title: 'Do one small thing',
        durationMinutes: 5,
        steps: [
          'Pick one tiny activity you used to enjoy, or something simple like tidying one shelf.',
          'Don\'t wait to "feel like it" — just start the small action.',
          'Notice afterward how you feel, even a little different.',
        ],
      },
      {
        id: 'lowmood-movement',
        title: 'Move your body for 5 minutes',
        durationMinutes: 5,
        steps: [
          'Step outside or find some open space.',
          'Walk, stretch, or do any movement you like for 5 minutes.',
          'Notice your surroundings as you move — sounds, air, colours.',
        ],
      },
      {
        id: 'lowmood-connect',
        title: 'Reach out to one person',
        durationMinutes: 3,
        steps: [
          'Think of one person you trust.',
          'Send them a short message or say hi in person — it doesn\'t have to be about how you feel.',
          'Small connections can make a heavy day feel a bit lighter.',
        ],
      },
    ],
    keepHappeningBox:
      "If low mood lasts more than two weeks, or you're having thoughts of hopelessness, please tell your homeroom teacher or a parent/guardian. You don't have to wait until it feels unbearable to ask for support.",
    talkToSomeoneBox:
      '"I\'ve been feeling really flat/tired lately and I\'m not sure why." — a simple way to start the conversation.',
  },
  {
    id: 'worry_anxiety',
    label: 'Worry / anxiety',
    intro:
      "Worry can feel like your mind won't switch off, or your body feels on edge for no clear reason. This is your body's alarm system working overtime — it doesn't mean something is wrong with you.",
    psychoeducation:
      "Anxiety is your brain trying to protect you from danger, even when there isn't real danger present. Learning to notice and calm this alarm system is a skill anyone can practise, and it gets easier with repetition.",
    microTools: [
      {
        id: 'worry-grounding',
        title: 'Ground yourself',
        durationMinutes: 3,
        steps: [
          'Plant both feet flat on the floor.',
          'Press your feet down and notice the floor beneath you.',
          'Slowly look around and name 3 things you can see.',
          'Take one slow breath before continuing your day.',
        ],
      },
      {
        id: 'worry-time',
        title: 'Give worry a time slot',
        durationMinutes: 5,
        steps: [
          'When a worry pops up, jot it down on paper or your phone.',
          'Tell yourself: "I\'ll think about this later, at my worry time."',
          'Pick a set 5-10 minutes later in the day to look back at the list — most worries feel smaller by then.',
        ],
      },
      {
        id: 'worry-box-breathing',
        title: 'Box breathing',
        durationMinutes: 2,
        steps: [
          'Breathe in for 4 counts.',
          'Hold for 4 counts.',
          'Breathe out for 4 counts.',
          'Hold for 4 counts.',
          'Repeat the square 4-5 times.',
        ],
      },
    ],
    keepHappeningBox:
      "If worry is stopping you from sleeping, eating, going to school, or joining in with friends, please talk to your homeroom teacher or a parent/guardian — this is very manageable with the right support.",
    talkToSomeoneBox:
      '"I\'ve been feeling really anxious/on edge and it\'s hard to switch off." — a good way to open up.',
  },
  {
    id: 'sleep',
    label: 'Sleep',
    intro:
      "Struggling to fall asleep, or waking up tired, is really common — especially with school stress or screens late at night. Small, consistent changes usually help more than trying to fix everything at once.",
    psychoeducation:
      "Your body works best with a regular sleep rhythm — going to bed and waking up around the same time. Screens, caffeine, and a busy mind close to bedtime can all make it harder to fall asleep.",
    microTools: [
      {
        id: 'sleep-winddown',
        title: 'Build a 15-minute wind-down',
        durationMinutes: 5,
        steps: [
          'Pick a simple wind-down routine: dim lights, put your phone away, maybe read or stretch.',
          'Do the same routine each night so your body learns "this means sleep time."',
          'Keep it to about 15 minutes so it doesn\'t feel like a chore.',
        ],
      },
      {
        id: 'sleep-braindump',
        title: 'Brain dump before bed',
        durationMinutes: 3,
        steps: [
          'Keep paper or notes app by your bed.',
          'Write down anything on your mind — tasks, worries, ideas.',
          'Tell yourself: "It\'s written down, I can deal with it tomorrow."',
        ],
      },
      {
        id: 'sleep-consistent-wake',
        title: 'Anchor your wake-up time',
        durationMinutes: 2,
        steps: [
          'Pick one wake-up time and try to stick to it, even on weekends.',
          'A consistent wake time helps your body clock more than an early bedtime alone.',
        ],
      },
    ],
    keepHappeningBox:
      "If sleep problems continue for more than 2-3 weeks and are affecting how you feel during the day, mention it to a parent/guardian — sometimes there's more going on that's worth checking.",
    talkToSomeoneBox:
      '"I haven\'t been sleeping well for a while now." — a simple way to raise it with someone you trust.',
  },
  {
    id: 'friendship_family',
    label: 'Friendship / family conflict',
    intro:
      "Conflict with friends or family can feel really heavy, especially when it drags on. It's normal to feel hurt, confused, or stuck — these tools won't fix everything, but they can help you feel steadier.",
    psychoeducation:
      "Conflict is a normal part of relationships, but it can still hurt a lot. Taking a moment to calm down before reacting, and thinking about what you actually want to say, often helps more than reacting in the heat of the moment.",
    microTools: [
      {
        id: 'conflict-pause',
        title: 'Pause before reacting',
        durationMinutes: 2,
        steps: [
          'When you feel a strong reaction coming, take 3 slow breaths before responding.',
          'Ask yourself: "What do I actually want to happen here?"',
          'If you can, give yourself a bit of space before continuing the conversation.',
        ],
      },
      {
        id: 'conflict-write-it',
        title: 'Write out what you want to say',
        durationMinutes: 5,
        steps: [
          'Write down what happened and how it made you feel, without worrying about getting it perfect.',
          'Try starting sentences with "I felt…" rather than "You always…"',
          'This can help you feel clearer before you talk to the person.',
        ],
      },
      {
        id: 'conflict-support',
        title: 'Find one supportive person',
        durationMinutes: 3,
        steps: [
          'Think of one person you trust who isn\'t part of the conflict.',
          'Talk it through with them — sometimes saying it out loud helps you see it differently.',
        ],
      },
    ],
    keepHappeningBox:
      "If conflict at home or with friends is ongoing, or ever feels unsafe, please tell your homeroom teacher or another adult you trust. You deserve support, not just tools to cope alone.",
    talkToSomeoneBox:
      '"Things have been really hard with my friends/family lately." — a simple way to start.',
  },
  {
    id: 'body_image',
    label: 'Body image / self-criticism',
    intro:
      "A lot of people are hard on themselves, especially about how they look or perform. You're not alone in this, and being kinder to yourself is a skill that can be practised.",
    psychoeducation:
      'The way we talk to ourselves affects how we feel. Harsh self-talk ("I\'m so stupid," "I look terrible") can become a habit that feels true even when it isn\'t fair. Noticing and gently challenging this voice can make a real difference over time.',
    microTools: [
      {
        id: 'selfcrit-notice',
        title: 'Notice the harsh voice',
        durationMinutes: 2,
        steps: [
          'When you catch a harsh thought about yourself, pause.',
          'Ask: "Would I say this to a friend?"',
          'If not, try rephrasing it more like you would to someone you care about.',
        ],
      },
      {
        id: 'selfcrit-three-things',
        title: 'Three things going okay',
        durationMinutes: 3,
        steps: [
          'Think of 3 things — big or small — that went okay today or this week.',
          'They don\'t have to be about how you look or perform. "I helped a friend" counts.',
          'Notice how it feels to focus here instead of on what went wrong.',
        ],
      },
      {
        id: 'selfcrit-media-break',
        title: 'Take a short break from comparing',
        durationMinutes: 5,
        steps: [
          'If scrolling social media makes you feel worse about yourself, try a short break — even just for today.',
          'Notice how you feel without it, even a little.',
        ],
      },
    ],
    keepHappeningBox:
      "If self-critical thoughts are constant, or you're changing how you eat because of how you feel about your body, please talk to your homeroom teacher or a parent/guardian — this is common and support really does help.",
    talkToSomeoneBox:
      '"I\'ve been really hard on myself lately, especially about how I look." — a way to open up to someone you trust.',
  },
];

export function getHelpTopic(id: HelpTopicId): HelpTopic | undefined {
  return HELP_TOPICS.find(t => t.id === id);
}
