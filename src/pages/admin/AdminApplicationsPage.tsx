import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Download, Eye, X, FileText,
  ChevronDown, ExternalLink, Clock, MessageSquare,
} from 'lucide-react';
import { getAllApplications, updateApplicationStatus } from '../../services/applications';
import EmptyState from '../../components/EmptyState';
import { TableSkeleton } from '../../components/Skeletons';
import type { Application, ApplicationStatus } from '../../types';
import { formatDateTime, getStatusColor, timeAgo, exportToCSV } from '../../utils';
import toast from 'react-hot-toast';

const STATUS_OPTIONS: ApplicationStatus[] = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const data = await getAllApplications();
      setApplications(data);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: string, status: ApplicationStatus) => {
    try {
      await updateApplicationStatus(appId, status);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a)),
      );
      if (selectedApp?.id === appId) setSelectedApp((p) => p ? { ...p, status } : null);
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSaveNotes = async (appId: string) => {
    try {
      await updateApplicationStatus(appId, selectedApp?.status ?? 'pending', editNotes);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, adminNotes: editNotes } : a)),
      );
      toast.success('Notes saved');
    } catch {
      toast.error('Failed to save notes');
    }
  };

  const handleExport = () => {
    const data = filtered.map((a) => ({
      hackathon: a.hackathonName,
      status: a.status,
      submittedAt: a.submittedAt,
      ...Object.fromEntries(Object.entries(a.data).map(([k, v]) => [k, String(v)])),
    }));
    exportToCSV(data, `applications_${new Date().toISOString().slice(0, 10)}`);
    toast.success('Exported to CSV');
  };

  const filtered = applications.filter((a) => {
    const matchSearch = !search ||
      a.hackathonName.toLowerCase().includes(search.toLowerCase()) ||
      String(a.data.firstName ?? '').toLowerCase().includes(search.toLowerCase()) ||
      String(a.data.lastName ?? '').toLowerCase().includes(search.toLowerCase()) ||
      String(a.data.email ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white text-surface-900">Applications</h1>
          <p className="text-sm dark:text-surface-400 text-surface-600 mt-1">
            {applications.length} total application{applications.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={handleExport} className="btn-secondary">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 dark:text-surface-500 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field !pl-10"
            placeholder="Search by name, email, hackathon..."
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                : 'dark:bg-white/5 bg-black/5 dark:text-surface-400 text-surface-600 border border-transparent'
            }`}
          >
            All
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                statusFilter === s
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                  : 'dark:bg-white/5 bg-black/5 dark:text-surface-400 text-surface-600 border border-transparent'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8 dark:text-surface-500 text-surface-400" />}
          title="No applications found"
          description={search || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Applications will appear here when people apply.'}
        />
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-white/5 border-black/5">
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider dark:text-surface-500 text-surface-500">Applicant</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider dark:text-surface-500 text-surface-500 hidden md:table-cell">Hackathon</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider dark:text-surface-500 text-surface-500 hidden sm:table-cell">Submitted</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider dark:text-surface-500 text-surface-500">Status</th>
                  <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider dark:text-surface-500 text-surface-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-white/5 divide-black/5">
                {filtered.map((app) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="dark:hover:bg-white/[0.02] hover:bg-black/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium dark:text-white text-surface-900">
                          {String(app.data.firstName ?? '')} {String(app.data.lastName ?? '')}
                        </p>
                        <p className="text-xs dark:text-surface-500 text-surface-500">{String(app.data.email ?? '')}</p>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm dark:text-surface-400 text-surface-600">{app.hackathonName}</span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-xs dark:text-surface-500 text-surface-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(app.submittedAt)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id!, e.target.value as ApplicationStatus)}
                          className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase border appearance-none cursor-pointer pr-6 ${getStatusColor(app.status)}`}
                          style={{ background: 'transparent' }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} className="dark:bg-surface-900 bg-white dark:text-white text-surface-900">{s}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => { setSelectedApp(app); setEditNotes(app.adminNotes); }}
                          className="p-2 rounded-lg dark:hover:bg-white/5 hover:bg-black/5 dark:text-surface-400 text-surface-600"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {app.resumeUrl && (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg dark:hover:bg-white/5 hover:bg-black/5 dark:text-surface-400 text-surface-600"
                            title="Download resume"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl glass-card rounded-2xl p-6 dark:bg-surface-900 bg-white mb-20"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold dark:text-white text-surface-900">Application Details</h2>
                  <p className="text-sm dark:text-surface-400 text-surface-600">{selectedApp.hackathonName}</p>
                </div>
                <button onClick={() => setSelectedApp(null)} className="p-2 rounded-lg dark:hover:bg-white/5 hover:bg-black/5">
                  <X className="h-5 w-5 dark:text-surface-400 text-surface-600" />
                </button>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs dark:text-surface-500 text-surface-500">Status:</span>
                <select
                  value={selectedApp.status}
                  onChange={(e) => handleStatusChange(selectedApp.id!, e.target.value as ApplicationStatus)}
                  className="input-field !w-auto !py-1.5"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <span className="text-xs dark:text-surface-500 text-surface-500 ml-auto">
                  Submitted {formatDateTime(selectedApp.submittedAt)}
                </span>
              </div>

              {/* Data */}
              <div className="space-y-3 mb-6">
                {Object.entries(selectedApp.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start gap-4 py-2 border-b dark:border-white/5 border-black/5">
                    <span className="text-xs dark:text-surface-500 text-surface-500 capitalize shrink-0">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm dark:text-surface-200 text-surface-800 text-right">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Resume */}
              {selectedApp.resumeUrl && (
                <a
                  href={selectedApp.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full justify-center mb-4"
                >
                  <Download className="h-4 w-4" />
                  Download Resume
                </a>
              )}

              {/* File URLs */}
              {selectedApp.fileUrls && Object.keys(selectedApp.fileUrls).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold dark:text-surface-300 text-surface-700 mb-2">Uploaded Files</h3>
                  <div className="space-y-1">
                    {Object.entries(selectedApp.fileUrls).map(([name, url]) => (
                      <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-brand-400 hover:text-brand-300">
                        <ExternalLink className="h-3 w-3" />
                        {name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 dark:text-surface-500 text-surface-400" />
                  <span className="text-xs font-semibold dark:text-surface-300 text-surface-700">Admin Notes</span>
                </div>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="input-field resize-none mb-2"
                  rows={3}
                  placeholder="Add private notes about this applicant..."
                />
                <button onClick={() => handleSaveNotes(selectedApp.id!)} className="btn-primary !py-1.5 !px-3 !text-xs">
                  Save Notes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
