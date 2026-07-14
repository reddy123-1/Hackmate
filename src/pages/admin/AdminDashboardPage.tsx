import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, FileText, Plus, ArrowUpRight, Clock } from 'lucide-react';
import { getAllHackathons } from '../../services/hackathons';
import { getAllApplications } from '../../services/applications';
import { StatSkeleton } from '../../components/Skeletons';
import type { Hackathon, Application, DashboardStats } from '../../types';
import { timeAgo, getStatusColor } from '../../utils';

function AnimatedStat({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider dark:text-surface-500 text-surface-500">{label}</span>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-3xl font-bold dark:text-white text-surface-900">{count}</div>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ totalHackathons: 0, openHackathons: 0, closedHackathons: 0, totalApplications: 0 });
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [hackathons, apps] = await Promise.all([getAllHackathons(), getAllApplications()]);
      setStats({
        totalHackathons: hackathons.length,
        openHackathons: hackathons.filter((h) => h.status === 'open').length,
        closedHackathons: hackathons.filter((h) => h.status === 'closed').length,
        totalApplications: apps.length,
      });
      setRecentApps(apps.slice(0, 5));
    } catch {
      // Demo data
      setStats({ totalHackathons: 6, openHackathons: 4, closedHackathons: 1, totalApplications: 42 });
      setRecentApps([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white text-surface-900">Dashboard</h1>
          <p className="text-sm dark:text-surface-400 text-surface-600 mt-1">Overview of your hackathon platform</p>
        </div>
        <Link to="/admin/hackathons/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          New Hackathon
        </Link>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatedStat label="Total Hackathons" value={stats.totalHackathons} icon={Trophy} color="bg-brand-500/10 text-brand-400" />
          <AnimatedStat label="Open" value={stats.openHackathons} icon={Trophy} color="bg-emerald-500/10 text-emerald-400" />
          <AnimatedStat label="Closed" value={stats.closedHackathons} icon={Trophy} color="bg-red-500/10 text-red-400" />
          <AnimatedStat label="Applications" value={stats.totalApplications} icon={FileText} color="bg-purple-500/10 text-purple-400" />
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold dark:text-white text-surface-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link to="/admin/hackathons/new" className="glass-card rounded-xl p-4 flex items-center gap-3 dark:hover:bg-white/5 hover:bg-black/5 transition-all group">
            <div className="p-2 rounded-lg bg-brand-500/10">
              <Plus className="h-4 w-4 text-brand-400" />
            </div>
            <span className="text-sm font-medium dark:text-surface-200 text-surface-800">Create Hackathon</span>
            <ArrowUpRight className="h-4 w-4 dark:text-surface-600 text-surface-400 ml-auto group-hover:text-brand-400 transition-colors" />
          </Link>
          <Link to="/admin/hackathons" className="glass-card rounded-xl p-4 flex items-center gap-3 dark:hover:bg-white/5 hover:bg-black/5 transition-all group">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Trophy className="h-4 w-4 text-purple-400" />
            </div>
            <span className="text-sm font-medium dark:text-surface-200 text-surface-800">Manage Hackathons</span>
            <ArrowUpRight className="h-4 w-4 dark:text-surface-600 text-surface-400 ml-auto group-hover:text-brand-400 transition-colors" />
          </Link>
          <Link to="/admin/applications" className="glass-card rounded-xl p-4 flex items-center gap-3 dark:hover:bg-white/5 hover:bg-black/5 transition-all group">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <FileText className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-sm font-medium dark:text-surface-200 text-surface-800">View Applications</span>
            <ArrowUpRight className="h-4 w-4 dark:text-surface-600 text-surface-400 ml-auto group-hover:text-brand-400 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Recent Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white text-surface-900">Recent Applications</h2>
          <Link to="/admin/applications" className="text-xs text-brand-400 hover:text-brand-300 font-medium">
            View all →
          </Link>
        </div>
        <div className="glass-card rounded-xl overflow-hidden">
          {recentApps.length === 0 ? (
            <div className="p-8 text-center dark:text-surface-500 text-surface-500 text-sm">
              No applications yet. They'll show up here when people apply.
            </div>
          ) : (
            <div className="divide-y dark:divide-white/5 divide-black/5">
              {recentApps.map((app) => (
                <Link
                  key={app.id}
                  to={`/admin/applications`}
                  className="flex items-center gap-4 p-4 dark:hover:bg-white/[0.02] hover:bg-black/[0.02] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium dark:text-white text-surface-900 truncate">
                      {(app.data.firstName as string) || 'Unknown'} {(app.data.lastName as string) || ''}
                    </p>
                    <p className="text-xs dark:text-surface-500 text-surface-500 truncate">{app.hackathonName}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase border ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <span className="text-xs dark:text-surface-500 text-surface-500 flex items-center gap-1 shrink-0">
                    <Clock className="h-3 w-3" />
                    {timeAgo(app.submittedAt)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
