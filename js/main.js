define(function(require) {

    var Scene = require('scene');

    var basicVert = require('text!shaders/basic.vert');
    var circleFrag = require('text!shaders/circle.frag');
    var thresholdFrag = require('text!shaders/threshold.frag');
    var laplFrag = require('text!shaders/lapl.frag');
    var copyFrag = require('text!shaders/copy.frag');
    var debugFrag = require('text!shaders/debug.frag');
    // var blurFrag = require('text!shaders/blur.frag');
    var greyscottFrag = require('text!shaders/greyscott-pmneilaB.frag');

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
    // var blurProg = scene.createProgramInfo(basicVert, blurFrag);
    var laplProg = scene.createProgramInfo(basicVert, laplFrag);
    var copyProg = scene.createProgramInfo(basicVert, copyFrag);
    var debugProg = scene.createProgramInfo(basicVert, debugFrag);
    var greyscottProg = scene.createProgramInfo(basicVert, greyscottFrag);

    var scale = 2;
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

    function render(time) {
        var dt = (time - mLastTime)/20.0;
        if(dt > 0.8 || dt<=0)
            dt = 0.8;
        mLastTime = time;

        var steps = 1;

        for (var i = 0; i < steps; i++) {
            scene.draw({
                program: laplProg,
                inputs: {
                    tSource: bufferA
                },
                output: bufferB
            });
            scene.draw({
                program: laplProg,
                inputs: {
                    tSource: bufferB
                },
                output: bufferC
            });
            scene.draw({
                program: greyscottProg,
                uniforms: {
                    delta: dt,
                    feed: 0.037,
                    kill: 0.06
                },
                inputs: {
                    tSource: bufferA,
                    tLapl: bufferC,
                },
                output: bufferB
            });
            scene.draw({
                program: copyProg,
                inputs: {
                    u_texture: bufferB
                },
                output: bufferA
            });
        }

        // scene.draw({
        //     program: thresholdProg,
        //     uniforms: {
        //         threshold: 0.2
        //     },
        //     inputs: {
        //         u_texture: bufferA
        //     }
        // });

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
