/* ==========================================================================
   OUR LITTLE UNIVERSE — JAVASCRIPT LOGIC ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const spaceCanvas = document.getElementById('spaceCanvas');
  const ctx = spaceCanvas.getContext('2d');
  const cursorGlow = document.getElementById('cursorGlow');
  const introScreen = document.getElementById('introScreen');
  const btnEnterUniverse = document.getElementById('btnEnterUniverse');
  const universeView = document.getElementById('universeView');

  // Audio Elements
  const bgMusic = document.getElementById('bgMusic');
  const musicPlayer = document.getElementById('musicPlayer');
  const btnMusicToggle = document.getElementById('btnMusicToggle');
  const musicIcon = document.getElementById('musicIcon');

  // Orbit & Planet Elements
  const orbitStage = document.getElementById('orbitStage');
  const centerPlanet = document.getElementById('centerPlanet');
  const planetItems = document.querySelectorAll('.planet-item');
  const planetSecret = document.getElementById('planetSecret');

  // Modals
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  const btnCloseModals = document.querySelectorAll('.btn-close-modal');

  // Love Meter Elements
  const btnMeasureLove = document.getElementById('btnMeasureLove');
  const loveMeterCount = document.getElementById('loveMeterCount');
  const loveMeterBar = document.getElementById('loveMeterBar');
  const loveMeterResult = document.getElementById('loveMeterResult');

  // Scared Planet Elements
  const btnBeatingHeart = document.getElementById('btnBeatingHeart');
  const scaredSecretContent = document.getElementById('scaredSecretContent');

  // Final Scene Elements
  const finalSceneOverlay = document.getElementById('finalSceneOverlay');
  const btnStayUniverse = document.getElementById('btnStayUniverse');
  const finaleLoveOverlay = document.getElementById('finaleLoveOverlay');

  // Canvas State & Setup
  let width = (spaceCanvas.width = window.innerWidth);
  let height = (spaceCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = spaceCanvas.width = window.innerWidth;
    height = spaceCanvas.height = window.innerHeight;
    initStars();
  });

  // ==========================================================================
  // SPACE CANVAS ENGINE (STARS, PARTICLES, NEBULA, VORTEX)
  // ==========================================================================
  let stars = [];
  let particles = [];
  let shootingStars = [];
  let isVortexMode = false;

  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.8 + 0.3;
      this.alpha = Math.random() * 0.8 + 0.2;
      this.speed = Math.random() * 0.02 + 0.005;
      this.angle = Math.random() * Math.PI * 2;
      this.color = Math.random() > 0.8 ? '#ffb3c1' : (Math.random() > 0.5 ? '#4cc9f0' : '#ffffff');
      
      this.distFromCenter = Math.hypot(this.x - width / 2, this.y - height / 2);
      this.orbitAngle = Math.atan2(this.y - height / 2, this.x - width / 2);
    }
    update() {
      if (isVortexMode) {
        this.distFromCenter -= 1.2;
        if (this.distFromCenter < 10) this.distFromCenter = Math.random() * (width / 2) + 200;
        this.orbitAngle += 0.03;
        this.x = width / 2 + Math.cos(this.orbitAngle) * this.distFromCenter;
        this.y = height / 2 + Math.sin(this.orbitAngle) * this.distFromCenter;
        this.currentAlpha = Math.min(1, this.alpha + 0.4);
      } else {
        this.angle += this.speed;
        this.currentAlpha = this.alpha + Math.sin(this.angle) * 0.3;
        this.currentAlpha = Math.max(0.1, Math.min(1, this.currentAlpha));
      }
    }
    draw() {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.currentAlpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class DustParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.5 + 0.8;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset();
    }
    draw() {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 179, 193, ' + this.alpha + ')';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class ShootingStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width * 0.8;
      this.y = Math.random() * height * 0.4;
      this.length = Math.random() * 90 + 40;
      this.speed = Math.random() * 9 + 6;
      this.angle = Math.PI / 4;
      this.alpha = 1;
      this.active = false;
    }
    spawn() {
      this.reset();
      this.active = true;
    }
    update() {
      if (!this.active) return;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.alpha -= 0.015;
      if (this.alpha <= 0 || this.x > width || this.y > height) this.active = false;
    }
    draw() {
      if (!this.active) return;
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 229, 236, ' + this.alpha + ')';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
      ctx.stroke();
      ctx.restore();
    }
  }

  function initStars() {
    stars = [];
    particles = [];
    shootingStars = [];
    const count = Math.min(Math.floor((width * height) / 3800), 250);
    for (let i = 0; i < count; i++) stars.push(new Star());
    for (let i = 0; i < 40; i++) particles.push(new DustParticle());
    for (let i = 0; i < 3; i++) shootingStars.push(new ShootingStar());
  }

  initStars();

  setInterval(() => {
    const inactive = shootingStars.find(s => !s.active);
    if (inactive && Math.random() > 0.3) inactive.spawn();
  }, 3200);

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.75);
    grad.addColorStop(0, 'rgba(20, 13, 43, 0.5)');
    grad.addColorStop(0.6, 'rgba(8, 10, 30, 0.7)');
    grad.addColorStop(1, 'rgba(3, 4, 11, 0.95)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    stars.forEach(star => {
      star.update();
      star.draw();
    });

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    shootingStars.forEach(s => {
      s.update();
      s.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Cursor glow positioning
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      cursorGlow.style.left = `${e.touches[0].clientX}px`;
      cursorGlow.style.top = `${e.touches[0].clientY}px`;
    }
  });

  // ==========================================================================
  // AUDIO ENGINE & SYNTHESIZER FALLBACK
  // ==========================================================================
  let isPlaying = false;
  let audioContext = null;
  let synthGainNode = null;
  let isSynthActive = false;

  bgMusic.volume = 0.35;

  function initAudioSynthFallback() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioContext = new AudioCtx();
      synthGainNode = audioContext.createGain();
      synthGainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
      synthGainNode.connect(audioContext.destination);

      const freqs = [130.81, 164.81, 196.00, 246.94];
      freqs.forEach(f => {
        const osc = audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, audioContext.currentTime);
        const g = audioContext.createGain();
        g.gain.setValueAtTime(0.02, audioContext.currentTime);
        osc.connect(g);
        g.connect(synthGainNode);
        osc.start();
      });
      isSynthActive = true;
    } catch (e) {
      console.log('Audio synth fallback note:', e);
    }
  }

  function playAudio() {
    bgMusic.play().then(() => {
      isPlaying = true;
      musicPlayer.classList.add('playing');
      musicIcon.textContent = '❚❚';
    }).catch(err => {
      console.log('HTML5 Audio note, running synth:', err);
      if (!isSynthActive) initAudioSynthFallback();
      if (audioContext && audioContext.state === 'suspended') audioContext.resume();
      isPlaying = true;
      musicPlayer.classList.add('playing');
      musicIcon.textContent = '❚❚';
    });
  }

  function pauseAudio() {
    bgMusic.pause();
    if (audioContext && audioContext.state === 'running') audioContext.suspend();
    isPlaying = false;
    musicPlayer.classList.remove('playing');
    musicIcon.textContent = '▶';
  }

  btnMusicToggle.addEventListener('click', () => {
    if (isPlaying) pauseAudio();
    else playAudio();
  });

  // ==========================================================================
  // INTRO SCREEN & UNIVERSE ENTER TRANSITION
  // ==========================================================================
  function enterUniverseHandler(e) {
    if (e) e.preventDefault();
    introScreen.classList.add('fade-out');
    universeView.classList.add('active');
    playAudio();
  }

  btnEnterUniverse.addEventListener('click', enterUniverseHandler);

  // ==========================================================================
  // PLANET ORBIT POSITIONING & DRAG ROTATION WITH TAP THRESHOLD
  // ==========================================================================
  let orbitAngleOffset = 0;
  let isDraggingOrbit = false;
  let startDragX = 0;
  let startDragY = 0;
  let dragDistance = 0;

  function updatePlanetPositions() {
    const isMobile = window.innerWidth <= 640;
    const radiusX = isMobile ? 120 : 190;
    const radiusY = isMobile ? 120 : 190;

    const planets = [
      document.getElementById('planet1'),
      document.getElementById('planet2'),
      document.getElementById('planet3'),
      document.getElementById('planet4'),
      document.getElementById('planet5')
    ];

    planets.forEach((planet, idx) => {
      if (!planet) return;
      const angle = (idx * (Math.PI * 2 / 5)) + orbitAngleOffset;
      const x = Math.cos(angle) * radiusX;
      const y = Math.sin(angle) * radiusY;
      planet.style.transform = `translate(${x}px, ${y}px)`;
    });

    if (planetSecret) {
      const secretAngle = Math.PI * 1.5 + orbitAngleOffset;
      const sx = Math.cos(secretAngle) * (radiusX * 1.25);
      const sy = Math.sin(secretAngle) * (radiusY * 1.25);
      planetSecret.style.transform = `translate(${sx}px, ${sy}px)`;
    }
  }

  updatePlanetPositions();
  window.addEventListener('resize', updatePlanetPositions);

  // Smooth rotation loop
  setInterval(() => {
    if (!isDraggingOrbit) {
      orbitAngleOffset += 0.002;
      updatePlanetPositions();
    }
  }, 35);

  // Mouse Drag Logic
  orbitStage.addEventListener('mousedown', (e) => {
    isDraggingOrbit = true;
    startDragX = e.clientX;
    startDragY = e.clientY;
    dragDistance = 0;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingOrbit) return;
    const deltaX = e.clientX - startDragX;
    const deltaY = e.clientY - startDragY;
    dragDistance += Math.hypot(deltaX, deltaY);
    startDragX = e.clientX;
    startDragY = e.clientY;
    orbitAngleOffset += deltaX * 0.005;
    updatePlanetPositions();
  });

  window.addEventListener('mouseup', () => {
    setTimeout(() => { isDraggingOrbit = false; }, 50);
  });

  // Touch Drag Logic for Mobile
  orbitStage.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      isDraggingOrbit = true;
      startDragX = e.touches[0].clientX;
      startDragY = e.touches[0].clientY;
      dragDistance = 0;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDraggingOrbit || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - startDragX;
    const deltaY = e.touches[0].clientY - startDragY;
    dragDistance += Math.hypot(deltaX, deltaY);
    startDragX = e.touches[0].clientX;
    startDragY = e.touches[0].clientY;
    orbitAngleOffset += deltaX * 0.007;
    updatePlanetPositions();
  }, { passive: true });

  window.addEventListener('touchend', () => {
    setTimeout(() => { isDraggingOrbit = false; }, 50);
  });

  // ==========================================================================
  // UNLOCKED PLANETS STATE TRACKER & MODAL ROUTER
  // ==========================================================================
  const visitedPlanets = new Set();
  const planetModals = {
    '1': document.getElementById('modalWhyYou'),
    '2': document.getElementById('modalFeelings'),
    '3': document.getElementById('modalScared'),
    '4': document.getElementById('modalPromise'),
    '5': document.getElementById('modalFuture'),
    'secret': document.getElementById('modalSecret')
  };

  let measureInterval = null;

  function resetLoveMeter() {
    if (measureInterval) clearInterval(measureInterval);
    loveMeterCount.textContent = '0%';
    loveMeterCount.classList.remove('glitch');
    loveMeterBar.style.width = '0%';
    loveMeterResult.style.display = 'none';
    btnMeasureLove.style.opacity = '1';
    btnMeasureLove.style.pointerEvents = 'auto';
  }

  function resetScaredHeart() {
    scaredSecretContent.style.display = 'none';
    btnBeatingHeart.style.transform = 'scale(1)';
    btnBeatingHeart.style.boxShadow = 'none';
  }

  function openModal(id) {
    const modal = planetModals[id];
    if (!modal) return;

    if (id === '2') resetLoveMeter();
    if (id === '3') resetScaredHeart();

    modal.classList.add('active');

    if (id !== 'secret') {
      visitedPlanets.add(id);
      const planetEl = document.getElementById(`planet${id}`);
      if (planetEl) planetEl.classList.add('visited');

      if (visitedPlanets.size >= 5) {
        setTimeout(() => {
          if (planetSecret) planetSecret.classList.add('unlocked');
        }, 600);
      }
    }
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('active');
  }

  // Planet Tap Handler (Tap vs Drag Filter)
  function setupPlanetTapHandler(el, id) {
    function handleTap(e) {
      if (dragDistance > 10) return; // ignore if user was dragging orbit
      if (e.cancelable) e.preventDefault();
      openModal(id);
    }
    el.addEventListener('click', (e) => {
      if (dragDistance <= 10) openModal(id);
    });
  }

  planetItems.forEach(planet => {
    const id = planet.getAttribute('data-planet');
    setupPlanetTapHandler(planet, id);
  });

  // Modal buttons & Close handlers
  document.querySelectorAll('.modal-next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      closeModal(modal);
    });
  });

  btnCloseModals.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      closeModal(modal);
    });
  });

  modalBackdrops.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Central Planet click -> Trigger Final Scene or open Planet 1
  centerPlanet.addEventListener('click', () => {
    if (dragDistance > 10) return;
    if (visitedPlanets.size >= 5) {
      finalSceneOverlay.classList.add('active');
    } else {
      openModal('1');
    }
  });

  // ==========================================================================
  // MINI-GAME 1: LOVE METER (PLANET 2)
  // ==========================================================================
  btnMeasureLove.addEventListener('click', () => {
    btnMeasureLove.style.opacity = '0.5';
    btnMeasureLove.style.pointerEvents = 'none';

    const steps = [
      { val: 10, width: '10%' },
      { val: 25, width: '25%' },
      { val: 50, width: '50%' },
      { val: 75, width: '75%' },
      { val: 100, width: '100%' },
      { val: 200, width: '100%' },
      { val: 500, width: '100%' },
      { val: 999, width: '100%' }
    ];

    let stepIdx = 0;
    measureInterval = setInterval(() => {
      if (stepIdx < steps.length) {
        loveMeterCount.textContent = `${steps[stepIdx].val}%`;
        loveMeterBar.style.width = steps[stepIdx].width;
        stepIdx++;
      } else {
        clearInterval(measureInterval);
        loveMeterCount.textContent = 'ERROR';
        loveMeterCount.classList.add('glitch');
        loveMeterResult.style.display = 'block';
      }
    }, 450);
  });

  // ==========================================================================
  // MINI-GAME 2: I'M SCARED HEART REVEAL (PLANET 3)
  // ==========================================================================
  btnBeatingHeart.addEventListener('click', () => {
    btnBeatingHeart.style.transform = 'scale(1.25)';
    btnBeatingHeart.style.boxShadow = '0 0 50px rgba(255, 77, 109, 0.9)';
    setTimeout(() => {
      scaredSecretContent.style.display = 'block';
    }, 200);
  });

  // ==========================================================================
  // MINI-GAME 3: PROMISE CARDS FLIP (PLANET 4)
  // ==========================================================================
  const promiseCards = document.querySelectorAll('.promise-card-item');
  promiseCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('open');
    });
  });

  // ==========================================================================
  // SECRET PLANET CLOSE -> TRIGGER FINAL SCENE OVERLAY
  // ==========================================================================
  const modalSecret = document.getElementById('modalSecret');
  modalSecret.querySelector('.btn-close-modal').addEventListener('click', () => {
    setTimeout(() => {
      finalSceneOverlay.classList.add('active');
    }, 400);
  });

  // ==========================================================================
  // FINAL SCENE & VORTEX FINALE INTERACTION
  // ==========================================================================
  btnStayUniverse.addEventListener('click', () => {
    isVortexMode = true;
    btnStayUniverse.style.display = 'none';

    if (bgMusic) bgMusic.volume = 0.55;

    setTimeout(() => {
      finaleLoveOverlay.style.display = 'block';
    }, 300);
  });
});
