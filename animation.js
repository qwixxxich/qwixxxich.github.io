var images_slot = [];
var gameItems = [];
var spinningVideos = [];
var endVideos = [];
var imagesLoaded = 0;

machine = {
    x: 50,
    y: 25,
    width: 625,
    height: 625,
}

button_spin = {
    x: 505 + machine.x,
    y: 178 + machine.y,
    width: 48,
    height: 203,
    state: true
};

slot = {
    x: [
        machine.x + 162,
        machine.x + 258,
        machine.x + 357.5,
    ],
    y: machine.y + 212.5,
    width: 75,
    height: 100,
    slot: [4, 4, 4]
}

var imageSources = [
    'slot_states/slot.png',
    'slot_states/slot_1.png',
    'slot_states/slot_2.png',
    'slot_states/slot_3.png',
    'slot_states/slot_4.png',
    'slot_states/slot_5.png',
    'slot_states/slot_6.png',
];
var gameItemSources = [
    'items/banana.png',
    'items/coin.png',
    'items/gorilla.png',
    'items/chest.png',
    'items/seven.png'
];

var spinningAnimation = [
    'spinning_anim/spinning.mp4',
    'spinning_anim/spinning_mid.mp4',
    'spinning_anim/spinning_long.mp4'
]

var endAnimation = [
    'end_animations/banana.mp4',
    'end_animations/coin.mp4',
    'end_animations/gorilla.mp4',
    'end_animations/chest.mp4',
    'end_animations/seven.mp4'
]

function preloadImages() {
    var totalAssets = imageSources.length + gameItemSources.length + spinningAnimation.length + endAnimation.length;
    for (let i = 0; i < imageSources.length; i++) {
        images_slot[i] = new Image();
        images_slot[i].src = imageSources[i];
        images_slot[i].onload = function () {
            assetsLoaded(totalAssets);
        };
    }
    for (let i = 0; i < gameItemSources.length; i++) {
        gameItems[i] = new Image();
        gameItems[i].src = gameItemSources[i];
        gameItems[i].onload = function () {
            assetsLoaded(totalAssets);
        };
    }
    for (let i = 0; i < spinningAnimation.length; i++) {
        spinningVideos[i] = document.createElement('video');
        spinningVideos[i].src = spinningAnimation[i];
        spinningVideos[i].onloadeddata = function () {
            assetsLoaded(totalAssets);
        };
    }

    for (let i = 0; i < endAnimation.length; i++) {
        endVideos[i] = document.createElement('video');
        endVideos[i].src = endAnimation[i];
        endVideos[i].onloadeddata = function () {
            assetsLoaded(totalAssets);
        };
    }
}

function assetsLoaded(totalAssets) {
    imagesLoaded++;
    if (imagesLoaded === totalAssets) {
        drawSlotMachine();
        canvas.addEventListener('click', onCanvasClick);
    }
}

function drawMachine() {
    canvasContext.drawImage(images_slot[0], machine.x, machine.y, machine.width, machine.height);
}
function drawSlots() {
    for (let i = 0; i < 3; i++) {
        canvasContext.drawImage(gameItems[slot.slot[i]], slot.x[i], slot.y, slot.width, slot.height);
    }
}

function drawSlotMachine() {
    drawSlots()
    drawMachine()
}

function onCanvasClick(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    var isX = x > button_spin.x && x < button_spin.x + button_spin.width;
    var isY = y > button_spin.y && y < button_spin.y + button_spin.height;

    if (button_spin.state && isX && isY) {
        if (balance >= 50) {
            button_spin.state = false;
            decreaseBalance();
            startAnimation();
        } else {
            alert("Недостаточно средств для попытки!");
        }
    }
}

function rand(start, end) {
    return start + Math.random() * (end - start)
}

function setRandSlots() {
    var isWin = Math.random() < 0.4;
    if (isWin) {
        var winningItem = Math.floor(rand(0, 5));
        for (let i = 0; i < 3; i++) {
            slot.slot[i] = winningItem;
        }
    } else {
        do {
            for (let i = 0; i < 3; i++) {
                slot.slot[i] = Math.floor(rand(0, 5));
            }
        } while (slot.slot[0] === slot.slot[1] && slot.slot[1] === slot.slot[2]);
    }
}

function checkWin() {
    return slot.slot[0] === slot.slot[1] && slot.slot[1] === slot.slot[2];
}

function displayWinWindow() {
    alert('Поздравляем! Вы выиграли 200!');
    increaseBalance();
    confetti({
        particleCount: 200,
        spread: 100,
        origin: { x: 0.5, y: 0.5 }
    });

}


function createSpinAnimation(callback) {
    var spins_outcome = slot.slot;

    var video1_spin = spinningVideos[0];
    var video1_end = endVideos[spins_outcome[0]];
    var video2_spin = spinningVideos[1];
    var video2_end = endVideos[spins_outcome[1]];
    var video3_spin = spinningVideos[2];
    var video3_end = endVideos[spins_outcome[2]];

    playVideos([
        { spin: video1_spin, end: video1_end },
        { spin: video2_spin, end: video2_end },
        { spin: video3_spin, end: video3_end }
    ], callback);
}

function playVideos(list, callback) {
    var video1_spin = list[0]['spin'];
    var video1_end = list[0]['end'];
    var video2_spin = list[1]['spin'];
    var video2_end = list[1]['end'];
    var video3_spin = list[2]['spin'];
    var video3_end = list[2]['end'];

    video1_spin.play();
    video2_spin.play();
    video3_spin.play();

    [video1_spin, video1_end, video2_spin, video2_end, video3_spin, video3_end].forEach(function(video) {
        video.muted = true;
        video.currentTime = 0;
    });

    function renderFrame() {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        canvasContext.drawImage(images_slot[images_slot.length - 1], machine.x, machine.y, machine.width, machine.height);

        drawVideoFrame(video1_spin, video1_end, slot.x[0], slot.y, slot.width, slot.height);
        drawVideoFrame(video2_spin, video2_end, slot.x[1], slot.y, slot.width, slot.height);
        drawVideoFrame(video3_spin, video3_end, slot.x[2], slot.y, slot.width, slot.height);

        var allVideosEnded = checkAllVideosEnded();

        if (!allVideosEnded) {
            requestAnimationFrame(renderFrame);
        } else {
            if (callback) {
                callback();
            } else {
                button_spin.state = true;
                drawSlotMachine();
            }
        }
    }

    function drawVideoFrame(spinVideo, endVideo, x, y, width, height) {
        if (!spinVideo.ended) {
            canvasContext.drawImage(spinVideo, x, y, width, height);
        } else if (!endVideo.ended) {
            if (endVideo.currentTime === 0) {
                endVideo.play();
            }
            canvasContext.drawImage(endVideo, x, y, width, height);
        } else {
            var slotIndex = slot.x.indexOf(x);
            canvasContext.drawImage(gameItems[slot.slot[slotIndex]], x, y, width, height);
        }
    }

    function checkAllVideosEnded() {
        return (
            videoEnded(video1_spin, video1_end) &&
            videoEnded(video2_spin, video2_end) &&
            videoEnded(video3_spin, video3_end)
        );
    }

    function videoEnded(spinVideo, endVideo) {
        return spinVideo.ended && endVideo.ended;
    }

    renderFrame();
}

function startAnimation() {
    var currentFrame = 0;
    var totalFrames = images_slot.length - 1;
    var animationInterval = 30;
    var forward = true;

    function animateLever() {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);

        drawSlots();

        canvasContext.drawImage(images_slot[currentFrame], machine.x, machine.y, machine.width, machine.height);

        if (forward) {
            if (currentFrame < totalFrames) {
                currentFrame++;
                requestAnimationFrame(animateLever);
            } else {
                setRandSlots();
                createSpinAnimation(function () {
                    forward = false;
                    animateLever();
                });
            }
        } else {
            if (currentFrame > 0) {
                currentFrame--;
                requestAnimationFrame(animateLever);
            } else {
                button_spin.state = true;
                if (checkWin()) {
                    displayWinWindow();
                }
            }
        }
    }

    animateLever();
}
function launchConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}