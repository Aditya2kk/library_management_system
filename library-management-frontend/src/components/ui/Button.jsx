import React from 'react';

export function Button({
  children,
  variant = 'primary', // primary | secondary | ghost | danger | danger-ghost
  size = 'md', // sm | md | lg
  icon: Icon,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const variantClass = `btn-${variant}`;

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="skeleton-circle" style={{ width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent' }} />
      ) : (
        Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
      {children}
    </button>
  );
}
