"use client";

import { Unity, useUnityContext } from "react-unity-webgl";
import "./GamePage.css"; // import css thuần

export default function GamePage() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "/unity/Build/unity.loader.js",
    dataUrl: "/unity/Build/unity.data",
    frameworkUrl: "/unity/Build/unity.framework.js",
    codeUrl: "/unity/Build/unity.wasm",
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
