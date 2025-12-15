/* ======================================================
   SCRIPT.JS - CLEAN & CONFLICT FREE
   ====================================================== */

document.body.style.visibility = "visible";
document.body.style.opacity = "1";

// 🌟 ASTRO ENGINE
class AstroEngine {
    constructor() {
        this.numerologyMap = { 'A':1,'I':1,'J':1,'Q':1,'Y':1,'B':2,'K':2,'R':2,'C':3,'G':3,'L':3,'S':3,'D':4,'M':4,'T':4,'E':5,'H':5,'N':5,'X':5,'U':6,'V':6,'W':6,'O':7,'Z':7,'F':8,'P':8 };
        // Rashi Data (Condensed for brevity - same as before)
        this.rashiMap = [
            { rashi_en: "Aries", rashi_hi: "मेष", letters: ["chu","che","cho","la","li","lu","le","lo","a"], nakshatras: ["Ashwini","Bharani"], phal_en: "Courageous", phal_hi: "साहसी", rashiphal_en: "New beginnings.", rashiphal_hi: "नई शुरुआत।" },
            { rashi_en: "Taurus", rashi_hi: "वृषभ", letters: ["i","ee","u","oo","e","o","va","vi"], nakshatras: ["Krittika","Rohini"], phal_en: "Reliable", phal_hi: "विश्वसनीय", rashiphal_en: "Gains likely.", rashiphal_hi: "लाभ संभव।" },
            // ... (Add all other rashis here as per your original file)
             { rashi_en: "Gemini", rashi_hi: "मिथुन", letters: ["ka","ki","ku","gh","ng","ch","ke","ko","ha"], nakshatras: ["Mrigashira","Ardra"], phal_en: "Intelligent talker", phal_hi: "बुद्धिमान वक्ता", rashiphal_en: "Good news coming.", rashiphal_hi: "शुभ समाचार मिलेगा।" },
            { rashi_en: "Cancer", rashi_hi: "कर्क", letters: ["hi","hu","he","ho","da","di","du","de","do"], nakshatras: ["Punarvasu","Pushya"], phal_en: "Emotional & caring", phal_hi: "भावुक और देखभाल करने वाला", rashiphal_en: "Family time best.", rashiphal_hi: "परिवार के साथ समय बिताएं।" },
            { rashi_en: "Leo", rashi_hi: "सिंह", letters: ["ma","mi","mu","me","mo","ta","ti","tu","te"], nakshatras: ["Magha","Purva Phalguni"], phal_en: "Confident king", phal_hi: "आत्मविश्वासी राजा", rashiphal_en: "Success in career.", rashiphal_hi: "करियर में सफलता मिलेगी।" },
            { rashi_en: "Virgo", rashi_hi: "कन्या", letters: ["to","pa","pi","pu","sha","na","th","pe","po"], nakshatras: ["Uttara Phalguni","Hasta"], phal_en: "Practical analyst", phal_hi: "व्यावहारिक विश्लेषक", rashiphal_en: "Health improves.", rashiphal_hi: "स्वास्थ्य में सुधार होगा।" },
            { rashi_en: "Libra", rashi_hi: "तुला", letters: ["ra","ri","ru","re","ro","ta","ti","tu","te"], nakshatras: ["Chitra","Swati"], phal_en: "Balanced diplomat", phal_hi: "संतुलित राजनयिक", rashiphal_en: "Travel planned.", rashiphal_hi: "यात्रा की योजना बनेगी।" },
            { rashi_en: "Scorpio", rashi_hi: "वृश्चिक", letters: ["to","na","ni","nu","ne","no","ya","yi","yu"], nakshatras: ["Vishakha","Anuradha"], phal_en: "Intense mystery", phal_hi: "तीव्र रहस्यमयी", rashiphal_en: "Avoid arguments.", rashiphal_hi: "वाद-विवाद से बचें।" },
            { rashi_en: "Sagittarius", rashi_hi: "धनु", letters: ["ye","yo","bha","bhi","bhu","dha","pha","dha","bhe"], nakshatras: ["Mula","Purva Ashadha"], phal_en: "Optimistic explorer", phal_hi: "आशावादी खोजकर्ता", rashiphal_en: "Luck favors you.", rashiphal_hi: "भाग्य आपका साथ देगा।" },
            { rashi_en: "Capricorn", rashi_hi: "मकर", letters: ["bho","ja","ji","ju","je","jo","kha","ga","gi"], nakshatras: ["Uttara Ashadha","Shravana"], phal_en: "Ambitious worker", phal_hi: "महत्वाकांक्षी कर्मी", rashiphal_en: "Hard work pays off.", rashiphal_hi: "मेहनत रंग लाएगी।" },
            { rashi_en: "Aquarius", rashi_hi: "कुम्भ", letters: ["gu","ge","go","sa","si","su","se","so","da"], nakshatras: ["Dhanishtha","Shatabhisha"], phal_en: "Innovative thinker", phal_hi: "नवीन विचारक", rashiphal_en: "Help a friend.", rashiphal_hi: "मित्र की मदद करेंगे।" },
            { rashi_en: "Pisces", rashi_hi: "मीन", letters: ["di","du","th","jha","yna","de","do","cha","chi"], nakshatras: ["Purva Bhadrapada","Revati"], phal_en: "Dreamy soul", phal_hi: "स्वप्नशील आत्मा", rashiphal_en: "Peace of mind.", rashiphal_hi: "मानसिक शांति मिलेगी।" }
        ];
        
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
            meaning: data.meaning,
            gender: data.gender || "Unknown",
            origin: isHindi ? "भारतीय" : "Indian",
            rashi: isHindi ? rashi.rashi_hi : rashi.rashi_en,
            nakshatra: rashi.nakshatras ? rashi.nakshatras.join(", ") : "",
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
    
    // --- 1. UI: HEADER & MENU ---
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;

    const themeBtn = document.getElementById("theme-toggle");
    if(themeBtn) {
        const saved = localStorage.getItem("theme") || "light";
        document.body.setAttribute("data-theme", saved);
        const icon = themeBtn.querySelector('i');
        if(saved === 'dark') { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
        
        themeBtn.onclick = () => {
            const next = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
            document.body.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
            if(next === 'dark') {
                icon.classList.remove('fa-moon'); icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun'); icon.classList.add('fa-moon');
            }
        };
    }

    const hamburger = document.getElementById("hamburger-menu");
    const nav = document.getElementById("main-nav");
    if(hamburger) {
        hamburger.onclick = (e) => { e.stopPropagation(); nav.classList.toggle("active"); };
        document.onclick = (e) => { if(nav.classList.contains("active") && !nav.contains(e.target)) nav.classList.remove("active"); };
    }

    const scrollBtn = document.getElementById("scrollToTopBtn");
    if (scrollBtn) {
        window.addEventListener("scroll", () => scrollBtn.classList.toggle("show", window.scrollY > 300));
        scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // --- 2. LANGUAGE LOGIC (Safe for Naamin Animation) ---
    let currentGender = "Boy";
    let currentLetter = "A";

    function getLanguage() { return localStorage.getItem("language") || "en"; }

    function updateContent(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        
        // Only update elements that explicitly have data-en/data-hi
        document.querySelectorAll("[data-en]").forEach(el => {
            if(el.hasAttribute(lang === "hi" ? "data-hi" : "data-en")) {
                el.textContent = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            }
        });

        const inp = document.getElementById("hero-search-input");
        if(inp) inp.placeholder = lang === "hi" ? "उदा: आरव, अद्विक..." : "e.g., Aarav, Advik...";
        
        if(document.getElementById('name-finder') && document.querySelector('.name-list-container').style.display === 'block') {
            loadNames(currentGender);
        }
    }

    document.getElementById("language-toggle").onclick = () => {
        updateContent(getLanguage() === "hi" ? "en" : "hi");
    };
    updateContent(getLanguage());

    // --- 3. SHOW DETAILS ---
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
                <p><strong>${L.nakshatra}:</strong> ${data.nakshatra}</p>
                <p><strong>${L.personality}:</strong> ${data.phal}</p>
                <p style="margin-top:10px; background: rgba(0,0,0,0.05); padding:10px; border-radius:8px;"><strong>${L.rashiphalTitle}:</strong><br> ${data.rashiphal}</p>
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
                <h3>${L.numTitle}</h3>
                <p><strong>${L.number}:</strong> ${data.num}</p>
                <p><strong>${L.planet}:</strong> ${data.planet}</p>
                <p><strong>${L.luckyColor}:</strong> ${data.color}</p>
                <p><strong>${L.luckyNos}:</strong> ${data.luckyNumbers}</p>
                <p style="margin-top:10px;"><strong>${L.prediction}:</strong> ${data.numFal}</p>
            </div>
        `;
    }

    // --- 4. SEARCH & LIST LOGIC ---
    async function handleHeroSearch() {
        const input = document.getElementById('hero-search-input');
        if(!input.value.trim()) return;
        const term = input.value.trim().toLowerCase();
        
        const detailsBox = document.querySelector('.name-details');
        const targetSection = document.getElementById('name-finder');
        if(targetSection) window.scrollTo({ top: targetSection.offsetTop - 100, behavior: 'smooth' });
        
        document.querySelector('.name-list-container').style.display = 'none';
        document.querySelector('.name-details-container').style.display = 'block';
        detailsBox.innerHTML = '<div class="spinner">Searching...</div>';

        const lang = getLanguage();
        const langSuffix = lang === 'hi' ? '_hin.json' : '_eng.json';
        const timestamp = new Date().getTime(); 

        try {
            const [b, g] = await Promise.all([
                fetch(`boy_names${langSuffix}?t=${timestamp}`).then(r=>r.json()), 
                fetch(`girl_names${langSuffix}?t=${timestamp}`).then(r=>r.json())
            ]);
            const isHi = lang === 'hi';
            const boys = b.map(i=>({...i, gender: isHi ? 'लड़का' : 'Boy'}));
            const girls = g.map(i=>({...i, gender: isHi ? 'लड़की' : 'Girl'}));
            const all = [...boys, ...girls];
            
            const found = all.find(n => (n.name || n.Name).toLowerCase() === term);
            
            if(found) {
                showDetails(detailsBox, engine.processName(found, lang));
            } else {
                const msg = isHi ? "नाम नहीं मिला।" : "Name Not Found.";
                detailsBox.innerHTML = `<div style="text-align:center; padding:40px;"><h3 style="color:#F97316;">Oops!</h3><p>${msg}</p></div>`;
            }
        } catch(e) { console.error(e); detailsBox.innerHTML="<p>Error.</p>"; }
    }
    
    const sBtn = document.getElementById('hero-search-btn');
    if(sBtn) sBtn.onclick = handleHeroSearch;
    const sInp = document.getElementById('hero-search-input');
    if(sInp) sInp.onkeypress = (e) => { if(e.key==="Enter") handleHeroSearch(); };

    const nameFinderSection = document.getElementById('name-finder');
    if (nameFinderSection) {
        const nameListContainer = document.querySelector('.name-list');
        const nameDetailsBox = document.querySelector('.name-details');
        const genderBtns = document.querySelectorAll('.gender-btn');
        const backBtn = document.querySelector('.back-btn');
        const alphabetContainer = document.querySelector('.alphabet-selector');

        async function loadNames(gender) {
            const lang = getLanguage();
            const prefix = (gender === "Boy") ? "boy_names" : "girl_names";
            const suffix = lang === 'hi' ? '_hin.json' : '_eng.json';
            const timestamp = new Date().getTime();

            try {
                if(nameListContainer) nameListContainer.innerHTML = '<div class="spinner">Loading...</div>';
                const response = await fetch(`${prefix}${suffix}?t=${timestamp}`);
                if (!response.ok) throw new Error("File missing");
                let rawData = await response.json();
                
                const displayGender = (lang === 'hi') ? ((gender === "Boy") ? "लड़का" : "लड़की") : gender;
                let namesData = rawData.map(item => ({ ...item, gender: displayGender }));
                const filtered = namesData.filter(n => (n.name || n.Name).toUpperCase().startsWith(currentLetter));

                nameListContainer.innerHTML = "";
                document.querySelector('.name-list-container').style.display = 'block';
                document.querySelector('.name-details-container').style.display = 'none';

                if (filtered.length === 0) {
                    nameListContainer.innerHTML = `<p style="width:100%; text-align:center;">No names found.</p>`;
                    return;
                }

                filtered.forEach(person => {
                    const div = document.createElement("div");
                    div.className = "name-item";
                    div.textContent = person.name;
                    div.onclick = () => {
                        document.querySelector('.name-list-container').style.display = 'none';
                        document.querySelector('.name-details-container').style.display = 'block';
                        showDetails(nameDetailsBox, engine.processName(person, lang));
                    };
                    nameListContainer.appendChild(div);
                });
            } catch (error) { console.error(error); }
        }

        if(alphabetContainer) {
            alphabetContainer.innerHTML = "";
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
                alphabetContainer.appendChild(btn);
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
            document.querySelector('.name-details-container').style.display = 'none';
            document.querySelector('.name-list-container').style.display = 'block';
        };

        loadNames("Boy");
    }
});
