/* ======================================================
   SCRIPT.JS - COMPLETE ASTROLOGY + STABILITY
   ====================================================== */

// 1. Force Page Visibility
document.body.style.visibility = "visible";
document.body.style.opacity = "1";

// 🌟 GLOBAL HELPERS
const safeGet = (id) => document.getElementById(id);
const getLanguage = () => localStorage.getItem("language") || "en";

// --- SAFE EVENT BINDER ---
function safeListen(id, event, callback) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, callback);
}

// 🌟 2. ASTRO ENGINE (The Brain)
class AstroEngine {
    constructor() {
        this.numerologyMap = { 'A':1,'I':1,'J':1,'Q':1,'Y':1,'B':2,'K':2,'R':2,'C':3,'G':3,'L':3,'S':3,'D':4,'M':4,'T':4,'E':5,'H':5,'N':5,'X':5,'U':6,'V':6,'W':6,'O':7,'Z':7,'F':8,'P':8 };
        
        // Full Rashi Data
        this.rashiMap = [
            { rashi_en: "Aries (Mesh)", rashi_hi: "मेष (Aries)", letters: ["chu","che","cho","la","li","lu","le","lo","a"], nakshatras: ["Ashwini","Bharani","Krittika"], phal_en: "Courageous leader", phal_hi: "साहसी नेतृत्वकर्ता", rashiphal_en: "New beginnings ahead.", rashiphal_hi: "नई शुरुआत के योग हैं।" },
            { rashi_en: "Taurus (Vrishabh)", rashi_hi: "वृषभ (Taurus)", letters: ["i","ee","u","oo","e","o","va","vi","vu","ve","vo"], nakshatras: ["Krittika","Rohini"], phal_en: "Reliable & calm", phal_hi: "विश्वसनीय और शांत", rashiphal_en: "Financial gains likely.", rashiphal_hi: "धन लाभ की संभावना है।" },
            { rashi_en: "Gemini (Mithun)", rashi_hi: "मिथुन (Gemini)", letters: ["ka","ki","ku","gh","ng","ch","ke","ko","ha"], nakshatras: ["Mrigashira","Ardra"], phal_en: "Intelligent talker", phal_hi: "बुद्धिमान वक्ता", rashiphal_en: "Good news coming.", rashiphal_hi: "शुभ समाचार मिलेगा।" },
            { rashi_en: "Cancer (Kark)", rashi_hi: "कर्क (Cancer)", letters: ["hi","hu","he","ho","da","di","du","de","do"], nakshatras: ["Punarvasu","Pushya"], phal_en: "Emotional & caring", phal_hi: "भावुक और देखभाल करने वाला", rashiphal_en: "Family time best.", rashiphal_hi: "परिवार के साथ समय बिताएं।" },
            { rashi_en: "Leo (Simha)", rashi_hi: "सिंह (Leo)", letters: ["ma","mi","mu","me","mo","ta","ti","tu","te"], nakshatras: ["Magha","Purva Phalguni"], phal_en: "Confident king", phal_hi: "आत्मविश्वासी राजा", rashiphal_en: "Success in career.", rashiphal_hi: "करियर में सफलता मिलेगी।" },
            { rashi_en: "Virgo (Kanya)", rashi_hi: "कन्या (Virgo)", letters: ["to","pa","pi","pu","sha","na","th","pe","po"], nakshatras: ["Uttara Phalguni","Hasta"], phal_en: "Practical analyst", phal_hi: "व्यावहारिक विश्लेषक", rashiphal_en: "Health improves.", rashiphal_hi: "स्वास्थ्य में सुधार होगा।" },
            { rashi_en: "Libra (Tula)", rashi_hi: "तुला (Libra)", letters: ["ra","ri","ru","re","ro","ta","ti","tu","te"], nakshatras: ["Chitra","Swati"], phal_en: "Balanced diplomat", phal_hi: "संतुलित राजनयिक", rashiphal_en: "Travel planned.", rashiphal_hi: "यात्रा की योजना बनेगी।" },
            { rashi_en: "Scorpio (Vrishchik)", rashi_hi: "वृश्चिक (Scorpio)", letters: ["to","na","ni","nu","ne","no","ya","yi","yu"], nakshatras: ["Vishakha","Anuradha"], phal_en: "Intense mystery", phal_hi: "तीव्र रहस्यमयी", rashiphal_en: "Avoid arguments.", rashiphal_hi: "वाद-विवाद से बचें।" },
            { rashi_en: "Sagittarius (Dhanu)", rashi_hi: "धनु (Sagittarius)", letters: ["ye","yo","bha","bhi","bhu","dha","pha","dha","bhe"], nakshatras: ["Mula","Purva Ashadha"], phal_en: "Optimistic explorer", phal_hi: "आशावादी खोजकर्ता", rashiphal_en: "Luck favors you.", rashiphal_hi: "भाग्य आपका साथ देगा।" },
            { rashi_en: "Capricorn (Makar)", rashi_hi: "मकर (Capricorn)", letters: ["bho","ja","ji","ju","je","jo","kha","ga","gi"], nakshatras: ["Uttara Ashadha","Shravana"], phal_en: "Ambitious worker", phal_hi: "महत्वाकांक्षी कर्मी", rashiphal_en: "Hard work pays off.", rashiphal_hi: "मेहनत रंग लाएगी।" },
            { rashi_en: "Aquarius (Kumbh)", rashi_hi: "कुम्भ (Aquarius)", letters: ["gu","ge","go","sa","si","su","se","so","da"], nakshatras: ["Dhanishtha","Shatabhisha"], phal_en: "Innovative thinker", phal_hi: "नवीन विचारक", rashiphal_en: "Help a friend.", rashiphal_hi: "मित्र की मदद करेंगे।" },
            { rashi_en: "Pisces (Meen)", rashi_hi: "मीन (Pisces)", letters: ["di","du","th","jha","yna","de","do","cha","chi"], nakshatras: ["Purva Bhadrapada","Revati"], phal_en: "Dreamy soul", phal_hi: "स्वप्नशील आत्मा", rashiphal_en: "Peace of mind.", rashiphal_hi: "मानसिक शांति मिलेगी।" }
        ];

        // Full Numerology Data
        this.astroDetails = {
            1: { planet_en: "Sun", planet_hi: "सूर्य", color_en: "Golden", color_hi: "सुनहरा", lucky_nos: "1, 2, 3, 9", fal_en: "Leader", fal_hi: "नेता" },
            2: { planet_en: "Moon", planet_hi: "चन्द्र", color_en: "White", color_hi: "सफेद", lucky_nos: "2, 6, 7", fal_en: "Emotional", fal_hi: "भावुक" },
            3: { planet_en: "Jupiter", planet_hi: "बृहस्पति", color_en: "Yellow", color_hi: "पीला", lucky_nos: "1, 3, 5, 9", fal_en: "Wise", fal_hi: "ज्ञानी" },
            4: { planet_en: "Rahu", planet_hi: "राहू", color_en: "Blue", color_hi: "नीला", lucky_nos: "1, 4, 5, 6", fal_en: "Practical", fal_hi: "व्यावहारिक" },
            5: { planet_en: "Mercury", planet_hi: "बुध", color_en: "Green", color_hi: "हरा", lucky_nos: "1, 5, 6", fal_en: "Intelligent", fal_hi: "बुद्धिमान" },
            6: { planet_en: "Venus", planet_hi: "शुक्र", color_en: "Pink", color_hi: "गुलाबी", lucky_nos: "3, 6, 9", fal_en: "Charming", fal_hi: "आकर्षक" },
            7: { planet_en: "Ketu", planet_hi: "केतु", color_en: "Multi", color_hi: "चितकबरा", lucky_nos: "2, 7", fal_en: "Spiritual", fal_hi: "आध्यात्मिक" },
            8: { planet_en: "Saturn", planet_hi: "शनि", color_en: "Black", color_hi: "काला", lucky_nos: "1, 4, 8", fal_en: "Ambitious", fal_hi: "महत्वाकांक्षी" },
            9: { planet_en: "Mars", planet_hi: "मंगल", color_en: "Red", color_hi: "लाल", lucky_nos: "3, 6, 9", fal_en: "Energetic", fal_hi: "ऊर्जावान" }
        };
    }

    calculateNumerology(name) {
        if(!name) return 1;
        let total = 0, clean = name.toUpperCase().replace(/[^A-Z]/g, '');
        for(let c of clean) total += this.numerologyMap[c] || 0;
        while(total > 9) { let s=0; while(total>0){ s+=total%10; total=Math.floor(total/10); } total=s; }
        return total || 1;
    }

    calculateRashi(name) {
        if(!name) return this.rashiMap[0];
        let n = name.toLowerCase().trim();
        for(let r of this.rashiMap) { for(let l of r.letters) if(n.startsWith(l)) return r; }
        return this.rashiMap[0];
    }

    // 🔥 MAIN PROCESSING FUNCTION
    processName(data, lang) {
        let safeName = data.name || data.Name || data.NAME;
        if(!safeName) return null;

        // Meaning Check
        let safeMeaning = "";
        if (lang === 'hi') safeMeaning = data.meaning_hi || data.meaning || "अर्थ उपलब्ध नहीं";
        else safeMeaning = data.meaning_en || data.meaning || "Meaning not available";

        // Logic
        const num = this.calculateNumerology(safeName);
        const rashi = this.calculateRashi(safeName);
        const astro = this.astroDetails[num] || this.astroDetails[1];
        const isHindi = lang === 'hi';

        return {
            name: safeName,
            meaning: safeMeaning,
            gender: data.gender || "Unknown",
            origin: isHindi ? "भारतीय" : "Indian",
            
            // Astro Data
            rashi: isHindi ? rashi.rashi_hi : rashi.rashi_en,
            nakshatra: rashi.nakshatras ? rashi.nakshatras.join(", ") : "",
            phal: isHindi ? rashi.phal_hi : rashi.phal_en,
            rashiphal: isHindi ? rashi.rashiphal_hi : rashi.rashiphal_en,
            
            // Numerology Data
            num: num,
            planet: isHindi ? astro.planet_hi : astro.planet_en,
            color: isHindi ? astro.color_hi : astro.color_en,
            luckyNumbers: astro.lucky_nos,
            numFal: isHindi ? astro.fal_hi : astro.fal_en,
            
            // UI Labels
            labels: {
                meaning: isHindi ? "अर्थ" : "Meaning",
                gender: isHindi ? "लिंग" : "Gender",
                origin: isHindi ? "मूल" : "Origin",
                vedicTitle: isHindi ? "🔮 वैदिक ज्योतिष" : "🔮 Vedic Astrology",
                rashi: isHindi ? "राशि" : "Rashi",
                nakshatra: isHindi ? "नक्षत्र" : "Nakshatra",
                personality: isHindi ? "व्यक्तित्व" : "Personality",
                rashiphalTitle: isHindi ? "✨ राशिफल" : "✨ Horoscope",
                numTitle: isHindi ? "🔢 अंक ज्योतिष" : "🔢 Numerology",
                number: isHindi ? "अंक" : "Number",
                planet: isHindi ? "ग्रह" : "Planet",
                luckyColor: isHindi ? "शुभ रंग" : "Lucky Color",
                luckyNos: isHindi ? "शुभ अंक" : "Lucky Numbers",
                prediction: isHindi ? "भविष्यफल" : "Prediction"
            }
        };
    }
}

const engine = new AstroEngine();

document.addEventListener("DOMContentLoaded", () => {
    
    // --- MODULE 1: MOBILE MENU ---
    try {
        const hamburger = safeGet("hamburger-menu");
        const nav = safeGet("main-nav");
        if (hamburger && nav) {
            hamburger.onclick = (e) => {
                e.stopPropagation();
                hamburger.classList.toggle("active");
                nav.classList.toggle("active");
            };
            document.addEventListener('click', (e) => {
                if (nav.classList.contains('active') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
                    hamburger.classList.remove("active");
                    nav.classList.remove("active");
                }
            });
            document.querySelectorAll('.nav-links a').forEach(l => l.addEventListener('click', () => {
                hamburger.classList.remove("active"); nav.classList.remove("active");
            }));
        }
    } catch(e) { console.error(e); }

    // --- MODULE 2: THEME & LANG ---
    try {
        const themeBtn = safeGet("theme-toggle");
        if (themeBtn) {
            const saved = localStorage.getItem("theme") || "light";
            document.body.setAttribute("data-theme", saved);
            themeBtn.innerHTML = saved === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            themeBtn.onclick = () => {
                const next = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
                document.body.setAttribute("data-theme", next);
                localStorage.setItem("theme", next);
                themeBtn.innerHTML = next === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            };
        }

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
                localStorage.setItem("language", getLanguage() === "hi" ? "en" : "hi");
                updateLangUI();
                if (safeGet("name-finder")) initNameFinder(); 
            };
        }
        updateLangUI();
    } catch(e) { console.error(e); }

    // --- MODULE 3: AURA CARDS ---
    try {
        const pricingGrid = document.querySelector('.pricing-grid');
        if (pricingGrid) {
            pricingGrid.addEventListener('click', (e) => {
                const header = e.target.closest('.pricing-card-header');
                if (header) header.closest('.pricing-card').classList.toggle('expanded');
            });
        }
    } catch(e) {}

    // --- MODULE 4: TYPING EFFECT ---
    const typeEl = safeGet("naamin-main-title-typing");
    if(typeEl) {
        const txt="Naamin"; let i=0, d=false;
        const type = () => {
            let t = txt.substring(0, i);
            let p1 = t.length > 4 ? "Naam" : t;
            let p2 = t.length > 4 ? t.substring(4) : "";
            typeEl.innerHTML = `<span class="header-naam">${p1}</span><span class="header-in">${p2}</span>`;
            if(!d && i<txt.length) { i++; setTimeout(type, 200); }
            else if(d && i>0) { i--; setTimeout(type, 100); }
            else { d=!d; setTimeout(type, d?2000:500); }
        };
        type();
    }

    // --- MODULE 5: NAME FINDER INIT ---
    if(safeGet("name-finder")) initNameFinder();

    // --- SCROLL BUTTON ---
    safeListen("scrollToTopBtn", "click", () => window.scrollTo({top:0, behavior:"smooth"}));
    window.addEventListener("scroll", () => {
        const btn = safeGet("scrollToTopBtn");
        if(btn) btn.classList.toggle("show", window.scrollY > 300);
    });
});

// ---------------------------------------------------------
//  NAME FINDER LOGIC (With Smart File Detection)
// ---------------------------------------------------------
let currentGender = "Boy";
let currentLetter = "A";

async function initNameFinder() {
    // 1. Gender Buttons
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGender = btn.dataset.gender;
            loadNames();
        };
    });

    // 2. Alphabet
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

    // 3. Search & Back
    safeListen("hero-search-btn", "click", handleSearch);
    const sInp = safeGet("hero-search-input");
    if(sInp) sInp.onkeypress = (e) => { if(e.key==="Enter") handleSearch(); };

    const backBtn = document.querySelector('.back-btn');
    if(backBtn) backBtn.onclick = () => {
        document.querySelector('.name-details-container').style.display = 'none';
        document.querySelector('.name-list-container').style.display = 'block';
    };

    loadNames();
}

// --- UTILS: TRY MULTIPLE FILES ---
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

// --- CORE LOADER ---
async function loadNames() {
    const listContainer = document.querySelector('.name-list');
    if(!listContainer) return;

    listContainer.innerHTML = '<div class="spinner">Loading...</div>';
    const lang = getLanguage();
    
    // 🔥 AUTO-DETECT FILES (Tries New first, then Old)
    const files = (currentGender === "Boy") 
        ? (lang === 'hi' ? ['boy_names_hin.json', 'bnames.json'] : ['boy_names_eng.json', 'bnames.json'])
        : (lang === 'hi' ? ['girl_names_hin.json', 'gnames.json'] : ['girl_names_eng.json', 'gnames.json']);

    try {
        let data = await fetchAny(files);
        if(!Array.isArray(data)) data = data.names || Object.values(data).find(Array.isArray) || [];
        
        const displayGender = (lang === 'hi') ? ((currentGender === "Boy") ? "लड़का" : "लड़की") : currentGender;
        const names = data.map(i => ({ ...i, gender: displayGender }));
        const filtered = names.filter(n => (n.name || n.Name || n.NAME).toUpperCase().startsWith(currentLetter));

        listContainer.innerHTML = "";
        document.querySelector('.name-list-container').style.display = 'block';
        document.querySelector('.name-details-container').style.display = 'none';

        if(filtered.length === 0) {
            listContainer.innerHTML = `<p style="text-align:center; width:100%">No names found.</p>`;
            return;
        }

        filtered.forEach(p => {
            const div = document.createElement("div");
            div.className = "name-item";
            div.textContent = p.name || p.Name || p.NAME;
            div.onclick = () => {
                // 🔥 PASS THROUGH ENGINE
                const processed = engine.processName(p, getLanguage());
                showNameDetails(processed);
            };
            listContainer.appendChild(div);
        });

    } catch (e) {
        console.error(e);
        listContainer.innerHTML = `<p style="color:red; text-align:center">Error loading data.</p>`;
    }
}

// --- SEARCH ---
async function handleSearch() {
    const inp = safeGet("hero-search-input");
    if(!inp || !inp.value.trim()) return;
    const term = inp.value.trim().toLowerCase();

    const box = document.querySelector('.name-details');
    window.scrollTo({ top: document.getElementById('name-finder').offsetTop - 100, behavior: 'smooth' });
    document.querySelector('.name-list-container').style.display = 'none';
    document.querySelector('.name-details-container').style.display = 'block';
    box.innerHTML = '<div class="spinner">Searching...</div>';

    const lang = getLanguage();
    try {
        const [b, g] = await Promise.all([
            fetchAny(lang === 'hi' ? ['boy_names_hin.json', 'bnames.json'] : ['boy_names_eng.json', 'bnames.json']),
            fetchAny(lang === 'hi' ? ['girl_names_hin.json', 'gnames.json'] : ['girl_names_eng.json', 'gnames.json'])
        ]);
        
        const bArr = Array.isArray(b) ? b : (b.names || []);
        const gArr = Array.isArray(g) ? g : (g.names || []);
        const isHi = lang === 'hi';
        const all = [...bArr.map(i=>({...i, gender: isHi?'लड़का':'Boy'})), ...gArr.map(i=>({...i, gender: isHi?'लड़की':'Girl'}))];

        const found = all.find(n => (n.name || n.Name || n.NAME).toLowerCase() === term);

        if(found) {
            const processed = engine.processName(found, lang);
            showNameDetails(processed);
        } else {
            const msg = isHi ? "नाम नहीं मिला" : "Name Not Found";
            box.innerHTML = `<div style="text-align:center; padding:30px;"><h3>${msg}</h3></div>`;
        }
    } catch(e) { box.innerHTML = "<p>Search failed.</p>"; }
}

// --- DISPLAY FUNCTION (Restored Full Details) ---
function showNameDetails(data) {
    const box = document.querySelector('.name-details');
    document.querySelector('.name-list-container').style.display = 'none';
    document.querySelector('.name-details-container').style.display = 'block';
    
    if(!data) return;
    const L = data.labels;

    box.innerHTML = `
        <h2>${data.name}</h2>
        <div class="detail-grid" style="text-align: left; margin-top: 20px;">
            <p><strong>${L.meaning}:</strong> ${data.meaning}</p>
            <p><strong>${L.gender}:</strong> ${data.gender}</p>
            <p><strong>${L.origin}:</strong> ${data.origin}</p>
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
            
            <h3>${L.vedicTitle}</h3>
            <p><strong>${L.rashi}:</strong> ${data.rashi}</p>
            <p><strong>${L.nakshatra}:</strong> ${data.nakshatra}</p>
            <p><strong>${L.personality}:</strong> ${data.phal}</p>
            <div style="margin-top:10px; background: rgba(0,0,0,0.05); padding:10px; border-radius:8px;">
                <strong>${L.rashiphalTitle}:</strong><br> ${data.rashiphal}
            </div>
            
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
            
            <h3>${L.numTitle}</h3>
            <p><strong>${L.number}:</strong> ${data.num}</p>
            <p><strong>${L.planet}:</strong> ${data.planet}</p>
            <p><strong>${L.luckyColor}:</strong> ${data.color}</p>
            <p><strong>${L.luckyNos}:</strong> ${data.luckyNumbers}</p>
            <div style="margin-top:10px;">
                <strong>${L.prediction}:</strong> ${data.numFal}
            </div>
        </div>
    `;
}
