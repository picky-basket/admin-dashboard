export function PageCard({ title, subtitle, action, children }) {
  return (
    <section className="page-card">
      <div className="page-card-header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div>{children}</div>
    </section>
  );
}
