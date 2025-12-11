/* ======================================================
   MAIN.JS - ALL FIXES (Search, Scroll, Theme, Details)
   ====================================================== */

// --- 1. Force Page Visibility (Safety) ---
document.body.style.visibility = "visible";
document.body.style.opacity = "1";

const GEMINI_API_KEY = ""; // Optional: Agar API use karni ho

// ======================================================
// 🌟 ASTRO ENGINE CLASS (Logic for Calculation)
// ======================================================
class AstroEngine {
    constructor() {
        this.numerologyMap = { 'A':1,'I':1,'J':1,'Q':1,'Y':1,'B':2,'K':2,'R':2,'C':3,'G':3,'L':3,'S':3,'D':4,'M':4,'T':4,'E':5,'H':5,'N':5,'X':5,'U':6,'V':6,'W':6,'O':7,'Z':7,'F':8,'P':8 };
        
        this.rashiMap = [
            { rashi: "मेष (Aries)", letters: ["chu","che","cho","la","li","lu","le","lo","a"], nakshatras: ["Ashwini","Bharani","Krittika"], phal: "साहसी, ऊर्जावान" },
            { rashi: "वृषभ (Taurus)", letters: ["i","ee","u","oo","e","o","va","vi","vu","ve","vo"], nakshatras: ["Krittika","Rohini","Mrigashira"], phal: "शांत, विश्वसनीय" },
            { rashi: "मिथुन (Gemini)", letters: ["ka","ki","ku","gh","ng","ch","ke","ko","ha"], nakshatras: ["Mrigashira","Ardra","Punarvasu"], phal: "बुद्धिमान, वाचाल" },
            { rashi: "कर्क (Cancer)", letters: ["hi","hu","he","ho","da","di","du","de","do"], nakshatras: ["Punarvasu","Pushya","Ashlesha"], phal: "भावुक, संवेदनशील" },
            { rashi: "सिंह (Leo)", letters: ["ma","mi","mu","me","mo","ta","ti","tu","te"], nakshatras: ["Magha","Purva Phalguni","Uttara Phalguni"], phal: "आत्मविश्वासी, उदार" },
            { rashi: "कन्या (Virgo)", letters: ["to","pa","pi","pu","sha","na","th","pe","po"], nakshatras: ["Uttara Phalguni","Hasta","Chitra"], phal: "व्यावहारिक, मेहनती" },
            { rashi: "तुला (Libra)", letters: ["ra","ri","ru","re","ro","ta","ti","tu","te"], nakshatras: ["Chitra","Swati","Vishakha"], phal: "न्यायप्रिय, संतुलित" },
            { rashi: "वृश्चिक (Scorpio)", letters: ["to","na","ni","nu","ne","no","ya","yi","yu"], nakshatras: ["Vishakha","Anuradha","Jyeshtha"], phal: "तीव्र, रहस्यमयी" },
            { rashi: "धनु (Sagittarius)", letters: ["ye","yo","bha","bhi","bhu","dha","pha","dha","bhe"], nakshatras: ["Mula","Purva Ashadha","Uttara Ashadha"], phal: "आशावादी, दार्शनिक" },
            { rashi: "मकर (Capricorn)", letters: ["bho","ja","ji","ju","je","jo","kha","ga","gi"], nakshatras: ["Uttara Ashadha","Shravana","Dhanishtha"], phal: "महत्वाकांक्षी, धैर्यवान" },
            { rashi: "कुम्भ (Aquarius)", letters: ["gu","ge","go","sa","si","su","se","so","da"], nakshatras: ["Dhanishtha","Shatabhisha","Purva Bhadrapada"], phal: "नवीन सोच वाला" },
            { rashi: "मीन (Pisces)", letters: ["di","du","th","jha","yna","de","do","cha","chi"], nakshatras: ["Purva Bhadrapada","Uttara Bhadrapada","Revati"], phal: "दयालु, आध्यात्मिक" }
        ];

        this.astroDetails = {
            1: { planet: "Sun", color: "Golden" }, 2: { planet: "Moon", color: "White" }, 3: { planet: "Jupiter", color: "Yellow" },
            4: { planet: "Rahu", color: "Blue" }, 5: { planet: "Mercury", color: "Green" }, 6: { planet: "Venus", color: "Pink" },
            7: { planet: "Ketu", color: "Multi" }, 8: { planet: "Saturn", color: "Black" }, 9: { planet: "Mars", color: "Red" }
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
        for(let r of this.rashiMap) {
            for(let l of r.letters) if(n.startsWith(l)) return r;
        }
        return this.rashiMap[0];
    }

    processName(data) {
        // --- FIX FOR UNDEFINED ---
        // Check both 'name' (lowercase) and 'Name' (uppercase)
        let safeName = data.name || data.Name;
        
        if(!safeName) return null; // Safety Check

        const num = this.calculateNumerology(safeName);
        const rashi = this.calculateRashi(safeName);
        const astro = this.astroDetails[num] || this.astroDetails[1];

        return {
            ...data,
            name: safeName, // Standardize to 'name'
            meaning: data.meaning || data.Meaning || "Meaning available in full report.",
            rashi: rashi.rashi,
            nakshatra: rashi.nakshatras.join(", "),
            phal: rashi.phal,
            num: num,
            planet: astro.planet,
            color: astro.color
        };
    }
}

const engine = new AstroEngine();
let namesData = [];

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. HEADER PADDING ---
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;

    // --- 2. THEME TOGGLE (Fixed) ---
    const themeBtn = document.getElementById("theme-toggle");
    if(themeBtn) {
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

    // --- 3. MOBILE MENU ---
    const hamburger = document.getElementById("hamburger-menu");
    const nav = document.getElementById("main-nav");
    if(hamburger && nav) {
        hamburger.onclick = (e) => { e.stopPropagation(); hamburger.classList.toggle("active"); nav.classList.toggle("active"); };
        document.onclick = (e) => { if (nav.classList.contains("active") && !nav.contains(e.target)) { hamburger.classList.remove("active"); nav.classList.remove("active"); }};
    }

    // --- 4. SCROLL TO TOP (Fixed) ---
    const scrollBtn = document.getElementById("scrollToTopBtn");
    if (scrollBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add("show");
                scrollBtn.style.opacity = "1";
                scrollBtn.style.visibility = "visible";
            } else {
                scrollBtn.classList.remove("show");
                scrollBtn.style.opacity = "0";
                scrollBtn.style.visibility = "hidden";
            }
        });
        scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // --- 5. LANGUAGE ---
    function updateContent(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            if (text) el.textContent = text;
        });
        const inp = document.getElementById("hero-search-input");
        if(inp) inp.placeholder = lang === "hi" ? "उदा: आरव..." : "e.g., Aarav...";
    }
    const langBtn = document.getElementById("language-toggle");
    if(langBtn) langBtn.onclick = () => updateContent(localStorage.getItem("language") === "hi" ? "en" : "hi");
    updateContent(localStorage.getItem("language") || "en");

    // --- 6. COMMON FUNCTION TO SHOW DETAILS (UI for both Search & List) ---
    function showDetails(box, data, gender="Unknown") {
        if(!box || !data) return;
        
        box.innerHTML = `
            <h2>${data.name}</h2>
            <div class="detail-grid" style="text-align: left; margin-top: 20px;">
                <p><strong>Meaning:</strong> ${data.meaning}</p>
                <p><strong>Gender:</strong> ${data.gender || gender}</p>
                <p><strong>Origin:</strong> ${data.origin || 'Sanskrit/Indian'}</p>
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
                <h3>🔮 Vedic Analysis</h3>
                <p><strong>Rashi:</strong> ${data.rashi}</p>
                <p><strong>Nakshatra:</strong> ${data.nakshatra}</p>
                <p><strong>Traits:</strong> ${data.phal}</p>
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
                <h3>🔢 Numerology</h3>
                <p><strong>Number:</strong> ${data.num}</p>
                <p><strong>Planet:</strong> ${data.planet}</p>
                <p><strong>Lucky Color:</strong> ${data.color}</p>
            </div>
        `;
    }

    // ======================================================
    // SEARCH LOGIC (FIXED: Uses AstroEngine for EVERYTHING)
    // ======================================================
    async function handleHeroSearch() {
        const input = document.getElementById('hero-search-input');
        if(!input || !input.value.trim()) return;
        const term = input.value.trim().toLowerCase();
        
        // Scroll to details section
        const section = document.getElementById('name-finder');
        const header = document.querySelector('header');
        if(section) window.scrollTo({ top: section.offsetTop - (header ? header.offsetHeight : 0) - 20, behavior: 'smooth' });

        const detailsBox = document.querySelector('.name-details');
        const listContainer = document.querySelector('.name-list-container');
        const detailsContainer = document.querySelector('.name-details-container');

        if(listContainer) listContainer.style.display = 'none';
        if(detailsContainer) detailsContainer.style.display = 'block';
        if(detailsBox) detailsBox.innerHTML = '<div class="spinner">Analyzing Name...</div>';

        try {
            // Load Database
            const [b, g] = await Promise.all([ 
                fetch('bnames.json').then(r => r.ok ? r.json() : []), 
                fetch('gnames.json').then(r => r.ok ? r.json() : []) 
            ]);
            
            // Flatten Data
            const all = [].concat(b, g).flatMap(i => i.name ? i : Object.values(i).find(v => Array.isArray(v))||[]);
            
            // Find Name
            const found = all.find(n => (n.name || n.Name).toLowerCase() === term);
            
            let dataToProcess;
            if (found) {
                dataToProcess = found;
            } else {
                // Agar name database mein nahi hai, tab bhi engine se calculate karo
                // FIX: Use input value capitalized for Title
                let displayTerm = term.charAt(0).toUpperCase() + term.slice(1);
                dataToProcess = { 
                    name: displayTerm, 
                    meaning: "Name not found in database (Auto-Calculated Analysis)",
                    gender: "Unknown",
                    origin: "Unknown"
                };
            }

            const smartData = engine.processName(dataToProcess);
            renderDetailHTML(detailsBox, smartData, dataToProcess.gender);

        } catch(e) {
            console.error(e);
            detailsBox.innerHTML = "<p>Search error. Please check console.</p>";
        }
    }
    
    // Re-attach helper because 'renderDetailHTML' wasn't defined in scope of handleHeroSearch in previous snippet
    function renderDetailHTML(box, smartData, gender = "Unknown") {
        showDetails(box, smartData, gender);
    }

    const sBtn = document.getElementById('hero-search-btn');
    const sInp = document.getElementById('hero-search-input');
    if(sBtn) sBtn.onclick = handleHeroSearch;
    if(sInp) sInp.onkeypress = (e) => { if(e.key==="Enter") handleHeroSearch(); };


    // ======================================================
    // NAME FINDER (A-Z LIST)
    // ======================================================
    const nameFinderSection = document.getElementById('name-finder');
    if (nameFinderSection) {
        const alphabetContainer = document.querySelector('.alphabet-selector');
        const nameListContainer = document.querySelector('.name-list');
        const nameDetailsBox = document.querySelector('.name-details');
        const nameDetailsContainer = document.querySelector('.name-details-container');
        const genderBtns = document.querySelectorAll('.gender-btn');
        const backBtn = document.querySelector('.back-btn');
        
        let currentGender = "Boy";
        let currentLetter = "A";

        async function loadNames(gender) {
            const fileName = (gender === "Boy") ? "bnames.json" : "gnames.json";
            try {
                if(nameListContainer) nameListContainer.innerHTML = '<div class="spinner">Loading...</div>';
                const response = await fetch(fileName);
                if (!response.ok) throw new Error("File missing");
                let rawData = await response.json();

                if (Array.isArray(rawData)) {
                    namesData = rawData;
                } else {
                    namesData = Object.values(rawData).find(v => Array.isArray(v)) || [];
                }
                renderNames();
            } catch (error) {
                console.error(error);
                if(nameListContainer) nameListContainer.innerHTML = `<p>Error loading ${fileName}.</p>`;
            }
        }

        function generateAlphabet() {
            if(!alphabetContainer) return;
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
            alphabetContainer.innerHTML = "";
            chars.forEach(char => {
                const btn = document.createElement("button");
                btn.className = `alphabet-btn ${char === currentLetter ? 'active' : ''}`;
                btn.textContent = char;
                btn.onclick = () => {
                    document.querySelectorAll('.alphabet-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentLetter = char;
                    renderNames();
                };
                alphabetContainer.appendChild(btn);
            });
        }

        function renderNames() {
            if(!nameListContainer) return;
            nameListContainer.innerHTML = "";
            const listSection = document.querySelector('.name-list-container');
            if(listSection) listSection.style.display = 'block';
            if(nameDetailsContainer) nameDetailsContainer.style.display = 'none';

            if (!Array.isArray(namesData)) return;

            const filtered = namesData.filter(n => {
                // FIX: Check both 'name' and 'Name'
                let nName = n.name || n.Name;
                return nName && nName.toUpperCase().startsWith(currentLetter);
            });
            
            if (filtered.length === 0) {
                nameListContainer.innerHTML = `<p style="width:100%; text-align:center;">No names found.</p>`;
                return;
            }

            filtered.forEach(person => {
                const div = document.createElement("div");
                div.className = "name-item";
                div.textContent = person.name || person.Name;
                
                div.onclick = () => {
                    if(listSection) listSection.style.display = 'none';
                    if(nameDetailsContainer) nameDetailsContainer.style.display = 'block';
                    
                    const smartData = engine.processName(person);
                    showDetails(nameDetailsBox, smartData, currentGender);
                };
                nameListContainer.appendChild(div);
            });
        }

        genderBtns.forEach(btn => {
            btn.onclick = () => {
                genderBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentGender = btn.dataset.gender;
                loadNames(currentGender);
            };
        });

        if(backBtn) backBtn.onclick = () => {
            if(nameDetailsContainer) nameDetailsContainer.style.display = 'none';
            const listSection = document.querySelector('.name-list-container');
            if(listSection) listSection.style.display = 'block';
        };

        generateAlphabet();
        loadNames("Boy");
    }

    // --- CHATBOT PLACEHOLDER ---
    if(document.getElementById("chatbox")) {
        const btn = document.getElementById("sendBtn");
        const inp = document.getElementById("userInput");
        const box = document.getElementById("chatbox");
        const send = () => {
            if(!inp.value.trim()) return;
            box.innerHTML += `<div class="message user">${inp.value}</div>`;
            inp.value = "";
            box.scrollTop = box.scrollHeight;
            box.innerHTML += `<div class="message bot">API Key required.</div>`;
        };
        if(btn) btn.onclick = send;
        if(inp) inp.onkeypress = (e) => { if(e.key==="Enter") send(); };
    }
});
