import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/CharacterCanvas.css';
import spriteSheetPath from '../images/spritesheet.png';
import hatImagePath from '../images/hat.png';
import backgroundImagePath from '../images/background.jpg';

function CharacterCanvas() {
  const canvasRef = useRef(null);
  const spriteSheetRef = useRef(new Image());
  const hatImageRef = useRef(new Image());
  const backgroundImageRef = useRef(new Image());
  const [isHatEquipped, setIsHatEquipped] = useState(false);

  const CANVAS_WIDTH = 900; // Tamaño del canvas
  const CANVAS_HEIGHT = 900;
  const FRAME_WIDTH = 500;
  const FRAME_HEIGHT = 500;
  const totalFrames = 2;
  let currentFrame = 0;
  let frameCounter = 0;
  const frameSpeed = 120;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    spriteSheetRef.current.src = spriteSheetPath;
    hatImageRef.current.src = hatImagePath;
    backgroundImageRef.current.src = backgroundImagePath;

    spriteSheetRef.current.onload = () => {
      requestAnimationFrame(animationLoop);
    };

    function animationLoop() {
      drawCharacter(ctx);
      requestAnimationFrame(animationLoop);
    }

    function drawCharacter(ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar el fondo, más grande que el personaje
      const backgroundWidth = CANVAS_WIDTH;
      const backgroundHeight = CANVAS_HEIGHT;
      if (backgroundImageRef.current.complete) {
        ctx.drawImage(backgroundImageRef.current, 0, 0, backgroundWidth, backgroundHeight);
      }

       // Dibujar el personaje más abajo en el canvas
       const sx = currentFrame * FRAME_WIDTH;
       const sy = 0;
       const characterX = canvas.width / 2 - FRAME_WIDTH / 2;
       const characterY = canvas.height / 1.5 - FRAME_HEIGHT / 2; // Posicionamos el personaje más abajo
       ctx.drawImage(
         spriteSheetRef.current,
         sx, sy,
         FRAME_WIDTH, FRAME_HEIGHT,
         characterX, characterY,
         FRAME_WIDTH, FRAME_HEIGHT
       );
 
       frameCounter++;
       if (frameCounter >= frameSpeed) {
         currentFrame = (currentFrame + 1) % totalFrames;
         frameCounter = 0;
       }
 
       if (isHatEquipped) {
         drawHat(ctx, characterX, characterY);
       }
     }
 

    function drawHat(ctx, characterX, characterY) {
      const hatX = characterX + 50;
      const hatY = characterY - 0;
      const hatWidth = 400;
      const hatHeight = 400;

      if (hatImageRef.current.complete) {
        ctx.drawImage(hatImageRef.current, hatX, hatY, hatWidth, hatHeight);
      } else {
        hatImageRef.current.onload = () => {
          ctx.drawImage(hatImageRef.current, hatX, hatY, hatWidth, hatHeight);
        };
      }
    }

    function equipReward() {
      setIsHatEquipped(true);
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

    document.querySelector(".equipar-btn").addEventListener("click", equipReward);

  }, [isHatEquipped]);

  return (
    <div className="caracter">
      <h1>Adán</h1>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
      <div className="actions">
        <button className="equipar-btn">Equipar Sombrero</button>
      </div>
    </div>
  );
}

export default CharacterCanvas;
