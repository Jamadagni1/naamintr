/* ======================================================
   NAAMIN.COM - OPTIMIZED CORE ENGINE
   ====================================================== */

// 1. GLOBAL CONFIGURATION
const APP_CONFIG = {
    files: {
        boys: 'bnames.json',
        girls: 'gnames.json'
    },
    typingSpeed: 150
};

// Global State
const state = {
    boyNames: [],
    girlNames: [],
    isLoaded: false,
    currentGender: 'Boy',
    currentLetter: 'A'
};

// ======================================================
// 2. PRELOADER LOGIC (Fail-Safe)
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById('preloader');
    
    const removePreloader = () => {
        if(preloader && preloader.style.display !== 'none') {
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
        }
    };

    // Remove when everything is loaded
    window.addEventListener('load', removePreloader);

    // Backup: Force remove after 3 seconds (if load event hangs)
    setTimeout(removePreloader, 3000);
});

// ======================================================
// 3. ASTROLOGY ENGINE
// ======================================================
class AstroEngine {
    constructor() {
        this.numerologyMap = { 
            'A':1,'I':1,'J':1,'Q':1,'Y':1,'B':2,'K':2,'R':2,'C':3,'G':3,'L':3,'S':3,
            'D':4,'M':4,'T':4,'E':5,'H':5,'N':5,'X':5,'U':6,'V':6,'W':6,'O':7,'Z':7,'F':8,'P':8 
        };

        this.rashiMap = [
            { rashi: "मेष (Aries)", sound: "chu,che,cho,la,li,lu,le,lo,a", nakshatras: ["Ashwini", "Bharani", "Krittika (1)"], phal: "साहसी, ऊर्जावान और नेतृत्व करने वाला।" },
            { rashi: "वृषभ (Taurus)", sound: "i,ee,u,oo,e,o,va,vi,vu,ve,vo", nakshatras: ["Krittika (2-4)", "Rohini", "Mrigashira (1-2)"], phal: "शांत, विश्वसनीय और कला प्रेमी।" },
            { rashi: "मिथुन (Gemini)", sound: "ka,ki,ku,gh,ng,ch,ke,ko,ha", nakshatras: ["Mrigashira (3-4)", "Ardra", "Punarvasu (1-3)"], phal: "बुद्धिमान, वाचाल और बहुमुखी।" },
            { rashi: "कर्क (Cancer)", sound: "hi,hu,he,ho,da,di,du,de,do", nakshatras: ["Punarvasu (4)", "Pushya", "Ashlesha"], phal: "भावुक, संवेदनशील और रक्षक।" },
            { rashi: "सिंह (Leo)", sound: "ma,mi,mu,me,mo,ta,ti,tu,te", nakshatras: ["Magha", "Purva Phalguni", "Uttara Phalguni (1)"], phal: "आत्मविश्वासी, उदार और राजसी।" },
            { rashi: "कन्या (Virgo)", sound: "to,pa,pi,pu,sha,na,th,pe,po", nakshatras: ["Uttara Phalguni (2-4)", "Hasta", "Chitra (1-2)"], phal: "व्यावहारिक, विश्लेषक और मेहनती।" },
            { rashi: "तुला (Libra)", sound: "ra,ri,ru,re,ro,ta,ti,tu,te", nakshatras: ["Chitra (3-4)", "Swati", "Vishakha (1-3)"], phal: "न्यायप्रिय, संतुलित और मिलनसार।" },
            { rashi: "वृश्चिक (Scorpio)", sound: "to,na,ni,nu,ne,no,ya,yi,yu", nakshatras: ["Vishakha (4)", "Anuradha", "Jyeshtha"], phal: "तीव्र, रहस्यमयी और दृढ़।" },
            { rashi: "धनु (Sagittarius)", sound: "ye,yo,bha,bhi,bhu,dha,pha,dha,bhe", nakshatras: ["Mula", "Purva Ashadha", "Uttara Ashadha (1)"], phal: "आशावादी, दार्शनिक और मुक्त।" },
            { rashi: "मकर (Capricorn)", sound: "bho,ja,ji,ju,je,jo,kha,ga,gi", nakshatras: ["Uttara Ashadha (2-4)", "Shravana", "Dhanishtha (1-2)"], phal: "महत्वाकांक्षी, अनुशासित और धैर्यवान।" },
            { rashi: "कुम्भ (Aquarius)", sound: "gu,ge,go,sa,si,su,se,so,da", nakshatras: ["Dhanishtha (3-4)", "Shatabhisha", "Purva Bhadrapada (1-3)"], phal: "नवीन सोच, मानवीय और मित्रवत।" },
            { rashi: "मीन (Pisces)", sound: "di,du,th,jha,yna,de,do,cha,chi", nakshatras: ["Purva Bhadrapada (4)", "Uttara Bhadrapada", "Revati"], phal: "दयालु, आध्यात्मिक और कल्पनाशील।" }
        ];

        this.astroDetails = {
            1: { planet: "Sun (सूर्य)", color: "Golden", trait: "Leadership" }, 
            2: { planet: "Moon (चंद्र)", color: "White", trait: "Peace" }, 
            3: { planet: "Jupiter (गुरु)", color: "Yellow", trait: "Wisdom" },
            4: { planet: "Rahu (राहु)", color: "Blue", trait: "Rebel" }, 
            5: { planet: "Mercury (बुध)", color: "Green", trait: "Intellect" }, 
            6: { planet: "Venus (शुक्र)", color: "Pink", trait: "Luxury" },
            7: { planet: "Ketu (केतु)", color: "Multi-Color", trait: "Spirituality" }, 
            8: { planet: "Saturn (शनि)", color: "Black", trait: "Discipline" }, 
            9: { planet: "Mars (मंगल)", color: "Red", trait: "Energy" }
        };
    }

    calculateNumerology(name) {
        if(!name) return 1;
        let total = 0, clean = name.toUpperCase().replace(/[^A-Z]/g,'');
        for(let c of clean) total += this.numerologyMap[c] || 0;
        while(total > 9) { 
            let s = 0; 
            while(total > 0) { s += total % 10; total = Math.floor(total / 10); } 
            total = s; 
        }
        return total || 1;
    }

    calculateRashi(name) {
        if(!name) return this.rashiMap[0];
        let n = name.toLowerCase().trim();
        for(let r of this.rashiMap) { 
            let sounds = r.sound.split(',');
            for(let s of sounds) { if(n.startsWith(s)) return r; }
        }
        return { rashi: "Unknown", nakshatras: ["-"], phal: "Data unavailable." };
    }

    processName(data) {
        let safeName = data.name || data.Name;
        if(!safeName) return null;
        const num = this.calculateNumerology(safeName);
        const rashiData = this.calculateRashi(safeName);
        const astro = this.astroDetails[num] || this.astroDetails[1];

        return {
            ...data, name: safeName, meaning: data.meaning || "Meaning available in database.",
            rashi: rashiData.rashi, nakshatra: rashiData.nakshatras.join(", "), phal: rashiData.phal,
            num: num, planet: astro.planet, color: astro.color, trait: astro.trait
        };
    }
}
const engine = new AstroEngine();

// ======================================================
// 4. MAIN INITIALIZATION
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initLanguage();
    initMobileMenu();
    initScrollToTop();
    initTypingEffect();
    initDataFetching();
    
    // Setup Search
    const searchBtn = document.getElementById('hero-search-btn');
    const searchInput = document.getElementById('hero-search-input');
    if(searchBtn) searchBtn.addEventListener('click', handleHeroSearch);
    if(searchInput) searchInput.addEventListener('keypress', (e) => { if(e.key === "Enter") handleHeroSearch(); });

    // Setup Name Finder
    initAlphabet();
    initGenderToggles();
});

// ======================================================
// 5. DATA FETCHING
// ======================================================
async function initDataFetching() {
    if(state.isLoaded) return;
    try {
        const [bRes, gRes] = await Promise.all([
            fetch(APP_CONFIG.files.boys).then(res => res.ok ? res.json() : []),
            fetch(APP_CONFIG.files.girls).then(res => res.ok ? res.json() : [])
        ]);
        state.boyNames = Array.isArray(bRes) ? bRes : (Object.values(bRes).find(v => Array.isArray(v)) || []);
        state.girlNames = Array.isArray(gRes) ? gRes : (Object.values(gRes).find(v => Array.isArray(v)) || []);
        state.isLoaded = true;
        renderNameList();
    } catch (error) {
        console.error("JSON Fetch Error:", error);
    }
}

// ======================================================
// 6. FEATURES
// ======================================================

/* Typing Effect */
function initTypingEffect() {
    const el = document.getElementById("naamin-main-title-typing");
    if(!el) return;
    const text = "Naamin";
    let i = 0;
    const type = () => {
        if(i <= text.length) {
            el.innerHTML = `<span class="naamin-naam">${text.slice(0, 4)}</span><span class="naamin-in">${text.slice(4, i)}</span>`;
            i++; setTimeout(type, APP_CONFIG.typingSpeed);
        } else { setTimeout(() => { i = 0; type(); }, 5000); }
    };
    type();
}

/* Mobile Menu */
function initMobileMenu() {
    const hamburger = document.getElementById("hamburger-menu");
    const nav = document.getElementById("main-nav");
    if(hamburger && nav) {
        const links = nav.querySelector('.nav-links');
        hamburger.onclick = (e) => {
            e.stopPropagation();
            links.classList.toggle("active");
        };
        document.onclick = (e) => {
            if(!nav.contains(e.target)) links.classList.remove("active");
        };
    }
}

/* Search Logic */
async function handleHeroSearch() {
    const input = document.getElementById('hero-search-input');
    if(!input || !input.value.trim()) return;
    const term = input.value.trim().toLowerCase();
    
    if(!state.isLoaded) await initDataFetching();
    
    const section = document.getElementById('name-finder');
    if(section) {
        section.scrollIntoView({ behavior: 'smooth' });
        toggleView('details');
        const container = document.getElementById('detail-card-content');
        container.innerHTML = '<div class="spinner"></div><p style="text-align:center">Analyzing...</p>';
        
        const allNames = [...state.boyNames, ...state.girlNames];
        const found = allNames.find(n => (n.name || n.Name).toLowerCase() === term);
        
        let dataToProcess = found ? found : {
            name: term.charAt(0).toUpperCase() + term.slice(1),
            meaning: "Auto-Generated Analysis", gender: "Neutral"
        };
        const processed = engine.processName(dataToProcess);
        renderDetailView(container, processed);
    }
}

/* Name Finder Logic */
function initAlphabet() {
    const container = document.getElementById('alphabet-container');
    if(!container) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    container.innerHTML = "";
    chars.forEach(char => {
        const btn = document.createElement("button");
        btn.className = `alpha-btn ${char === state.currentLetter ? 'active' : ''}`;
        btn.textContent = char;
        btn.onclick = () => {
            document.querySelectorAll('.alpha-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentLetter = char;
            renderNameList();
        };
        container.appendChild(btn);
    });
}

function initGenderToggles() {
    const btns = document.querySelectorAll('.gender-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentGender = btn.dataset.gender;
            renderNameList();
        });
    });
    const backBtn = document.getElementById('back-to-list');
    if(backBtn) backBtn.onclick = () => toggleView('list');
}

function renderNameList() {
    const grid = document.getElementById('name-grid-output');
    if(!grid) return;
    grid.innerHTML = "";
    
    if(!state.isLoaded) { grid.innerHTML = '<div class="spinner"></div>'; return; }
    
    const source = state.currentGender === "Boy" ? state.boyNames : state.girlNames;
    const filtered = source.filter(n => (n.name || n.Name).toUpperCase().startsWith(state.currentLetter));
    
    if(filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:gray;">No names found.</div>`;
        return;
    }
    
    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'name-card-item';
        card.innerHTML = `<h3>${p.name || p.Name}</h3><p>${(p.meaning || "").substring(0,30)}...</p>`;
        card.onclick = () => {
            toggleView('details');
            const processed = engine.processName(p);
            renderDetailView(document.getElementById('detail-card-content'), processed);
        };
        grid.appendChild(card);
    });
}

function renderDetailView(container, data) {
    if(!container) return;
    container.innerHTML = `
        <div style="text-align:center; margin-bottom:25px;">
            <h2 style="font-size:2.5rem; color:var(--primary);">${data.name}</h2>
            <span class="badge">${data.gender || state.currentGender}</span>
            <p style="font-size:1.1rem; margin-top:10px;">"${data.meaning}"</p>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:20px;">
            <div style="background:rgba(139,92,246,0.1); padding:20px; border-radius:16px;">
                <h4 style="color:var(--secondary); margin-bottom:10px;"><i class="fas fa-star"></i> Vedic Astrology</h4>
                <div><strong>Rashi:</strong> ${data.rashi}</div>
                <div><strong>Nakshatra:</strong> ${data.nakshatra}</div>
                <div style="font-size:0.9rem; margin-top:5px;">${data.phal}</div>
            </div>
            <div style="background:rgba(249,115,22,0.1); padding:20px; border-radius:16px;">
                <h4 style="color:var(--primary); margin-bottom:10px;"><i class="fas fa-hashtag"></i> Numerology</h4>
                <div><strong>Number:</strong> ${data.num}</div>
                <div><strong>Planet:</strong> ${data.planet}</div>
                <div><strong>Color:</strong> ${data.color}</div>
            </div>
        </div>
    `;
}

function toggleView(view) {
    const list = document.getElementById('name-list-view');
    const details = document.getElementById('name-detail-view');
    const filters = document.querySelector('.filters-container');
    if(view === 'details') {
        list.classList.add('hidden'); filters.classList.add('hidden');
        details.classList.remove('hidden');
    } else {
        details.classList.add('hidden');
        list.classList.remove('hidden'); filters.classList.remove('hidden');
    }
}

/* Utilities */
function initTheme() {
    const btn = document.getElementById("theme-toggle");
    if(!btn) return;
    const update = (th) => {
        document.body.setAttribute("data-theme", th);
        btn.innerHTML = th === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem("theme", th);
    };
    btn.onclick = () => update(document.body.getAttribute("data-theme") === "dark" ? "light" : "dark");
    update(localStorage.getItem("theme") || "light");
}

function initLanguage() {
    const btn = document.getElementById("language-toggle");
    if(!btn) return;
    const update = (lang) => {
        document.documentElement.lang = lang;
        document.querySelectorAll("[data-en]").forEach(el => el.textContent = el.getAttribute(lang==="hi"?"data-hi":"data-en"));
        const inp = document.getElementById("hero-search-input");
        if(inp) inp.placeholder = lang==="hi" ? "उदा: आरव..." : "e.g., Aarav...";
        localStorage.setItem("language", lang);
    };
    btn.onclick = () => update(localStorage.getItem("language")==="hi"?"en":"hi");
    update(localStorage.getItem("language") || "en");
}

function initScrollToTop() {
    const btn = document.getElementById("scrollToTopBtn");
    if(!btn) return;
    window.onscroll = () => btn.classList.toggle("show", window.scrollY > 300);
    btn.onclick = () => window.scrollTo({top:0, behavior:"smooth"});
}
