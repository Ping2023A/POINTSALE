import React from 'react';

const parseChanges = (actionText) => {
  // Try to find patterns like "Field: old -> new" and return array
  const regex = /([A-Za-z0-9 _]+):\s*([^\-]+)\s*->\s*([^,;]+)/g;
  const matches = [];
  let m;
  while ((m = regex.exec(actionText)) !== null) {
    matches.push({ field: m[1].trim(), before: m[2].trim(), after: m[3].trim() });
  }
  return matches;
};

const AuditModal = ({ log, onClose }) => {
  if (!log) return null;

  const changes = parseChanges(log.action || '');

  return (
    <div className="audit-modal-overlay" onClick={onClose}>
      <div className="audit-modal" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h3>Audit Details</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </header>
        <div className="modal-body">
          <div className="meta-row"><strong>Timestamp:</strong> <span className="mono">{new Date(log.date || log.createdAt).toLocaleString()}</span></div>
          <div className="meta-row"><strong>User:</strong> {log.email} <span className="muted">· {log.role}</span></div>
          <div className="meta-row"><strong>Action:</strong> {log.actionType || '—'}</div>
          <div className="meta-row"><strong>Target:</strong> {log.target || '—'}</div>

          <section className="details-section">
            <h4>Details</h4>
            {changes.length > 0 ? (
              <table className="changes-table">
                <thead><tr><th>Field</th><th>Before</th><th>After</th></tr></thead>
                <tbody>
                  {changes.map((c, i) => (
                    <tr key={i}><td>{c.field}</td><td>{c.before}</td><td>{c.after}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <pre className="action-raw">{log.action}</pre>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AuditModal;
