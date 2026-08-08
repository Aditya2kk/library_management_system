import React from 'react';

const COLORS = [
  { bg: '#EFF6FF', text: '#2563EB' },
  { bg: '#F0FDF4', text: '#16A34A' },
  { bg: '#EEF2FF', text: '#4F46E5' },
  { bg: '#CCFBF1', text: '#0D9488' },
  { bg: '#FEF3C7', text: '#D97706' },
];

export function Avatar({ name = '', size = 'md', className = '' }) {
  const getInitials = (str) => {
    if (!str) return '?';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorScheme = COLORS[charCodeSum % COLORS.length];

  return (
    <div
      className={`avatar avatar-${size} ${className}`}
      style={{
        backgroundColor: colorScheme.bg,
        color: colorScheme.text,
      }}
    >
      {getInitials(name)}
    </div>
  );
}
