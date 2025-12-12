/* ======================================================
   SCRIPT.JS - CONNECTED TO JSON FILES
   ====================================================== */

const GEMINI_API_KEY = ""; // अपनी API Key यहाँ डालें (Chatbot के लिए)

// ======================================================
// 1. ASTRO LOGIC ENGINE (राशि, नक्षत्र कैलकुलेटर)
// ======================================================
class AstroEngine {
    constructor() {
        // अंक ज्योतिष मैपिंग
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

        // राशि और नक्षत्र डेटा
        this.rashiMap = [
            { rashi: "मेष (Aries)", sounds: ["chu", "che", "cho", "la", "li", "lu", "le", "lo", "a"], nakshatra: "Ashwini / Bharani", phal: "साहसी, ऊर्जावान और नेतृत्व करने वाला।" },
            { rashi: "वृषभ (Taurus)", sounds: ["i", "ee", "u", "oo", "e", "o", "va", "vi", "vu", "ve", "vo"], nakshatra: "Krittika / Rohini", phal: "शांत, विश्वसनीय और कला प्रेमी।" },
            { rashi: "मिथुन (Gemini)", sounds: ["ka", "ki", "ku", "gh", "ng", "ch", "ke", "ko", "ha"], nakshatra: "Mrigashira / Ardra", phal: "बुद्धिमान, वाचाल और बहुमुखी।" },
            { rashi: "कर्क (Cancer)", sounds: ["hi", "hu", "he", "ho", "da", "di", "du", "de", "do"], nakshatra: "Punarvasu / Pushya", phal: "भावुक, संवेदनशील और रक्षक।" },
            { rashi: "सिंह (Leo)", sounds: ["ma", "mi", "mu", "me", "mo", "ta", "ti", "tu", "te"], nakshatra: "Magha / P. Phalguni", phal: "आत्मविश्वासी, उदार और राजसी।" },
            { rashi: "कन्या (Virgo)", sounds: ["to", "pa", "pi", "pu", "sha", "na", "th", "pe", "po"], nakshatra: "Uttara Phalguni / Hasta", phal: "व्यावहारिक, विश्लेषक और मेहनती।" },
            { rashi: "तुला (Libra)", sounds: ["ra", "ri", "ru", "re", "ro", "ta", "ti", "tu", "te"], nakshatra: "Chitra / Swati", phal: "न्यायप्रिय, संतुलित और मिलनसार।" },
            { rashi: "वृश्चिक (Scorpio)", sounds: ["to", "na", "ni", "nu", "ne", "no", "ya", "yi", "yu"], nakshatra: "Vishakha / Anuradha", phal: "तीव्र, रहस्यमयी और दृढ़।" },
            { rashi: "धनु (Sagittarius)", sounds: ["ye", "yo", "bha", "bhi", "bhu", "dha", "pha", "dha", "bhe"], nakshatra: "Mula / P. Ashadha", phal: "आशावादी, दार्शनिक और मुक्त।" },
            { rashi: "मकर (Capricorn)", sounds: ["bho", "ja", "ji", "ju", "je", "jo", "kha", "ga", "gi"], nakshatra: "U. Ashadha / Shravana", phal: "महत्वाकांक्षी, अनुशासित और धैर्यवान।" },
            { rashi: "कुम्भ (Aquarius)", sounds: ["gu", "ge", "go", "sa", "si", "su", "se", "so", "da"], nakshatra: "Dhanishtha / Shatabhisha", phal: "नवीन सोच, मानवीय और मित्रवत।" },
            { rashi: "मीन (Pisces)", sounds: ["di", "du", "th", "jha", "yna", "de", "do", "cha", "chi"], nakshatra: "P. Bhadrapada / Revati", phal: "दयालु, आध्यात्मिक और कल्पनाशील।" }
        ];

        // अंक ज्योतिष डेटा
        this.numerologyDetails = {
            1: { planet: "सूर्य (Sun)", color: "Golden/Orange", day: "Sunday", trait: "Leadership (नेतृत्व)" },
            2: { planet: "चन्द्र (Moon)", color: "White/Silver", day: "Monday", trait: "Emotion (भावना)" },
            3: { planet: "बृहस्पति (Jupiter)", color: "Yellow", day: "Thursday", trait: "Wisdom (ज्ञान)" },
            4: { planet: "राहू (Rahu)", color: "Blue", day: "Saturday", trait: "Discipline (अनुशासन)" },
            5: { planet: "बुध (Mercury)", color: "Green", day: "Wednesday", trait: "Intellect (बुद्धि)" },
            6: { planet: "शुक्र (Venus)", color: "Pink/White", day: "Friday", trait: "Luxury (वैभव)" },
            7: { planet: "केतु (Ketu)", color: "Multi-color", day: "Tuesday", trait: "Spirituality (अध्यात्म)" },
            8: { planet: "शनि (Saturn)", color: "Black/Blue", day: "Saturday", trait: "Justice (न्याय)" },
            9: { planet: "मंगल (Mars)", color: "Red", day: "Tuesday", trait: "Energy (ऊर्जा)" }
        };
    }

    calculateNumerology(name) {
        if (!name) return 1;
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
        return total || 1;
    }

    calculateRashi(name) {
        if (!name) return this.rashiMap[0];
        let n = name.toLowerCase().trim();
        for (let r of this.rashiMap) {
            for (let sound of r.sounds) {
                if (n.startsWith(sound)) {
                    return r;
                }
            }
        }
        // Fallback: Check first letter match
        return this.rashiMap.find(r => r.sounds.includes(n.charAt(0))) || { 
            rashi: "Unknown", nakshatra: "Unknown", phal: "Data not available" 
        };
    }

    processName(nameData) {
        // JSON se Name aur Meaning lo
        const safeName = nameData.name || nameData.Name; 
        const num = this.calculateNumerology(safeName);
        const rashiData = this.calculateRashi(safeName);
        const numData = this.numerologyDetails[num];

        return {
            name: safeName,
            meaning: nameData.meaning || "Meaning available in full report",
            gender: nameData.gender || "Unknown",
            
            // Calculated Data
            rashi: rashiData.rashi,
            nakshatra: rashiData.nakshatra,
            rashiphal: rashiData.phal,
            numerology_number: num,
            lucky_number: num, 
            planet: numData.planet,
            lucky_color: numData.color,
            lucky_day: numData.day,
            trait: numData.trait
        };
    }
}

const astroEngine = new AstroEngine();


// ======================================================
// 2. UI UTILITIES (Header, Theme, Mobile Menu)
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Preloader Remover
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        });
        setTimeout(() => { if(preloader.style.display !== 'none') preloader.style.display = 'none'; }, 3000);
    }

    // Header Padding Adjustment
    function adjustContent() {
        const header = document.querySelector('header');
        if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;
    }
    adjustContent();
    window.addEventListener('resize', adjustContent);

    // Theme Logic
    const themeBtn = document.getElementById("theme-toggle");
    if(themeBtn) {
        const currentTheme = localStorage.getItem("theme") || "light";
        document.body.setAttribute("data-theme", currentTheme);
        themeBtn.innerHTML = currentTheme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        themeBtn.addEventListener("click", () => {
            const newTheme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
            document.body.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            themeBtn.innerHTML = newTheme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // Language Logic
    const langBtn = document.getElementById("language-toggle");
    if(langBtn) {
        const updateLang = (lang) => {
            document.documentElement.lang = lang;
            localStorage.setItem("language", lang);
            document.querySelectorAll("[data-en]").forEach(el => {
                el.textContent = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            });
            const inp = document.getElementById("hero-search-input");
            if(inp) inp.placeholder = lang === "hi" ? "उदा: आरव..." : "e.g., Aarav...";
        };
        langBtn.addEventListener("click", () => {
            const newLang = document.documentElement.lang === "hi" ? "en" : "hi";
            updateLang(newLang);
        });
        updateLang(localStorage.getItem("language") || "en");
    }

    // Mobile Menu
    const hamburger = document.getElementById("hamburger-menu");
    const nav = document.getElementById("main-nav");
    if (hamburger && nav) {
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            hamburger.classList.toggle("active");
            nav.classList.toggle("active");
        });
        document.addEventListener("click", (e) => {
            if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove("active");
                nav.classList.remove("active");
            }
        });
    }

    // Typing Effect
    const typeTitle = document.getElementById("naamin-main-title-typing");
    if(typeTitle) {
        const text = "Naamin";
        let i = 0;
        const type = () => {
            if(i <= text.length) {
                typeTitle.innerHTML = `<span class="naamin-naam">${text.slice(0, 4)}</span><span class="naamin-in">${text.slice(4, i)}</span>`;
                i++; setTimeout(type, 150);
            } else { setTimeout(() => { i = 0; type(); }, 5000); }
        };
        type();
    }

    // Scroll To Top
    const scrollBtn = document.getElementById("scrollToTopBtn");
    if(scrollBtn) {
        window.addEventListener("scroll", () => scrollBtn.classList.toggle("show", window.scrollY > 300));
        scrollBtn.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
    }
});


// ======================================================
// 3. HERO SEARCH LOGIC (Using AstroEngine)
// ======================================================
async function handleHeroSearch() {
    const input = document.getElementById('hero-search-input');
    if (!input || !input.value.trim()) return;
    const term = input.value.trim();

    const section = document.getElementById('name-finder');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        
        const listContainer = document.querySelector('.name-list-container');
        const detailsContainer = document.querySelector('.name-details-container');
        const detailsBox = document.querySelector('.name-details');
        
        if(listContainer) listContainer.style.display = 'none';
        if(detailsContainer) detailsContainer.style.display = 'block';
        if(detailsBox) detailsBox.innerHTML = '<div class="spinner"></div><p style="text-align:center">Analyzing...</p>';

        // Process directly via engine
        const rawData = { name: term, meaning: "Name analyzed by Naamin AI", gender: "Neutral" };
        const processedData = astroEngine.processName(rawData);
        
        renderDetails(detailsBox, processedData);
    }
}

const heroBtn = document.getElementById('hero-search-btn');
if(heroBtn) heroBtn.addEventListener('click', handleHeroSearch);


// ======================================================
// 4. NAME FINDER LOGIC (Fetching JSONs)
// ======================================================

if (document.getElementById("name-finder")) {
    const genderSelector = document.querySelector(".gender-selector");
    const alphabetSelector = document.querySelector(".alphabet-selector");
    const nameListContainer = document.querySelector(".name-list-container");
    const nameList = document.querySelector(".name-list");
    const nameDetailsContainer = document.querySelector(".name-details-container");
    const nameDetailsBox = document.querySelector(".name-details");
    const backBtn = document.querySelector(".back-btn");

    let currentGender = "Boy";
    let currentLetter = "A";
    let allNamesData = []; 

    // A. Generate Alphabet
    function renderAlphabet() {
        alphabetSelector.innerHTML = "";
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        chars.forEach(char => {
            const btn = document.createElement("button");
            btn.className = "alphabet-btn";
            btn.textContent = char;
            if (char === currentLetter) btn.classList.add("active");
            
            btn.addEventListener("click", () => {
                document.querySelectorAll(".alphabet-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentLetter = char;
                filterAndRenderNames();
            });
            alphabetSelector.appendChild(btn);
        });
    }

    // B. FETCH JSON DATA (Real connection)
    async function loadNamesData() {
        nameList.innerHTML = '<div class="spinner"></div><p style="text-align:center">Loading database...</p>';
        try {
            // Fetch both files concurrently
            const [boysRes, girlsRes] = await Promise.all([
                fetch('bnames.json'),
                fetch('gnames.json')
            ]);

            // Check if files exist
            if (!boysRes.ok) console.warn("bnames.json not found");
            if (!girlsRes.ok) console.warn("gnames.json not found");

            // Convert to JSON
            const boysData = boysRes.ok ? await boysRes.json() : [];
            const girlsData = girlsRes.ok ? await girlsRes.json() : [];

            // Add Gender Tag & Merge
            // (Assuming files are arrays: [{name:"Ram", meaning:"God"}, ...])
            const taggedBoys = Array.isArray(boysData) ? boysData.map(i => ({...i, gender: "Boy"})) : [];
            const taggedGirls = Array.isArray(girlsData) ? girlsData.map(i => ({...i, gender: "Girl"})) : [];

            allNamesData = [...taggedBoys, ...taggedGirls];
            
            // Check if data loaded
            if (allNamesData.length === 0) {
                nameList.innerHTML = "<p>No names found in database files.</p>";
            } else {
                filterAndRenderNames();
            }

        } catch (error) {
            console.error("Error loading JSON:", error);
            nameList.innerHTML = "<p>Error loading names. Please run on a server (Live Server).</p>";
        }
    }

    // C. Filter & Render
    function filterAndRenderNames() {
        nameList.innerHTML = "";
        
        // Filter logic
        const filtered = allNamesData.filter(n => {
            const nName = n.name || n.Name; // Handle capital/small keys
            return (n.gender === currentGender) && 
                   (nName && nName.toUpperCase().startsWith(currentLetter));
        });

        if (filtered.length === 0) {
            nameList.innerHTML = `<p style="grid-column:1/-1; text-align:center;">No names found starting with '${currentLetter}'.</p>`;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement("div");
            card.className = "name-item";
            card.innerHTML = `
                <h3 style="margin-bottom:5px;">${item.name || item.Name}</h3>
                <p style="font-size:0.9rem; color:#666;">${(item.meaning || "").substring(0, 30)}...</p>
            `;
            
            // Click -> Calculate Astro Details
            card.addEventListener("click", () => {
                const processed = astroEngine.processName(item);
                showDetailsView(processed);
            });
            
            nameList.appendChild(card);
        });
    }

    // D. Render Details View
    window.renderDetails = function(container, data) {
        container.innerHTML = `
            <div style="text-align:center; margin-bottom:25px;">
                <h2 style="font-size:2.5rem; color:#F97316; margin-bottom:10px;">${data.name}</h2>
                <p style="font-size:1.1rem; color:#333;">"${data.meaning}"</p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px; text-align:left;">
                <div style="background:rgba(139, 92, 246, 0.05); padding:20px; border-radius:15px; border:1px solid rgba(139, 92, 246, 0.2);">
                    <h4 style="color:#8B5CF6; margin-bottom:15px; border-bottom:1px solid #ddd; padding-bottom:5px;">
                        <i class="fas fa-star"></i> Vedic Astrology
                    </h4>
                    <p><strong>Rashi:</strong> ${data.rashi}</p>
                    <p><strong>Nakshatra:</strong> ${data.nakshatra}</p>
                    <p style="margin-top:10px; font-size:0.9rem; color:#555;"><em>"${data.rashiphal}"</em></p>
                </div>

                <div style="background:rgba(249, 115, 22, 0.05); padding:20px; border-radius:15px; border:1px solid rgba(249, 115, 22, 0.2);">
                    <h4 style="color:#F97316; margin-bottom:15px; border-bottom:1px solid #ddd; padding-bottom:5px;">
                        <i class="fas fa-hashtag"></i> Numerology
                    </h4>
                    <p><strong>Destiny Number:</strong> ${data.numerology_number}</p>
                    <p><strong>Lucky Number:</strong> ${data.lucky_number}</p>
                    <p><strong>Ruling Planet:</strong> ${data.planet}</p>
                </div>

                <div style="background:rgba(16, 185, 129, 0.05); padding:20px; border-radius:15px; border:1px solid rgba(16, 185, 129, 0.2); grid-column: 1 / -1;">
                    <h4 style="color:#10B981; margin-bottom:15px; border-bottom:1px solid #ddd; padding-bottom:5px;">
                        <i class="fas fa-clover"></i> Auspicious Factors
                    </h4>
                    <div style="display:flex; justify-content:space-around; flex-wrap:wrap;">
                        <span><strong>Day:</strong> ${data.lucky_day}</span>
                        <span><strong>Color:</strong> <span style="display:inline-block; width:10px; height:10px; background-color:${data.lucky_color.split('/')[0]}; border-radius:50%;"></span> ${data.lucky_color}</span>
                        <span><strong>Trait:</strong> ${data.trait}</span>
                    </div>
                </div>
            </div>
        `;
    };

    function showDetailsView(data) {
        nameListContainer.style.display = "none";
        nameDetailsContainer.style.display = "block";
        renderDetails(nameDetailsBox, data);
    }

    // E. Buttons & Interactions
    if(backBtn) {
        backBtn.addEventListener("click", () => {
            nameDetailsContainer.style.display = "none";
            nameListContainer.style.display = "block";
        });
    }

    genderSelector.querySelectorAll(".gender-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            genderSelector.querySelectorAll(".gender-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentGender = btn.getAttribute("data-gender");
            filterAndRenderNames();
        });
    });

    // Initialize
    renderAlphabet();
    loadNamesData(); // Start fetching
}
