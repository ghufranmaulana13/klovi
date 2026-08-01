/**
 * KLOVI WEB PLATFORM APPLICATION SCRIPT
 * Features: Background Particle Canvas, 3D Card Tilt, Interactive Dashboard, 
 * AI Copilot, APY Calculator, Card Customizer, VIP Pass Generator, Waitlist System.
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initNavbarScroll();
  initHeroCard3D();
  initAppDashboard();
  initYieldCalculator();
  initCardCustomizer();
  initVIPPassForm();
  initWaitlistModal();
  initCACopy();
});

/* ==========================================================================
   1. AMBIENT NEON PARTICLE CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Subtle ambient gradient background glow
    const grad = ctx.createRadialGradient(
      width / 2, height / 2, 50,
      width / 2, height / 2, width * 0.6
    );
    grad.addColorStop(0, 'rgba(198, 241, 53, 0.04)');
    grad.addColorStop(1, 'rgba(5, 5, 5, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(198, 241, 53, ${0.15 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw individual particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(198, 241, 53, ${p.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(198, 241, 53, 0.4)';
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. NAVBAR SCROLL EFFECT
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   3. 3D CARD TILT EFFECTS
   ========================================================================== */
function initHeroCard3D() {
  const container = document.getElementById('hero-card-container');
  const card = document.getElementById('hero-card');

  if (!container || !card) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / (rect.height / 2)) * -18;
    const rotY = (x / (rect.width / 2)) * 18;

    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });

  container.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

/* ==========================================================================
   4. INTERACTIVE APP DASHBOARD & AI COPILOT
   ========================================================================== */
function initAppDashboard() {
  // Tab Switching
  const navBtns = document.querySelectorAll('.app-nav-item');
  const tabs = document.querySelectorAll('.dashboard-tab');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      navBtns.forEach(b => b.classList.remove('active'));
      tabs.forEach(t => t.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`tab-${targetTab}`).classList.add('active');
    });
  });

  // Dynamic Chart Timeframe Switching
  const chartBtns = document.querySelectorAll('.chart-btn');
  const chartLine = document.getElementById('chart-line');
  const chartArea = document.getElementById('chart-area');

  const chartPaths = {
    '1D': { line: 'M 0 180 Q 200 190 400 120 T 800 50', area: 'M 0 180 Q 200 190 400 120 T 800 50 L 800 240 L 0 240 Z' },
    '1W': { line: 'M 0 140 Q 180 80 400 150 T 800 40', area: 'M 0 140 Q 180 80 400 150 T 800 40 L 800 240 L 0 240 Z' },
    '1M': { line: 'M 0 160 Q 150 120 300 140 T 600 60 T 800 30', area: 'M 0 160 Q 150 120 300 140 T 600 60 T 800 30 L 800 240 L 0 240 Z' },
    '1Y': { line: 'M 0 210 Q 250 170 500 90 T 800 20', area: 'M 0 210 Q 250 170 500 90 T 800 20 L 800 240 L 0 240 Z' },
    'ALL': { line: 'M 0 220 Q 200 180 400 100 T 800 10', area: 'M 0 220 Q 200 180 400 100 T 800 10 L 800 240 L 0 240 Z' },
  };

  chartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chartBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const timeframe = btn.getAttribute('data-time');
      if (chartPaths[timeframe]) {
        chartLine.setAttribute('d', chartPaths[timeframe].line);
        chartArea.setAttribute('d', chartPaths[timeframe].area);
      }
    });
  });

  // Klovi Copilot AI Chat Engine
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const quickBtns = document.querySelectorAll('.quick-btn');
  const clearBtn = document.getElementById('clear-chat');

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message msg-${sender}`;
    msgDiv.innerHTML = `<div class="msg-content">${text}</div>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleCopilotAI(promptText) {
    appendMessage('user', promptText);
    chatInput.value = '';

    // Simulated Bot thinking & AI response
    setTimeout(() => {
      let botReply = '';
      const lower = promptText.toLowerCase();

      if (lower.includes('yield') || lower.includes('optimize')) {
        botReply = "⚡ <strong>Klovi AI Action Plan:</strong> I detected an arbitrage opportunity on Robinhood L2 Liquidity Pool #4. Moving $5,000 USDC into the Liquid ETH Vault will boost your total portfolio yield to <strong>14.2% APY</strong> with gasless routing.";
      } else if (lower.includes('expense') || lower.includes('spend')) {
        botReply = "📊 <strong>Monthly Expense Analysis:</strong> You spent $1,420.50 this month. 42% went to AI infrastructure (OpenAI, AWS), 28% to dining, and 30% saved. You earned <strong>$42.10 cash back</strong> in $KLVI tokens!";
      } else if (lower.includes('card') || lower.includes('virtual')) {
        botReply = "💳 <strong>Virtual Burner Card Generated:</strong> Created card <code>•••• 8831</code> with a $50 limit for online transactions. 2% cashback active.";
      } else {
        botReply = `🤖 I'm processing your query: "<em>${promptText}</em>" on Robinhood Chain. All transactions are optimized for zero gas fees and maximum security.`;
      }

      appendMessage('bot', botReply);
    }, 600);
  }

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (text) handleCopilotAI(text);
    });
  }

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      handleCopilotAI(prompt);
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      chatMessages.innerHTML = `
        <div class="message msg-bot">
          <div class="msg-content">
            Hello Alex! I am your personal financial AI. I am currently monitoring Robinhood Chain yield pools. How can I assist your portfolio today?
          </div>
        </div>
      `;
    });
  }

  // Instant Swap Logic
  const swapPay = document.getElementById('swap-pay-amount');
  const swapRec = document.getElementById('swap-receive-amount');
  const execSwapBtn = document.getElementById('execute-swap-btn');

  if (swapPay && swapRec) {
    swapPay.addEventListener('input', () => {
      const val = parseFloat(swapPay.value) || 0;
      swapRec.value = (val * 8.4205).toFixed(2);
    });
  }

  if (execSwapBtn) {
    execSwapBtn.addEventListener('click', () => {
      execSwapBtn.textContent = 'Processing Gasless Swap...';
      execSwapBtn.disabled = true;

      setTimeout(() => {
        alert('🎉 Instant Swap Executed Successfully on Robinhood Chain L2! Zero Gas Paid.');
        execSwapBtn.textContent = 'Execute Instant Swap';
        execSwapBtn.disabled = false;
      }, 1000);
    });
  }
}

/* ==========================================================================
   5. INTERACTIVE APY YIELD CALCULATOR
   ========================================================================== */
function initYieldCalculator() {
  const depSlider = document.getElementById('dep-slider');
  const timeSlider = document.getElementById('time-slider');

  const depText = document.getElementById('dep-val-text');
  const timeText = document.getElementById('time-val-text');

  const kloviRes = document.getElementById('klovi-yield-res');
  const kloviGrowth = document.getElementById('klovi-growth-res');
  const bankRes = document.getElementById('bank-yield-res');
  const diffMult = document.getElementById('diff-mult');

  function calculateYield() {
    if (!depSlider || !timeSlider) return;

    const principal = parseFloat(depSlider.value);
    const years = parseInt(timeSlider.value);

    // Klovi 12.8% compound APY
    const kloviRate = 0.128;
    const kloviFinal = principal * Math.pow(1 + kloviRate, years);
    const kloviInterest = kloviFinal - principal;

    // Traditional Bank 0.05% APY
    const bankRate = 0.0005;
    const bankFinal = principal * Math.pow(1 + bankRate, years);
    const bankInterest = bankFinal - principal;

    // Update Text
    depText.textContent = `$${principal.toLocaleString()}`;
    timeText.textContent = `${years} Year${years > 1 ? 's' : ''}`;

    kloviRes.textContent = `$${Math.round(kloviFinal).toLocaleString()}`;
    kloviGrowth.textContent = `+$${Math.round(kloviInterest).toLocaleString()} interest`;

    bankRes.textContent = `$${Math.round(bankFinal).toLocaleString()}`;
    
    const mult = bankInterest > 0 ? (kloviInterest / bankInterest).toFixed(0) : 250;
    diffMult.textContent = `${mult}x`;
  }

  if (depSlider && timeSlider) {
    depSlider.addEventListener('input', calculateYield);
    timeSlider.addEventListener('input', calculateYield);
    calculateYield();
  }
}

/* ==========================================================================
   6. CARD CUSTOMIZER & 3D TILT
   ========================================================================== */
function initCardCustomizer() {
  const nameInput = document.getElementById('cust-card-name-input');
  const nameDisplay = document.getElementById('cust-card-name-display');
  const heroNameDisplay = document.getElementById('hero-card-name');
  const colorBtns = document.querySelectorAll('.color-btn');
  const cardRender = document.getElementById('custom-card-render');
  const cardFrame = document.getElementById('custom-card-frame');
  const reserveBtn = document.getElementById('reserve-card-btn');

  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      const val = e.target.value.toUpperCase() || 'YOUR NAME';
      if (nameDisplay) nameDisplay.textContent = val;
      if (heroNameDisplay) heroNameDisplay.textContent = val;
    });
  }

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const theme = btn.getAttribute('data-theme');
      cardRender.className = `klovi-card-large theme-${theme}`;

      const label = document.getElementById('card-type-label');
      if (label) {
        if (theme === 'obsidian') label.textContent = 'PLATINUM OAK';
        if (theme === 'lime') label.textContent = 'ELECTRIC EDITION';
        if (theme === 'cyber') label.textContent = 'CYBER CHROME L2';
      }
    });
  });

  if (cardFrame && cardRender) {
    cardFrame.addEventListener('mousemove', (e) => {
      const rect = cardFrame.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = (y / (rect.height / 2)) * -20;
      const rotY = (x / (rect.width / 2)) * 20;

      cardRender.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    cardFrame.addEventListener('mouseleave', () => {
      cardRender.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  if (reserveBtn) {
    reserveBtn.addEventListener('click', () => {
      const modal = document.getElementById('waitlist-modal');
      if (modal) modal.showModal();
    });
  }
}

/* ==========================================================================
   7. VIP PASS FORM & TICKET RENDERER
   ========================================================================== */
function initVIPPassForm() {
  const vipForm = document.getElementById('vip-form');
  const holderDisplay = document.getElementById('ticket-holder-name');

  if (vipForm) {
    vipForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('vip-name-input').value.trim();

      if (name && holderDisplay) {
        holderDisplay.textContent = name.toUpperCase();
        holderDisplay.style.color = '#c6f135';
        alert(`🎉 VIP Early Access Ticket Issued for ${name}! Access level: Tier 1 Robinhood L2.`);
      }
    });
  }
}

/* ==========================================================================
   8. WAITLIST MODAL & COUNTER
   ========================================================================== */
function initWaitlistModal() {
  const modal = document.getElementById('waitlist-modal');
  const openBtns = [
    document.getElementById('open-waitlist-btn'),
    document.getElementById('hero-join-btn')
  ];
  const closeBtn = document.getElementById('close-modal');
  const modalForm = document.getElementById('modal-form');
  const modalSuccess = document.getElementById('modal-success');
  const waitlistCounter = document.getElementById('waitlist-counter');

  openBtns.forEach(btn => {
    if (btn && modal) {
      btn.addEventListener('click', () => modal.showModal());
    }
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      modalForm.classList.add('hidden');
      modalSuccess.classList.remove('hidden');

      // Update waitlist counter display
      if (waitlistCounter) {
        waitlistCounter.textContent = '142,891+';
        waitlistCounter.style.color = '#c6f135';
      }
    });
  }

  const copyBtn = document.getElementById('copy-ref-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const shareInput = document.getElementById('share-input');
      if (shareInput) {
        navigator.clipboard.writeText(shareInput.value);
        copyBtn.textContent = 'Copied to Clipboard! ✓';
        setTimeout(() => copyBtn.textContent = 'Copy Invite Link', 2000);
      }
    });
  }
}

/* ==========================================================================
   9. CONTRACT ADDRESS (CA) COPY ENGINE
   ========================================================================== */
function initCACopy() {
  const caAddress = '0xAaa777A7694575e0304AbB42Ff35e82e491f24E8';
  const copyHeroBtn = document.getElementById('copy-ca-btn');
  const copySwapBtn = document.getElementById('copy-ca-swap');

  if (copyHeroBtn) {
    copyHeroBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(caAddress);
      const textSpan = copyHeroBtn.querySelector('.copy-text');
      if (textSpan) textSpan.textContent = 'Copied! ✓';
      copyHeroBtn.style.background = '#c6f135';
      copyHeroBtn.style.color = '#050505';

      setTimeout(() => {
        if (textSpan) textSpan.textContent = 'Copy CA';
        copyHeroBtn.style.background = '';
        copyHeroBtn.style.color = '';
      }, 2000);
    });
  }

  if (copySwapBtn) {
    copySwapBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(caAddress);
      copySwapBtn.textContent = 'Copied! ✓';
      setTimeout(() => {
        copySwapBtn.textContent = '0xAaa7...24E8 📋';
      }, 2000);
    });
  }
}
