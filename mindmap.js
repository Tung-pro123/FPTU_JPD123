/**
 * JPD123 - Japanese Vocabulary Mind Map Web Application
 * Core Logic, Custom SVG Mind Map Engine, Flashcards, Quiz & State Manager
 */

// ==========================================================================
// STATE MANAGEMENT & INITIAL STATE
// ==========================================================================
let vocabData = [];
let currentUnit = "Unit 4";
let currentTab = "mindmap-tab";

// Progress tracking: key is "unit::category::kana", value is "new" | "learning" | "done"
let userProgress = {};

// Mind Map Viewport State
let zoom = 1.0;
let panX = 0;
let panY = 0;
let isPanning = false;
let startX = 0;
let startY = 0;
let expandedCategories = new Set(); // Stores category names that are expanded in current unit
let selectedWordId = null;

// Flashcards State
let flashcardWords = [];
let cardIndex = 0;
let isCardFlipped = false;

// Quiz State
let quizQuestions = [];
let quizIndex = 0;
let quizCorrectCount = 0;
let quizIsAnswered = false;
let quizIncorrectWords = [];

// Audio Context for sound synthesis
let audioCtx = null;

// Web Speech voices
let jaVoice = null;

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

async function initApp() {
    try {
        // Load data
        const response = await fetch("vocab_data.json");
        vocabData = await response.json();
        
        // Load progress from localStorage
        loadProgress();

        // Initialize Theme Settings
        initTheme();
        
        // Initialize Speech Synthesis
        initSpeech();
        
        // Populate dropdowns & UI components
        populateUnitSelectors();
        setupEventListeners();
        
        // Expand all categories by default on first load
        const unitObj = vocabData.find(u => u.unit === currentUnit);
        if (unitObj) {
            unitObj.categories.forEach(cat => expandedCategories.add(cat.name));
        }

        // Render first view
        renderCurrentTab();
        updateStats();
        showToast("Chào mừng bạn! Đã tải dữ liệu từ vựng thành công.", "info");
    } catch (err) {
        console.error("Initialization error:", err);
        showToast("Không thể tải cơ sở dữ liệu từ vựng.", "error");
    }
}

// Load learning progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem("jpd123_progress");
    if (saved) {
        try {
            userProgress = JSON.parse(saved);
        } catch (e) {
            userProgress = {};
        }
    }
}

// Theme Manager
function initTheme() {
    const savedTheme = localStorage.getItem("jpd123_theme") || "dark";
    applyTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains("light-theme") ? "light" : "dark";
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
}

function applyTheme(theme) {
    const themeBtn = document.getElementById("theme-toggle-btn");
    const icon = themeBtn.querySelector("i");
    
    if (theme === "light") {
        document.body.classList.add("light-theme");
        icon.className = "fa-solid fa-sun";
        themeBtn.title = "Chuyển sang giao diện Tối";
    } else {
        document.body.classList.remove("light-theme");
        icon.className = "fa-solid fa-moon";
        themeBtn.title = "Chuyển sang giao diện Sáng";
    }
    
    localStorage.setItem("jpd123_theme", theme);
    
    // Redraw mind map if currently in mindmap tab
    if (currentTab === "mindmap-tab" && vocabData.length > 0) {
        renderMindmap();
    }
}

// Save learning progress to localStorage
function saveProgress() {
    localStorage.setItem("jpd123_progress", JSON.stringify(userProgress));
    updateStats();
}

function getWordId(unit, category, wordObj) {
    return `${unit}::${category}::${wordObj.kana}`;
}

function getWordStatus(unit, category, wordObj) {
    const id = getWordId(unit, category, wordObj);
    return userProgress[id] || "new";
}

function setWordStatus(unit, category, wordObj, status) {
    const id = getWordId(unit, category, wordObj);
    userProgress[id] = status;
    saveProgress();
}

// Initialize speech voice list
function initSpeech() {
    if ('speechSynthesis' in window) {
        // Voices list is loaded asynchronously
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            jaVoice = voices.find(v => v.lang === 'ja-JP' || v.lang.startsWith('ja'));
        };
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }
}

function speakJapanese(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        if (jaVoice) {
            utterance.voice = jaVoice;
        }
        utterance.rate = 0.85; // Slightly slower for language learners
        window.speechSynthesis.speak(utterance);
    } else {
        showToast("Trình duyệt không hỗ trợ Text-to-Speech.", "info");
    }
}

// Synthesize Beep Sound for Quiz Feedback
function playSound(type) {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        
        if (type === 'correct') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.setValueAtTime(880, now + 0.08); // A5
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === 'incorrect') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.linearRampToValueAtTime(90, now + 0.3);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    } catch (e) {
        console.warn("Audio Context sound blocked or unsupported.", e);
    }
}

// ==========================================================================
// UI & EVENT HANDLERS SETUP
// ==========================================================================
function populateUnitSelectors() {
    const unitSelect = document.getElementById("unit-select");
    const quizUnitSelect = document.getElementById("quiz-unit-select");
    
    // Clear and rebuild
    unitSelect.innerHTML = "";
    vocabData.forEach(unitObj => {
        const option = document.createElement("option");
        option.value = unitObj.unit;
        option.textContent = `${unitObj.unit}: ${getUnitSummaryName(unitObj.unit)}`;
        unitSelect.appendChild(option);
    });
    unitSelect.value = currentUnit;
}

function getUnitSummaryName(unit) {
    const summaries = {
        "Unit 4": "Phương hướng & Thiên nhiên",
        "Unit 5": "Thời gian & Động từ",
        "Unit 6": "Ẩm thực & Giải trí",
        "Unit 7": "Đồ dùng & Gia vị"
    };
    return summaries[unit] || "Từ vựng";
}

function setupEventListeners() {
    // Navigation Tabs
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");
            
            currentTab = item.getAttribute("data-tab");
            
            // Toggle panels
            const panels = document.querySelectorAll(".tab-panel");
            panels.forEach(panel => panel.classList.remove("active"));
            document.getElementById(currentTab).classList.add("active");
            
            renderCurrentTab();
        });
    });

    // Unit Selector change
    document.getElementById("unit-select").addEventListener("change", (e) => {
        currentUnit = e.target.value;
        
        // Auto reset expanded categories for new Unit (expand all by default)
        expandedCategories.clear();
        const unitObj = vocabData.find(u => u.unit === currentUnit);
        if (unitObj) {
            unitObj.categories.forEach(cat => expandedCategories.add(cat.name));
        }
        
        // Reset pan & zoom
        resetZoom();
        
        // Close detail panel
        closeDetailPanel();
        
        // Re-render
        renderCurrentTab();
        updateStats();
        
        showToast(`Đã chuyển sang bài học ${currentUnit}`, "info");
    });

    // Global Search
    const searchInput = document.getElementById("global-search");
    const clearSearchBtn = document.getElementById("clear-search-btn");
    
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length > 0) {
            clearSearchBtn.classList.remove("hidden-btn");
            // Automatically switch to Word List view for search results
            switchToTab("list-tab");
            filterWordList(query);
        } else {
            clearSearchBtn.classList.add("hidden-btn");
            filterWordList("");
        }
    });
    
    clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        clearSearchBtn.classList.add("hidden-btn");
        filterWordList("");
        searchInput.focus();
    });

    // Trigger mini stats dashboard display
    document.getElementById("stats-trigger").addEventListener("click", () => {
        switchToTab("list-tab");
        document.getElementById("list-status-filter").value = "all";
        filterWordList("");
    });

    // Mind Map Controls
    document.getElementById("zoom-in-btn").addEventListener("click", () => adjustZoom(0.15));
    document.getElementById("zoom-out-btn").addEventListener("click", () => adjustZoom(-0.15));
    document.getElementById("zoom-reset-btn").addEventListener("click", resetZoom);
    document.getElementById("expand-all-btn").addEventListener("click", expandAllCategories);
    document.getElementById("collapse-all-btn").addEventListener("click", collapseAllCategories);
    document.getElementById("reset-progress-btn").addEventListener("click", resetUnitProgress);
    document.getElementById("close-detail-btn").addEventListener("click", closeDetailPanel);

    // SVG Drag & Zoom listeners
    const svgElement = document.getElementById("mindmap-svg");
    svgElement.addEventListener("mousedown", startDrag);
    svgElement.addEventListener("mousemove", drag);
    svgElement.addEventListener("mouseup", endDrag);
    svgElement.addEventListener("mouseleave", endDrag);
    svgElement.addEventListener("wheel", zoomScroll, { passive: false });

    // Touch support for mobile mindmap
    svgElement.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            startDrag({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }, { passive: true });
    svgElement.addEventListener("touchmove", (e) => {
        if (e.touches.length === 1 && isPanning) {
            const touch = e.touches[0];
            drag({ clientX: touch.clientX, clientY: touch.clientY });
            if (e.cancelable) {
                e.preventDefault(); // Stop mobile browser scrolling while dragging the canvas
            }
        }
    }, { passive: false });
    svgElement.addEventListener("touchend", endDrag);

    // Flashcard UI Handlers
    document.getElementById("flashcard-container").addEventListener("click", (e) => {
        // Prevent flipping if click was on volume TTS button
        if (e.target.closest("#card-tts-btn")) return;
        toggleCardFlip();
    });
    
    document.getElementById("card-tts-btn").addEventListener("click", () => {
        if (flashcardWords.length > 0 && flashcardWords[cardIndex]) {
            speakJapanese(flashcardWords[cardIndex].word.kana);
        }
    });

    document.getElementById("card-prev-btn").addEventListener("click", prevFlashcard);
    document.getElementById("card-next-btn").addEventListener("click", nextFlashcard);
    document.getElementById("card-shuffle-btn").addEventListener("click", shuffleFlashcards);
    document.getElementById("card-reset-progress-btn").addEventListener("click", resetCategoryProgressInFlashcard);
    
    document.getElementById("flashcard-category-select").addEventListener("change", () => {
        initFlashcardsDeck();
    });

    // Learning status action buttons on flashcard
    document.getElementById("status-new-btn").addEventListener("click", () => updateFlashcardStatus("new"));
    document.getElementById("status-learning-btn").addEventListener("click", () => updateFlashcardStatus("learning"));
    document.getElementById("status-done-btn").addEventListener("click", () => updateFlashcardStatus("done"));

    // Quiz UI Handlers
    document.getElementById("start-quiz-btn").addEventListener("click", startQuiz);
    document.getElementById("next-question-btn").addEventListener("click", nextQuizQuestion);
    document.getElementById("restart-quiz-btn").addEventListener("click", () => {
        document.getElementById("quiz-results").classList.add("hidden-section");
        document.getElementById("quiz-setup").classList.remove("hidden-section");
    });
    document.getElementById("review-incorrect-btn").addEventListener("click", reviewIncorrectQuizWords);

    // Quiz Question TTS Voice
    document.getElementById("quiz-question-tts").addEventListener("click", () => {
        const questionText = document.getElementById("quiz-question-text").textContent;
        // Verify if the question text is Japanese (if is Japanese -> speak it)
        // If mode was vi-jp, question is Vietnamese, so speak the correct answer instead.
        const currentQ = quizQuestions[quizIndex];
        if (currentQ.type === 'jp-vi') {
            speakJapanese(currentQ.questionText);
        } else {
            speakJapanese(currentQ.correctAnswer);
        }
    });

    // Word List Filters
    const listUnitSelect = document.getElementById("list-unit-filter");
    if (listUnitSelect) {
        listUnitSelect.addEventListener("change", () => {
            populateListCategories();
            const query = document.getElementById("global-search").value.trim().toLowerCase();
            filterWordList(query);
        });
    }

    const listCategorySelect = document.getElementById("list-category-filter");
    if (listCategorySelect) {
        listCategorySelect.addEventListener("change", () => {
            const query = document.getElementById("global-search").value.trim().toLowerCase();
            filterWordList(query);
        });
    }

    const listStatusSelect = document.getElementById("list-status-filter");
    if (listStatusSelect) {
        listStatusSelect.addEventListener("change", () => {
            const query = document.getElementById("global-search").value.trim().toLowerCase();
            filterWordList(query);
        });
    }

    // Grammar Unit Filter
    document.getElementById("grammar-unit-filter").addEventListener("change", () => {
        renderGrammar();
    });

    // Theme Toggle Handler
    document.getElementById("theme-toggle-btn").addEventListener("click", toggleTheme);
}

function switchToTab(tabId) {
    const navItem = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if (navItem) {
        navItem.click();
    }
}

// ==========================================================================
// VIEW CONTROLLER
// ==========================================================================
function renderCurrentTab() {
    // Toggle body class for mindmap active state (to control scroll behavior on mobile)
    if (currentTab === "mindmap-tab") {
        document.body.classList.add("mindmap-active");
    } else {
        document.body.classList.remove("mindmap-active");
    }

    if (currentTab === "mindmap-tab") {
        renderMindmap();
    } else if (currentTab === "flashcard-tab") {
        // Setup categories select for flashcard filtering
        populateFlashcardCategories();
        initFlashcardsDeck();
    } else if (currentTab === "quiz-tab") {
        // Reset quiz screen to setup
        document.getElementById("quiz-active").classList.add("hidden-section");
        document.getElementById("quiz-results").classList.add("hidden-section");
        document.getElementById("quiz-setup").classList.remove("hidden-section");
    } else if (currentTab === "list-tab") {
        populateListCategories();
        const query = document.getElementById("global-search").value.trim().toLowerCase();
        filterWordList(query);
    } else if (currentTab === "grammar-tab") {
        renderGrammar();
    } else if (currentTab === "kanji-tab") {
        initKanjiPractice();
    } else if (currentTab === "speaking-tab") {
        initSpeakingPractice();
    }
}

// ==========================================================================
// GRAMMAR RENDERING ENGINE
// ==========================================================================
function renderGrammar() {
    const container = document.getElementById("grammar-content");
    const filterValue = document.getElementById("grammar-unit-filter").value;

    // Filter data
    const units = filterValue === "all"
        ? GRAMMAR_DATA
        : GRAMMAR_DATA.filter(u => u.unit === filterValue);

    if (units.length === 0) {
        container.innerHTML = `<div class="grammar-empty"><i class="fa-solid fa-book-open"></i><p>Không tìm thấy dữ liệu ngữ pháp.</p></div>`;
        return;
    }

    let html = '';

    units.forEach(unitData => {
        html += `<div class="grammar-unit-group">`;
        html += `<div class="grammar-unit-header">`;
        html += `<i class="fa-solid ${unitData.icon}"></i>`;
        html += `<h3>📖 ${unitData.unit}: ${unitData.title}</h3>`;
        html += `</div>`;

        unitData.sections.forEach((section, sIdx) => {
            const sectionId = `grammar-${unitData.unit.replace(/\s/g, '')}-${sIdx}`;
            html += `<div class="grammar-item">`;
            html += `<button class="grammar-item-toggle" data-target="${sectionId}">`;
            html += `<span class="grammar-item-number">${sIdx + 1}</span>`;
            html += `<span class="grammar-item-title">${section.title}</span>`;
            html += `<i class="fa-solid fa-chevron-down grammar-chevron"></i>`;
            html += `</button>`;
            html += `<div class="grammar-item-body" id="${sectionId}">`;

            // Structures / Formulas
            if (section.structures && section.structures.length > 0) {
                section.structures.forEach(s => {
                    html += `<div class="grammar-formula-box">`;
                    html += `<div class="grammar-formula-text">${highlightGrammarFormula(s.formula)}</div>`;
                    if (s.explanation) {
                        html += `<div class="grammar-formula-explain">${s.explanation}</div>`;
                    }
                    html += `</div>`;
                });
            }

            // Tables
            if (section.tables && section.tables.length > 0) {
                section.tables.forEach(tbl => {
                    html += `<div class="grammar-table-wrapper">`;
                    if (tbl.caption) {
                        html += `<div class="grammar-table-caption">${tbl.caption}</div>`;
                    }
                    html += `<table class="grammar-table">`;
                    html += `<thead><tr>`;
                    tbl.headers.forEach(h => {
                        html += `<th>${h}</th>`;
                    });
                    html += `</tr></thead>`;
                    html += `<tbody>`;
                    tbl.rows.forEach(row => {
                        html += `<tr>`;
                        row.forEach(cell => {
                            html += `<td>${highlightJapanese(cell)}</td>`;
                        });
                        html += `</tr>`;
                    });
                    html += `</tbody></table>`;
                    html += `</div>`;
                });
            }

            // Examples
            if (section.examples && section.examples.length > 0) {
                html += `<div class="grammar-examples">`;
                html += `<div class="grammar-examples-label"><i class="fa-solid fa-lightbulb"></i> Ví dụ:</div>`;
                section.examples.forEach(ex => {
                    html += `<div class="grammar-example-item">`;
                    html += `<span class="grammar-ex-jp">${ex.jp}</span>`;
                    html += `<span class="grammar-ex-arrow">→</span>`;
                    html += `<span class="grammar-ex-vi">${ex.vi}</span>`;
                    html += `</div>`;
                });
                html += `</div>`;
            }

            // Notes
            if (section.notes && section.notes.length > 0) {
                section.notes.forEach(note => {
                    const isWarning = note.startsWith('⚠️');
                    const isTip = note.startsWith('💡');
                    const noteClass = isWarning ? 'warning' : (isTip ? 'tip' : 'info');
                    const noteIcon = isWarning ? 'fa-triangle-exclamation' : (isTip ? 'fa-lightbulb' : 'fa-circle-info');
                    html += `<div class="grammar-note ${noteClass}">`;
                    html += `<i class="fa-solid ${noteIcon}"></i>`;
                    html += `<span>${note.replace(/^[⚠️💡]\s*/, '')}</span>`;
                    html += `</div>`;
                });
            }

            html += `</div>`; // grammar-item-body
            html += `</div>`; // grammar-item
        });

        html += `</div>`; // grammar-unit-group
    });

    container.innerHTML = html;

    // Attach accordion toggle events
    container.querySelectorAll('.grammar-item-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const body = document.getElementById(targetId);
            const chevron = btn.querySelector('.grammar-chevron');
            const isOpen = body.classList.contains('open');

            if (isOpen) {
                body.classList.remove('open');
                chevron.classList.remove('rotated');
            } else {
                body.classList.add('open');
                chevron.classList.add('rotated');
            }
        });
    });

    // Auto-expand all sections on first render
    container.querySelectorAll('.grammar-item-body').forEach(body => {
        body.classList.add('open');
    });
    container.querySelectorAll('.grammar-chevron').forEach(chevron => {
        chevron.classList.add('rotated');
    });
}

function highlightGrammarFormula(text) {
    // Highlight Japanese characters in formulas with a special class
    return text.replace(/([\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]+)/g,
        '<span class="grammar-jp-highlight">$1</span>');
}

function highlightJapanese(text) {
    // Lighter highlight for table cells
    return text.replace(/([\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]+)/g,
        '<span class="grammar-jp-inline">$1</span>');
}

// ==========================================================================
// TOAST NOTIFICATION SYSTEM
// ==========================================================================
function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "fa-info-circle";
    if (type === "done") icon = "fa-check-circle";
    if (type === "error") icon = "fa-exclamation-circle";
    
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after animation completes
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ==========================================================================
// GLOBAL PROGRESS STATISTICS
// ==========================================================================
function updateStats() {
    const unitObj = vocabData.find(u => u.unit === currentUnit);
    if (!unitObj) return;
    
    // 1. Calculate stats for current unit
    let unitTotal = 0;
    let unitDone = 0;
    
    unitObj.categories.forEach(cat => {
        cat.words.forEach(word => {
            unitTotal++;
            if (getWordStatus(currentUnit, cat.name, word) === "done") {
                unitDone++;
            }
        });
    });
    
    const unitPct = unitTotal > 0 ? Math.round((unitDone / unitTotal) * 100) : 0;
    
    // Update header widgets
    document.getElementById("unit-progress-bar").style.width = `${unitPct}%`;
    document.getElementById("unit-progress-text").textContent = `${unitPct}%`;
    
    // 2. Calculate global stats (Across all Units)
    let globalTotal = 0;
    let globalDone = 0;
    let globalLearning = 0;
    let globalNew = 0;
    
    vocabData.forEach(u => {
        u.categories.forEach(cat => {
            cat.words.forEach(word => {
                globalTotal++;
                const status = getWordStatus(u.unit, cat.name, word);
                if (status === "done") globalDone++;
                else if (status === "learning") globalLearning++;
                else globalNew++;
            });
        });
    });
    
    const globalPct = globalTotal > 0 ? Math.round((globalDone / globalTotal) * 100) : 0;
    
    // Update sidebar dashboard
    document.getElementById("global-pct").textContent = `${globalPct}%`;
    document.getElementById("count-done").textContent = globalDone;
    document.getElementById("count-learning").textContent = globalLearning;
    document.getElementById("count-new").textContent = globalNew;
    
    // Update SVG progress ring
    const circle = document.getElementById("global-progress-circle");
    if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        const offset = circumference - (globalPct / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
}

// ==========================================================================
// CUSTOM INTERACTIVE MIND MAP ENGINE
// ==========================================================================
function renderMindmap() {
    const viewport = document.getElementById("mindmap-viewport");
    viewport.innerHTML = ""; // Clear existing elements
    
    const unitObj = vocabData.find(u => u.unit === currentUnit);
    if (!unitObj) return;
    
    // Build tree layout model
    const layout = calculateMindmapLayout(unitObj);
    
    // Render links first (so they are drawn underneath nodes)
    layout.links.forEach(link => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("class", "mindmap-link");
        
        // Custom Bezier Curve string: M x1 y1 C (x1+x2)/2 y1, (x1+x2)/2 y2, x2 y2
        const x1 = link.source.x;
        const y1 = link.source.y;
        const x2 = link.target.x;
        const y2 = link.target.y;
        const controlX = (x1 + x2) / 2;
        
        path.setAttribute("d", `M ${x1} ${y1} C ${controlX} ${y1}, ${controlX} ${y2}, ${x2} ${y2}`);
        
        // Highlight path on hover if connected to selected word
        if (selectedWordId && (link.target.id === selectedWordId || link.source.id === selectedWordId)) {
            path.classList.add("active-link");
        }
        
        viewport.appendChild(path);
    });
    
    // Render Nodes (using foreignObject for rich CSS capability)
    layout.nodes.forEach(node => {
        const fObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        fObject.setAttribute("width", node.width);
        fObject.setAttribute("height", node.height);
        // Safari/WebKit workaround: Use transform instead of x/y attributes for foreignObject positioning
        fObject.setAttribute("transform", `translate(${node.x - node.width / 2}, ${node.y - node.height / 2})`);
        
        // Create HTML node wrapper (using XHTML namespace for iOS Safari compatibility)
        const div = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
        
        if (node.type === "root") {
            div.className = "node-body node-root";
            div.innerHTML = `<span class="node-text">${node.label}</span>`;
        } 
        else if (node.type === "category") {
            div.className = "node-body node-category";
            const isExpanded = expandedCategories.has(node.label);
            
            div.innerHTML = `
                <span class="node-text" title="${node.label}">${node.label}</span>
                <span class="node-toggle-btn" data-cat="${node.label}">
                    <i class="fa-solid ${isExpanded ? 'fa-minus' : 'fa-plus'}"></i>
                </span>
            `;
            
            // Bind collapse/expand click
            div.querySelector(".node-toggle-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                toggleCategory(node.label);
            });
        } 
        else if (node.type === "word") {
            const status = getWordStatus(currentUnit, node.category, node.wordObj);
            const isSelected = selectedWordId === node.id;
            
            div.className = `node-body node-word status-${status} ${isSelected ? 'selected-word' : ''}`;
            
            // Format Japanese text nicely
            let wordHtml = "";
            if (node.wordObj.kanji) {
                wordHtml = `
                    <div style="display: flex; flex-direction: column; text-align: left; line-height: 1.1;">
                        <span style="font-weight: 700; font-size: 13px; color: #ffffff;">${node.wordObj.kanji}</span>
                        <span style="font-size: 10px; color: var(--primary);">${node.wordObj.kana}</span>
                    </div>
                `;
            } else {
                wordHtml = `<span style="font-weight: 600; font-size: 12px;">${node.wordObj.kana}</span>`;
            }
            
            div.innerHTML = `
                ${wordHtml}
                <i class="fa-solid fa-volume-high" style="font-size: 9px; opacity: 0.6; margin-left: 6px;"></i>
            `;
            
            // Handle node click
            div.addEventListener("click", () => {
                selectWord(node.id, node.category, node.wordObj);
            });
        }
        
        fObject.appendChild(div);
        viewport.appendChild(fObject);
    });
    
    // Apply viewport pan and zoom transforms
    updateViewportTransform();
}

// Layout Calculator for horizontal-splitting mindmap tree
function calculateMindmapLayout(unitObj) {
    const nodes = [];
    const links = [];
    
    // 1. Root Node Setup
    const rootNode = {
        id: "root",
        type: "root",
        label: unitObj.unit,
        x: 0,
        y: 0,
        width: 160,
        height: 50
    };
    nodes.push(rootNode);
    
    // Split categories left/right
    const categories = unitObj.categories;
    const leftCategories = [];
    const rightCategories = [];
    
    categories.forEach((cat, idx) => {
        if (idx % 2 === 0) {
            leftCategories.push(cat);
        } else {
            rightCategories.push(cat);
        }
    });
    
    const catWidth = 230;
    const catHeight = 40;
    const wordWidth = 190;
    const wordHeight = 38;
    const verticalGap = 16;
    
    // Helper to calculate height of a category subtree
    const getSubtreeHeight = (cat) => {
        if (!expandedCategories.has(cat.name) || cat.words.length === 0) {
            return catHeight;
        }
        return Math.max(catHeight, cat.words.length * (wordHeight + verticalGap) - verticalGap);
    };
    
    // LAYOUT LEFT SIDE
    let totalLeftHeight = 0;
    const leftSubtreeHeights = leftCategories.map(cat => {
        const h = getSubtreeHeight(cat);
        totalLeftHeight += h;
        return h;
    });
    // Add gaps
    totalLeftHeight += (leftCategories.length - 1) * 32;
    
    let currentLeftY = -totalLeftHeight / 2;
    leftCategories.forEach((cat, idx) => {
        const subtreeHeight = leftSubtreeHeights[idx];
        const catY = currentLeftY + subtreeHeight / 2;
        const catX = -270;
        
        const catNode = {
            id: `cat_${cat.name}`,
            type: "category",
            label: cat.name,
            x: catX,
            y: catY,
            width: catWidth,
            height: catHeight
        };
        nodes.push(catNode);
        
        // Link root to category
        links.push({
            source: { x: rootNode.x - rootNode.width / 2, y: rootNode.y },
            target: { x: catNode.x + catNode.width / 2, y: catNode.y },
            sourceId: rootNode.id,
            targetId: catNode.id
        });
        
        // Words layout if expanded
        if (expandedCategories.has(cat.name)) {
            const wordCount = cat.words.length;
            const wordsBlockHeight = wordCount * (wordHeight + verticalGap) - verticalGap;
            let wordYStart = catY - wordsBlockHeight / 2 + wordHeight / 2;
            
            cat.words.forEach((word, wIdx) => {
                const wordY = wordYStart + wIdx * (wordHeight + verticalGap);
                const wordX = catX - 220;
                const wordId = getWordId(unitObj.unit, cat.name, word);
                
                const wordNode = {
                    id: wordId,
                    type: "word",
                    category: cat.name,
                    wordObj: word,
                    x: wordX,
                    y: wordY,
                    width: wordWidth,
                    height: wordHeight
                };
                nodes.push(wordNode);
                
                // Link category to word
                links.push({
                    source: { x: catNode.x - catNode.width / 2, y: catNode.y },
                    target: { x: wordNode.x + wordNode.width / 2, y: wordNode.y },
                    sourceId: catNode.id,
                    targetId: wordNode.id
                });
            });
        }
        
        currentLeftY += subtreeHeight + 32;
    });
    
    // LAYOUT RIGHT SIDE
    let totalRightHeight = 0;
    const rightSubtreeHeights = rightCategories.map(cat => {
        const h = getSubtreeHeight(cat);
        totalRightHeight += h;
        return h;
    });
    // Add gaps
    totalRightHeight += (rightCategories.length - 1) * 32;
    
    let currentRightY = -totalRightHeight / 2;
    rightCategories.forEach((cat, idx) => {
        const subtreeHeight = rightSubtreeHeights[idx];
        const catY = currentRightY + subtreeHeight / 2;
        const catX = 270;
        
        const catNode = {
            id: `cat_${cat.name}`,
            type: "category",
            label: cat.name,
            x: catX,
            y: catY,
            width: catWidth,
            height: catHeight
        };
        nodes.push(catNode);
        
        // Link root to category
        links.push({
            source: { x: rootNode.x + rootNode.width / 2, y: rootNode.y },
            target: { x: catNode.x - catNode.width / 2, y: catNode.y },
            sourceId: rootNode.id,
            targetId: catNode.id
        });
        
        // Words layout if expanded
        if (expandedCategories.has(cat.name)) {
            const wordCount = cat.words.length;
            const wordsBlockHeight = wordCount * (wordHeight + verticalGap) - verticalGap;
            let wordYStart = catY - wordsBlockHeight / 2 + wordHeight / 2;
            
            cat.words.forEach((word, wIdx) => {
                const wordY = wordYStart + wIdx * (wordHeight + verticalGap);
                const wordX = catX + 220;
                const wordId = getWordId(unitObj.unit, cat.name, word);
                
                const wordNode = {
                    id: wordId,
                    type: "word",
                    category: cat.name,
                    wordObj: word,
                    x: wordX,
                    y: wordY,
                    width: wordWidth,
                    height: wordHeight
                };
                nodes.push(wordNode);
                
                // Link category to word
                links.push({
                    source: { x: catNode.x + catNode.width / 2, y: catNode.y },
                    target: { x: wordNode.x - wordNode.width / 2, y: wordNode.y },
                    sourceId: catNode.id,
                    targetId: wordNode.id
                });
            });
        }
        
        currentRightY += subtreeHeight + 32;
    });
    
    return { nodes, links };
}

// Expand or Collapse a Category branch
function toggleCategory(catName) {
    if (expandedCategories.has(catName)) {
        expandedCategories.delete(catName);
    } else {
        expandedCategories.add(catName);
    }
    renderMindmap();
}

function expandAllCategories() {
    const unitObj = vocabData.find(u => u.unit === currentUnit);
    if (!unitObj) return;
    unitObj.categories.forEach(cat => expandedCategories.add(cat.name));
    renderMindmap();
    showToast("Đã mở rộng tất cả các nhánh", "info");
}

function collapseAllCategories() {
    expandedCategories.clear();
    renderMindmap();
    showToast("Đã thu gọn tất cả các nhánh", "info");
}

function resetUnitProgress() {
    if (confirm(`Bạn có chắc chắn muốn thiết lập lại toàn bộ tiến độ học tập của ${currentUnit}?`)) {
        const unitObj = vocabData.find(u => u.unit === currentUnit);
        if (!unitObj) return;
        
        unitObj.categories.forEach(cat => {
            cat.words.forEach(word => {
                const id = getWordId(currentUnit, cat.name, word);
                delete userProgress[id];
            });
        });
        
        saveProgress();
        renderMindmap();
        closeDetailPanel();
        showToast(`Đã reset tiến độ học tập của ${currentUnit}`, "info");
    }
}

// Click on word handler: speak and open detail panel
function selectWord(wordId, category, wordObj) {
    selectedWordId = wordId;
    
    // Highlight word node and connected paths (requires redrawing links/nodes)
    renderMindmap();
    
    // TTS Speak word
    speakJapanese(wordObj.kana);
    
    // Open Detail Panel
    const detailPanel = document.getElementById("word-detail-panel");
    const detailContent = document.getElementById("detail-content");
    
    const status = getWordStatus(currentUnit, category, wordObj);
    
    let displayTitle = wordObj.kanji ? `${wordObj.kanji} (${wordObj.kana})` : wordObj.kana;
    
    detailContent.innerHTML = `
        <div class="detail-vocab-header">
            <span class="detail-kanji">${wordObj.kanji || wordObj.kana}</span>
            <span class="detail-kana">${wordObj.kanji ? wordObj.kana : ''}</span>
            <button class="tts-btn" id="detail-speak-btn" title="Nghe đọc tiếng Nhật">
                <i class="fa-solid fa-volume-high"></i>
            </button>
        </div>
        
        <div class="detail-vocab-body">
            <div class="detail-group">
                <h4>Ý nghĩa tiếng Việt</h4>
                <div class="detail-meaning-box">${wordObj.meaning}</div>
            </div>
            
            <div class="detail-group">
                <h4>Chủ đề bài học</h4>
                <div style="font-size: 13px; color: var(--text-muted); font-weight: 500;">
                    <i class="fa-solid fa-folder-open" style="margin-right: 6px; color: var(--accent-purple);"></i>
                    ${category}
                </div>
            </div>

            <div class="detail-group">
                <h4>Trạng thái học tập</h4>
                <div class="status-badge-selector">
                    <button class="status-select-btn new ${status === 'new' ? 'active' : ''}" data-status="new">
                        <i class="fa-regular fa-circle"></i>
                        <span>Chưa học</span>
                    </button>
                    <button class="status-select-btn learning ${status === 'learning' ? 'active' : ''}" data-status="learning">
                        <i class="fa-solid fa-circle-notch"></i>
                        <span>Đang học</span>
                    </button>
                    <button class="status-select-btn done ${status === 'done' ? 'active' : ''}" data-status="done">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>Đã thuộc</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Bind panel speak button
    document.getElementById("detail-speak-btn").addEventListener("click", () => {
        speakJapanese(wordObj.kana);
    });
    
    // Bind status button clicks
    const statusBtns = detailContent.querySelectorAll(".status-select-btn");
    statusBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const newStatus = btn.getAttribute("data-status");
            setWordStatus(currentUnit, category, wordObj, newStatus);
            
            // Update active styling in panel
            statusBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            // Re-render mindmap to update node border colors instantly
            renderMindmap();
            showToast(`Đã cập nhật trạng thái: ${newStatus === 'done' ? 'Đã thuộc' : newStatus === 'learning' ? 'Đang học' : 'Chưa học'}`, "done");
        });
    });
    
    detailPanel.classList.add("open");
}

function closeDetailPanel() {
    document.getElementById("word-detail-panel").classList.remove("open");
    selectedWordId = null;
    renderMindmap();
}

// ==========================================================================
// SVG VIEWPORT PAN & ZOOM MECHANICS
// ==========================================================================
function updateViewportTransform() {
    const viewport = document.getElementById("mindmap-viewport");
    viewport.setAttribute("transform", `translate(${panX}, ${panY}) scale(${zoom})`);
    
    // Update indicator
    document.getElementById("zoom-indicator").textContent = `${Math.round(zoom * 100)}%`;
}

function adjustZoom(amount) {
    const newZoom = Math.min(Math.max(zoom + amount, 0.2), 2.5);
    
    // Keep zoom centered on canvas middle
    const canvas = document.getElementById("mindmap-container");
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    
    panX = w/2 - (w/2 - panX) * (newZoom / zoom);
    panY = h/2 - (h/2 - panY) * (newZoom / zoom);
    
    zoom = newZoom;
    updateViewportTransform();
}

function resetZoom() {
    zoom = 1.0;
    // Position center root node in the middle of canvas
    const canvas = document.getElementById("mindmap-container");
    panX = canvas.clientWidth / 2;
    panY = canvas.clientHeight / 2;
    updateViewportTransform();
}

function startDrag(e) {
    isPanning = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
}

function drag(e) {
    if (!isPanning) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    updateViewportTransform();
}

function endDrag() {
    isPanning = false;
}

function zoomScroll(e) {
    e.preventDefault();
    
    const rect = document.getElementById("mindmap-svg").getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    const newZoom = Math.min(Math.max(zoom + delta, 0.15), 2.8);
    
    // Zoom around mouse pointer
    panX = mouseX - (mouseX - panX) * (newZoom / zoom);
    panY = mouseY - (mouseY - panY) * (newZoom / zoom);
    zoom = newZoom;
    
    updateViewportTransform();
}

// Adjust svg layout coordinates initially when window resizes
window.addEventListener("resize", () => {
    if (currentTab === "mindmap-tab") {
        renderMindmap();
    }
});

// ==========================================================================
// FLASHCARDS MODULE
// ==========================================================================
function populateFlashcardCategories() {
    const select = document.getElementById("flashcard-category-select");
    const unitObj = vocabData.find(u => u.unit === currentUnit);
    if (!unitObj) return;
    
    select.innerHTML = '<option value="all">Tất cả chủ đề</option>';
    unitObj.categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat.name;
        opt.textContent = cat.name;
        select.appendChild(opt);
    });
}

function initFlashcardsDeck() {
    const unitObj = vocabData.find(u => u.unit === currentUnit);
    if (!unitObj) return;
    
    const selectedCat = document.getElementById("flashcard-category-select").value;
    
    // Filter words
    flashcardWords = [];
    unitObj.categories.forEach(cat => {
        if (selectedCat === "all" || cat.name === selectedCat) {
            cat.words.forEach(w => {
                flashcardWords.push({
                    word: w,
                    category: cat.name
                });
            });
        }
    });
    
    cardIndex = 0;
    isCardFlipped = false;
    document.getElementById("flashcard-container").classList.remove("flipped");
    
    document.getElementById("card-total-count").textContent = flashcardWords.length;
    
    renderFlashcard();
}

function renderFlashcard() {
    const deckContainer = document.querySelector(".flashcard-deck");
    
    if (flashcardWords.length === 0) {
        deckContainer.style.display = "none";
        document.querySelector(".flashcard-actions").style.display = "none";
        showToast("Không có từ vựng nào thỏa mãn bộ lọc.", "info");
        return;
    }
    
    deckContainer.style.display = "block";
    document.querySelector(".flashcard-actions").style.display = "flex";
    
    // Update counter
    document.getElementById("card-current-index").textContent = cardIndex + 1;
    
    const item = flashcardWords[cardIndex];
    const word = item.word;
    const catName = item.category;
    const status = getWordStatus(currentUnit, catName, word);
    
    // Update Badge
    const badge = document.getElementById("card-status-badge");
    badge.className = `card-status-badge ${status}`;
    badge.textContent = status === 'done' ? 'Đã thuộc' : status === 'learning' ? 'Đang học' : 'Chưa học';
    
    // Front side (Kanji and Kana)
    document.getElementById("card-kanji").textContent = word.kanji || word.kana;
    document.getElementById("card-kana").textContent = word.kanji ? word.kana : "";
    
    // Back side (Meaning)
    document.getElementById("card-meaning").textContent = word.meaning;
    document.getElementById("card-back-details").innerHTML = `
        <div style="margin-top: 10px; font-size: 13px;">Chủ đề: <strong>${catName}</strong></div>
    `;
    
    // Update active status buttons below card
    const btns = document.querySelectorAll(".status-action-btn");
    btns.forEach(btn => btn.classList.remove("active"));
    
    if (status === 'new') document.getElementById("status-new-btn").classList.add("active");
    if (status === 'learning') document.getElementById("status-learning-btn").classList.add("active");
    if (status === 'done') document.getElementById("status-done-btn").classList.add("active");
}

function toggleCardFlip() {
    isCardFlipped = !isCardFlipped;
    const container = document.getElementById("flashcard-container");
    if (isCardFlipped) {
        container.classList.add("flipped");
    } else {
        container.classList.remove("flipped");
    }
}

function nextFlashcard() {
    if (flashcardWords.length === 0) return;
    
    isCardFlipped = false;
    document.getElementById("flashcard-container").classList.remove("flipped");
    
    // Wait for flip transition before loading next word
    setTimeout(() => {
        cardIndex = (cardIndex + 1) % flashcardWords.length;
        renderFlashcard();
    }, isCardFlipped ? 200 : 0);
}

function prevFlashcard() {
    if (flashcardWords.length === 0) return;
    
    isCardFlipped = false;
    document.getElementById("flashcard-container").classList.remove("flipped");
    
    setTimeout(() => {
        cardIndex = (cardIndex - 1 + flashcardWords.length) % flashcardWords.length;
        renderFlashcard();
    }, isCardFlipped ? 200 : 0);
}

function shuffleFlashcards() {
    if (flashcardWords.length <= 1) return;
    
    // Shuffle algorithm (Fisher-Yates)
    for (let i = flashcardWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcardWords[i], flashcardWords[j]] = [flashcardWords[j], flashcardWords[i]];
    }
    
    cardIndex = 0;
    isCardFlipped = false;
    document.getElementById("flashcard-container").classList.remove("flipped");
    
    renderFlashcard();
    showToast("Đã đảo thẻ ngẫu nhiên!", "info");
}

function updateFlashcardStatus(status) {
    if (flashcardWords.length === 0) return;
    
    const item = flashcardWords[cardIndex];
    setWordStatus(currentUnit, item.category, item.word, status);
    
    // Refresh card display
    renderFlashcard();
    showToast("Đã lưu tiến trình học!", "done");
}

function resetCategoryProgressInFlashcard() {
    const selectedCat = document.getElementById("flashcard-category-select").value;
    const catNameDisplay = selectedCat === "all" ? "tất cả chủ đề" : `chủ đề "${selectedCat}"`;
    
    if (confirm(`Bạn muốn reset tiến độ học của ${catNameDisplay} trong Unit này?`)) {
        flashcardWords.forEach(item => {
            const id = getWordId(currentUnit, item.category, item.word);
            delete userProgress[id];
        });
        saveProgress();
        renderFlashcard();
        showToast("Đã đặt lại tiến trình của thẻ", "info");
    }
}

// ==========================================================================
// QUIZ (TRẮC NGHIỆM) MODULE
// ==========================================================================
function startQuiz() {
    const quizUnitOpt = document.getElementById("quiz-unit-select").value;
    const quizMode = document.getElementById("quiz-mode-type").value;
    const quizLimitOpt = document.getElementById("quiz-question-count").value;
    
    // 1. Gather all available words based on unit option
    let pool = [];
    
    vocabData.forEach(uObj => {
        if (quizUnitOpt === "all" || uObj.unit === currentUnit) {
            uObj.categories.forEach(cat => {
                cat.words.forEach(w => {
                    pool.push({
                        word: w,
                        category: cat.name,
                        unit: uObj.unit
                    });
                });
            });
        }
    });
    
    if (pool.length < 4) {
        showToast("Không đủ từ vựng để tạo bài kiểm tra (tối thiểu 4 từ).", "error");
        return;
    }
    
    // Shuffle the pool to select random questions
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    
    // Determine limit
    let limit = shuffledPool.length;
    if (quizLimitOpt !== "all") {
        limit = Math.min(parseInt(quizLimitOpt), shuffledPool.length);
    }
    
    // 2. Generate questions
    quizQuestions = [];
    quizIncorrectWords = [];
    
    for (let i = 0; i < limit; i++) {
        const item = shuffledPool[i];
        const correctWord = item.word;
        
        // Determine question type (JP->VI or VI->JP)
        let qType = quizMode;
        if (quizMode === "mixed") {
            qType = Math.random() > 0.5 ? "jp-vi" : "vi-jp";
        }
        
        // Generate options (1 correct, 3 distractors)
        const distractors = [];
        const filteredDistractorsPool = pool.filter(p => p.word.kana !== correctWord.kana);
        
        // Shuffle distractors pool and take 3
        const randomDistractors = filteredDistractorsPool
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
            
        // Build options array
        const options = [];
        
        if (qType === "jp-vi") {
            // Question: Japanese, Options: Vietnamese
            options.push({ text: correctWord.meaning, isCorrect: true });
            randomDistractors.forEach(d => {
                options.push({ text: d.word.meaning, isCorrect: false });
            });
        } else {
            // Question: Vietnamese, Options: Japanese
            const jpText = correctWord.kanji ? `${correctWord.kanji} (${correctWord.kana})` : correctWord.kana;
            options.push({ text: jpText, isCorrect: true });
            
            randomDistractors.forEach(d => {
                const distJp = d.word.kanji ? `${d.word.kanji} (${d.word.kana})` : d.word.kana;
                options.push({ text: distJp, isCorrect: false });
            });
        }
        
        // Shuffle options
        options.sort(() => Math.random() - 0.5);
        
        // Determine question text
        let questionText = "";
        let displayKanji = "";
        if (qType === "jp-vi") {
            questionText = correctWord.kanji || correctWord.kana;
            displayKanji = correctWord.kanji ? correctWord.kana : "";
        } else {
            questionText = correctWord.meaning;
        }
        
        quizQuestions.push({
            type: qType,
            item: item,
            questionText: questionText,
            questionSubText: displayKanji,
            correctAnswer: qType === 'jp-vi' ? correctWord.meaning : (correctWord.kanji ? `${correctWord.kanji} (${correctWord.kana})` : correctWord.kana),
            options: options
        });
    }
    
    // 3. Start Quiz Loop
    quizIndex = 0;
    quizCorrectCount = 0;
    
    document.getElementById("quiz-setup").classList.add("hidden-section");
    document.getElementById("quiz-active").classList.remove("hidden-section");
    
    renderQuizQuestion();
}

function renderQuizQuestion() {
    quizIsAnswered = false;
    
    const q = quizQuestions[quizIndex];
    
    // Update header stats
    document.getElementById("quiz-current-num").textContent = quizIndex + 1;
    document.getElementById("quiz-total-num").textContent = quizQuestions.length;
    document.getElementById("quiz-correct-count").textContent = quizCorrectCount;
    
    // Update progress bar
    const progressPct = ((quizIndex) / quizQuestions.length) * 100;
    document.getElementById("quiz-bar").style.width = `${progressPct}%`;
    
    // Update card hint and text
    const hint = document.getElementById("quiz-question-hint");
    hint.textContent = q.type === "jp-vi" ? "Chọn nghĩa tiếng Việt của từ này:" : "Chọn chữ tiếng Nhật của nghĩa này:";
    
    document.getElementById("quiz-question-text").textContent = q.questionText;
    
    // Display TTS pronunciation button for JP question
    const ttsBtn = document.getElementById("quiz-question-tts");
    if (q.type === "jp-vi") {
        ttsBtn.style.display = "inline-flex";
    } else {
        ttsBtn.style.display = "none";
    }
    
    // Render option buttons
    const grid = document.getElementById("quiz-answers-grid");
    grid.innerHTML = "";
    
    q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.textContent = opt.text;
        
        btn.addEventListener("click", () => {
            handleQuizAnswer(btn, opt);
        });
        
        grid.appendChild(btn);
    });
    
    // Hide feedback banner
    document.getElementById("quiz-feedback").classList.add("hidden-banner");
}

function handleQuizAnswer(selectedBtn, optionSelected) {
    if (quizIsAnswered) return;
    quizIsAnswered = true;
    
    const q = quizQuestions[quizIndex];
    const grid = document.getElementById("quiz-answers-grid");
    const btns = grid.querySelectorAll(".option-btn");
    
    // Disable all options
    btns.forEach(btn => btn.disabled = true);
    
    const feedbackBanner = document.getElementById("quiz-feedback");
    const feedbackText = document.getElementById("feedback-text");
    
    // Play Native Speech for the word automatically on answer (if JP->VI)
    speakJapanese(q.item.word.kana);
    
    if (optionSelected.isCorrect) {
        // Correct answer
        selectedBtn.classList.add("correct");
        quizCorrectCount++;
        
        feedbackText.className = "correct";
        feedbackText.innerHTML = `<i class="fa-solid fa-circle-check"></i> Chính xác!`;
        
        playSound('correct');
        
        // Auto mark word progress as "learning" or "done" based on current progress
        const currentProgress = getWordStatus(q.item.unit, q.item.category, q.item.word);
        if (currentProgress === "new") {
            setWordStatus(q.item.unit, q.item.category, q.item.word, "learning");
        }
    } else {
        // Incorrect answer
        selectedBtn.classList.add("incorrect");
        
        // Find correct button and highlight it in green
        btns.forEach(btn => {
            const index = Array.from(btns).indexOf(btn);
            if (q.options[index].isCorrect) {
                btn.classList.add("correct");
            }
        });
        
        feedbackText.className = "incorrect";
        feedbackText.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Sai rồi! Đáp án đúng: <strong>${q.correctAnswer}</strong>`;
        
        playSound('incorrect');
        
        // Save to incorrect list for review
        quizIncorrectWords.push(q.item);
    }
    
    feedbackBanner.classList.remove("hidden-banner");
}

function nextQuizQuestion() {
    quizIndex++;
    if (quizIndex < quizQuestions.length) {
        renderQuizQuestion();
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    document.getElementById("quiz-active").classList.add("hidden-section");
    document.getElementById("quiz-results").classList.remove("hidden-section");
    
    const score = quizCorrectCount;
    const total = quizQuestions.length;
    const pct = Math.round((score / total) * 100);
    
    document.getElementById("quiz-final-score").textContent = `${score}/${total}`;
    document.getElementById("quiz-final-pct").textContent = `${pct}%`;
    
    // Eval text
    const evalText = document.getElementById("quiz-eval-text");
    if (pct === 100) evalText.textContent = "Tuyệt vời! Bạn đã trả lời đúng tất cả câu hỏi 🎉";
    else if (pct >= 80) evalText.textContent = "Rất tốt! Bạn nắm từ vựng rất vững 💪";
    else if (pct >= 50) evalText.textContent = "Khá tốt! Hãy ôn tập thêm một chút nhé 👍";
    else evalText.textContent = "Bạn cần cố gắng thêm. Hãy ôn tập bằng Sơ đồ tư duy và Flashcard 📚";
    
    // Show/hide review incorrect button
    const reviewBtn = document.getElementById("review-incorrect-btn");
    if (quizIncorrectWords.length > 0) {
        reviewBtn.style.display = "inline-flex";
    } else {
        reviewBtn.style.display = "none";
    }
}

// Review only the words answered incorrectly by switching to Word List tab with filtered query
function reviewIncorrectQuizWords() {
    switchToTab("list-tab");
    
    // Custom filter table to show only incorrect words
    const tbody = document.getElementById("word-list-tbody");
    tbody.innerHTML = "";
    
    document.getElementById("list-count").textContent = quizIncorrectWords.length;
    document.getElementById("list-status-filter").value = "all"; // Reset status filter display
    
    quizIncorrectWords.forEach(item => {
        const word = item.word;
        const status = getWordStatus(item.unit, item.category, word);
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong style="color: var(--primary);">${item.unit}</strong></td>
            <td style="color: var(--text-muted); font-size: 13px;">${item.category}</td>
            <td>
                <div class="table-word-cell">
                    <span class="table-word-kanji">${word.kanji || word.kana}</span>
                    <span class="table-word-kana">${word.kanji ? word.kana : ''}</span>
                </div>
            </td>
            <td>
                <div style="display:flex; align-items:center;">
                    <span>${word.meaning}</span>
                    <button class="table-row-tts-btn" data-text="${word.kana}" title="Nghe phát âm">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
            </td>
            <td>
                <span class="status-badge ${status}" data-unit="${item.unit}" data-cat="${item.category}" data-kana="${word.kana}">
                    ${status === 'done' ? 'Đã thuộc' : status === 'learning' ? 'Đang học' : 'Chưa học'}
                </span>
            </td>
        `;
        
        // Bind TTS
        row.querySelector(".table-row-tts-btn").addEventListener("click", () => {
            speakJapanese(word.kana);
        });
        
        // Bind status toggle
        row.querySelector(".status-badge").addEventListener("click", (e) => {
            toggleWordStatusInline(e.target, item.unit, item.category, word);
        });
        
        tbody.appendChild(row);
    });
    
    showToast("Đã hiển thị danh sách câu sai của bài kiểm tra.", "info");
}

// ==========================================================================
// SEARCH & WORD LIST MODULE
// ==========================================================================
function populateListCategories() {
    const unitSelect = document.getElementById("list-unit-filter");
    const catSelect = document.getElementById("list-category-filter");
    if (!catSelect || !unitSelect) return;

    const unitFilter = unitSelect.value;
    const currentSelected = catSelect.value;
    catSelect.innerHTML = '<option value="all">Tất cả chủ đề</option>';

    let categoriesSet = new Set();

    vocabData.forEach(uObj => {
        if (unitFilter === "all" || uObj.unit === unitFilter) {
            uObj.categories.forEach(cat => categoriesSet.add(cat.name));
        }
    });

    categoriesSet.forEach(catName => {
        const opt = document.createElement("option");
        opt.value = catName;
        opt.textContent = catName;
        if (catName === currentSelected) opt.selected = true;
        catSelect.appendChild(opt);
    });
}

function filterWordList(searchQuery) {
    const unitSelect = document.getElementById("list-unit-filter");
    const catSelect = document.getElementById("list-category-filter");
    const statusSelect = document.getElementById("list-status-filter");

    const unitFilter = unitSelect ? unitSelect.value : "all";
    const categoryFilter = catSelect ? catSelect.value : "all";
    const statusFilter = statusSelect ? statusSelect.value : "all";

    const tbody = document.getElementById("word-list-tbody");
    tbody.innerHTML = "";
    
    let count = 0;
    const isGlobalSearch = searchQuery && searchQuery.length > 0;
    
    vocabData.forEach(uObj => {
        const matchUnit = isGlobalSearch || unitFilter === "all" || uObj.unit === unitFilter;
        
        if (matchUnit) {
            uObj.categories.forEach(cat => {
                const matchCategory = isGlobalSearch || categoryFilter === "all" || cat.name === categoryFilter;
                
                if (matchCategory) {
                    cat.words.forEach(word => {
                        const status = getWordStatus(uObj.unit, cat.name, word);
                        
                        const matchQuery = !searchQuery || 
                            word.kana.toLowerCase().includes(searchQuery) ||
                            (word.kanji && word.kanji.toLowerCase().includes(searchQuery)) ||
                            word.meaning.toLowerCase().includes(searchQuery) ||
                            cat.name.toLowerCase().includes(searchQuery);
                            
                        const matchStatus = statusFilter === "all" || status === statusFilter;
                        
                        if (matchQuery && matchStatus) {
                            count++;
                            
                            const row = document.createElement("tr");
                            row.innerHTML = `
                                <td><strong style="color: var(--primary);">${uObj.unit}</strong></td>
                                <td style="color: var(--text-muted); font-size: 13px;">${cat.name}</td>
                                <td>
                                    <div class="table-word-cell">
                                        <span class="table-word-kanji">${word.kanji || word.kana}</span>
                                        <span class="table-word-kana">${word.kanji ? word.kana : ''}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style="display:flex; align-items:center;">
                                        <span>${word.meaning}</span>
                                        <button class="table-row-tts-btn" data-text="${word.kana}" title="Nghe phát âm">
                                            <i class="fa-solid fa-volume-high"></i>
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <span class="status-badge ${status}" data-unit="${uObj.unit}" data-cat="${cat.name}" data-kana="${word.kana}">
                                        ${status === 'done' ? 'Đã thuộc' : status === 'learning' ? 'Đang học' : 'Chưa học'}
                                    </span>
                                </td>
                            `;
                            
                            // Bind TTS
                            row.querySelector(".table-row-tts-btn").addEventListener("click", () => {
                                speakJapanese(word.kana);
                            });
                            
                            // Bind status toggle click inline
                            row.querySelector(".status-badge").addEventListener("click", (e) => {
                                toggleWordStatusInline(e.target, uObj.unit, cat.name, word);
                            });
                            
                            tbody.appendChild(row);
                        }
                    });
                }
            });
        }
    });
    
    document.getElementById("list-count").textContent = count;
}

function toggleWordStatusInline(badgeElement, unit, category, wordObj) {
    const currentStatus = getWordStatus(unit, category, wordObj);
    let nextStatus = "new";
    
    if (currentStatus === "new") nextStatus = "learning";
    else if (currentStatus === "learning") nextStatus = "done";
    
    setWordStatus(unit, category, wordObj, nextStatus);
    
    // Update badge class and text in table
    badgeElement.className = `status-badge ${nextStatus}`;
    badgeElement.textContent = nextStatus === 'done' ? 'Đã thuộc' : nextStatus === 'learning' ? 'Đang học' : 'Chưa học';
    
    showToast(`Đã lưu tiến độ: ${wordObj.kana}`, "done");
}

// ==========================================================================
// KANJI PRACTICE ENGINE
// ==========================================================================
let kanjiSubMode = "flashcard"; // "flashcard" | "quiz" | "grid"
let kanjiUnitFilter = "all";
let kanjiWords = [];
let kanjiCardIndex = 0;

// Kanji Quiz state
let kanjiQuizQuestions = [];
let kanjiQuizIndex = 0;
let kanjiQuizScore = 0;
let kanjiQuizAnswered = false;

function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function getFilteredKanjiWords() {
    let list = [];
    // Regex matching CJK Kanji characters
    const kanjiRegex = /[\u4e00-\u9faf\u3400-\u4dbf]/;
    vocabData.forEach(uObj => {
        if (kanjiUnitFilter === "all" || uObj.unit === kanjiUnitFilter) {
            uObj.categories.forEach(cat => {
                cat.words.forEach(w => {
                    if (w.kanji && kanjiRegex.test(w.kanji)) {
                        list.push({
                            unit: uObj.unit,
                            category: cat.name,
                            word: w.word,
                            kana: w.kana,
                            kanji: w.kanji,
                            meaning: w.meaning
                        });
                    }
                });
            });
        }
    });
    return list;
}

function initKanjiPractice() {
    setupKanjiEventListenersOnce();
    renderKanjiTab();
}

let kanjiEventsInitialized = false;
function setupKanjiEventListenersOnce() {
    if (kanjiEventsInitialized) return;
    kanjiEventsInitialized = true;

    // Sub-mode tabs
    const subnavBtns = document.querySelectorAll(".kanji-subnav-btn");
    subnavBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            subnavBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            kanjiSubMode = btn.getAttribute("data-mode");

            // Toggle sub panels
            document.getElementById("kanji-flashcard-mode").classList.toggle("hidden-section", kanjiSubMode !== "flashcard");
            document.getElementById("kanji-quiz-mode").classList.toggle("hidden-section", kanjiSubMode !== "quiz");
            document.getElementById("kanji-grid-mode").classList.toggle("hidden-section", kanjiSubMode !== "grid");

            if (kanjiSubMode === "quiz") {
                startKanjiQuiz();
            } else {
                renderKanjiTab();
            }
        });
    });

    // Unit filter
    const unitFilter = document.getElementById("kanji-unit-filter");
    if (unitFilter) {
        unitFilter.addEventListener("change", (e) => {
            kanjiUnitFilter = e.target.value;
            kanjiCardIndex = 0;
            if (kanjiSubMode === "quiz") {
                startKanjiQuiz();
            } else {
                renderKanjiTab();
            }
        });
    }

    // Flashcard Flip & Navigation
    const card = document.getElementById("kanji-card");
    if (card) {
        card.addEventListener("click", () => {
            card.classList.toggle("flipped");
        });
    }

    const prevBtn = document.getElementById("kanji-prev-btn");
    if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (kanjiWords.length === 0) return;
            kanjiCardIndex = (kanjiCardIndex - 1 + kanjiWords.length) % kanjiWords.length;
            renderKanjiCard();
        });
    }

    const nextBtn = document.getElementById("kanji-next-btn");
    if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (kanjiWords.length === 0) return;
            kanjiCardIndex = (kanjiCardIndex + 1) % kanjiWords.length;
            renderKanjiCard();
        });
    }

    // Flashcard TTS
    const ttsBtn = document.getElementById("kanji-card-tts");
    if (ttsBtn) {
        ttsBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (kanjiWords[kanjiCardIndex]) {
                speakJapanese(kanjiWords[kanjiCardIndex].kana);
            }
        });
    }

    // Quiz next button
    const nextQuizBtn = document.getElementById("kanji-next-quiz-btn");
    if (nextQuizBtn) {
        nextQuizBtn.addEventListener("click", () => {
            kanjiQuizIndex++;
            if (kanjiQuizIndex < kanjiQuizQuestions.length) {
                renderKanjiQuizQuestion();
            } else {
                startKanjiQuiz();
            }
        });
    }

    const quizPrevBtn = document.getElementById("kanji-quiz-prev-btn");
    if (quizPrevBtn) {
        quizPrevBtn.addEventListener("click", () => {
            if (kanjiQuizIndex > 0) {
                kanjiQuizIndex--;
                renderKanjiQuizQuestion();
            } else {
                showToast("Đây là câu hỏi đầu tiên.", "info");
            }
        });
    }

    const quizNextBtn = document.getElementById("kanji-quiz-next-btn");
    if (quizNextBtn) {
        quizNextBtn.addEventListener("click", () => {
            kanjiQuizIndex++;
            if (kanjiQuizIndex < kanjiQuizQuestions.length) {
                renderKanjiQuizQuestion();
            } else {
                startKanjiQuiz();
            }
        });
    }
}

function renderKanjiTab() {
    kanjiWords = getFilteredKanjiWords();

    if (kanjiSubMode === "flashcard") {
        renderKanjiCard();
    } else if (kanjiSubMode === "quiz") {
        if (kanjiQuizQuestions.length === 0) {
            startKanjiQuiz();
        } else {
            renderKanjiQuizQuestion();
        }
    } else if (kanjiSubMode === "grid") {
        renderKanjiGrid();
    }
}

function renderKanjiCard() {
    const card = document.getElementById("kanji-card");
    if (card) card.classList.remove("flipped");

    if (kanjiWords.length === 0) {
        document.getElementById("kanji-card-unit").textContent = "-";
        document.getElementById("kanji-card-char").textContent = "無";
        document.getElementById("kanji-back-char").textContent = "無";
        document.getElementById("kanji-card-kana").textContent = "Chưa có dữ liệu";
        document.getElementById("kanji-card-meaning").textContent = "Không tìm thấy Kanji";
        document.getElementById("kanji-counter").textContent = "0 / 0";
        return;
    }

    if (kanjiCardIndex >= kanjiWords.length) kanjiCardIndex = 0;
    const item = kanjiWords[kanjiCardIndex];

    document.getElementById("kanji-card-unit").textContent = item.unit;
    document.getElementById("kanji-card-char").textContent = item.kanji;
    document.getElementById("kanji-back-char").textContent = item.kanji;
    document.getElementById("kanji-card-kana").textContent = item.kana;
    document.getElementById("kanji-card-meaning").textContent = item.meaning;
    document.getElementById("kanji-counter").textContent = `${kanjiCardIndex + 1} / ${kanjiWords.length}`;
}

function startKanjiQuiz() {
    kanjiWords = getFilteredKanjiWords();
    if (kanjiWords.length < 2) {
        showToast("Không đủ từ vựng Kanji để tạo bài trắc nghiệm (cần ít nhất 2 từ).", "warning");
        return;
    }

    // Shuffle words for quiz
    const pool = shuffleArray([...kanjiWords]);
    const numQ = Math.min(10, pool.length);
    kanjiQuizQuestions = pool.slice(0, numQ).map(qItem => {
        // Generate options (1 correct, 3 wrong)
        const wrongPool = kanjiWords.filter(w => w.kanji !== qItem.kanji);
        const shuffledWrongs = shuffleArray([...wrongPool]).slice(0, 3);
        const options = shuffleArray([qItem, ...shuffledWrongs]);

        return {
            questionKanji: qItem.kanji,
            correctAnswer: qItem,
            options: options
        };
    });

    kanjiQuizIndex = 0;
    kanjiQuizScore = 0;
    renderKanjiQuizQuestion();
}

function renderKanjiQuizQuestion() {
    if (kanjiQuizIndex >= kanjiQuizQuestions.length) {
        showToast(`Hoàn thành trắc nghiệm Kanji! Đúng: ${kanjiQuizScore}/${kanjiQuizQuestions.length}`, "done");
        startKanjiQuiz();
        return;
    }

    const q = kanjiQuizQuestions[kanjiQuizIndex];
    kanjiQuizAnswered = false;

    document.getElementById("kanji-quiz-curr").textContent = kanjiQuizIndex + 1;
    document.getElementById("kanji-quiz-total").textContent = kanjiQuizQuestions.length;
    document.getElementById("kanji-quiz-score").textContent = kanjiQuizScore;

    const pct = ((kanjiQuizIndex + 1) / kanjiQuizQuestions.length) * 100;
    document.getElementById("kanji-quiz-bar").style.width = `${pct}%`;

    document.getElementById("kanji-quiz-char").textContent = q.questionKanji;

    const feedbackBanner = document.getElementById("kanji-quiz-feedback");
    if (feedbackBanner) feedbackBanner.classList.add("hidden-banner");

    const answersGrid = document.getElementById("kanji-quiz-answers");
    answersGrid.innerHTML = "";

    q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = `<span class="opt-prefix">${String.fromCharCode(65 + idx)}.</span> <span class="opt-text">${opt.kana} (${opt.meaning})</span>`;

        btn.addEventListener("click", () => {
            if (kanjiQuizAnswered) return;
            kanjiQuizAnswered = true;

            const allBtns = answersGrid.querySelectorAll(".option-btn");
            allBtns.forEach(b => b.disabled = true);

            const isCorrect = opt.kanji === q.correctAnswer.kanji;
            if (isCorrect) {
                btn.classList.add("correct");
                kanjiQuizScore++;
                document.getElementById("kanji-quiz-score").textContent = kanjiQuizScore;
                document.getElementById("kanji-feedback-text").textContent = "Chính xác! 🎉";
                playCorrectSound();
            } else {
                btn.classList.add("incorrect");
                btn.classList.add("wrong");
                allBtns.forEach((b, bIdx) => {
                    if (q.options[bIdx].kanji === q.correctAnswer.kanji) {
                        b.classList.add("correct");
                    }
                });
                document.getElementById("kanji-feedback-text").textContent = `Chưa đúng! Đáp án đúng: ${q.correctAnswer.kana} (${q.correctAnswer.meaning})`;
                playWrongSound();
            }

            feedbackBanner.classList.remove("hidden-banner");
        });

        answersGrid.appendChild(btn);
    });
}

function renderKanjiGrid() {
    kanjiWords = getFilteredKanjiWords();
    const container = document.getElementById("kanji-grid-list");
    if (!container) return;

    container.innerHTML = "";

    if (kanjiWords.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">Không tìm thấy từ vựng Kanji nào.</p>`;
        return;
    }

    kanjiWords.forEach(item => {
        const card = document.createElement("div");
        card.className = "kanji-grid-card";
        card.innerHTML = `
            <span class="kanji-grid-unit">${item.unit}</span>
            <button class="table-row-tts-btn kanji-grid-tts" data-kana="${item.kana}" title="Nghe đọc">
                <i class="fa-solid fa-volume-high"></i>
            </button>
            <div class="kanji-grid-char">${item.kanji}</div>
            <div class="kanji-grid-kana">${item.kana}</div>
            <div class="kanji-grid-meaning">${item.meaning}</div>
        `;

        card.querySelector(".kanji-grid-tts").addEventListener("click", (e) => {
            e.stopPropagation();
            speakJapanese(item.kana);
        });

        container.appendChild(card);
    });
}

// ==========================================================================
// SPEAKING PRACTICE ENGINE
// ==========================================================================
let currentSpeakingTopicId = 1;
let speakingEventsInitialized = false;

function initSpeakingPractice() {
    populateSpeakingTopics();
    setupSpeakingEventListenersOnce();
    renderSpeakingTopic();
}

function populateSpeakingTopics() {
    const select = document.getElementById("speaking-topic-select");
    if (!select) return;

    if (select.children.length === 0 && typeof SPEAKING_DATA !== "undefined") {
        SPEAKING_DATA.forEach(topic => {
            const opt = document.createElement("option");
            opt.value = topic.id;
            opt.textContent = topic.title;
            select.appendChild(opt);
        });
    }
}

function setupSpeakingEventListenersOnce() {
    if (speakingEventsInitialized) return;
    speakingEventsInitialized = true;

    const select = document.getElementById("speaking-topic-select");
    if (select) {
        select.addEventListener("change", (e) => {
            currentSpeakingTopicId = parseInt(e.target.value);
            renderSpeakingTopic();
        });
    }
}

function renderSpeakingTopic() {
    if (typeof SPEAKING_DATA === "undefined") return;

    const topic = SPEAKING_DATA.find(t => t.id === currentSpeakingTopicId) || SPEAKING_DATA[0];
    
    document.getElementById("speaking-topic-badge").textContent = `Đề ${topic.id}`;
    document.getElementById("speaking-topic-title").textContent = topic.title;

    const listContainer = document.getElementById("speaking-cards-list");
    if (!listContainer) return;

    listContainer.innerHTML = "";

    topic.questions.forEach((q, idx) => {
        const card = document.createElement("div");
        card.className = "speaking-card";
        card.innerHTML = `
            <div class="speaking-card-num">Câu ${idx + 1}</div>
            
            <!-- Question Box (Giám khảo) -->
            <div class="speaking-box speaking-q-box">
                <div class="speaking-box-header">
                    <span class="speaking-role-label"><i class="fa-solid fa-circle-question"></i> Câu hỏi (Giám khảo)</span>
                    <button class="table-row-tts-btn q-tts-btn" title="Nghe câu hỏi">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
                <div class="speaking-jp-text">${q.qJp}</div>
                <div class="speaking-vi-text">Ý nghĩa: ${q.qVi}</div>
            </div>

            <!-- Answer Box (Thí sinh) -->
            <div class="speaking-box speaking-a-box">
                <div class="speaking-box-header">
                    <span class="speaking-role-label"><i class="fa-solid fa-comment-dots"></i> Câu trả lời gợi ý (Thí sinh)</span>
                    <button class="table-row-tts-btn a-tts-btn" title="Nghe câu trả lời">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
                <div class="speaking-jp-text">${q.aJp}</div>
                <div class="speaking-vi-text">Ý nghĩa: ${q.aVi}</div>
            </div>

            <!-- Tip Box -->
            ${q.tip ? `<div class="speaking-tip-box">${q.tip}</div>` : ''}
        `;

        // Bind TTS listeners
        card.querySelector(".q-tts-btn").addEventListener("click", () => {
            speakJapanese(q.qJp);
        });

        card.querySelector(".a-tts-btn").addEventListener("click", () => {
            speakJapanese(q.aJp);
        });

        listContainer.appendChild(card);
    });
}


