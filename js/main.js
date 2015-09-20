define(function(require) {

    var Scene = require('scene');

    var basicVert = require('text!shaders/basic.vert');
    var circleFrag = require('text!shaders/circle.frag');
    var thresholdFrag = require('text!shaders/threshold.frag');
    var greyscottFrag = require('text!shaders/greyscott-pmneila.frag');

    var nearestPower = function(n) {
        n--;
        n |= n >> 1;
        n |= n >> 2;
        n |= n >> 4;
        n |= n >> 8;
        n |= n >> 16;
        n++;
        return n;
    }

    var scene = new Scene(
        nearestPower(document.body.clientWidth),
        nearestPower(document.body.clientHeight)
    );
    var originProg = scene.createProgramInfo(basicVert, circleFrag);
    var thresholdProg = scene.createProgramInfo(basicVert, thresholdFrag);
    var greyscottProg = scene.createProgramInfo(basicVert, greyscottFrag);

    var scale = 4;
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
                program: greyscottProg,
                uniforms: {
                    delta: dt,
                    feed: 0.037,
                    kill: 0.06
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
