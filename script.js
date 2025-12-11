/* ======================================================
   SCRIPT.JS - INTELLIGENT VERSION (With AstroEngine)
   ====================================================== */

// --- 1. Force Page Visibility ---
document.body.style.visibility = "visible";
document.body.style.opacity = "1";

const GEMINI_API_KEY = ""; // API Key (Optional)

// ======================================================
// 🌟 ASTRO ENGINE CLASS (Logic for Calculation)
// ======================================================
class AstroEngine {
    constructor() {
        // 1. Numerology Map (Chaldean)
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

        // 2. Rashi & Nakshatra Mapping (Phonetic)
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

        // 3. Astro Details (Based on Number)
        this.astroDetails = {
            1: { planet: "सूर्य (Sun)", color: "सुनहरा (Golden)", day: "रविवार", trait: "नेतृत्व क्षमता" },
            2: { planet: "चन्द्र (Moon)", color: "सफेद (White)", day: "सोमवार", trait: "शांतिप्रिय" },
            3: { planet: "बृहस्पति (Jupiter)", color: "पीला (Yellow)", day: "गुरुवार", trait: "ज्ञान और भाग्य" },
            4: { planet: "राहू (Rahu)", color: "नीला (Blue)", day: "शनिवार", trait: "व्यावहारिक" },
            5: { planet: "बुध (Mercury)", color: "हरा (Green)", day: "बुधवार", trait: "बुद्धि और संचार" },
            6: { planet: "शुक्र (Venus)", color: "गुलाबी (Pink)", day: "शुक्रवार", trait: "प्रेम और कला" },
            7: { planet: "केतु (Ketu)", color: "चितकबरा (Multi)", day: "मंगलवार", trait: "आध्यात्मिक" },
            8: { planet: "शनि (Saturn)", color: "काला (Black)", day: "शनिवार", trait: "न्याय और मेहनत" },
            9: { planet: "मंगल (Mars)", color: "लाल (Red)", day: "मंगलवार", trait: "ऊर्जा और साहस" }
        };
    }

    // Calculate Numerology
    calculateNumerology(name) {
        let cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
        let total = 0;
        for (let char of cleanName) {
            total += this.numerologyMap[char] || 0;
        }
        while (total > 9) {
            let sum = 0;
            while (total > 0) {
                sum += total % 10;
                total = Math.floor(total / 10);
            }
            total = sum;
        }
        return total || 1; // Default to 1
    }

    // Calculate Rashi
    calculateRashi(name) {
        let cleanName = name.toLowerCase().trim();
        for (let rashiObj of this.rashiMap) {
            for (let sound of rashiObj.letters) {
                if (cleanName.startsWith(sound)) {
                    return rashiObj;
                }
            }
        }
        // Fallback Logic based on first letter if sound not found
        return this.rashiMap[0]; // Default to Aries for now
    }

    // Process Full Data
    processName(nameData) {
        const num = this.calculateNumerology(nameData.name);
        const rashiDetails = this.calculateRashi(nameData.name);
        const luckyInfo = this.astroDetails[num];

        return {
            ...nameData, // Keep existing JSON data
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
// MAIN SCRIPT LOGIC
// ======================================================

let namesData = []; 
// Create Engine Instance
const engine = new AstroEngine();

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Header Adjustment ---
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;

    // --- Mobile Menu ---
    const hamburger = document.getElementById("hamburger-menu");
    const nav = document.getElementById("main-nav");
    if(hamburger && nav) {
        hamburger.onclick = (e) => { e.stopPropagation(); hamburger.classList.toggle("active"); nav.classList.toggle("active"); };
        document.onclick = (e) => { if (nav.classList.contains("active") && !nav.contains(e.target)) { hamburger.classList.remove("active"); nav.classList.remove("active"); }};
    }

    // --- Text & Language ---
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

    // --- Pricing Toggle ---
    document.querySelectorAll(".pricing-card-header").forEach(header => {
        header.onclick = () => header.closest(".pricing-card")?.classList.toggle("expanded");
    });

    // ======================================================
    // NAME FINDER (INTEGRATED WITH ASTRO ENGINE)
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

        // Load JSON
        async function loadNames(gender) {
            const fileName = (gender === "Boy") ? "bnames.json" : "gnames.json";
            try {
                if(nameListContainer) nameListContainer.innerHTML = '<div class="spinner">Loading...</div>';
                const response = await fetch(fileName);
                if (!response.ok) throw new Error("File missing");
                let rawData = await response.json();

                // Flatten Data
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

        // Render A-Z
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

        // Render List
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
                
                // CLICK EVENT: Use Astro Engine Here!
                div.onclick = () => {
                    if(listSection) listSection.style.display = 'none';
                    if(nameDetailsContainer) nameDetailsContainer.style.display = 'block';
                    
                    // 🌟 MAGIC HAPPENS HERE: Calculate Details Dynamically
                    const smartData = engine.processName(person);

                    if(nameDetailsBox) {
                        nameDetailsBox.innerHTML = `
                            <h2>${smartData.Name}</h2>
                            <div class="detail-grid">
                                <p><strong>Meaning:</strong> ${smartData.Meaning}</p>
                                <p><strong>Gender:</strong> ${smartData.gender || currentGender}</p>
                                <p><strong>Origin:</strong> ${smartData.origin || 'Sanskrit'}</p>
                                <hr>
                                <h3>🔮 Vedic Analysis</h3>
                                <p><strong>Rashi:</strong> ${smartData.calculatedRashi}</p>
                                <p><strong>Nakshatra:</strong> ${smartData.calculatedNakshatra}</p>
                                <p><strong>Traits:</strong> ${smartData.calculatedPhal}</p>
                                <hr>
                                <h3>🔢 Numerology</h3>
                                <p><strong>Number:</strong> ${smartData.calculatedNum}</p>
                                <p><strong>Ruling Planet:</strong> ${smartData.calculatedPlanet}</p>
                                <p><strong>Lucky Color:</strong> ${smartData.calculatedColor}</p>
                                <p><strong>Lucky Day:</strong> ${smartData.calculatedDay}</p>
                            </div>
                        `;
                    }
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

    // --- Search Logic ---
    async function handleHeroSearch() {
        const input = document.getElementById('hero-search-input');
        if(!input || !input.value.trim()) return;
        const term = input.value.trim().toLowerCase();
        
        // Scroll to details
        const section = document.getElementById('name-finder');
        if(section) window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });

        const detailsBox = document.querySelector('.name-details');
        const listContainer = document.querySelector('.name-list-container');
        const detailsContainer = document.querySelector('.name-details-container');

        if(listContainer) listContainer.style.display = 'none';
        if(detailsContainer) detailsContainer.style.display = 'block';
        if(detailsBox) detailsBox.innerHTML = '<div class="spinner">Analyzing...</div>';

        // Load & Search
        try {
            const [b, g] = await Promise.all([ fetch('bnames.json').then(r=>r.json()), fetch('gnames.json').then(r=>r.json()) ]);
            const all = [].concat(b, g).flatMap(i => i.name ? i : Object.values(i).find(v => Array.isArray(v))||[]);
            
            const found = all.find(n => n.name.toLowerCase() === term);
            
            if(found) {
                // Use Engine for Search too!
                const smartData = engine.processName(found);
                detailsBox.innerHTML = `
                    <h2>${smartData.Name}</h2>
                    <p><strong>Meaning:</strong> ${smartData.Meaning}</p>
                    <p><strong>Rashi:</strong> ${smartData.calculatedRashi}</p>
                    <p><strong>Numerology:</strong> ${smartData.calculatedNum} (${smartData.calculatedPlanet})</p>
                `;
            } else {
                // Create data even if not in list (Calculate for ANY name)
                const smartData = engine.processName({ name: input.value, meaning: "Unknown (Name not in list)" });
                detailsBox.innerHTML = `
                    <h2>${smartData.Name}</h2>
                    <p><em>(Not in database, but here is the analysis)</em></p>
                    <p><strong>Rashi:</strong> ${smartData.calculatedRashi}</p>
                    <p><strong>Nakshatra:</strong> ${smartData.calculatedNakshatra}</p>
                    <p><strong>Numerology:</strong> ${smartData.calculatedNum} (${smartData.calculatedPlanet})</p>
                `;
            }
        } catch(e) {
            detailsBox.innerHTML = "<p>Search error.</p>";
        }
    }

    const sBtn = document.getElementById('hero-search-btn');
    const sInp = document.getElementById('hero-search-input');
    if(sBtn) sBtn.onclick = handleHeroSearch;
    if(sInp) sInp.onkeypress = (e) => { if(e.key==="Enter") handleHeroSearch(); };

    // Chatbot placeholder
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
