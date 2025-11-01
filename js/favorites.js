// Favorites management for BookVault
(function(){
  function storageKey(){
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    return user ? `bookVaultFavorites_${user.id}` : null;
  }

  function getFavorites(){
    const key = storageKey();
    if (!key) return [];
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : [];
  }

  function saveFavorites(list){
    const key = storageKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(list));
  }

  function isFavorite(bookId){
    const list = getFavorites();
    return list.some(b => b.id === bookId);
  }

  function addFavorite(book){
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (!user){
      alert((window.__i18n ? window.__i18n.t('auth.pleaseLoginToSave') : 'Please login to save books to your library'));
      return false;
    }
    const list = getFavorites();
    if (list.some(b => b.id === book.id)) return true;
    list.push(book);
    saveFavorites(list);
    return true;
  }

  function removeFavorite(bookId){
    const list = getFavorites();
    const next = list.filter(b => b.id !== bookId);
    saveFavorites(next);
    return true;
  }

  function toggleFavorite(book){
    if (isFavorite(book.id)){
      removeFavorite(book.id);
      return false;
    } else {
      addFavorite(book);
      return true;
    }
  }

  function displayFavorites(){
    const container = document.getElementById('favoritesContainer');
    const empty = document.getElementById('emptyFavorites');
    if (!container) return;
    const list = getFavorites();
    container.innerHTML = '';
    if (!list.length){
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';
    const frag = document.createDocumentFragment();
    list.forEach(book => {
      const card = document.createElement('div');
      card.className = 'book-card favorite-book-card';
      const img = document.createElement('img');
      img.className = 'book-cover';
      const thumb = (typeof getThumbnailUrl === 'function') ? getThumbnailUrl(book.thumbnail) : book.thumbnail;
      if (thumb && (typeof isValidUrl === 'undefined' || isValidUrl(thumb))){
        img.src = thumb; img.alt = book.title || '';
      } else {
        img.style.display = 'none';
        const ph = document.createElement('div');
        ph.className = 'book-cover';
        ph.textContent = (typeof createPlaceholderCover === 'function') ? createPlaceholderCover(book.title) : '📚';
        card.appendChild(ph);
      }
      if (img.style.display !== 'none') card.appendChild(img);

      const info = document.createElement('div');
      info.className = 'book-info';
      const h3 = document.createElement('h3'); h3.className = 'book-title'; h3.textContent = (typeof sanitizeHTML === 'function') ? sanitizeHTML(book.title) : (book.title||'');
      const p = document.createElement('p'); p.className = 'book-author'; p.textContent = (typeof formatAuthors === 'function') ? formatAuthors(book.authors) : (book.authors||'');
      info.appendChild(h3); info.appendChild(p);

      const actions = document.createElement('div'); actions.className = 'book-actions';
      const removeBtn = document.createElement('button');
      removeBtn.className = 'library-remove-btn';
      removeBtn.textContent = (window.__i18n ? window.__i18n.t('favorites.remove') : 'Remove');
      removeBtn.onclick = () => { removeFavorite(book.id); displayFavorites(); };
      const detailsBtn = document.createElement('button');
      detailsBtn.className = 'book-link';
      detailsBtn.textContent = (window.__i18n ? window.__i18n.t('book.viewDetails') : 'View Details');
      detailsBtn.onclick = () => { if (typeof showBookDetails==='function') showBookDetails(book); };
      actions.appendChild(removeBtn); actions.appendChild(detailsBtn);

      info.appendChild(actions);
      card.appendChild(info);

      frag.appendChild(card);
    });
    container.appendChild(frag);
  }

  // Expose
  window.favorites = { getFavorites, saveFavorites, isFavorite, toggleFavorite, addFavorite, removeFavorite, displayFavorites };
})();
