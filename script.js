/* ======================================================
   SCRIPT.JS - FINAL FIXED VERSION (JSON AUTO-DETECT)
   ====================================================== */

// Global Variables
let namesData = []; 

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Page Visibility Fix ---
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

    // --- 4. Theme & Language ---
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

    // ======================================================
    // NAME FINDER LOGIC (ERROR PROOF)
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

        // --- FIXED LOAD FUNCTION ---
        async function loadNames(gender) {
            const fileName = (gender === "Boy") ? "bnames.json" : "gnames.json";
            
            try {
                if(nameListContainer) nameListContainer.innerHTML = '<div class="spinner">Loading...</div>';
                
                const response = await fetch(fileName);
                if (!response.ok) throw new Error(`File not found: ${fileName}`);
                
                let rawData = await response.json();
                console.log("Raw JSON Data:", rawData); // Console mein check karein data kaisa dikh raha hai

                // --- SMART DATA FIX ---
                if (Array.isArray(rawData)) {
                    // 1. Agar data seedha Array hai: [...] (BEST)
                    namesData = rawData;
                } else if (typeof rawData === 'object' && rawData !== null) {
                    // 2. Agar data Object hai: { "names": [...] } ya { "bnames": [...] }
                    // Hum check karenge ki object ke andar koi Array chupa hai kya
                    const keys = Object.keys(rawData);
                    let foundArray = false;
                    
                    for (const key of keys) {
                        if (Array.isArray(rawData[key])) {
                            namesData = rawData[key]; // Array mil gaya!
                            foundArray = true;
                            break;
                        }
                    }

                    if (!foundArray) {
                        console.error("JSON Error: Object mila lekin andar koi List nahi mili.");
                        namesData = []; // Khali kar do taaki crash na ho
                    }
                } else {
                    console.error("JSON Error: Data format galat hai.");
                    namesData = [];
                }
                
                renderNames(); // List Update

            } catch (error) {
                console.error("Load Error:", error);
                namesData = []; // Crash bachane ke liye empty array
                if(nameListContainer) nameListContainer.innerHTML = `<p style="color:red">Error: ${fileName} load nahi hui.<br>Console check karein.</p>`;
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

            // --- SAFETY CHECK (Yehi line error rokegi) ---
            if (!Array.isArray(namesData)) {
                console.error("namesData Array nahi hai!", namesData);
                nameListContainer.innerHTML = "<p>Data Format Error. Check Console.</p>";
                return;
            }

            // Filter
            const filtered = namesData.filter(n => 
                n.name && n.name.toUpperCase().startsWith(currentLetter)
            );
            
            if (filtered.length === 0) {
                nameListContainer.innerHTML = `<p style="width:100%; text-align:center;">No names found starting with ${currentLetter}</p>`;
                return;
            }

            // Create Items
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

        // Events
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

    // --- CHATBOT (Placeholder) ---
    if (document.getElementById("chatbox")) {
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
        if(sendBtn) sendBtn.onclick = sendMessage;
        if(userInput) userInput.onkeypress = (e) => { if(e.key === "Enter") sendMessage(); };
    }
});
