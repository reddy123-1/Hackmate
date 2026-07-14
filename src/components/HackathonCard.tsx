import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy, Bookmark, Share2, Clock } from 'lucide-react';
import type { Hackathon } from '../types';
import { formatDate, getModeColor, getStatusColor, truncate, getCountdown, copyToClipboard } from '../utils';
import { useBookmarks } from '../hooks/useBookmarks';
import toast from 'react-hot-toast';

interface Props {
  hackathon: Hackathon;
  index?: number;
}

export default function HackathonCard({ hackathon, index = 0 }: Props) {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const countdown = getCountdown(hackathon.registrationDeadline);
  const bookmarked = isBookmarked(hackathon.id ?? '');

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/hackathon/${hackathon.id}`;
    copyToClipboard(url);
    toast.success('Link copied to clipboard!');
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(hackathon.id ?? '');
    toast.success(bookmarked ? 'Bookmark removed' : 'Hackathon bookmarked!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/hackathon/${hackathon.id}`)}
      className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-xl hover:shadow-brand-500/5"
    >
      {/* Banner */}
      <div className="relative h-36 overflow-hidden">
        {hackathon.bannerUrl ? (
          <img src={hackathon.bannerUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-600/30 via-purple-600/20 to-pink-600/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Top actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button onClick={handleBookmark} className="p-1.5 rounded-lg bg-black/30 backdrop-blur-sm text-white/80 hover:text-white transition-colors">
            <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-current text-brand-400' : ''}`} />
          </button>
          <button onClick={handleShare} className="p-1.5 rounded-lg bg-black/30 backdrop-blur-sm text-white/80 hover:text-white transition-colors">
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getStatusColor(hackathon.status)}`}>
            {hackathon.status}
          </span>
        </div>

        {/* Logo */}
        <div className="absolute -bottom-5 left-4">
          <div className="h-12 w-12 rounded-xl dark:bg-surface-800 bg-white shadow-lg overflow-hidden border-2 dark:border-surface-800 border-white flex items-center justify-center">
            {hackathon.logoUrl ? (
              <img src={hackathon.logoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Trophy className="h-5 w-5 text-brand-400" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-8">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="text-base font-semibold dark:text-white text-surface-900 group-hover:text-brand-400 transition-colors">
              {hackathon.name}
            </h3>
            <p className="text-xs dark:text-surface-500 text-surface-500 mt-0.5">{hackathon.organizer}</p>
          </div>
          <span className={`shrink-0 inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium uppercase border ${getModeColor(hackathon.mode)}`}>
            {hackathon.mode}
          </span>
        </div>

        <p className="text-sm dark:text-surface-400 text-surface-600 mb-3 leading-relaxed">
          {truncate(hackathon.shortDescription, 100)}
        </p>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs dark:text-surface-400 text-surface-600">
            <Calendar className="h-3 w-3 text-brand-400" />
            {formatDate(hackathon.hackathonDate)}
          </div>
          <div className="flex items-center gap-1.5 text-xs dark:text-surface-400 text-surface-600">
            <MapPin className="h-3 w-3 text-brand-400" />
            {hackathon.location || 'Online'}
          </div>
          <div className="flex items-center gap-1.5 text-xs dark:text-surface-400 text-surface-600">
            <Users className="h-3 w-3 text-brand-400" />
            Team: {hackathon.teamSize}
          </div>
          <div className="flex items-center gap-1.5 text-xs dark:text-surface-400 text-surface-600">
            <Trophy className="h-3 w-3 text-brand-400" />
            {hackathon.prizePool || 'TBA'}
          </div>
        </div>

        {/* Tags */}
        {hackathon.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {hackathon.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-medium dark:bg-white/5 bg-black/5 dark:text-surface-400 text-surface-600">
                {tag}
              </span>
            ))}
            {hackathon.tags.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] dark:text-surface-500 text-surface-500">
                +{hackathon.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Countdown / Apply */}
        <div className="flex items-center justify-between pt-3 border-t dark:border-white/5 border-black/5">
          {hackathon.status === 'open' && !countdown.expired ? (
            <div className="flex items-center gap-1.5 text-xs">
              <Clock className="h-3 w-3 text-amber-400" />
              <span className="dark:text-surface-300 text-surface-700 font-medium">
                {countdown.days}d {countdown.hours}h {countdown.minutes}m left
              </span>
            </div>
          ) : (
            <span className="text-xs dark:text-surface-500 text-surface-500">
              {hackathon.status === 'closed' ? 'Applications closed' : 'Deadline: ' + formatDate(hackathon.registrationDeadline)}
            </span>
          )}
          <button className="btn-primary !px-3 !py-1.5 !text-xs">
            {hackathon.status === 'open' ? 'Apply' : 'View'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
