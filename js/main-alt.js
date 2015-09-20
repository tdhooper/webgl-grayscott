define(function(require) {

    var VERTICAL = 1;
    var HORIZONTAL = 2;

    var Scene = require('scene');

    var basicVert = require('text!shaders/basic.vert');
    var circleFrag = require('text!shaders/circle.frag');
    var blurFrag = require('text!shaders/blur2.frag');
    var greyscottFrag = require('text!shaders/greyscott-alt.frag');

    var scene = new Scene();
    var originProg = scene.createProgramInfo(basicVert, circleFrag);
    var blurProg = scene.createProgramInfo(basicVert, blurFrag);
    var greyscottProg = scene.createProgramInfo(basicVert, greyscottFrag);

    var bufferA = scene.createBuffer();
    var bufferB = scene.createBuffer();
    var bufferC = scene.createBuffer();
    var bufferD = scene.createBuffer();
    var lastBuffer;

    scene.draw({
        program: originProg,
        output: bufferA
    });

    var updateRequired = true;

    function simulateLoop() {
        if (updateRequired) {
            simulate();
            updateRequired = false;
        }
        setTimeout(simulateLoop, 1000 / 120);
    }

    function applyBlur(input, output, direction) {
        var blur = 1;

        if (direction === VERTICAL) {
            dir = [0, 1];
        } else {
            dir = [1, 0];
        }

        scene.draw({
            program: blurProg,
            uniforms: {
                dir: dir,
                ammount: blur
            },
            inputs: {
                u_texture: input
            },
            output: output
        });
    }

    function applyBlurMultiple(input, store, output, count) {
        count--;
        var i = 0;
        while (i < count) {
            applyBlur(input, store, VERTICAL);
            applyBlur(store, input, HORIZONTAL);
            i++;
        }
        applyBlur(input, store, VERTICAL);
        applyBlur(store, output, HORIZONTAL);
    }

    var startTime = Number(new Date());

    function applyGreyscott(input, output, delta) {
        scene.draw({
            program: greyscottProg,
            uniforms: {
                delta: delta,
                feed: 0.037,
                kill: 0.06
            },
            inputs: {
                tSource: input,
            },
            output: output
        });
    }

    var time = Number(new Date());

    function simulate() {
        var now = Number(new Date());
        var delta = now - time;
        time = now;
        // Blur 1
        // applyBlurMultiple(bufferA, bufferB, bufferC, 4)

        // // Blur 2
        // applyBlurMultiple(bufferC, bufferA, bufferB, 4)

        // Grey-Scott

        applyGreyscott(bufferA, bufferB, delta);
        applyGreyscott(bufferB, bufferA, delta);

    }

    function render() {
        scene.drawLastBuffer();
        updateRequired = true;
        requestAnimationFrame(render);
    }
    simulateLoop();
    requestAnimationFrame(render);
});
