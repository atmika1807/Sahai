import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { MessageCircle, BookOpen, BarChart2, TrendingUp } from 'lucide-react';
import '../styles/dashboard.css';

const MOOD_LABELS = { 5:'Great', 4:'Good', 3:'Okay', 2:'Bad', 1:'Awful' };
const MOOD_EMOJI  = { 5:'😄', 4:'🙂', 3:'😐', 2:'😔', 1:'😢' };

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentMood, setRecentMood] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/mood?limit=1').then(r => {
      if (r.data?.length) setRecentMood(r.data[0]);
    }).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="fade-up">
      <div className="page-header">
        <h1 className="page-title">{greeting}, {firstName} 👋</h1>
        <p className="page-subtitle">How are you feeling today?</p>
      </div>

      <div className="page-body">
        {/* Quick mood check-in */}
        <div className="dash-checkin card">
          <p className="checkin-label">Quick check-in — how's your mood right now?</p>
          <div className="checkin-moods">
            {[5,4,3,2,1].map(m => (
              <button key={m} className="mood-btn" onClick={() => navigate('/mood', { state: { quick: m } })}>
                <span className="mood-btn-emoji">{MOOD_EMOJI[m]}</span>
                <span className="mood-btn-label">{MOOD_LABELS[m]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="dash-stats">
          {[
            { label: 'Journal Entries', value: stats?.journal_count ?? '—', icon: BookOpen, path:'/journal' },
            { label: 'Mood Logs',       value: stats?.mood_count ?? '—',    icon: BarChart2, path:'/mood' },
            { label: 'Chat Sessions',   value: stats?.chat_count ?? '—',    icon: MessageCircle, path:'/chat' },
            { label: 'Day Streak',      value: stats?.streak ?? '—',        icon: TrendingUp, path:'/mood' },
          ].map(({ label, value, icon: Icon, path }) => (
            <div key={label} className="stat-card card" onClick={() => navigate(path)}>
              <div className="stat-icon"><Icon size={20} /></div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="dash-actions">
          <h2 className="dash-section-title">What would you like to do?</h2>
          <div className="action-cards">
            <div className="action-card card" onClick={() => navigate('/chat')}>
              <MessageCircle size={28} color="#3d6b3d" />
              <div>
                <div className="action-title">Talk to Sahai</div>
                <div className="action-desc">Share what's on your mind</div>
              </div>
            </div>
            <div className="action-card card" onClick={() => navigate('/journal')}>
              <BookOpen size={28} color="#3d6b3d" />
              <div>
                <div className="action-title">Write in your journal</div>
                <div className="action-desc">Reflect on your thoughts</div>
              </div>
            </div>
          </div>
        </div>

        {recentMood && (
          <div className="dash-recent card">
            <p className="dash-recent-label">Your last mood log</p>
            <div className="dash-recent-mood">
              <span style={{ fontSize: 28 }}>{MOOD_EMOJI[recentMood.score]}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{MOOD_LABELS[recentMood.score]}</div>
                <div style={{ fontSize: 13, color: '#7a8e7a' }}>
                  {new Date(recentMood.created_at).toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
