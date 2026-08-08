import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-code">404</div>
      <h2 className="mb-2">Page Not Found</h2>
      <p className="text-muted mb-6" style={{ maxWidth: 400 }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button variant="primary" icon={Home} onClick={() => navigate('/')}>
        Back to Dashboard
      </Button>
    </div>
  );
}
