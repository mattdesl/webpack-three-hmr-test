# webpack-three-hmr-test

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Hot module replacement with ThreeJS + Webpack, reloading shaders without destroying application state.

Click below to see a video demo.

[<img src="http://i.imgur.com/tpWKF7E.png" width="65%" />](https://www.youtube.com/watch?v=XPYKYkD_5A0)

<sup>[video demo](https://www.youtube.com/watch?v=XPYKYkD_5A0)</sup>

This is **experimental** and a **proof of concept**. It only exists for reference and to hash out ideas for how it can all work in practice. If you want to help, feel free to discuss ideas/etc in the issue tracker.

## How it Works

Shader materials intended to be hot-replaced must be defined in their own file with top-level `vertexShader` and `fragmentShader` strings. Typically this module will export a `RawShaderMaterial`, although `ShaderMaterial` should also work.

Currently, the `module.hot` boilerplate is manually defined. See the following:

- [materials/inline.js](./materials/inline.js) - plain GLSL with ES2015 template strings
- [materials/noise.js](./materials/noise.js) - more advanced, using [glslify](https://github.com/stackgl/glslify)


In a future version, this will be instrumented by a Babel transform, so that your "hot-shader" modules can just look like this:

```js
// my-shader.js
const vertexShader = '...'
const fragmentShader = '...'

export default function () {
  return new THREE.RawShaderMaterial({
    vertexShader, fragmentShader
  })
}
```

## glslify

This approach works with regular [inline strings](./materials/inline.js) (like ES2015 template strings), but we can also take advantage of [glslify](https://github.com/stackgl/glslify) for a more advanced/powerful workflow. 

This allows our GLSL to be separated into files, so that it receives its own syntax highlighting and auto-completion. It also supports source transforms like hex colors and import statements to pull in GLSL components from npm.

```glsl
precision mediump float;

// shader components from npm
import noise from 'glsl-noise/simplex/3d';

varying vec2 vUv;

void main () {
  float n = noise(vec3(vUv.xy * 10.0, 1.0));
  n = smoothstep(0.0, 0.1, n);

  // hex colors for convenience
  vec3 color = mix(vec3(#03A9F4), vec3(#3F51B5), n);
  gl_FragColor = vec4(color, 1.0);
}
```

## `ify-loader`

The webpack config is using [ify-loader](https://github.com/hughsk/ify-loader). This is not strictly necessary, but solves some `glslify` issues for us:

- First, it allows third-party modules with browserify transforms (like glslify) to be resolved and bundled automatically, e.g. [three-vignette-background](https://github.com/mattdesl/three-vignette-background)
- Second, it allows us to specify `"browserify"` and `"glslify"` configuration in our local [package.json](./package.json)
- Third, it allows us to use `glslify(file, { ... })` syntax without relying on Webpack `require` overloads

## Usage

Clone, install and run:

```sh
git clone https://github.com/mattdesl/webpack-three-hmr-test.git

# setup
cd webpack-three-hmr-test
npm install

# start dev server
npm start
```

Now open `localhost:9966`.

Make changes to [client.js](./client.js) and the browser will trigger a hard-refresh. Make changes to [materials/inline.js](./materials/inline.js) or the GLSL in [materials/shaders](./materials/shaders) and they will be updated with Hot Module Replacement, to avoid destroying application state.

## Roadmap

Since I am new to webpack and authoring babel plugins, it will probably be a while before this is all realized properly. Some things to focus on, and areas I could use help with:

- How do I write a babel plugin for instrumenting HMR?
- How should the end-user "hot-shader" look?
- How can we support both ES2015 and ES5 for the end-user's "hot-shaders"?
- How can we improve error handling for `glslify`, e.g. a missing import? See react-transform errors for example.
- How can we improve ThreeJS shader compile errors? This will require changes to ThreeJS core.
- How can we support the same features in browserify workflows? `browserify-hmr` leaves a lot to be desired.
- Does adding/removing uniforms and attributes lead to any problems?

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/webpack-three-hmr-test/blob/master/LICENSE.md) for details.
