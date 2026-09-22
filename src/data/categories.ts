import type { DeviceCategory } from './types';

export const categories: DeviceCategory[] = [
  {
    id: 'patient-monitoring',
    name: 'Patient Monitoring Devices',
    icon: 'Activity',
    color: 'from-blue-500 to-cyan-500',
    description: 'Devices for continuous monitoring of vital signs and physiological parameters',
  },
  {
    id: 'life-support',
    name: 'Life Support Devices',
    icon: 'HeartPulse',
    color: 'from-red-500 to-rose-500',
    description: 'Critical care equipment that sustains or supports life functions',
  },
  {
    id: 'medical-imaging',
    name: 'Medical Imaging Devices',
    icon: 'Scan',
    color: 'from-violet-500 to-purple-500',
    description: 'Modalities for visualizing internal body structures and functions',
  },
  {
    id: 'therapeutic',
    name: 'Therapeutic Devices',
    icon: 'Zap',
    color: 'from-amber-500 to-orange-500',
    description: 'Devices that deliver therapeutic energy or stimulation to treat conditions',
  },
  {
    id: 'laboratory',
    name: 'Laboratory Equipment',
    icon: 'FlaskConical',
    color: 'from-green-500 to-emerald-500',
    description: 'Analytical and diagnostic instruments for clinical laboratories',
  },
  {
    id: 'surgical',
    name: 'Surgical Equipment',
    icon: 'Scissors',
    color: 'from-slate-500 to-gray-600',
    description: 'Instruments and systems used in operating rooms and surgical procedures',
  },
  {
    id: 'rehabilitation',
    name: 'Rehabilitation Devices',
    icon: 'Accessibility',
    color: 'from-teal-500 to-cyan-600',
    description: 'Devices that restore or enhance physical mobility and function',
  },
  {
    id: 'dental',
    name: 'Dental Devices',
    icon: 'Smile',
    color: 'from-pink-500 to-rose-500',
    description: 'Equipment for dental diagnosis, treatment, and oral care',
  },
  {
    id: 'ophthalmology',
    name: 'Ophthalmology Devices',
    icon: 'Eye',
    color: 'from-indigo-500 to-blue-600',
    description: 'Instruments for eye examination, diagnosis, and treatment',
  },
  {
    id: 'neonatal',
    name: 'Neonatal Devices',
    icon: 'Baby',
    color: 'from-sky-400 to-blue-500',
    description: 'Specialized equipment for neonatal and infant care',
  },
];
