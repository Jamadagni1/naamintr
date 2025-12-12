/* ======================================================
   NAAMIN.COM - CORE LOGIC ENGINE
   ====================================================== */

// 1. CONFIGURATION & STATE
const APP_CONFIG = {
    files: {
        boys: 'bnames.json',
        girls: 'gnames.json'
    },
    animationSpeed: 150
};

// Global State to prevent re-fetching
const state = {
    boyNames: [],
    girlNames: [],
    isLoaded: false,
    currentGender: 'Boy',
    currentLetter: 'A'
};

// ======================================================
// 2. ASTRO ENGINE (The Brain)
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
            1: { planet: "Sun (सूर्य)", color: "Golden (सुनहरा)", trait: "Leadership" }, 
            2: { planet: "Moon (चंद्र)", color: "White (सफेद)", trait: "Peace" }, 
            3: { planet: "Jupiter (गुरु)", color: "Yellow (पीला)", trait: "Wisdom" },
            4: { planet: "Rahu (राहु)", color: "Blue (नीला)", trait: "Rebel" }, 
            5: { planet: "Mercury (बुध)", color: "Green (हरा)", trait: "Intellect" }, 
            6: { planet: "Venus (शुक्र)", color: "Pink (गुलाबी)", trait: "Luxury" },
            7: { planet: "Ketu (केतु)", color: "Multi-Color", trait: "Spirituality" }, 
            8: { planet: "Saturn (शनि)", color: "Black (काला)", trait: "Discipline" }, 
            9: { planet: "Mars (मंगल)", color: "Red (लाल)", trait: "Energy" }
        };
    }

    calculateNumerology(name) {
        if(!name) return 1;
        let total = 0, clean = name.toUpperCase().replace(/[^A-Z]/g,'');
        for(let c of clean) total += this.numerologyMap[c] || 0;
        
        // Reduce to single digit
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
            for(let s of sounds) {
                if(n.startsWith(s)) return r; 
            }
        }
        return { 
            rashi: "Unknown", 
            nakshatras: ["Unknown"], 
            phal: "Data not available for this sound pattern." 
        };
    }

    processName(data) {
        let safeName = data.name || data.Name;
        if(!safeName) return null;
        
        const num = this.calculateNumerology(safeName);
        const rashiData = this.calculateRashi(safeName);
        const astro = this.astroDetails[num] || this.astroDetails[1];

        return {
            ...data, 
            name: safeName,
            meaning: data.meaning || "Meaning available in database.",
            
            // Generated Astro Data
            rashi: rashiData.rashi, 
            nakshatra: rashiData.nakshatras.join(", "), 
            phal: rashiData.phal,
            
            // Generated Numero Data
            num: num, 
            planet: astro.planet, 
            color: astro.color,
            trait: astro.trait
        };
    }
}

const engine = new AstroEngine();

// ======================================================
// 3. UI HELPERS & INITIALIZATION
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // --- Initial Setup ---
    initTheme();
    initLanguage();
    initMobileMenu();
    initScrollToTop();
    initTypingEffect();
    initDataFetching(); // Pre-fetch data silently

    // --- Search Handlers ---
    const searchBtn = document.getElementById('hero-search-btn');
    const searchInput = document.getElementById('hero-search-input');
    
    if(searchBtn) searchBtn.addEventListener('click', handleHeroSearch);
    if(searchInput) searchInput.addEventListener('keypress', (e) => { if(e.key === "Enter") handleHeroSearch(); });

    // --- Name Finder Handlers ---
    initAlphabet();
    initGenderToggles();
});


// ======================================================
// 4. DATA MANAGEMENT (Smart Fetching)
// ======================================================
async function initDataFetching() {
    if(state.isLoaded) return;
    
    try {
        const [bRes, gRes] = await Promise.all([
            fetch(APP_CONFIG.files.boys).then(res => res.ok ? res.json() : []),
            fetch(APP_CONFIG.files.girls).then(res => res.ok ? res.json() : [])
        ]);

        // Normalize Data structure (Handle array or object)
        state.boyNames = Array.isArray(bRes) ? bRes : (Object.values(bRes).find(v => Array.isArray(v)) || []);
        state.girlNames = Array.isArray(gRes) ? gRes : (Object.values(gRes).find(v => Array.isArray(v)) || []);
        state.isLoaded = true;
        
        // Initial Render
        renderNameList();
        
    } catch (error) {
        console.error("Data Fetch Error:", error);
    }
}

// ======================================================
// 5. FEATURE LOGIC
// ======================================================

/* --- Typing Effect --- */
function initTypingEffect() {
    const typeElement = document.getElementById("naamin-main-title-typing");
    if (!typeElement) return;

    const text = "Naamin";
    let i = 0;

    function type() {
        if (i <= text.length) {
            typeElement.innerHTML = `
                <span class="naamin-naam">${text.slice(0, 4)}</span><span class="naamin-in">${text.slice(4, i)}</span>
            `;
            i++;
            setTimeout(type, APP_CONFIG.animationSpeed);
        } else {
            setTimeout(() => { i = 0; type(); }, 5000); // Loop after 5s
        }
    }
    type();
}

/* --- Hero Search Logic --- */
async function handleHeroSearch() {
    const input = document.getElementById('hero-search-input');
    if(!input || !input.value.trim()) return;

    const term = input.value.trim().toLowerCase();
    
    // Ensure data is loaded
    if(!state.isLoaded) await initDataFetching();

    // Scroll to results
    const section = document.getElementById('name-finder');
    if(section) {
        section.scrollIntoView({ behavior: 'smooth' });
        toggleView('details');
        
        const detailsContainer = document.getElementById('detail-card-content');
        detailsContainer.innerHTML = '<div class="spinner"></div><p style="text-align:center; margin-top:10px;">Analyzing Stars...</p>';

        // Search in both arrays
        const allNames = [...state.boyNames, ...state.girlNames];
        const found = allNames.find(n => (n.name || n.Name).toLowerCase() === term);

        let dataToProcess = found ? found : {
            name: term.charAt(0).toUpperCase() + term.slice(1),
            meaning: "Auto-Generated Analysis (Name not in database)",
            gender: "Neutral",
            origin: "Universal"
        };

        const processedData = engine.processName(dataToProcess);
        renderDetailView(detailsContainer, processedData);
    }
}

/* --- Name Finder Logic --- */
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
    
    // Back Button Logic
    const backBtn = document.getElementById('back-to-list');
    if(backBtn) backBtn.onclick = () => toggleView('list');
}

function renderNameList() {
    const grid = document.getElementById('name-grid-output');
    if(!grid) return;
    
    grid.innerHTML = "";
    
    if(!state.isLoaded) {
        grid.innerHTML = '<div class="spinner"></div>';
        return;
    }

    const sourceArray = state.currentGender === "Boy" ? state.boyNames : state.girlNames;
    
    const filtered = sourceArray.filter(n => {
        let nName = n.name || n.Name;
        return nName && nName.toUpperCase().startsWith(state.currentLetter);
    });

    if(filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">
            No names found starting with "${state.currentLetter}".
        </div>`;
        return;
    }

    filtered.forEach(person => {
        const card = document.createElement('div');
        card.className = 'name-card-item';
        card.innerHTML = `
            <h3>${person.name || person.Name}</h3>
            <p>${(person.meaning || "").substring(0, 30)}...</p>
        `;
        card.onclick = () => {
            toggleView('details');
            const detailsContainer = document.getElementById('detail-card-content');
            const processedData = engine.processName(person);
            renderDetailView(detailsContainer, processedData);
        };
        grid.appendChild(card);
    });
}

/* --- Render Beautiful Details --- */
function renderDetailView(container, data) {
    if(!container) return;
    
    container.innerHTML = `
        <div style="text-align:center; margin-bottom: 25px;">
            <h2 style="font-size: 2.5rem; margin-bottom: 5px; background: var(--grad-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                ${data.name}
            </h2>
            <span class="badge">${data.gender || state.currentGender}</span>
            <p style="font-size: 1.1rem; margin-top: 15px; color: var(--text-main);">
                "${data.meaning}"
            </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; text-align: left;">
            
            <div style="background: rgba(79, 70, 229, 0.05); padding: 20px; border-radius: 16px; border: 1px solid rgba(79, 70, 229, 0.1);">
                <h4 style="color: var(--secondary); margin-bottom: 15px; display:flex; align-items:center; gap:10px;">
                    <i class="fas fa-star"></i> Vedic Astrology
                </h4>
                <div style="margin-bottom: 10px;"><strong>Rashi:</strong> ${data.rashi}</div>
                <div style="margin-bottom: 10px;"><strong>Nakshatra:</strong> ${data.nakshatra}</div>
                <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 10px;">${data.phal}</div>
            </div>

            <div style="background: rgba(249, 115, 22, 0.05); padding: 20px; border-radius: 16px; border: 1px solid rgba(249, 115, 22, 0.1);">
                <h4 style="color: var(--primary); margin-bottom: 15px; display:flex; align-items:center; gap:10px;">
                    <i class="fas fa-hashtag"></i> Numerology
                </h4>
                <div style="margin-bottom: 10px;"><strong>Destiny Number:</strong> ${data.num}</div>
                <div style="margin-bottom: 10px;"><strong>Ruling Planet:</strong> ${data.planet}</div>
                <div style="margin-bottom: 10px;"><strong>Lucky Color:</strong> <span style="color:${data.color.split(' ')[0]}">●</span> ${data.color}</div>
            </div>
        </div>
    `;
}

function toggleView(viewName) {
    const list = document.getElementById('name-list-view');
    const details = document.getElementById('name-detail-view');
    const filters = document.querySelector('.filters-container');
    
    if(viewName === 'details') {
        list.classList.add('hidden');
        filters.style.display = 'none'; // Hide filters to focus
        details.classList.remove('hidden');
        details.classList.add('animate-in');
    } else {
        details.classList.add('hidden');
        list.classList.remove('hidden');
        filters.style.display = 'block';
        list.classList.add('animate-in');
    }
}

// ======================================================
// 6. UTILITIES (Theme, Scroll, Menu)
// ======================================================
function initTheme() {
    const btn = document.getElementById("theme-toggle");
    if(!btn) return;
    
    const saved = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", saved);
    btn.innerHTML = saved === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    
    btn.onclick = () => {
        const current = document.body.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.body.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        btn.innerHTML = next === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };
}

function initLanguage() {
    const btn = document.getElementById("language-toggle");
    if(!btn) return;
    
    const updateLang = (lang) => {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        
        // Update Static Text
        document.querySelectorAll("[data-en]").forEach(el => {
            el.textContent = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
        });
        
        // Update Placeholder
        const inp = document.getElementById("hero-search-input");
        if(inp) inp.placeholder = lang === "hi" ? "उदा: आरव..." : "e.g., Aarav...";
    };

    btn.onclick = () => {
        const current = localStorage.getItem("language") === "hi" ? "en" : "hi";
        updateLang(current);
    };
    
    updateLang(localStorage.getItem("language") || "en");
}

function initMobileMenu() {
    const hamburger = document.getElementById("hamburger-menu");
    const nav = document.getElementById("main-nav");
    
    if(hamburger && nav) {
        hamburger.onclick = (e) => {
            e.stopPropagation();
            hamburger.classList.toggle("active");
            nav.classList.toggle("active");
        };
        
        document.onclick = (e) => {
            if(nav.classList.contains("active") && !nav.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove("active");
                nav.classList.remove("active");
            }
        };
    }
}

function initScrollToTop() {
    const btn = document.getElementById("scrollToTopBtn");
    if(!btn) return;
    
    window.addEventListener("scroll", () => {
        btn.classList.toggle("show", window.scrollY > 300);
    });
    
    btn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
}
// ======================================================
// 7. PRELOADER FIX (Add this at the bottom)
// ======================================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // थोड़ा फेड-आउट इफेक्ट ताकि झटका न लगे
        preloader.style.transition = 'opacity 0.5s ease';
        preloader.style.opacity = '0';
        
        // एनीमेशन पूरा होने के बाद उसे गायब कर दें
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});
