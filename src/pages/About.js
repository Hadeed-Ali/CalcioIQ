import { useNavigate } from 'react-router-dom'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden flex flex-col">
      {/* Subtle glow background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <div
          className="glow-orb"
          style={{
            left: '-8%',
            top: '10%',
            width: '560px',
            height: '560px',
            background: 'radial-gradient(circle at 35% 35%, rgba(74, 222, 128, 0.14), rgba(74, 222, 128, 0) 62%)',
            animationDuration: '12s',
          }}
        />
        <div
          className="glow-orb"
          style={{
            right: '-10%',
            bottom: '-18%',
            width: '720px',
            height: '720px',
            background: 'radial-gradient(circle at 40% 40%, rgba(56, 189, 248, 0.08), rgba(56, 189, 248, 0) 60%)',
            animationDuration: '16s',
            animationDelay: '180ms',
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-5 border-b border-white/5 page-animate-in">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
        <img src="/CalcioAI Logo.png" alt="CalcioIQ logo" className="w-14 h-14 object-contain" />
          <span className="text-green-400 font-bold text-2xl tracking-widest uppercase">
            CALCIO<span className="text-white">IQ</span>
          </span>
        </button>
        <button onClick={() => navigate('/')} className="text-white/40 text-lg hover:text-white transition-colors">
          ← Back
        </button>
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-14 page-animate-in page-delay-1 flex-1 w-full">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1 h-6 bg-green-400 rounded-full inline-block" />
          <h1 className="text-3xl tracking-tight">About CalcioIQ</h1>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7">
          <p className="text-white/70 leading-relaxed">
            CalcioIQ is a personal project created by <span className="text-white">Hadeed Ali</span>.
          </p>
          <p className="text-white/70 leading-relaxed mt-4">
            As a big football fan, I'm always curious about the underlying statistics behind the players I watch. I
            wanted to create a platform that allows myself and other football fans to research their favourite players
            and access useful information all in one place. 
          </p>
          <p className="text-white/70 leading-relaxed mt-4">
            CalcioIQ (Italian for "Football") uses information from sources such as Transfermarkt and Football-Data.org
            to provide you with the most relevant facts about your favourite players. 
          </p>
          <p className="text-white/70 leading-relaxed mt-4">
            This is a project that I hope to continue updating. For any suggestions or fixes, email me at:
          </p>
          <p className="text-white/90 leading-relaxed mt-4">
          hadeedali647@gmail.com 
          </p>
          <p className="text-white/40 leading-relaxed mt-4">
            Note: CalcioIQ is 100% free of charge and not made for any commercial gain :)
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-5 border-t border-white/5 px-10 py-6 flex items-center justify-between text-white/50 text-s mt-auto">
        <span>© 2026 CalcioIQ. Personal project.</span>
        <div className="flex gap-6">
        <span> Hadeed Ali </span>
        </div>
      </footer>

    </div>
  )
}

