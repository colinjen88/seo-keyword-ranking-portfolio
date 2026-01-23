'use strict';

/**
 * Main Application Script for SEO Portfolio
 * Handles dynamic rendering, animations, and interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Data
    const items = window.portfolioItems || [];
    const galleryGrid = document.getElementById('gallery-grid');
    const statsGrid = document.getElementById('stats-grid');

    // 2. Render Core Content
    renderAboutStats(items);
    renderGrid(items, galleryGrid, statsGrid);
    updateJsonLd(items);

    // 3. Initialize Features
    initObserver(galleryGrid);
    initLightbox();
    initEasterEgg(items, galleryGrid);
});

/**
 * Render statistics in the About section
 */
function renderAboutStats(items) {
    const totalItems = items.length;
    const rank1Items = items.filter(item => item.rank === 1).length;
    const statTotalEl = document.getElementById('stat-total');
    const statRank1El = document.getElementById('stat-rank1');
    if (statTotalEl) statTotalEl.textContent = totalItems;
    if (statRank1El) statRank1El.textContent = rank1Items;
}

/**
 * Render the main gallery grid and sidebar stats
 */
function renderGrid(items, galleryGrid, statsGrid) {
    if (!galleryGrid || !statsGrid) return;

    items.forEach((item) => {
        // Render Sidebar Stat Item
        const statEl = document.createElement('div');
        statEl.className = 'stat-item';
        statEl.innerHTML = `<span>${escapeHtml(item.title)}</span><span class="stat-rank">#${item.rank}</span>`;
        statsGrid.appendChild(statEl);

        // Render Gallery Card
        const galleryEl = document.createElement('article');
        galleryEl.className = 'glass-card gallery-item';
        galleryEl.setAttribute('data-src', item.image); // path is now absolute from data/items.js

        // Initial state handled by CSS (.gallery-item)

        galleryEl.innerHTML = `
            <figure class="item-image">
                <img src="${item.image}" alt="${escapeHtml(item.title)} - Google 搜尋排名第${item.rank}" loading="lazy" width="800" height="500">
                <figcaption class="item-caption">${escapeHtml(item.title)}搜尋排名截圖</figcaption>
                <div class="item-rank">#${item.rank}</div>
                <div class="item-overlay">
                    <span class="zoom-icon" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                    </span>
                </div>
            </figure>
            <div class="item-content">
                <h3>${escapeHtml(item.title)} <span class="rank-tag">#第${item.rank}</span> <span class="rank-date">查詢時間：${item.date}</span></h3>
                <p>${escapeHtml(item.description)}</p>
            </div>
        `;
        galleryGrid.appendChild(galleryEl);
    });
}

/**
 * Update JSON-LD for SEO
 */
function updateJsonLd(items) {
    const jsonLdBlock = document.getElementById('json-ld-items');
    if (jsonLdBlock) {
        try {
            // Check if content already exists, handle potential parsing errors
            const currentContent = jsonLdBlock.textContent.trim();
            const ldData = currentContent ? JSON.parse(currentContent) : {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": []
            };

            ldData.itemListElement = items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "CreativeWork",
                    "name": item.title,
                    "headline": `${item.title} - Google 排名第${item.rank}`,
                    "image": item.image
                }
            }));
            jsonLdBlock.textContent = JSON.stringify(ldData, null, 2);
        } catch (e) {
            console.error('JSON-LD Update Failed', e);
        }
    }
}

/**
 * Initialize Intersection Observer for animation
 */
function initObserver(galleryGrid) {
    if (!galleryGrid) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const children = Array.from(galleryGrid.children);
                const idx = children.indexOf(entry.target);
                const delay = (idx % 10) * 0.1;

                entry.target.style.transitionDelay = `${delay}s`;
                entry.target.classList.add('visible');

                // Clear inline styles to ensure CSS takes precedence
                entry.target.style.opacity = '';
                entry.target.style.transform = '';

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.gallery-item').forEach(item => {
        observer.observe(item);
    });
}

/**
 * Initialize Lightbox
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const galleryGrid = document.getElementById('gallery-grid'); // Re-select in current scope

    if (!lightbox || !lightboxImg || !galleryGrid) return;

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(() => {
            // Reset src to placeholder after transition to avoid broken image icon 
            // but only if closed.
        }, 300);
    }

    // Event Delegation
    galleryGrid.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) {
            if (e.target.closest('.item-content')) return; // Ignore text clicks
            const src = item.getAttribute('data-src');
            if (src) openLightbox(src);
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
}

/**
 * Initialize Easter Egg (Triple Click Search)
 */
function initEasterEgg(items, galleryGrid) {
    if (!galleryGrid) return;

    // Build map
    const keywordMap = {};
    items.forEach(item => {
        item.keywords.forEach(k => keywordMap[k] = k);
    });

    function extractKeyword(text) {
        for (const keyword of Object.keys(keywordMap)) {
            if (text.includes(keyword)) return keywordMap[keyword];
        }
        return null;
    }

    function openIncognitoSearch(keyword) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
        window.open(searchUrl, '_blank', 'noopener,noreferrer');
        showToast(`🔍 搜尋「${keyword}」...`);
    }

    function showToast(message) {
        let toast = document.querySelector('.search-toast');
        if (toast) toast.remove();

        toast = document.createElement('div');
        toast.className = 'search-toast';
        toast.textContent = message;
        // Styles should ideally be in CSS, but for self-contained logic:
        Object.assign(toast.style, {
            position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '12px 24px',
            borderRadius: '30px', fontSize: '14px', zIndex: '10000', pointerEvents: 'none',
            animation: 'toastFadeIn 0.3s ease, toastFadeOut 0.3s ease 2s forwards'
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    // Add CSS for toast animation if not exists
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes toastFadeIn { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
            @keyframes toastFadeOut { from { opacity:1; } to { opacity:0; } }
            .item-content h3 { cursor: pointer; }
        `;
        document.head.appendChild(style);
    }

    // Click Logic
    galleryGrid.addEventListener('click', (e) => {
        const h3 = e.target.closest('.item-content h3');
        if (!h3) return;

        e.stopPropagation();

        let clickCount = parseInt(h3.getAttribute('data-click-count') || '0');
        clickCount++;
        h3.setAttribute('data-click-count', clickCount);

        let timer = h3.getAttribute('data-click-timer');
        if (timer) clearTimeout(parseInt(timer));

        if (clickCount >= 3) {
            const keyword = extractKeyword(h3.textContent);
            if (keyword) openIncognitoSearch(keyword);
            h3.setAttribute('data-click-count', '0');
        } else {
            timer = setTimeout(() => {
                h3.setAttribute('data-click-count', '0');
            }, 500);
            h3.setAttribute('data-click-timer', timer);
        }
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
