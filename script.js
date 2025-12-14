/* ======================================================
   SCRIPT.JS - FINAL UPDATE (Coming Soon Message for Unknown Names)
   ====================================================== */

document.body.style.visibility = "visible";
document.body.style.opacity = "1";

// 🌟 ASTRO ENGINE
class AstroEngine {
    constructor() {
        this.numerologyMap = { 'A':1,'I':1,'J':1,'Q':1,'Y':1,'B':2,'K':2,'R':2,'C':3,'G':3,'L':3,'S':3,'D':4,'M':4,'T':4,'E':5,'H':5,'N':5,'X':5,'U':6,'V':6,'W':6,'O':7,'Z':7,'F':8,'P':8 };
        
        this.rashiMap = [
            { 
                rashi_en: "Aries (Mesh)", rashi_hi: "मेष (Aries)", 
                letters: ["chu","che","cho","la","li","lu","le","lo","a"], 
                nakshatras: ["Ashwini","Bharani","Krittika"], 
                phal_en: "Courageous, energetic, and a born leader.", 
                phal_hi: "साहसी, ऊर्जावान और नेतृत्व करने वाला।",
                rashiphal_en: "Today is great for new beginnings. Channel your energy wisely. Health will remain excellent.",
                rashiphal_hi: "आज का दिन नई शुरुआत के लिए अच्छा है। अपनी ऊर्जा को सही दिशा में लगाएं। स्वास्थ्य उत्तम रहेगा।" 
            },
            { 
                rashi_en: "Taurus (Vrishabh)", rashi_hi: "वृषभ (Taurus)", 
                letters: ["i","ee","u","oo","e","o","va","vi","vu","ve","vo"], 
                nakshatras: ["Krittika","Rohini","Mrigashira"], 
                phal_en: "Calm, reliable, and lover of arts.", 
                phal_hi: "शांत, विश्वसनीय और कला प्रेमी।",
                rashiphal_en: "Be patient, financial gains are likely. Good time with family.",
                rashiphal_hi: "धैर्य बनाए रखें, धन लाभ के योग हैं। परिवार के साथ अच्छा समय बीतेगा।" 
            },
            { 
                rashi_en: "Gemini (Mithun)", rashi_hi: "मिथुन (Gemini)", 
                letters: ["ka","ki","ku","gh","ng","ch","ke","ko","ha"], 
                nakshatras: ["Mrigashira","Ardra","Punarvasu"], 
                phal_en: "Intelligent, talkative, and versatile.", 
                phal_hi: "बुद्धिमान, वाचाल और बहुमुखी प्रतिभा वाला।",
                rashiphal_en: "Communication skills will bring benefits. You might meet an old friend.",
                rashiphal_hi: "संचार कौशल से लाभ होगा। किसी पुराने मित्र से मुलाकात हो सकती है।" 
            },
            { 
                rashi_en: "Cancer (Kark)", rashi_hi: "कर्क (Cancer)", 
                letters: ["hi","hu","he","ho","da","di","du","de","do"], 
                nakshatras: ["Punarvasu","Pushya","Ashlesha"], 
                phal_en: "Emotional, sensitive, and family-oriented.", 
                phal_hi: "भावुक, संवेदनशील और परिवार प्रेमी।",
                rashiphal_en: "Control your emotions. You will get praise at work. Take care of mother's health.",
                rashiphal_hi: "भावनाओं पर काबू रखें। कार्यक्षेत्र में प्रशंसा मिलेगी। माता के स्वास्थ्य का ध्यान रखें।" 
            },
            { 
                rashi_en: "Leo (Simha)", rashi_hi: "सिंह (Leo)", 
                letters: ["ma","mi","mu","me","mo","ta","ti","tu","te"], 
                nakshatras: ["Magha","Purva Phalguni","Uttara Phalguni"], 
                phal_en: "Confident, generous, and regal nature.", 
                phal_hi: "आत्मविश्वासी, उदार और राजा जैसा स्वभाव।",
                rashiphal_en: "Confidence will be high. Respect and honor will increase. Avoid anger.",
                rashiphal_hi: "आत्मविश्वास बढ़ा रहेगा। मान-सम्मान में वृद्धि होगी। क्रोध से बचें।" 
            },
            { 
                rashi_en: "Virgo (Kanya)", rashi_hi: "कन्या (Virgo)", 
                letters: ["to","pa","pi","pu","sha","na","th","pe","po"], 
                nakshatras: ["Uttara Phalguni","Hasta","Chitra"], 
                phal_en: "Analytical, practical, and hardworking.", 
                phal_hi: "विश्लेषण करने वाला, व्यावहारिक और मेहनती।",
                rashiphal_en: "Hard work will pay off. Think twice before signing any documents.",
                rashiphal_hi: "मेहनत का फल मिलेगा। किसी भी दस्तावेज़ पर हस्ताक्षर करने से पहले सोच-विचार कर लें।" 
            },
            { 
                rashi_en: "Libra (Tula)", rashi_hi: "तुला (Libra)", 
                letters: ["ra","ri","ru","re","ro","ta","ti","tu","te"], 
                nakshatras: ["Chitra","Swati","Vishakha"], 
                phal_en: "Fair, balanced, and social.", 
                phal_hi: "न्यायप्रिय, संतुलित और मिलनसार।",
                rashiphal_en: "Today is for balance. Interest in art and music will increase.",
                rashiphal_hi: "आज का दिन संतुलन बनाने का है। कला और संगीत में रुचि बढ़ेगी।" 
            },
            { 
                rashi_en: "Scorpio (Vrishchik)", rashi_hi: "वृश्चिक (Scorpio)", 
                letters: ["to","na","ni","nu","ne","no","ya","yi","yu"], 
                nakshatras: ["Vishakha","Anuradha","Jyeshtha"], 
                phal_en: "Intense, mysterious, and determined.", 
                phal_hi: "तीव्र, रहस्यमयी और दृढ़ निश्चय वाला।",
                rashiphal_en: "Stalled work will be completed. Beware of secret enemies.",
                rashiphal_hi: "रुके हुए कार्य पूर्ण होंगे। गुप्त शत्रुओं से सावधान रहें।" 
            },
            { 
                rashi_en: "Sagittarius (Dhanu)", rashi_hi: "धनु (Sagittarius)", 
                letters: ["ye","yo","bha","bhi","bhu","dha","pha","dha","bhe"], 
                nakshatras: ["Mula","Purva Ashadha","Uttara Ashadha"], 
                phal_en: "Optimistic, philosophical, and independent.", 
                phal_hi: "आशावादी, दार्शनिक और स्वतंत्र।",
                rashiphal_en: "Luck will favor you. Interest in religious activities. Travel is on the cards.",
                rashiphal_hi: "भाग्य का साथ मिलेगा। धार्मिक कार्यों में रुचि बढ़ेगी। यात्रा के योग हैं।" 
            },
            { 
                rashi_en: "Capricorn (Makar)", rashi_hi: "मकर (Capricorn)", 
                letters: ["bho","ja","ji","ju","je","jo","kha","ga","gi"], 
                nakshatras: ["Uttara Ashadha","Shravana","Dhanishtha"], 
                phal_en: "Ambitious, disciplined, and patient.", 
                phal_hi: "महत्वाकांक्षी, अनुशासित और धैर्यवान।",
                rashiphal_en: "Time for hard work. Maintain discipline, success is certain.",
                rashiphal_hi: "कड़ी मेहनत का समय है। अनुशासन बनाए रखें, सफलता अवश्य मिलेगी।" 
            },
            { 
                rashi_en: "Aquarius (Kumbh)", rashi_hi: "कुम्भ (Aquarius)", 
                letters: ["gu","ge","go","sa","si","su","se","so","da"], 
                nakshatras: ["Dhanishtha","Shatabhisha","Purva Bhadrapada"], 
                phal_en: "Innovative, humanitarian, and friendly.", 
                phal_hi: "नवीन सोच वाला, मानवीय और मित्रवत।",
                rashiphal_en: "New ideas will come. You will enjoy social service. Friends will support you.",
                rashiphal_hi: "नए विचार आएंगे। समाज सेवा में मन लगेगा। मित्रों का सहयोग प्राप्त होगा।" 
            },
            { 
                rashi_en: "Pisces (Meen)", rashi_hi: "मीन (Pisces)", 
                letters: ["di","du","th","jha","yna","de","do","cha","chi"], 
                nakshatras: ["Purva Bhadrapada","Uttara Bhadrapada","Revati"], 
                phal_en: "Compassionate, spiritual, and imaginative.", 
                phal_hi: "दयालु, आध्यात्मिक और कल्पनाशील।",
                rashiphal_en: "Spiritual peace. Control expenses. The day is auspicious.",
                rashiphal_hi: "आध्यात्मिक शांति मिलेगी। खर्चों पर नियंत्रण रखें। दिन शुभ है।" 
            }
        ];

        // Numerology Data
        this.astroDetails = {
            1: { 
                planet_en: "Sun", planet_hi: "सूर्य (Sun)", 
                color_en: "Golden", color_hi: "सुनहरा (Golden)", 
                lucky_nos: "1, 2, 3, 9", 
                fal_en: "You are a born leader. Ambitious and determined.", 
                fal_hi: "आप एक जन्मजात नेता हैं। आप महत्वाकांक्षी और दृढ़ निश्चयी हैं।" 
            },
            2: { 
                planet_en: "Moon", planet_hi: "चन्द्र (Moon)", 
                color_en: "White", color_hi: "सफेद (White)", 
                lucky_nos: "2, 6, 7", 
                fal_en: "You are emotional, imaginative, and peace-loving.", 
                fal_hi: "आप भावुक, कल्पनाशील और शांतिप्रिय हैं। आप दूसरों का ख्याल रखते हैं।" 
            },
            3: { 
                planet_en: "Jupiter", planet_hi: "बृहस्पति (Jupiter)", 
                color_en: "Yellow", color_hi: "पीला (Yellow)", 
                lucky_nos: "1, 3, 5, 9", 
                fal_en: "You are wise, optimistic, and creative.", 
                fal_hi: "आप ज्ञानवान, आशावादी और रचनात्मक हैं। आपका सामाजिक दायरा बड़ा होता है।" 
            },
            4: { 
                planet_en: "Rahu", planet_hi: "राहू (Rahu)", 
                color_en: "Blue", color_hi: "नीला (Blue)", 
                lucky_nos: "1, 4, 5, 6", 
                fal_en: "You are practical, disciplined, and hardworking.", 
                fal_hi: "आप व्यावहारिक, अनुशासित और मेहनती हैं। आप नियमों का पालन करना पसंद करते हैं।" 
            },
            5: { 
                planet_en: "Mercury", planet_hi: "बुध (Mercury)", 
                color_en: "Green", color_hi: "हरा (Green)", 
                lucky_nos: "1, 5, 6", 
                fal_en: "You are intelligent, adaptable, and love freedom.", 
                fal_hi: "आप बुद्धिमान, अनुकूलनीय और स्वतंत्रता प्रेमी हैं। आपको बदलाव पसंद है।" 
            },
            6: { 
                planet_en: "Venus", planet_hi: "शुक्र (Venus)", 
                color_en: "Pink", color_hi: "गुलाबी (Pink)", 
                lucky_nos: "3, 6, 9", 
                fal_en: "You are charming, responsible, and love luxury.", 
                fal_hi: "आप आकर्षक, जिम्मेदार और परिवार प्रेमी हैं। आपको सुंदरता और विलासिता पसंद है।" 
            },
            7: { 
                planet_en: "Ketu", planet_hi: "केतु (Ketu)", 
                color_en: "Multi-color", color_hi: "चितकबरा (Multi)", 
                lucky_nos: "2, 7", 
                fal_en: "You are analytical, spiritual, and introspective.", 
                fal_hi: "आप विश्लेषणात्मक, आध्यात्मिक और एकांतप्रिय हैं। आप गहरे विचारक हैं।" 
            },
            8: { 
                planet_en: "Saturn", planet_hi: "शनि (Saturn)", 
                color_en: "Black", color_hi: "काला (Black)", 
                lucky_nos: "1, 4, 8", 
                fal_en: "You are ambitious, patient, and efficient.", 
                fal_hi: "आप महत्वाकांक्षी, धैर्यवान और कार्यकुशल हैं। आप जीवन में उच्च पद प्राप्त करते हैं।" 
            },
            9: { 
                planet_en: "Mars", planet_hi: "मंगल (Mars)", 
                color_en: "Red", color_hi: "लाल (Red)", 
                lucky_nos: "3, 6, 9", 
                fal_en: "You are energetic, courageous, and compassionate.", 
                fal_hi: "आप ऊर्जावान, साहसी और दयालु हैं। आप चुनौतियों का डटकर सामना करते हैं।" 
            }
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
            
            // Rashi Data
            rashi: isHindi ? rashi.rashi_hi : rashi.rashi_en,
            nakshatra: rashi.nakshatras.join(", "),
            phal: isHindi ? rashi.phal_hi : rashi.phal_en,
            rashiphal: isHindi ? rashi.rashiphal_hi : rashi.rashiphal_en,
            
            // Numerology Data
            num: num,
            planet: isHindi ? astro.planet_hi : astro.planet_en,
            color: isHindi ? astro.color_hi : astro.color_en,
            luckyNumbers: astro.lucky_nos,
            numFal: isHindi ? astro.fal_hi : astro.fal_en,
            
            // Labels for UI
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

    // Helper: Show Details UI
    function showDetails(box, data) {
        if(!box || !data) return;
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
                    // --- NAME NOT FOUND MESSAGE ---
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
                    
                    const smartData = engine.processName(person, getLanguage());
                    showDetails(nameDetailsBox, smartData);
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

    // --- COMING SOON OVERLAY ---
    const featureBtn = document.getElementById('feature-btn-id'); 
    const overlay = document.getElementById('coming-soon-overlay');

    if(featureBtn && overlay) {
        featureBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            overlay.style.display = 'flex'; 
            
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 3000);
        });
    }

    // --- CHATBOT ---
    if(document.getElementById("chatbox")) {
        const btn = document.getElementById("sendBtn");
        const inp = document.getElementById("userInput");
        const box = document.getElementById("chatbox");
        const send = () => {
            if(!inp.value.trim()) return;
            box.innerHTML += `<div class="message user">${inp.value}</div>`;
            inp.value = "";
            box.scrollTop = box.scrollHeight;
            box.innerHTML += `<div class="message bot">For AI chat, please add API Key.</div>`;
        };
        if(btn) btn.onclick = send;
        if(inp) inp.onkeypress = (e) => { if(e.key==="Enter") send(); };
    }
});
