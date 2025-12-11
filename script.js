/* ======================================================
   SCRIPT.JS - FINAL ROBUST VERSION
   ====================================================== */

// Global Variables
let namesData = []; 

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Page Visibility Fix (Taaki blank na dikhe) ---
    document.body.style.visibility = 'visible'; 
    document.body.style.opacity = '1';

    // --- 2. Header Adjustment ---
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;

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

    // --- 4. Theme & Language Logic ---
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

    // --- 5. Mobile Menu Logic ---
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

    // ======================================================
    // NAME FINDER LOGIC (CRASH PROOF VERSION)
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

        // --- NEW SMART LOADER FUNCTION ---
        async function loadNames(gender) {
            const fileName = (gender === "Boy") ? "bnames.json" : "gnames.json";
            
            try {
                if(nameListContainer) nameListContainer.innerHTML = '<div class="spinner">Loading List...</div>';
                
                const response = await fetch(fileName);
                if (!response.ok) throw new Error(`File missing: ${fileName}`);
                
                let rawData = await response.json();

                // --- CRASH FIX: Check Data Structure ---
                if (Array.isArray(rawData)) {
                    // Agar seedhi list hai (Sahi format)
                    namesData = rawData;
                } else {
                    // Agar Object hai (Galat format, par hum dhoondh lenge)
                    console.warn("JSON array nahi hai, automatic fix try kar raha hu...");
                    // Object ke andar pehli Array dhoondo
                    const foundArray = Object.values(rawData).find(val => Array.isArray(val));
                    
                    if (foundArray) {
                        namesData = foundArray;
                    } else {
                        throw new Error("JSON file mein Names ki List nahi mili.");
                    }
                }
                
                renderNames(); // Sab sahi hai, ab list dikhao

            } catch (error) {
                console.error("Data Load Error:", error);
                namesData = []; // Error aane par empty array taaki crash na ho
                if(nameListContainer) {
                    nameListContainer.innerHTML = `<p style="color:red; padding:20px;">
                        Error loading data.<br>
                        <small>${error.message}</small>
                    </p>`;
                }
            }
        }

        // Generate A-Z Buttons
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

        // Render List Function
        function renderNames() {
            if(!nameListContainer) return;
            nameListContainer.innerHTML = "";
            
            const listSection = document.querySelector('.name-list-container');
            if(listSection) listSection.style.display = 'block';
            if(nameDetailsContainer) nameDetailsContainer.style.display = 'none';

            // Safety Check: Agar namesData array nahi hai to ruk jao
            if (!Array.isArray(namesData)) {
                console.error("namesData array nahi hai:", namesData);
                return;
            }

            // Filter names
            const filtered = namesData.filter(n => 
                n.name && n.name.toUpperCase().startsWith(currentLetter)
            );
            
            if (filtered.length === 0) {
                nameListContainer.innerHTML = `<p style="width:100%; text-align:center;">No names found starting with ${currentLetter}</p>`;
                return;
            }

            // Create Name Items
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
                            <p><strong>Rashi:</strong> ${person.rashi || 'N/A'}</p>
                            <p><strong>Origin:</strong> ${person.origin || 'N/A'}</p>
                        `;
                    }
                };
                nameListContainer.appendChild(div);
            });
        }

        // Event Listeners
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

        // Initialize
        generateAlphabet();
        loadNames("Boy");
    }
    // --- NAME FINDER LOGIC END ---

    // --- CHATBOT PLACEHOLDER ---
    if (document.getElementById("chatbox") && document.getElementById("sendBtn")) {
        const sendBtn = document.getElementById("sendBtn");
        const userInput = document.getElementById("userInput");
        const chatbox = document.getElementById("chatbox");

        function sendMessage() {
            const text = userInput.value.trim();
            if (!text) return;
            chatbox.innerHTML += `<div class="message user">${text}</div>`;
            userInput.value = "";
            chatbox.scrollTop = chatbox.scrollHeight;
            chatbox.innerHTML += `<div class="message bot">Chatbot requires API Key.</div>`;
        }
        sendBtn.onclick = sendMessage;
        userInput.onkeypress = (e) => { if(e.key === "Enter") sendMessage(); };
    }
});
