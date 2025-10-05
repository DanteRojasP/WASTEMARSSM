// src/pages/GamePage.jsx
import React from "react";

export default function GamePage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      {/* Mostramos el juego HTML dentro de un iframe */}
      <iframe
        src="/game/index.html"
        title="Juego"
        width="100%"
        height="100%"
        className="w-full h-screen border-0"
      ></iframe>
    </div>
  );
}
