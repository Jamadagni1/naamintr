/* ======================================================
   SCRIPT.JS - FINAL MASTER VERSION
   (Search, Theme, Scroll & Smart Details Fixed)
   ====================================================== */

// --- 1. Force Page Visibility (Safety) ---
document.body.style.visibility = "visible";
document.body.style.opacity = "1";

const GEMINI_API_KEY = ""; // Optional

// ======================================================
// 🌟 ASTRO ENGINE CLASS (Logic for Calculation)
// ======================================================
class AstroEngine {
    constructor() {
        this.numerologyMap = {
            'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
            'B': 2, 'K': 2, 'R': 2,
            'C': 3, 'G': 3, 'L': 3, 'S': 3,
            'D': 4, 'M': 4, 'T': 4,
            'E': 5, 'H': 5, 'N': 5, 'X': 5,
            'U': 6, 'V': 6, 'W': 6,
            'O': 7, 'Z': 7,
            'F': 8, 'P': 8
        };

        this.rashiMap = [
            { rashi: "मेष (Aries)", letters: ["chu", "che", "cho", "la", "li", "lu", "le", "lo", "a"], nakshatras: ["Ashwini", "Bharani", "Krittika"], phal: "साहसी, ऊर्जावान और नेतृत्व करने वाला।" },
            { rashi: "वृषभ (Taurus)", letters: ["i", "ee", "u", "oo", "e", "o", "va", "vi", "vu", "ve", "vo"], nakshatras: ["Krittika", "Rohini", "Mrigashira"], phal: "शांत, विश्वसनीय और कला प्रेमी।" },
            { rashi: "मिथुन (Gemini)", letters: ["ka", "ki", "ku", "gh", "ng", "ch", "ke", "ko", "ha"], nakshatras: ["Mrigashira", "Ardra", "Punarvasu"], phal: "बुद्धिमान, वाचाल और बहुमुखी प्रतिभा वाला।" },
            { rashi: "कर्क (Cancer)", letters: ["hi", "hu", "he", "ho", "da", "di", "du", "de", "do"], nakshatras: ["Punarvasu", "Pushya", "Ashlesha"], phal: "भावुक, संवेदनशील और परिवार प्रेमी।" },
            { rashi: "सिंह (Leo)", letters: ["ma", "mi", "mu", "me", "mo", "ta", "ti", "tu", "te"], nakshatras: ["Magha", "Purva Phalguni", "Uttara Phalguni"], phal: "आत्मविश्वासी, उदार और राजा जैसा स्वभाव।" },
            { rashi: "कन्या (Virgo)", letters: ["to", "pa", "pi", "pu", "sha", "na", "th", "pe", "po"], nakshatras: ["Uttara Phalguni", "Hasta", "Chitra"], phal: "विश्लेषण करने वाला, व्यावहारिक और मेहनती।" },
            { rashi: "तुला (Libra)", letters: ["ra", "ri", "ru", "re", "ro", "ta", "ti", "tu", "te"], nakshatras: ["Chitra", "Swati", "Vishakha"], phal: "न्यायप्रिय, संतुलित और मिलनसार।" },
            { rashi: "वृश्चिक (Scorpio)", letters: ["to", "na", "ni", "nu", "ne", "no", "ya", "yi", "yu"], nakshatras: ["Vishakha", "Anuradha", "Jyeshtha"], phal: "तीव्र, रहस्यमयी और दृढ़ निश्चय वाला।" },
            { rashi: "धनु (Sagittarius)", letters: ["ye", "yo", "bha", "bhi", "bhu", "dha", "pha", "dha", "bhe"], nakshatras: ["Mula", "Purva Ashadha", "Uttara Ashadha"], phal: "आशावादी, दार्शनिक और स्वतंत्र।" },
            { rashi: "मकर (Capricorn)", letters: ["bho", "ja", "ji", "ju", "je", "jo", "kha", "ga", "gi"], nakshatras: ["Uttara Ashadha", "Shravana", "Dhanishtha"], phal: "महत्वाकांक्षी, अनुशासित और धैर्यवान।" },
            { rashi: "कुम्भ (Aquarius)", letters: ["gu", "ge", "go", "sa", "si", "su", "se", "so", "da"], nakshatras: ["Dhanishtha", "Shatabhisha", "Purva Bhadrapada"], phal: "नवीन सोच वाला, मानवीय और मित्रवत।" },
            { rashi: "मीन (Pisces)", letters: ["di", "du", "th", "jha", "yna", "de", "do", "cha", "chi"], nakshatras: ["Purva Bhadrapada", "Uttara Bhadrapada", "Revati"], phal: "दयालु, आध्यात्मिक और कल्पनाशील।" }
        ];

        this.astroDetails = {
            1: { planet: "सूर्य (Sun)", color: "सुनहरा (Golden)", day: "रविवार" },
            2: { planet: "चन्द्र (Moon)", color: "सफेद (White)", day: "सोमवार" },
            3: { planet: "बृहस्पति (Jupiter)", color: "पीला (Yellow)", day: "गुरुवार" },
            4: { planet: "राहू (Rahu)", color: "नीला (Blue)", day: "शनिवार" },
            5: { planet: "बुध (Mercury)", color: "हरा (Green)", day: "बुधवार" },
            6: { planet: "शुक्र (Venus)", color: "गुलाबी (Pink)", day: "शुक्रवार" },
            7: { planet: "केतु (Ketu)", color: "चितकबरा (Multi)", day: "मंगलवार" },
            8: { planet: "शनि (Saturn)", color: "काला (Black)", day: "शनिवार" },
            9: { planet: "मंगल (Mars)", color: "लाल (Red)", day: "मंगलवार" }
        };
    }

    calculateNumerology(name) {
        if (!name) return 1;
        let cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
        let total = 0;
        for (let char of cleanName) total += this.numerologyMap[char] || 0;
        while (total > 9) {
            let sum = 0;
            while (total > 0) { sum += total % 10; total = Math.floor(total / 10); }
            total = sum;
        }
        return total || 1;
    }

    calculateRashi(name) {
        if (!name) return this.rashiMap[0];
        let cleanName = name.toLowerCase().trim();
        for (let rashiObj of this.rashiMap) {
            for (let sound of rashiObj.letters) {
                if (cleanName.startsWith(sound)) return rashiObj;
            }
        }
        return this.rashiMap[0];
    }

    processName(nameData) {
        // Safety Check
        if (!nameData || !nameData.name) return null;

        const num = this.calculateNumerology(nameData.name);
        const rashiDetails = this.calculateRashi(nameData.name);
        const luckyInfo = this.astroDetails[num] || this.astroDetails[1];

        return {
            ...nameData, 
            name: nameData.name, // Ensure lowercase key
            meaning: nameData.meaning || "Meaning not available in database.",
            calculatedRashi: rashiDetails.rashi,
            calculatedNakshatra: rashiDetails.nakshatras.join(", "),
            calculatedPhal: rashiDetails.phal,
            calculatedNum: num,
            calculatedPlanet: luckyInfo.planet,
            calculatedColor: luckyInfo.color,
            calculatedDay: luckyInfo.day
        };
    }
}

// ======================================================
// MAIN LOGIC
// ======================================================

let namesData = []; 
const engine = new AstroEngine();

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Header Adjustment ---
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;

    // --- 2. Mobile Menu ---
    const hamburger = document.getElementById("hamburger-menu");
    const nav = document.getElementById("main-nav");
    if(hamburger && nav) {
        hamburger.onclick = (e) => { e.stopPropagation(); hamburger.classList.toggle("active"); nav.classList.toggle("active"); };
        document.onclick = (e) => { if (nav.classList.contains("active") && !nav.contains(e.target)) { hamburger.classList.remove("active"); nav.classList.remove("active"); }};
    }

    // --- 3. Scroll To Top Button (FIXED) ---
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (scrollToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add("show");
                scrollToTopBtn.style.opacity = "1"; // Force show
                scrollToTopBtn.style.visibility = "visible";
            } else {
                scrollToTopBtn.classList.remove("show");
                scrollToTopBtn.style.opacity = "0";
                scrollToTopBtn.style.visibility = "hidden";
            }
        });
        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // --- 4. Theme & Language (FIXED) ---
    const themeBtn = document.getElementById("theme-toggle");
    
    // Apply saved theme on load
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
    if(themeBtn) themeBtn.innerHTML = savedTheme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

    // Theme Toggle Listener
    if (themeBtn) {
        themeBtn.onclick = () => {
            const current = document.body.getAttribute("data-theme");
            const next = current === "dark" ? "light" : "dark";
            document.body.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
            themeBtn.innerHTML = next === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        };
    }

    function updateContent(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            if (text) el.textContent = text;
        });
        const heroInput = document.getElementById("hero-search-input");
        if(heroInput) heroInput.placeholder = lang === "hi" ? "उदा: आरव, अद्विक..." : "e.g., Aarav, Advik...";
    }
    const langBtn = document.getElementById("language-toggle");
    if(langBtn) langBtn.onclick = () => updateContent(localStorage.getItem("language") === "hi" ? "en" : "hi");
    updateContent(localStorage.getItem("language") || "en");

    // --- 5. Pricing Toggle ---
    document.querySelectorAll(".pricing-card-header").forEach(header => {
        header.onclick = () => header.closest(".pricing-card")?.classList.toggle("expanded");
    });

    // --- 6. Helper: Render Details HTML (Used by both Search & List) ---
    function renderDetailHTML(box, smartData, gender = "Unknown") {
        if(!box) return;
        box.innerHTML = `
            <h2>${smartData.name}</h2>
            <div class="detail-grid">
                <p><strong>Meaning:</strong> ${smartData.meaning}</p>
                <p><strong>Gender:</strong> ${smartData.gender || gender}</p>
                <p><strong>Origin:</strong> ${smartData.origin || 'Sanskrit/Indian'}</p>
                <hr>
                <h3>🔮 Vedic Analysis</h3>
                <p><strong>Rashi:</strong> ${smartData.calculatedRashi}</p>
                <p><strong>Nakshatra:</strong> ${smartData.calculatedNakshatra}</p>
                <p><strong>Personality:</strong> ${smartData.calculatedPhal}</p>
                <hr>
                <h3>🔢 Numerology</h3>
                <p><strong>Number:</strong> ${smartData.calculatedNum}</p>
                <p><strong>Planet:</strong> ${smartData.calculatedPlanet}</p>
                <p><strong>Lucky Color:</strong> ${smartData.calculatedColor}</p>
                <p><strong>Lucky Day:</strong> ${smartData.calculatedDay}</p>
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
            const found = all.find(n => n.name.toLowerCase() === term);
            
            // --- MAIN FIX: Use AstroEngine for BOTH found and not-found names ---
            let dataToProcess;
            if (found) {
                dataToProcess = found;
            } else {
                // Agar name database mein nahi hai, tab bhi engine se calculate karo
                dataToProcess = { 
                    name: input.value.trim(), 
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

            const filtered = namesData.filter(n => n.name && n.name.toUpperCase().startsWith(currentLetter));
            
            if (filtered.length === 0) {
                nameListContainer.innerHTML = `<p style="width:100%; text-align:center;">No names found.</p>`;
                return;
            }

            filtered.forEach(person => {
                const div = document.createElement("div");
                div.className = "name-item";
                div.textContent = person.name;
                
                div.onclick = () => {
                    if(listSection) listSection.style.display = 'none';
                    if(nameDetailsContainer) nameDetailsContainer.style.display = 'block';
                    
                    // Use the centralized render function
                    const smartData = engine.processName(person);
                    renderDetailHTML(nameDetailsBox, smartData, currentGender);
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
