precision mediump float;

// glslify fancy imports
import noise from 'glsl-noise/simplex/3d';

varying vec2 vUv;

void main () {
  float n = noise(vec3(vUv.xy * 10.0, 1.0));
  n = smoothstep(0.0, 0.1, n);

  // glslify-hex allows for the color strings
  vec3 color = mix(vec3(#03A9F4), vec3(#3F51B5), n);
  gl_FragColor = vec4(color, 1.0);
}
