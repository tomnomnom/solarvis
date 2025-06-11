<!doctype html>
<html>
    <head>
        <title>Solar Max</title>
        <style>
            html, body {
                width: 100%;
                margin: 0;
            }
        </style>
    </head>
    <body>
        <!--<audio src=drone.mp3 id=sunsound></audio>-->
        <canvas width=1200 height=600 id=stage></canvas>
        <script src=main.js></script>
        <script>
            const stage = document.getElementById("stage");
            //const sunSound = document.getElementById("sunsound");

            stage.addEventListener("click", e => {
                //sunSound.paused ? sunSound.play() : sunSound.pause();
            });

            const state = {
                fullScreen: false
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

                case 'p':
                    //sunSound.paused ? sunSound.play() : sunSound.pause();
                    break
                }
            });
        </script>
    </body>
</html>
