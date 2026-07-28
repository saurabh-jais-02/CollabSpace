// ============================================
// COLLABSPACE - Main Script
// ============================================

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: '💬', warning: '⚠️' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '💬'}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================
// NAVBAR - SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ============================================
// MOBILE HAMBURGER MENU
// ============================================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
  });
}

function closeMobileNav() {
  if (hamburger) hamburger.classList.remove('active');
  if (mobileNav) mobileNav.classList.remove('open');
}

// ============================================
// ANIMATED STAT COUNTERS
// ============================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  if (!target) return;

  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    if (target >= 1000) {
      el.textContent = (current >= 1000)
        ? Math.floor(current / 1000) + 'K+'
        : Math.floor(current) + '+';
    } else {
      el.textContent = Math.floor(current) + '+';
    }
  }, 16);
}

// Intersection Observer for stats
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
if (statNumbers.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const revealEls = document.querySelectorAll('.feature-card, .testimonial-card, .about-card, .faq-item, .stats-bar-item');

if (revealEls.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.animation = 'fadeIn 0.5s ease forwards';
          entry.target.style.opacity = '1';
        }, index * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    revealObserver.observe(el);
  });
}

// ============================================
// FAQ ACCORDION
// ============================================
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  if (question) {
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(f => f.classList.remove('open'));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  }
});

// ============================================
// CONTACT MODAL
// ============================================
const contactModalBtn = document.getElementById('contactModalBtn');
const contactModal = document.getElementById('contactModal');
const closeModalBtn = document.getElementById('closeModalBtn');

if (contactModalBtn && contactModal) {
  contactModalBtn.addEventListener('click', () => {
    contactModal.classList.add('open');
  });

  closeModalBtn.addEventListener('click', () => {
    contactModal.classList.remove('open');
  });

  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      contactModal.classList.remove('open');
    }
  });
}

// Contact Form Submit
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    contactModal.classList.remove('open');
    contactForm.reset();
    showToast(`Thanks ${name}! We'll get back to you soon 💌`, 'success');
  });
}

// ============================================
// LIVE DEMO - INTERACTIVE CHAT
// ============================================
const demoReplies = {
  'Priya Singh': [
    "That's awesome! 🎉",
    "Totally agree with you!",
    "Can we schedule a call? 📞",
    "Sending you the files now 📁",
    "Great idea! Let's do it 🚀",
    "I'll review and get back to you ✅"
  ],
  'Rahul Kumar': [
    "Hey! Just finished the feature 💻",
    "Code review done ✅",
    "Let me check the PR quickly 👀",
    "Pushed the fix to main branch 🚀",
    "Tests are all passing now ✅",
    "Nice catch on that bug! 🐛"
  ],
  'Arjun Mehta': [
    "Back from the meeting! 🎯",
    "The design looks clean 🎨",
    "Working on the docs now 📄",
    "Sent the report to the team 📊",
    "Will be online in 10 mins ⏰",
    "Approved the PR! 👍"
  ]
};

let currentDemoUser = 'Priya Singh';
let replyIndex = 0;

function selectDemoUser(el, name, avatar) {
  document.querySelectorAll('.demo-user-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  currentDemoUser = name;
  replyIndex = 0;

  const titleEl = document.getElementById('demoChatTitle');
  const avatarEl = document.getElementById('demoChatAvatar');
  const messagesEl = document.getElementById('demoMessages');

  if (titleEl) titleEl.textContent = name;
  if (avatarEl) avatarEl.textContent = avatar;

  if (messagesEl) {
    messagesEl.innerHTML = `
      <div class="demo-msg received">
        <div class="demo-msg-bubble">Hey! You've opened a chat with ${name} 👋</div>
        <div class="demo-msg-time">Now</div>
      </div>
    `;
  }
}

function sendDemoMessage() {
  const input = document.getElementById('demoInput');
  const messages = document.getElementById('demoMessages');
  if (!input || !messages) return;

  const text = input.value.trim();
  if (!text) return;

  // Add sent message
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sentDiv = document.createElement('div');
  sentDiv.className = 'demo-msg sent';
  sentDiv.innerHTML = `
    <div class="demo-msg-bubble">${escapeHtml(text)}</div>
    <div class="demo-msg-time">${now}</div>
  `;
  messages.appendChild(sentDiv);
  input.value = '';
  messages.scrollTop = messages.scrollHeight;

  // Simulate typing + reply
  setTimeout(() => {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'demo-msg received';
    typingDiv.innerHTML = `
      <div class="demo-msg-bubble">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
      typingDiv.remove();
      const replies = demoReplies[currentDemoUser] || demoReplies['Priya Singh'];
      const reply = replies[replyIndex % replies.length];
      replyIndex++;

      const replyDiv = document.createElement('div');
      replyDiv.className = 'demo-msg received';
      replyDiv.innerHTML = `
        <div class="demo-msg-bubble">${reply}</div>
        <div class="demo-msg-time">${now}</div>
      `;
      messages.appendChild(replyDiv);
      messages.scrollTop = messages.scrollHeight;
    }, 1200);
  }, 500);
}

// Enter key for demo input
const demoInput = document.getElementById('demoInput');
if (demoInput) {
  demoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendDemoMessage();
  });
}

// Escape HTML helper
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================
// GRADIENT TEXT ANIMATION (auto)
// ============================================
document.querySelectorAll('.gradient-text').forEach(el => {
  el.style.backgroundSize = '200% auto';
});
