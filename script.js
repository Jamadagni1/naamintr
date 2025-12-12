/* ======================================================
   NAAMIN.COM - LOGIC INTEGRATED INTO ORIGINAL LAYOUT
   ====================================================== */

const state = {
    boys: [],
    girls: [],
    gender: 'Boy',
    letter: 'A',
    loaded: false
};

// ===================== 1. PRELOADER & DATA FETCHING =====================
document.addEventListener("DOMContentLoaded", async () => {
    // Typing Effect for Original Layout
    initTypingEffect();

    // Remove Preloader Safely
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => { preloader.style.display = 'none'; }, 500);
    }

    // Fetch JSON Data
    try {
        const [b, g] = await Promise.all([
            fetch('bnames.json').then(r => r.ok ? r.json() : []),
            fetch('gnames.json').then(r => r.ok ? r.json() : [])
        ]);
        
        state.boys = Array.isArray(b) ? b : (Object.values(b).find(v => Array.isArray(v)) || []);
        state.girls = Array.isArray(g) ? g : (Object.values(g).find(v => Array.isArray(v)) || []);
        state.loaded = true;
        
        // Initial Render
        initAlphabet();
        renderNames();

    } catch (e) {
        console.error("Data load error:", e);
        document.querySelector('.name-list').innerHTML = "<p>Data could not be loaded.</p>";
    }

    // Event Listeners for Gender
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.gender = btn.dataset.gender;
            renderNames();
        });
    });

    // Event Listener for Search
    const searchBtn = document.getElementById('hero-search-btn');
    const searchInp = document.getElementById('hero-search-input');
    if (searchBtn) searchBtn.onclick = handleSearch;
    if (searchInp) searchInp.onkeypress = (e) => { if (e.key === "Enter") handleSearch(); };

    // Back Button Logic
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) backBtn.onclick = showList;
});

// ===================== 2. RENDER LOGIC =====================
function initAlphabet() {
    const container = document.querySelector('.alphabet-selector');
    if (!container) return;
    
    container.innerHTML = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    
    chars.forEach(char => {
        const btn = document.createElement("button");
        btn.className = `alphabet-btn ${char === 'A' ? 'active' : ''}`;
        btn.textContent = char;
        btn.onclick = () => {
            document.querySelectorAll('.alphabet-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.letter = char;
            renderNames();
        };
        container.appendChild(btn);
    });
}

function renderNames() {
    const container = document.querySelector('.name-list');
    if (!container) return;

    if (!state.loaded) {
        container.innerHTML = "<p>Loading...</p>";
        return;
    }

    const source = state.gender === 'Boy' ? state.boys : state.girls;
    const filtered = source.filter(n => (n.name || n.Name).toUpperCase().startsWith(state.letter));

    container.innerHTML = "";
    
    if (filtered.length === 0) {
        container.innerHTML = "<p>No names found.</p>";
        return;
    }

    filtered.forEach(p => {
        const div = document.createElement("div");
        div.className = "name-item";
        div.textContent = p.name || p.Name;
        div.onclick = () => showDetails(p);
        container.appendChild(div);
    });
}

function showDetails(data) {
    // Hide List, Show Details (Using your original structure)
    document.querySelector('.name-list-container').style.display = 'none';
    document.querySelector('.alphabet-selector').style.display = 'none';
    const detailContainer = document.querySelector('.name-details-container');
    const detailContent = document.querySelector('.name-details');
    
    detailContainer.style.display = 'block';

    // Astro Logic (Simplified for display)
    let num = 0, nameClean = (data.name || data.Name).toUpperCase().replace(/[^A-Z]/g,'');
    const map = {A:1,I:1,J:1,Q:1,Y:1,B:2,K:2,R:2,C:3,G:3,L:3,S:3,D:4,M:4,T:4,E:5,H:5,N:5,X:5,U:6,V:6,W:6,O:7,Z:7,F:8,P:8};
    for(let c of nameClean) num += map[c] || 0;
    while(num > 9) { let s=0; while(num>0){s+=num%10; num=Math.floor(num/10);} num=s; }

    detailContent.innerHTML = `
        <h2>${data.name || data.Name}</h2>
        <p><strong>Meaning:</strong> ${data.meaning || "Meaning available in database"}</p>
        <hr style="margin:20px 0; border:0; border-top:1px solid #eee;">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <div>
                <h4 style="color:var(--accent-primary)">Astrology</h4>
                <p>Rashi: Based on sound</p>
                <p>Nakshatra: Based on sound</p>
            </div>
            <div>
                <h4 style="color:var(--accent-secondary)">Numerology</h4>
                <p>Number: ${num || 1}</p>
                <p>Planet: Based on Number</p>
            </div>
        </div>
    `;
}

function showList() {
    document.querySelector('.name-details-container').style.display = 'none';
    document.querySelector('.name-list-container').style.display = 'block';
    document.querySelector('.alphabet-selector').style.display = 'flex';
}

function handleSearch() {
    const term = document.getElementById('hero-search-input').value.trim();
    if (!term) return;

    // Scroll to Finder
    document.getElementById('name-finder').scrollIntoView({behavior: 'smooth'});
    
    // Fake find for demo (or real find if loaded)
    const all = [...state.boys, ...state.girls];
    const found = all.find(n => (n.name || n.Name).toLowerCase() === term.toLowerCase());
    
    if (found) {
        showDetails(found);
    } else {
        showDetails({ name: term, meaning: "Name not in database (Analysis generated)", gender: "Neutral" });
    }
}

function initTypingEffect() {
    const el = document.getElementById("naamin-main-title-typing");
    if (!el) return;
    const text = "Naamin";
    let i = 0;
    const type = () => {
        if (i <= text.length) {
            el.innerHTML = `<span class="naamin-naam">${text.slice(0, 4)}</span><span class="naamin-in">${text.slice(4, i)}</span>`;
            i++; setTimeout(type, 150);
        } else { setTimeout(() => { i = 0; type(); }, 5000); }
    };
    type();
}
