let minutes = 25;
let seconds = 0;
let interval;
let isBreak = false;
let workMinutes = 25;
let breakMinutes = 5;


// Function to update the timer display
function updateDisplay() {
    document.getElementById("minTens").innerText = Math.floor(minutes / 10);
    document.getElementById("minOnes").innerText = minutes % 10;
    document.getElementById("secTens").innerText = Math.floor(seconds / 10);
    document.getElementById("secOnes").innerText = seconds % 10;
}

// Function to start the countdown timer
function startTimer() {
    if (interval) return; 
    interval = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(interval);
                interval = null;
                if (!isBreak) {
                    isBreak = true;
                    minutes = breakMinutes;
                    alert("Time for a break!");
                } else {
                    isBreak = false;
                    minutes = workMinutes;
                    alert("Back to work!");
                }
                startTimer(); // Auto-start the next session
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        triggerFlipAnimation();
        updateDisplay();

    }, 1000);
}


// Function to add flip animation to changing digits
function triggerFlipAnimation() {
    let secOnes = document.getElementById("secOnes");
    secOnes.classList.add("animate");
    setTimeout(() => {
        secOnes.classList.remove("animate");
    }, 500);
}

// Reset timer to default 25:00
function resetTimer() {
    clearInterval(interval);
    interval = null;
    minutes = 25;
    seconds = 0;
    triggerFlipAnimation();
    updateDisplay();

}

// Background change functionality
document.querySelectorAll(".background-selector button").forEach(button => {
    button.addEventListener("click", () => {
        const bg = button.getAttribute("data-bg");
        document.body.style.backgroundImage = bg ? `url('images/${bg}')` : "none";
    });
});

document.getElementById("reset-bg").addEventListener("click", () => {
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "black";
});

// Soundboard functionality
let currentAudio = null;
let isMuted = false;

document.querySelectorAll(".soundboard button").forEach(button => {
    button.addEventListener("click", () => {
        if (button.id === "mute-sounds") {
            isMuted = !isMuted;
            if (currentAudio) {
                if (isMuted) {
                    currentAudio.pause();
                } else {
                    currentAudio.play();
                }
            }
        } else {
            if (isMuted) {
                isMuted = false; // Automatically unmute when a sound is clicked
            }
            if (currentAudio) currentAudio.pause(); // Stop the previous sound
            currentAudio = new Audio(`sounds/${button.getAttribute("data-sound")}`);
            currentAudio.loop = true;
            if (!isMuted) {
                currentAudio.play();
            }
        }
    });
});


// Event listeners for buttons
document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("reset").addEventListener("click", resetTimer);

// Initialize display on page load
triggerFlipAnimation();
updateDisplay();

document.getElementById("add-playlist").addEventListener("click", () => {
    let userPlaylist = prompt("Enter your YouTube or Spotify playlist URL:");

    if (userPlaylist) {
        if (userPlaylist.includes("youtube.com") || userPlaylist.includes("youtu.be")) {
            savePlaylist(userPlaylist, "youtube");
        } else if (userPlaylist.includes("spotify.com")) {
            savePlaylist(userPlaylist, "spotify");
        } else {
            alert("Invalid link. Please enter a valid YouTube or Spotify playlist.");
        }
    }
});

// Function to save and embed the playlist
function savePlaylist(link, type) {
    localStorage.setItem("userPlaylist", link); // Save the link so it stays even after refresh
    localStorage.setItem("playlistType", type);
    embedPlaylist(link, type);
}

// Function to embed the playlist
function embedPlaylist(link, type) {
    const container = document.getElementById("playlist-container");
    container.innerHTML = ""; // Clear previous embed

    let embedCode = "";

    if (type === "youtube") {
        // Convert a YouTube playlist link into an embedded iframe
        let videoId = new URL(link).searchParams.get("list");
        embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    } else if (type === "spotify") {
        // Convert a Spotify link into an embedded iframe
        let embedUrl = link.replace("open.spotify.com", "embed.spotify.com");
        embedCode = `<iframe style="border-radius:12px" src="${embedUrl}" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
    }

    container.innerHTML = embedCode;
}

// Load saved playlist if available
window.onload = () => {
    const savedPlaylist = localStorage.getItem("userPlaylist");
    const savedType = localStorage.getItem("playlistType");

    if (savedPlaylist && savedType) {
        embedPlaylist(savedPlaylist, savedType);
    }
};
