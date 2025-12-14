/* ======================================================
   SCRIPT.JS - BULLETPROOF MODULAR VERSION
   ====================================================== */

// 1. Force Page Visibility immediately
document.body.style.visibility = "visible";
document.body.style.opacity = "1";

// 🌟 GLOBAL HELPERS
const safeGet = (id) => document.getElementById(id);
const getLanguage = () => localStorage.getItem("language") || "en";

// --- SAFE EVENT BINDER (The Magic Fix) ---
// यह फंक्शन चेक करता है कि बटन मौजूद है या नहीं। अगर नहीं है, तो कोड क्रैश नहीं होगा।
function safeListen(id, event, callback) {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener(event, callback);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Website Loaded. Initializing modules...");

    // ==========================================
    // MODULE 1: MOBILE MENU (Priority High)
    // ==========================================
    try {
        const hamburger = safeGet("hamburger-menu");
        const nav = safeGet("main-nav");
        
        if (hamburger && nav) {
            hamburger.onclick = (e) => {
                e.stopPropagation();
                hamburger.classList.toggle("active");
                nav.classList.toggle("active");
            };
            
            // Close menu when clicking links
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove("active");
                    nav.classList.remove("active");
                });
            });

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (nav.classList.contains('active') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
                    hamburger.classList.remove("active");
                    nav.classList.remove("active");
                }
            });
        }
    } catch (e) { console.error("Menu Error:", e); }

    // ==========================================
    // MODULE 2: THEME TOGGLE
    // ==========================================
    try {
        const themeBtn = safeGet("theme-toggle");
        if (themeBtn) {
            const saved = localStorage.getItem("theme") || "light";
            document.body.setAttribute("data-theme", saved);
            themeBtn.innerHTML = saved === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

            themeBtn.onclick = () => {
                const current = document.body.getAttribute("data-theme");
                const next = current === "dark" ? "light" : "dark";
                document.body.setAttribute("data-theme", next);
                localStorage.setItem("theme", next);
                themeBtn.innerHTML = next === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            };
        }
    } catch (e) { console.error("Theme Error:", e); }

    // ==========================================
    // MODULE 3: LANGUAGE TOGGLE
    // ==========================================
    try {
        const updateLangUI = () => {
            const lang = getLanguage();
            document.documentElement.lang = lang;
            document.querySelectorAll("[data-en]").forEach(el => {
                const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
                if (text) el.textContent = text;
            });
            const inp = safeGet("hero-search-input");
            if(inp) inp.placeholder = lang === "hi" ? "उदा: आरव..." : "e.g., Aarav...";
        };

        const langBtn = safeGet("language-toggle");
        if (langBtn) {
            langBtn.onclick = () => {
                const next = getLanguage() === "hi" ? "en" : "hi";
                localStorage.setItem("language", next);
                updateLangUI();
                // Reload names if on search page
                if (safeGet("name-finder")) initNameFinder(); 
            };
        }
        updateLangUI(); // Run on load
    } catch (e) { console.error("Lang Error:", e); }

    // ==========================================
    // MODULE 4: AURA / PRICING CARDS (Accordion)
    // ==========================================
    try {
        const pricingGrid = document.querySelector('.pricing-grid');
        if (pricingGrid) {
            pricingGrid.addEventListener('click', (e) => {
                // Event Delegation to ensure clicks work even if HTML changes
                const header = e.target.closest('.pricing-card-header');
                if (header) {
                    const card = header.closest('.pricing-card');
                    if (card) {
                        card.classList.toggle('expanded');
                    }
                }
            });
        }
    } catch (e) { console.error("Aura Error:", e); }

    // ==========================================
    // MODULE 5: TYPING EFFECT
    // ==========================================
    try {
        const typeEl = safeGet("naamin-main-title-typing");
        if (typeEl) {
            const txt = "Naamin"; let i = 0, d = false;
            const type = () => {
                let t = txt.substring(0, i);
                let p1 = t.length > 4 ? "Naam" : t;
                let p2 = t.length > 4 ? t.substring(4) : "";
                typeEl.innerHTML = `<span class="header-naam">${p1}</span><span class="header-in">${p2}</span>`;
                if (!d && i < txt.length) { i++; setTimeout(type, 200); }
                else if (d && i > 0) { i--; setTimeout(type, 100); }
                else { d = !d; setTimeout(type, d ? 2000 : 500); }
            };
            type();
        }
    } catch (e) { /* Silent fail is ok here */ }

    // ==========================================
    // MODULE 6: NAME FINDER (Complex Logic)
    // ==========================================
    if (safeGet("name-finder")) {
        initNameFinder();
    }

    // ==========================================
    // MODULE 7: SCROLL TO TOP
    // ==========================================
    safeListen("scrollToTopBtn", "click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener("scroll", () => {
        const btn = safeGet("scrollToTopBtn");
        if (btn) btn.classList.toggle("show", window.scrollY > 300);
    });

}); // END DOMContentLoaded


// ---------------------------------------------------------
// SEPARATE FUNCTION FOR NAME LOGIC (Keeps things clean)
// ---------------------------------------------------------
let currentGender = "Boy";
let currentLetter = "A";

async function initNameFinder() {
    const listContainer = document.querySelector('.name-list');
    if (!listContainer) return;

    console.log("Initializing Name Finder...");

    // 1. Setup Gender Buttons
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGender = btn.dataset.gender;
            loadNames();
        };
    });

    // 2. Setup Alphabet
    const alphaBox = document.querySelector('.alphabet-selector');
    if (alphaBox) {
        alphaBox.innerHTML = "";
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(char => {
            const btn = document.createElement("button");
            btn.className = `alphabet-btn ${char === currentLetter ? 'active' : ''}`;
            btn.textContent = char;
            btn.onclick = () => {
                document.querySelectorAll('.alphabet-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentLetter = char;
                loadNames();
            };
            alphaBox.appendChild(btn);
        });
    }

    // 3. Search Handler
    safeListen("hero-search-btn", "click", handleSearch);
    const searchInp = safeGet("hero-search-input");
    if(searchInp) {
        searchInp.onkeypress = (e) => { if(e.key === "Enter") handleSearch(); };
    }

    // 4. Back Button
    safeListen(document.querySelector('.back-btn')?.id, "click", () => {
        document.querySelector('.name-details-container').style.display = 'none';
        document.querySelector('.name-list-container').style.display = 'block';
    });
    // Manual back button binding if ID missing
    const backBtn = document.querySelector('.back-btn');
    if(backBtn) backBtn.onclick = () => {
        document.querySelector('.name-details-container').style.display = 'none';
        document.querySelector('.name-list-container').style.display = 'block';
    };

    // Load Initial
    loadNames();
}

// --- CORE LOADER ---
async function loadNames() {
    const listContainer = document.querySelector('.name-list');
    if(!listContainer) return;

    listContainer.innerHTML = '<div class="spinner">Loading...</div>';
    
    const lang = getLanguage();
    // Auto-detect file logic
    const files = (currentGender === "Boy") 
        ? (lang === 'hi' ? ['boy_names_hin.json', 'bnames.json'] : ['boy_names_eng.json', 'bnames.json'])
        : (lang === 'hi' ? ['girl_names_hin.json', 'gnames.json'] : ['girl_names_eng.json', 'gnames.json']);

    try {
        let data = await fetchAny(files);
        // Normalize
        if(!Array.isArray(data)) data = data.names || Object.values(data).find(Array.isArray) || [];
        
        const displayGender = (lang === 'hi') ? ((currentGender === "Boy") ? "लड़का" : "लड़की") : currentGender;
        const names = data.map(i => ({ ...i, gender: displayGender }));

        // Filter
        const filtered = names.filter(n => (n.name || n.Name || n.NAME).toUpperCase().startsWith(currentLetter));

        // Render
        listContainer.innerHTML = "";
        document.querySelector('.name-list-container').style.display = 'block';
        document.querySelector('.name-details-container').style.display = 'none';

        if(filtered.length === 0) {
            listContainer.innerHTML = `<p style="text-align:center; width:100%">No names found for ${currentLetter}</p>`;
            return;
        }

        filtered.forEach(p => {
            const div = document.createElement("div");
            div.className = "name-item";
            div.textContent = p.name || p.Name || p.NAME;
            div.onclick = () => showNameDetails(p);
            listContainer.appendChild(div);
        });

    } catch (e) {
        console.error(e);
        listContainer.innerHTML = `<p style="color:red; text-align:center">Error loading names.<br>Check console.</p>`;
    }
}

// --- SEARCH HANDLER ---
async function handleSearch() {
    const inp = safeGet("hero-search-input");
    if(!inp || !inp.value.trim()) return;
    const term = inp.value.trim().toLowerCase();

    const box = document.querySelector('.name-details');
    // Scroll & Show
    window.scrollTo({ top: document.getElementById('name-finder').offsetTop - 100, behavior: 'smooth' });
    document.querySelector('.name-list-container').style.display = 'none';
    document.querySelector('.name-details-container').style.display = 'block';
    box.innerHTML = '<div class="spinner">Searching...</div>';

    const lang = getLanguage();
    try {
        // Load all files to search everywhere
        const [b, g] = await Promise.all([
            fetchAny(lang === 'hi' ? ['boy_names_hin.json', 'bnames.json'] : ['boy_names_eng.json', 'bnames.json']),
            fetchAny(lang === 'hi' ? ['girl_names_hin.json', 'gnames.json'] : ['girl_names_eng.json', 'gnames.json'])
        ]);
        
        // Normalize arrays
        const bArr = Array.isArray(b) ? b : (b.names || []);
        const gArr = Array.isArray(g) ? g : (g.names || []);

        const isHi = lang === 'hi';
        const all = [
            ...bArr.map(i=>({...i, gender: isHi?'लड़का':'Boy'})), 
            ...gArr.map(i=>({...i, gender: isHi?'लड़की':'Girl'}))
        ];

        const found = all.find(n => (n.name || n.Name || n.NAME).toLowerCase() === term);

        if(found) showNameDetails(found);
        else {
            const msg = isHi ? "नाम नहीं मिला" : "Name Not Found";
            box.innerHTML = `<div style="text-align:center; padding:30px;"><h3>${msg}</h3></div>`;
        }

    } catch(e) { box.innerHTML = "<p>Search failed.</p>"; }
}

// --- UTILS ---
async function fetchAny(files) {
    const ts = new Date().getTime();
    for (const f of files) {
        try {
            const r = await fetch(`${f}?t=${ts}`);
            if(r.ok) return await r.json();
        } catch(e){}
    }
    throw new Error("Files missing");
}

function showNameDetails(data) {
    const box = document.querySelector('.name-details');
    document.querySelector('.name-list-container').style.display = 'none';
    document.querySelector('.name-details-container').style.display = 'block';
    
    const lang = getLanguage();
    const isHi = lang === 'hi';
    
    // Process Data
    const name = data.name || data.Name || data.NAME;
    const meaning = isHi ? (data.meaning_hi || data.meaning) : (data.meaning_en || data.meaning);
    
    // Astro Logic (Simplified for stability)
    const numMap = { 'A':1,'B':2,'C':3,'D':4,'E':5,'F':8,'G':3,'H':5,'I':1,'J':1,'K':2,'L':3,'M':4,'N':5,'O':7,'P':8,'Q':1,'R':2,'S':3,'T':4,'U':6,'V':6,'W':6,'X':5,'Y':1,'Z':7 };
    let num = 0; 
    (name||"").toUpperCase().replace(/[^A-Z]/g,'').split('').forEach(c => num += (numMap[c]||0));
    while(num>9) num = Math.floor(num/10) + (num%10);
    if(num===0) num=1;

    const rashiList = ["Mesh (Aries)","Vrishabh (Taurus)","Mithun (Gemini)","Kark (Cancer)","Simha (Leo)","Kanya (Virgo)","Tula (Libra)","Vrishchik (Scorpio)","Dhanu (Sagittarius)","Makar (Capricorn)","Kumbh (Aquarius)","Meen (Pisces)"];
    const rashi = rashiList[name.charCodeAt(0) % 12];

    box.innerHTML = `
        <h2>${name}</h2>
        <div class="detail-grid" style="text-align: left; margin-top: 20px;">
            <p><strong>${isHi?"अर्थ":"Meaning"}:</strong> ${meaning || "N/A"}</p>
            <p><strong>${isHi?"लिंग":"Gender"}:</strong> ${data.gender}</p>
            <hr style="margin: 15px 0; border-top: 1px solid #ddd;">
            <h3>${isHi?"🔮 ज्योतिष विवरण":"🔮 Astro Details"}</h3>
            <p><strong>${isHi?"राशि":"Rashi"}:</strong> ${rashi}</p>
            <p><strong>${isHi?"अंक":"Numerology"}:</strong> ${num}</p>
            <div style="margin-top:15px; padding:15px; background:rgba(249, 115, 22, 0.1); border-radius:10px;">
                <strong>${isHi?"💡 सुझाव":"💡 Tip"}:</strong><br>
                ${isHi ? "यह नाम बहुत प्रभावशाली और सकारात्मक ऊर्जा वाला है।" : "This name carries powerful and positive energy."}
            </div>
        </div>
    `;
}
