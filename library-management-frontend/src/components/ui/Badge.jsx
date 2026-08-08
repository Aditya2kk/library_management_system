import React from 'react';

export function Badge({ children, variant = 'gray', showDot = true, className = '' }) {
  // variant: green | amber | red | blue | gray
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {showDot && <span className="badge-dot" />}
      {children}
    </span>
  );
}
