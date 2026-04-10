import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import SignalBanner from './SignalBanner';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/projects', label: 'Projects' },
    { path: '/credit-sentinel', label: 'Credit Sentinel' },
    { path: '/loop-detector', label: 'Loop Detector' },
    { path: '/prior-art', label: 'Prior Art' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="container">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">⚡</div>
            <div>
              <div className="sidebar-logo-text">VibeCheck</div>
              <div className="sidebar-subtitle">AI Dev Monitor</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <SignalIndicator />
        </div>
      </aside>

      <div className="main-content">
        <div className="main-header">
          <button
            className="button button-secondary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              zIndex: 100,
              display: 'none',
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <SignalBanner />
        <div className="page-container">{children}</div>
      </div>
    </div>
  );
}

function SignalIndicator() {
  const [signal, setSignal] = useState<'clear' | 'caution' | 'halt'>('clear');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateSignal = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/signal/default');
        const data = await response.json();
        const signalState = data.signal?.toLowerCase() || 'clear';
        setSignal(signalState);
      } catch (error) {
        console.error('Failed to fetch signal:', error);
        setSignal('clear');
      } finally {
        setLoading(false);
      }
    };

    updateSignal();
    const interval = setInterval(updateSignal, 60000);
    return () => clearInterval(interval);
  }, []);

  const signalLabels: Record<string, string> = {
    clear: 'All Clear',
    caution: 'Caution',
    halt: 'Halt',
  };

  return (
    <div className={`signal-indicator ${signal}`}>
      <div className="signal-dot"></div>
      <span>{signalLabels[signal]}</span>
    </div>
  );
}
