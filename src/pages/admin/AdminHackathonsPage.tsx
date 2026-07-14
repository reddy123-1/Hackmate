import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Copy, Eye, MoreHorizontal, Search, Trophy } from 'lucide-react';
import { getAllHackathons, deleteHackathon, createHackathon } from '../../services/hackathons';
import { getFormSchema, saveFormSchema } from '../../services/formSchemas';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import { TableSkeleton } from '../../components/Skeletons';
import type { Hackathon } from '../../types';
import { formatDate, getStatusColor, getModeColor } from '../../utils';
import toast from 'react-hot-toast';

export default function AdminHackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const data = await getAllHackathons();
      setHackathons(data);
    } catch {
      setHackathons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteHackathon(deleteTarget);
      setHackathons((prev) => prev.filter((h) => h.id !== deleteTarget));
      toast.success('Hackathon deleted');
    } catch {
      toast.error('Failed to delete');
    }
    setDeleteTarget(null);
  };

  const handleDuplicate = async (hackathon: Hackathon) => {
    try {
      const { id, ...data } = hackathon;
      const newId = await createHackathon({
        ...data,
        name: `${data.name} (Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      // Copy form schema too
      if (id) {
        const schema = await getFormSchema(id);
        if (schema) {
          await saveFormSchema(newId, { ...schema, hackathonId: newId });
        }
      }
      toast.success('Hackathon duplicated');
      load();
    } catch {
      toast.error('Failed to duplicate');
    }
  };

  const filtered = hackathons.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.organizer.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white text-surface-900">Hackathons</h1>
          <p className="text-sm dark:text-surface-400 text-surface-600 mt-1">Manage your hackathon listings</p>
        </div>
        <Link to="/admin/hackathons/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Create
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 dark:text-surface-500 text-surface-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field !pl-10"
          placeholder="Search hackathons..."
        />
      </div>

      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No hackathons yet"
          description="Create your first hackathon listing to get started."
          action={
            <Link to="/admin/hackathons/new" className="btn-primary">
              <Plus className="h-4 w-4" />
              Create Hackathon
            </Link>
          }
        />
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-white/5 border-black/5">
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider dark:text-surface-500 text-surface-500">Hackathon</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider dark:text-surface-500 text-surface-500 hidden sm:table-cell">Mode</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider dark:text-surface-500 text-surface-500 hidden md:table-cell">Deadline</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider dark:text-surface-500 text-surface-500">Status</th>
                  <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider dark:text-surface-500 text-surface-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-white/5 divide-black/5">
                {filtered.map((h) => (
                  <motion.tr
                    key={h.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="dark:hover:bg-white/[0.02] hover:bg-black/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg dark:bg-white/5 bg-black/5 flex items-center justify-center shrink-0 overflow-hidden">
                          {h.logoUrl ? (
                            <img src={h.logoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Trophy className="h-4 w-4 text-brand-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium dark:text-white text-surface-900">{h.name}</p>
                          <p className="text-xs dark:text-surface-500 text-surface-500">{h.organizer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase border ${getModeColor(h.mode)}`}>
                        {h.mode}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm dark:text-surface-400 text-surface-600">{formatDate(h.registrationDeadline)}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${getStatusColor(h.status)}`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => window.open(`/hackathon/${h.id}`, '_blank')}
                          className="p-2 rounded-lg dark:hover:bg-white/5 hover:bg-black/5 dark:text-surface-400 text-surface-600"
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/hackathons/${h.id}/edit`)}
                          className="p-2 rounded-lg dark:hover:bg-white/5 hover:bg-black/5 dark:text-surface-400 text-surface-600"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(h)}
                          className="p-2 rounded-lg dark:hover:bg-white/5 hover:bg-black/5 dark:text-surface-400 text-surface-600"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(h.id ?? null)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Hackathon"
        message="Are you sure you want to delete this hackathon? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
