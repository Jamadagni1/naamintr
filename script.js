/* ======================================================
   SCRIPT.JS - FINAL TEXT FIX VERSION
   ====================================================== */

const GEMINI_API_KEY = ""; // Yahan API Key daalein agar chahiye

// --- 1. Force Page Visibility ---
document.body.style.visibility = "visible";
document.body.style.opacity = "1";

let namesData = []; 

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 2. Initialize Language (TEXT FIX) ---
    // Yeh function khali tags mein text bharega
    function updateContent(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            if (text) {
                // Agar element khali hai ya sirf text hai, toh update karein
                if (!el.children.length || el.tagName === 'P' || el.tagName === 'H2' || el.tagName === 'A') {
                    el.textContent = text;
                }
            }
        });

        // Update Placeholders
        const heroInput = document.getElementById("hero-search-input");
        if(heroInput) {
            heroInput.placeholder = lang === "hi" ? "उदा: आरव, अद्विक..." : "e.g., Aarav, Advik...";
        }
    }

    // Default Language Load karein
    const currentLang = localStorage.getItem("language") || "en";
    updateContent(currentLang);

    // Language Toggle Button
    const langBtn = document.getElementById("language-toggle");
    if(langBtn) {
        langBtn.onclick = () => {
            const newLang = document.documentElement.lang === "hi" ? "en" : "hi";
            updateContent(newLang);
        };
    }

    // --- 3. Typing Effect ---
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

    // --- 4. Theme Logic ---
    const setTheme = (t) => {
        document.body.setAttribute("data-theme", t);
        localStorage.setItem("theme", t);
        const btn = document.getElementById("theme-toggle");
        if(btn) btn.innerHTML = t === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };
    setTheme(localStorage.getItem("theme") || "light");
    
    document.getElementById("theme-toggle")?.addEventListener("click", () => {
        const current = document.body.getAttribute("data-theme");
        setTheme(current === "dark" ? "light" : "dark");
    });

    // --- 5. Mobile Menu ---
    const hamburger = document.getElementById("hamburger-menu");
    const nav = document.getElementById("main-nav");
    if(hamburger && nav) {
        hamburger.addEventListener("click", (e) => { 
            e.stopPropagation();
            hamburger.classList.toggle("active"); 
            nav.classList.toggle("active"); 
        });
        document.addEventListener("click", (e) => {
            if (nav.classList.contains("active") && !nav.contains(e.target)) {
                hamburger.classList.remove("active");
                nav.classList.remove("active");
            }
        });
    }

    // --- 6. Header Padding ---
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;


    // ======================================================
    // NAME FINDER LOGIC
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

        // --- LOAD DATA ---
        async function loadNames(gender) {
            const fileName = (gender === "Boy") ? "bnames.json" : "gnames.json";
            
            try {
                if(nameListContainer) nameListContainer.innerHTML = '<div class="spinner">Loading...</div>';
                
                const response = await fetch(fileName);
                if (!response.ok) throw new Error(`File missing: ${fileName}`);
                
                let rawData = await response.json();

                if (Array.isArray(rawData)) {
                    namesData = rawData;
                } else {
                    const values = Object.values(rawData);
                    const found = values.find(v => Array.isArray(v));
                    namesData = found || [];
                }
                
                renderNames();

            } catch (error) {
                console.error("Error:", error);
                if(nameListContainer) nameListContainer.innerHTML = `<p style="color:red">Error loading list.</p>`;
            }
        }

        // --- RENDER A-Z ---
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

        // --- RENDER NAMES ---
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
                nameListContainer.innerHTML = `<p style="width:100%; text-align:center;">No names found for ${currentLetter}</p>`;
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

    // --- HERO SEARCH (API) ---
    async function handleHeroSearch() {
        const heroInput = document.getElementById('hero-search-input');
        if (!heroInput || !heroInput.value.trim()) return;
        const nameToSearch = heroInput.value.trim();

        const nameFinderSection = document.getElementById('name-finder');
        const detailsBox = document.querySelector('.name-details');
        const detailsContainer = document.querySelector('.name-details-container');
        const listContainer = document.querySelector('.name-list-container');

        if (nameFinderSection) {
            const header = document.querySelector('header');
            window.scrollTo({ top: nameFinderSection.offsetTop - (header ? header.offsetHeight : 0), behavior: 'smooth' });

            if(listContainer) listContainer.style.display = 'none';
            if(detailsContainer) detailsContainer.style.display = 'block';
            if(detailsBox) detailsBox.innerHTML = '<div class="spinner">Searching...</div>';

            try {
                if(!GEMINI_API_KEY) throw new Error("API Key missing");
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: `Meaning of name ${nameToSearch}` }] }] })
                });
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Not found";
                detailsBox.innerHTML = `<h2>${nameToSearch}</h2><p>${text}</p>`;
            } catch(e) {
                detailsBox.innerHTML = `<h2>${nameToSearch}</h2><p>Details not found (Check API Key).</p>`;
            }
        }
    }

    const heroBtn = document.getElementById('hero-search-btn');
    const heroInp = document.getElementById('hero-search-input');
    if(heroBtn) heroBtn.onclick = handleHeroSearch;
    if(heroInp) heroInp.onkeypress = (e) => { if(e.key === "Enter") handleHeroSearch(); };

});
