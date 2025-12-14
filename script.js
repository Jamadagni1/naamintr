/* ======================================================
   SCRIPT.JS - ERROR PROOF VERSION
   ====================================================== */

document.body.style.visibility = "visible";
document.body.style.opacity = "1";

// 🌟 ASTRO ENGINE
class AstroEngine {
    constructor() {
        this.numerologyMap = { 'A':1,'I':1,'J':1,'Q':1,'Y':1,'B':2,'K':2,'R':2,'C':3,'G':3,'L':3,'S':3,'D':4,'M':4,'T':4,'E':5,'H':5,'N':5,'X':5,'U':6,'V':6,'W':6,'O':7,'Z':7,'F':8,'P':8 };
        // (Rashi Map truncated for brevity - same as before)
        this.rashiMap = [
            { rashi_en: "Aries", rashi_hi: "मेष", letters: ["chu","che","cho","la","li","lu","le","lo","a"], nakshatras: ["Ashwini","Bharani","Krittika"], phal_en: "Courageous", phal_hi: "साहसी", rashiphal_en: "Good start.", rashiphal_hi: "नई शुरुआत।" },
            { rashi_en: "Taurus", rashi_hi: "वृषभ", letters: ["i","ee","u","oo","e","o","va","vi","vu","ve","vo"], nakshatras: ["Krittika","Rohini"], phal_en: "Reliable", phal_hi: "विश्वसनीय", rashiphal_en: "Financial gains.", rashiphal_hi: "धन लाभ।" },
            { rashi_en: "Gemini", rashi_hi: "मिथुन", letters: ["ka","ki","ku","gh","ng","ch","ke","ko","ha"], nakshatras: ["Mrigashira"], phal_en: "Smart", phal_hi: "बुद्धिमान", rashiphal_en: "Good news.", rashiphal_hi: "शुभ समाचार।" },
            { rashi_en: "Cancer", rashi_hi: "कर्क", letters: ["hi","hu","he","ho","da","di","du","de","do"], nakshatras: ["Punarvasu"], phal_en: "Caring", phal_hi: "भावुक", rashiphal_en: "Family time.", rashiphal_hi: "परिवार का साथ।" },
            { rashi_en: "Leo", rashi_hi: "सिंह", letters: ["ma","mi","mu","me","mo","ta","ti","tu","te"], nakshatras: ["Magha"], phal_en: "Confident", phal_hi: "आत्मविश्वासी", rashiphal_en: "Success.", rashiphal_hi: "सफलता।" },
            { rashi_en: "Virgo", rashi_hi: "कन्या", letters: ["to","pa","pi","pu","sha","na","th","pe","po"], nakshatras: ["Hasta"], phal_en: "Practical", phal_hi: "व्यावहारिक", rashiphal_en: "Health improves.", rashiphal_hi: "स्वास्थ्य सुधार।" },
            { rashi_en: "Libra", rashi_hi: "तुला", letters: ["ra","ri","ru","re","ro","ta","ti","tu","te"], nakshatras: ["Chitra"], phal_en: "Balanced", phal_hi: "संतुलित", rashiphal_en: "Travel.", rashiphal_hi: "यात्रा।" },
            { rashi_en: "Scorpio", rashi_hi: "वृश्चिक", letters: ["to","na","ni","nu","ne","no","ya","yi","yu"], nakshatras: ["Vishakha"], phal_en: "Intense", phal_hi: "तीव्र", rashiphal_en: "Avoid conflict.", rashiphal_hi: "विवाद से बचें।" },
            { rashi_en: "Sagittarius", rashi_hi: "धनु", letters: ["ye","yo","bha","bhi","bhu","dha","pha","dha","bhe"], nakshatras: ["Mula"], phal_en: "Optimistic", phal_hi: "आशावादी", rashiphal_en: "Luck favors.", rashiphal_hi: "भाग्य साथ।" },
            { rashi_en: "Capricorn", rashi_hi: "मकर", letters: ["bho","ja","ji","ju","je","jo","kha","ga","gi"], nakshatras: ["Shravana"], phal_en: "Ambitious", phal_hi: "महत्वाकांक्षी", rashiphal_en: "Hard work.", rashiphal_hi: "मेहनत।" },
            { rashi_en: "Aquarius", rashi_hi: "कुम्भ", letters: ["gu","ge","go","sa","si","su","se","so","da"], nakshatras: ["Dhanishtha"], phal_en: "Innovative", phal_hi: "नवीन", rashiphal_en: "Help friends.", rashiphal_hi: "मदद।" },
            { rashi_en: "Pisces", rashi_hi: "मीन", letters: ["di","du","th","jha","yna","de","do","cha","chi"], nakshatras: ["Revati"], phal_en: "Dreamy", phal_hi: "स्वप्नशील", rashiphal_en: "Peace.", rashiphal_hi: "शांति।" }
        ];
        this.astroDetails = { 1: { planet_en: "Sun", planet_hi: "सूर्य", color_en: "Gold", color_hi: "सुनहरा", lucky_nos: "1,9", fal_en: "Leader", fal_hi: "नेता" } }; // Simplified default
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
        // 🔥 SMART NAME CHECK: Checks name, Name, NAME
        let safeName = data.name || data.Name || data.NAME;
        if(!safeName) return null;

        // 🔥 SMART MEANING CHECK: Checks meaning, Meaning, meaning_en, meaning_hi
        let safeMeaning = data.meaning || data.Meaning || (lang === 'hi' ? data.meaning_hi : data.meaning_en) || "N/A";

        const num = this.calculateNumerology(safeName);
        const rashi = this.calculateRashi(safeName);
        const astro = this.astroDetails[num] || this.astroDetails[1];
        const isHindi = lang === 'hi';

        return {
            name: safeName,
            meaning: safeMeaning,
            gender: data.gender || "Unknown",
            origin: isHindi ? "भारतीय" : "Indian",
            rashi: isHindi ? rashi.rashi_hi : rashi.rashi_en,
            nakshatra: rashi.nakshatras ? rashi.nakshatras.join(", ") : "",
            phal: isHindi ? rashi.phal_hi : rashi.phal_en,
            rashiphal: isHindi ? rashi.rashiphal_hi : rashi.rashiphal_en,
            num: num,
            planet: isHindi ? (astro.planet_hi || "ग्रह") : (astro.planet_en || "Planet"),
            color: isHindi ? (astro.color_hi || "रंग") : (astro.color_en || "Color"),
            luckyNumbers: astro.lucky_nos || "1, 3, 5",
            numFal: isHindi ? (astro.fal_hi || "सफल") : (astro.fal_en || "Successful"),
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
    
    // --- UTILS ---
    const safeGet = (id) => document.getElementById(id);
    const getLanguage = () => localStorage.getItem("language") || "en";

    // --- LANGUAGE ---
    function updateAppLanguage(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            if(text) el.textContent = text;
        });
        const inp = safeGet("hero-search-input");
        if(inp) inp.placeholder = lang === "hi" ? "उदा: आरव..." : "e.g., Aarav...";
        
        // Reload list if active
        if(safeGet('name-finder') && document.querySelector('.name-list-container').style.display !== 'none') {
            loadNames(currentGender);
        }
    }

    const langBtn = safeGet("language-toggle");
    if(langBtn) langBtn.onclick = () => updateAppLanguage(getLanguage() === "hi" ? "en" : "hi");
    
    updateAppLanguage(getLanguage());

    // --- MOBILE MENU ---
    const hamburger = safeGet("hamburger-menu");
    const nav = safeGet("main-nav");
    if(hamburger) {
        hamburger.onclick = (e) => { e.stopPropagation(); hamburger.classList.toggle("active"); nav.classList.toggle("active"); };
        document.onclick = (e) => { if(nav.classList.contains("active") && !nav.contains(e.target)) { hamburger.classList.remove("active"); nav.classList.remove("active"); }};
    }

    // --- NAME LOADER ---
    let currentGender = "Boy";
    let currentLetter = "A";
    const nameListContainer = document.querySelector('.name-list');
    const nameDetailsBox = document.querySelector('.name-details');

    async function loadNames(gender) {
        if(!nameListContainer) return;

        const lang = getLanguage();
        // File Names MUST Match exactly what you created
        const suffix = lang === 'hi' ? '_hin.json' : '_eng.json';
        const prefix = (gender === "Boy") ? "boy_names" : "girl_names";
        const fileName = prefix + suffix;
        const timestamp = new Date().getTime();

        try {
            nameListContainer.innerHTML = '<div class="spinner" style="width:100%; text-align:center;">Loading...</div>';
            
            const response = await fetch(`${fileName}?t=${timestamp}`);
            if (!response.ok) throw new Error(`Status: ${response.status}`);
            
            let rawData = await response.json();
            
            // Gender Label
            const displayGender = (lang === 'hi') ? ((gender === "Boy") ? "लड़का" : "लड़की") : gender;
            let namesData = rawData.map(item => ({ ...item, gender: displayGender }));

            // Filter
            const filtered = namesData.filter(n => {
                // 🔥 CHECK NAME & NAME
                let nName = n.name || n.Name || n.NAME;
                return nName && nName.toUpperCase().startsWith(currentLetter);
            });

            nameListContainer.innerHTML = "";
            document.querySelector('.name-list-container').style.display = 'block';
            document.querySelector('.name-details-container').style.display = 'none';

            if (filtered.length === 0) {
                nameListContainer.innerHTML = `<p style="width:100%; text-align:center;">No names found starting with ${currentLetter}.</p>`;
                return;
            }

            filtered.forEach(person => {
                const div = document.createElement("div");
                div.className = "name-item";
                // 🔥 DISPLAY NAME SAFELY
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
            // 🔥 SHOW ERROR ON SCREEN
            nameListContainer.innerHTML = `<div style="text-align:center; color:red; padding:20px;">
                <p>Failed to load: ${fileName}</p>
                <small>Please check if file exists in 'public' folder.</small>
            </div>`;
        }
    }

    // --- SEARCH ---
    async function handleHeroSearch() {
        const input = safeGet('hero-search-input');
        if(!input.value.trim()) return;
        const term = input.value.trim().toLowerCase();
        
        const section = safeGet('name-finder');
        if(section) window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });

        document.querySelector('.name-list-container').style.display = 'none';
        document.querySelector('.name-details-container').style.display = 'block';
        nameDetailsBox.innerHTML = '<div class="spinner">Searching...</div>';

        const lang = getLanguage();
        const suffix = lang === 'hi' ? '_hin.json' : '_eng.json';
        const timestamp = new Date().getTime();

        try {
            const [b, g] = await Promise.all([
                fetch(`boy_names${suffix}?t=${timestamp}`).then(r=>r.json()), 
                fetch(`girl_names${suffix}?t=${timestamp}`).then(r=>r.json())
            ]);
            
            const isHi = lang === 'hi';
            const boys = b.map(i=>({...i, gender: isHi ? 'लड़का' : 'Boy'}));
            const girls = g.map(i=>({...i, gender: isHi ? 'लड़की' : 'Girl'}));
            const all = [...boys, ...girls];
            
            const found = all.find(n => (n.name || n.Name || n.NAME).toLowerCase() === term);
            
            if(found) {
                showDetails(nameDetailsBox, engine.processName(found, lang));
            } else {
                const msg = isHi ? "जल्दी आ रहा है..." : "Coming soon...";
                nameDetailsBox.innerHTML = `<div style="text-align:center; padding:40px;"><h3>${isHi?"नाम नहीं मिला":"Not Found"}</h3><p>${msg}</p></div>`;
            }
        } catch(e) { 
            console.error(e); 
            nameDetailsBox.innerHTML=`<p>Search Error. Check files.</p>`; 
        }
    }

    const sBtn = safeGet('hero-search-btn');
    if(sBtn) sBtn.onclick = handleHeroSearch;
    const sInp = safeGet('hero-search-input');
    if(sInp) sInp.onkeypress = (e) => { if(e.key==="Enter") handleHeroSearch(); };

    // --- UI CONTROLS ---
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

    // --- INITIAL CALL ---
    if(safeGet('name-finder')) loadNames("Boy");

    // --- TYPING ---
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
});

// --- RENDER FUNCTION ---
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
