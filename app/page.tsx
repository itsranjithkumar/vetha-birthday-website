'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Scene = 'intro' | 'message' | 'card' | 'buildup' | 'reveal' | 'countdown' | 'finale'

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
    let width = 0
    let height = 0
    const particles = Array.from({ length: 34 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.4, a: Math.random() * 0.55 + 0.1, s: Math.random() * 0.00025 + 0.00008 }))
    const resize = () => { width = canvas.width = innerWidth * devicePixelRatio; height = canvas.height = innerHeight * devicePixelRatio; canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`; context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0) }
    const draw = () => { context.clearRect(0, 0, innerWidth, innerHeight); particles.forEach((p) => { p.y -= p.s; if (p.y < -0.02) p.y = 1.02; context.beginPath(); context.fillStyle = `rgba(205, 190, 234, ${p.a})`; context.arc(p.x * innerWidth, p.y * innerHeight, p.r, 0, Math.PI * 2); context.fill() }); frame = requestAnimationFrame(draw) }
    resize(); addEventListener('resize', resize); frame = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}

function Fireworks({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    let frame = 0; let lastBurst = 0
    const sparks: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = []
    const resize = () => { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`; context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0) }
    const burst = () => { const x = innerWidth * (0.15 + Math.random() * 0.7); const y = innerHeight * (0.16 + Math.random() * 0.38); const colors = ['#ead7a1', '#d8c7f2', '#fff9e9']; for (let i = 0; i < 48; i++) { const angle = Math.PI * 2 * i / 48; const speed = 1.1 + Math.random() * 2.4; sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color: colors[i % colors.length] }) } }
    const draw = (time: number) => { context.clearRect(0, 0, innerWidth, innerHeight); if (time - lastBurst > 780) { burst(); lastBurst = time } sparks.forEach((s) => { s.x += s.vx; s.y += s.vy; s.vy += 0.018; s.life -= 0.012; context.globalAlpha = Math.max(0, s.life); context.fillStyle = s.color; context.beginPath(); context.arc(s.x, s.y, 1.4, 0, Math.PI * 2); context.fill() }); context.globalAlpha = 1; frame = requestAnimationFrame(draw) }
    resize(); addEventListener('resize', resize); frame = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize) }
  }, [active])
  return <canvas ref={canvasRef} className="fireworks" aria-hidden="true" />
}

export default function Page() {
  const [scene, setScene] = useState<Scene>('intro')
  const [line, setLine] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [count, setCount] = useState(3)
  const [photoReady, setPhotoReady] = useState(false)

  useEffect(() => {
    const image = new Image()
    image.decoding = 'async'
    image.src = PHOTO_SRC
    if (image.complete) setPhotoReady(true)
    else image.onload = () => setPhotoReady(true)
  }, [])

  useEffect(() => {
    if (scene !== 'message' || line >= messageLines.length) return
    const timer = setTimeout(() => setLine((value) => value + 1), line === 0 ? 450 : 650)
    return () => clearTimeout(timer)
  }, [scene, line])

  useEffect(() => {
    if (scene !== 'countdown') return
    if (count > 0) { const timer = setTimeout(() => setCount((value) => value - 1), 850); return () => clearTimeout(timer) }
    const timer = setTimeout(() => setScene('finale'), 650)
    return () => clearTimeout(timer)
  }, [scene, count])

  const restart = useCallback(() => { setScene('intro'); setLine(0); setFlipped(false); setCount(3) }, [])
  const progress = (['intro', 'message', 'card', 'buildup', 'reveal', 'countdown', 'finale'].indexOf(scene) + 1) / 7 * 100

  return (
    <main className={`birthday-app scene-${scene}`}>
      <ParticleField />
      <Fireworks active={scene === 'finale'} />
      {scene === 'intro' && <section className="scene-content intro-content"><p className="eyebrow">A little surprise for</p><h1>Vetha<span className="accent">.</span></h1><p className="subtle">Oru chinna surprise irukku...</p><button className="outline-button" onClick={() => setScene('message')}>Open <span aria-hidden="true">→</span></button></section>}
      {scene === 'message' && <section className="scene-content message-content"><p className="eyebrow">Before anything else</p><div className="personal-message" aria-live="polite">{messageLines.map((text, index) => <p key={text} className={index < line ? 'visible' : ''}>{text}</p>)}</div>{line >= messageLines.length && <button className="text-button" onClick={() => setScene('card')}>Continue <span aria-hidden="true">↓</span></button>}</section>}
      {scene === 'card' && <section className="scene-content card-content"><p className="eyebrow">A small reminder</p><button className={`flip-card ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped((value) => !value)} aria-label={flipped ? 'Show front of card' : 'Flip card to read the message'}><span className="card-face card-front"><span className="card-mark">V</span><span>One important reminder...</span></span><span className="card-face card-back"><span>Birthday treat pending, madam! 😂</span></span></button>{flipped && <button className="text-button" onClick={() => setScene('buildup')}>Continue <span aria-hidden="true">→</span></button>}</section>}
      {scene === 'buildup' && <section className="scene-content buildup-content"><p className="anticipation-line">Okay...</p><h2>I saved something<br />for the end.</h2><p className="anticipation-ready">Ready?</p><button className="outline-button" onClick={() => setScene('reveal')}>Continue <span aria-hidden="true">→</span></button></section>}
      {scene === 'reveal' && <section className="scene-content reveal-content"><div className={`portrait-wrap ${photoReady ? 'is-ready' : 'is-loading'}`}><div className="portrait-glow" /><div className="portrait-backdrop" /><img src={PHOTO_SRC} alt="Vetha" className="portrait" /></div>{photoReady ? <p className="reveal-message">Eppovume happy-ah iru. 🤍</p> : <p className="photo-loading">Just a moment...</p>}<button className="text-button" onClick={() => setScene('countdown')}>Continue <span aria-hidden="true">→</span></button></section>}
      {scene === 'countdown' && <section className="scene-content countdown-content" aria-live="assertive"><p className="eyebrow">Close your eyes</p><div className="count-number">{count}</div></section>}
      {scene === 'finale' && <section className="scene-content finale-content"><p className="eyebrow">For you, Vetha</p><h2>HAPPY BIRTHDAY,<br /><em>VETHA 💜</em></h2><p className="subtle">Eppovume happy-ah iru. 🤍</p><button className="replay-button" onClick={restart}>Replay ↻</button></section>}
      <div className="progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
    </main>
  )
}
