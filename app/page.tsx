'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Scene = 'intro' | 'message' | 'card' | 'reveal' | 'countdown' | 'finale'
const PHOTO_SRC = '/vetha.jpg'
const messageLines = [
  'Vetha 💜...',
  'Direct-ah birthday wish pannalam nu nenachen...',
  'Aana, oru normal “Happy Birthday” message anupuradha vida,',
  'konjam different-ah wish pannalam nu thonuchu. 🤍',
  'So... indha chinna surprise unakkaga.',
  'Eppovume happy-ah iru,',
  'sirichite iru. 🤍',
  'Innaiku un day... so just vibe, smile, and enjoy! 😌',
  'And yes... birthday treat pending, madam! 😂',
]

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    let frame = 0
    const particles = Array.from({ length: 28 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + .35, a: Math.random() * .35 + .08, s: Math.random() * .0002 + .00006 }))
    const resize = () => { const ratio = Math.min(devicePixelRatio, 2); canvas.width = innerWidth * ratio; canvas.height = innerHeight * ratio; canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`; context.setTransform(ratio, 0, 0, ratio, 0, 0) }
    const draw = () => { context.clearRect(0, 0, innerWidth, innerHeight); particles.forEach((p) => { p.y -= p.s; if (p.y < -.02) p.y = 1.02; context.beginPath(); context.fillStyle = `rgba(205,190,234,${p.a})`; context.arc(p.x * innerWidth, p.y * innerHeight, p.r, 0, Math.PI * 2); context.fill() }); frame = requestAnimationFrame(draw) }
    resize(); addEventListener('resize', resize); frame = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}

function Fireworks({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current; const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    let frame = 0; let lastBurst = -1000; const started = performance.now()
    const sparks: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = []
    const resize = () => { const ratio = Math.min(devicePixelRatio, 2); canvas.width = innerWidth * ratio; canvas.height = innerHeight * ratio; canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`; context.setTransform(ratio, 0, 0, ratio, 0, 0) }
    const burst = () => { const x = innerWidth * (.16 + Math.random() * .68); const y = innerHeight * (.14 + Math.random() * .38); const colors = ['#ead7a1', '#d8c7f2', '#fff9e9']; for (let i = 0; i < 42; i++) { const angle = Math.PI * 2 * i / 42; const speed = 1 + Math.random() * 2.2; sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color: colors[i % colors.length] }) } }
    const draw = (time: number) => { context.clearRect(0, 0, innerWidth, innerHeight); if (time - lastBurst > 760 && time - started < 6200) { burst(); lastBurst = time } sparks.forEach((s) => { s.x += s.vx; s.y += s.vy; s.vy += .018; s.life -= .012; context.globalAlpha = Math.max(0, s.life); context.fillStyle = s.color; context.shadowBlur = 8; context.shadowColor = s.color; context.beginPath(); context.arc(s.x, s.y, 1.25, 0, Math.PI * 2); context.fill() }); context.globalAlpha = 1; context.shadowBlur = 0; frame = requestAnimationFrame(draw) }
    resize(); addEventListener('resize', resize); frame = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize) }
  }, [active])
  return <canvas ref={canvasRef} className="fireworks" aria-hidden="true" />
}

function BirthdayLetters() {
  const lines = ['HAPPY BIRTHDAY', 'VETHA 💜']
  return <h2 className="birthday-letters" aria-label="Happy Birthday Vetha">{lines.map((word, row) => <span className="birthday-row" key={word}>{[...word].map((letter, index) => <span className="birthday-letter" style={{ animationDelay: `${(row * 14 + index) * 85}ms` }} key={`${letter}-${index}`}>{letter === ' ' ? '\u00a0' : letter}</span>)}</span>)}</h2>
}

export default function Page() {
  const [scene, setScene] = useState<Scene>('intro')
  const [line, setLine] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [count, setCount] = useState(3)
  const [photoReady, setPhotoReady] = useState(false)

  useEffect(() => { const image = new Image(); image.decoding = 'async'; image.src = PHOTO_SRC; if (image.complete) setPhotoReady(true); else image.onload = () => setPhotoReady(true) }, [])
  useEffect(() => { if (scene !== 'message' || line >= messageLines.length) return; const timer = setTimeout(() => setLine((value) => value + 1), line === 0 ? 1500 : line === 1 ? 2300 : 2800); return () => clearTimeout(timer) }, [scene, line])
  useEffect(() => { if (scene !== 'countdown') return; if (count > 0) { const timer = setTimeout(() => setCount((value) => value - 1), 1000); return () => clearTimeout(timer) }; const timer = setTimeout(() => setScene('finale'), 800); return () => clearTimeout(timer) }, [scene, count])
  const restart = useCallback(() => { setScene('intro'); setLine(0); setFlipped(false); setCount(3) }, [])
  const progress = (['intro', 'message', 'card', 'reveal', 'countdown', 'finale'].indexOf(scene) + 1) / 6 * 100

  return <main className={`birthday-app scene-${scene}`}>
    <ParticleField /><Fireworks active={scene === 'finale'} />
    {scene === 'intro' && <section className="scene-content intro-content"><div className="intro-lines"><p>Vetha…</p><p>Idhu just oru birthday wish illa. 👀</p><p>Konjam different-ah try panniruken.</p></div><button className="outline-button" onClick={() => setScene('message')}>See what&apos;s inside <span aria-hidden="true">→</span></button></section>}
    {scene === 'message' && <section className="scene-content message-content"><div className="personal-message" aria-live="polite">{messageLines.map((text, index) => <p key={text} className={index < line ? 'visible' : ''}>{text}</p>)}</div>{line >= messageLines.length && <button className="text-button" onClick={() => setScene('card')}>Continue <span aria-hidden="true">↓</span></button>}</section>}
    {scene === 'card' && <section className="scene-content card-content"><p className="eyebrow">A small reminder</p><button className={`flip-card ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped((value) => !value)} aria-label={flipped ? 'Show front of card' : 'Flip card to read the message'}><span className="card-face card-front"><span className="card-mark">V</span><span>Oru chinna reminder... 👀</span></span><span className="card-face card-back"><span>“Idha paathu oru chinna smile vandha podhum. 👀🤍”</span></span></button>{flipped && <button className="text-button" onClick={() => setScene('reveal')}>Continue <span aria-hidden="true">→</span></button>}</section>}
    {scene === 'reveal' && <section className="scene-content reveal-content"><div className={`portrait-wrap ${photoReady ? 'is-ready' : ''}`}><div className="portrait-glow" /><img src={PHOTO_SRC} alt="Vetha" className="portrait" /></div><p className="reveal-message">Simplicity-ku ivlo azhaga irukka mudiyuma? 😌</p><button className="text-button" onClick={() => setScene('countdown')}>Continue <span aria-hidden="true">→</span></button></section>}
    {scene === 'countdown' && <section className="scene-content countdown-content" aria-live="assertive"><div className="count-number" key={count}>{count}</div></section>}
    {scene === 'finale' && <section className="scene-content finale-content"><BirthdayLetters /><button className="replay-button" onClick={restart}>Replay ↻</button></section>}
    <div className="progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
  </main>
}
