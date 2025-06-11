navigator.mediaDevices.getUserMedia({audio: true}).then(function(stream){
	const audioCtx = new AudioContext();

	const analyser = audioCtx.createAnalyser();
	analyser.fftSize = 4096;

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
        ctx.shadowBlur = 10;

        ctx.beginPath();

        let totalHeight = 0;

        for (let i = 0; i < bufferLength; i++) {
            let barHeight = (freqData[i] / 255) * sunRadius / 32;
            barHeight = barHeight**2.5;
            barHeight += Math.random()*4;
            totalHeight += freqData[i];

            let spikeWidth = (1-(i/bufferLength)) * 8;

            ctx.moveTo(0, sunRadius);
            ctx.lineTo(-spikeWidth/2, sunRadius);
            ctx.lineTo(0, sunRadius + barHeight);
            ctx.lineTo(spikeWidth, sunRadius);

            ctx.rotate(i+Math.random()/nudgeFactor);
        }

        nudgeFactor = (1-(totalHeight/bufferLength/255))*1500;
        console.log(nudgeFactor)

        let lightness = ((totalHeight/bufferLength/255) * 30) + 70;

        ctx.fillStyle = `hsl(48 100 ${lightness})`;
        ctx.shadowColor = `hsl(48 100 ${lightness})`;

        ctx.fill()

        //ctx.beginPath()
        //ctx.arc(0, 0, sunRadius+2, 0, Math.PI*2);
        //ctx.fill()

        ctx.restore()

	}

	drawFrame();
})
