export const CATEGORY_ORDER = ['パチンコ・スロット', '収支分析ツール', 'シミュレーター', '日常ツール'];

export const GENRES = [
  { slug: 'pachinko', category: 'パチンコ・スロット', label: 'パチンコ・スロット', blurb: '実機の確率・演出をWebで再現した、無料で遊べるパチンコ・スロットシミュレーター集。' },
  { slug: 'analysis', category: '収支分析ツール', label: '収支分析ツール', blurb: '演出を省き、長期的な収支・出玉傾向だけを検証する分析特化ツール。' },
  { slug: 'simulator', category: 'シミュレーター', label: 'シミュレーター', blurb: '競馬やダイエットなど、日常の意思決定を数値でシミュレーションするツール集。' },
  { slug: 'dailytool', category: '日常ツール', label: '日常ツール', blurb: '体調管理や価格比較など、日々の暮らしをちょっと便利にするツール集。' },
];

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

export function renderGenreCard(genre, works) {
  const grouped = groupByCategory(works);
  const count = (grouped[genre.category] ?? []).length;
  return `
    <a class="genre-card" href="works.html?genre=${genre.slug}">
      <h3>${genre.label}</h3>
      <p>${genre.blurb}</p>
      <span class="genre-count">${count}件</span>
    </a>
  `;
}

export function renderGenreListHTML(works, genres = GENRES) {
  const cards = genres.map((genre) => renderGenreCard(genre, works)).join('');
  return `
    <h1>Works</h1>
    <p class="page-lede">ジャンルを選んで作品を見る。</p>
    <div class="genre-grid">${cards}</div>
  `;
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
