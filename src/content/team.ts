/**
 * The twinlink.eu team, as on the current site (twinlink.eu/our-team, November 2026).
 * Photos: src/assets/team/<photo>.jpg. To add someone, add an entry here and drop the photo in.
 */
export interface Person {
  name: string;
  role: string;
  bio: string;
  email: string;
  linkedin: string;
  photo: string;
}

const li = (name: string) => `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(name)}`;

export const team: { id: string; title: string; people: Person[] }[] = [
  {
    id: 'board',
    title: 'Board',
    people: [
      { name: 'Dr. Yashar Hajimolana', role: 'Chair of the Board', bio: 'Energy Systems Integration & Circular Solutions Expert. Bridge-builder between research, industry and innovation.', email: 'info@twinlink.eu', linkedin: li('Yashar Hajimolana'), photo: 'yashar' },
      { name: 'Dr. Mila Koeva', role: 'Treasurer of the Board', bio: 'Vice Dean of Research and Associate Professor in the field of 3D city digital twins and geospatial technologies.', email: 'info@twinlink.eu', linkedin: li('Mila Koeva'), photo: 'mila' },
      { name: 'Bram Reinders MSc', role: 'Board Secretary', bio: 'International business developer and impact maker in the sustainable energy sector, with a focus on collaboration, innovation and scaling.', email: 'info@twinlink.eu', linkedin: li('Bram Reinders'), photo: 'bram' },
    ],
  },
  {
    id: 'core',
    title: 'Core team',
    people: [
      { name: 'Stéphanie Reinders', role: 'Operational Director', bio: 'Experienced business developer. Currently pursuing a Master’s in Business Administration at VU Amsterdam and supporting the operational development of twinlink.eu.', email: 'stephanie.reinders@twinlink.eu', linkedin: li('Stéphanie Reinders'), photo: 'stephanie' },
      { name: 'Kadambari Dakshindas MSc', role: 'Geospatial Developer', bio: 'Geospatial Developer working on geospatial technologies, BIM, 3D City Models, and digital twin solutions to support sustainable data-driven decision-making.', email: 'kadambari.dakshindas@twinlink.eu', linkedin: li('Kadambari Dakshindas'), photo: 'kadambari' },
      { name: 'Joan Waithira Njoroge MSc', role: 'Digital Twin Developer', bio: 'Digital twin developer working on open, interoperable and scalable local digital twin solutions for data-driven planning and decision support.', email: 'joan.njoroge@twinlink.eu', linkedin: li('Joan Waithira Njoroge'), photo: 'joan' },
      { name: 'Rakibun Athid MSc', role: 'Digital Transformation Lead', bio: 'Drives the adoption of digital technologies, digital twins, data platforms, and geospatial systems across the organisation, translating technical capability into operational value.', email: 'rakibun.athid@twinlink.eu', linkedin: li('Rakibun Athid'), photo: 'rakib' },
    ],
  },
  {
    id: 'interns',
    title: 'Interns',
    people: [
      { name: 'Panisa Kia Mohammedi', role: 'Energy Modelling Intern', bio: 'Energy modelling intern supporting local digital twin use cases with energy-system modelling, scenario analysis and sustainable transition insights.', email: 'info@twinlink.eu', linkedin: li('Panisa Kia Mohammedi'), photo: 'panisa' },
      { name: 'Naim Fardous Shezan', role: 'Local Digital Twin Intern', bio: 'Intern working on local digital twin applications for wind turbine placement near Almelo, focusing on noise modelling, visual impact assessment, scenario simulation, and community engagement.', email: 'info@twinlink.eu', linkedin: li('Naim Fardous Shezan'), photo: 'shezan' },
    ],
  },
];

export const teamPage = {
  seo: { title: 'Team | twinlink.eu', description: 'The people behind twinlink.eu: board, core team and interns.' },
  eyebrow: 'Team',
  headline: 'The people behind twinlink.eu.',
  intro: 'A small team of builders, researchers and organisers, with a board that keeps us on course.',
  join: {
    headline: 'Join the twinlink.eu team',
    body: 'We are looking for technical experts who want to contribute to open, interoperable and scalable local digital twin solutions.',
    cta: { label: 'Get in touch', href: '/contact' },
  },
};
