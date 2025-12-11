// ======================================================
// ⚠️ IMPORTANT: APNI API KEY YAHAN PASTE KAREIN
// ======================================================
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 


/* =========================================
   GLOBAL VARIABLES
   ========================================= */
let namesData = []; // JSON data yahan store hoga

/* =========================================
   1. HERO SEARCH (Uses Gemini API)
   ========================================= */
async function handleHeroSearch() {
    const heroInput = document.getElementById('hero-search-input');
    if (!heroInput) return;
    const nameToSearch = heroInput.value.trim();
    if (!nameToSearch) return;

    // Name Finder section par le jayen
    const nameFinderSection = document.getElementById('name-finder');
    const nameDetails = document.querySelector('.name-details');
    const nameDetailsContainer = document.querySelector('.name-details-container');
    const nameListContainer = document.querySelector('.name-list-container');
    
    if (nameFinderSection) {
        const header = document.querySelector('header');
        const offsetPosition = nameFinderSection.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0) - 20;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

        // UI Update
        nameListContainer.style.display = 'none';
        nameDetailsContainer.style.display = 'block';
        nameDetails.innerHTML = '<div class="spinner">Processing...</div>';

        // API Call
        const lang = document.documentElement.lang === 'hi' ? 'Hindi' : 'English';
        const prompt = `Provide a short, beautiful description for the Indian name '${nameToSearch}'. Respond in ${lang}.`;

        try {
            if (!GEMINI_API_KEY) throw new Error("API Key missing");
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const result = await response.json();
            const detailsText = result.candidates?.[0]?.content?.parts?.[0]?.text || "No details found.";

            nameDetails.innerHTML = `
                <h2>${nameToSearch}</h2>
                <p>${detailsText.replace(/\n/g, "<br>")}</p>
            `;
        } catch (error) {
            console.error("API Error:", error);
            nameDetails.innerHTML = `<h2>${nameToSearch}</h2><p>Could not fetch details. Please check API Key.</p>`;
        }
    }
}

/* =========================================
   2. MAIN INITIALIZATION
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
    
    // Header padding adjustment
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;

    // Typing Effect
    const typeElement = document.getElementById("naamin-main-title-typing");
    if (typeElement) {
        const text = "Naamin";
        let i = 0;
        (function type() {
            typeElement.innerHTML = `<span class="naamin-naam">${text.slice(0, 4)}</span><span class="naamin-in">${text.slice(4, i++)}</span>`;
            if (i <= text.length) setTimeout(type, 150);
            else setTimeout(() => { i = 0; type(); }, 3000);
        })();
    }

    // Theme & Language
    const setTheme = (t) => {
        document.body.setAttribute("data-theme", t);
        localStorage.setItem("theme", t);
        const btn = document.getElementById("theme-toggle");
        if(btn) btn.innerHTML = t === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };
    setTheme(localStorage.getItem("theme") || "light");
    document.getElementById("theme-toggle")?.addEventListener("click", () => setTheme(document.body.getAttribute("data-theme") === "dark" ? "light" : "dark"));

    // Mobile Menu
    const hamburger = document.getElementById("hamburger-menu");
    const nav = document.getElementById("main-nav");
    if(hamburger && nav) {
        hamburger.addEventListener("click", () => { hamburger.classList.toggle("active"); nav.classList.toggle("active"); });
    }

    // Search Listeners
    document.getElementById('hero-search-btn')?.addEventListener('click', handleHeroSearch);
    document.getElementById('hero-search-input')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleHeroSearch(); });

    /* =========================================
       3. NAME FINDER (JSON FILE BASED)
       ========================================= */
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

        // JSON Loader
        async function loadNames(gender) {
            const fileName = (gender === "Boy") ? "bnames.json" : "gnames.json";
            try {
                nameListContainer.innerHTML = '<div class="spinner">Loading List...</div>';
                const response = await fetch(fileName);
                if (!response.ok) throw new Error("File not found");
                namesData = await response.json();
                renderNames();
            } catch (error) {
                console.error(error);
                nameListContainer.innerHTML = `<p>Error: Could not load ${fileName}. Check file name/location.</p>`;
            }
        }

        // Render A-Z
        function generateAlphabet() {
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
            nameListContainer.innerHTML = "";
            document.querySelector('.name-list-container').style.display = 'block';
            nameDetailsContainer.style.display = 'none';

            const filtered = namesData.filter(n => n.name.startsWith(currentLetter));
            
            if (filtered.length === 0) {
                nameListContainer.innerHTML = `<p style="width:100%; text-align:center;">No names found for ${currentLetter}</p>`;
                return;
            }

            filtered.forEach(person => {
                const div = document.createElement("div");
                div.className = "name-item";
                div.textContent = person.name;
                div.onclick = () => {
                    document.querySelector('.name-list-container').style.display = 'none';
                    nameDetailsContainer.style.display = 'block';
                    // Show details from JSON
                    nameDetailsBox.innerHTML = `
                        <h2>${person.name}</h2>
                        <p><strong>Meaning:</strong> ${person.meaning}</p>
                        <p><strong>Rashi:</strong> ${person.rashi || 'N/A'}</p>
                        <p><strong>Origin:</strong> ${person.origin || 'N/A'}</p>
                    `;
                };
                nameListContainer.appendChild(div);
            });
        }

        // Event Listeners
        genderBtns.forEach(btn => {
            btn.onclick = () => {
