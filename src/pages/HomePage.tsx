import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Search, Filter, Code2, Cpu, Globe, Blocks, ChevronDown, ExternalLink, Mail, MapPin, Calendar, Send, Link2 } from 'lucide-react';
import HackathonCard from '../components/HackathonCard';
import { CardSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';
import type { Hackathon } from '../types';
import { getPublishedHackathons } from '../services/hackathons';
import toast from 'react-hot-toast';

const FILTER_TAGS = [
  { label: 'All', value: 'all' },
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'AI', value: 'AI' },
  { label: 'Web', value: 'Web' },
  { label: 'Blockchain', value: 'Blockchain' },
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Newest', value: 'newest' },
];

const STATS = [
  { label: 'Hackathons Listed', value: 50, suffix: '+' },
  { label: 'Applications', value: 1200, suffix: '+' },
  { label: 'Team Formed', value: 300, suffix: '+' },
  { label: 'Countries', value: 25, suffix: '+' },
];

const SKILLS = ['React', 'TypeScript', 'Node.js', 'Python', 'AI/ML', 'Firebase', 'UI/UX', 'Next.js'];
const PAST_HACKS = ['Google DevFest', 'TRAE Hackathon'];

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  useEffect(() => {
    loadHackathons();
  }, []);

  const loadHackathons = async () => {
    try {
      const data = await getPublishedHackathons();
      setHackathons(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load hackathons');
      setHackathons([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = hackathons.filter((h) => {
    const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      h.organizer.toLowerCase().includes(search.toLowerCase());

    let matchFilter = true;
    if (activeFilter === 'online' || activeFilter === 'offline' || activeFilter === 'hybrid') {
      matchFilter = h.mode === activeFilter;
    } else if (activeFilter === 'open' || activeFilter === 'closed') {
      matchFilter = h.status === activeFilter;
    } else if (['AI', 'Web', 'Blockchain'].includes(activeFilter)) {
      matchFilter = h.tags.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase()));
    } else if (activeFilter === 'upcoming') {
      matchFilter = new Date(h.hackathonDate) > new Date();
    }
    return matchSearch && matchFilter;
  });

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated grid */}
        <div className="absolute inset-0 dot-grid opacity-30" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-brand-500/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/8 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-pink-500/6 blur-[80px] animate-float" />

        <motion.div style={{ y: heroY }} className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >


            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              <span className="dark:text-white text-surface-900">Find Your Perfect</span>
              <br />
              <span className="gradient-text">Hackathon Team.</span>
            </h1>

            <p className="text-lg sm:text-xl dark:text-surface-400 text-surface-600 max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
              Connect with talented developers, designers, AI engineers, and innovators
              before registrations close.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="#hackathons"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary py-3 px-8 text-base"
              >
                Browse Hackathons
                <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="#about"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary py-3 px-8 text-base"
              >
                Learn More
              </motion.a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs dark:text-surface-500 text-surface-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs dark:text-surface-500 text-surface-500">Scroll to explore</span>
          <ChevronDown className="h-4 w-4 dark:text-surface-500 text-surface-500 animate-bounce" />
        </motion.div>
      </section>

      {/* About Me */}
      <section id="about" className="py-24 relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest">About Me</span>
            <h2 className="text-3xl sm:text-4xl font-bold dark:text-white text-surface-900 mt-3">
              The Person Behind HackerMate
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden gradient-border">
                  <div className="w-full h-full bg-gradient-to-br from-brand-600/20 via-purple-600/20 to-pink-600/20 flex items-center justify-center">
                    <span className="text-6xl">👨‍💻</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 glass-card rounded-xl px-4 py-2">
                  <span className="text-sm font-medium gradient-text">Open to Collaborate</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-bold dark:text-white text-surface-900 mb-1">
                  {/* EDIT: Replace with your name */}
                  TEJAS R
                </h3>
                <p className="text-brand-400 font-medium text-sm">Full Stack Developer & AI Enthusiast</p>
              </div>

              <p className="dark:text-surface-400 text-surface-600 leading-relaxed text-sm">
                {/* EDIT: Replace with your bio */}
                Passionate full-stack developer with a love for building innovative solutions at hackathons.
                I specialize in creating web applications, AI-powered tools, and delightful user experiences.
                Always looking for talented teammates to collaborate with on the next big idea.
              </p>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider dark:text-surface-300 text-surface-700 mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-lg text-xs font-medium dark:bg-white/5 bg-black/5 dark:text-surface-300 text-surface-700 border dark:border-white/5 border-black/5">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider dark:text-surface-300 text-surface-700 mb-3">Past Hackathons</h4>
                <div className="flex flex-wrap gap-2">
                  {PAST_HACKS.map((hack) => (
                    <span key={hack} className="px-3 py-1 rounded-lg text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {hack}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {/* EDIT: Replace with your links */}
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl dark:bg-white/5 bg-black/5 dark:text-surface-400 text-surface-600 hover:text-brand-400 transition-all">
                  <Code2 className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl dark:bg-white/5 bg-black/5 dark:text-surface-400 text-surface-600 hover:text-brand-400 transition-all">
                  <Link2 className="h-5 w-5" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl dark:bg-white/5 bg-black/5 dark:text-surface-400 text-surface-600 hover:text-brand-400 transition-all">
                  <ExternalLink className="h-5 w-5" />
                </a>
                <a href="mailto:your@email.com" className="p-2.5 rounded-xl dark:bg-white/5 bg-black/5 dark:text-surface-400 text-surface-600 hover:text-brand-400 transition-all">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hackathons */}
      <section id="hackathons" className="py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest">Explore</span>
            <h2 className="text-3xl sm:text-4xl font-bold dark:text-white text-surface-900 mt-3 mb-4">
              Upcoming Hackathons
            </h2>
            <p className="dark:text-surface-400 text-surface-600 max-w-lg mx-auto text-sm">
              Browse through curated hackathons and find the perfect one to showcase your skills.
            </p>
          </motion.div>

          {/* Search & Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 dark:text-surface-500 text-surface-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hackathons, tags, organizers..."
                className="input-field !pl-11 !py-3"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {FILTER_TAGS.map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => setActiveFilter(tag.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeFilter === tag.value
                      ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                      : 'dark:bg-white/5 bg-black/5 dark:text-surface-400 text-surface-600 border border-transparent dark:hover:bg-white/10 hover:bg-black/10'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title={hackathons.length === 0 ? "No hackathons available" : "No hackathons found"}
              description={hackathons.length === 0 ? "Check back later for newly published hackathons!" : "Try adjusting your search or filters to find what you're looking for."}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((h, i) => (
                <HackathonCard key={h.id} hackathon={h} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 relative">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest">Get in Touch</span>
            <h2 className="text-3xl sm:text-4xl font-bold dark:text-white text-surface-900 mt-3 mb-4">
              Let's Build Together
            </h2>
            <p className="dark:text-surface-400 text-surface-600 text-sm">
              Have a hackathon idea or want to team up? Drop me a message.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8"
          >
            <form onSubmit={(e) => { e.preventDefault(); toast.success('Message sent! (Demo)'); }} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium dark:text-surface-200 text-surface-800 mb-1.5 block">Name</label>
                  <input type="text" className="input-field" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-surface-200 text-surface-800 mb-1.5 block">Email</label>
                  <input type="email" className="input-field" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium dark:text-surface-200 text-surface-800 mb-1.5 block">Message</label>
                <textarea rows={5} className="input-field resize-none" placeholder="Tell me about your hackathon idea..." />
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-3">
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
}


