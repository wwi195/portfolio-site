export const CATEGORY_ORDER = ['パチンコ・スロット', '収支分析ツール', 'シミュレーター', '日常ツール'];

export function groupByCategory(works) {
  const grouped = {};
  for (const work of works) {
    if (!grouped[work.category]) {
      grouped[work.category] = [];
    }
    grouped[work.category].push(work);
  }
  return grouped;
}

export function renderWorkCard(work) {
  const tags = work.tags.map((tag) => `<span class="tag">${tag}</span>`).join('');
  return `
    <a class="work-card" href="detail.html?id=${work.id}">
      <h3>${work.title}</h3>
      <p>${work.description}</p>
      <div class="work-tags">${tags}</div>
    </a>
  `;
}

export function renderWorksHTML(works) {
  const grouped = groupByCategory(works);
  return CATEGORY_ORDER.filter((category) => grouped[category])
    .map((category) => `
      <section class="work-category">
        <h2>${category}</h2>
        <div class="work-grid">${grouped[category].map(renderWorkCard).join('')}</div>
      </section>
    `)
    .join('');
}

async function init() {
  const container = document.getElementById('works-container');
  if (!container) return;
  try {
    const res = await fetch('data/works.json');
    const works = await res.json();
    container.innerHTML = renderWorksHTML(works);
  } catch (err) {
    container.innerHTML = '<p class="page-lede">作品データの読み込みに失敗しました。</p>';
  }
}

if (typeof document !== 'undefined') {
  init();
}
