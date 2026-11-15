(() => {
  const track = document.querySelector('#templateTrack');
  const prev = document.querySelector('.carousel-prev');
  const next = document.querySelector('.carousel-next');
  const toast = document.querySelector('.toast');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  // Горизонтальная лента: стрелки, колесо мыши и свайп на телефоне.
  const scrollAmount = () => Math.min(track.clientWidth * 0.82, 430);
  prev?.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
  next?.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  track?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') track.scrollBy({ left: scrollAmount() * .65, behavior: 'smooth' });
    if (event.key === 'ArrowLeft') track.scrollBy({ left: -scrollAmount() * .65, behavior: 'smooth' });
  });

  // Мобильная навигация.
  menuToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  // Плавное появление блоков при прокрутке.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = Number(entry.target.dataset.delay || 0);
          entry.target.style.transitionDelay = `${delay}ms`;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  // Небольшая обратная связь по клику на скачивание. Файлы добавляются в /files.
  let toastTimer;
  document.querySelectorAll('[data-download]').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || href.includes('REPLACE_ME') || href === '#') {
        event.preventDefault();
        showToast('Добавь файл шаблона в папку files и укажи его имя в ссылке.');
      } else {
        showToast('Готово! Если загрузка не началась, проверь путь к файлу.');
      }
    });
  });
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  // Лёгкий наклон карточек на устройствах с мышью.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('mousemove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `translateY(-7px) rotateX(${y * -2}deg) rotateY(${x * 2}deg)`;
      });
      card.addEventListener('mouseleave', () => card.style.transform = '');
    });
  }
})();
