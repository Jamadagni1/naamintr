/* ======================================================
   SCRIPT.JS - CRASH PROOF VERSION
   ====================================================== */

// --- 1. Force Visibility ---
document.body.style.visibility = "visible";
document.body.style.opacity = "1";

const GEMINI_API_KEY = ""; // Optional

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Page Setup ---
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;

    // --- Language & Text Fix ---
    function updateContent(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            if (text) el.textContent = text;
        });
        const heroInput = document.getElementById("hero-search-input");
        if(heroInput) heroInput.placeholder = lang === "hi" ? "उदा: आरव, अद्विक..." : "e.g., Aarav, Advik...";
    }
    const langBtn = document.getElementById("language-toggle");
    if(langBtn) {
        langBtn.onclick = () => updateContent(localStorage.getItem("language") === "hi" ? "en" : "hi");
    }
    updateContent(localStorage.getItem("language") || "en");

    // --- Typing Effect ---
    const typeElement = document.getElementById("naamin-main-title-typing");
    if (typeElement) {
        const text = "Naamin";
        let i = 0;
        (function type() {
            typeElement.innerHTML = `<span class="naamin-naam">${text.slice(0, 4)}</span><span class="naamin-in">${text.slice(4, i++)}</span>`;
            if (i <= text.length) setTimeout(type, 150); else setTimeout(() => { i = 0; type(); }, 3000);
        })();
    }

    // --- Theme ---
    document.getElementById("theme-toggle")?.addEventListener("click", () => {
        const current = document.body.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.body.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        document.getElementById("theme-toggle").innerHTML = next === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // --- Mobile Menu ---
    const hamburger = document.getElementById("hamburger-menu");
    const nav = document.getElementById("main-nav");
    if(hamburger && nav) {
        hamburger.onclick = (e) => { e.stopPropagation(); hamburger.classList.toggle("active"); nav.classList.toggle("active"); };
        document.onclick = (e) => { if (nav.classList.contains("active") && !nav.contains(e.target)) { hamburger.classList.remove("active"); nav.classList.remove("active"); }};
    }

    // ======================================================
    // 🔍 ROBUST SEARCH LOGIC (Fixes Search Issue)
    // ======================================================
    async function handleHeroSearch() {
        const heroInput = document.getElementById('hero-search-input');
        if (!heroInput || !heroInput.value.trim()) return;
        const nameToSearch = heroInput.value.trim().toLowerCase();

        const nameFinderSection = document.getElementById('name-finder');
        const detailsBox = document.querySelector('.name-details');
        const detailsContainer = document.querySelector('.name-details-container');
        const listContainer = document.querySelector('.name-list-container');

        if (nameFinderSection) {
            const header = document.querySelector('header');
            window.scrollTo({ top: nameFinderSection.offsetTop - (header ? header.offsetHeight : 0), behavior: 'smooth' });

            if(listContainer) listContainer.style.display = 'none';
            if(detailsContainer) detailsContainer.style.display = 'block';
            if(detailsBox) detailsBox.innerHTML = '<div class="spinner">Database check kar raha hu...</div>';

            try {
                // Try loading both files individually (Safety Check)
                let boysData = [];
                let girlsData = [];

                try {
                    const bRes = await fetch('bnames.json');
                    if(bRes.ok) boysData = await bRes.json();
                } catch(e) { console.warn("Boy names load nahi huye"); }

                try {
                    const gRes = await fetch('gnames.json');
                    if(gRes.ok) girlsData = await gRes.json();
                } catch(e) { console.warn("Girl names load nahi huye"); }

                // Combine Data
                let allNames = [].concat(boysData, girlsData);
                
                // --- FIX: Handle Nested Object Structure if present ---
                // Agar data [{name:...}] nahi hai aur {names: [...]} hai toh usse fix karo
                allNames = allNames.flatMap(item => {
                    if (item.name) return item; // Sahi hai
                    return Object.values(item).find(v => Array.isArray(v)) || []; // Object ke andar dhoondo
                });

                // Search
                const foundPerson = allNames.find(n => n.name && n.name.toLowerCase() === nameToSearch);

                if (foundPerson) {
                    detailsBox.innerHTML = `
                        <h2>${foundPerson.name}</h2>
                        <p><strong>Meaning:</strong> ${foundPerson.meaning}</p>
                        <p><strong>Gender:</strong> ${foundPerson.gender || 'Unknown'}</p>
                        <p><strong>Rashi:</strong> ${foundPerson.zodiac || 'N/A'}</p>
                        <p><strong>Origin:</strong> ${foundPerson.origin || 'N/A'}</p>
                    `;
                } else {
                    // Agar Local me nahi mila, toh API try karo (Optional)
                    detailsBox.innerHTML = `
                        <h2>${nameToSearch}</h2>
                        <p>Yeh naam database mein nahi mila.</p>
                        <button class="back-btn" onclick="location.reload()">Try Another</button>
                    `;
                }

            } catch(e) {
                console.error(e);
                detailsBox.innerHTML = `<p>Search error: ${e.message}</p>`;
            }
        }
    }

    const heroBtn = document.getElementById('hero-search-btn');
    const heroInp = document.getElementById('hero-search-input');
    if(heroBtn) heroBtn.onclick = handleHeroSearch;
    if(heroInp) heroInp.onkeypress = (e) => { if(e.key === "Enter") handleHeroSearch(); };


    // ======================================================
    // 📂 NAME FINDER LIST LOGIC (Fixes "Error Loading List")
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
        let namesData = [];

        async function loadNames(gender) {
            const fileName = (gender === "Boy") ? "bnames.json" : "gnames.json";
            
            try {
                if(nameListContainer) nameListContainer.innerHTML = '<div class="spinner">Loading...</div>';
                
                const response = await fetch(fileName);
                if (!response.ok) {
                    throw new Error(`File nahi mili: ${fileName}`);
                }
                
                let rawData = await response.json();

                // --- SMART DATA FIX ---
                if (Array.isArray(rawData)) {
                    namesData = rawData;
                } else {
                    const values = Object.values(rawData);
                    const found = values.find(v => Array.isArray(v));
                    namesData = found || [];
                }
                
                renderNames();

            } catch (error) {
                console.error("Load Error:", error);
                if(nameListContainer) nameListContainer.innerHTML = `
                    <div style="color: red; padding: 20px;">
                        <h3>Error Loading Data</h3>
                        <p>File: <b>${fileName}</b> load nahi ho payi.</p>
                        <p>Reason: ${error.message}</p>
                        <p>Make sure file exists in the folder.</p>
                    </div>`;
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

            const filtered = namesData.filter(n => 
                n.name && n.name.toUpperCase().startsWith(currentLetter)
            );
            
            if (filtered.length === 0) {
                nameListContainer.innerHTML = `<p style="width:100%; text-align:center;">No names found for '${currentLetter}'</p>`;
                return;
            }

            filtered.forEach(person => {
                const div = document.createElement("div");
                div.className = "name-item";
                div.textContent = person.name;
                div.onclick = () => {
                    if(listSection) listSection.style.display = 'none';
                    if(nameDetailsContainer) nameDetailsContainer.style.display = 'block';
                    
                    if(nameDetailsBox) {
                        nameDetailsBox.innerHTML = `
                            <h2>${person.name}</h2>
                            <p><strong>Meaning:</strong> ${person.meaning || 'N/A'}</p>
                            <p><strong>Rashi:</strong> ${person.zodiac || 'N/A'}</p>
                            <p><strong>Origin:</strong> ${person.origin || 'N/A'}</p>
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
});
