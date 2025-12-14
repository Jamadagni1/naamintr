/* ======================================================
   SCRIPT.JS - ROBUST VERSION
   ====================================================== */

document.body.style.visibility = "visible";
document.body.style.opacity = "1";

document.addEventListener("DOMContentLoaded", () => {

    // --- 1. GLOBAL HELPERS ---
    const safeGet = (id) => document.getElementById(id);
    const getLanguage = () => localStorage.getItem("language") || "en";

    // --- 2. HEADER & MOBILE MENU ---
    const hamburger = safeGet("hamburger-menu");
    const mainNav = safeGet("main-nav"); // This should be the container or nav element
    
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle("active");
            mainNav.classList.toggle("active");
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains("active") && !mainNav.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove("active");
                mainNav.classList.remove("active");
            }
        });
    }

    // --- 3. THEME TOGGLE ---
    const themeBtn = safeGet("theme-toggle");
    if (themeBtn) {
        // Init Theme
        const savedTheme = localStorage.getItem("theme") || "light";
        document.body.setAttribute("data-theme", savedTheme);
        themeBtn.innerHTML = savedTheme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

        themeBtn.addEventListener('click', () => {
            const current = document.body.getAttribute("data-theme");
            const next = current === "dark" ? "light" : "dark";
            document.body.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
            themeBtn.innerHTML = next === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // --- 4. LANGUAGE TOGGLE ---
    const langBtn = safeGet("language-toggle");
    if (langBtn) {
        // Function to update text on page
        const updateText = () => {
            const lang = getLanguage();
            document.documentElement.lang = lang;
            document.querySelectorAll("[data-en]").forEach(el => {
                el.textContent = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            });
            const searchInput = safeGet("hero-search-input");
            if (searchInput) {
                searchInput.placeholder = lang === "hi" ? "उदा: आरव..." : "e.g., Aarav...";
            }
        };

        // Initial Load
        updateText();

        langBtn.addEventListener('click', () => {
            const next = getLanguage() === "hi" ? "en" : "hi";
            localStorage.setItem("language", next);
            updateText();
            // Optional: Reload list if on name page
            if (typeof loadNames === "function" && safeGet("name-finder")) {
                loadNames("Boy");
            }
        });
    }

    // --- 5. AURA (PRICING) CARDS TOGGLE ---
    // Using Event Delegation for robustness
    const pricingGrid = document.querySelector('.pricing-grid');
    if (pricingGrid) {
        pricingGrid.addEventListener('click', (e) => {
            // Find closest header if clicked inside it
            const header = e.target.closest('.pricing-card-header');
            if (header) {
                const card = header.closest('.pricing-card');
                if (card) {
                    card.classList.toggle('expanded');
                }
            }
        });
    }

    // --- 6. TYPING EFFECT ---
    const typeElement = safeGet("naamin-main-title-typing");
    if (typeElement) {
        const text = "Naamin";
        let i = 0; let isDeleting = false;
        const type = () => {
            let fullTxt = text;
            let currentTxt = fullTxt.substring(0, i);
            let p1 = currentTxt.length > 4 ? "Naam" : currentTxt;
            let p2 = currentTxt.length > 4 ? currentTxt.substring(4) : "";
            
            typeElement.innerHTML = `<span class="header-naam">${p1}</span><span class="header-in">${p2}</span>`;

            if (!isDeleting && i < fullTxt.length) { i++; setTimeout(type, 200); }
            else if (isDeleting && i > 0) { i--; setTimeout(type, 100); }
            else { isDeleting = !isDeleting; setTimeout(type, isDeleting ? 2000 : 500); }
        };
        type();
    }

    // --- 7. SCROLL TO TOP ---
    const scrollBtn = safeGet("scrollToTopBtn");
    if (scrollBtn) {
        window.addEventListener("scroll", () => {
            scrollBtn.classList.toggle("show", window.scrollY > 300);
        });
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // --- 8. NAME SEARCH LOGIC (Only runs if search bar exists) ---
    const searchBtn = safeGet('hero-search-btn');
    const searchInp = safeGet('hero-search-input');
    
    if (searchBtn && searchInp) {
        const performSearch = async () => {
            const term = searchInp.value.trim().toLowerCase();
            if (!term) return;

            // Scroll to Name Finder
            const section = safeGet('name-finder');
            const detailsBox = document.querySelector('.name-details');
            const listContainer = document.querySelector('.name-list-container');
            const detailsContainer = document.querySelector('.name-details-container');

            if (section && detailsBox) {
                window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
                
                // Toggle Views
                if(listContainer) listContainer.style.display = 'none';
                if(detailsContainer) detailsContainer.style.display = 'block';
                
                detailsBox.innerHTML = '<div style="padding:20px; text-align:center;">Searching...</div>';

                // Language Logic for Files
                const lang = getLanguage();
                const suffix = lang === 'hi' ? '_hin.json' : '_eng.json';
                const bFile = 'boy_names' + suffix;
                const gFile = 'girl_names' + suffix;
                const timestamp = new Date().getTime(); // Cache Busting

                try {
                    const [b, g] = await Promise.all([
                        fetch(`${bFile}?t=${timestamp}`).then(r => r.json()),
                        fetch(`${gFile}?t=${timestamp}`).then(r => r.json())
                    ]);

                    const isHi = lang === 'hi';
                    const boys = b.map(x => ({ ...x, gender: isHi ? "लड़का" : "Boy" }));
                    const girls = g.map(x => ({ ...x, gender: isHi ? "लड़की" : "Girl" }));
                    const all = [...boys, ...girls];

                    const found = all.find(n => (n.name || n.Name).toLowerCase() === term);

                    if (found) {
                        // Render Details (Simple Version)
                        detailsBox.innerHTML = `
                            <h2>${found.name}</h2>
                            <p><strong>${isHi ? "अर्थ" : "Meaning"}:</strong> ${found.meaning}</p>
                            <p><strong>${isHi ? "लिंग" : "Gender"}:</strong> ${found.gender}</p>
                            <div style="margin-top:15px; padding:10px; background:rgba(0,0,0,0.05); border-radius:10px;">
                                <strong>${isHi ? "ज्योतिष सुझाव" : "Astrology Tip"}:</strong><br>
                                ${isHi ? "यह एक बहुत ही शुभ नाम है।" : "This is a very auspicious name."}
                            </div>
                        `;
                    } else {
                        const msg = isHi ? "जल्दी आ रहा है..." : "Coming soon...";
                        detailsBox.innerHTML = `<div style="text-align:center; padding:30px;"><h3>${isHi?"नाम नहीं मिला":"Not Found"}</h3><p>${msg}</p></div>`;
                    }

                } catch (err) {
                    console.error(err);
                    detailsBox.innerHTML = "<p>Data loading error.</p>";
                }
            }
        };

        searchBtn.addEventListener('click', performSearch);
        searchInp.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

});
