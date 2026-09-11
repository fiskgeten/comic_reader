const comicSelect = document.getElementById("comic-select");
const imageDisplay = document.getElementById("image-display");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let comics = {};
let currentComic = "";
let currentIndex = 0;
let touchStartX = 0; // X-coordinate where the touch started
let touchEndX = 0;   // X-coordinate where the touch ended

// Load comics.json
fetch("comics.json")
    .then((response) => response.json())
    .then((data) => {
        comics = data;
        populateComicSelect();
        selectComic(Object.keys(comics)[0]); // Load the first comic by default
    });

// Populate the dropdown with comic names
function populateComicSelect() {
    comicSelect.innerHTML = "";
    for (const comic in comics) {
        const option = document.createElement("option");
        option.value = comic;
        option.textContent = comic;
        comicSelect.appendChild(option);
    }
}

// Display the selected comic
function selectComic(comic) {
    currentComic = comic;
    currentIndex = 0;
    displayImage();
}

// Display the current image
function displayImage() {
    if (comics[currentComic] && comics[currentComic][currentIndex]) {
        imageDisplay.src = `images/${currentComic}/${comics[currentComic][currentIndex]}`;
    }
}

// Navigate to the next image
function nextImage() {
    if (currentComic && currentIndex < comics[currentComic].length - 1) {
        currentIndex++;
        displayImage();
    }
}

// Navigate to the previous image
function prevImage() {
    if (currentComic && currentIndex > 0) {
        currentIndex--;
        displayImage();
    }
}

// Event listeners
comicSelect.addEventListener("change", (e) => selectComic(e.target.value));
prevBtn.addEventListener("click", prevImage);
nextBtn.addEventListener("click", nextImage);
imageDisplay.addEventListener("click", nextImage);

// Handle swipe gestures
imageDisplay.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX; // Record the starting touch position
});

imageDisplay.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX; // Record the ending touch position
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance (in pixels) for a swipe to be recognized
    const swipeDistance = touchStartX - touchEndX;

    if (swipeDistance > swipeThreshold) {
        // Swipe left: Go to next image
        nextImage();
    } else if (swipeDistance < -swipeThreshold) {
        // Swipe right: Go to previous image
        prevImage();
    }
}
