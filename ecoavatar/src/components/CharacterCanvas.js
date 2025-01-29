import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/CharacterCanvas.css';
import spriteSheetPath from '../images/spritesheet.png';  // Importa la imagen de la hoja de sprites
import hatImagePath from '../images/hat.png';  // Importa la imagen del sombrero

function CharacterCanvas() {
  const canvasRef = useRef(null);  // Ref para el canvas
  const spriteSheetRef = useRef(new Image());  // Ref para la hoja de sprites
  const hatImageRef = useRef(new Image());  // Ref para la imagen del sombrero
  const [isHatEquipped, setIsHatEquipped] = useState(false);  // Estado para saber si el sombrero está equipado

  const FRAME_WIDTH = 500; // Ancho del frame
  const FRAME_HEIGHT = 500; // Alto del frame
  const totalFrames = 2; // Total de frames en la animación
  let currentFrame = 0; // Frame actual de la animación
  let frameCounter = 0; // Contador de frames
  const frameSpeed = 120; // Velocidad de cambio de frame

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Cargar las imágenes directamente desde los imports
    spriteSheetRef.current.src = spriteSheetPath;
    hatImageRef.current.src = hatImagePath;

    // Manejar la carga de la hoja de sprites
    spriteSheetRef.current.onload = () => {
      requestAnimationFrame(animationLoop);  // Iniciar la animación
    };

    spriteSheetRef.current.onerror = () => {
      console.error("Error: No se pudo cargar la hoja de sprites.");
    };

    // Loop de animación
    function animationLoop() {
      drawCharacter(ctx);
      requestAnimationFrame(animationLoop);  // Continuar el loop
    }

    // Dibujar el personaje en el canvas
    function drawCharacter(ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

      const sx = currentFrame * FRAME_WIDTH;
      const sy = 0;

      // Dibujar la imagen del personaje
      ctx.drawImage(
        spriteSheetRef.current,
        sx, sy,
        FRAME_WIDTH, FRAME_HEIGHT,
        0, 0,
        canvas.width, canvas.height
      );

      // Actualizar el frame actual para la animación
      frameCounter++;
      if (frameCounter >= frameSpeed) {
        currentFrame = (currentFrame + 1) % totalFrames;
        frameCounter = 0;
      }

      // Si el sombrero está equipado, dibujarlo
      if (isHatEquipped) {
        drawHat(ctx);
      }
    }

    // Dibujar el sombrero en el personaje
    function drawHat(ctx) {
      const hatX = 15;
      const hatY = 1;
      const hatWidth = 220;
      const hatHeight = 220;

      if (hatImageRef.current.complete) {  // Verificar si la imagen del sombrero se ha cargado
        ctx.drawImage(hatImageRef.current, hatX, hatY, hatWidth, hatHeight);
      } else {
        hatImageRef.current.onload = () => {
          ctx.drawImage(hatImageRef.current, hatX, hatY, hatWidth, hatHeight);
        };
      }
    }

    // Manejar el equipaje del sombrero
    function equipReward() {
      setIsHatEquipped(true);  // Marcar que el sombrero está equipado
      Swal.fire({
        title: "¡Sombrero equipado!",
        text: "Tu personaje ahora luce más elegante.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        position: 'top-end',
      });
    }

    // Agregar los eventos de los botones
    document.querySelector(".equipar-btn").addEventListener("click", equipReward);

  }, [isHatEquipped]);

  return (
    <div className="caracter">
      <h1>Adán</h1>
      <canvas ref={canvasRef} width="250" height="250"></canvas>
      <div className="actions">
        <button className="equipar-btn">Equipar Sombrero</button>
      </div>
    </div>
  );
}

export default CharacterCanvas;
