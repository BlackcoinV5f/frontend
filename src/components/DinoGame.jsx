import React, { useEffect, useRef } from 'react';

const DinoGame = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let dino = { x: 50, y: 150, width: 50, height: 50, dy: 0, jumpPower: -10, gravity: 0.5, grounded: false };
    let obstacles = [];
    let frame = 0;
    let gameOver = false;

    const jump = () => {
      if (dino.grounded) {
        dino.dy = dino.jumpPower;
        dino.grounded = false;
      }
    };

    const createObstacle = () => {
      obstacles.push({ x: canvas.width, y: 150, width: 20, height: 50 });
    };

    const update = () => {
      frame++;

      // Gravity
      dino.dy += dino.gravity;
      dino.y += dino.dy;

      if (dino.y >= 150) {
        dino.y = 150;
        dino.dy = 0;
        dino.grounded = true;
      }

      // Obstacles
      if (frame % 100 === 0) createObstacle();

      obstacles.forEach(obstacle => obstacle.x -= 5);

      // Collision
      obstacles.forEach(obstacle => {
        if (
          dino.x < obstacle.x + obstacle.width &&
          dino.x + dino.width > obstacle.x &&
          dino.y < obstacle.y + obstacle.height
        ) {
          gameOver = true;
        }
      });

      obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dino
      ctx.fillStyle = 'green';
      ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

      // Obstacles
      ctx.fillStyle = 'red';
      obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });

      if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 50, canvas.height / 2);
      }
    };

    const loop = () => {
      update();
      draw();
      if (!gameOver) requestAnimationFrame(loop);
    };

    loop();

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') jump();
    });

    return () => {
      window.removeEventListener('keydown', (e) => {
        if (e.code === 'Space') jump();
      });
    };
  }, []);

  return <canvas ref={canvasRef} width={600} height={200} style={{ border: '1px solid #000' }} />;
};

export default DinoGame;