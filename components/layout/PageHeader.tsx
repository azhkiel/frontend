interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export default function PageHeader({ title, subtitle, breadcrumb }: PageHeaderProps) {
  return (
    <div className="bg-primary-50 border-b border-primary-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-2 text-sm text-text-muted font-body" role="list">
              {breadcrumb.map((crumb, i) => (
                <li key={i} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true" className="text-primary-100">›</span>}
                  {crumb.href ? (
                    <a href={crumb.href} className="hover:text-primary transition-colors">{crumb.label}</a>
                  ) : (
                    <span className="text-text-secondary font-medium">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {/* H1: Bricolage Grotesque display, left-aligned */}
        <h1 className="font-display font-bold text-2xl md:text-3xl text-primary">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-text-secondary font-body text-base max-w-2xl leading-relaxed">{subtitle}</p>
        )}
        {/* Accent bar: solid line bukan rounded-full pill */}
        <div className="mt-4 h-0.5 w-14 bg-accent" />
      </div>
    </div>
  );
}
