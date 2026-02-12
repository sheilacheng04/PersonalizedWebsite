// Asset paths - referencing the shared assets folder
const ASSETS_BASE = '/assets';

export const assets = {
  common: {
    homeButton: `${ASSETS_BASE}/common/Home_button.png`,
    linkedin: `${ASSETS_BASE}/common/Linkedln.png`,
    email: `${ASSETS_BASE}/common/Email.png`,
  },
  home: {
    fullName: `${ASSETS_BASE}/home/SheilaNicoleCheng.png`,
  },
  logo: {
    portfolio: `${ASSETS_BASE}/logo/Portfolio_logo.png`,
    visitrack: `${ASSETS_BASE}/logo/VisiTrack_logo.png`,
    contextufile: `${ASSETS_BASE}/logo/Contextufile_logo.png`,
    arisePH: `${ASSETS_BASE}/logo/ArisePH_logo.png`,
  },
  posters: {
    blueInk: `${ASSETS_BASE}/posters/blue_ink_poster.png`,
    crossTheBridge: `${ASSETS_BASE}/posters/cross_the_bridge.png`,
    natureCollage: `${ASSETS_BASE}/posters/nature collage.png`,
    observe: `${ASSETS_BASE}/posters/Observe.png`,
    pastLife: `${ASSETS_BASE}/posters/Past_life.png`,
    universe: `${ASSETS_BASE}/posters/Universe.png`,
    wingsOfVigil: `${ASSETS_BASE}/posters/Wings of Vigil.png`,
  },
  profile: {
    cv: `${ASSETS_BASE}/profile/Cheng_CV (1).pdf`,
  },
};

export const posterList = [
  { src: assets.posters.blueInk, alt: 'Blue Ink Poster', title: 'Blue Ink' },
  { src: assets.posters.crossTheBridge, alt: 'Cross the Bridge', title: 'Cross the Bridge' },
  { src: assets.posters.natureCollage, alt: 'Nature Collage', title: 'Nature Collage' },
  { src: assets.posters.observe, alt: 'Observe', title: 'Observe' },
  { src: assets.posters.pastLife, alt: 'Past Life', title: 'Past Life' },
  { src: assets.posters.universe, alt: 'Universe', title: 'Universe' },
  { src: assets.posters.wingsOfVigil, alt: 'Wings of Vigil', title: 'Wings of Vigil' },
];

export const projectList = [
  {
    icon: assets.logo.visitrack,
    title: 'VisiTrack',
    description: 'A visitor tracking system designed to organize entries, exits, and records efficiently.',
    fullDescription: 'VisiTrack helps manage visitor data by recording entries in a structured and reliable way. It focuses on accuracy, accountability, and ease of use, making manual tracking less chaotic.',
    tech: ['Outsystems'],
    features: ['Visitor logging system', 'Organized record management', 'Simple and clean interface', 'Error-reducing input flow'],
  },
  {
    icon: assets.logo.contextufile,
    title: 'ContextuFile',
    description: 'An intelligent file organization system that understands what your files are about.',
    fullDescription: "ContextuFile uses contextual meaning from file titles to automatically organize files into folders. Instead of manual sorting, the system analyzes keywords and intent to reduce clutter.",
    tech: ['Python', 'spaCy', 'HTML', 'JavaScript', 'CSS'],
    features: ['Context-based file classification', 'Automated folder organization', 'NLP-powered logic', 'Scalable system design'],
  },
  {
    icon: assets.logo.arisePH,
    title: 'ARISE PH Database',
    description: 'A centralized database system designed for structured data management.',
    fullDescription: 'ARISE PH Database focuses on data integrity, organization, and efficient retrieval. It was designed to support real-world use cases that require reliable records and reporting.',
    tech: ['Workbook', 'Frappe'],
    features: ['Centralized data storage', 'Structured relationships', 'Secure and consistent records', 'Query-based reporting'],
  },
  {
    icon: assets.logo.portfolio,
    title: 'Web Portfolio',
    description: 'A fully personalized portfolio built from scratch—no templates, just vibes.',
    fullDescription: 'This website was designed and coded to reflect my personality, interests, and skills. Inspired by underwater glass aesthetics, it focuses on smooth motion, playful interactions, and clarity.',
    tech: ['React', 'TypeScript', 'NestJS', 'Supabase'],
    features: ['Custom design from scratch', 'Interactive animations', 'Responsive layout', 'Themed UI experience'],
  },
];
