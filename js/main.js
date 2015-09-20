define(function(require) {

    var Scene = require('scene');

    var basicVert = require('text!shaders/basic.vert');
    var circleFrag = require('text!shaders/circle.frag');
    var copyFrag = require('text!shaders/copy.frag');
    var blurFrag = require('text!shaders/blur.frag');
    var greyscottFrag = require('text!shaders/greyscott.frag');

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
    var blurProg = scene.createProgramInfo(basicVert, blurFrag);
    var copyProg = scene.createProgramInfo(basicVert, copyFrag);
    var greyscottProg = scene.createProgramInfo(basicVert, greyscottFrag);

    var scale = 1;
    var bufferA = scene.createBuffer(
        scene.width / scale,
        scene.height / scale
    );
    var bufferB = scene.createBuffer(
        scene.width / scale,
        scene.height / scale
    );
    var bufferC = scene.createBuffer(
        scene.width / scale,
        scene.height / scale
    );

    scene.draw({
        program: originProg,
        output: bufferA
    });

    var mLastTime = Number(new Date());

    function applyBlur(n, input, outputSmall, outputLarge) {

        var lastOutput = input

        for (var i = 0; i < n * 2; i++) {

            if (i < n) {
                scene.draw({
                    program: blurProg,
                    uniforms: {
                        direction: [1.0, 0.0]
                    },
                    inputs: {
                        u_texture: lastOutput
                    },
                    output: outputLarge
                });
                scene.draw({
                    program: blurProg,
                    uniforms: {
                        direction: [0.0, 1.0]
                    },
                    inputs: {
                        u_texture: outputLarge
                    },
                    output: outputSmall
                });
                lastOutput = outputSmall;

            } else {
                scene.draw({
                    program: blurProg,
                    uniforms: {
                        direction: [1.0, 0.0]
                    },
                    inputs: {
                        u_texture: lastOutput
                    },
                    output: input
                });
                scene.draw({
                    program: blurProg,
                    uniforms: {
                        direction: [0.0, 1.0]
                    },
                    inputs: {
                        u_texture: input
                    },
                    output: outputLarge
                });
                lastOutput = outputLarge;
            }
        }

    }

    function render(time) {
        var dt = (time - mLastTime)/20.0;
        if(dt > 0.8 || dt<=0)
            dt = 0.8;
        mLastTime = time;

        var steps = 1;

        for (var i = 0; i < steps; i++) {
            applyBlur(8, bufferA, bufferB, bufferC)
        }

        scene.draw({
            program: greyscottProg,
            inputs: {
                u_sample_small: bufferB,
                u_sample_large: bufferC,
            },
            output: bufferA
        });

        scene.draw({
            program: copyProg,
            inputs: {
                u_texture: bufferA
            }
        });

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
});
