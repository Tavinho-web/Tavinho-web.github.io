(function(){
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d', { alpha: true });

  const rootStyles = getComputedStyle(document.documentElement);
  const palette = ['--a1','--a2','--a3','--a4','--a5'].map(v => rootStyles.getPropertyValue(v).trim());

  function hexToRgb(hex){
    const h = hex.replace('#','').trim();
    const full = h.length === 3 ? h.split('').map(c=>c+c).join('') : h;
    const n = parseInt(full, 16);
    return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
  }
  function rgbaFromHex(hex, a){
    const {r,g,b} = hexToRgb(hex || '#ffffff');
    return `rgba(${r},${g},${b},${a})`;
  }

  function resize(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', resize);
  resize();

  const isMobile = window.matchMedia && window.matchMedia('(max-width: 520px)').matches;
  const COUNT = isMobile ? 50 : 80;

  const particles = [];
  function rand(min,max){ return Math.random()*(max-min)+min; }

  function drawHeart(x,y,size,rot,color){
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(rot);
    ctx.scale(size, size);

    ctx.beginPath();
    // corazón simple (path)
    ctx.moveTo(0, 0.35);
    ctx.bezierCurveTo(-0.5, -0.05, -0.55, -0.6, 0, -0.35);
    ctx.bezierCurveTo(0.55, -0.6, 0.5, -0.05, 0, 0.35);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fill();

    ctx.restore();
  }

  function spawn(){
    const colorHex = palette[Math.floor(Math.random()*palette.length)] || '#ffffff';
    const type = Math.random() < 0.85 ? 'heart' : 'dot';
    const size = type === 'heart' ? rand(14, 26) : rand(2, 4);
    const p = {
      x: rand(0, window.innerWidth),
      y: rand(0, window.innerHeight),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.35, -0.12),
      size,
      rot: rand(0, Math.PI*2),
      spin: rand(-0.01, 0.01),
      alpha: rand(0.50, 0.90),
      colorHex,
      type
    };
    particles.push(p);
  }

  for(let i=0;i<COUNT;i++) spawn();

  let lastT = performance.now();

  function step(t){
    const dt = Math.min((t - lastT) / 16.67, 2);
    lastT = t;

    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

    // mejor visibilidad
    ctx.globalCompositeOperation = 'source-over';

    for (const p of particles){
      p.x += p.vx * dt * 10;
      p.y += p.vy * dt * 10;
      p.rot += p.spin * dt * 10;

      // respawn si se va por arriba o lados
      if (p.y < -40) { p.y = window.innerHeight + 40; p.x = rand(0, window.innerWidth); }
      if (p.x < -40) p.x = window.innerWidth + 40;
      if (p.x > window.innerWidth + 40) p.x = -40;

      const col = rgbaFromHex(p.colorHex, p.alpha);

      if (p.type === 'dot'){
        ctx.beginPath();
        ctx.fillStyle = col;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
      }else{
        drawHeart(p.x, p.y, p.size/18, p.rot, col);
      }
    }

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(step);
  }

  // pausa si la pestaña no está visible
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) lastT = performance.now();
  });

  requestAnimationFrame(step);
})();
