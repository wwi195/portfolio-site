export function findWorkById(works, id) {
  return works.find((work) => work.id === id) ?? null;
}

export function renderDetailHTML(work) {
  if (!work) {
    return '<p class="page-lede">指定された作品が見つかりませんでした。</p>';
  }
  const tags = work.tags.map((tag) => `<span class="tag">${tag}</span>`).join('');
  return `
    <p class="work-category-label">${work.category}</p>
    <h1>${work.title}</h1>
    <p class="description">${work.description}</p>
    <div class="work-tags">${tags}</div>
    <p class="work-status">ステータス: ${work.status}</p>
    <a class="btn btn-primary" href="${work.url}" target="_blank" rel="noopener">アプリを開く</a>
  `;
}

async function init() {
  const container = document.getElementById('detail-container');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  try {
    const res = await fetch('data/works.json');
    const works = await res.json();
    const work = findWorkById(works, id);
    container.innerHTML = renderDetailHTML(work);
  } catch (err) {
    container.innerHTML = '<p class="page-lede">作品データの読み込みに失敗しました。</p>';
  }
}

if (typeof document !== 'undefined') {
  init();
}
