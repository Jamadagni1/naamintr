/* ======================================================
   SCRIPT.JS - FINAL OPTIMIZED VERSION (With Coming Soon)
   ====================================================== */

document.body.style.visibility = "visible";
document.body.style.opacity = "1";

// 🌟 ASTRO ENGINE
class AstroEngine {
    constructor() {
        this.numerologyMap = { 'A':1,'I':1,'J':1,'Q':1,'Y':1,'B':2,'K':2,'R':2,'C':3,'G':3,'L':3,'S':3,'D':4,'M':4,'T':4,'E':5,'H':5,'N':5,'X':5,'U':6,'V':6,'W':6,'O':7,'Z':7,'F':8,'P':8 };
        
        // Rashi Data with Rashiphal
        this.rashiMap = [
            { rashi: "मेष (Aries)", letters: ["chu","che","cho","la","li","lu","le","lo","a"], nakshatras: ["Ashwini","Bharani","Krittika"], phal: "साहसी, ऊर्जावान और नेतृत्व करने वाला।", rashiphal: "आज का दिन नई शुरुआत के लिए अच्छा है। अपनी ऊर्जा को सही दिशा में लगाएं। स्वास्थ्य उत्तम रहेगा।" },
            { rashi: "वृषभ (Taurus)", letters: ["i","ee","u","oo","e","o","va","vi","vu","ve","vo"], nakshatras: ["Krittika","Rohini","Mrigashira"], phal: "शांत, विश्वसनीय और कला प्रेमी।", rashiphal: "धैर्य बनाए रखें, धन लाभ के योग हैं। परिवार के साथ अच्छा समय बीतेगा।" },
            { rashi: "मिथुन (Gemini)", letters: ["ka","ki","ku","gh","ng","ch","ke","ko","ha"], nakshatras: ["Mrigashira","Ardra","Punarvasu"], phal: "बुद्धिमान, वाचाल और बहुमुखी प्रतिभा वाला।", rashiphal: "संचार कौशल से लाभ होगा। किसी पुराने मित्र से मुलाकात हो सकती है।" },
            { rashi: "कर्क (Cancer)", letters: ["hi","hu","he","ho","da","di","du","de","do"], nakshatras: ["Punarvasu","Pushya","Ashlesha"], phal: "भावुक, संवेदनशील और परिवार प्रेमी।", rashiphal: "भावनाओं पर काबू रखें। कार्यक्षेत्र में प्रशंसा मिलेगी। माता के स्वास्थ्य का ध्यान रखें।" },
            { rashi: "सिंह (Leo)", letters: ["ma","mi","mu","me","mo","ta","ti","tu","te"], nakshatras: ["Magha","Purva Phalguni","Uttara Phalguni"], phal: "आत्मविश्वासी, उदार और राजा जैसा स्वभाव।", rashiphal: "आत्मविश्वास बढ़ा रहेगा। मान-सम्मान में वृद्धि होगी। क्रोध से बचें।" },
            { rashi: "कन्या (Virgo)", letters: ["to","pa","pi","pu","sha","na","th","pe","po"], nakshatras: ["Uttara Phalguni","Hasta","Chitra"], phal: "विश्लेषण करने वाला, व्यावहारिक और मेहनती।", rashiphal: "मेहनत का फल मिलेगा। किसी भी दस्तावेज़ पर हस्ताक्षर करने से पहले सोच-विचार कर लें।" },
            { rashi: "तुला (Libra)", letters: ["ra","ri","ru","re","ro","ta","ti","tu","te"], nakshatras: ["Chitra","Swati","Vishakha"], phal: "न्यायप्रिय, संतुलित और मिलनसार।", rashiphal: "आज का दिन संतुलन बनाने का है। कला और संगीत में रुचि बढ़ेगी।" },
            { rashi: "वृश्चिक (Scorpio)", letters: ["to","na","ni","nu","ne","no","ya","yi","yu"], nakshatras: ["Vishakha","Anuradha","Jyeshtha"], phal: "तीव्र, रहस्यमयी और दृढ़ निश्चय वाला।", rashiphal: "रुके हुए कार्य पूर्ण होंगे। गुप्त शत्रुओं से सावधान रहें।" },
            { rashi: "धनु (Sagittarius)", letters: ["ye","yo","bha","bhi","bhu","dha","pha","dha","bhe"], nakshatras: ["Mula","Purva Ashadha","Uttara Ashadha"], phal: "आशावादी, दार्शनिक और स्वतंत्र।", rashiphal: "भाग्य का साथ मिलेगा। धार्मिक कार्यों में रुचि बढ़ेगी। यात्रा के योग हैं।" },
            { rashi: "मकर (Capricorn)", letters: ["bho","ja","ji","ju","je","jo","kha","ga","gi"], nakshatras: ["Uttara Ashadha","Shravana","Dhanishtha"], phal: "महत्वाकांक्षी, अनुशासित और धैर्यवान।", rashiphal: "कड़ी मेहनत का समय है। अनुशासन बनाए रखें, सफलता अवश्य मिलेगी।" },
            { rashi: "कुम्भ (Aquarius)", letters: ["gu","ge","go","sa","si","su","se","so","da"], nakshatras: ["Dhanishtha","Shatabhisha","Purva Bhadrapada"], phal: "नवीन सोच वाला, मानवीय और मित्रवत।", rashiphal: "नए विचार आएंगे। समाज सेवा में मन लगेगा। मित्रों का सहयोग प्राप्त होगा।" },
            { rashi: "मीन (Pisces)", letters: ["di","du","th","jha","yna","de","do","cha","chi"], nakshatras: ["Purva Bhadrapada","Uttara Bhadrapada","Revati"], phal: "दयालु, आध्यात्मिक और कल्पनाशील।", rashiphal: "आध्यात्मिक शांति मिलेगी। खर्चों पर नियंत्रण रखें। दिन शुभ है।" }
        ];

        // Numerology Data
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
        let total=0, clean=name.toUpperCase().replace(/[^A-Z]/g,'');
        for(let c of clean) total+=this.numerologyMap[c]||0;
        while(total>9){ let s=0; while(total>0){s+=total%10; total=Math.floor(total/10);} total=s; }
        return total||1;
    }
    calculateRashi(name) {
        if(!name) return this.rashiMap[0];
        let n=name.toLowerCase().trim();
        for(let r of this.rashiMap){ for(let l of r.letters) if(n.startsWith(l)) return r; }
        return this.rashiMap[0];
    }
    processName(data) {
        let safeName = data.name || data.Name;
        if(!safeName) return null;
        const num = this.calculateNumerology(safeName);
        const rashi = this.calculateRashi(safeName);
        const astro = this.astroDetails[num] || this.astroDetails[1];
        return {
            ...data, name: safeName, meaning: data.meaning || "Meaning available in database.",
            gender: data.gender || "Unknown",
            rashi: rashi.rashi, nakshatra: rashi.nakshatras.join(", "), phal: rashi.phal, rashiphal: rashi.rashiphal,
            num: num, planet: astro.planet, color: astro.color, luckyNumbers: astro.lucky_nos, numFal: astro.fal
        };
    }
}

const engine = new AstroEngine();

document.addEventListener("DOMContentLoaded", () => {
    // Typing Effect
    const typeElement = document.getElementById("naamin-main-title-typing");
    if (typeElement) {
        const text = "Naamin"; let i = 0;
        (function type() {
            typeElement.innerHTML = `<span class="header-naam">${text.slice(0, 4)}</span><span class="header-in">${text.slice(4, i++)}</span>`;
            if (i <= text.length) setTimeout(type, 150); else setTimeout(() => { i = 0; type(); }, 3000);
        })();
    }

    // Theme Toggle
    const themeBtn = document.getElementById("theme-toggle");
    if(themeBtn) {
        const saved = localStorage.getItem("theme") || "light";
        document.body.setAttribute("data-theme", saved);
        themeBtn.onclick = () => {
            const next = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
            document.body.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
        };
    }

    // Mobile Menu
    const hamburger = document.getElementById("hamburger-menu");
    const nav = document.querySelector(".nav-links");
    if(hamburger) {
        hamburger.onclick = (e) => { e.stopPropagation(); nav.classList.toggle("active"); };
        document.onclick = (e) => { if(nav.classList.contains("active") && !nav.contains(e.target)) nav.classList.remove("active"); };
    }

    // Scroll Top
    const scrollBtn = document.getElementById("scrollToTopBtn");
    window.addEventListener("scroll", () => scrollBtn.classList.toggle("show", window.scrollY > 300));
    scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

    // Show Details UI
    function showDetails(box, data) {
        if(!box || !data) return;
        box.innerHTML = `
            <h2>${data.name}</h2>
            <div class="detail-grid">
                <p><strong>Meaning:</strong> ${data.meaning}</p>
                <p><strong>Gender:</strong> ${data.gender}</p>
                <p><strong>Origin:</strong> ${data.origin || 'Sanskrit/Indian'}</p>
                <hr><h3>🔮 Vedic Astrology</h3>
                <p><strong>Rashi:</strong> ${data.rashi}</p>
                <p><strong>Nakshatra:</strong> ${data.nakshatra}</p>
                <p><strong>Personality:</strong> ${data.phal}</p>
                <p style="margin-top:10px; background: rgba(0,0,0,0.05); padding:10px; border-radius:8px;">
                    <strong>✨ Rashiphal:</strong> ${data.rashiphal}
                </p>
                <hr><h3>🔢 Numerology</h3>
                <p><strong>Number:</strong> ${data.num}</p>
                <p><strong>Planet:</strong> ${data.planet}</p>
                <p><strong>Lucky Color:</strong> ${data.color}</p>
                <p><strong>Lucky Numbers:</strong> ${data.luckyNumbers}</p>
                <p style="margin-top:10px;"><strong>Prediction:</strong> ${data.numFal}</p>
            </div>`;
    }

    // Search
    async function handleSearch() {
        const input = document.getElementById('hero-search-input');
        if(!input.value.trim()) return;
        const term = input.value.trim().toLowerCase();
        const section = document.getElementById('name-finder');
        
        window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
        document.querySelector('.name-list-container').style.display = 'none';
        document.querySelector('.name-details-container').style.display = 'block';
        
        try {
            const [b, g] = await Promise.all([fetch('bnames.json').then(r=>r.json()), fetch('gnames.json').then(r=>r.json())]);
            const boys = (Array.isArray(b)?b:Object.values(b).find(v=>Array.isArray(v))||[]).map(i=>({...i, gender:'Boy'}));
            const girls = (Array.isArray(g)?g:Object.values(g).find(v=>Array.isArray(v))||[]).map(i=>({...i, gender:'Girl'}));
            const all = [...boys, ...girls];
            
            const found = all.find(n => (n.name || n.Name).toLowerCase() === term);
            const data = found ? found : { name: term, meaning: "Not in DB (Auto-Analysis)", gender: "Unknown" };
            
            showDetails(document.querySelector('.name-details'), engine.processName(data));
        } catch(e) { console.error(e); }
    }
    document.getElementById('hero-search-btn').onclick = handleSearch;

    // A-Z List
    let currentGender = "Boy";
    let currentLetter = "A";
    
    async function loadNames(gender) {
        try {
            const res = await fetch(gender === "Boy" ? 'bnames.json' : 'gnames.json');
            const raw = await res.json();
            const list = Array.isArray(raw) ? raw : Object.values(raw).find(v=>Array.isArray(v))||[];
            
            const container = document.querySelector('.name-list');
            container.innerHTML = "";
            document.querySelector('.name-list-container').style.display = 'block';
            document.querySelector('.name-details-container').style.display = 'none';

            list.filter(n => (n.name || n.Name).toUpperCase().startsWith(currentLetter)).forEach(p => {
                const div = document.createElement("div");
                div.className = "name-item";
                div.textContent = p.name || p.Name;
                div.onclick = () => {
                    document.querySelector('.name-list-container').style.display = 'none';
                    document.querySelector('.name-details-container').style.display = 'block';
                    showDetails(document.querySelector('.name-details'), engine.processName({...p, gender: gender}));
                };
                container.appendChild(div);
            });
        } catch(e) { console.log(e); }
    }

    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGender = btn.dataset.gender;
            loadNames(currentGender);
        };
    });

    const alphaBox = document.querySelector('.alphabet-selector');
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(char => {
        const btn = document.createElement("button");
        btn.className = `alphabet-btn ${char==='A'?'active':''}`;
        btn.textContent = char;
        btn.onclick = () => {
            document.querySelectorAll('.alphabet-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLetter = char;
            loadNames(currentGender);
        };
        alphaBox.appendChild(btn);
    });

    document.querySelector('.back-btn').onclick = () => {
        document.querySelector('.name-details-container').style.display = 'none';
        document.querySelector('.name-list-container').style.display = 'block';
    };

    loadNames("Boy");

    // --- COMING SOON LOGIC ---
    // (Aap apne hisab se 'feature-btn-id' ko kisi asli button ki ID se replace karein)
    const featureBtn = document.getElementById('feature-btn-id'); 
    const overlay = document.getElementById('coming-soon-overlay');

    if(featureBtn && overlay) {
        featureBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Agar link ho to page reload na ho
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
