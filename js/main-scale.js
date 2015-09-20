define(function(require) {

    var VERTICAL = 1;
    var HORIZONTAL = 2;

    var Scene = require('scene');

    var basicVert = require('text!shaders/basic.vert');
    var circleFrag = require('text!shaders/circle.frag');
    var copyFrag = require('text!shaders/copy.frag');

    var scene = new Scene();
    var originProg = scene.createProgramInfo(basicVert, circleFrag);
    var copyProg = scene.createProgramInfo(basicVert, copyFrag);

    var bufferA = scene.createBuffer(0.5);
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

    function simulate() {
        scene.draw({
            program: copyProg,
            inputs: {
                u_texture: bufferA,
            }
        });
    }

    function render() {
        scene.drawLastBuffer();
        updateRequired = true;
        requestAnimationFrame(render);
    }
    simulateLoop();
    requestAnimationFrame(render);
});
