document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // Мобильное меню
  // ============================================
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    const open = () => {
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('no-scroll');
    };
    const close = () => {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('no-scroll');
    };

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      expanded ? close() : open();
    });

    // Close on link click
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') close();
    });
  }

  // ============================================
  // Скролл-анимации
  // ============================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-on-scroll');
        // Останавливаем наблюдение после анимации
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Элементы для анимации (hero-card исключен, т.к. имеет встроенную CSS анимацию)
  const animatedElements = document.querySelectorAll(
    '.section-title, .card, .contact-card, .goal, .subgrid > div, .list, .quote, .price'
  );

  animatedElements.forEach((el, index) => {
    // Добавляем задержку для последовательной анимации
    if (el.classList.contains('card')) {
      el.style.animationDelay = `${(index % 5) * 0.1}s`;
    }
    observer.observe(el);
  });

  // ============================================
  // Эффект при скролле для header
  // ============================================
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // ============================================
  // Плавное появление секций
  // ============================================
  const sections = document.querySelectorAll('.section, .services, .notice, .contacts');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    sectionObserver.observe(section);
  });

  // ============================================
  // Parallax эффект для декоративных элементов
  // ============================================
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.services::before, .services::after');
    
    parallaxElements.forEach((el, index) => {
      const speed = index === 0 ? 0.3 : 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // ============================================
  // Hover эффект для карточек с 3D трансформацией
  // ============================================
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ============================================
  // Анимация счетчиков (если есть числа)
  // ============================================
  const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  // ============================================
  // Прогресс-бар при скролле (опционально)
  // ============================================
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: #d36e70;
    z-index: 9999;
    transition: width 0.1s ease-out;
    border-radius: 0 3px 3px 0;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });

  // ============================================
  // Плавное появление при загрузке
  // ============================================
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease-in';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

