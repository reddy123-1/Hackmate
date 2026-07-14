import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Calendar, MapPin, Users, Trophy, Clock,
  Code2, CheckCircle, Star, Share2, Bookmark, X,
  ExternalLink, AlertCircle,
} from 'lucide-react';
import { getHackathonById } from '../services/hackathons';
import { getFormSchema, DEFAULT_FORM_FIELDS } from '../services/formSchemas';
import { submitApplication } from '../services/applications';
import { uploadResume, uploadGenericFile } from '../services/storage';
import DynamicFormRenderer from '../components/DynamicFormRenderer';
import { CardSkeleton } from '../components/Skeletons';
import type { Hackathon, FormField } from '../types';
import { formatDate, getCountdown, getModeColor, getStatusColor, copyToClipboard } from '../utils';
import { useBookmarks } from '../hooks/useBookmarks';
import toast from 'react-hot-toast';

export default function HackathonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplication, setShowApplication] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(id ?? '');
  const countdown = hackathon ? getCountdown(hackathon.registrationDeadline) : null;

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    try {
      const h = await getHackathonById(id);
      setHackathon(h);
      const schema = await getFormSchema(id);
      setFormFields(schema?.fields ?? DEFAULT_FORM_FIELDS);
    } catch {
      // Use demo data
      setHackathon(getDemoHackathon(id));
      setFormFields(DEFAULT_FORM_FIELDS);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = async (data: Record<string, unknown>, files: Record<string, File | File[]>) => {
    if (!hackathon || !id) return;
    const fileUrls: Record<string, string> = {};

    for (const [fieldId, file] of Object.entries(files)) {
      if (Array.isArray(file)) {
        for (const f of file) {
          const url = await uploadGenericFile(f, id, fieldId);
          fileUrls[`${fieldId}_${f.name}`] = url;
        }
      } else {
        const email = (data.email as string) || 'unknown';
        if (fieldId === 'resume') {
          fileUrls.resume = await uploadResume(file, id, email);
        } else {
          fileUrls[fieldId] = await uploadGenericFile(file, id, fieldId);
        }
      }
    }

    await submitApplication({
      hackathonId: id,
      hackathonName: hackathon.name,
      data,
      resumeUrl: fileUrls.resume || '',
      fileUrls,
      status: 'pending',
      adminNotes: '',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  if (loading) {
    return (
      <div className="pt-20 pb-12 max-w-4xl mx-auto px-4">
        <div className="h-64 skeleton rounded-2xl mb-8" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 skeleton" />
          <div className="h-4 w-1/3 skeleton" />
          <div className="h-4 w-full skeleton" />
          <div className="h-4 w-4/5 skeleton" />
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="pt-20 pb-12 text-center">
        <AlertCircle className="h-12 w-12 mx-auto dark:text-surface-500 text-surface-400 mb-4" />
        <h2 className="text-xl font-bold dark:text-white text-surface-900 mb-2">Hackathon Not Found</h2>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        {hackathon.bannerUrl ? (
          <img src={hackathon.bannerUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-600/40 via-purple-600/30 to-pink-600/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-surface-950/20 to-transparent dark:from-surface-950/80 dark:via-surface-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent dark:from-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 -mt-16 relative z-10 pb-24">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 btn-ghost !text-surface-300 hover:!text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
          <div className="h-16 w-16 rounded-2xl dark:bg-surface-800 bg-white shadow-xl overflow-hidden border-2 dark:border-surface-700 border-surface-200 flex items-center justify-center shrink-0">
            {hackathon.logoUrl ? (
              <img src={hackathon.logoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Trophy className="h-7 w-7 text-brand-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold dark:text-white text-surface-900">{hackathon.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border ${getStatusColor(hackathon.status)}`}>
                {hackathon.status}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase border ${getModeColor(hackathon.mode)}`}>
                {hackathon.mode}
              </span>
            </div>
            <p className="dark:text-surface-400 text-surface-600 text-sm">by {hackathon.organizer}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => { toggleBookmark(hackathon.id ?? ''); toast.success(bookmarked ? 'Removed' : 'Bookmarked!'); }}
              className="btn-secondary !py-2"
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current text-brand-400' : ''}`} />
            </button>
            <button
              onClick={() => { copyToClipboard(window.location.href); toast.success('Link copied!'); }}
              className="btn-secondary !py-2"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Calendar, label: 'Date', value: formatDate(hackathon.hackathonDate) },
            { icon: MapPin, label: 'Location', value: hackathon.location || 'Online' },
            { icon: Users, label: 'Team Size', value: hackathon.teamSize },
            { icon: Trophy, label: 'Prize Pool', value: hackathon.prizePool || 'TBA' },
          ].map((item) => (
            <div key={item.label} className="glass-card rounded-xl p-4 text-center">
              <item.icon className="h-4 w-4 text-brand-400 mx-auto mb-2" />
              <p className="text-[10px] dark:text-surface-500 text-surface-500 uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-semibold dark:text-white text-surface-900 mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Countdown */}
        {countdown && !countdown.expired && hackathon.status === 'open' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-4 mb-8 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium dark:text-white text-surface-900">Registration closes in</span>
            </div>
            <div className="flex gap-3">
              {[
                { value: countdown.days, label: 'Days' },
                { value: countdown.hours, label: 'Hours' },
                { value: countdown.minutes, label: 'Min' },
              ].map((t) => (
                <div key={t.label} className="text-center">
                  <div className="text-xl font-bold gradient-text">{t.value}</div>
                  <div className="text-[10px] dark:text-surface-500 text-surface-500">{t.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Description */}
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold dark:text-white text-surface-900 mb-3">About</h2>
            <p className="dark:text-surface-400 text-surface-600 text-sm leading-relaxed whitespace-pre-wrap">
              {hackathon.description || hackathon.shortDescription}
            </p>
          </div>

          {hackathon.lookingFor && (
            <div>
              <h2 className="text-lg font-semibold dark:text-white text-surface-900 mb-3">Looking For</h2>
              <p className="dark:text-surface-400 text-surface-600 text-sm leading-relaxed">{hackathon.lookingFor}</p>
            </div>
          )}

          {/* Tech Stack */}
          {hackathon.techStack?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold dark:text-white text-surface-900 mb-3">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {hackathon.techStack.map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-lg text-xs font-medium dark:bg-white/5 bg-black/5 dark:text-surface-300 text-surface-700 border dark:border-white/5 border-black/5 flex items-center gap-1.5">
                    <Code2 className="h-3 w-3 text-brand-400" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="grid sm:grid-cols-2 gap-6">
            {hackathon.requiredSkills?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold dark:text-white text-surface-900 mb-3">Required Skills</h2>
                <ul className="space-y-1.5">
                  {hackathon.requiredSkills.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm dark:text-surface-400 text-surface-600">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {hackathon.preferredSkills?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold dark:text-white text-surface-900 mb-3">Preferred Skills</h2>
                <ul className="space-y-1.5">
                  {hackathon.preferredSkills.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm dark:text-surface-400 text-surface-600">
                      <Star className="h-3.5 w-3.5 text-amber-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Tags */}
          {hackathon.tags?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold dark:text-white text-surface-900 mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {hackathon.tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hackathon.timeline && (
            <div>
              <h2 className="text-lg font-semibold dark:text-white text-surface-900 mb-3">Timeline</h2>
              <p className="dark:text-surface-400 text-surface-600 text-sm leading-relaxed whitespace-pre-wrap">{hackathon.timeline}</p>
            </div>
          )}

          {hackathon.rules && (
            <div>
              <h2 className="text-lg font-semibold dark:text-white text-surface-900 mb-3">Rules</h2>
              <p className="dark:text-surface-400 text-surface-600 text-sm leading-relaxed whitespace-pre-wrap">{hackathon.rules}</p>
            </div>
          )}

          {hackathon.requirements && (
            <div>
              <h2 className="text-lg font-semibold dark:text-white text-surface-900 mb-3">Requirements</h2>
              <p className="dark:text-surface-400 text-surface-600 text-sm leading-relaxed whitespace-pre-wrap">{hackathon.requirements}</p>
            </div>
          )}

          {hackathon.additionalNotes && (
            <div>
              <h2 className="text-lg font-semibold dark:text-white text-surface-900 mb-3">Additional Notes</h2>
              <p className="dark:text-surface-400 text-surface-600 text-sm leading-relaxed whitespace-pre-wrap">{hackathon.additionalNotes}</p>
            </div>
          )}
        </div>

        {/* Apply CTA */}
        <div className="mt-12">
          {hackathon.status === 'open' ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowApplication(true)}
              className="btn-primary w-full justify-center py-4 text-lg"
            >
              Apply Now
            </motion.button>
          ) : (
            <div className="text-center py-6 glass-card rounded-xl">
              <p className="dark:text-surface-400 text-surface-600">Applications are currently closed.</p>
            </div>
          )}
        </div>

        {/* Application Modal */}
        <AnimatePresence>
          {showApplication && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/60 backdrop-blur-sm overflow-y-auto"
              onClick={() => setShowApplication(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl glass-card rounded-2xl p-6 sm:p-8 dark:bg-surface-900 bg-white mb-20"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold dark:text-white text-surface-900">Apply to {hackathon.name}</h2>
                    <p className="text-sm dark:text-surface-400 text-surface-600 mt-1">Fill in the form below to submit your application.</p>
                  </div>
                  <button onClick={() => setShowApplication(false)} className="p-2 rounded-lg dark:hover:bg-white/5 hover:bg-black/5">
                    <X className="h-5 w-5 dark:text-surface-400 text-surface-600" />
                  </button>
                </div>
                <DynamicFormRenderer
                  fields={formFields}
                  onSubmit={handleApplicationSubmit}
                  hackathonName={hackathon.name}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getDemoHackathon(id: string): Hackathon {
  return {
    id,
    name: 'AI Innovation Summit 2026',
    logoUrl: '',
    bannerUrl: '',
    description: 'Build the next generation of AI-powered applications. This hackathon brings together the brightest minds in artificial intelligence and machine learning to create innovative solutions for real-world problems.\n\nJoin us for 48 hours of non-stop hacking, mentorship from industry experts, and the chance to win amazing prizes.',
    organizer: 'TechCorp Labs',
    registrationDeadline: '2026-08-15T23:59:00Z',
    hackathonDate: '2026-09-01',
    location: 'San Francisco, CA',
    mode: 'hybrid',
    prizePool: '$50,000',
    teamSize: '2-4',
    difficulty: 'advanced',
    tags: ['AI', 'Machine Learning', 'LLM', 'Python', 'TensorFlow'],
    shortDescription: 'Build the next generation of AI-powered applications.',
    timeline: 'Day 1: Opening ceremony, team formation, hacking begins\nDay 2: Continued hacking, mentorship sessions\nDay 3: Final submissions, demos, judging, awards',
    rules: '• Teams of 2-4 members\n• All code must be written during the hackathon\n• Use of pre-existing libraries and APIs is allowed\n• Projects must incorporate AI/ML components',
    requirements: '• Basic knowledge of machine learning\n• Laptop with development environment\n• GitHub account',
    techStack: ['Python', 'TensorFlow', 'PyTorch', 'React', 'Node.js'],
    requiredSkills: ['Python', 'Machine Learning basics', 'Git'],
    preferredSkills: ['LLM expertise', 'Computer Vision', 'Full-stack development'],
    additionalNotes: 'Meals and snacks will be provided. Accommodation is available for out-of-town participants.',
    status: 'open',
    applicationDeadline: '2026-08-15',
    lookingFor: 'We are looking for ML engineers who can build and train models, frontend developers who can create compelling demos, and designers who can make our project shine.',
    createdAt: '2026-07-01T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z',
  };
}
