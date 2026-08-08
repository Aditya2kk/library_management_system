import React from 'react';

export function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }) {
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${color}`}>
        {Icon && <Icon size={22} />}
      </div>
      <div className="stat-card-content">
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{title}</div>
        {trend && (
          <div className={`stat-card-trend ${trend.type || 'neutral'}`}>
            {trend.label}
          </div>
        )}
        {subtitle && !trend && (
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
