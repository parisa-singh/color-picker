const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorDisplay = document.getElementById("colorDisplay");
const hexCode = document.getElementById("hexCode");
const copyBtn = document.getElementById("copyBtn");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 200;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let img = new Image();
let zoomLevel = 1;
let offsetX = 0; 
let offsetY = 0;

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

img.onload = function () {
    zoomLevel = 1;
    offsetX = 0;
    offsetY = 0;
    drawImage();
};

function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let scale = Math.min(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height) * zoomLevel;
    let newWidth = img.width * scale;
    let newHeight = img.height * scale;
    
    offsetX = (CANVAS_WIDTH - newWidth) / 2;
    offsetY = (CANVAS_HEIGHT - newHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
}

// Zoom In and Out 
zoomInBtn.addEventListener("click", () => {
    if (zoomLevel < 5) {  
        zoomLevel += 0.2;
        drawImage();
    }
});

zoomOutBtn.addEventListener("click", () => {
    if (zoomLevel > 1) {  
        zoomLevel -= 0.2;
        drawImage();
    }
});

// Color Picker on Canvas
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);

    colorDisplay.style.backgroundColor = hex;
    hexCode.textContent = hex;
});

// Copy HEX Code
copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(hexCode.textContent).then(() => {
        alert("HEX Code Copied: " + hexCode.textContent);
    });
});

// Convert RGB to HEX
function rgbToHex(r, g, b) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}
