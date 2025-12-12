/* ======================================================
   SCRIPT.JS - FINAL WORKING VERSION (No API Needed)
   ====================================================== */

// 1. Force Page Visibility (Safety)
document.body.style.visibility = "visible";
document.body.style.opacity = "1";

// 🌟 ASTRO ENGINE CLASS (Logic for Calculation)
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
        // FIX: Handle both 'name' and 'Name' keys to avoid UNDEFINED
        let safeName = data.name || data.Name;
        if(!safeName) return null;

        const num = this.calculateNumerology(safeName);
        const rashi = this.calculateRashi(safeName);
        const astro = this.astroDetails[num] || this.astroDetails[1];

        return {
            ...data,
            name: safeName,
            meaning: data.meaning || data.Meaning || "Meaning available in database.",
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
    
    // Header Padding
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;

    // Theme Toggle
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

    // Mobile Menu
    const hamburger = document.getElementById("hamburger-menu");
    const nav = document.getElementById("main-nav");
    if(hamburger && nav) {
        hamburger.onclick = (e) => { e.stopPropagation(); hamburger.classList.toggle("active"); nav.classList.toggle("active"); };
        document.onclick = (e) => { if (nav.classList.contains("active") && !nav.contains(e.target)) { hamburger.classList.remove("active"); nav.classList.remove("active"); }};
    }

    // Scroll To Top
    const scrollBtn = document.getElementById("scrollToTopBtn");
    if (scrollBtn) {
        window.addEventListener("scroll", () => {
            scrollBtn.classList.toggle("show", window.scrollY > 300);
            scrollBtn.style.opacity = window.scrollY > 300 ? "1" : "0";
            scrollBtn.style.visibility = window.scrollY > 300 ? "visible" : "hidden";
        });
        scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Language Fix
    function updateContent(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            if (text) el.textContent = text;
        });
    }
    const langBtn = document.getElementById("language-toggle");
    if(langBtn) langBtn.onclick = () => updateContent(localStorage.getItem("language") === "hi" ? "en" : "hi");
    updateContent(localStorage.getItem("language") || "en");

    // Helper: Show Details UI
    function showDetails(box, data, gender="Unknown") {
        if(!box || !data) return;
        
        // Show everything even if JSON is missing it (Smart Engine fills it)
        box.innerHTML = `
            <h2>${data.name}</h2>
            <div class="detail-grid" style="text-align: left; margin-top: 20px;">
                <p><strong>Meaning:</strong> ${data.meaning}</p>
                <p><strong>Gender:</strong> ${data.gender || gender}</p>
                <p><strong>Origin:</strong> ${data.origin || 'Sanskrit/Indian'}</p>
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
                <h3>🔮 Vedic Astrology</h3>
                <p><strong>Rashi:</strong> ${data.rashi}</p>
                <p><strong>Nakshatra:</strong> ${data.nakshatra}</p>
                <p><strong>Personality:</strong> ${data.phal}</p>
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
                <h3>🔢 Numerology</h3>
                <p><strong>Number:</strong> ${data.num}</p>
                <p><strong>Planet:</strong> ${data.planet}</p>
                <p><strong>Lucky Color:</strong> ${data.color}</p>
            </div>
        `;
    }

    // === SEARCH LOGIC (Fixes undefined error) ===
    async function handleHeroSearch() {
        const input = document.getElementById('hero-search-input');
        if(!input || !input.value.trim()) return;
        const term = input.value.trim().toLowerCase();

        const section = document.getElementById('name-finder');
        const detailsBox = document.querySelector('.name-details');
        const listContainer = document.querySelector('.name-list-container');
        const detailsContainer = document.querySelector('.name-details-container');

        if(section) {
            window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
            if(listContainer) listContainer.style.display = 'none';
            if(detailsContainer) detailsContainer.style.display = 'block';
            if(detailsBox) detailsBox.innerHTML = '<div class="spinner">Searching...</div>';

            try {
                // Load JSON files
                const [b, g] = await Promise.all([ 
                    fetch('bnames.json').then(r => r.ok?r.json():[]), 
                    fetch('gnames.json').then(r => r.ok?r.json():[]) 
                ]);
                
                const all = [].concat(b, g).flatMap(i => i.name ? i : (Object.values(i).find(v=>Array.isArray(v))||[]));
                const found = all.find(n => (n.name || n.Name).toLowerCase() === term);

                let dataToProcess;
                if(found) {
                    dataToProcess = found;
                } else {
                    // Smart handling if name not in DB
                    let displayTerm = term.charAt(0).toUpperCase() + term.slice(1);
                    dataToProcess = { 
                        name: displayTerm, 
                        meaning: "Auto-Calculated Analysis (Name not in database)", 
                        gender: "Unknown", 
                        origin: "Unknown" 
                    };
                }

                const smartData = engine.processName(dataToProcess);
                showDetails(detailsBox, smartData, dataToProcess.gender);

            } catch(e) {
                console.error(e);
                detailsBox.innerHTML = "<p>Search error. Please try again.</p>";
            }
        }
    }

    const sBtn = document.getElementById('hero-search-btn');
    const sInp = document.getElementById('hero-search-input');
    if(sBtn) sBtn.onclick = handleHeroSearch;
    if(sInp) sInp.onkeypress = (e) => { if(e.key==="Enter") handleHeroSearch(); };

    // === A-Z LIST LOGIC ===
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
                if(nameListContainer) nameListContainer.innerHTML = `<p>Error loading ${fileName}. Check file.</p>`;
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
});
