window.addEventListener('load', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // Recupera do localStorage com segurança (evita erros se estiver vazio)
  let savedPlayers = [];
  try {
    savedPlayers = JSON.parse(localStorage.getItem('veridia_players_db')) || [];
  } catch (e) {
    savedPlayers = [];
  }

  // Se não houver nenhum personagem criado no CRUD, cria um padrão para o jogo não falhar
  const activePlayer = savedPlayers.length > 0 
    ? savedPlayers[0] 
    : { name: 'Guardião (Padrão)', classType: 'Aurora', level: 1 };

  // Objeto do Jogador com posição inicial no centro do canvas
  let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 12,
    speed: 3,
    name: activePlayer.name
  };

  // Controlo das teclas premidas (Suporta Setas e W, A, S, D)
  const keys = {
    ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
    w: false, s: false, a: false, d: false,
    W: false, S: false, A: false, D: false
  };

  window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
      keys[e.key] = true;
    }
  });

  window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
      keys[e.key] = false;
    }
  });

  let time = 0;
  const trees = [
    { x: 60, y: 60, r: 22 }, 
    { x: 420, y: 80, r: 25 }, 
    { x: 70, y: 260, r: 24 }
  ];
  const rocks = [
    { x: 160, y: 80, r: 14 }, 
    { x: 380, y: 220, r: 16 }
  ];
  
  // Efeito visual de partículas (vaga-lumes)
  const fireflies = Array.from({ length: 12 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: 0.2 + Math.random() * 0.3
  }));

  function update() {
    // Movimentação fluida detetando as teclas ativas
    if (keys['ArrowUp'] || keys['w'] || keys['W']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) player.y += player.speed;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x += player.speed;

    // Limites do canvas (para o personagem não sair da tela)
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

    // Colisões com as pedras do cenário
    rocks.forEach(rock => {
      const dx = player.x - rock.x;
      const dy = player.y - rock.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < player.radius + rock.r) {
        const angle = Math.atan2(dy, dx);
        player.x = rock.x + Math.cos(angle) * (player.radius + rock.r);
        player.y = rock.y + Math.sin(angle) * (player.radius + rock.r);
      }
    });
  }

  function draw() {
    // Limpa o canvas a cada frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Fundo (Relva Sombria de Veridia)
    ctx.fillStyle = '#0a120b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Rio dos Encantos (Animado)
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(220, 0);
    ctx.bezierCurveTo(250 + Math.sin(time * 0.05) * 8, 100, 200 + Math.cos(time * 0.05) * 8, 200, 260, 320);
    ctx.lineTo(310, 320);
    ctx.bezierCurveTo(250 + Math.cos(time * 0.05) * 8, 200, 300 + Math.sin(time * 0.05) * 8, 100, 270, 0);
    ctx.fill();

    // 3. Pedras do Cenário
    rocks.forEach(r => {
      ctx.fillStyle = '#334155';
      ctx.beginPath(); 
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); 
      ctx.fill();
    });

    // 4. Árvores Ancestrais
    trees.forEach(t => {
      ctx.fillStyle = '#064e3b';
      ctx.beginPath(); 
      ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2); 
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath(); 
      ctx.arc(t.x - 3, t.y - 3, t.r * 0.6, 0, Math.PI * 2); 
      ctx.fill();
    });

    // 5. Vaga-lumes Místicos
    fireflies.forEach(f => {
      f.y -= f.speed;
      if (f.y < 0) f.y = canvas.height;
      ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
      ctx.beginPath();
      ctx.arc(f.x + Math.sin(time * 0.03) * 2, f.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 6. Desenhar o Personagem Jogável
    ctx.fillStyle = '#10b981'; // Verde brilhante para destacar
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 7. Nome do Personagem por cima dele
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(player.name, player.x, player.y - 16);
  }

  function loop() {
    time++;
    update();
    draw();
    requestAnimationFrame(loop); // Mantém o ciclo de animação ativo
  }

  loop();
});
