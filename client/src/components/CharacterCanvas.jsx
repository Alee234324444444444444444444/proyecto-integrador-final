import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/CharacterCanvas.css';
import spriteSheetPath from '../images/spritesheet.png';
import hatImagePath from '../images/hat.png';
import dragonImagePath from '../images/dragon.png';  // Nuevo sprite animado del dragón
import shieldImagePath from '../images/shield.png';  // Sprite estático del escudo
import backgroundImagePath from '../images/background.jpg';

function CharacterCanvas() {
  const canvasRef = useRef(null);
  const spriteSheetRef = useRef(new Image());
  const hatImageRef = useRef(new Image());
  const dragonImageRef = useRef(new Image());
  const shieldImageRef = useRef(new Image());
  const backgroundImageRef = useRef(new Image());

  const [isHatEquipped, setIsHatEquipped] = useState(false);
  const [isDragonEquipped, setIsDragonEquipped] = useState(false);
  const [isShieldEquipped, setIsShieldEquipped] = useState(false);

  const CANVAS_WIDTH = 900;
  const CANVAS_HEIGHT = 900;
  const FRAME_WIDTH = 500;
  const FRAME_HEIGHT = 500;
  const totalFrames = 2;
  let currentFrame = 0;
  let dragonFrame = 0; 
  let frameCounter = 0;
  const frameSpeed = 120;
  const [dragonFrameSpeed, setDragonFrameSpeed] = useState(20); // Velocidad del dragón, más rápido que el personaje
  let dragonFrameCounter = 0; // Contador de cuadros del dragón

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    spriteSheetRef.current.src = spriteSheetPath;
    hatImageRef.current.src = hatImagePath;
    dragonImageRef.current.src = dragonImagePath;
    shieldImageRef.current.src = shieldImagePath;
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

      // Dibujar fondo
      if (backgroundImageRef.current.complete) {
        ctx.drawImage(backgroundImageRef.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      // Animación del personaje
      const sx = currentFrame * FRAME_WIDTH;
      const characterX = canvas.width / 2 - FRAME_WIDTH / 2;
      const characterY = canvas.height / 1.5 - FRAME_HEIGHT / 2;

      ctx.drawImage(spriteSheetRef.current, sx, 0, FRAME_WIDTH, FRAME_HEIGHT, characterX, characterY, FRAME_WIDTH, FRAME_HEIGHT);

      frameCounter++;
      if (frameCounter >= frameSpeed) {
        currentFrame = (currentFrame + 1) % totalFrames;
        frameCounter = 0;
      }

      // Animación del dragón
      dragonFrameCounter++;
      if (dragonFrameCounter >= dragonFrameSpeed) { // Velocidad del dragón
        dragonFrame = (dragonFrame + 1) % totalFrames;
        dragonFrameCounter = 0;
      }

      // Dibujar recompensas si están equipadas
      if (isHatEquipped) drawItem(ctx, hatImageRef.current, characterX + 50, characterY - 0, 400, 400);
      if (isDragonEquipped) drawAnimatedDragon(ctx, characterX + 400, characterY - 200, 400, 400); // Animar dragón
      if (isShieldEquipped) drawItem(ctx, shieldImageRef.current, characterX + 30, characterY + 100, 300, 300);
    }

    function drawItem(ctx, image, x, y, width, height) {
      if (image.complete) {
        ctx.drawImage(image, x, y, width, height);
      } else {
        image.onload = () => ctx.drawImage(image, x, y, width, height);
      }
    }

    function drawAnimatedDragon(ctx, x, y) {
      const DRAGON_SPRITE_WIDTH = 1280;  // Ancho de un frame del dragón
      const DRAGON_SPRITE_HEIGHT = 1280; // Alto del frame (en caso de que sea igual)
      const DRAGON_TOTAL_FRAMES = 2; // Número de frames de la imagen
      const SCALED_WIDTH = 325;  // Tamaño en el canvas
      const SCALED_HEIGHT = 325;
      
      // Asegurarnos de cambiar de frame correctamente
      const dragonSX = (dragonFrame % DRAGON_TOTAL_FRAMES) * DRAGON_SPRITE_WIDTH;
  
      ctx.drawImage(
        dragonImageRef.current,
        dragonSX, 0, DRAGON_SPRITE_WIDTH, DRAGON_SPRITE_HEIGHT,  // Recorte del sprite
        x, y, SCALED_WIDTH, SCALED_HEIGHT  // Escalarlo en el canvas
      );
    }
    
  }, [isHatEquipped, isDragonEquipped, isShieldEquipped, dragonFrameSpeed]);

  return (
    <div className="character-container">
      <div className="sidebar">
        <h3>Recompensas</h3>
        <button onClick={() => setIsHatEquipped(!isHatEquipped)}>Recompensa</button>
        <button onClick={() => setIsDragonEquipped(!isDragonEquipped)}>Recompensa 2</button>
        <button onClick={() => setIsShieldEquipped(!isShieldEquipped)}>Recompensa 3</button>
      </div>

      <div className="canvas-wrapper">
        <h1>Adán</h1>
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
      </div>
    </div>
  );
}

export default CharacterCanvas;
