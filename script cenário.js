window.addEventListener('load', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  let time = 0;
  const trees = [{ x: 60, y: 60, r: 22 }, { x: 420, y: 80, r: 25 }, { x: 70, y: 260, r: 24 }];
  const rocks = [{ x: 160, y: 80, r: 14 }, { x: 380, y: 220, r: 16 }];
  
  // Vaga-lumes místicos para ambientação de Veridia
  const fireflies = Array.from({ length: 12 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: 0.2 + Math.random() * 0.3
  }));

  function loop() {
    time++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Relva Sombria de Veridia
    ctx.fillStyle = '#0a120b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Rio dos Encantos
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(220, 0);
    ctx.bezierCurveTo(250 + Math.sin(time * 0.05) * 8, 100, 200 + Math.cos(time * 0.05) * 8, 200, 260, 320);
    ctx.lineTo(310, 320);
    ctx.bezierCurveTo(250 + Math.cos(time * 0.05) * 8, 200, 300 + Math.sin(time * 0.05) * 8, 100, 270, 0);
    ctx.fill();

    // Pedras Antigas
    rocks.forEach(r => {
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.fill();
    });

    // Árvores Ancestrais
    trees.forEach(t => {
      ctx.fillStyle = '#064e3b';
      ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath(); ctx.arc(t.x - 3, t.y - 3, t.r * 0.6, 0, Math.PI * 2); ctx.fill();
    });

    // Vaga-lumes Místicos
    fireflies.forEach(f => {
      f.y -= f.speed;
      if (f.y < 0) f.y = canvas.height;
      ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
      ctx.beginPath();
      ctx.arc(f.x + Math.sin(time * 0.03) * 2, f.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(loop);
  }

  loop();
});
