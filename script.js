/**
 * Agathamudi Himabindu - Portfolio Interactive Logic
 * Royal Amethyst Purple Theme & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. THEME SWITCHER (Dark & Light Mode with LocalStorage)
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  const currentTheme = localStorage.getItem('himabindu-portfolio-theme') || 'dark';
  root.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = root.getAttribute('data-theme');
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', nextTheme);
      localStorage.setItem('himabindu-portfolio-theme', nextTheme);
      showToast(`Switched to ${nextTheme} theme 🌓`);
    });
  }

  // --------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navItems = document.querySelectorAll('.nav-item');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', open);
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. NAVBAR SCROLL EFFECT & SCROLL SPY
  // --------------------------------------------------------------------------
  const headerNav = document.querySelector('.header-nav-wrap');
  const scrollTop = document.getElementById('scroll-top-btn');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (headerNav) {
      if (scrollY > 50) headerNav.classList.add('scrolled');
      else headerNav.classList.remove('scrolled');
    }

    if (scrollTop) {
      if (scrollY > 400) scrollTop.classList.add('visible');
      else scrollTop.classList.remove('visible');
    }

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-item[href*="#${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (navLink) navLink.classList.add('active');
      } else {
        if (navLink) navLink.classList.remove('active');
      }
    });
  });

  if (scrollTop) {
    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 4. HERO TYPEWRITER ANIMATION
  // --------------------------------------------------------------------------
  const typewriter = document.getElementById('typewriter');
  const phrases = [
    'Computer Science Engineer',
    'Data Analytics Specialist',
    'Python & Backend Developer',
    'SAC Technical Team Lead',
    'IIT Bombay E-Cell Member'
  ];

  let phraseIdx = 0;
  let letterIdx = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function runTypewriter() {
    if (!typewriter) return;

    const phrase = phrases[phraseIdx];

    if (isDeleting) {
      typewriter.textContent = phrase.substring(0, letterIdx - 1);
      letterIdx--;
      typeSpeed = 45;
    } else {
      typewriter.textContent = phrase.substring(0, letterIdx + 1);
      letterIdx++;
      typeSpeed = 90;
    }

    if (!isDeleting && letterIdx === phrase.length) {
      typeSpeed = 1600;
      isDeleting = true;
    } else if (isDeleting && letterIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(runTypewriter, typeSpeed);
  }

  runTypewriter();

  // --------------------------------------------------------------------------
  // 5. SCROLL REVEAL ANIMATIONS
  // --------------------------------------------------------------------------
  const revealTargets = document.querySelectorAll('.reveal, .glass-box');

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // --------------------------------------------------------------------------
  // 6. AMBIENT STAR / CONSTELLATION CANVAS
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('star-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h;
    let stars = [];
    const starCount = 45;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Star {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.r = Math.random() * 2 + 1;
        this.a = Math.random() * 0.5 + 0.2;
      }
      step() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${this.a})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#a855f7';
        ctx.fill();
      }
    }

    for (let i = 0; i < starCount; i++) stars.push(new Star());

    function renderStars() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      stars.forEach(s => {
        s.step();
        s.draw();
      });

      requestAnimationFrame(renderStars);
    }

    renderStars();
  }

  // --------------------------------------------------------------------------
  // 7. COPY TO CLIPBOARD & TOAST
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const txt = btn.getAttribute('data-copy');
      if (txt) {
        navigator.clipboard.writeText(txt).then(() => {
          showToast(`Copied to clipboard: "${txt}" 📋`);
        }).catch(() => {
          const temp = document.createElement('input');
          temp.value = txt;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
          showToast(`Copied: "${txt}" 📋`);
        });
      }
    });
  });

  function showToast(msg) {
    const hub = document.getElementById('toast-container');
    if (!hub) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;
    hub.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 8. PROJECT DETAILS MODAL
  // --------------------------------------------------------------------------
  const projectModal = document.getElementById('project-modal');
  const projectCloseBtn = document.getElementById('project-close-btn');
  const projectModalContent = document.getElementById('project-modal-content');
  const openDetailBtns = document.querySelectorAll('.open-details-btn');

  const projectDetails = {
    'iot-security': {
      title: 'Detection of Real-Time Malicious Intrusions and Attacks in IoT-Empowered Cybersecurity Infrastructure',
      badge: 'Cybersecurity & Machine Learning',
      subtitle: 'Python • ML Pattern Recognition • Anomaly Detection',
      overview: 'Internet of Things (IoT) sensors and edge devices are vulnerable to malicious traffic injections, botnet hijackings, and anomalous sensor tampering. This project models an automated detection engine that analyzes incoming packet telemetry to detect threats before networks are breached.',
      architecture: [
        'Data Ingestion: Capturing simulated IoT node traffic and network connection features.',
        'Feature Engineering: Extracting transmission intervals, payload entropy, error rates, and packet header anomalies.',
        'ML Classifier: Training algorithms on attack signatures to differentiate between legitimate sensor reports and intrusion attempts.',
        'Automated Alerting: Delivering instant notifications and diagnostic summaries upon detecting high-confidence threat anomalies.'
      ],
      techs: ['Python', 'Machine Learning', 'IoT Security', 'Scikit-Learn', 'Data Analysis', 'Pattern Recognition'],
      impact: 'Demonstrated real-time threat detection accuracy while minimizing computational footprint on resource-constrained devices.'
    },
    'medication-reminder': {
      title: 'Smart Medication Reminder & Patient Schedule Manager',
      badge: 'Healthcare & Database Systems',
      subtitle: 'SQL • MySQL • Python • Notification Scheduler',
      overview: 'Non-adherence to medical prescriptions causes adverse health setbacks. This application allows patients, families, and caregivers to organize drug regimens, set timely reminders, and maintain persistent SQL logs of taken versus missed doses.',
      architecture: [
        'Relational Schema: Normalized tables in MySQL mapping Patients, Prescriptions, Dosage Frequency, and Confirmations.',
        'Dosage Management: Form input for medicine name, dosage units, frequency (daily, BID, TID), and exact alert time.',
        'Notification Scheduler: Background check querying pending medications and firing timely reminders.',
        'Adherence Tracking: Storing historical compliance records to facilitate doctor consultations.'
      ],
      techs: ['SQL', 'MySQL Database', 'Python', 'Relational Database Design', 'Notification Engine'],
      impact: 'Created a reliable, database-backed adherence tool reducing patient medicine omission rates.'
    }
  };

  openDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-project');
      const d = projectDetails[key];
      if (!d || !projectModal || !projectModalContent) return;

      projectModalContent.innerHTML = `
        <div style="margin-bottom: 1.5rem; padding-right: 2rem;">
          <span class="proj-badge" style="margin-bottom: 0.6rem; display: inline-flex;">${d.badge}</span>
          <h2 style="font-family: var(--font-head); font-size: 1.45rem; color: var(--text-primary); margin-bottom: 0.35rem;">${d.title}</h2>
          <p style="color: var(--purple-neon); font-size: 0.95rem;">${d.subtitle}</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem; font-size: 0.92rem; color: var(--text-muted); line-height: 1.65;">
          <div>
            <h4 style="color: var(--text-primary); font-size: 0.95rem; text-transform: uppercase; margin-bottom: 0.4rem;">Project Overview</h4>
            <p>${d.overview}</p>
          </div>

          <div style="background: rgba(10, 6, 20, 0.45); padding: 1.2rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <h4 style="color: var(--purple-glow); font-size: 0.95rem; text-transform: uppercase; margin-bottom: 0.6rem;">Architecture & Pipeline</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; padding-left: 0;">
              ${d.architecture.map(a => `<li style="position: relative; padding-left: 1.2rem; color: var(--text-lavender);"><span style="position: absolute; left: 0; color: var(--purple-primary);">▹</span> ${a}</li>`).join('')}
            </ul>
          </div>

          <div>
            <h4 style="color: var(--text-primary); font-size: 0.95rem; margin-bottom: 0.5rem;">Technologies Used</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${d.techs.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
          </div>

          <div style="border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
            <h4 style="color: var(--text-primary); font-size: 0.95rem; margin-bottom: 0.35rem;">Outcome & Learnings</h4>
            <p>${d.impact}</p>
          </div>
        </div>
      `;

      projectModal.classList.add('active');
      projectModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (projectCloseBtn) projectCloseBtn.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  // --------------------------------------------------------------------------
  // 9. RESUME MODAL & PRINTING
  // --------------------------------------------------------------------------
  const resumeModal = document.getElementById('resume-modal');
  const resumeCloseBtn = document.getElementById('resume-close-btn');
  const openResumeBtns = [
    document.getElementById('open-resume-btn'),
    document.getElementById('open-resume-btn-2')
  ];
  const printResumeBtn = document.getElementById('print-resume-btn');
  const copySummaryBtn = document.getElementById('copy-summary-btn');

  openResumeBtns.forEach(b => {
    if (b) {
      b.addEventListener('click', () => {
        if (resumeModal) {
          resumeModal.classList.add('active');
          resumeModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    }
  });

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (resumeCloseBtn) resumeCloseBtn.addEventListener('click', closeResumeModal);
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResumeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResumeModal();
    }
  });

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (copySummaryBtn) {
    copySummaryBtn.addEventListener('click', () => {
      const summary = `Agathamudi Himabindu | B.Tech Computer Science & Engineering (Class of 2027)
Contact: +91-6304689113 | himabinduagathamudi@gmail.com | Hyderabad, India
Education:
- B.Tech CSE: Bhaskar Engineering College (CGPA: 7.73/10, Expected 2027)
- Intermediate MPC: S R Junior College (86.8%, 2023)
- SSC: Krishnaveni High School (CGPA: 9.8/10, 2021)
Technical Skills: Python, SQL, MySQL, HTML, CSS, JavaScript, Git/GitHub, Data Cleaning & Analysis, MS Excel
3 Internships:
1. Web Development Intern at Pursuit Future Technologies (Jan - Apr 2026)
2. Python Programming Intern at Oasis Infobyte (Jun - Jul 2026)
3. Data Analytics Intern at Novitech R&D Pvt. Ltd. (May - Jun 2026)
Leadership:
- Technical Team Lead at SAC BEC (2026)
- Team member of E-cell, BEC - Tie up with IIT BOMBAY (2026)`;

      navigator.clipboard.writeText(summary).then(() => {
        showToast('Resume profile summary copied! 📋');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. CONTACT FORM VALIDATION & SIMULATION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formMsgBox = document.getElementById('form-msg-box');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameIn = document.getElementById('name');
      const emailIn = document.getElementById('email');
      const msgIn = document.getElementById('message');

      const nameErr = document.getElementById('name-error');
      const emailErr = document.getElementById('email-error');
      const msgErr = document.getElementById('message-error');

      let valid = true;

      if (!nameIn.value.trim()) {
        nameErr.classList.add('visible');
        valid = false;
      } else {
        nameErr.classList.remove('visible');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailIn.value.trim() || !emailRegex.test(emailIn.value.trim())) {
        emailErr.classList.add('visible');
        valid = false;
      } else {
        emailErr.classList.remove('visible');
      }

      if (!msgIn.value.trim()) {
        msgErr.classList.add('visible');
        valid = false;
      } else {
        msgErr.classList.remove('visible');
      }

      if (!valid) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span>`;
      }

      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Message Sent!</span>`;
        }

        if (formMsgBox) {
          formMsgBox.className = 'form-alert success';
          formMsgBox.textContent = '🎉 Thank you! Your message has been received. You can also contact Himabindu directly at himabinduagathamudi@gmail.com.';
        }

        showToast('Message sent successfully! 🚀');

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = `
              <span>Send Message</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            `;
          }
          if (formMsgBox) formMsgBox.className = 'form-alert hidden';
        }, 5000);
      }, 1200);
    });
  }
});
