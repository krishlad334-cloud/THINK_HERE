export const TYPED_THOUGHT =
  '“I want to pivot our pricing model, but every blog says something different. What should I actually do?”';

export const STORY_STEPS = [
  {
    num: '01',
    accent: '#F472B6',
    secondaryAccent: '#A855F7',
    title: 'Overthinking & Mental Noise',
    desc: 'You sit alone late at night replaying every doubt—worrying about making the wrong move while your mind spins in circles.',
    pose: 'stressed',
    image: '/images/man-stressed.png?v=6',
    imageAlt: 'Overwhelmed man holding his temples behind his laptop',
    mindThoughts: [
      { id: 's1-a', text: '“What if it fails?”' },
      { id: 's1-b', text: '“Am I missing something?”' },
      { id: 's1-c', text: '“Too much at stake...”' },
    ],
  },
  {
    num: '02',
    accent: '#A855F7',
    secondaryAccent: '#F472B6',
    title: 'Searching Everywhere Without Answers',
    desc: 'You jump across blogs, forums, and generic AI chats for hours—collecting scattered opinions that never fit your real context.',
    pose: 'searching',
    image: '/images/man-searching.png?v=6',
    imageAlt: 'Frustrated man searching across endless tabs on his laptop',
    mindThoughts: [
      { id: 's2-a', text: '14 open tabs · zero clarity' },
      { id: 's2-b', text: 'Contradicting advice everywhere' },
      { id: 's2-c', text: 'Generic AI misses my context' },
    ],
  },
  {
    num: '03',
    accent: '#5EEAD4',
    secondaryAccent: '#A855F7',
    title: 'Putting Your Thought Into Words',
    desc: 'You open OverThink, capture your real situation in 60 seconds, and feel the mental static settle into one clear question.',
    pose: 'typing',
    image: '/images/man-typing.png?v=6',
    imageAlt: 'Man focused and typing his thought onto OverThink',
    isTyping: true,
  },
  {
    num: '04',
    accent: '#5EEAD4',
    secondaryAccent: '#A855F7',
    title: 'Real Consultant or AI Tailored Guidance',
    desc: 'Pick a vetted domain specialist, instant AI deep synthesis, or combine both—for advice built around your exact constraints.',
    pose: 'choosing',
    image: '/images/man-choosing.png?v=6',
    imageAlt: 'Man welcoming guidance from a human specialist or AI',
    isChoice: true,
    choiceOptions: {
      human: {
        title: 'Human Expert',
        thought: '“Talk with someone who has solved this exact pivot.”',
      },
      ai: {
        title: 'AI Solution',
        thought: '“Map risks and pricing scenarios in seconds.”',
      },
    },
  },
  {
    num: '05',
    accent: '#A855F7',
    secondaryAccent: '#5EEAD4',
    title: '1-on-1 Follow-Up & Plan Refinement',
    desc: 'Ask tough follow-up questions and pressure-test every trade-off privately until the plan fits your real budget and timeline.',
    pose: 'refining',
    image: '/images/man-refining.png?v=6',
    imageAlt: 'Man collaborating 1-on-1 to refine and pressure-test his plan',
    dialogue: [
      { who: 'You', text: '“What if budget caps at $5k/mo?”' },
      {
        who: 'Specialist',
        text: '“Launch 2-tier first—cuts burn 60%.”',
      },
    ],
  },
  {
    num: '06',
    accent: '#FACC15',
    secondaryAccent: '#5EEAD4',
    title: 'Clear 24h Solution & Confident Action',
    desc: 'Within 24 hours, the clutter is gone—you hold a concrete, prioritized action plan and move forward with calm certainty.',
    pose: 'relieved',
    image: '/images/man-relieved.png?v=7',
    imageAlt: 'Relieved and smiling man pointing to his temples with a clear mind',
    checklist: [
      'Root bottleneck diagnosed',
      '14-day prioritized roadmap',
      'Actionable in under 24h',
    ],
  },
];
