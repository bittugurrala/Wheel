// ===========================================
// ELEMENTS
// ===========================================
const bubbleContainer = document.getElementById("bubble-container");
const wheel = document.querySelector(".rotating-wheel");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

const targetValueBox = document.getElementById("target-value");


// ===========================================
// GAME SETTINGS
// ===========================================
let mode = "alphabets";   // alphabets / numbers

let wheelPaused = false;

let therapyColors = [
    "#FFD600", "#00A6FF", "#FF1E1E", "#00D26A",
    // "#BB6BD9", "#F2994A", "#EB5757"
];

let bubblePositions = [];
let currentTarget = "";
let poppingTargetActive = false;


// ===========================================
// UPDATE TARGET DISPLAY
// ===========================================
function updateTargetDisplay() {
    targetValueBox.innerText = currentTarget;
}


// ===========================================
// GET EXISTING SYMBOLS FROM BUBBLES
// ===========================================
function getRemainingSymbols() {
    let set = new Set();
    document.querySelectorAll(".bubble").forEach(b => {
        set.add(b.innerText);
    });
    return Array.from(set);
}


// ===========================================
// START NEW SET OF 12 BUBBLES
// ===========================================
function startLevel() {
    bubbleContainer.innerHTML = "";
    bubblePositions = [];
    poppingTargetActive = false;

    // Generate 12 random bubbles (no fixed target)
    for (let i = 0; i < 12; i++) {
        createBubble(randomSymbol());
    }

    chooseNextTarget(); // pick a target from existing bubbles
}


// ===========================================
// RANDOM SYMBOL GENERATOR
// ===========================================
function randomSymbol() {
    if (mode === "alphabets") {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return letters[Math.floor(Math.random() * letters.length)];
    } else {
        const nums = "0123456789";
        return nums[Math.floor(Math.random() * nums.length)];
    }
}


// ===========================================
// CREATE CIRCLE-SAFE RANDOM PLACEMENT BUBBLE
// ===========================================
function createBubble(symbol) {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.innerText = symbol;
    bubble.style.background = therapyColors[Math.floor(Math.random() * therapyColors.length)];

    const wheelSize = bubbleContainer.clientWidth;
    const bubbleRadius = (wheelSize * 0.10) / 2;

    let pos;
    let valid = false;

    // Try 80 attempts for a safe position
    for (let attempt = 0; attempt < 80; attempt++) {
        const angle = Math.random() * 2 * Math.PI;
        const maxR = (wheelSize / 2) - bubbleRadius;
        const radius = Math.sqrt(Math.random()) * maxR;

        const x = 50 + (radius * Math.cos(angle)) / (wheelSize / 100);
        const y = 50 + (radius * Math.sin(angle)) / (wheelSize / 100);

        pos = { x, y };

        if (!checkOverlap(pos, bubbleRadius)) {
            valid = true;
            break;
        }
    }

    if (!valid) return;

    bubblePositions.push(pos);
    bubble.style.left = pos.x + "%";
    bubble.style.top = pos.y + "%";

    bubble.onclick = () => handleBubbleClick(bubble, symbol);

    bubbleContainer.appendChild(bubble);
}


// ===========================================
// COLLISION CHECK
// ===========================================
function checkOverlap(pos, radius) {
    for (const p of bubblePositions) {
        const dx = p.x - pos.x;
        const dy = p.y - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 12) return true;
    }
    return false;
}



// ===========================================
// SELECT NEW TARGET FROM EXISTING BUBBLES
// ===========================================
function chooseNextTarget() {
    let remaining = getRemainingSymbols();

    if (remaining.length === 0) {
        // all bubbles popped → new set
        setTimeout(startLevel, 400);
        return;
    }

    // choose random from existing values
    currentTarget = remaining[Math.floor(Math.random() * remaining.length)];

    updateTargetDisplay();
    poppingTargetActive = true;
}



// ===========================================
// POP BUBBLE CLICK HANDLER
// ===========================================
function handleBubbleClick(bubble, symbol) {

    if (!poppingTargetActive) return;

    if (symbol === currentTarget) {

        correctSound.play();
        bubble.classList.add("pop");

        setTimeout(() => {
            bubble.remove();

            // check if any bubbles with this target remain
            let stillLeft = false;
            document.querySelectorAll(".bubble").forEach(b => {
                if (b.innerText === currentTarget) stillLeft = true;
            });

            if (!stillLeft) {
                // finished this target → choose next
                setTimeout(() => chooseNextTarget(), 300);
            }

        }, 250);

    } else {
        wrongSound.play();
        bubble.classList.add("wrong");

        setTimeout(() => {
            bubble.classList.remove("wrong");
        }, 300);

    }
}



// ===========================================
// SPEED CONTROL
// ===========================================
document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        let text = btn.innerText;

        if (text.includes("x")) {
            let speed = parseFloat(text.replace("x", ""));
            wheel.style.animationDuration = (25 / speed) + "s";
        }

        if (text === "Reset") startLevel();
        if (text === "Quit") quitGame();
    });
});


// ===========================================
// MODE SWITCH
// ===========================================
document.querySelector(".modeSwitch").addEventListener("click", () => {
    mode = (mode === "alphabets") ? "numbers" : "alphabets";
    startLevel();
});


// ===========================================
// PLAY / PAUSE WHEEL
// ===========================================
document.querySelector(".playpause").addEventListener("click", () => {
    if (wheelPaused) {
        wheel.style.animationPlayState = "running";
        document.querySelector(".playpause i").classList.replace("fa-play", "fa-pause");
        wheelPaused = false;
    } else {
        wheel.style.animationPlayState = "paused";
        document.querySelector(".playpause i").classList.replace("fa-pause", "fa-play");
        wheelPaused = true;
    }
});


// ===========================================
// QUIT
// ===========================================
function quitGame() {
    bubbleContainer.innerHTML = "";
    targetValueBox.innerText = "";
    alert("Game Stopped");
}


// ===========================================
// INIT GAME
// ===========================================
startLevel();
