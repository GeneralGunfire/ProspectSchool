import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { motion } from 'motion/react'
import { WebGLShader } from '@/components/ui/web-gl-shader'

interface HeroSectionProps {
  onNavigate: (page: string) => void
}

export const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const [menuState, setMenuState] = React.useState(false)

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header>
        <nav
          data-state={menuState ? 'active' : undefined}
          className="group fixed z-20 w-full border-b border-dashed border-stone-300/60 bg-[#F5F0E8]/80 backdrop-blur"
        >
          <div className="m-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">

              {/* Logo + mobile toggle */}
              <div className="flex w-full justify-between lg:w-auto">
                <button
                  onClick={() => onNavigate('home')}
                  aria-label="Home"
                  className="flex items-center gap-2.5 group/logo"
                >
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                    className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white font-black text-sm"
                  >
                    P
                  </motion.div>
                  <span className="font-black text-stone-900 tracking-tight text-[15px]">Prospect</span>
                </button>

                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-stone-600"
                >
                  <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                  <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                </button>
              </div>

              {/* Nav links + CTAs */}
              <div className="group-data-[state=active]:block mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-stone-200 bg-[#F5F0E8] p-6 shadow-xl shadow-stone-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
                <div className="lg:pr-4">
                  <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                    {[
                      { name: 'Career Guide', page: 'quiz' },
                      { name: 'School Assist', page: 'library' },
                    ].map((item) => (
                      <li key={item.page}>
                        <button
                          onClick={() => { setMenuState(false); onNavigate(item.page) }}
                          className="text-stone-500 hover:text-stone-900 block duration-150 text-[13px] font-medium transition-colors"
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:border-stone-200 lg:pl-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setMenuState(false); onNavigate('portal') }}
                    className="border-stone-300 bg-transparent text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                  >
                    Portal Login
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <main>

        {/* Radial glow accents */}
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-40 contain-strict hidden lg:block"
        >
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(168,152,128,0.12)_0,rgba(168,152,128,0.04)_50%,transparent_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(168,152,128,0.08)_0,transparent_100%)] [translate:5%_-50%]" />
        </div>

        {/* Hero centred content */}
        <section className="overflow-hidden">
          <div className="relative mx-auto max-w-5xl px-6 pt-40 pb-24 lg:pt-48 lg:pb-28">
            <div className="relative z-10 mx-auto max-w-2xl text-center">

              {/* Eyebrow */}
              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                className="text-balance font-black text-stone-900 tracking-tight"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.25rem)', lineHeight: 1.06, letterSpacing: '-0.035em' }}
              >
                The platform South Africa's students deserve.
              </motion.h1>

              {/* Body */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
                className="mx-auto my-8 max-w-xl text-[17px] text-stone-500 leading-[1.7]"
              >
                Career discovery, matric study support, bursary search — all free, no account needed.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <Button
                  size="lg"
                  onClick={() => onNavigate('quiz')}
                  className="bg-stone-900 text-white hover:bg-stone-800 rounded-2xl px-8 shadow-[0_8px_32px_rgba(28,25,23,0.22)] hover:shadow-[0_16px_48px_rgba(28,25,23,0.28)] transition-shadow"
                >
                  Start Career Quiz →
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('library')}
                  className="border-stone-300 bg-white/60 text-stone-700 hover:bg-white hover:text-stone-900 rounded-2xl px-8 backdrop-blur-sm"
                >
                  Study Library
                </Button>
              </motion.div>
            </div>
          </div>

          {/* ── WebGL Shader — full bleed, no browser chrome ─────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
            className="relative w-full overflow-hidden -mt-8"
            style={{ height: 420 }}
          >
            {/* Top fade from beige into shader */}
            <div className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, #F5F0E8 0%, transparent 100%)' }} />

            {/* The WebGL canvas — full bleed */}
            <WebGLShader />

            {/* Overlay copy */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pointer-events-none">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-[11px] font-black uppercase tracking-[0.22em] text-white/50 mb-3"
              >
                Built for South Africa
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.82, duration: 0.55 }}
                className="font-black text-white text-center leading-tight"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
              >
                Your future starts here.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                className="mt-6 flex items-center gap-3 flex-wrap justify-center"
              >
                {['400+ Careers', '245+ Bursaries', '100% Free'].map(label => (
                  <div key={label} className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[12px] font-semibold text-white/70">
                    {label}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Bottom fade to landing background */}
            <div className="absolute bottom-0 left-0 right-0 h-28 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent, #F5F0E8)' }} />
          </motion.div>
        </section>

        {/* ── Social proof strip ───────────────────────────────────────── */}
        <section className="relative z-10 py-20" style={{ background: '#F5F0E8' }}>
          <div className="m-auto max-w-5xl px-6">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center text-[13px] font-semibold text-stone-400 uppercase tracking-[0.2em] mb-14"
            >
              Built for South Africa's students across all 9 provinces
            </motion.h2>

            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {[
                { value: '400+', label: 'SA Careers' },
                { value: '245+', label: 'Bursaries' },
                { value: '9',    label: 'Provinces' },
                { value: '26',   label: 'TVET Colleges' },
                { value: '100%', label: 'Free' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
                  className="text-center"
                >
                  <div className="text-[2.25rem] font-black text-stone-900 leading-none tracking-[-0.05em] mb-1.5">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.16em]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center gap-2.5', className)}>
    <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white font-black text-sm">
      P
    </div>
    <span className="font-black text-stone-900 tracking-tight text-[15px]">Prospect</span>
  </div>
)
