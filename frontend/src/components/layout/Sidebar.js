import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  MessageCircle, BookOpen, BarChart2, Home, LogOut, Settings
} from 'lucide-react';

const navItems = [
  { icon: Home,          label: 'Dashboard',  path: '/dashboard' },
  { icon: MessageCircle, label: 'AI Chat',     path: '/chat' },
  { icon: BookOpen,      label: 'Journal',     path: '/journal' },
  { icon: BarChart2,     label: 'Mood Tracker',path: '/mood' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'S';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Sahai</div>

      <nav className="sidebar-nav">
        {navItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            className={`nav-item ${pathname.startsWith(path) ? 'active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={() => navigate('/settings')} style={{ marginBottom: 4 }}>
          <Settings size={18} />
          Settings
        </button>
        <button className="nav-item" onClick={logout}>
          <LogOut size={18} />
          Sign out
        </button>
        <div className="sidebar-user" style={{ marginTop: 8 }}>
          <div className="avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || user?.email}</div>
            <div className="sidebar-user-plan">Free plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
