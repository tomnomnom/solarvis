const canvas = document.getElementById("stage");
const playButton = document.getElementById("playButton");
const inputSound = document.getElementById("inputSound");

canvas.addEventListener("click", e => {
    inputSound.paused ? inputSound.play() : inputSound.pause();
});

const state = {
    fullScreen: false,
    init: false
};

window.addEventListener('keydown', e => {
    switch (e.key) {

    case 'f':
        if (!state.fullScreen) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
        state.fullScreen = !state.fullScreen
        break

    case 'l':
        inputSound.currentTime += 10;
        break;

    case 'k':
        inputSound.currentTime -= 10;
        break;

    case 'p':
        inputSound.paused ? inputSound.play() : inputSound.pause();
        break
    }
});

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", e => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

inputSound.addEventListener("play", e => {
    if (state.init) return;
    state.init = true;
    init();
});

function init() {
    const audioCtx = new AudioContext();

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 4096;

    const sun = audioCtx.createMediaElementSource(inputSound);
    sun.connect(analyser);

    analyser.connect(audioCtx.destination);

    const bufferLength = analyser.frequencyBinCount;
    const freqData = new Uint8Array(bufferLength);

    let nudgeFactor = 1000;
    let progress = 0;

    function drawFrame() {
        requestAnimationFrame(drawFrame);

        progress = inputSound.currentTime / (inputSound.duration * 0.9)
        progress = Math.min(progress, 1)

        analyser.getByteFrequencyData(freqData);

        ctx.fillStyle = "hsl(0 0 10)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const maxSize = Math.min(canvas.width, canvas.height);

        const maxSunRadius = maxSize / 3;
        const minSunRadius = maxSize / 20;
        const sunRadius = minSunRadius + (maxSunRadius - minSunRadius) * progress;

        const endPos = canvas.height/2;
        const startPos = canvas.height + sunRadius;
        const pos = startPos + (endPos - startPos) * progress;

        const maxExponent = 1.8;
        const minExponent = 1;
        const exponent = minExponent + (maxExponent - minExponent) * progress;

        ctx.save()
        ctx.translate(canvas.width/2, pos);
        ctx.shadowBlur = 15;

        ctx.beginPath();

        let totalHeight = 0;

        for (let i = 0; i < bufferLength; i++) {
            let spikeLength = (freqData[i] / 255) * sunRadius/4;
            spikeLength = spikeLength**exponent;
            spikeLength += Math.random()*4;
            totalHeight += freqData[i];

            let spikeWidth = (1-(i/bufferLength)) * 10;

            ctx.moveTo(0, sunRadius);
            ctx.lineTo(-spikeWidth/2, sunRadius);
            ctx.lineTo(0, sunRadius + spikeLength);
            ctx.lineTo(spikeWidth, sunRadius);

            ctx.rotate(i+Math.random()/nudgeFactor);
        }

        nudgeFactor = (1-(totalHeight/bufferLength/255))*1500;

        let lightness = ((totalHeight/bufferLength/255) * 40) + 70;

        ctx.fillStyle = `hsl(40 100 ${lightness})`;
        ctx.shadowColor = `hsl(40 100 ${lightness})`;

        ctx.fill()

        //ctx.beginPath()
        //ctx.arc(0, 0, sunRadius+2, 0, Math.PI*2);
        //ctx.fill()

        ctx.restore()

    }

    drawFrame();
}


