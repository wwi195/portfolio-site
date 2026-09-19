export function findWorkById(works, id) {
  return works.find((work) => work.id === id) ?? null;
}

const TABS = [
  { key: 'background', label: '制作背景' },
  { key: 'commitment', label: 'こだわり' },
  { key: 'fun', label: '楽しみ方' },
];

export function renderTabsHTML(details) {
  const buttons = TABS.map(
    (tab, i) => `
      <button
        type="button"
        class="tab-btn${i === 0 ? ' active' : ''}"
        role="tab"
        id="tab-${tab.key}"
        aria-controls="panel-${tab.key}"
        aria-selected="${i === 0}"
        data-tab="${tab.key}"
      >${tab.label}</button>
    `
  ).join('');
  const panels = TABS.map(
    (tab, i) => `
      <div
        class="tab-panel${i === 0 ? ' active' : ''}"
        role="tabpanel"
        id="panel-${tab.key}"
        aria-labelledby="tab-${tab.key}"
        data-tab-panel="${tab.key}"
        ${i === 0 ? '' : 'hidden'}
      >${details[tab.key]}</div>
    `
  ).join('');
  return `
    <div class="work-tabs">
      <div class="tab-list" role="tablist">${buttons}</div>
      <div class="tab-panels">${panels}</div>
    </div>
  `;
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
    ${work.details ? renderTabsHTML(work.details) : ''}
  `;
}

export function initTabs(container) {
  const tabList = container.querySelector('.tab-list');
  if (!tabList) return;
  tabList.addEventListener('click', (event) => {
    const btn = event.target.closest('.tab-btn');
    if (!btn) return;
    const key = btn.dataset.tab;
    for (const b of container.querySelectorAll('.tab-btn')) {
      const active = b.dataset.tab === key;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', String(active));
    }
    for (const p of container.querySelectorAll('.tab-panel')) {
      const active = p.dataset.tabPanel === key;
      p.classList.toggle('active', active);
      p.hidden = !active;
    }
  });
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
    initTabs(container);
  } catch (err) {
    container.innerHTML = '<p class="page-lede">作品データの読み込みに失敗しました。</p>';
  }
}

if (typeof document !== 'undefined') {
  init();
}
