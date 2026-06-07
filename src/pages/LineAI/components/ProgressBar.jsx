import "../styles/progressbar.css";

export function ProgressBar({ labelA, percentA, labelB, percentB }) {
  const a = Math.min(100, Math.max(0, Number(percentA)));
  const b = Math.min(100, Math.max(0, Number(percentB)));

  return (
    <div className="progress-wrapper">
      <div className="progress-labels">
        <span className="progress-label label-a">
          {labelA}
          <strong>{a}%</strong>
        </span>
        <span className="progress-label label-b">
          <strong>{b}%</strong>
          {labelB}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill fill-a" style={{ width: `${a}%` }} />
        <div className="progress-fill fill-b" style={{ width: `${b}%` }} />
      </div>
    </div>
  );
}

export function StatBar({ label, value, description }) {
  const num = parseFloat(value);
  const percent = isNaN(num) ? 0 : Math.min(100, num);

  return (
    <div className="stat-wrapper">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div className="stat-track">
        <div className="stat-fill" style={{ width: `${percent}%` }} />
      </div>
      {description && <p className="stat-desc">{description}</p>}
    </div>
  );
}