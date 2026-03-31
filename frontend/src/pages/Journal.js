import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Plus, ChevronRight, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import '../styles/journal.css';

const SENTIMENT_COLORS = { positive: '#4caf50', neutral: '#ffc107', negative: '#f44336' };

export default function Journal() {
  const [entries, setEntries]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [isNew, setIsNew]       = useState(false);
  const [content, setContent]   = useState('');
  const [title, setTitle]       = useState('');
  const [saving, setSaving]     = useState(false);
  const [aiReply, setAiReply]   = useState('');

  const load = () => api.get('/journal').then(r => setEntries(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const startNew = () => {
    setSelected(null);
    setIsNew(true);
    setContent('');
    setTitle('');
    setAiReply('');
  };

  const save = async () => {
    if (!content.trim()) { toast.error('Write something first!'); return; }
    setSaving(true);
    try {
      const res = await api.post('/journal', { title: title || 'Untitled', content });
      setAiReply(res.data.ai_insight || '');
      toast.success('Entry saved 💚');
      load();
      setSelected(res.data);
      setIsNew(false);
    } catch { toast.error('Could not save entry'); }
    finally { setSaving(false); }
  };

  const deleteEntry = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    await api.delete(`/journal/${id}`).catch(() => toast.error('Delete failed'));
    load();
    setSelected(null);
    setIsNew(false);
  };

  const openEntry = (e) => {
    setSelected(e);
    setIsNew(false);
    setContent(e.content);
    setTitle(e.title);
    setAiReply(e.ai_insight || '');
  };

  return (
    <div className="journal-page">
      <div className="page-header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h1 className="page-title">Journal</h1>
          <p className="page-subtitle">Your private space to write freely</p>
        </div>
        <button className="btn-primary" onClick={startNew}><Plus size={16} /> New entry</button>
      </div>

      <div className="journal-body">
        {/* Sidebar list */}
        <div className="journal-list">
          {entries.length === 0 && (
            <div className="journal-empty">No entries yet.<br />Start writing!</div>
          )}
          {entries.map(e => (
            <div
              key={e.id}
              className={`journal-list-item ${selected?.id === e.id ? 'active' : ''}`}
              onClick={() => openEntry(e)}
            >
              <div className="jli-title">{e.title || 'Untitled'}</div>
              <div className="jli-date">{format(new Date(e.created_at), 'MMM d, yyyy')}</div>
              {e.sentiment && (
                <span className="jli-sentiment" style={{ color: SENTIMENT_COLORS[e.sentiment] }}>
                  {e.sentiment}
                </span>
              )}
              <ChevronRight size={14} style={{ marginLeft:'auto', color:'#7a8e7a' }} />
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="journal-editor card">
          {!isNew && !selected && (
            <div className="journal-placeholder">
              <p>Select an entry or</p>
              <button className="btn-primary" onClick={startNew}><Plus size={14} /> Write new</button>
            </div>
          )}

          {(isNew || selected) && (
            <>
              <input
                className="journal-title-input"
                placeholder="Entry title…"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <textarea
                className="journal-textarea"
                placeholder="Write freely… Sahai will read with compassion."
                value={content}
                onChange={e => setContent(e.target.value)}
              />
              <div className="journal-actions">
                {selected && (
                  <button className="btn-ghost" style={{ color:'#f44336', borderColor:'#f44336' }}
                    onClick={() => deleteEntry(selected.id)}>
                    <Trash2 size={15} /> Delete
                  </button>
                )}
                {isNew && (
                  <button className="btn-primary" onClick={save} disabled={saving}>
                    {saving ? 'Saving…' : 'Save entry'}
                  </button>
                )}
              </div>

              {aiReply && (
                <div className="ai-insight">
                  <div className="ai-insight-label">💚 Sahai's insight</div>
                  <p>{aiReply}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
