import { SECTOR_JOBS_PART_1 } from './jobs/sectorCatalogPart1.js';
import { SECTOR_JOBS_PART_2 } from './jobs/sectorCatalogPart2.js';
import { SECTOR_JOBS_PART_3 } from './jobs/sectorCatalogPart3.js';
import { SECTOR_JOBS_PART_4 } from './jobs/sectorCatalogPart4.js';

export const JOB_INDUSTRIES = [
  'All Industries',
  'IT & Software',
  'Healthcare',
  'Education',
  'Finance',
  'Engineering',
  'Sales',
  'Marketing',
  'Government',
  'Administration',
  'Human Resources',
  'Design & Creative',
  'Legal & Compliance',
  'Supply Chain & Logistics',
  'Banking & Insurance',
  'Manufacturing & Quality',
  'Construction & Real Estate',
  'Hospitality & Tourism',
  'Retail & E-Commerce',
  'Media & Communications',
  'Pharma & Biotechnology',
  'Other Sectors',
];

export const WORK_MODE_FILTERS = ['All', 'Recommended', 'Remote', 'Hybrid', 'Full-time', 'Saved', 'Applied'];

export const INDUSTRY_META = {
  'IT & Software': {
    badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    accentBg: 'bg-[#0891b2]',
  },
  Healthcare: {
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    accentBg: 'bg-emerald-600',
  },
  Education: {
    badgeClass: 'bg-violet-50 text-violet-800 border-violet-200',
    accentBg: 'bg-violet-600',
  },
  Finance: {
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    accentBg: 'bg-amber-600',
  },
  Engineering: {
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    accentBg: 'bg-blue-600',
  },
  Sales: {
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
    accentBg: 'bg-orange-600',
  },
  Marketing: {
    badgeClass: 'bg-pink-50 text-pink-800 border-pink-200',
    accentBg: 'bg-pink-600',
  },
  Government: {
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    accentBg: 'bg-indigo-600',
  },
  Administration: {
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    accentBg: 'bg-slate-700',
  },
  'Human Resources': {
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    accentBg: 'bg-rose-600',
  },
  'Design & Creative': {
    badgeClass: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200',
    accentBg: 'bg-fuchsia-600',
  },
  'Legal & Compliance': {
    badgeClass: 'bg-stone-100 text-stone-800 border-stone-300',
    accentBg: 'bg-stone-700',
  },
  'Supply Chain & Logistics': {
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    accentBg: 'bg-sky-600',
  },
  'Banking & Insurance': {
    badgeClass: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    accentBg: 'bg-yellow-600',
  },
  'Manufacturing & Quality': {
    badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-300',
    accentBg: 'bg-zinc-700',
  },
  'Construction & Real Estate': {
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
    accentBg: 'bg-amber-700',
  },
  'Hospitality & Tourism': {
    badgeClass: 'bg-cyan-50 text-cyan-900 border-cyan-300',
    accentBg: 'bg-cyan-700',
  },
  'Retail & E-Commerce': {
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    accentBg: 'bg-purple-600',
  },
  'Media & Communications': {
    badgeClass: 'bg-red-50 text-red-800 border-red-200',
    accentBg: 'bg-red-600',
  },
  'Pharma & Biotechnology': {
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    accentBg: 'bg-teal-600',
  },
  'Other Sectors': {
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    accentBg: 'bg-[#020617]',
  },
};

export const INITIAL_JOBS = [
  ...SECTOR_JOBS_PART_1,
  ...SECTOR_JOBS_PART_2,
  ...SECTOR_JOBS_PART_3,
  ...SECTOR_JOBS_PART_4,
];
