"use client";

import { Unity, useUnityContext } from "react-unity-webgl";
import "./GamePage.css"; // import css thuần

export default function GamePage() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "/WebVR/Build/VrWebGL.loader.js",
    dataUrl: "/WebVR/Build/VrWebGL.data",
    frameworkUrl: "/WebVR/Build/VrWebGL.framework.js",
    codeUrl: "/WebVR/Build/VrWebGL.wasm",
  });

  return (
    <div className="game-container">
      <Unity
        unityProvider={unityProvider}
        className="unity-canvas"
      />
    </div>
  );
}
