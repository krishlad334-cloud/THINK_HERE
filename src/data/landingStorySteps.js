import {
  AlertCircle,
  Lightbulb,
  MessageSquare,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';

export const TYPED_THOUGHT =
  '“I want to pivot our pricing model, but every blog says something different. What should I actually do?”';

export const STORY_STEPS = [
  {
    num: '01',
    emotion: 'Stress & Overload',
    accent: '#F472B6',
    icon: AlertCircle,
    title: 'Overthinking & Mental Noise',
    desc: 'You sit alone late at night with a big decision—replaying doubts, worrying about the wrong move, and feeling stuck.',
    chips: ['“What if it fails?”', '“Am I missing something?”', '“Too much at stake”'],
  },
  {
    num: '02',
    emotion: 'Frustration',
    accent: '#A855F7',
    icon: Search,
    title: 'Searching Everywhere Without Answers',
    desc: 'You jump across Google, forums, YouTube videos, and generic AI chats—scrolling for hours, yet nothing fits your real context.',
    chips: ['Google threads', 'Contradicting videos', 'Zero practical roadmap'],
  },
  {
    num: '03',
    emotion: 'Hope',
    accent: '#5EEAD4',
    icon: Sparkles,
    title: 'Discovering OverThink & Sharing Your Thought',
    desc: 'You open OverThink, drop your messy situation into one private brief in 60 seconds, and immediately lift the mental weight.',
    isTyping: true,
  },
  {
    num: '04',
    emotion: 'Guidance',
    accent: '#5EEAD4',
    icon: Users,
    title: 'Real Consultant or AI Tailored Guidance',
    desc: 'Choose a vetted human domain specialist, instant AI deep synthesis, or both—getting ground-level advice built for your exact situation.',
    isChoice: true,
  },
  {
    num: '05',
    emotion: 'Refinement',
    accent: '#A855F7',
    icon: MessageSquare,
    title: '1-on-1 Follow-Up & Plan Refinement',
    desc: 'Ask follow-up questions, challenge assumptions, and tailor every detail inside your private 1-on-1 room until the plan fits your exact constraints.',
    dialogue: [
      { who: 'You', text: '“What if our budget caps at $5k/mo?”' },
      {
        who: 'Specialist',
        text: '“Switch to the 2-tier launch first—cuts burn by 60% while keeping trial conversion high.”',
      },
    ],
  },
  {
    num: '06',
    emotion: 'Success & Relief',
    accent: '#FACC15',
    icon: Lightbulb,
    title: 'Clear 24h Solution & Confident Action',
    desc: 'Within 24 hours you have a step-by-step action plan saved in your workspace—execute with confidence, solve the problem, and move forward relieved.',
    checklist: [
      'Root bottleneck diagnosed clearly',
      'Prioritized 14-day action roadmap',
      'Saved in your workspace for anytime review',
    ],
  },
];
