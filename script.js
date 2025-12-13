/* ======================================================
   SCRIPT.JS - FINAL UPGRADED VERSION 
   (Added: Numerology Phal, Lucky Numbers, Rashiphal)
   ====================================================== */

// --- 1. Force Page Visibility ---
document.body.style.visibility = "visible";
document.body.style.opacity = "1";

const GEMINI_API_KEY = ""; // Optional

// ======================================================
// 🌟 ASTRO ENGINE (Calculation Logic)
// ======================================================
class AstroEngine {
    constructor() {
        this.numerologyMap = { 'A':1,'I':1,'J':1,'Q':1,'Y':1,'B':2,'K':2,'R':2,'C':3,'G':3,'L':3,'S':3,'D':4,'M':4,'T':4,'E':5,'H':5,'N':5,'X':5,'U':6,'V':6,'W':6,'O':7,'Z':7,'F':8,'P':8 };
        
        // Added 'rashiphal' (Forecast) for each Rashi
        this.rashiMap = [
            { 
                rashi: "मेष (Aries)", 
                letters: ["chu","che","cho","la","li","lu","le","lo","a"], 
                nakshatras: ["Ashwini","Bharani","Krittika"], 
                phal: "साहसी, ऊर्जावान और नेतृत्व करने वाला।",
                rashiphal: "आज का दिन नई शुरुआत के लिए अच्छा है। अपनी ऊर्जा को सही दिशा में लगाएं। स्वास्थ्य उत्तम रहेगा।" 
            },
            { 
                rashi: "वृषभ (Taurus)", 
                letters: ["i","ee","u","oo","e","o","va","vi","vu","ve","vo"], 
                nakshatras: ["Krittika","Rohini","Mrigashira"], 
                phal: "शांत, विश्वसनीय और कला प्रेमी।",
                rashiphal: "धैर्य बनाए रखें, धन लाभ के योग हैं। परिवार के साथ अच्छा समय बीतेगा।" 
            },
            { 
                rashi: "मिथुन (Gemini)", 
                letters: ["ka","ki","ku","gh","ng","ch","ke","ko","ha"], 
                nakshatras: ["Mrigashira","Ardra","Punarvasu"], 
                phal: "बुद्धिमान, वाचाल और बहुमुखी प्रतिभा वाला।",
                rashiphal: "संचार कौशल से लाभ होगा। किसी पुराने मित्र से मुलाकात हो सकती है।" 
            },
            { 
                rashi: "कर्क (Cancer)", 
                letters: ["hi","hu","he","ho","da","di","du","de","do"], 
                nakshatras: ["Punarvasu","Pushya","Ashlesha"], 
                phal: "भावुक, संवेदनशील और परिवार प्रेमी।",
                rashiphal: "भावनाओं पर काबू रखें। कार्यक्षेत्र में प्रशंसा मिलेगी। माता के स्वास्थ्य का ध्यान रखें।" 
            },
            { 
                rashi: "सिंह (Leo)", 
                letters: ["ma","mi","mu","me","mo","ta","ti","tu","te"], 
                nakshatras: ["Magha","Purva Phalguni","Uttara Phalguni"], 
                phal: "आत्मविश्वासी, उदार और राजा जैसा स्वभाव।",
                rashiphal: "आत्मविश्वास बढ़ा रहेगा। मान-सम्मान में वृद्धि होगी। क्रोध से बचें।" 
            },
            { 
                rashi: "कन्या (Virgo)", 
                letters: ["to","pa","pi","pu","sha","na","th","pe","po"], 
                nakshatras: ["Uttara Phalguni","Hasta","Chitra"], 
                phal: "विश्लेषण करने वाला, व्यावहारिक और मेहनती।",
                rashiphal: "मेहनत का फल मिलेगा। किसी भी दस्तावेज़ पर हस्ताक्षर करने से पहले सोच-विचार कर लें।" 
            },
            { 
                rashi: "तुला (Libra)", 
                letters: ["ra","ri","ru","re","ro","ta","ti","tu","te"], 
                nakshatras: ["Chitra","Swati","Vishakha"], 
                phal: "न्यायप्रिय, संतुलित और मिलनसार।",
                rashiphal: "आज का दिन संतुलन बनाने का है। कला और संगीत में रुचि बढ़ेगी।" 
            },
            { 
                rashi: "वृश्चिक (Scorpio)", 
                letters: ["to","na","ni","nu","ne","no","ya","yi","yu"], 
                nakshatras: ["Vishakha","Anuradha","Jyeshtha"], 
                phal: "तीव्र, रहस्यमयी और दृढ़ निश्चय वाला।",
                rashiphal: "रुके हुए कार्य पूर्ण होंगे। गुप्त शत्रुओं से सावधान रहें।" 
            },
            { 
                rashi: "धनु (Sagittarius)", 
                letters: ["ye","yo","bha","bhi","bhu","dha","pha","dha","bhe"], 
                nakshatras: ["Mula","Purva Ashadha","Uttara Ashadha"], 
                phal: "आशावादी, दार्शनिक और स्वतंत्र।",
                rashiphal: "भाग्य का साथ मिलेगा। धार्मिक कार्यों में रुचि बढ़ेगी। यात्रा के योग हैं।" 
            },
            { 
                rashi: "मकर (Capricorn)", 
                letters: ["bho","ja","ji","ju","je","jo","kha","ga","gi"], 
                nakshatras: ["Uttara Ashadha","Shravana","Dhanishtha"], 
                phal: "महत्वाकांक्षी, अनुशासित और धैर्यवान।",
                rashiphal: "कड़ी मेहनत का समय है। अनुशासन बनाए रखें, सफलता अवश्य मिलेगी।" 
            },
            { 
                rashi: "कुम्भ (Aquarius)", 
                letters: ["gu","ge","go","sa","si","su","se","so","da"], 
                nakshatras: ["Dhanishtha","Shatabhisha","Purva Bhadrapada"], 
                phal: "नवीन सोच वाला, मानवीय और मित्रवत।",
                rashiphal: "नए विचार आएंगे। समाज सेवा में मन लगेगा। मित्रों का सहयोग प्राप्त होगा।" 
            },
            { 
                rashi: "मीन (Pisces)", 
                letters: ["di","du","th","jha","yna","de","do","cha","chi"], 
                nakshatras: ["Purva Bhadrapada","Uttara Bhadrapada","Revati"], 
                phal: "दयालु, आध्यात्मिक और कल्पनाशील।",
                rashiphal: "आध्यात्मिक शांति मिलेगी। खर्चों पर नियंत्रण रखें। दिन शुभ है।" 
            }
        ];

        // Added 'fal' (Prediction) and 'lucky_nos'
        this.astroDetails = {
            1: { planet: "Sun (सूर्य)", color: "Golden", lucky_nos: "1, 2, 3, 9", fal: "आप एक जन्मजात नेता हैं। आप महत्वाकांक्षी और दृढ़ निश्चयी हैं।" },
            2: { planet: "Moon (चन्द्र)", color: "White", lucky_nos: "2, 6, 7", fal: "आप भावुक, कल्पनाशील और शांतिप्रिय हैं। आप दूसरों का ख्याल रखते हैं।" },
            3: { planet: "Jupiter (बृहस्पति)", color: "Yellow", lucky_nos: "1, 3, 5, 9", fal: "आप ज्ञानवान, आशावादी और रचनात्मक हैं। आपका सामाजिक दायरा बड़ा होता है।" },
            4: { planet: "Rahu (राहू)", color: "Blue", lucky_nos: "1, 4, 5, 6", fal: "आप व्यावहारिक, अनुशासित और मेहनती हैं। आप नियमों का पालन करना पसंद करते हैं।" },
            5: { planet: "Mercury (बुध)", color: "Green", lucky_nos: "1, 5, 6", fal: "आप बुद्धिमान, अनुकूलनीय और स्वतंत्रता प्रेमी हैं। आपको बदलाव पसंद है।" },
            6: { planet: "Venus (शुक्र)", color: "Pink", lucky_nos: "3, 6, 9", fal: "आप आकर्षक, जिम्मेदार और परिवार प्रेमी हैं। आपको सुंदरता और विलासिता पसंद है।" },
            7: { planet: "Ketu (केतु)", color: "Multi-color", lucky_nos: "2, 7", fal: "आप विश्लेषणात्मक, आध्यात्मिक और एकांतप्रिय हैं। आप गहरे विचारक हैं।" },
            8: { planet: "Saturn (शनि)", color: "Black", lucky_nos: "1, 4, 8", fal: "आप महत्वाकांक्षी, धैर्यवान और कार्यकुशल हैं। आप जीवन में उच्च पद प्राप्त करते हैं।" },
            9: { planet: "Mars (मंगल)", color: "Red", lucky_nos: "3, 6, 9", fal: "आप ऊर्जावान, साहसी और दयालु हैं। आप चुनौतियों का डटकर सामना करते हैं।" }
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
        let safeName = data.name || data.Name;
        if(!safeName) return null;

        const num = this.calculateNumerology(safeName);
        const rashi = this.calculateRashi(safeName);
        const astro = this.astroDetails[num] || this.astroDetails[1];

        return {
            ...data,
            name: safeName,
            meaning: data.meaning || data.Meaning || "Meaning available in database.",
            gender: data.gender || "Unknown",
            // Rashi Data
            rashi: rashi.rashi,
            nakshatra: rashi.nakshatras.join(", "),
            phal: rashi.phal,
            rashiphal: rashi.rashiphal, // Added
            // Numerology Data
            num: num,
            planet: astro.planet,
            color: astro.color,
            luckyNumbers: astro.lucky_nos, // Added
            numFal: astro.fal // Added
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
        const inp = document.getElementById("hero-search-input");
        if(inp) inp.placeholder = lang === "hi" ? "उदा: आरव..." : "e.g., Aarav...";
    }
    const langBtn = document.getElementById("language-toggle");
    if(langBtn) langBtn.onclick = () => updateContent(localStorage.getItem("language") === "hi" ? "en" : "hi");
    updateContent(localStorage.getItem("language") || "en");

    // --- FIX: Aura Plan Click Logic ---
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
    } else {
        const pricingHeaders = document.querySelectorAll(".pricing-card-header");
        pricingHeaders.forEach(header => {
            header.addEventListener("click", () => {
                const card = header.closest(".pricing-card");
                if(card) card.classList.toggle("expanded");
            });
        });
    }

    // Helper: Show Details UI (UPDATED WITH NEW DATA)
    function showDetails(box, data) {
        if(!box || !data) return;
        
        box.innerHTML = `
            <h2>${data.name}</h2>
            <div class="detail-grid" style="text-align: left; margin-top: 20px;">
                <p><strong>Meaning:</strong> ${data.meaning}</p>
                <p><strong>Gender:</strong> ${data.gender}</p> 
                <p><strong>Origin:</strong> ${data.origin || 'Sanskrit/Indian'}</p>
                
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
                
                <h3>🔮 Vedic Astrology</h3>
                <p><strong>Rashi:</strong> ${data.rashi}</p>
                <p><strong>Nakshatra:</strong> ${data.nakshatra}</p>
                <p><strong>Personality:</strong> ${data.phal}</p>
                <p style="margin-top:10px; background: rgba(0,0,0,0.05); padding:10px; border-radius:8px;">
                    <strong>✨ Rashiphal (Horoscope):</strong><br> ${data.rashiphal}
                </p>
                
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
                
                <h3>🔢 Numerology</h3>
                <p><strong>Number:</strong> ${data.num}</p>
                <p><strong>Planet:</strong> ${data.planet}</p>
                <p><strong>Lucky Color:</strong> ${data.color}</p>
                <p><strong>Lucky Numbers:</strong> ${data.luckyNumbers}</p>
                <p style="margin-top:10px;">
                    <strong>Prediction:</strong> ${data.numFal}
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

                let dataToProcess;
                if(found) {
                    dataToProcess = found;
                } else {
                    let displayTerm = term.charAt(0).toUpperCase() + term.slice(1);
                    dataToProcess = { 
                        name: displayTerm, 
                        meaning: "Auto-Calculated Analysis (Name not in database)", 
                        gender: "Unknown", 
                        origin: "Unknown" 
                    };
                }

                const smartData = engine.processName(dataToProcess);
                showDetails(detailsBox, smartData);

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
                    
                    const smartData = engine.processName(person);
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



