(async function () {
  const gallery = document.getElementById('gallery');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('search');
  const tagFiltersEl = document.getElementById('tagFilters');

  let comics = [];
  let activeTag = null;

  async function loadComics() {
    try {
      const res = await fetch('data/comics.json');
      if (!res.ok) throw new Error('manifest not found');
      const data = await res.json();
      comics = data.comics || [];
    } catch (err) {
      console.error('Could not load data/comics.json', err);
      comics = [];
    }
  }

  function allTags() {
    const set = new Set();
    comics.forEach(c => (c.tags || []).forEach(t => set.add(t)));
    return [...set].sort();
  }

  function renderTagFilters() {
    tagFiltersEl.innerHTML = '';
    allTags().forEach(tag => {
      const chip = document.createElement('button');
      chip.className = 'tag-chip' + (activeTag === tag ? ' active' : '');
      chip.textContent = tag;
      chip.addEventListener('click', () => {
        activeTag = activeTag === tag ? null : tag;
        renderTagFilters();
        renderGallery();
      });
      tagFiltersEl.appendChild(chip);
    });
  }

  function matchesFilters(comic, query) {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q ||
      comic.title.toLowerCase().includes(q) ||
      (comic.author || '').toLowerCase().includes(q);
    const matchesTag = !activeTag || (comic.tags || []).includes(activeTag);
    return matchesQuery && matchesTag;
  }

  function renderGallery() {
    const query = searchInput.value;
    const filtered = comics.filter(c => matchesFilters(c, query));

    gallery.innerHTML = '';
    emptyState.hidden = filtered.length > 0;

    filtered.forEach(comic => {
      const card = document.createElement('a');
      card.className = 'card';
      card.href = `reader.html?id=${encodeURIComponent(comic.id)}`;

      card.innerHTML = `
        <div class="cover-wrap">
          <img src="${comic.cover}" alt="Cover of ${escapeHtml(comic.title)}" loading="lazy">
          <div class="halftone"></div>
          <div class="page-badge">${comic.pageCount} pg</div>
        </div>
        <div class="meta">
          <h3>${escapeHtml(comic.title)}</h3>
          <div class="author">${escapeHtml(comic.author || 'Unknown')}</div>
        </div>
      `;
      gallery.appendChild(card);
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[s]));
  }

  searchInput.addEventListener('input', renderGallery);

  await loadComics();
  renderTagFilters();
  renderGallery();
})();
