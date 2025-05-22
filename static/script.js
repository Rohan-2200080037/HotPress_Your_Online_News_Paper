function fetchNews(query = null, isSearch = false) {
  const searchInput = document.getElementById('search');
  const topic = query || searchInput.value || 'top headlines';
  const url = `/api/news/?q=${encodeURIComponent(topic)}`;

  const loader = document.getElementById('loader');
  const container = document.getElementById('news-container');
  const sectionTitle = document.getElementById('section-title');

  if (isSearch) {
    sectionTitle.innerText = `🔎 Results for "${topic}"`;
    storeRecentSearch(topic);
  } else if (query) {
    sectionTitle.innerText = `📚 ${topic} News`;
    storeRecentSearch(topic);
  }

  loader.style.display = 'block';
  container.innerHTML = '';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      loader.style.display = 'none';
      container.innerHTML = '';

      if (!data.articles || data.articles.length === 0) {
        container.innerHTML = '<p>No articles found.</p>';
        return;
      }

      data.articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.className = 'article';
        const published = new Date(article.publishedAt).toLocaleString();

        newsItem.innerHTML = `
          <h2>${article.title}</h2>
          ${article.urlToImage ? `<img src="${article.urlToImage}" alt="Image">` : ''}
          <p>${article.description || 'No description available.'}</p>
          <p><small><em>Published: ${published}</em></small></p>
          <a href="${article.url}" target="_blank">Read more</a>

        `;
        container.appendChild(newsItem);
      });
    })
    .catch(error => {
      loader.style.display = 'none';
      console.error(error);
      container.innerHTML = '<p>Error fetching news.</p>';
    });
}



// Track recent searches
function storeRecentSearch(topic) {
  let recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  if (!recent.includes(topic)) {
    recent.unshift(topic);
    if (recent.length > 5) recent.pop();
    localStorage.setItem('recentSearches', JSON.stringify(recent));
  }
}

// Show recent searches
function showRecentSearches() {
  const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = recent.length
    ? recent.map(topic => `<button onclick="fetchNews('${topic}', true)">${topic}</button>`).join('<br>')
    : '<p>No recent searches.</p>';
  document.getElementById('modal').style.display = 'block';
}

// Close modal
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle('dark');
}

// On load, show trending
window.onload = () => {
  fetchNews('trending', false);
};
