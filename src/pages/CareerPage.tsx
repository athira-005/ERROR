import { useState } from 'react';
import { Briefcase, GraduationCap, FlaskConical, Building2, Stethoscope, Cpu, HeartPulse, Globe, TrendingUp, Users, DollarSign, MapPin, ArrowRight, Award, BookOpen, Microscope, Plane } from 'lucide-react';
import { navigate } from '../hooks/useRouter';

interface CareerPath {
  icon: any;
  title: string;
  category: 'job' | 'research' | 'higher-studies';
  description: string;
  roles: string[];
  skills: string[];
  salary: string;
  growth: string;
  color: string;
}

const careerPaths: CareerPath[] = [
  {
    icon: Stethoscope,
    title: 'Clinical Engineer',
    category: 'job',
    description: 'Manage medical equipment in hospitals, oversee maintenance, calibration, and technology assessment.',
    roles: ['Clinical Engineering Manager', 'Biomedical Equipment Technician', 'Hospital Technology Coordinator'],
    skills: ['Equipment management', 'Electrical safety testing', 'Preventive maintenance', 'Regulatory compliance'],
    salary: '$60K - $95K',
    growth: 'High demand in healthcare networks',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Cpu,
    title: 'Medical Device Design Engineer',
    category: 'job',
    description: 'Design and develop new medical devices, from concept through prototyping to regulatory approval.',
    roles: ['R&D Engineer', 'Product Development Engineer', 'Design Engineer', 'Systems Engineer'],
    skills: ['CAD/CAM', 'FDA/ISO 13485', 'Embedded systems', 'Human factors engineering'],
    salary: '$75K - $130K',
    growth: 'Fast-growing medtech industry',
    color: 'from-teal-500 to-emerald-500',
  },
  {
    icon: HeartPulse,
    title: 'Regulatory Affairs Specialist',
    category: 'job',
    description: 'Navigate FDA, CE marking, and global regulatory pathways for medical device approval and compliance.',
    roles: ['Regulatory Affairs Manager', 'Compliance Officer', 'Quality Assurance Specialist'],
    skills: ['FDA 510(k)', 'MDR compliance', 'ISO 14971', 'Technical documentation'],
    salary: '$70K - $120K',
    growth: 'Critical for all device companies',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Building2,
    title: 'Healthcare IT & Imaging Specialist',
    category: 'job',
    description: 'Bridge biomedical engineering and IT — manage DICOM/PACS systems, telemedicine, and health data.',
    roles: ['Imaging IT Specialist', 'Health Informatics Engineer', 'DICOM/PACS Administrator'],
    skills: ['DICOM/HL7', 'Network security', 'Medical imaging', 'Cloud infrastructure'],
    salary: '$65K - $110K',
    growth: 'Telemedicine and AI expanding rapidly',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: FlaskConical,
    title: 'Research Scientist',
    category: 'research',
    description: 'Conduct cutting-edge research in biomaterials, biomechanics, medical imaging, or neural engineering.',
    roles: ['Postdoctoral Researcher', 'Research Associate', 'Principal Investigator'],
    skills: ['Experimental design', 'Scientific writing', 'Data analysis', 'Grant writing'],
    salary: '$55K - $100K',
    growth: 'Growing funding in biomedical research',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Microscope,
    title: 'Academic Researcher / Professor',
    category: 'research',
    description: 'Teach and lead a research lab at a university, mentoring next-generation biomedical engineers.',
    roles: ['Assistant Professor', 'Associate Professor', 'Department Chair'],
    skills: ['Teaching', 'Research leadership', 'Publishing', 'Curriculum development'],
    salary: '$70K - $150K',
    growth: 'Stable academic career path',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: GraduationCap,
    title: 'M.S. / M.Tech in Biomedical Engineering',
    category: 'higher-studies',
    description: 'Specialize in areas like medical imaging, biomechanics, biomaterials, or rehabilitation engineering.',
    roles: ['M.S. student', 'M.Tech student', 'Graduate Research Assistant'],
    skills: ['Advanced coursework', 'Thesis research', 'Specialized domain knowledge'],
    salary: 'Investment for higher earning potential',
    growth: 'Opens senior R&D and academic roles',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: BookOpen,
    title: 'Ph.D. in Biomedical Engineering',
    category: 'higher-studies',
    description: 'Deep research focus — develop expertise in a specialized area and contribute original research.',
    roles: ['Ph.D. Candidate', 'Doctoral Researcher', 'Dissertation Scholar'],
    skills: ['Independent research', 'Publication', 'Conference presentations', 'Teaching'],
    salary: 'Stipend $25K - $45K during studies',
    growth: 'Required for academia and senior R&D',
    color: 'from-sky-500 to-blue-600',
  },
  {
    icon: Award,
    title: 'MBA in Healthcare Management',
    category: 'higher-studies',
    description: 'Combine engineering background with business skills for leadership roles in medtech companies.',
    roles: ['Product Manager', 'Healthcare Consultant', 'Medtech Entrepreneur'],
    skills: ['Business strategy', 'Healthcare economics', 'Product marketing', 'Leadership'],
    salary: '$90K - $180K post-MBA',
    growth: 'Bridge between technology and business',
    color: 'from-slate-500 to-gray-600',
  },
];

const researchAreas = [
  { name: 'Biomaterials & Tissue Engineering', desc: 'Developing biocompatible materials and engineered tissues for implants and regenerative medicine.', icon: FlaskConical },
  { name: 'Medical Imaging & AI', desc: 'Applying machine learning to MRI, CT, ultrasound, and X-ray for automated diagnosis.', icon: Cpu },
  { name: 'Biomechanics & Rehabilitation', desc: 'Studying human movement, prosthetics, exoskeletons, and mobility restoration.', icon: HeartPulse },
  { name: 'Neural Engineering', desc: 'Brain-computer interfaces, neuroprosthetics, and deep brain stimulation.', icon: Globe },
  { name: 'Wearable & Point-of-Care Devices', desc: 'Portable diagnostics, continuous monitoring, and telehealth technologies.', icon: TrendingUp },
  { name: 'Drug Delivery Systems', desc: 'Targeted, controlled-release, and nanotechnology-based drug delivery platforms.', icon: Microscope },
];

const topUniversities = [
  { name: 'Johns Hopkins University', country: 'USA', focus: 'Biomedical Engineering' },
  { name: 'MIT', country: 'USA', focus: 'Health Sciences & Technology' },
  { name: 'Stanford University', country: 'USA', focus: 'Bioengineering' },
  { name: 'Georgia Tech', country: 'USA', focus: 'Biomedical Engineering' },
  { name: 'TU Munich', country: 'Germany', focus: 'BioMedical Engineering' },
  { name: 'Imperial College London', country: 'UK', focus: 'Bioengineering' },
  { name: 'University of Toronto', country: 'Canada', focus: 'Biomedical Engineering' },
  { name: 'NUS Singapore', country: 'Singapore', focus: 'Biomedical Engineering' },
  { name: 'IIT Bombay', country: 'India', focus: 'Biomedical Engineering' },
  { name: 'ETH Zurich', country: 'Switzerland', focus: 'Health Sciences & Technology' },
];

const topCompanies = [
  { name: 'Medtronic', focus: 'Cardiac, neuro, surgical devices', icon: HeartPulse },
  { name: 'Philips Healthcare', focus: 'Imaging, monitoring, informatics', icon: Cpu },
  { name: 'GE Healthcare', focus: 'Imaging, diagnostics, monitoring', icon: Building2 },
  { name: 'Siemens Healthineers', focus: 'Imaging, lab diagnostics', icon: Microscope },
  { name: 'Boston Scientific', focus: 'Interventional medical devices', icon: Stethoscope },
  { name: 'Abbott Laboratories', focus: 'Diagnostics, cardiovascular, diabetes', icon: FlaskConical },
  { name: 'Stryker', focus: 'Orthopedics, surgical equipment', icon: Briefcase },
  { name: 'B. Braun', focus: 'Anesthesia, infusion, surgical', icon: HeartPulse },
];

const certifications = [
  { name: 'Certified Clinical Engineer (CCE)', org: 'ACCE', desc: 'For clinical engineering professionals in healthcare settings' },
  { name: 'Certified Biomedical Equipment Technician (CBET)', org: 'AAMI', desc: 'For equipment technicians maintaining medical devices' },
  { name: 'ISO 13485 Lead Auditor', org: 'ISO', desc: 'For quality management in medical device manufacturing' },
  { name: 'Certified Regulatory Professional', org: 'RAPS', desc: 'For regulatory affairs in medical devices' },
  { name: 'Six Sigma Green/Black Belt', org: 'ASQ', desc: 'For process improvement in healthcare and manufacturing' },
];

export function CareerPage() {
  const [filter, setFilter] = useState<'all' | 'job' | 'research' | 'higher-studies'>('all');

  const filtered = filter === 'all' ? careerPaths : careerPaths.filter((c) => c.category === filter);

  const categoryLabels: Record<string, string> = {
    job: 'Industry Jobs',
    research: 'Research Careers',
    'higher-studies': 'Higher Studies',
  };

  const categoryColors: Record<string, string> = {
    job: 'bg-blue-100 text-blue-700',
    research: 'bg-green-100 text-green-700',
    'higher-studies': 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-teal-500 to-accent-500 p-8 md:p-12 mb-10">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur mb-4">
              <GraduationCap className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Career Guidance for Biomedical Engineers</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              Your Future in Biomedical Engineering
            </h1>
            <p className="text-white/90 text-lg max-w-2xl">
              Explore career paths in industry, research, and higher studies. From clinical engineering to medical device
              design, from Ph.D. research to healthcare MBA — discover the opportunities that await you.
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Briefcase, value: '$130B+', label: 'Global MedTech Market', color: 'from-blue-500 to-cyan-500' },
            { icon: TrendingUp, value: '7%', label: 'Annual Industry Growth', color: 'from-teal-500 to-emerald-500' },
            { icon: Users, value: '400K+', label: 'BME Jobs Worldwide', color: 'from-violet-500 to-purple-500' },
            { icon: DollarSign, value: '$95K', label: 'Avg Salary (US)', color: 'from-amber-500 to-orange-500' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-display text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Career paths */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="section-title">Career Paths</h2>
            <div className="flex flex-wrap gap-2">
              {(['all', 'job', 'research', 'higher-studies'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'
                  }`}
                >
                  {f === 'all' ? 'All Paths' : categoryLabels[f]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((path, i) => {
              const Icon = path.icon;
              return (
                <div key={i} className="card card-hover p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display text-lg font-bold text-slate-900">{path.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${categoryColors[path.category]}`}>
                      {categoryLabels[path.category]}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{path.description}</p>

                  <div className="mb-3">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Typical Roles</div>
                    <div className="flex flex-wrap gap-1.5">
                      {path.roles.map((role, j) => (
                        <span key={j} className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600">{role}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Key Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      {path.skills.map((skill, j) => (
                        <span key={j} className="text-xs px-2 py-1 rounded-md bg-teal-50 text-teal-700">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-sm">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-slate-700">{path.salary}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {path.growth}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Research areas */}
        <div className="mb-12">
          <h2 className="section-title mb-2">Research Frontiers</h2>
          <p className="text-slate-600 mb-6">Emerging areas where biomedical engineers are driving innovation.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {researchAreas.map((area, i) => {
              const Icon = area.icon;
              return (
                <div key={i} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm">{area.name}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{area.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Higher studies: universities */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-6 h-6 text-primary-500" />
            <h2 className="section-title">Top Universities for BME</h2>
          </div>
          <p className="text-slate-600 mb-6">Leading institutions for graduate studies in Biomedical Engineering.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topUniversities.map((uni, i) => (
              <div key={i} className="card p-4 flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.03}s` }}>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-teal-400 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-slate-900">{uni.name}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3 h-3" />
                    {uni.country}
                    <span className="text-slate-300">•</span>
                    {uni.focus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top employers */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-6 h-6 text-primary-500" />
            <h2 className="section-title">Leading MedTech Employers</h2>
          </div>
          <p className="text-slate-600 mb-6">Companies actively hiring biomedical engineers across the globe.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topCompanies.map((company, i) => {
              const Icon = company.icon;
              return (
                <div key={i} className="card card-hover p-5 text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center mx-auto mb-3 shadow-md">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 mb-1">{company.name}</h3>
                  <p className="text-xs text-slate-500">{company.focus}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-6 h-6 text-primary-500" />
            <h2 className="section-title">Professional Certifications</h2>
          </div>
          <p className="text-slate-600 mb-6">Credentials that boost your career and demonstrate expertise.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <div key={i} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900">{cert.name}</h3>
                    <div className="text-xs text-primary-500 font-medium mt-0.5">{cert.org}</div>
                    <p className="text-xs text-slate-500 mt-1">{cert.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study abroad */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Plane className="w-6 h-6 text-primary-500" />
            <h2 className="section-title">Study Abroad Opportunities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { country: 'USA', desc: 'Home to top BME programs and MedTech hubs. F-1 visa with OPT STEM extension (3 years).', scholarships: 'Fulbright, NSF GRFP, university funding' },
              { country: 'Germany', desc: 'Low/no tuition at public universities. Strong medical device industry (Siemens, B. Braun).', scholarships: 'DAAD scholarships, university positions' },
              { country: 'UK', desc: '1-year MSc programs. Strong research output and NHS connections.', scholarships: 'Chevening, Commonwealth, university scholarships' },
              { country: 'Canada', desc: 'Affordable education, immigration-friendly policies, growing medtech sector.', scholarships: 'Vanier, NSERC, provincial funding' },
              { country: 'Australia', desc: 'Strong biomedical research programs, post-study work visas.', scholarships: 'Endeavour, RTP, university scholarships' },
              { country: 'Singapore', desc: 'Hub for medical technology in Asia, strong industry-academia links.', scholarships: 'SINGA, NUS/NTU scholarships' },
            ].map((item, i) => (
              <div key={i} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-primary-500" />
                  <h3 className="font-semibold text-slate-900">{item.country}</h3>
                </div>
                <p className="text-xs text-slate-600 mb-2">{item.desc}</p>
                <div className="text-xs text-teal-600 font-medium">{item.scholarships}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 text-center">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="relative">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">Ready to Build Your Career?</h2>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">
              Master the devices, complete the labs, and earn certificates. Your BioMedVerse journey is the first step
              toward a rewarding career in biomedical engineering.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate('/library')} className="btn-primary flex items-center gap-2">
                Continue Learning
                <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/dashboard')} className="bg-white/10 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                View My Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
