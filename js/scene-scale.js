define(function(require) {

    var twgl = require('lib/twgl');

    twgl.setAttributePrefix("a_");

    var Scene = function() {
        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas);

        this.gl = twgl.getWebGLContext(canvas);
        
        var arrays = {
            position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
        };
        this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, arrays);

        this.fbi = twgl.createFramebufferInfo(this.gl);
        
        twgl.resizeCanvasToDisplaySize(this.gl.canvas);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }

    Scene.prototype.createBuffer = function(scale) {
        scale = scale || 1;
        var fbi = twgl.createFramebufferInfo(
            this.gl,
            null,
            this.gl.canvas.width * scale,
            this.gl.canvas.height * scale
        )
        fbi.scale = scale;
        return fbi;
    };

    Scene.prototype.createProgramInfo = function(vs, fs) {
        return twgl.createProgramInfo(this.gl, [vs, fs]);
    };

    Scene.prototype.drawLastBuffer = function() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, this.bufferInfo);
    }

    Scene.prototype.draw = function(spec) {

        this.gl.useProgram(spec.program.program);
        
        var uniforms = {};

        if (spec.uniforms) {
            Object.assign(uniforms, spec.uniforms);
        }

        var scale = 1;

        if (spec.inputs) {
            var inputs = {};
            Object.keys(spec.inputs).map(function(key, index) {
               inputs[key] = spec.inputs[key].attachments[0];
               scale = spec.inputs[key].scale;
            });
            Object.assign(uniforms, inputs);
        }

        Object.assign(uniforms, {
            resolution: [
                this.gl.canvas.width * scale,
                this.gl.canvas.height * scale
            ],
        });

        twgl.setUniforms(spec.program, uniforms);

        if (spec.output) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, spec.output.framebuffer);
        } else {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }

        twgl.setBuffersAndAttributes(this.gl, spec.program, this.bufferInfo);
        twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, this.bufferInfo);
    }

    return Scene;
});