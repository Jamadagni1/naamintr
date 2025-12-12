/* ================== CORE LOGIC ================== */
const state = {
    boys: [],
    girls: [],
    gender: 'Boy',
    letter: 'A',
    loaded: false
};

// 1. PRELOADER & DATA FETCHING
window.addEventListener('load', async () => {
    // Hide Preloader
    const preloader = document.getElementById('preloader');
    if(preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 500);
    }

    // Fetch Data safely
    try {
        const [b, g] = await Promise.all([
            fetch('bnames.json').then(r => r.ok ? r.json() : []),
            fetch('gnames.json').then(r => r.ok ? r.json() : [])
        ]);
        // Normalize Data (Handle object or array)
        state.boys = Array.isArray(b) ? b : (Object.values(b).find(v => Array.isArray(v)) || []);
        state.girls = Array.isArray(g) ? g : (Object.values(g).find(v => Array.isArray(v)) || []);
        state.loaded = true;
        renderNames(); // Initial Render
    } catch (e) {
        console.error("Data missing", e);
    }
});

// 2. NAME RENDERER
function renderNames() {
    const grid = document.getElementById('name-grid');
    if(!grid) return;
    
    if(!state.loaded) {
        grid.innerHTML = '<p style="text-align:center; width:100%;">Loading Data...</p>';
        return;
    }

    const list = state.gender === 'Boy' ? state.boys : state.girls;
    const filtered = list.filter(n => (n.name || n.Name).toUpperCase().startsWith(state.letter));

    grid.innerHTML = '';
    if(filtered.length === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%;">No names found.</p>';
        return;
    }

    filtered.forEach(p => {
        const div = document.createElement('div');
        div.className = 'name-item';
        div.innerHTML = `<h3>${p.name || p.Name}</h3><p>${(p.meaning || "").substring(0,30)}...</p>`;
        div.onclick = () => showDetail(p);
        grid.appendChild(div);
    });
}

// 3. SHOW DETAILS
function showDetail(data) {
    document.getElementById('tool-list').classList.add('hidden');
    document.getElementById('tool-detail').classList.remove('hidden');
    
    // Simple Numerology Calc
    let num = 0, name = (data.name || data.Name).toUpperCase().replace(/[^A-Z]/g,'');
    const map = {A:1,I:1,J:1,Q:1,Y:1,B:2,K:2,R:2,C:3,G:3,L:3,S:3,D:4,M:4,T:4,E:5,H:5,N:5,X:5,U:6,V:6,W:6,O:7,Z:7,F:8,P:8};
    for(let c of name) num += map[c] || 0;
    while(num > 9) { let s=0; while(num>0){s+=num%10; num=Math.floor(num/10);} num=s; }

    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div class="detail-header">
            <h2>${data.name || data.Name}</h2>
            <p>${data.meaning}</p>
        </div>
        <div class="detail-grid">
            <div class="info-box">
                <h4>Astrology</h4>
                <p><strong>Rashi:</strong> Auto-Calc based on sound</p>
                <p><strong>Planet:</strong> Based on Numerology</p>
            </div>
            <div class="info-box">
                <h4>Numerology</h4>
                <p><strong>Number:</strong> ${num || 1}</p>
                <p><strong>Lucky:</strong> High</p>
            </div>
        </div>
    `;
}

// 4. EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
    // Alphabet
    const alphaDiv = document.getElementById('alphabet');
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    chars.forEach(c => {
        const btn = document.createElement('button');
        btn.className = `alpha-btn ${c==='A'?'active':''}`;
        btn.innerText = c;
        btn.onclick = () => {
            document.querySelectorAll('.alpha-btn').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            state.letter = c;
            renderNames();
        };
        alphaDiv.appendChild(btn);
    });

    // Gender
    document.querySelectorAll('.g-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.g-btn').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            state.gender = btn.dataset.gen;
            renderNames();
        };
    });

    // Back Button
    document.getElementById('back-btn').onclick = () => {
        document.getElementById('tool-detail').classList.add('hidden');
        document.getElementById('tool-list').classList.remove('hidden');
    };

    // Mobile Menu
    document.getElementById('hamburger').onclick = () => {
        document.querySelector('.nav-links').style.display = 
            document.querySelector('.nav-links').style.display === 'flex' ? 'none' : 'flex';
    };
});
