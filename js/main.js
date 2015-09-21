define(function(require) {

    require('lib/jquery');
    var Scene = require('scene');

    var basicVert = require('text!shaders/basic.vert');
    var circleFrag = require('text!shaders/circle.frag');
    var thresholdFrag = require('text!shaders/threshold.frag');
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
    var thresholdProg = scene.createProgramInfo(basicVert, thresholdFrag);
    var grayscottProg = scene.createProgramInfo(basicVert, grayscottFrag);

    var scale = 2;
    var bufferA = scene.createBuffer(
        scene.width / scale,
        scene.height / scale
    );
    var bufferB = scene.createBuffer(
        scene.width / scale,
        scene.height / scale
    );

    scene.draw({
        program: originProg,
        output: bufferA
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

    function render(time) {
        var dt = (time - mLastTime)/20.0;
        if(dt > 0.8 || dt<=0)
            dt = 0.8;
        mLastTime = time;

        var steps = 8;
        var lastOutput = bufferA;

        for (var i = 0; i < steps; i++) {
            var input = lastOutput;
            var output = (lastOutput === bufferA) ? bufferB : bufferA;
            lastOutput = output;
            scene.draw({
                program: grayscottProg,
                uniforms: {
                    time: time,
                    delta: dt,
                    feed: 0.037,
                    kill: 0.06,
                    mouse: mouse,
                    mousedown: mousedown
                },
                inputs: {
                    tSource: input
                },
                output: output
            });
        }

        scene.draw({
            program: thresholdProg,
            uniforms: {
                threshold: 0.2
            },
            inputs: {
                u_texture: bufferA
            }
        });

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
});
