(async function () {
  const params = new URLSearchParams(window.location.search);
  const comicId = params.get('id');

  const titleEl = document.getElementById('comicTitle');
  const pageImg = document.getElementById('pageImg');
  const pageIndicator = document.getElementById('pageIndicator');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const thumbStrip = document.getElementById('thumbStrip');

  let comic = null;
  let pages = [];
  let current = 0;

  function pageUrl(comic, n) {
    // pagePattern e.g. "comics/id/page-{n}.svg"
    return comic.pagePattern.replace('{n}', n);
  }

  function buildPages(comic) {
    const list = [];
    for (let n = 1; n <= comic.pageCount; n++) list.push(pageUrl(comic, n));
    return list;
  }

  function renderThumbs() {
    thumbStrip.innerHTML = '';
    pages.forEach((src, i) => {
      const btn = document.createElement('button');
      btn.className = i === current ? 'active' : '';
      btn.innerHTML = `<img src="${src}" alt="Page ${i + 1} thumbnail" loading="lazy">`;
      btn.addEventListener('click', () => goTo(i));
      thumbStrip.appendChild(btn);
    });
  }

  function updateThumbActive() {
    [...thumbStrip.children].forEach((btn, i) => {
      btn.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    if (index < 0 || index >= pages.length) return;
    current = index;
    pageImg.src = pages[current];
    pageImg.alt = `${comic.title} — page ${current + 1}`;
    pageIndicator.textContent = `${current + 1} / ${pages.length}`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === pages.length - 1;
    updateThumbActive();
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // --- Touch swipe navigation (iPad / touch devices) ---
  const stage = document.getElementById('readerStage');
  let touchStartX = null;
  let touchStartY = null;

  stage.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    const SWIPE_THRESHOLD = 50;

    // Only treat as a page-turn if the swipe is mostly horizontal,
    // so vertical scrolling on a tall page still works normally.
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) goTo(current + 1); // swipe left -> next page
      else goTo(current - 1);        // swipe right -> previous page
    }
    touchStartX = null;
    touchStartY = null;
  }, { passive: true });

  // Tap the left/right edge of the page image to turn pages (thumb-friendly on a tablet)
  pageImg.addEventListener('click', (e) => {
    const rect = pageImg.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    if (tapX < rect.width * 0.3) goTo(current - 1);
    else if (tapX > rect.width * 0.7) goTo(current + 1);
  });

  async function init() {
    if (!comicId) {
      titleEl.textContent = 'No comic specified';
      return;
    }
    try {
      const res = await fetch('data/comics.json');
      const data = await res.json();
      comic = (data.comics || []).find(c => c.id === comicId);
    } catch (err) {
      console.error('Failed to load manifest', err);
    }

    if (!comic) {
      titleEl.textContent = 'Comic not found';
      return;
    }

    titleEl.textContent = comic.title;
    document.title = `${comic.title} — Panel`;
    pages = buildPages(comic);
    renderThumbs();
    goTo(0);
  }

  init();
})();
