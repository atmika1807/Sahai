import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import '../styles/mood.css';

const MOODS = [
  { score: 5, emoji: '😄', label: 'Great',  color: '#4caf50' },
  { score: 4, emoji: '🙂', label: 'Good',   color: '#8bc34a' },
  { score: 3, emoji: '😐', label: 'Okay',   color: '#ffc107' },
  { score: 2, emoji: '😔', label: 'Bad',    color: '#ff7043' },
  { score: 1, emoji: '😢', label: 'Awful',  color: '#f44336' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const m = MOODS.find(m => m.score === payload[0].value);
    return (
      <div className="chart-tooltip">
        <div className="ct-date">{label}</div>
        <div className="ct-mood">{m?.emoji} {m?.label}</div>
      </div>
    );
  }
  return null;
};

export default function MoodTracker() {
  const location = useLocation();
  const [logs, setLogs]         = useState([]);
  const [selected, setSelected] = useState(null);
  const [note, setNote]         = useState('');
  const [saving, setSaving]     = useState(false);

  const load = () => api.get('/mood?limit=30').then(r => setLogs(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  // Pre-select if coming from dashboard quick check-in
  useEffect(() => {
    if (location.state?.quick) setSelected(location.state.quick);
  }, [location.state]);

  const logMood = async () => {
    if (!selected) { toast.error('Pick a mood first!'); return; }
    setSaving(true);
    try {
      await api.post('/mood', { score: selected, note });
      toast.success('Mood logged 💚');
      setSelected(null);
      setNote('');
      load();
    } catch { toast.error('Could not log mood'); }
    finally { setSaving(false); }
  };

  const chartData = [...logs].reverse().map(l => ({
    date: format(new Date(l.created_at), 'MMM d'),
    score: l.score,
  }));

  const avg = logs.length
    ? (logs.reduce((s, l) => s + l.score, 0) / logs.length).toFixed(1)
    : null;

  return (
    <div className="fade-up">
      <div className="page-header">
        <h1 className="page-title">Mood Tracker</h1>
        <p className="page-subtitle">Visualise your emotional patterns over time</p>
      </div>

      <div className="page-body">
        {/* Log mood */}
        <div className="mood-log-card card">
          <h2 className="mood-log-title">How are you feeling right now?</h2>
          <div className="mood-selector">
            {MOODS.map(m => (
              <button
                key={m.score}
                className={`mood-option ${selected === m.score ? 'selected' : ''}`}
                style={selected === m.score ? { borderColor: m.color, background: m.color + '18' } : {}}
                onClick={() => setSelected(m.score)}
              >
                <span className="mo-emoji">{m.emoji}</span>
                <span className="mo-label">{m.label}</span>
              </button>
            ))}
          </div>
          <textarea
            className="mood-note"
            placeholder="Add a note (optional) — what's making you feel this way?"
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
          />
          <button className="btn-primary mood-log-btn" onClick={logMood} disabled={saving || !selected}>
            {saving ? 'Logging…' : 'Log mood'}
          </button>
        </div>

        {/* Chart */}
        {chartData.length > 1 && (
          <div className="mood-chart-card card">
            <div className="mood-chart-header">
              <h2 className="mood-chart-title">Your mood over time</h2>
              {avg && <span className="mood-avg">Avg: {avg} / 5</span>}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8f0e8" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#7a8e7a' }} />
                <YAxis domain={[1, 5]} ticks={[1,2,3,4,5]} tick={{ fontSize: 12, fill: '#7a8e7a' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3d6b3d"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#3d6b3d', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* History */}
        {logs.length > 0 && (
          <div className="mood-history">
            <h2 className="mood-chart-title" style={{ marginBottom: 14 }}>Recent logs</h2>
            <div className="mood-history-list">
              {logs.slice(0, 10).map(l => {
                const m = MOODS.find(m => m.score === l.score);
                return (
                  <div key={l.id} className="mood-log-item card">
                    <span className="mli-emoji">{m?.emoji}</span>
                    <div className="mli-info">
                      <div className="mli-label" style={{ color: m?.color }}>{m?.label}</div>
                      {l.note && <div className="mli-note">{l.note}</div>}
                    </div>
                    <div className="mli-date">
                      {format(new Date(l.created_at), 'MMM d, h:mm a')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
