'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Scene = 'intro' | 'message' | 'card' | 'buildup' | 'reveal' | 'countdown' | 'finale'

const lines = ['For the person who makes', 'ordinary days feel', 'a little more beautiful.']

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    let frame = 0
    let width = 0
    let height = 0
    const particles = Array.from({ length: 34 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.4, a: Math.random() * 0.55 + 0.1, s: Math.random() * 0.00025 + 0.00008 }))
    const resize = () => { width = canvas.width = window.innerWidth * devicePixelRatio; height = canvas.height = window.innerHeight * devicePixelRatio; canvas.style.width = `${window.innerWidth}px`; canvas.style.height = `${window.innerHeight}px`; context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0) }
    const draw = () => { const w = window.innerWidth; const h = window.innerHeight; context.clearRect(0, 0, w, h); particles.forEach((p) => { p.y -= p.s; if (p.y < -0.02) p.y = 1.02; context.beginPath(); context.fillStyle = `rgba(205, 190, 234, ${p.a})`; context.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2); context.fill() }); frame = requestAnimationFrame(draw) }
    resize(); window.addEventListener('resize', resize); frame = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}

function Fireworks({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    let frame = 0; let lastBurst = 0
    const sparks: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = []
    const resize = () => { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`; context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0) }
    const burst = () => { const x = innerWidth * (0.2 + Math.random() * 0.6); const y = innerHeight * (0.18 + Math.random() * 0.33); const colors = ['#ead7a1', '#d8c7f2', '#fff9e9']; for (let i = 0; i < 42; i++) { const angle = Math.PI * 2 * i / 42; const speed = 1.1 + Math.random() * 2.4; sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color: colors[i % colors.length] }) } }
    const draw = (time: number) => { context.clearRect(0, 0, innerWidth, innerHeight); if (time - lastBurst > 900) { burst(); lastBurst = time } sparks.forEach((s) => { s.x += s.vx; s.y += s.vy; s.vy += 0.018; s.life -= 0.012; context.globalAlpha = Math.max(0, s.life); context.fillStyle = s.color; context.beginPath(); context.arc(s.x, s.y, 1.4, 0, Math.PI * 2); context.fill() }); context.globalAlpha = 1; frame = requestAnimationFrame(draw) }
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

  useEffect(() => { if (scene !== 'message') return; if (line < lines.length) { const timer = setTimeout(() => setLine((value) => value + 1), 900); return () => clearTimeout(timer) } }, [scene, line])
  useEffect(() => { if (scene !== 'countdown') return; if (count > 0) { const timer = setTimeout(() => setCount((value) => value - 1), 850); return () => clearTimeout(timer) } const timer = setTimeout(() => setScene('finale'), 700); return () => clearTimeout(timer) }, [scene, count])
  const restart = useCallback(() => { setScene('intro'); setLine(0); setFlipped(false); setCount(3) }, [])

  return (
    <main className={`birthday-app scene-${scene}`}>
      <ParticleField />
      <Fireworks active={scene === 'finale'} />
      {scene === 'intro' && <section className="scene-content intro-content"><p className="eyebrow">A little something for</p><h1>Vetha<span className="accent">.</span></h1><p className="subtle">Take a moment. This is just for you.</p><button className="outline-button" onClick={() => setScene('message')}>Open <span aria-hidden="true">→</span></button><p className="tiny-note">Best experienced with sound off, heart on.</p></section>}
      {scene === 'message' && <section className="scene-content message-content"><p className="eyebrow">Before anything else</p><div className="reveal-lines" aria-live="polite">{lines.map((text, index) => <p key={text} className={index < line ? 'visible' : ''}>{text}</p>)}</div>{line >= lines.length && <button className="text-button" onClick={() => setScene('card')}>There&apos;s more <span aria-hidden="true">↓</span></button>}</section>}
      {scene === 'card' && <section className="scene-content card-content"><p className="eyebrow">A small reminder</p><button className={`flip-card ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped((value) => !value)} aria-label={flipped ? 'Show front of card' : 'Flip card to read the message'}><span className="card-face card-front"><span className="card-mark">V</span><span>Tap to turn</span></span><span className="card-face card-back"><span>You make more of a difference than you know.</span><small>— always remember that</small></span></button>{flipped && <button className="text-button" onClick={() => setScene('buildup')}>Keep going <span aria-hidden="true">→</span></button>}</section>}
      {scene === 'buildup' && <section className="scene-content buildup-content"><p className="eyebrow">And now, the important part</p><h2>Today is yours.</h2><p className="subtle">Your softness. Your spark. Every little thing that makes you, you.</p><button className="outline-button" onClick={() => setScene('reveal')}>One more thing <span aria-hidden="true">→</span></button></section>}
      {scene === 'reveal' && <section className="scene-content reveal-content"><div className="portrait-wrap"><div className="portrait-glow" /><img src="/vetha.jpg" alt="Vetha" className="portrait" /></div><p className="eyebrow">This is your day, Vetha</p><button className="text-button" onClick={() => setScene('countdown')}>Make a wish <span aria-hidden="true">→</span></button></section>}
      {scene === 'countdown' && <section className="scene-content countdown-content" aria-live="assertive"><p className="eyebrow">Close your eyes</p><div className="count-number">{count || '✦'}</div><p className="subtle">and think of something beautiful</p></section>}
      {scene === 'finale' && <section className="scene-content finale-content"><div className="portrait-wrap small"><div className="portrait-glow" /><img src="/vetha.jpg" alt="Vetha smiling" className="portrait" /></div><p className="eyebrow">Happy birthday</p><h2>Stay exactly<br /><em>as wonderful</em><br />as you are.</h2><p className="subtle">With all the love in the world.</p><button className="replay-button" onClick={restart}>Replay this little moment</button></section>}
      <div className="progress" aria-hidden="true"><span style={{ width: `${(['intro', 'message', 'card', 'buildup', 'reveal', 'countdown', 'finale'].indexOf(scene) + 1) / 7 * 100}%` }} /></div>
    </main>
  )
}
