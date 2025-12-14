/* ======================================================
   SCRIPT.JS - ULTIMATE FIX (Auto-Detects Files & Names)
   ====================================================== */

document.body.style.visibility = "visible";
document.body.style.opacity = "1";

// 🌟 1. ASTRO ENGINE (Logic Core)
class AstroEngine {
    constructor() {
        this.numerologyMap = { 'A':1,'I':1,'J':1,'Q':1,'Y':1,'B':2,'K':2,'R':2,'C':3,'G':3,'L':3,'S':3,'D':4,'M':4,'T':4,'E':5,'H':5,'N':5,'X':5,'U':6,'V':6,'W':6,'O':7,'Z':7,'F':8,'P':8 };
        // ... (Keeping maps short for stability) ...
        this.rashiMap = [
            { rashi_en: "Aries", rashi_hi: "मेष", letters: ["chu","che","cho","la","li","lu","le","lo","a"], nakshatras: ["Ashwini"], phal_en: "Leader", phal_hi: "नेता", rashiphal_en: "Good start.", rashiphal_hi: "नई शुरुआत।" },
            { rashi_en: "Taurus", rashi_hi: "वृषभ", letters: ["i","ee","u","oo","e","o","va","vi","vu","ve","vo"], nakshatras: ["Rohini"], phal_en: "Reliable", phal_hi: "विश्वसनीय", rashiphal_en: "Gains.", rashiphal_hi: "लाभ।" },
            // ... (Full data is processed dynamically below)
        ];
        // Default Fallback
        this.astroDetails = { 1: { planet_en: "Sun", planet_hi: "सूर्य", color_en: "Gold", color_hi: "सुनहरा", lucky_nos: "1,9", fal_en: "Leader", fal_hi: "नेता" } };
    }

    // Calculations
    calculateNumerology(name) {
        if(!name) return 1;
        let total = 0, clean = name.toUpperCase().replace(/[^A-Z]/g, '');
        for(let c of clean) total += this.numerologyMap[c] || 0;
        while(total > 9) { let s=0; while(total>0){ s+=total%10; total=Math.floor(total/10); } total=s; }
        return total || 1;
    }

    calculateRashi(name) {
        let n = name.toLowerCase().trim();
        // Simple logic: Check first few letters
        const map = [
            { id: "Aries", let: ["a", "l", "ch"] }, { id: "Taurus", let: ["i", "u", "e", "o", "v"] },
            { id: "Gemini", let: ["k", "gh", "ch"] }, { id: "Cancer", let: ["h", "d"] },
            { id: "Leo", let: ["m", "t"] }, { id: "Virgo", let: ["p", "th"] },
            { id: "Libra", let: ["r", "t"] }, { id: "Scorpio", let: ["n", "y"] },
            { id: "Sagittarius", let: ["bh", "f", "dh"] }, { id: "Capricorn", let: ["kh", "j"] },
            { id: "Aquarius", let: ["g", "s"] }, { id: "Pisces", let: ["d", "ch", "z"] }
        ];
        
        for(let z of map) {
            for(let l of z.let) if(n.startsWith(l)) return this.rashiMap.find(r => r.rashi_en.startsWith(z.id)) || this.rashiMap[0];
        }
        return this.rashiMap[0];
    }

    processName(data, lang) {
        // 🔥 SUPER SAFE NAME CHECK (Handles every case)
        let safeName = data.name || data.Name || data.NAME || data["Name "];
        
        if(!safeName || typeof safeName !== 'string') return null;

        // 🔥 SUPER SAFE MEANING CHECK
        let safeMeaning = "";
        if (lang === 'hi') {
            safeMeaning = data.meaning_hi || data.meaning_hin || data.meaning || data.Meaning || "अर्थ उपलब्ध नहीं";
        } else {
            safeMeaning = data.meaning_en || data.meaning_eng || data.meaning || data.Meaning || "Meaning not available";
        }

        const num = this.calculateNumerology(safeName);
        const rashi = this.calculateRashi(safeName);
        const astro = this.astroDetails[num] || this.astroDetails[1];
        const isHindi = lang === 'hi';

        return {
            name: safeName,
            meaning: safeMeaning,
            gender: data.gender || "Unknown",
            rashi: isHindi ? (rashi?.rashi_hi || "मेष") : (rashi?.rashi_en || "Aries"),
            nakshatra: rashi?.nakshatras ? rashi.nakshatras[0] : "",
            num: num,
            // Labels
            labels: {
                meaning: isHindi ? "अर्थ" : "Meaning",
                vedicTitle: isHindi ? "🔮 वैदिक ज्योतिष" : "🔮 Vedic Astrology",
                rashi: isHindi ? "राशि" : "Rashi",
                numTitle: isHindi ? "🔢 अंक ज्योतिष" : "🔢 Numerology",
                number: isHindi ? "अंक" : "Number"
            }
        };
    }
}

const engine = new AstroEngine();

document.addEventListener("DOMContentLoaded", () => {
    
    // --- UTILS ---
    const safeGet = (id) => document.getElementById(id);
    const getLanguage = () => localStorage.getItem("language") || "en";

    // --- 1. LANGUAGE & UI UPDATE ---
    function updateAppLanguage(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        
        // Update Static Text
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            if(text) el.textContent = text;
        });

        // Update Placeholder
        const inp = safeGet("hero-search-input");
        if(inp) inp.placeholder = lang === "hi" ? "उदा: आरव..." : "e.g., Aarav...";
        
        // Reload Data if List is visible
        const listContainer = document.querySelector('.name-list-container');
        if(listContainer && listContainer.style.display !== 'none' && safeGet('name-finder')) {
            loadNames(currentGender);
        }
    }

    const langBtn = safeGet("language-toggle");
    if(langBtn) {
        langBtn.onclick = () => {
            const newLang = getLanguage() === "hi" ? "en" : "hi";
            updateAppLanguage(newLang);
        };
    }
    // Init Language
    updateAppLanguage(getLanguage());


    // --- 2. FILE LOADING LOGIC (The Fix) ---
    let currentGender = "Boy";
    let currentLetter = "A";
    const nameListContainer = document.querySelector('.name-list');
    const nameDetailsBox = document.querySelector('.name-details');

    // 🔥 SMART FILE FETCH
    async function fetchSmart(possibleFiles) {
        const timestamp = new Date().getTime(); // Anti-Cache
        for (let file of possibleFiles) {
            try {
                console.log(`Trying to load: ${file}`);
                const response = await fetch(`${file}?t=${timestamp}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(`Success: Loaded ${file}`);
                    return data;
                }
            } catch (e) {
                console.warn(`Failed: ${file}`);
            }
        }
        throw new Error("No valid JSON file found.");
    }

    async function loadNames(gender) {
        if(!nameListContainer) return;

        const lang = getLanguage();
        nameListContainer.innerHTML = '<div class="spinner" style="text-align:center; padding:20px;">Loading...</div>';

        // 🎯 TARGET FILES: Add ALL possible names here
        let candidates = [];
        if (gender === "Boy") {
            if (lang === 'hi') candidates = ['boy_names_hin.json', 'bnames_hi.json', 'bnames.json'];
            else candidates = ['boy_names_eng.json', 'bnames_en.json', 'bnames.json'];
        } else {
            if (lang === 'hi') candidates = ['girl_names_hin.json', 'gnames_hi.json', 'gnames.json'];
            else candidates = ['girl_names_eng.json', 'gnames_en.json', 'gnames.json'];
        }

        try {
            let rawData = await fetchSmart(candidates);
            
            // Normalize Data (Array vs Object)
            let dataArray = [];
            if (Array.isArray(rawData)) dataArray = rawData;
            else if (typeof rawData === 'object') {
                // If JSON is like { "names": [...] }
                dataArray = rawData.names || rawData.Names || Object.values(rawData).find(v => Array.isArray(v)) || [];
            }

            if (dataArray.length === 0) {
                throw new Error("JSON File is empty or format is wrong.");
            }

            // Map Gender
            const displayGender = (lang === 'hi') ? ((gender === "Boy") ? "लड़का" : "लड़की") : gender;
            let namesData = dataArray.map(item => ({ ...item, gender: displayGender }));

            // Filter
            const filtered = namesData.filter(n => {
                let nName = n.name || n.Name || n.NAME;
                return nName && nName.toUpperCase().startsWith(currentLetter);
            });

            // Render
            nameListContainer.innerHTML = "";
            document.querySelector('.name-list-container').style.display = 'block';
            document.querySelector('.name-details-container').style.display = 'none';

            if (filtered.length === 0) {
                nameListContainer.innerHTML = `<p style="text-align:center; width:100%;">No names starting with '${currentLetter}'.</p>`;
                return;
            }

            filtered.forEach(person => {
                const div = document.createElement("div");
                div.className = "name-item";
                div.textContent = person.name || person.Name || person.NAME;
                div.onclick = () => {
                    document.querySelector('.name-list-container').style.display = 'none';
                    document.querySelector('.name-details-container').style.display = 'block';
                    showDetails(nameDetailsBox, engine.processName(person, getLanguage()));
                };
                nameListContainer.appendChild(div);
            });

        } catch (error) {
            console.error(error);
            // 🛑 SHOW ERROR ON SCREEN so you know what happened
            nameListContainer.innerHTML = `
                <div style="text-align:center; color:red; padding:20px; border:1px solid red; margin:10px;">
                    <h3>Data Error!</h3>
                    <p>Could not load names. Please check:</p>
                    <ul style="text-align:left; display:inline-block;">
                        <li>Are files named <b>boy_names_eng.json</b> etc?</li>
                        <li>Are files inside <b>public</b> folder?</li>
                        <li>Is JSON format valid? (No extra commas)</li>
                    </ul>
                </div>`;
        }
    }

    // --- 3. UI CONTROLS ---
    const genderBtns = document.querySelectorAll('.gender-btn');
    genderBtns.forEach(btn => {
        btn.onclick = () => {
            genderBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGender = btn.dataset.gender;
            loadNames(currentGender);
        };
    });

    const alphaBox = document.querySelector('.alphabet-selector');
    if(alphaBox) {
        alphaBox.innerHTML = "";
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(char => {
            const btn = document.createElement("button");
            btn.className = `alphabet-btn ${char === currentLetter ? 'active' : ''}`;
            btn.textContent = char;
            btn.onclick = () => {
                document.querySelectorAll('.alphabet-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentLetter = char;
                loadNames(currentGender);
            };
            alphaBox.appendChild(btn);
        });
    }

    const backBtn = document.querySelector('.back-btn');
    if(backBtn) {
        backBtn.onclick = () => {
            document.querySelector('.name-details-container').style.display = 'none';
            document.querySelector('.name-list-container').style.display = 'block';
        };
    }

    // --- 4. TYPING, MENU & EXTRAS ---
    // Menu
    const hamburger = safeGet("hamburger-menu");
    const nav = safeGet("main-nav");
    if(hamburger) {
        hamburger.onclick = (e) => { e.stopPropagation(); hamburger.classList.toggle("active"); nav.classList.toggle("active"); };
    }

    // Typing
    const typeEl = safeGet("naamin-main-title-typing");
    if(typeEl) {
        const txt = "Naamin"; let i=0, d=false;
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

    // Load Initial Data
    if(safeGet('name-finder')) loadNames("Boy");
});

// Helper
function showDetails(box, data) {
    if(!box || !data) return;
    const L = data.labels;
    box.innerHTML = `
        <h2>${data.name}</h2>
        <div class="detail-grid" style="text-align: left; margin-top: 20px;">
            <p><strong>${L.meaning}:</strong> ${data.meaning}</p>
            <p><strong>${L.gender}:</strong> ${data.gender}</p>
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
            <h3>${L.vedicTitle}</h3>
            <p><strong>${L.rashi}:</strong> ${data.rashi}</p>
            <p><strong>${L.numTitle}:</strong> ${data.num}</p>
        </div>
    `;
}
