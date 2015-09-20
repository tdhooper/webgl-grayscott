define(function(require) {

    var Scene = require('scene');

    var basicVert = require('text!shaders/basic.vert');
    var plasmaFrag = require('text!shaders/circle.frag');
    var yellowFrag = require('text!shaders/yellow.frag');
    var redFrag = require('text!shaders/red.frag');

    var scene = new Scene();
    var originProgram = scene.createProgramInfo(basicVert, plasmaFrag);
    var yellowProgram = scene.createProgramInfo(basicVert, yellowFrag);
    var redProgram = scene.createProgramInfo(basicVert, redFrag);

    var bufferA = scene.createBuffer();
    var bufferB = scene.createBuffer();

    function render(time) {
        var uniforms = {
            time: time * 0.001
        }

        scene.draw({
            program: originProgram,
            uniforms: uniforms,
            output: bufferA
        });

        scene.draw({
            program: yellowProgram,
            input: bufferA,
            output: bufferB
        });

        scene.draw({
            program: redProgram,
            input: bufferB,
        });

        // scene.drawLastBuffer();

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
});
