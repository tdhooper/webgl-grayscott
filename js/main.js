define(function(require) {

    var Scene = require('scene');

    var basicVert = require('text!shaders/basic.vert');
    var circleFrag = require('text!shaders/circle.frag');
    var copyFrag = require('text!shaders/copy.frag');
    var blurFrag = require('text!shaders/blur.frag');
    var blendFrag = require('text!shaders/blend.frag');
    var reactdiffFrag = require('text!shaders/reactdiff.frag');

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
    var blendProg = scene.createProgramInfo(basicVert, blendFrag);
    var reactdiffProg = scene.createProgramInfo(basicVert, reactdiffFrag);

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
    var bufferD = scene.createBuffer(
        scene.width / scale,
        scene.height / scale
    );
    var bufferE = scene.createBuffer(
        scene.width / scale,
        scene.height / scale
    );

    scene.draw({
        program: originProg,
        output: bufferA
    });

    var mLastTime = Number(new Date());

    function applyBlur(n, input, buffer, outputSmall, outputLarge) {

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
                    output: buffer
                });
                scene.draw({
                    program: blurProg,
                    uniforms: {
                        direction: [0.0, 1.0]
                    },
                    inputs: {
                        u_texture: buffer
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
                    output: buffer
                });
                scene.draw({
                    program: blurProg,
                    uniforms: {
                        direction: [0.0, 1.0]
                    },
                    inputs: {
                        u_texture: buffer
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
            applyBlur(2, bufferA, bufferB, bufferC, bufferD)
            applyBlur(8, bufferD, bufferB, bufferA, bufferE)
        }

        scene.draw({
            program: blendProg,
            inputs: {
                u_texture_a: bufferC,
                u_texture_b: bufferA,
            },
            output: bufferB
        });

        scene.draw({
            program: blendProg,
            inputs: {
                u_texture_a: bufferD,
                u_texture_b: bufferE,
            },
            output: bufferC
        });

        scene.draw({
            program: reactdiffProg,
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
