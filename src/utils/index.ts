import { format, formatDistanceToNow, isPast, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

export const formatDate = (date: string) => {
  if (!date) return '—';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date: string) => {
  if (!date) return '—';
  return format(new Date(date), 'MMM dd, yyyy · h:mm a');
};

export const timeAgo = (date: string) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isDeadlinePassed = (deadline: string) => {
  if (!deadline) return false;
  return isPast(new Date(deadline));
};

export const getCountdown = (deadline: string) => {
  if (!deadline) return { days: 0, hours: 0, minutes: 0, expired: true };
  const target = new Date(deadline);
  if (isPast(target)) return { days: 0, hours: 0, minutes: 0, expired: true };
  const now = new Date();
  return {
    days: differenceInDays(target, now),
    hours: differenceInHours(target, now) % 24,
    minutes: differenceInMinutes(target, now) % 60,
    expired: false,
  };
};

export const cn = (...classes: (string | false | undefined | null)[]) =>
  classes.filter(Boolean).join(' ');

export const truncate = (str: string, max: number) =>
  str.length > max ? str.slice(0, max) + '…' : str;

export const slugify = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

export const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => {
        const val = String(row[h] ?? '');
        return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(','),
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const getModeColor = (mode: string) => {
  switch (mode) {
    case 'online': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'offline': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'hybrid': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'closed': return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'draft': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case 'reviewed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'shortlisted': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'accepted': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
  }
};
