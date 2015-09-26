define(function(require) {

    require('lib/jquery');
    var Scene = require('scene');

    var basicVert = require('text!shaders/basic.vert');
    var circleFrag = require('text!shaders/circle.frag');
    var copyFrag = require('text!shaders/copy.frag');
    // var blurFrag = require('text!shaders/blur.frag');
    var bleedFrag = require('text!shaders/bleed.frag');
    var paintFrag = require('text!shaders/paint.frag');
    var grayscottFrag = require('text!shaders/grayscott-pmneila.frag');

    var previousPower = function(x) {
        x = x | (x >> 1);
        x = x | (x >> 2);
        x = x | (x >> 4);
        x = x | (x >> 8);
        x = x | (x >> 16);
        return x - (x >> 1);
    }

    var scene = new Scene(
        previousPower(document.body.clientWidth),
        previousPower(document.body.clientHeight)
    );
    var originProg = scene.createProgramInfo(basicVert, circleFrag);
    var paintProg = scene.createProgramInfo(basicVert, paintFrag);
    // var blurProg = scene.createProgramInfo(basicVert, blurFrag);
    var bleedProg = scene.createProgramInfo(basicVert, bleedFrag);
    var copyProg = scene.createProgramInfo(basicVert, copyFrag);
    var grayscottProg = scene.createProgramInfo(basicVert, grayscottFrag);

    var scale = 2;
    var simulationBufferA = scene.createBuffer(
        scene.width / scale,
        scene.height / scale
    );
    var simulationBufferB = scene.createBuffer(
        scene.width / scale,
        scene.height / scale
    );
    var bleedBuffer = scene.createBuffer(
        scene.width,
        scene.height
    );
    var paintBufferA = scene.createBuffer(
        scene.width,
        scene.height
    );
    var paintBufferB = scene.createBuffer(
        scene.width,
        scene.height
    );

    scene.draw({
        program: originProg,
        output: simulationBufferA
    });

    var mouse = [0.5, 0.5];
    var mousedown = false;

    var $canvas = $(scene.canvas);

    $canvas.mousemove(function(evt) {
        var offset = $canvas.offset();
        mouse[0] = (evt.pageX - offset.left) / $canvas.width();
        mouse[1] = 1 - ((evt.pageY - offset.top) / $canvas.height());
    });

    $canvas.mousedown(function() {
        mousedown = true;
    });

    $canvas.mouseup(function() {
        mousedown = false;
    });

    var mLastTime = Number(new Date());

    function simulate(time, dt, input, output) {
        scene.draw({
            program: grayscottProg,
            uniforms: {
                time: time,
                delta: dt,
                // feed: 0.037,
                // kill: 0.06,
                feed: 0.03,
                kill: 0.062,
                mouse: mouse,
                mousedown: mousedown
            },
            inputs: {
                tSource: input
            },
            output: output
        });
    }

    function applyBleed(input, output) {
        // Bleed X
        scene.draw({
            program: bleedProg,
            uniforms: {
                direction: [1, 0]
            },
            inputs: {
                u_texture: input
            },
            output: bleedBuffer
        });

        // Bleed Y
        scene.draw({
            program: bleedProg,
            uniforms: {
                direction: [0, 1]
            },
            inputs: {
                u_texture: bleedBuffer
            },
            output: output
        });
    }

    function render(time) {
        var dt = (time - mLastTime)/20.0;
        if(dt > 0.8 || dt<=0)
            dt = 0.8;
        mLastTime = time;

        var steps = 8; // Must be even
        var lastOutput = simulationBufferA;

        for (var i = 0; i < steps; i++) {
            var input = lastOutput;
            var output = (lastOutput === simulationBufferA) ? simulationBufferB : simulationBufferA;
            lastOutput = output;
            simulate(time, dt, input, output);
        }

        // Paint
        scene.draw({
            program: paintProg,
            uniforms: {
                threshold: 0.25,
                hue: (time * 0.0001) % 1
            },
            inputs: {
                u_texture: paintBufferA,
                u_texture_mask: simulationBufferA
            },
            output: paintBufferB
        });

        var steps = 3; // Must be odd
        var lastOutput = paintBufferB;

        for (var i = 0; i < steps; i++) {
            var input = lastOutput;
            var output = (lastOutput === paintBufferA) ? paintBufferB : paintBufferA;
            lastOutput = output;
            applyBleed(input, output);
        }

        scene.draw({
            program: copyProg,
            inputs: {
                u_texture: paintBufferA,
            }
        });

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
});
