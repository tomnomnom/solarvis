<!doctype html>
<html>
    <head>
        <title>Solar Max</title>
        <style>
            html, body {
                width: 100%;
                margin: 0;
                background: hsl(0 0 10);
            }
            canvas {
                filter: url(#svg-filter);
            }
            audio {
                display: none;
            }
        </style>
    </head>
    <body>
        <audio src=drone.mp3 id=inputSound preload=auto></audio>
        <canvas width=1200 height=600 id=stage></canvas>
        <script src=main.js?<?=uniqid()?>></script>

        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <filter id="svg-filter" color-interpolation-filters="sRGB">
                    <feMorphology operator="erode" radius="5" />
                </filter>
            </defs>
        </svg>
    </body>
</html>
