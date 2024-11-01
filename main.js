var canvas = document.getElementById('canvas');
var canvasContext = canvas.getContext('2d');

var user = {
    balance: 1000
}

function resizeCanvas() {
    canvas.width = 700;
    canvas.height = 650;
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

canvasContext.fillStyle = '#ffffff';
canvasContext.fillRect(0, 0, canvas.width, canvas.height);

window.onload = function() {
    preloadImages();
};

