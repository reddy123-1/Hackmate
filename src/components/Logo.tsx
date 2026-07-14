import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: number;
}

export default function Logo({ className = '', iconOnly = false, size = 32 }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Gradients */}
        <defs>
          <linearGradient id="logo-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="logo-cyan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>

        {/* Connection Lines (Left Side - Blue) */}
        <line x1="20" y1="15" x2="20" y2="85" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
        <line x1="20" y1="15" x2="50" y2="50" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
        <line x1="20" y1="85" x2="50" y2="50" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
        <line x1="20" y1="50" x2="50" y2="50" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />

        {/* Connection Lines (Right Side - Cyan) */}
        <line x1="80" y1="15" x2="80" y2="85" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />
        <line x1="80" y1="15" x2="50" y2="50" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />
        <line x1="80" y1="85" x2="50" y2="50" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />
        <line x1="80" y1="50" x2="50" y2="50" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />

        {/* Nodes (Circles) - Left Side (Blue) */}
        <circle cx="20" cy="15" r="7" fill="var(--color-bg, #ffffff)" className="dark:fill-surface-950 fill-white" stroke="#2563eb" strokeWidth="6" />
        <circle cx="20" cy="50" r="7" fill="var(--color-bg, #ffffff)" className="dark:fill-surface-950 fill-white" stroke="#2563eb" strokeWidth="6" />
        <circle cx="20" cy="85" r="7" fill="var(--color-bg, #ffffff)" className="dark:fill-surface-950 fill-white" stroke="#2563eb" strokeWidth="6" />

        {/* Nodes (Circles) - Right Side & Center (Cyan) */}
        <circle cx="80" cy="15" r="7" fill="var(--color-bg, #ffffff)" className="dark:fill-surface-950 fill-white" stroke="#06b6d4" strokeWidth="6" />
        <circle cx="80" cy="50" r="7" fill="var(--color-bg, #ffffff)" className="dark:fill-surface-950 fill-white" stroke="#06b6d4" strokeWidth="6" />
        <circle cx="80" cy="85" r="7" fill="var(--color-bg, #ffffff)" className="dark:fill-surface-950 fill-white" stroke="#06b6d4" strokeWidth="6" />
        <circle cx="50" cy="50" r="7" fill="var(--color-bg, #ffffff)" className="dark:fill-surface-950 fill-white" stroke="#06b6d4" strokeWidth="6" />
      </svg>

      {/* Brand Text */}
      {!iconOnly && (
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Hacker<span className="text-cyan-500 font-extrabold">Mate</span>
        </span>
      )}
    </div>
  );
}
