/**
 * Site-wide copy for twinlink.eu. Facts (organisation, partners, events) come from the current
 * twinlink.eu site; the wording is new and written for this site in a plain, direct voice.
 * House style: short sentences, no jargon where a normal word works.
 */

export const site = {
  name: 'twinlink.eu',
  tagline: 'Find it. Try it. Reuse it.',
  description:
    'twinlink.eu is a non-profit that collects working local digital twins, the parts they are made of and the know-how behind them, so every town can try them and reuse them.',
  org: {
    legal: 'twinlink.eu', // TO CONFIRM exact legal name of the foundation
    street: 'Serpelingstraat 13',
    postcode: '7559 HG Hengelo',
    country: 'The Netherlands',
    kvk: '99953625',
    rsin: '869202042',
    pic: '865141158',
  },
  linkedin: 'https://www.linkedin.com/company/twinlink-eu/',
};

export const nav = [
  { label: 'Explore', href: '/explore' },
  { label: 'Digital twins', href: '/digital-twins' },
  { label: 'Tools', href: '/tools' },
  { label: 'Projects', href: '/projects' },
  { label: 'Knowledge', href: '/knowledge' },
  { label: 'Resources', href: '/resources' },
  { label: 'Team', href: '/team' },
  { label: 'About', href: '/about' },
];

export const home = {
  seo: {
    title: 'twinlink.eu | Find, try and reuse local digital twins',
    description: site.description,
  },
  hero: {
    eyebrow: 'Open local digital twins',
    headline: 'Every town shouldn’t have to build its twin from scratch.',
    body: 'We gather working digital twins, the parts behind them and what we learned building them. Open them, try them, take what you need.',
    searchLabel: 'What are you looking for?',
    searchPlaceholder: 'Try “heat”, “solar” or “Aadorp”',
    primary: { label: 'Try a twin now', href: '#try' },
    secondary: { label: 'Browse everything', href: '/explore' },
  },
  map: {
    label: 'The link map',
    hint: 'Everything on twinlink.eu, linked by theme. Pick a theme or click a dot.',
    all: 'All',
  },
  try: {
    eyebrow: 'Try it now',
    headline: 'Less reading. More clicking.',
    body: 'These are real prototypes, running in your browser. Open one and look around.',
  },
  themes: { eyebrow: 'Start with a question', headline: 'What are you trying to figure out?' },
  categories: { eyebrow: 'The shelves', headline: 'Five shelves, one place.' },
  ecosystem: {
    eyebrow: 'Built once, used everywhere',
    headline: 'A part made in one town can travel.',
    body: 'Twins stay local. The parts they are made of can move up a level, so the next town finds them.',
    levels: [
      { label: 'Your town', title: 'A local twin', body: 'Made for one place and its decisions.' },
      { label: 'Your country', title: 'National LDT App Store', body: 'The national shelf where good parts are labelled and shared.', href: '/explore/national-ldt-app-store' },
      { label: 'Europe', title: 'EU LDT Toolbox', body: 'The European shelf, reachable from every country.', href: '/explore/eu-ldt-toolbox' },
    ],
  },
  audiences: {
    eyebrow: 'Where to begin',
    headline: 'Pick the door that is yours.',
    items: [
      { title: 'I work for a city or region', body: 'See what a twin can show you about your streets, homes and energy.', href: '/digital-twins', cta: 'Open a twin' },
      { title: 'I coordinate a national programme', body: 'Line up local efforts so they add up across the country.', href: '/tools', cta: 'See the tools' },
      { title: 'I do research', body: 'Bring your methods and models, and take ours.', href: '/knowledge', cta: 'Read and watch' },
      { title: 'I build software', body: 'Make parts others can plug in, using shared agreements.', href: '/resources', cta: 'See the agreements' },
    ],
  },
  partners: {
    eyebrow: 'Who we work with',
    headline: 'Good company',
    items: [
      { name: 'University of Twente', role: 'Research on maps, geo-data and digital twins.' },
      { name: 'TNO', role: 'Energy systems and decision models.' },
      { name: 'Esri Nederland', role: 'GIS technology for map-based twins.' },
      { name: 'SmartCity IoT', role: 'Sensors and city data.' },
      { name: 'Gemeente Almelo', role: 'Testing twins at neighbourhood scale.' },
      { name: 'GATE Institute', role: 'Research on urban twins and smart buildings.' },
    ],
  },
  news: {
    eyebrow: 'Lately',
    headline: 'What’s happening',
    items: [
      { title: 'GeoSofia Conference', body: 'We present our twin work in Sofia, together with partners.', when: '2026', status: 'Upcoming' },
      { title: 'EU LDT Toolbox', body: 'Our starter kit, offered to Europe as a ready-made recipe.', when: 'Ongoing', status: 'Ongoing' },
      { title: 'University of Twente', body: 'Open twin foundations, brought into research and teaching.', when: '2026', status: 'Ongoing' },
      { title: 'MIM8', body: 'Every project, the same shared language.', when: 'In progress', status: 'In progress' },
    ],
  },
  closing: {
    headline: 'Got a place that needs a twin?',
    body: 'Tell us about it. Cities, researchers and builders are all welcome.',
    cta: { label: 'Get in touch', href: '/contact' },
  },
};

export const about = {
  seo: { title: 'About | twinlink.eu', description: 'twinlink.eu is an independent non-profit that collects open local digital twins and the parts behind them.' },
  eyebrow: 'About us',
  headline: 'We make the second twin easier than the first.',
  body: 'twinlink.eu is an independent non-profit from Hengelo. We collect open local digital twins, the parts they are built from and the lessons learned, and share them so public bodies across Europe can decide better, sooner.',
  why: [
    { title: 'Decide on facts', body: 'Test a plan against real data before committing to it.' },
    { title: 'Get there faster', body: 'Start from parts that already work, not from a blank page.' },
    { title: 'Stay free to choose', body: 'Open parts mean you are never stuck with one supplier.' },
    { title: 'Keep people’s trust', body: 'Clear rules on who uses which data, and why.' },
  ],
  faq: [
    { q: 'What does twinlink.eu actually do?', a: 'We gather working twins, reusable parts and know-how, and help towns and regions use them.' },
    { q: 'What kind of parts do you collect?', a: 'Data sets, connectors, dashboards, models and tools: anything that saves the next project time.' },
    { q: 'Is it free?', a: 'We are a non-profit. Our aim is to keep knowledge, tools and collaboration open to local governments and their partners.' },
    { q: 'Do you only work in the Netherlands?', a: 'We started in Twente and work across Europe, linking local projects to national and European efforts.' },
    { q: 'How do I join in?', a: 'Get in touch. You can bring a project, try our tools or help build new ones.' },
  ],
};

export const contact = {
  seo: { title: 'Contact | twinlink.eu', description: 'Talk to twinlink.eu about a local digital twin, a project or working together.' },
  eyebrow: 'Contact',
  headline: 'Tell us about your place.',
  body: 'A street, a village, a region: whatever you are trying to decide, we are happy to think along.',
  topics: [
    { title: 'Working together', body: 'For towns, regions, researchers and builders who want to make or share a twin.' },
    { title: 'Knowledge and projects', body: 'For questions about our twins, tools, videos or how to get started.' },
  ],
};
