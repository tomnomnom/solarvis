navigator.mediaDevices.getUserMedia({audio: true}).then(function(stream){
    const audioCtx = new AudioContext();

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 4096;
    //analyser.connect(audioCtx.destination);

    //const sunSound = document.getElementById("sunsound");
    //const sun = audioCtx.createMediaElementSource(sunSound);
    //sun.connect(analyser);

    const microphone = audioCtx.createMediaStreamSource(stream);
    microphone.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const freqData = new Uint8Array(bufferLength);

    const canvas = document.getElementById("stage");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", e => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    let nudgeFactor = 1000;

    function drawFrame() {
        requestAnimationFrame(drawFrame);

        analyser.getByteFrequencyData(freqData);

        ctx.fillStyle = "hsl(0 0 10)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const maxSize = Math.min(canvas.width, canvas.height);
        const sunRadius = maxSize / 3;

        ctx.save()
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.shadowBlur = 15;

        ctx.beginPath();

        let totalHeight = 0;

        for (let i = 0; i < bufferLength; i++) {
            let spikeLength = (freqData[i] / 255) * sunRadius / 80;
            spikeLength = spikeLength**4;
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

        let lightness = ((totalHeight/bufferLength/255) * 30) + 70;

        ctx.fillStyle = `hsl(40 100 ${lightness})`;
        ctx.shadowColor = `hsl(40 100 ${lightness})`;

        ctx.fill()

        //ctx.beginPath()
        //ctx.arc(0, 0, sunRadius+2, 0, Math.PI*2);
        //ctx.fill()

        ctx.restore()

    }

    drawFrame();
});

