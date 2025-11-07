// -------------------------
// DATA
// -------------------------
const resources = [
    {
        title: "NGSP Cadet File Review",
        url: "https://www.canada.ca/en/department-national-defence/services/cadets-junior-canadian-rangers/cjcr-policy/cjcrgporders/8000/8060-7/8060-7e.html",
        desc: "Official guidelines for how officers will review a cadet's file for NGSP eligibility scoring.",
        tags: ["Official", "Flight"],
        ext: true
    },
    {
        title: "Instructional Guides Finder",
        url: "https://cadetlessons.netlify.app/",
        desc: "A searchable collection of instructional guides for cadet training.",
        tags: ["Official", "Training"],
        ext: true
    },
    {
        title: "Cadet Uniform Regulations",
        url: "https://cadetuniforms.netlify.app/",
        desc: "Detailed list of proper wear for each uniform/dress.",
        tags: ["Official", "Drill"],
        ext: true
    },
	{
        title: "VFR Radio Communication Handbook",
        url: "https://www.navcanada.ca/en/vfr-phraseology.pdf",
        desc: "Detailed handbook on how to interact with the radio on board of an aircraft.",
        tags: ["Official", "Flight"],
        ext: true
    },
];

const projects = [
    {
        title: "Adding Resources",
        description: "We are working to expand the resources available in the Resources section.",
        status: "in-progress",
        progress: 15,
        due: "2025-11-12"
    },
	{
        title: "Creating NGSP Study Game",
        description: "FSgt Meilleur is working hard with the help of other seniors to create a study quiz for the NGSP.",
        status: "in-progress",
        progress: 30,
        due: "2025-11-12"
    }
];

const notes = [
    {
        v: "1.0.0",
        date: "2025-11-07",
        label: "Launch",
        title: "Hub goes live",
        bullets: [
            "Hub is published and accessible to all squadron members.",
        ]
    }
];

// -------------------------
// HELPERS
// -------------------------
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const escapeHTML = (s) => s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
const fmtDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
const statusClass = (s) => {
    if (s === 'planning') return 'planning';
    if (s === 'in-progress') return 'in-progress';
    if (s === 'completed') return 'completed';
    return '';
};
const statusLabel = (s) => {
    if (s === 'planning') return 'Planning';
    if (s === 'in-progress') return 'In Progress';
    if (s === 'completed') return 'Completed';
    return s;
};

// -------------------------
// TAG COLORS
// -------------------------
const tagColors = {
	'official': '#D4AF37',    // golden
	'training': '#2A9D8F',
	'calendar': '#F4A261',
	'community': '#8ECAE6',
	'wellness': '#A8DADC',
	'forms': '#E76F51',
	'tools': '#264653',
	'programming': '#4F46E5',
	'general': '#6B7280'
};

// pick black or white depending on background luminance for readability
const idealTextColor = (hex) => {
	hex = (hex || '#ffffff').replace('#', '');
	if (hex.length === 3) hex = hex.split('').map(s => s + s).join('');
	const r = parseInt(hex.substr(0,2),16);
	const g = parseInt(hex.substr(2,2),16);
	const b = parseInt(hex.substr(4,2),16);
	// perceptual luminance
	const lum = 0.299*r + 0.587*g + 0.114*b;
	return lum > 186 ? '#000000' : '#ffffff';
};

// -------------------------
// RENDER: RESOURCES
// -------------------------
const grid = $('#resourceGrid');
const emptyState = $('#emptyState');
const searchInput = $('#search');
const chips = $$('.chip[data-filter]');

let resourceQuery = '';
let resourceCategory = 'all';

function resourceCard(r) {
    const tag = r.tags?.[0] || 'General';
    const tagKey = (tag || 'general').toLowerCase();
    const bg = tagColors[tagKey] || tagColors['general'];
    const fg = idealTextColor(bg);
    const safeTitle = escapeHTML(r.title);
    const safeDesc = escapeHTML(r.desc);
    const safeUrl = escapeHTML(r.url);
    return `
        <article class="card" data-tags="${escapeHTML(r.tags.join(','))}">
          <span class="tag" style="background:${bg}; color:${fg};">${escapeHTML(tag)}</span>
          <h3>${safeTitle}</h3>
          <p>${safeDesc}</p>
          <div class="actions">
            ${r.ext ? `<a class="ext" href="${safeUrl}" target="_blank" rel="noopener">Open link
              <?xml version="1.0" encoding="UTF-8"?><svg width="16" height="16" viewBox="0 0 24 24" stroke-width="1.6" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffff"><path d="M21 3L15 3M21 3L12 12M21 3V9" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H11" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"></path></svg>
            </a>` : `<a class="ext" href="${safeUrl}">Open link</a>`}
            <button class="copy" data-url="${safeUrl}" aria-label="Copy link to ${safeTitle}">
              <?xml version="1.0" encoding="UTF-8"?><svg width="16" height="16" stroke-width="1.6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffff"><path d="M19.4 20H9.6C9.26863 20 9 19.7314 9 19.4V9.6C9 9.26863 9.26863 9 9.6 9H19.4C19.7314 9 20 9.26863 20 9.6V19.4C20 19.7314 19.7314 20 19.4 20Z" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 9V4.6C15 4.26863 14.7314 4 14.4 4H4.6C4.26863 4 4 4.26863 4 4.6V14.4C4 14.7314 4.26863 15 4.6 15H9" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              Copy
            </button>
          </div>
        </article>
      `;
}

function filterResources() {
    const q = resourceQuery.trim().toLowerCase();
    const matches = resources.filter(r => {
        const inCat = (resourceCategory === 'all') || (r.tags || []).includes(resourceCategory);
        if (!inCat) return false;
        if (!q) return true;
        const hay = [r.title, r.desc, r.url, ...(r.tags || [])].join(' ').toLowerCase();
        return hay.includes(q);
    });
    grid.innerHTML = matches.map(resourceCard).join('') || '';
    emptyState.hidden = matches.length > 0;
}

searchInput.addEventListener('input', e => { resourceQuery = e.target.value || ''; filterResources(); });
chips.forEach(chip => {
    chip.addEventListener('click', () => {
        chips.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-selected', 'false'); });
        chip.classList.add('active'); chip.setAttribute('aria-selected', 'true');
        resourceCategory = chip.dataset.filter;
        filterResources();
    });
});

grid.addEventListener('click', async (e) => {
    const btn = e.target.closest('.copy');
    if (!btn) return;
    const url = btn.dataset.url;
    try {
        await navigator.clipboard.writeText(url);
        const original = btn.innerHTML;
        btn.innerHTML = 'Copied!';
        setTimeout(() => btn.innerHTML = original, 1100);
    } catch {
        // Fallback
        const original = btn.innerHTML;
        btn.innerHTML = 'Copy failed';
        setTimeout(() => btn.innerHTML = original, 1200);
    }
});

// -------------------------
// RENDER: PROJECTS
// -------------------------
const projectGrid = $('#projectGrid');
const projectSearch = $('#projectSearch');
const pChips = $$('.chip[data-pfilter]');
let pQuery = '';
let pFilter = 'all';

function projectItem(p) {
    const sClass = statusClass(p.status);
    return `
        <article class="project">
          <div>
            <h3>${escapeHTML(p.title)}</h3>
            <p>${escapeHTML(p.description)}</p>
          </div>
          <div class="proj-actions">
            <span class="status ${sClass}" title="Status: ${statusLabel(p.status)}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                ${p.status === 'completed' ? '<path d="M20 7L9 18l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' :
            p.status === 'in-progress' ? '<path d="M12 6L12 12L18 12" stroke="#0b1f45" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0b1f45" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>' :
                '<path d="M12 8v4m0 4h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>'}
              </svg>
              ${statusLabel(p.status)}
            </span>
          </div>
          <div class="meta">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M8 7h8M8 12h8M8 17h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Due: ${fmtDate(p.due)}
          </div>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p.progress}" aria-label="Progress">
            <div class="bar" style="width:${p.progress}%;"></div>
          </div>
        </article>
      `;
}

function filterProjects() {
    const q = pQuery.trim().toLowerCase();
    const filtered = projects.filter(p => {
        if (pFilter !== 'all' && p.status !== pFilter) return false;
        if (!q) return true;
        const hay = [p.title, p.description].join(' ').toLowerCase();
        return hay.includes(q);
    });
    projectGrid.innerHTML = filtered.map(projectItem).join('') || '<div class="empty" style="grid-column:1/-1;">No projects found.</div>';
}

projectSearch.addEventListener('input', e => { pQuery = e.target.value || ''; filterProjects(); });
pChips.forEach(chip => {
    chip.addEventListener('click', () => {
        pChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        pFilter = chip.dataset.pfilter;
        filterProjects();
    });
});

// -------------------------
// RENDER: NOTES
// -------------------------
const notesEl = $('#notes');
function noteItem(n) {
    return `
        <article class="note">
          <h3>v${escapeHTML(n.v)} <span class="badge">${escapeHTML(n.label)}</span></h3>
          <time datetime="${escapeHTML(n.date)}">${fmtDate(n.date)}</time>
          <p style="margin:.4rem 0 .2rem; font-weight:700;">${escapeHTML(n.title)}</p>
          <ul>
            ${n.bullets.map(b => `<li>${escapeHTML(b)}</li>`).join('')}
          </ul>
        </article>
      `;
}
notesEl.innerHTML = notes.map(noteItem).join('');

// -------------------------
// INIT
// -------------------------
filterResources();
filterProjects();
$('#year').textContent = new Date().getFullYear();

// -------------------------
// TO TOP BUTTON
// -------------------------
const toTop = $('#toTop');
const onScroll = () => {
    if (window.scrollY > 400) toTop.classList.add('show');
    else toTop.classList.remove('show');
};
window.addEventListener('scroll', onScroll, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// -------------------------
// ACCESSIBILITY: keyboard focus styles
// -------------------------
document.body.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') document.body.classList.add('show-focus');

});

