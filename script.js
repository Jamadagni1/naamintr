/* ======================================================
   SCRIPT.JS - (With Safety Backup Mode)
   ====================================================== */

const GEMINI_API_KEY = ""; // Optional: Add API Key for Chatbot

// ======================================================
// 1. ASTRO ENGINE (Logic Core)
// ======================================================
class AstroEngine {
    constructor() {
        this.numerologyMap = { 'A':1,'I':1,'J':1,'Q':1,'Y':1,'B':2,'K':2,'R':2,'C':3,'G':3,'L':3,'S':3,'D':4,'M':4,'T':4,'E':5,'H':5,'N':5,'X':5,'U':6,'V':6,'W':6,'O':7,'Z':7,'F':8,'P':8 };
        
        this.rashiMap = [
            { rashi: "मेष (Aries)", sounds: ["chu","che","cho","la","li","lu","le","lo","a"], nakshatra: "Ashwini / Bharani", phal: "साहसी, ऊर्जावान" },
            { rashi: "वृषभ (Taurus)", sounds: ["i","ee","u","oo","e","o","va","vi","vu","ve","vo"], nakshatra: "Krittika / Rohini", phal: "शांत, विश्वसनीय" },
            { rashi: "मिथुन (Gemini)", sounds: ["ka","ki","ku","gh","ng","ch","ke","ko","ha"], nakshatra: "Mrigashira / Ardra", phal: "बुद्धिमान, वाचाल" },
            { rashi: "कर्क (Cancer)", sounds: ["hi","hu","he","ho","da","di","du","de","do"], nakshatra: "Punarvasu / Pushya", phal: "भावुक, संवेदनशील" },
            { rashi: "सिंह (Leo)", sounds: ["ma","mi","mu","me","mo","ta","ti","tu","te"], nakshatra: "Magha / P. Phalguni", phal: "आत्मविश्वासी, उदार" },
            { rashi: "कन्या (Virgo)", sounds: ["to","pa","pi","pu","sha","na","th","pe","po"], nakshatra: "Uttara Phalguni / Hasta", phal: "व्यावहारिक, विश्लेषक" },
            { rashi: "तुला (Libra)", sounds: ["ra","ri","ru","re","ro","ta","ti","tu","te"], nakshatra: "Chitra / Swati", phal: "न्यायप्रिय, संतुलित" },
            { rashi: "वृश्चिक (Scorpio)", sounds: ["to","na","ni","nu","ne","no","ya","yi","yu"], nakshatra: "Vishakha / Anuradha", phal: "तीव्र, रहस्यमयी" },
            { rashi: "धनु (Sagittarius)", sounds: ["ye","yo","bha","bhi","bhu","dha","pha","dha","bhe"], nakshatra: "Mula / P. Ashadha", phal: "आशावादी, दार्शनिक" },
            { rashi: "मकर (Capricorn)", sounds: ["bho","ja","ji","ju","je","jo","kha","ga","gi"], nakshatra: "U. Ashadha / Shravana", phal: "महत्वाकांक्षी, धैर्यवान" },
            { rashi: "कुम्भ (Aquarius)", sounds: ["gu","ge","go","sa","si","su","se","so","da"], nakshatra: "Dhanishtha / Shatabhisha", phal: "नवीन सोच, मित्रवत" },
            { rashi: "मीन (Pisces)", sounds: ["di","du","th","jha","yna","de","do","cha","chi"], nakshatra: "P. Bhadrapada / Revati", phal: "दयालु, आध्यात्मिक" }
        ];

        this.numerologyDetails = {
            1: { planet: "Sun", color: "Golden", day: "Sunday" }, 2: { planet: "Moon", color: "White", day: "Monday" },
            3: { planet: "Jupiter", color: "Yellow", day: "Thursday" }, 4: { planet: "Rahu", color: "Blue", day: "Saturday" },
            5: { planet: "Mercury", color: "Green", day: "Wednesday" }, 6: { planet: "Venus", color: "Pink", day: "Friday" },
            7: { planet: "Ketu", color: "Multi", day: "Tuesday" }, 8: { planet: "Saturn", color: "Black", day: "Saturday" },
            9: { planet: "Mars", color: "Red", day: "Tuesday" }
        };
    }

    calculateNumerology(name) {
        if (!name) return 1;
        let cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
        let total = 0;
        for (let char of cleanName) total += this.numerologyMap[char] || 0;
        while (total > 9) { let s = 0; while (total > 0) { s += total % 10; total = Math.floor(total / 10); } total = s; }
        return total || 1;
    }

    calculateRashi(name) {
        if (!name) return this.rashiMap[0];
        let n = name.toLowerCase().trim();
        for (let r of this.rashiMap) {
            for (let sound of r.sounds) { if (n.startsWith(sound)) return r; }
        }
        return this.rashiMap.find(r => r.sounds.includes(n.charAt(0))) || this.rashiMap[0];
    }

    processName(nameData) {
        const safeName = nameData.name || nameData.Name; 
        const num = this.calculateNumerology(safeName);
        const rashiData = this.calculateRashi(safeName);
        const numData = this.numerologyDetails[num];

        return {
            name: safeName,
            meaning: nameData.meaning || "Meaning available in report",
            gender: nameData.gender || "Unknown",
            rashi: rashiData.rashi, nakshatra: rashiData.nakshatra, rashiphal: rashiData.phal,
            numerology_number: num, planet: numData.planet, lucky_color: numData.color, lucky_day: numData.day
        };
    }
}
const astroEngine = new AstroEngine();

// ======================================================
// 2. UI UTILITIES
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
    // FORCE REMOVE PRELOADER
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Remove quickly
        setTimeout(() => { preloader.style.opacity = '0'; preloader.style.pointerEvents = 'none'; }, 500);
        setTimeout(() => { preloader.style.display = 'none'; }, 1000);
    }

    // Header Padding
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;

    // Mobile Menu
    const hamburger = document.getElementById("hamburger-menu");
    const nav = document.getElementById("main-nav");
    if (hamburger && nav) {
        hamburger.onclick = (e) => { e.stopPropagation(); hamburger.classList.toggle("active"); nav.classList.toggle("active"); };
        document.onclick = (e) => { if (!nav.contains(e.target) && !hamburger.contains(e.target)) { hamburger.classList.remove("active"); nav.classList.remove("active"); } };
    }

    // Initialize Components
    if (document.getElementById("name-finder")) initNameFinder();
    
    // Typing Effect
    const typeEl = document.getElementById("naamin-main-title-typing");
    if(typeEl) {
        let txt = "Naamin", i=0;
        (function type(){ typeEl.innerHTML=`<span class="naamin-naam">${txt.slice(0,4)}</span><span class="naamin-in">${txt.slice(4,i++)}</span>`; if(i<=txt.length)setTimeout(type,150); })();
    }
});

// ======================================================
// 3. NAME FINDER LOGIC (With Safety Backup)
// ======================================================
function initNameFinder() {
    const genderSelector = document.querySelector(".gender-selector");
    const alphabetSelector = document.querySelector(".alphabet-selector");
    const nameList = document.querySelector(".name-list"); 
    const nameDetailsContainer = document.querySelector(".name-details-container");
    const nameDetailsBox = document.querySelector(".name-details");
    const backBtn = document.querySelector(".back-btn");
    const listContainer = document.querySelector(".name-list-container");

    let currentGender = "Boy";
    let currentLetter = "A";
    let allNamesData = []; 

    // --- A. Render Alphabet ---
    alphabetSelector.innerHTML = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    chars.forEach(char => {
        const btn = document.createElement("button");
        btn.className = "alphabet-btn";
        btn.textContent = char;
        if (char === currentLetter) btn.classList.add("active");
        btn.onclick = () => {
            document.querySelectorAll(".alphabet-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentLetter = char;
            filterAndRenderNames();
        };
        alphabetSelector.appendChild(btn);
    });

    // --- B. Load Data (JSON or Backup) ---
    async function loadNamesData() {
        nameList.innerHTML = '<p style="text-align:center;">Loading database...</p>';
        
        try {
            // Try fetching files
            const [bRes, gRes] = await Promise.all([
                fetch('bnames.json'),
                fetch('gnames.json')
            ]);

            if (bRes.ok && gRes.ok) {
                const bData = await bRes.json();
                const gData = await gRes.json();
                // Merge and tag gender
                const bTagged = (Array.isArray(bData) ? bData : []).map(i => ({...i, gender: "Boy"}));
                const gTagged = (Array.isArray(gData) ? gData : []).map(i => ({...i, gender: "Girl"}));
                allNamesData = [...bTagged, ...gTagged];
                console.log("JSON loaded successfully");
            } else {
                throw new Error("Files not found");
            }
        } catch (error) {
            console.warn("JSON load failed (likely CORS or missing files). Using BACKUP DATA.");
            // --- BACKUP DATA (So page is never blank) ---
            allNamesData = [
                {name: "Aarav", meaning: "Peaceful", gender: "Boy"},
                {name: "Advik", meaning: "Unique", gender: "Boy"},
                {name: "Bhavya", meaning: "Grand", gender: "Boy"},
                {name: "Chirag", meaning: "Lamp", gender: "Boy"},
                {name: "Aadya", meaning: "First Power", gender: "Girl"},
                {name: "Bhumika", meaning: "Earth", gender: "Girl"},
                {name: "Chhaya", meaning: "Shadow", gender: "Girl"},
                {name: "Diya", meaning: "Light", gender: "Girl"}
            ];
        }
        
        filterAndRenderNames();
    }

    // --- C. Filter & Render List ---
    function filterAndRenderNames() {
        nameList.innerHTML = "";
        const filtered = allNamesData.filter(n => {
            const nName = n.name || n.Name;
            return (n.gender === currentGender) && (nName && nName.toUpperCase().startsWith(currentLetter));
        });

        if (filtered.length === 0) {
            nameList.innerHTML = `<p style="grid-column:1/-1; text-align:center;">No names found for '${currentLetter}'. <br><small>Add more names to JSON file.</small></p>`;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement("div");
            card.className = "name-item";
            card.innerHTML = `<h3>${item.name || item.Name}</h3><p>${(item.meaning || "").substring(0, 30)}...</p>`;
            card.onclick = () => {
                const processed = astroEngine.processName(item);
                showDetailsView(processed);
            };
            nameList.appendChild(card);
        });
    }

    // --- D. Show Details View ---
    function showDetailsView(data) {
        listContainer.style.display = "none";
        nameDetailsContainer.style.display = "block";
        nameDetailsBox.innerHTML = `
            <div style="text-align:center; margin-bottom:20px;">
                <h2 style="font-size:2.5rem; color:#F97316;">${data.name}</h2>
                <p style="font-size:1.1rem; color:#555;">"${data.meaning}"</p>
            </div>
            <div style="display:grid; gap:15px; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
                <div style="background:#f0f4ff; padding:15px; border-radius:10px; border:1px solid #dbeafe;">
                    <h4 style="color:#4F46E5; margin-bottom:10px;">🔮 Vedic Astrology</h4>
                    <p><strong>Rashi:</strong> ${data.rashi}</p>
                    <p><strong>Nakshatra:</strong> ${data.nakshatra}</p>
                    <p style="font-size:0.9rem; margin-top:5px;"><em>${data.rashiphal}</em></p>
                </div>
                <div style="background:#fff7ed; padding:15px; border-radius:10px; border:1px solid #ffedd5;">
                    <h4 style="color:#ea580c; margin-bottom:10px;">🔢 Numerology</h4>
                    <p><strong>Number:</strong> ${data.numerology_number}</p>
                    <p><strong>Planet:</strong> ${data.planet}</p>
                    <p><strong>Color:</strong> ${data.lucky_color}</p>
                </div>
            </div>
        `;
    }

    // Events
    if(backBtn) backBtn.onclick = () => { nameDetailsContainer.style.display = "none"; listContainer.style.display = "block"; };
    
    genderSelector.querySelectorAll(".gender-btn").forEach(btn => {
        btn.onclick = () => {
            genderSelector.querySelectorAll(".gender-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentGender = btn.dataset.gender;
            filterAndRenderNames();
        };
    });

    // START
    loadNamesData();
}
