/**
 * Everything twinlink.eu offers, in one catalogue: digital twins, tools, projects, knowledge
 * and resources. Each item has a type, themes and (where there is one) a live demo that can be
 * tried on the site. The home page, the category pages, the theme pages and the explorer all
 * read from this list, so a new item only has to be added here.
 *
 * Facts (names, demos, status) come from the current twinlink.eu site; all wording is new and
 * written for this site. Items marked TO CONFIRM need a check by the twinlink.eu team.
 */

export type ItemType = 'twin' | 'tool' | 'project' | 'knowledge' | 'resource';
export type ThemeId = 'energy' | 'climate' | 'urban-planning' | 'renovation' | 'mobility' | 'water';
export type Scale = 'building' | 'neighbourhood' | 'city' | 'national' | 'european';

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  summary: string;
  body?: string[];
  features?: string[];
  themes: ThemeId[];
  scale: Scale;
  status?: string;
  /** A live demo that opens inside the site ("Try it"). */
  demo?: string;
  /** An external page (opens in a new tab). */
  link?: string;
  /** A YouTube video id (shown with a click-to-play, privacy-friendly player). */
  video?: string;
  /** A self-hosted video in public/media/: the full film, a short silent loop and a poster. */
  clip?: { src: string; loop: string; poster: string };
  /** Screenshot of the demo in src/assets/demos/ (file name without .png). */
  preview?: string;
  /** Picture in src/assets/geohub/ (file name without .avif). */
  image?: string;
  /** The picture is a logo: shown whole on white, not cropped. */
  logo?: boolean;
  /** Where it happens (city, country or region). */
  place?: string;
  /** Where the example comes from, when it is not a twinlink.eu project. */
  source?: { label: string; url: string };
  /** Papers and project pages behind it. */
  refs?: { label: string; url?: string }[];
  icon: string;
}

export const types: { id: ItemType; label: string; plural: string; href: string; icon: string; intro: string }[] = [
  { id: 'twin', label: 'Digital twin', plural: 'Digital twins', href: '/digital-twins', icon: 'twin', intro: 'Working prototypes. Open one and click around.' },
  { id: 'tool', label: 'Tool', plural: 'Tools', href: '/tools', icon: 'tool', intro: 'Shortcuts, so the next project doesn’t begin with a blank page.' },
  { id: 'project', label: 'Project', plural: 'Projects', href: '/projects', icon: 'project', intro: 'What is on the workbench right now.' },
  { id: 'knowledge', label: 'Knowledge', plural: 'Knowledge', href: '/knowledge', icon: 'knowledge', intro: 'Short reads and videos, written for people who decide, not only for engineers.' },
  { id: 'resource', label: 'Resource', plural: 'Resources', href: '/resources', icon: 'resource', intro: 'The agreements that let one twin talk to another.' },
];

export const themes: { id: ThemeId; label: string; icon: string; intro: string; question: string }[] = [
  { id: 'energy', label: 'Energy', icon: 'energy', question: 'Where does our energy go, and what changes if we switch?', intro: 'Use, forecasts and local energy plans, from one building to a whole street.' },
  { id: 'climate', label: 'Climate & ecology', icon: 'climate', question: 'Which streets get too hot, and where would trees help?', intro: 'Heat, green space and nature, mapped before you plant or pave.' },
  { id: 'urban-planning', label: 'Urban planning', icon: 'planning', question: 'What if we rebuilt this block?', intro: 'Try out a plan on screen before anyone signs it.' },
  { id: 'mobility', label: 'Mobility', icon: 'mobility', question: 'How do people and goods move through our streets?', intro: 'Traffic, walking and logistics, simulated before a road or route changes.' },
  { id: 'water', label: 'Water & waste', icon: 'water', question: 'Where will the water go, and how do we collect waste better?', intro: 'Floods, drainage and waste collection, planned on a map first.' },
  { id: 'renovation', label: 'Building renovation', icon: 'renovation', question: 'Which homes should we insulate first?', intro: 'Building by building, see where a renovation pays off soonest.' },
];

export const scales: Record<Scale, string> = {
  building: 'Building',
  neighbourhood: 'Neighbourhood',
  city: 'City',
  national: 'National',
  european: 'European',
};

const UT_GEOHUB = { label: 'University of Twente · Digital Twin Geohub', url: 'https://www.utwente.nl/en/digital-society/research/digitalisation/digital-twin-geohub/projects/' };

export const items: Item[] = [
  // ---- Digital twins (live demos) ----------------------------------------------------------
  {
    id: 'ai-building-energy-twin',
    type: 'twin',
    icon: 'building',
    title: 'AI Building Energy Digital Twin',
    summary: 'Walk through one building and watch its energy use, past and predicted.',
    body: [
      'Sensors, meters and a 3D model of the building in one screen. It learns from past use to forecast what comes next, and shows each user the view their job needs.',
    ],
    features: ['3D building you can explore', 'Forecasts from past use', 'A view per role', 'Open source'],
    themes: ['energy', 'renovation'],
    scale: 'building',
    status: 'Prototype',
    demo: 'https://ai-building-silk.vercel.app/',
    preview: 'ai-building',
    clip: { src: '/media/bram-house-building-twin.mp4', loop: '/media/bram-house-building-twin-loop.mp4', poster: '/media/bram-house-building-twin.jpg' },
  },
  {
    id: 'aadorp-energy-retrofit-dashboard',
    type: 'twin',
    icon: 'map',
    title: 'Aadorp Energy Retrofit Dashboard',
    summary: 'Aadorp on a 3D globe: pick a house and see what a retrofit could do.',
    body: [
      'Built on Cesium. Each building carries its own energy profile, so residents and the municipality can compare retrofit options side by side.',
      'Part of the Aadorp pilot, where the village tests how a twin can help with homes, redevelopment and shared energy.',
    ],
    features: ['Energy labels A to G per home', 'Solar potential of every roof', 'Simulate a retrofit package'],
    themes: ['energy', 'renovation', 'urban-planning'],
    scale: 'neighbourhood',
    status: 'Pilot',
    demo: 'https://kadambari-17.github.io/Cesium-Energy-Dashboard/',
    preview: 'aadorp',
    clip: { src: '/media/aadorp-energy-twin.mp4', loop: '/media/aadorp-energy-twin-loop.mp4', poster: '/media/aadorp-energy-twin.jpg' },
  },
  {
    id: 'neighbourhood-energy-ecology-twin',
    type: 'twin',
    icon: 'neighbourhood',
    title: 'Neighbourhood Energy & Ecology Twin',
    summary: 'One neighbourhood, two questions at once: how to use less energy and how to stay cool.',
    body: [
      'Energy and nature usually live in separate reports. Here they share one map, so a plan for solar roofs and a plan for shade trees can be tested together.',
    ],
    features: ['Energy and nature on one map', 'What-if scenarios', 'Heat and shade insight', 'Open source'],
    themes: ['energy', 'climate', 'urban-planning'],
    scale: 'neighbourhood',
    status: 'Prototype',
    demo: 'https://a-neighbourhood-scale-urban-digital-twin-for-energy-ecolog.pages.dev/',
    preview: 'neighbourhood',
  },
  {
    id: 'area-redesign-twin',
    type: 'twin',
    icon: 'planning',
    title: 'Area Redesign Digital Twin',
    summary: 'Move a planned building and see, right away, what it does to shade and solar power.',
    body: [
      'Planned blocks sit on an aerial map of the area, between the existing homes and trees. Drag or turn a block and the twin recalculates shading and the solar yield of the roofs around it, for summer, spring and winter.',
      'Sensors in the area feed a live timeline, and every figure says where it comes from and how sure it is. In Dutch and English.',
    ],
    features: ['Move and rotate planned blocks', 'Shading and solar yield, before and after', 'Shadows by season and time of day', 'Live sensor timeline'],
    themes: ['urban-planning', 'energy', 'climate'],
    scale: 'neighbourhood',
    status: 'Prototype',
    clip: { src: '/media/area-redesign-twin.mp4', loop: '/media/area-redesign-twin-loop.mp4', poster: '/media/area-redesign-twin.jpg' },
  },
  {
    id: 'wind-farm-twin',
    type: 'twin',
    icon: 'energy',
    title: 'Wind Farm Digital Twin',
    summary: 'Stand among the turbines before they are built: see them, move them, hear them.',
    body: [
      'A 3D landscape with fields, trees, homes and wind turbines. Fly over it or stand at a viewpoint, change the time of day, and move turbines to try another layout.',
      'A noise heatmap shows how far the sound carries at a chosen sound power, so the conversation with neighbours starts from the same picture. Google 3D tiles can be switched on for the real surroundings.',
    ],
    features: ['Move turbines and compare layouts', 'Noise heatmap by sound power', 'Time of day and VR viewpoints', 'Real surroundings with 3D tiles'],
    themes: ['energy', 'urban-planning'],
    scale: 'neighbourhood',
    status: 'Prototype',
    clip: { src: '/media/wind-farm-twin.mp4', loop: '/media/wind-farm-twin-loop.mp4', poster: '/media/wind-farm-twin.jpg' },
  },

  // ---- Tools ---------------------------------------------------------------------------------
  {
    id: 'esdl-energy-system-editor',
    type: 'tool',
    icon: 'map',
    title: 'ESDL Energy System Editor',
    summary: 'Draw a local energy system on the map, in the open ESDL standard.',
    body: [
      'Place heat pumps, buildings, producers, storage and pipes on a map of the real street, and connect them into one energy system. Everything is saved as ESDL (Energy System Description Language), so other models and tools can read it.',
      'Built on ArcGIS, it brings energy planning and geo-information into one workspace.',
    ],
    features: ['Energy assets on a real map', 'Draw heat networks and connections', 'Saves as open ESDL', 'Works with ArcGIS'],
    themes: ['energy', 'urban-planning'],
    scale: 'neighbourhood',
    status: 'Prototype',
    clip: { src: '/media/esdl-energy-system-editor.mp4', loop: '/media/esdl-energy-system-editor-loop.mp4', poster: '/media/esdl-energy-system-editor.jpg' },
  },
  {
    id: 'national-ldt-app-store',
    type: 'tool',
    icon: 'catalogue',
    title: 'National LDT App Store',
    summary: 'A national shelf of ready-made parts: data, models, dashboards. Find one, check it, reuse it.',
    body: [
      'Think of it as a well-labelled shelf rather than a shop. Every part says what it does, how good it is and what it works with, so a municipality can pick parts with confidence and buy or build faster.',
      'What is on the national shelf can also be found from the European level, through the EU LDT Toolbox: whichever door you use, you find the same part.',
    ],
    features: ['Data and map services', 'Models and workflows', 'Dashboards and 3D views', 'Labels for quality and fit'],
    themes: ['energy', 'climate', 'urban-planning', 'renovation'],
    scale: 'national',
  },
  {
    id: 'eu-ldt-toolbox',
    type: 'tool',
    icon: 'toolbox',
    title: 'EU LDT Toolbox',
    summary: 'The European Commission’s set of building blocks for local digital twins.',
    body: [
      'A European collection of tools for simulating and planning places. Pick the pieces you need, plug in your own data, and use what you learn in your plans.',
      'twinlink.eu helps local teams find their way in it, and is looking at adding its own open framework as a ready-to-use recipe.',
    ],
    themes: ['energy', 'climate', 'urban-planning', 'renovation'],
    scale: 'european',
  },
  {
    id: 'open-ldt-framework',
    type: 'tool',
    icon: 'template',
    title: 'Open LDT framework (MIM8-aligned)',
    summary: 'A starter kit for new twins, so nobody has to begin from scratch again.',
    body: [
      'A shared skeleton for local digital twins that follows MIM8. New projects copy the skeleton and fill in their own place.',
    ],
    features: ['Follows MIM8', 'Copy and adapt', 'Fits the EU LDT Toolbox'],
    themes: ['energy', 'climate', 'urban-planning', 'renovation'],
    scale: 'european',
    status: 'In development',
  },

  // ---- Projects --------------------------------------------------------------------------------
  {
    id: 'aadorp-pilot',
    type: 'project',
    icon: 'pilot',
    title: 'Aadorp pilot',
    summary: 'A Twente village testing a twin for its homes, its plans and its shared energy.',
    body: [
      'Maps, measurements and energy figures come together, so the village can weigh different futures before choosing one.',
    ],
    themes: ['energy', 'renovation', 'urban-planning'],
    scale: 'neighbourhood',
    status: 'Ongoing',
  },
  {
    id: 'almelo-pilot',
    type: 'project',
    icon: 'pilot',
    title: 'Almelo pilot: digital twins in action',
    summary: 'Almelo uses a twin at neighbourhood scale. Watch how it works in practice.',
    body: [
      'Gemeente Almelo tests local digital twins on real neighbourhood questions, together with twinlink.eu. The video shows the twin in use.',
    ],
    themes: ['urban-planning', 'energy', 'climate'],
    scale: 'neighbourhood',
    status: 'Pilot',
    video: 'JFxr2k6DeDQ', // twinlink.eu | Digital Twins in Action: Almelo Pilot
  },
  {
    id: 'mim8-alignment',
    type: 'project',
    icon: 'link',
    title: 'MIM8 alignment',
    summary: 'Getting every twinlink.eu project to speak the same language.',
    themes: ['energy', 'climate', 'urban-planning', 'renovation'],
    scale: 'european',
    status: 'In progress',
  },
  {
    id: 'eu-toolbox-contribution',
    type: 'project',
    icon: 'toolbox',
    title: 'Contribution to the EU LDT Toolbox',
    summary: 'Offering our starter kit to the European toolbox as a ready-made recipe.',
    themes: ['energy', 'climate', 'urban-planning', 'renovation'],
    scale: 'european',
    status: 'Ongoing',
  },
  {
    id: 'university-of-twente-collaboration',
    type: 'project',
    icon: 'research',
    title: 'University of Twente collaboration',
    summary: 'Bringing open twin foundations into research and teaching.',
    themes: ['energy', 'climate', 'urban-planning', 'renovation'],
    scale: 'national',
    status: 'Ongoing',
  },


  // ---- Examples from the University of Twente Digital Twin Geohub ---------------------------
  // Source: utwente.nl/en/digital-society/research/digitalisation/digital-twin-geohub/projects
  // (November 2026). Summaries are written for this site; titles and citations are as published.
  // Images (src/assets/geohub/) and videos are the ones shown on that page. The /geohub page
  // lists these in the same order as the UT page (see `geohub` at the bottom of this file).
  {
    id: 'ut-pet-heat-stress', type: 'project', icon: 'climate', source: UT_GEOHUB, image: 'ut-pet-heat-stress', place: 'The Netherlands',
    title: 'Digital twins for heat stress (PET)',
    summary: 'How hot does a street really feel? A twin that calculates the Physiological Equivalent Temperature.',
    body: ['Physiological Equivalent Temperature (PET) describes how heat is felt by people, not just what a thermometer says. This twin calculates it street by street, to find urban heat island hotspots. A collaboration between the ITC Faculty and VU Amsterdam. The video is an introduction and tutorial.'],
    themes: ['climate', 'urban-planning'], scale: 'city', status: 'Research',
    video: 'WjoYRjI_w9w',
    refs: [
      { label: 'Digital Twins for Physiological Equivalent Temperature Calculation Guide', url: 'https://zenodo.org/records/8306456' },
      { label: 'Digital Twin-based Framework for Heat Stress Calculation', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4861693' },
    ],
  },
  {
    id: 'ut-waste-south-africa', type: 'project', icon: 'pilot', source: UT_GEOHUB, image: 'ut-waste-south-africa', place: 'South Africa',
    title: 'Digital twin for waste collection (South Africa)',
    summary: 'Simulate where waste piles up, then plan the collection route around it.',
    body: ['A twin that simulates how much waste each area produces and calculates better collection routes, with a dashboard for the collection teams. The demo video walks through it. Based on Iván Cárdenas’ MSc thesis.'],
    themes: ['water', 'mobility'], scale: 'city', status: 'Research',
    video: '6k209psuRqw',
    refs: [
      { label: 'Cárdenas, I., Koeva, M., Davey, C. & Nourian, P. (2024). Urban digital twin-based solution using geospatial information for solid waste management. Sustainable Cities and Society.' },
      { label: 'Cárdenas, I., Koeva, M., Davey, C. & Nourian, P. (2024). Solid Waste in the Virtual World: A Digital Twinning Approach for Waste Collection Planning. Springer, pp. 61–74.' },
    ],
  },
  {
    id: 'ut-uhi-padua', type: 'project', icon: 'climate', source: UT_GEOHUB, image: 'ut-uhi-padua', place: 'Padua, Italy',
    title: 'Urban heat island twin (Padua, Italy)',
    summary: 'Testing nature-based solutions on screen to cool down Padua.',
    body: ['A 3D city twin used to try out nature-based solutions, such as trees and green roofs, and see how much they lower the temperature in Padua. The video shows how the tool was built.'],
    themes: ['climate', 'urban-planning'], scale: 'city', status: 'Research',
    video: 'tcYQKSNRjQM',
    refs: [{ label: 'Sukma, A. I., Koeva, M. N., Reckien, D., et al. (2024). 3D City Digital Twin Simulation to Mitigate Heat Risk of Urban Heat Islands. ISPRS Archives XLVIII-4/W11-2024, 129–136.', url: 'https://doi.org/10.5194/isprs-archives-XLVIII-4-W11-2024-129-2024' }],
  },
  {
    id: 'ut-uhi-enschede', type: 'project', icon: 'planning', source: UT_GEOHUB, image: 'ut-uhi-enschede', place: 'Enschede, the Netherlands',
    title: 'Urban heat island twin (Enschede, the Netherlands)',
    summary: 'See how the shape of a new design changes heat and comfort, before it is built.',
    body: ['A planning support system that shows how design choices, such as building shape and layout, affect the environmental performance of a neighbourhood in Enschede.'],
    themes: ['climate', 'urban-planning'], scale: 'neighbourhood', status: 'Research',
    refs: [{ label: 'Tripathy, A., Koeva, M. N., Cardenas Leon, I. L., & Nourian, P. (2024). Planning Support System Development for analysing environmental performance of form-based design decisions: Case Study of Enschede. ISPRS Archives XLVIII-4/W11-2024, 137–144.', url: 'https://doi.org/10.5194/isprs-archives-XLVIII-4-W11-2024-137-2024' }],
  },
  {
    id: 'ut-building-extraction', type: 'project', icon: 'building', source: UT_GEOHUB, image: 'ut-building-extraction', place: 'The Netherlands & Bulgaria',
    title: 'Automatic 3D buildings for city twins (the Netherlands & Bulgaria)',
    summary: 'Roof shapes traced from remote-sensing data, so 3D city models build themselves.',
    body: ['Finds roof planes automatically in remote-sensing data and turns them into 3D buildings, the starting point for any city twin.'],
    themes: ['urban-planning', 'renovation'], scale: 'city', status: 'Research',
    refs: [{ label: 'Campoverde, C., Koeva, M., Persello, C., et al. (2024). Automatic Building Roof Plane Extraction in Urban Environments for 3D City Modelling Using Remote Sensing Data. Remote Sensing 16(8), 1386.', url: 'https://www.mdpi.com/2072-4292/16/8/1386' }],
  },
  {
    id: 'ut-traffic-sofia', type: 'project', icon: 'mobility', source: UT_GEOHUB, image: 'ut-traffic-sofia', place: 'Sofia, Bulgaria',
    title: 'Digital twin for traffic (Bulgaria)',
    summary: 'LiDAR scans become a road model where traffic can be simulated.',
    body: ['A workflow that turns LiDAR data into a digital twin of the streets, ready for traffic simulation. The video shows the simulation running.'],
    themes: ['mobility'], scale: 'city', status: 'Research',
    video: 'D7faWRh8lsU',
    refs: [
      { label: 'Wibisana, M. I., Koeva, M., Nourian, P., Petrova-Antonova, D., & Karamitov, K. Leveraging LiDAR Data and Digital Twin-Based Workflow for Traffic Simulation. ISPRS TC IV Symposium 2024.' },
      { label: 'Read more', url: 'https://purl.utwente.nl/essays/101576' },
    ],
  },
  {
    id: 'ut-flood-caribbean', type: 'project', icon: 'water', source: UT_GEOHUB, image: 'ut-flood-caribbean', place: 'Caribbean',
    title: 'Digital twin for flood risk (Caribbean island)',
    summary: 'A twin to help an island decide how to prepare for floods.',
    body: ['A digital twin framework that supports decisions on flood risk management for a Caribbean island.'],
    themes: ['water', 'climate'], scale: 'city', status: 'Research',
    refs: [{ label: 'Read more', url: 'https://purl.utwente.nl/essays/101928' }],
  },
  {
    id: 'ut-walkability-sofia', type: 'project', icon: 'mobility', source: UT_GEOHUB, image: 'ut-walkability-sofia', place: 'Sofia, Bulgaria',
    title: 'Generative design for walkable streets (Sofia)',
    summary: 'Let the computer propose street layouts, and keep the ones people can walk.',
    body: ['Generative design produces many possible layouts for an area of Sofia and scores how walkable each one is, as a step towards a planning twin.'],
    themes: ['mobility', 'urban-planning'], scale: 'neighbourhood', status: 'Research',
    refs: [
      { label: 'Kumalasari, D., Koeva, M., Vahdatikhaki, F., Petrova Antonova, D., & Kuffer, M. (2023). Planning Walkable Cities: Generative Design Approach towards Digital Twin Implementation. Remote Sensing 15, 1088.', url: 'https://doi.org/10.3390/rs15041088' },
      { label: 'Kumalasari, D. (2022). Generative Design for Walkable Cities: a case study of Sofia. MSc thesis, University of Twente.' },
    ],
  },
  {
    id: 'ut-uhi-building', type: 'project', icon: 'building', source: UT_GEOHUB, image: 'ut-uhi-building', place: 'Building level',
    title: 'Urban heat island twin (building level)',
    summary: 'A web app that analyses how heat moves through a single building.',
    body: ['The urban heat island seen from one building: a web app for heat transfer analysis, shown in the video.'],
    themes: ['climate', 'renovation'], scale: 'building', status: 'Research',
    video: 'uT6reBPmeDY',
  },
  {
    id: 'ut-uhi-wuppertal', type: 'project', icon: 'climate', source: UT_GEOHUB, image: 'ut-uhi-wuppertal', place: 'Wuppertal, Germany',
    title: 'Urban heat island twin (Wuppertal, Germany)',
    summary: 'Live sensors and machine learning predict street temperatures, in Unreal Engine.',
    body: ['A twin built in Unreal Engine that combines sensor data with a Random Forest model to predict temperatures in real time and let planners test scenarios against urban heat in Wuppertal.'],
    themes: ['climate'], scale: 'city', status: 'Research',
    refs: [{ label: 'Read the essay', url: 'https://purl.utwente.nl/104873' }],
  },
  {
    id: 'ut-primavera', type: 'project', icon: 'tool', source: UT_GEOHUB, image: 'ut-primavera', logo: true, place: 'The Netherlands',
    title: 'PrimaVera: predictive maintenance',
    summary: 'Turn machine data into a forecast of its health, and repair just in time.',
    body: ['PrimaVera turns the data that intelligent systems collect into predictions about their health, so maintenance happens exactly when and where it is needed, before anything fails.'],
    themes: [], scale: 'national', status: 'Research',
    link: 'https://primavera-project.com/',
  },
  {
    id: 'ut-arise-biodiversity', type: 'project', icon: 'climate', source: UT_GEOHUB, image: 'ut-arise-biodiversity', place: 'The Netherlands',
    title: 'ARISE: biodiversity of the Netherlands',
    summary: 'An infrastructure to identify and follow every multicellular species in the country.',
    body: ['Biodiversity loss is one of the biggest threats we face. ARISE builds an infrastructure, the only one of its kind, to identify and monitor all multicellular plants and animals in the Netherlands.'],
    themes: ['climate'], scale: 'national', status: 'Research',
    link: 'https://www.arise-biodiversity.nl/',
  },
  {
    id: 'ut-zorro', type: 'project', icon: 'tool', source: UT_GEOHUB, image: 'ut-zorro', logo: true, place: 'The Netherlands',
    title: 'Zorro: zero downtime for complex systems',
    summary: 'Digital twins that find faults in large cyber-physical systems before they stop.',
    body: ['Zorro (Zero downtime in Cyber-physical systems) uses digital twin technology to make large cyber-physical systems more reliable, scaling intelligent fault diagnostics from single components up to whole systems.'],
    themes: [], scale: 'national', status: 'Research',
    link: 'https://zorro-project.nl/',
  },
  {
    id: 'ut-sublime', type: 'project', icon: 'building', source: UT_GEOHUB, image: 'ut-sublime', logo: true, place: 'The Netherlands',
    title: 'Sublime: longer life for steel infrastructure',
    summary: 'Predictive twins for bridges, sheet piles and lock doors, so they stay safe for longer.',
    body: ['Steel bridges, sheet piles and lock doors wear down through corrosion and fatigue. Sublime builds predictive digital twins that combine structural health monitoring with prediction models, so these structures can be used longer, safely, with governance advice to put the knowledge into practice.'],
    themes: ['mobility', 'water'], scale: 'national', status: 'Research',
    link: 'https://sublimeproject.nl/',
  },
  {
    id: 'ut-ecologic', type: 'project', icon: 'energy', source: UT_GEOHUB, image: 'ut-ecologic', place: 'The Netherlands',
    title: 'EcoLogic: a carbon twin for construction logistics',
    summary: 'Track and cut the emissions of building-site transport, in real time.',
    body: ['EcoLogic (Emission COntrol and Logistics Optimization for Green Infrastructure Construction) uses IoT, AI and a real-time Carbon Digital Twin to make Dutch construction logistics cleaner and more resilient.'],
    themes: ['climate', 'mobility'], scale: 'national', status: 'Research',
    refs: [{ label: 'More information', url: 'https://www.utwente.nl/en/eemcs/ps/news/2023/10/1169339/ecologic-project-accepted-for-emission-free-building-innovations' }],
  },
  {
    id: 'ut-south-africa-hackathon', type: 'project', icon: 'research', source: UT_GEOHUB, image: 'ut-south-africa-hackathon', place: 'Johannesburg, South Africa',
    title: 'Digital twins for Johannesburg (hackathon)',
    summary: 'Five students, three prototypes: waste collection, road assets and public safety.',
    body: ['At the Johannesburg Digital Twin Technology Hackathon, five students from the ET and ITC faculties designed prototypes for waste collection, road asset management and social safety.'],
    themes: ['water', 'mobility', 'urban-planning'], scale: 'city', status: 'Prototype',
    refs: [{ label: 'More information', url: 'https://www.utwente.nl/en/digital-society/news/2022/11/324748/three-prices-at-hacksmycity-johannesburg' }],
  },
  {
    id: 'ut-climate-resilient-twinning', type: 'project', icon: 'climate', source: UT_GEOHUB, image: 'ut-climate-resilient-twinning', place: 'The Netherlands',
    title: 'Twinning for climate-resilient cities',
    summary: 'Twins that follow how green space and climate adaptation change a city over time.',
    body: ['Researchers explore how digital twins can support sustainable urban development, from socio-spatial, administrative and technical angles, with tools to map changes in green space and climate adaptation. A collaboration between VU Amsterdam and the University of Twente.'],
    themes: ['climate', 'urban-planning'], scale: 'city', status: 'Research',
    refs: [{ label: 'More information', url: 'https://vu-ut.nl/en/research-and-impact/smart-societies/researchprojects-2022/' }],
  },
  {
    id: 'ut-its4land-uav', type: 'project', icon: 'map', source: UT_GEOHUB, image: 'ut-its4land-uav', place: 'East Africa',
    title: 'its4land: drone flights',
    summary: 'Drones map the land from above, as input for recording land rights.',
    body: ['Footage from the drone (UAV) flights made in the its4land project, which captured the aerial images used to map land boundaries.'],
    themes: ['urban-planning'], scale: 'national', status: 'Research',
    video: 'xyJ6nIDUiPM',
  },
  {
    id: 'ut-its4land', type: 'project', icon: 'map', source: UT_GEOHUB, image: 'ut-its4land', place: 'East Africa',
    title: 'its4land: a toolbox for recording land',
    summary: 'Affordable, fast tools to record who uses which land.',
    body: ['its4land is a land administration toolbox with tools to record land tenure in a way that is affordable, fast, easy and responsible, built on fit-for-purpose principles and new ways of using ICT. The video introduces the tools.'],
    themes: ['urban-planning'], scale: 'national', status: 'Research',
    video: 'lNJwyGUwH38',
  },
  {
    id: 'ut-construction-training', type: 'project', icon: 'pilot', source: UT_GEOHUB, image: 'ut-construction-training', place: 'The Netherlands',
    title: 'Digital twin-based construction training',
    summary: 'Training simulators for construction equipment that feel like the real site.',
    body: ['Beyond showing data: simulators that recreate a realistic construction site, so equipment operators can train in context before they work on the real thing.'],
    themes: [], scale: 'building', status: 'Research',
    refs: [{ label: 'Beyond data visualization: Context-realistic construction equipment training simulators (Automation in Construction)', url: 'https://www.sciencedirect.com/science/article/pii/S0926580518306046' }],
  },
  // ---- Knowledge -------------------------------------------------------------------------------
  {
    id: 'what-is-a-local-digital-twin',
    type: 'knowledge',
    icon: 'knowledge',
    title: 'What is a local digital twin?',
    summary: 'A living copy of a place, built from its data, where you can try a decision before making it.',
    body: [
      'Take everything a municipality knows about a street (buildings, pipes, trees, traffic, energy) and put it in one model that stays up to date. Now you can ask it questions: what if we add solar here, plant trees there, close this road?',
      'Building one is the hard part. twinlink.eu collects the parts and the know-how, so the next town does not have to start where the last one began.',
    ],
    themes: ['energy', 'climate', 'urban-planning', 'renovation'],
    scale: 'city',
  },
  {
    id: 'ai-geospatial-digital-twins',
    type: 'knowledge',
    icon: 'research',
    title: 'AI-driven geospatial digital twins',
    summary: 'A talk by Dr. Mila Koeva on where AI and geo-data meet in digital twins.',
    body: [
      'Dr. Mila Koeva, treasurer of the twinlink.eu board and associate professor in 3D city digital twins and geospatial technologies, explains how artificial intelligence and geospatial data come together in digital twins.',
    ],
    themes: ['urban-planning', 'climate', 'energy'],
    scale: 'city',
    video: 'ZlKtPDOZXpE', // AI driven geospatial digital twins by Dr. Mila Koeva
  },
  {
    id: 'data-space-and-data-labs',
    type: 'knowledge',
    icon: 'link',
    title: 'twinlink.eu Data Space and Data Labs',
    summary: 'How data can be shared safely between organisations, and tried out in a lab first.',
    body: [
      'A data space lets organisations share data on agreed terms, without handing it over for good. The twinlink.eu Data Labs are where partners try that out together.',
      'The walkthrough (6 minutes) shows the platform at work: finding data offerings on energy, buildings and mobility, asking for permission under the iSHARE trust framework, publishing your own data, and running shared notebooks that analyse data without handing it over. A built-in assistant helps you find your way. The shorter YouTube film below it explains the idea.',
    ],
    features: ['Find data on energy, buildings and mobility', 'Permission through iSHARE', 'Publish your own data offers', 'Shared notebooks and analyses'],
    themes: ['energy', 'climate', 'urban-planning', 'renovation'],
    scale: 'european',
    video: 'q-Y2ns8podQ', // twinlink.eu Data Space and Data Labs
    clip: { src: '/media/data-lab-walkthrough.mp4', loop: '/media/data-lab-walkthrough-loop.mp4', poster: '/media/data-lab-walkthrough.jpg' },
  },
  {
    id: 'why-mim8-matters',
    type: 'knowledge',
    icon: 'link',
    title: 'Why MIM8 matters',
    summary: 'A short agreement that lets twins from different towns share parts.',
    body: [
      'MIM8 is one of the Minimal Interoperability Mechanisms: an agreement on how a local digital twin is put together. When two towns follow it, a model or dashboard made for one can be used by the other.',
    ],
    themes: ['energy', 'climate', 'urban-planning', 'renovation'],
    scale: 'european',
  },
  {
    id: 'governance-first',
    type: 'knowledge',
    icon: 'governance',
    title: 'Governance first, then technology',
    summary: 'Agree on the rules first. The software comes after.',
    // (kept short on purpose)
    body: [
      'Who owns the data, who may use it, and who answers for its quality? Settle that with everyone at the table, and a region can work from one shared source of facts (a regional SPOT) and one shared workspace.',
    ],
    features: ['Clear data agreements', 'Everyone at the table', 'Builds on existing standards'],
    themes: ['urban-planning', 'energy'],
    scale: 'city',
  },

  // ---- Resources (standards and frameworks named on the current site) --------------------------
  { id: 'inspire', type: 'resource', icon: 'resource', title: 'INSPIRE', summary: 'Europe’s shared rules for map data.', themes: ['urban-planning', 'climate'], scale: 'european', link: 'https://inspire.ec.europa.eu/' },
  { id: 'ifc', type: 'resource', icon: 'resource', title: 'IFC', summary: 'The open file standard for 3D building models (BIM).', themes: ['renovation'], scale: 'building', link: 'https://www.buildingsmart.org/' },
  { id: 'bag-bgt-imgeo', type: 'resource', icon: 'resource', title: 'BAG / BGT / IMGeo', summary: 'The Dutch registers of buildings, addresses and detailed maps.', themes: ['urban-planning', 'renovation'], scale: 'national', link: 'https://www.pdok.nl/' },
  { id: 'digigo-dsgo', type: 'resource', icon: 'resource', title: 'DigiGO / DSGO', summary: 'Dutch agreements for sharing construction data.', themes: ['renovation', 'urban-planning'], scale: 'national' },
  { id: 'ils-woco', type: 'resource', icon: 'resource', title: 'ILS-WoCo', summary: 'How housing associations exchange information.', themes: ['renovation'], scale: 'national' },
  { id: 'dico-etim', type: 'resource', icon: 'resource', title: 'DICO / ETIM', summary: 'Shared product descriptions for building and installation.', themes: ['renovation', 'energy'], scale: 'national' },
  { id: 'pre-madona', type: 'resource', icon: 'resource', title: 'PRE-MADONA', summary: 'A reference used when lining up local twin work.', themes: ['urban-planning'], scale: 'european' }, // TO CONFIRM description
];

export const byType = (t: ItemType) => items.filter((i) => i.type === t);
export const byTheme = (t: ThemeId) => items.filter((i) => i.themes.includes(t));
export const getItem = (id: string) => items.find((i) => i.id === id);
export const typeOf = (t: ItemType) => types.find((x) => x.id === t)!;
export const themeOf = (t: ThemeId) => themes.find((x) => x.id === t)!;

/** The University of Twente Digital Twin Geohub projects, in the order of the UT page, each with
 *  a topic for the filter on /geohub. */
export const geohub = {
  name: 'Digital Twin Geohub',
  org: 'University of Twente · Digital Society Institute',
  url: UT_GEOHUB.url,
  topics: [
    { id: 'heat', label: 'Urban heat' },
    { id: 'mobility', label: 'Mobility' },
    { id: 'water', label: 'Water & waste' },
    { id: 'city', label: '3D city & land' },
    { id: 'nature', label: 'Climate & nature' },
    { id: 'infra', label: 'Infrastructure & industry' },
  ],
  entries: [
    ['ut-pet-heat-stress', 'heat'],
    ['ut-waste-south-africa', 'water'],
    ['ut-uhi-padua', 'heat'],
    ['ut-uhi-enschede', 'heat'],
    ['ut-building-extraction', 'city'],
    ['ut-traffic-sofia', 'mobility'],
    ['ut-flood-caribbean', 'water'],
    ['ut-walkability-sofia', 'mobility'],
    ['ut-uhi-building', 'heat'],
    ['ut-uhi-wuppertal', 'heat'],
    ['ut-primavera', 'infra'],
    ['ut-arise-biodiversity', 'nature'],
    ['ut-zorro', 'infra'],
    ['ut-sublime', 'infra'],
    ['ut-ecologic', 'infra'],
    ['ut-south-africa-hackathon', 'city'],
    ['ut-climate-resilient-twinning', 'nature'],
    ['ut-its4land-uav', 'city'],
    ['ut-its4land', 'city'],
    ['ut-construction-training', 'infra'],
  ] as [string, string][],
};
