import typescript from "rollup-plugin-typescript2";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

module.exports = {
  input: "./src/index.ts",
  output: {
    file: "dist/index.js",
    format: "cjs",
    sourcemap: true
  },
  plugins: [
    peerDepsExternal(),
    typescript({
      tsconfig: "tsconfig.json",
      rollupCommonJSResolveHack: true
    })
  ]
};
