const fs = require('fs');

// Mock window.portfolioItems for node environment
let portfolioItems = [];
const itemsFile = fs.readFileSync('c:/new_git/seo-keyword-ranking-portfolio/data/items.js', 'utf8');
eval(itemsFile.replace('window.portfolioItems =', 'portfolioItems ='));

function escapeHtml(text) {
    if (!text) return '';
    return text.toString().replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatDate(dateStr) {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    return `${dateStr.substring(0, 4)}.${dateStr.substring(4, 6)}.${dateStr.substring(6, 8)} 更新`;
}

let galleryHtml = '';
portfolioItems.forEach(item => {
    let tagsHtml = `<span class="rank-tag">#第${item.rank}</span>`;
    if (item.showAiSummary) tagsHtml += ` <span class="rank-tag tag-ai">#AI摘要</span>`;
    if (item.showFeaturedSummary) tagsHtml += ` <span class="rank-tag tag-featured">#精選摘要</span>`;
    
    // Add the update date
    const displayDate = formatDate(item.date);
    const dateHtml = `<span class="rank-date">${displayDate}</span>`;

    galleryHtml += `
                <article class="glass-card gallery-item" data-src="${item.image}">
                    <figure class="item-image">
                        <img src="${item.image}" alt="${escapeHtml(item.title)} - Google 搜尋排名第${item.rank}" loading="lazy">
                        <div class="item-rank">#${item.rank}</div>
                        <div class="item-overlay"><span class="zoom-icon">🔍</span></div>
                    </figure>
                    <div class="item-content">
                        <h3>${escapeHtml(item.title)} ${tagsHtml}</h3>
                        ${dateHtml}
                        <p>${escapeHtml(item.description)}</p>
                    </div>
                </article>\n`;
});

fs.writeFileSync('c:/new_git/seo-keyword-ranking-portfolio/tmp_gallery_clean.html', galleryHtml, 'utf8');
