const domainColors = {
  'Cloud Concepts': 'border-blue-500',
  'Architecture & Services': 'border-purple-500',
  'Management & Governance': 'border-amber-500',
}
const domainBg = {
  'Cloud Concepts': 'bg-blue-500/10',
  'Architecture & Services': 'bg-purple-500/10',
  'Management & Governance': 'bg-amber-500/10',
}

export function Home({ demos, onSelect }) {
  const domains = [...new Set(demos.map(d => d.domain))]

  return (
    <div className="min-h-screen">
      <header className="border-b border-border px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">AZ-900 Empirical</h1>
        <p className="text-text-dim text-lg max-w-2xl mx-auto">
          See it. Then answer it.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {domains.map(domain => (
          <section key={domain} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold text-white">{domain}</h2>
              <span className="text-xs text-text-dim bg-surface-3 px-2 py-1 rounded">
                {demos.find(d => d.domain === domain)?.weight}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demos.filter(d => d.domain === domain).map(demo => (
                <button key={demo.id} onClick={() => onSelect(demo.id)}
                  className={`text-left p-5 rounded-lg bg-surface-2 border-l-4 ${domainColors[domain]} hover:bg-surface-3 transition-colors cursor-pointer`}>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {demo.acronyms.map(a => (
                      <span key={a} className={`text-xs font-mono px-2 py-0.5 rounded ${domainBg[domain]} text-white`}>{a}</span>
                    ))}
                  </div>
                  <h3 className="text-white font-medium mb-1">{demo.title}</h3>
                  <p className="text-text-dim text-sm">{demo.desc}</p>
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-text-dim text-sm">
        <div className="flex gap-4 justify-center">
          <a href="https://learn.microsoft.com/en-us/credentials/certifications/exams/az-900/"
            target="_blank" className="text-azure hover:underline">Official Exam</a>
          <a href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900"
            target="_blank" className="text-azure hover:underline">Study Guide</a>
          <a href="https://learn.microsoft.com/en-us/credentials/certifications/practice-assessments-for-microsoft-certifications"
            target="_blank" className="text-azure hover:underline">MS Practice Test</a>
        </div>
      </footer>
    </div>
  )
}
