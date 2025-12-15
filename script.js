/* ======================================================
   SCRIPT.JS - UPDATED (Shortlist Feature Added)
   ====================================================== */

document.body.style.visibility = "visible";
document.body.style.opacity = "1";

// 🌟 ASTRO ENGINE (Same as before)
class AstroEngine {
    constructor() {
        this.numerologyMap = { 'A':1,'I':1,'J':1,'Q':1,'Y':1,'B':2,'K':2,'R':2,'C':3,'G':3,'L':3,'S':3,'D':4,'M':4,'T':4,'E':5,'H':5,'N':5,'X':5,'U':6,'V':6,'W':6,'O':7,'Z':7,'F':8,'P':8 };
        
        // 2026 Horoscope Data
        this.rashiMap = [
            { rashi_en: "Aries (Mesh)", rashi_hi: "मेष (Aries)", letters: ["chu","che","cho","la","li","lu","le","lo","a"], nakshatras: ["Ashwini","Bharani","Krittika"], phal_en: "Courageous...", phal_hi: "साहसी...", rashiphal_en: "2026 brings massive career growth...", rashiphal_hi: "2026 करियर में भारी वृद्धि लाएगा..." },
            { rashi_en: "Taurus (Vrishabh)", rashi_hi: "वृषभ (Taurus)", letters: ["i","ee","u","oo","e","o","va","vi","vu","ve","vo"], nakshatras: ["Krittika","Rohini","Mrigashira"], phal_en: "Calm...", phal_hi: "शांत...", rashiphal_en: "Financial stability improves...", rashiphal_hi: "आर्थिक स्थिरता बेहतर होगी..." },
            { rashi_en: "Gemini (Mithun)", rashi_hi: "मिथुन (Gemini)", letters: ["ka","ki","ku","gh","ng","ch","ke","ko","ha"], nakshatras: ["Mrigashira","Ardra","Punarvasu"], phal_en: "Intelligent...", phal_hi: "बुद्धिमान...", rashiphal_en: "Great year for learning...", rashiphal_hi: "सीखने के लिए बेहतरीन वर्ष..." },
            { rashi_en: "Cancer (Kark)", rashi_hi: "कर्क (Cancer)", letters: ["hi","hu","he","ho","da","di","du","de","do"], nakshatras: ["Punarvasu","Pushya","Ashlesha"], phal_en: "Emotional...", phal_hi: "भावुक...", rashiphal_en: "Focus on home and property...", rashiphal_hi: "घर और संपत्ति पर ध्यान..." },
            { rashi_en: "Leo (Simha)", rashi_hi: "सिंह (Leo)", letters: ["ma","mi","mu","me","mo","ta","ti","tu","te"], nakshatras: ["Magha","Purva Phalguni","Uttara Phalguni"], phal_en: "Confident...", phal_hi: "आत्मविश्वासी...", rashiphal_en: "Leadership roles await...", rashiphal_hi: "नेतृत्व की भूमिकाएँ..." },
            { rashi_en: "Virgo (Kanya)", rashi_hi: "कन्या (Virgo)", letters: ["to","pa","pi","pu","sha","na","th","pe","po"], nakshatras: ["Uttara Phalguni","Hasta","Chitra"], phal_en: "Analytical...", phal_hi: "विश्लेषणात्मक...", rashiphal_en: "Hard work pays off...", rashiphal_hi: "मेहनत का फल मिलेगा..." },
            { rashi_en: "Libra (Tula)", rashi_hi: "तुला (Libra)", letters: ["ra","ri","ru","re","ro","ta","ti","tu","te"], nakshatras: ["Chitra","Swati","Vishakha"], phal_en: "Balanced...", phal_hi: "संतुलित...", rashiphal_en: "Balance in partnerships...", rashiphal_hi: "साझेदारी में संतुलन..." },
            { rashi_en: "Scorpio (Vrishchik)", rashi_hi: "वृश्चिक (Scorpio)", letters: ["to","na","ni","nu","ne","no","ya","yi","yu"], nakshatras: ["Vishakha","Anuradha","Jyeshtha"], phal_en: "Intense...", phal_hi: "तीव्र...", rashiphal_en: "Transformative year...", rashiphal_hi: "परिवर्तनकारी वर्ष..." },
            { rashi_en: "Sagittarius (Dhanu)", rashi_hi: "धनु (Sagittarius)", letters: ["ye","yo","bha","bhi","bhu","dha","pha","dha","bhe"], nakshatras: ["Mula","Purva Ashadha","Uttara Ashadha"], phal_en: "Optimistic...", phal_hi: "आशावादी...", rashiphal_en: "Luck favors you...", rashiphal_hi: "भाग्य साथ देगा..." },
            { rashi_en: "Capricorn (Makar)", rashi_hi: "मकर (Capricorn)", letters: ["bho","ja","ji","ju","je","jo","kha","ga","gi"], nakshatras: ["Uttara Ashadha","Shravana","Dhanishtha"], phal_en: "Ambitious...", phal_hi: "महत्वाकांक्षी...", rashiphal_en: "Career goals met...", rashiphal_hi: "करियर लक्ष्य पूरे..." },
            { rashi_en: "Aquarius (Kumbh)", rashi_hi: "कुम्भ (Aquarius)", letters: ["gu","ge","go","sa","si","su","se","so","da"], nakshatras: ["Dhanishtha","Shatabhisha","Purva Bhadrapada"], phal_en: "Innovative...", phal_hi: "नवीन...", rashiphal_en: "Innovation leads to success...", rashiphal_hi: "नवचार से सफलता..." },
            { rashi_en: "Pisces (Meen)", rashi_hi: "मीन (Pisces)", letters: ["di","du","th","jha","yna","de","do","cha","chi"], nakshatras: ["Purva Bhadrapada","Uttara Bhadrapada","Revati"], phal_en: "Compassionate...", phal_hi: "दयालु...", rashiphal_en: "Spiritual peace...", rashiphal_hi: "आध्यात्मिक शांति..." }
        ];

        this.astroDetails = {
            1: { planet_en: "Sun", planet_hi: "सूर्य", color_en: "Golden", color_hi: "सुनहरा", lucky_nos: "1, 2, 3, 9", fal_en: "Leader...", fal_hi: "नेता..." },
            2: { planet_en: "Moon", planet_hi: "चन्द्र", color_en: "White", color_hi: "सफेद", lucky_nos: "2, 6, 7", fal_en: "Emotional...", fal_hi: "भावुक..." },
            3: { planet_en: "Jupiter", planet_hi: "बृहस्पति", color_en: "Yellow", color_hi: "पीला", lucky_nos: "1, 3, 5, 9", fal_en: "Wise...", fal_hi: "ज्ञानी..." },
            4: { planet_en: "Rahu", planet_hi: "राहू", color_en: "Blue", color_hi: "नीला", lucky_nos: "1, 4, 5, 6", fal_en: "Practical...", fal_hi: "व्यावहारिक..." },
            5: { planet_en: "Mercury", planet_hi: "बुध", color_en: "Green", color_hi: "हरा", lucky_nos: "1, 5, 6", fal_en: "Intelligent...", fal_hi: "बुद्धिमान..." },
            6: { planet_en: "Venus", planet_hi: "शुक्र", color_en: "Pink", color_hi: "गुलाबी", lucky_nos: "3, 6, 9", fal_en: "Charming...", fal_hi: "आकर्षक..." },
            7: { planet_en: "Ketu", planet_hi: "केतु", color_en: "Multi", color_hi: "चितकबरा", lucky_nos: "2, 7", fal_en: "Spiritual...", fal_hi: "आध्यात्मिक..." },
            8: { planet_en: "Saturn", planet_hi: "शनि", color_en: "Black", color_hi: "काला", lucky_nos: "1, 4, 8", fal_en: "Ambitious...", fal_hi: "महत्वाकांक्षी..." },
            9: { planet_en: "Mars", planet_hi: "मंगल", color_en: "Red", color_hi: "लाल", lucky_nos: "3, 6, 9", fal_en: "Energetic...", fal_hi: "ऊर्जावान..." }
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

    processName(data, lang) {
        let safeName = data.name || data.Name;
        if(!safeName) return null;

        const num = this.calculateNumerology(safeName);
        const rashi = this.calculateRashi(safeName);
        const astro = this.astroDetails[num] || this.astroDetails[1];
        
        const isHindi = lang === 'hi';

        return {
            ...data,
            name: safeName,
            meaning: data.meaning || (isHindi ? "डेटाबेस में नहीं मिला" : "Meaning not in database"),
            gender: data.gender || "Unknown",
            origin: data.origin || (isHindi ? "संस्कृत/भारतीय" : "Sanskrit/Indian"),
            
            rashi: isHindi ? rashi.rashi_hi : rashi.rashi_en,
            nakshatra: rashi.nakshatras.join(", "),
            phal: isHindi ? rashi.phal_hi : rashi.phal_en,
            rashiphal: isHindi ? rashi.rashiphal_hi : rashi.rashiphal_en,
            
            num: num,
            planet: isHindi ? astro.planet_hi : astro.planet_en,
            color: isHindi ? astro.color_hi : astro.color_en,
            luckyNumbers: astro.lucky_nos,
            numFal: isHindi ? astro.fal_hi : astro.fal_en,
            
            labels: {
                meaning: isHindi ? "अर्थ" : "Meaning",
                gender: isHindi ? "लिंग" : "Gender",
                origin: isHindi ? "मूल" : "Origin",
                vedicTitle: isHindi ? "🔮 वैदिक ज्योतिष" : "🔮 Vedic Astrology",
                rashi: isHindi ? "राशि" : "Rashi",
                nakshatra: isHindi ? "नक्षत्र" : "Nakshatra",
                personality: isHindi ? "2026 भविष्यवाणी" : "2026 Prediction",
                rashiphalTitle: isHindi ? "✨ 2026 राशिफल" : "✨ 2026 Horoscope",
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
let namesData = [];
// --- FAVORITES MANAGER CLASS ---
class FavoritesManager {
    constructor() {
        this.storageKey = 'naamin_favorites_v1';
        this.favorites = this.load();
        this.updateHeaderCount();
    }

    load() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
        this.updateHeaderCount();
    }

    toggle(nameObj) {
        const name = nameObj.name || nameObj.Name;
        const exists = this.favorites.find(item => (item.name || item.Name) === name);
        
        if (exists) {
            this.favorites = this.favorites.filter(item => (item.name || item.Name) !== name);
            return false; // Removed
        } else {
            this.favorites.push(nameObj);
            return true; // Added
        }
    }

    isFavorite(name) {
        return this.favorites.some(item => (item.name || item.Name) === name);
    }

    clear() {
        this.favorites = [];
        this.save();
    }

    updateHeaderCount() {
        const countSpan = document.getElementById('fav-count');
        if (countSpan) countSpan.textContent = this.favorites.length;
    }
}

const favManager = new FavoritesManager();

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

    // Language Handling
    function getLanguage() {
        return localStorage.getItem("language") || "en";
    }

    function updateContent(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            if (text) el.textContent = text;
        });
        const inp = document.getElementById("hero-search-input");
        if(inp) inp.placeholder = lang === "hi" ? "उदा: आरव, अद्विक..." : "e.g., Aarav, Advik...";
    }

    const langBtn = document.getElementById("language-toggle");
    if(langBtn) langBtn.onclick = () => {
        const newLang = getLanguage() === "hi" ? "en" : "hi";
        updateContent(newLang);
    };
    updateContent(getLanguage());

    // --- Aura Plan Click Logic ---
    const pricingSection = document.querySelector('.pricing-grid'); 
    if (pricingSection) {
        pricingSection.addEventListener('click', function(e) {
            const header = e.target.closest('.pricing-card-header');
            if (header) {
                const card = header.closest('.pricing-card');
                if (card) {
                    card.classList.toggle('expanded');
                }
            }
        });
    }

    // Helper: Show Details UI (UPDATED WITH HEART BUTTON)
    function showDetails(box, data) {
        if(!box || !data) return;
        const L = data.labels;
        const isFav = favManager.isFavorite(data.name);
        
        box.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2>${data.name}</h2>
                <button class="card-heart-btn ${isFav ? 'active' : ''}" id="detail-heart-btn">
                    <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="detail-grid" style="text-align: left; margin-top: 20px;">
                <p><strong>${L.meaning}:</strong> ${data.meaning}</p>
                <p><strong>${L.gender}:</strong> ${data.gender}</p> 
                <p><strong>${L.origin}:</strong> ${data.origin}</p>
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
                <h3>${L.vedicTitle}</h3>
                <p><strong>${L.rashi}:</strong> ${data.rashi}</p>
                <p><strong>${L.nakshatra}:</strong> ${data.nakshatra}</p>
                <p><strong>${L.personality}:</strong> ${data.phal}</p>
                <p style="margin-top:10px; background: rgba(0,0,0,0.05); padding:10px; border-radius:8px;">
                    <strong>${L.rashiphalTitle}:</strong><br> ${data.rashiphal}
                </p>
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
                <h3>${L.numTitle}</h3>
                <p><strong>${L.number}:</strong> ${data.num}</p>
                <p><strong>${L.planet}:</strong> ${data.planet}</p>
                <p><strong>${L.luckyColor}:</strong> ${data.color}</p>
                <p><strong>${L.luckyNos}:</strong> ${data.luckyNumbers}</p>
                <p style="margin-top:10px;">
                    <strong>${L.prediction}:</strong> ${data.numFal}
                </p>
            </div>
        `;

        // Add Event Listener to the new heart button inside details
        const hb = document.getElementById('detail-heart-btn');
        if(hb) {
            hb.onclick = (e) => {
                e.stopPropagation();
                const added = favManager.toggle(data); // Pass full data
                favManager.save();
                hb.classList.toggle('active', added);
                hb.querySelector('i').className = added ? 'fas fa-heart' : 'far fa-heart';
                
                // Refresh list if open behind (optional)
                renderNames();
            };
        }
    }

    // === SEARCH LOGIC ===
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
                const bRes = await fetch('bnames.json');
                const gRes = await fetch('gnames.json');
                const bRaw = bRes.ok ? await bRes.json() : [];
                const gRaw = gRes.ok ? await gRes.json() : [];

                const boys = (Array.isArray(bRaw) ? bRaw : Object.values(bRaw).find(v=>Array.isArray(v))||[]).map(item => ({...item, gender: 'Boy'}));
                const girls = (Array.isArray(gRaw) ? gRaw : Object.values(gRaw).find(v=>Array.isArray(v))||[]).map(item => ({...item, gender: 'Girl'}));

                const all = [].concat(boys, girls);
                const found = all.find(n => (n.name || n.Name).toLowerCase() === term);

                if(found) {
                    const smartData = engine.processName(found, getLanguage());
                    showDetails(detailsBox, smartData);
                } else {
                    const isHindi = getLanguage() === 'hi';
                    const msg = isHindi 
                        ? "जल्दी आ रहा है, कृपया प्रतीक्षा करें, हम आपके धैर्य की सराहना करते हैं।"
                        : "Coming soon, please wait, we appreciate your patience.";
                    
                    detailsBox.innerHTML = `
                        <div style="text-align: center; padding: 40px;">
                            <i class="fas fa-hourglass-half" style="font-size: 3rem; color: var(--accent-primary); margin-bottom: 20px;"></i>
                            <h3 style="color: var(--text-dark);">${isHindi ? "परिणाम नहीं मिला" : "No Result Found"}</h3>
                            <p style="font-size: 1.2rem; color: var(--text-medium); margin-top: 10px;">${msg}</p>
                        </div>
                    `;
                }

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

    // === A-Z LIST LOGIC (UPDATED WITH HEARTS) ===
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

                let rawArray = [];
                if (Array.isArray(rawData)) {
                    rawArray = rawData;
                } else {
                    rawArray = Object.values(rawData).find(v => Array.isArray(v)) || [];
                }

                namesData = rawArray.map(item => ({
                    ...item,
                    gender: gender 
                }));

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

        // Updated Render Names to include Heart Icon
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
                const pName = person.name || person.Name;
                const isFav = favManager.isFavorite(pName);
                
                const div = document.createElement("div");
                div.className = "name-item";
                // Structure: Name text + Heart Button
                div.innerHTML = `
                    <span>${pName}</span>
                    <button class="card-heart-btn ${isFav ? 'active' : ''}">
                        <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                `;

                // Card Click -> Open Details
                div.onclick = () => {
                    if(listSection) listSection.style.display = 'none';
                    if(nameDetailsContainer) nameDetailsContainer.style.display = 'block';
                    
                    const smartData = engine.processName(person, getLanguage());
                    showDetails(nameDetailsBox, smartData);
                };

                // Heart Click -> Toggle Save (Stop Propagation prevents opening details)
                const heartBtn = div.querySelector('.card-heart-btn');
                heartBtn.onclick = (e) => {
                    e.stopPropagation();
                    const added = favManager.toggle(person);
                    favManager.save();
                    heartBtn.classList.toggle('active', added);
                    heartBtn.querySelector('i').className = added ? 'fas fa-heart' : 'far fa-heart';
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
            renderNames(); // Re-render to update hearts if changed inside details
        };

        generateAlphabet();
        loadNames("Boy");
    }

    // --- FAVORITES MODAL LOGIC ---
    const favBtn = document.getElementById('fav-view-btn');
    const favOverlay = document.getElementById('fav-overlay');
    const closeFavBtn = document.getElementById('close-fav-btn');
    const clearFavBtn = document.getElementById('clear-fav-btn');
    const favListContainer = document.getElementById('fav-list-container');

    if(favBtn && favOverlay) {
        favBtn.onclick = () => {
            renderFavoritesList();
            favOverlay.style.display = 'flex';
        };

        closeFavBtn.onclick = () => {
            favOverlay.style.display = 'none';
        };

        // Close when clicking outside
        favOverlay.onclick = (e) => {
            if(e.target === favOverlay) favOverlay.style.display = 'none';
        };

        clearFavBtn.onclick = () => {
            if(confirm("Are you sure you want to clear all favorites?")) {
                favManager.clear();
                renderFavoritesList();
                renderNames(); // Update hearts in background list
            }
        };
    }

    function renderFavoritesList() {
        if(!favListContainer) return;
        favListContainer.innerHTML = "";
        const list = favManager.favorites;
        
        if(list.length === 0) {
            favListContainer.innerHTML = '<p style="text-align:center; color:var(--text-medium);">No names saved yet.</p>';
            return;
        }

        list.forEach(item => {
            const name = item.name || item.Name;
            const row = document.createElement('div');
            row.className = 'fav-item-row';
            row.innerHTML = `
                <span>${name}</span>
                <button class="fav-remove-btn"><i class="fas fa-trash"></i></button>
            `;
            
            // Remove item
            row.querySelector('.fav-remove-btn').onclick = (e) => {
                e.stopPropagation();
                favManager.toggle(item);
                favManager.save();
                renderFavoritesList(); // Re-render this list
                renderNames(); // Update background list
            };

            // Click to view details
            row.onclick = () => {
                favOverlay.style.display = 'none'; // Close modal
                
                // Open details logic
                const section = document.getElementById('name-finder');
                const listSection = document.querySelector('.name-list-container');
                const nameDetailsBox = document.querySelector('.name-details');
                const nameDetailsContainer = document.querySelector('.name-details-container');

                if(section) {
                     window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
                     if(listSection) listSection.style.display = 'none';
                     if(nameDetailsContainer) nameDetailsContainer.style.display = 'block';
                     const smartData = engine.processName(item, getLanguage());
                     showDetails(nameDetailsBox, smartData);
                }
            };

            favListContainer.appendChild(row);
        });
    }

    // --- NAAMIN TYPING ANIMATION (GUARANTEED LOOP) ---
    const typeNaam = document.getElementById("type-naam");
    const typeIn = document.getElementById("type-in");
    
    if (typeNaam && typeIn) {
        const text1 = "Naam";
        const text2 = "in";
        const typeSpeed = 200;
        const delayBeforeRestart = 2000; // 2 seconds wait

        const runAnimation = () => {
            typeNaam.textContent = "";
            typeIn.textContent = "";
            
            let i = 0;
            let j = 0;

            const step = () => {
                if (i < text1.length) {
                    typeNaam.textContent += text1.charAt(i);
                    i++;
                    setTimeout(step, typeSpeed);
                } 
                else if (j < text2.length) {
                    typeIn.textContent += text2.charAt(j);
                    j++;
                    setTimeout(step, typeSpeed);
                } 
                else {
                    setTimeout(runAnimation, delayBeforeRestart);
                }
            };
            step();
        };
        runAnimation();
    }
});
