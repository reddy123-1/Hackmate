import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2, Image, Upload, X } from 'lucide-react';
import { createHackathon, updateHackathon, getHackathonById } from '../../services/hackathons';
import { getFormSchema, saveFormSchema, DEFAULT_FORM_FIELDS } from '../../services/formSchemas';
import { uploadHackathonImage } from '../../services/storage';
import FormBuilder from '../../components/FormBuilder';
import type { Hackathon, HackathonMode, HackathonStatus, HackathonDifficulty, FormField } from '../../types';
import toast from 'react-hot-toast';

const INITIAL_HACKATHON: Omit<Hackathon, 'id'> = {
  name: '',
  logoUrl: '',
  bannerUrl: '',
  description: '',
  organizer: '',
  registrationDeadline: '',
  hackathonDate: '',
  location: '',
  mode: 'online',
  prizePool: '',
  teamSize: '',
  difficulty: 'all-levels',
  tags: [],
  shortDescription: '',
  timeline: '',
  rules: '',
  requirements: '',
  techStack: [],
  requiredSkills: [],
  preferredSkills: [],
  additionalNotes: '',
  status: 'draft',
  applicationDeadline: '',
  lookingFor: '',
  createdAt: '',
  updatedAt: '',
};

export default function HackathonFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [data, setData] = useState<Omit<Hackathon, 'id'>>(INITIAL_HACKATHON);
  const [formFields, setFormFields] = useState<FormField[]>([...DEFAULT_FORM_FIELDS]);
  const [tagInput, setTagInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [reqSkillInput, setReqSkillInput] = useState('');
  const [prefSkillInput, setPrefSkillInput] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<'details' | 'form'>('details');

  useEffect(() => {
    if (isEdit && id) loadExisting(id);
  }, [id]);

  const loadExisting = async (hackathonId: string) => {
    try {
      const h = await getHackathonById(hackathonId);
      if (h) {
        const { id: _, ...rest } = h;
        setData(rest);
      }
      const schema = await getFormSchema(hackathonId);
      if (schema) setFormFields(schema.fields);
    } catch {
      toast.error('Failed to load hackathon');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: unknown) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: string, value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    const arr = (data as any)[field] as string[];
    if (!arr.includes(value.trim())) {
      update(field, [...arr, value.trim()]);
    }
    setter('');
  };

  const removeFromArray = (field: string, value: string) => {
    update(field, ((data as any)[field] as string[]).filter((v: string) => v !== value));
  };

  const handleSave = async () => {
    if (!data.name) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      let hackathonId = id;

      // Upload images
      let logoUrl = data.logoUrl;
      let bannerUrl = data.bannerUrl;
      const tempId = id || `temp_${Date.now()}`;

      if (logoFile) {
        logoUrl = await uploadHackathonImage(logoFile, 'logo', tempId);
      }
      if (bannerFile) {
        bannerUrl = await uploadHackathonImage(bannerFile, 'banner', tempId);
      }

      const saveData = { ...data, logoUrl, bannerUrl };

      if (isEdit && id) {
        await updateHackathon(id, saveData);
      } else {
        hackathonId = await createHackathon(saveData);
      }

      // Save form schema
      if (hackathonId) {
        await saveFormSchema(hackathonId, {
          hackathonId,
          fields: formFields,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      toast.success(isEdit ? 'Hackathon updated!' : 'Hackathon created!');
      navigate('/admin/hackathons');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-1/3 skeleton" />
        <div className="h-64 skeleton rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg dark:hover:bg-white/5 hover:bg-black/5">
            <ArrowLeft className="h-4 w-4 dark:text-surface-400 text-surface-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold dark:text-white text-surface-900">
              {isEdit ? 'Edit Hackathon' : 'Create Hackathon'}
            </h1>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleSave}
          disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save'}
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 dark:bg-white/5 bg-black/5 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'details'
              ? 'bg-brand-500/20 text-brand-400'
              : 'dark:text-surface-400 text-surface-600 dark:hover:text-white hover:text-surface-900'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('form')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'form'
              ? 'bg-brand-500/20 text-brand-400'
              : 'dark:text-surface-400 text-surface-600 dark:hover:text-white hover:text-surface-900'
          }`}
        >
          Application Form
        </button>
      </div>

      {activeTab === 'details' ? (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold dark:text-white text-surface-900 mb-2">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Name *</label>
                <input type="text" value={data.name} onChange={(e) => update('name', e.target.value)} className="input-field" placeholder="Hackathon name" />
              </div>
              <div>
                <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Organizer</label>
                <input type="text" value={data.organizer} onChange={(e) => update('organizer', e.target.value)} className="input-field" placeholder="Organization" />
              </div>
              <div>
                <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Location</label>
                <input type="text" value={data.location} onChange={(e) => update('location', e.target.value)} className="input-field" placeholder="City, Country" />
              </div>
              <div>
                <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Mode</label>
                <select value={data.mode} onChange={(e) => update('mode', e.target.value as HackathonMode)} className="input-field">
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Status</label>
                <select value={data.status} onChange={(e) => update('status', e.target.value as HackathonStatus)} className="input-field">
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Difficulty</label>
                <select value={data.difficulty} onChange={(e) => update('difficulty', e.target.value as HackathonDifficulty)} className="input-field">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="all-levels">All Levels</option>
                </select>
              </div>
              <div>
                <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Prize Pool</label>
                <input type="text" value={data.prizePool} onChange={(e) => update('prizePool', e.target.value)} className="input-field" placeholder="$10,000" />
              </div>
              <div>
                <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Team Size</label>
                <input type="text" value={data.teamSize} onChange={(e) => update('teamSize', e.target.value)} className="input-field" placeholder="2-4" />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold dark:text-white text-surface-900 mb-2">Dates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Hackathon Date</label>
                <input type="date" value={data.hackathonDate} onChange={(e) => update('hackathonDate', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Registration Deadline</label>
                <input type="datetime-local" value={data.registrationDeadline} onChange={(e) => update('registrationDeadline', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Application Deadline</label>
                <input type="date" value={data.applicationDeadline} onChange={(e) => update('applicationDeadline', e.target.value)} className="input-field" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold dark:text-white text-surface-900 mb-2">Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Logo</label>
                {data.logoUrl || logoFile ? (
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden dark:bg-white/5 bg-black/5">
                    <img src={logoFile ? URL.createObjectURL(logoFile) : data.logoUrl} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => { setLogoFile(null); update('logoUrl', ''); }} className="absolute top-1 right-1 p-0.5 rounded bg-black/50 text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center h-20 w-20 rounded-xl border-2 border-dashed dark:border-white/10 border-black/10 cursor-pointer dark:hover:border-brand-500/30 hover:border-brand-500/30 transition-colors">
                    <Upload className="h-5 w-5 dark:text-surface-500 text-surface-400" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && setLogoFile(e.target.files[0])} />
                  </label>
                )}
              </div>
              <div>
                <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Banner</label>
                {data.bannerUrl || bannerFile ? (
                  <div className="relative h-20 rounded-xl overflow-hidden dark:bg-white/5 bg-black/5">
                    <img src={bannerFile ? URL.createObjectURL(bannerFile) : data.bannerUrl} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => { setBannerFile(null); update('bannerUrl', ''); }} className="absolute top-1 right-1 p-0.5 rounded bg-black/50 text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center h-20 rounded-xl border-2 border-dashed dark:border-white/10 border-black/10 cursor-pointer dark:hover:border-brand-500/30 hover:border-brand-500/30 transition-colors">
                    <div className="text-center">
                      <Image className="h-5 w-5 mx-auto dark:text-surface-500 text-surface-400 mb-1" />
                      <span className="text-[10px] dark:text-surface-500 text-surface-400">Upload banner</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && setBannerFile(e.target.files[0])} />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold dark:text-white text-surface-900 mb-2">Content</h2>
            <div>
              <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Short Description</label>
              <textarea value={data.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} className="input-field resize-none" rows={2} placeholder="Brief one-liner" />
            </div>
            <div>
              <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Full Description</label>
              <textarea value={data.description} onChange={(e) => update('description', e.target.value)} className="input-field resize-none" rows={6} placeholder="Detailed description" />
            </div>
            <div>
              <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Looking For (Teammates)</label>
              <textarea value={data.lookingFor} onChange={(e) => update('lookingFor', e.target.value)} className="input-field resize-none" rows={3} placeholder="Describe ideal teammates" />
            </div>
            <div>
              <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Timeline</label>
              <textarea value={data.timeline} onChange={(e) => update('timeline', e.target.value)} className="input-field resize-none" rows={4} placeholder="Day 1: ...\nDay 2: ..." />
            </div>
            <div>
              <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Rules</label>
              <textarea value={data.rules} onChange={(e) => update('rules', e.target.value)} className="input-field resize-none" rows={4} />
            </div>
            <div>
              <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Requirements</label>
              <textarea value={data.requirements} onChange={(e) => update('requirements', e.target.value)} className="input-field resize-none" rows={3} />
            </div>
            <div>
              <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">Additional Notes</label>
              <textarea value={data.additionalNotes} onChange={(e) => update('additionalNotes', e.target.value)} className="input-field resize-none" rows={3} />
            </div>
          </div>

          {/* Tags & Skills */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold dark:text-white text-surface-900 mb-2">Tags & Skills</h2>

            {[
              { label: 'Tags', field: 'tags', input: tagInput, setter: setTagInput },
              { label: 'Tech Stack', field: 'techStack', input: techInput, setter: setTechInput },
              { label: 'Required Skills', field: 'requiredSkills', input: reqSkillInput, setter: setReqSkillInput },
              { label: 'Preferred Skills', field: 'preferredSkills', input: prefSkillInput, setter: setPrefSkillInput },
            ].map(({ label, field, input, setter }) => (
              <div key={field}>
                <label className="text-xs dark:text-surface-400 text-surface-600 mb-1.5 block">{label}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setter(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray(field, input, setter))}
                    className="input-field flex-1"
                    placeholder={`Add ${label.toLowerCase()} and press Enter`}
                  />
                  <button
                    type="button"
                    onClick={() => addToArray(field, input, setter)}
                    className="btn-secondary !py-2"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {((data as any)[field] as string[]).map((item: string) => (
                    <span key={item} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium dark:bg-white/5 bg-black/5 dark:text-surface-300 text-surface-700">
                      {item}
                      <button type="button" onClick={() => removeFromArray(field, item)} className="text-red-400 hover:text-red-300">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Form Builder Tab */
        <div className="glass-card rounded-xl p-6">
          <FormBuilder fields={formFields} onChange={setFormFields} />
        </div>
      )}
    </div>
  );
}
