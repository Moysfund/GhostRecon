import { useEffect, useRef } from "react";

export function Entropy({ className = "", size = 400 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);
    const C = "#00ff41";

    class Particle {
      constructor(x, y, order) {
        this.x = x; this.y = y;
        this.originalX = x; this.originalY = y;
        this.size = 2; this.order = order;
        this.velocity = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
        this.influence = 0; this.neighbors = [];
      }
      update() {
        if (this.order) {
          const dx = this.originalX - this.x, dy = this.originalY - this.y;
          const ci = { x: 0, y: 0 };
          this.neighbors.forEach(n => {
            if (!n.order) {
              const d = Math.hypot(this.x - n.x, this.y - n.y);
              const s = Math.max(0, 1 - d / 100);
              ci.x += n.velocity.x * s; ci.y += n.velocity.y * s;
              this.influence = Math.max(this.influence, s);
            }
          });
          this.x += dx * 0.05 * (1 - this.influence) + ci.x * this.influence;
          this.y += dy * 0.05 * (1 - this.influence) + ci.y * this.influence;
          this.influence *= 0.99;
        } else {
          this.velocity.x += (Math.random() - 0.5) * 0.5;
          this.velocity.y += (Math.random() - 0.5) * 0.5;
          this.velocity.x *= 0.95; this.velocity.y *= 0.95;
          this.x += this.velocity.x; this.y += this.velocity.y;
          if (this.x < size / 2 || this.x > size) this.velocity.x *= -1;
          if (this.y < 0 || this.y > size) this.velocity.y *= -1;
          this.x = Math.max(size / 2, Math.min(size, this.x));
          this.y = Math.max(0, Math.min(size, this.y));
        }
      }
      draw() {
        const a = this.order ? 0.8 - this.influence * 0.5 : 0.8;
        ctx.fillStyle = `${C}${Math.round(a * 255).toString(16).padStart(2, "0")}`;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
      }
    }

    const gs = 25, sp = size / gs, particles = [];
    for (let i = 0; i < gs; i++)
      for (let j = 0; j < gs; j++)
        particles.push(new Particle(sp * i + sp / 2, sp * j + sp / 2, sp * i + sp / 2 < size / 2));

    let t = 0, aid;
    function animate() {
      ctx.clearRect(0, 0, size, size);
      if (t % 30 === 0)
        particles.forEach(p => { p.neighbors = particles.filter(o => o !== p && Math.hypot(p.x - o.x, p.y - o.y) < 100); });
      particles.forEach(p => {
        p.update(); p.draw();
        p.neighbors.forEach(n => {
          const d = Math.hypot(p.x - n.x, p.y - n.y);
          if (d < 50) {
            ctx.strokeStyle = `${C}${Math.round(0.2 * (1 - d / 50) * 255).toString(16).padStart(2, "0")}`;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); ctx.stroke();
          }
        });
      });
      ctx.strokeStyle = `${C}4D`; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size); ctx.stroke();
      t++; aid = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(aid);
  }, [size]);

  return (
    <div className={className} style={{ background: "#000", width: size, height: size, position: "relative" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
    </div>
  );
            }
