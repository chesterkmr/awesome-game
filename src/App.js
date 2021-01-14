import * as React from 'react';
import logo from './logo.svg';
import './App.css';

import theGuySrc from './theguy.png';
import missileSrc from './missile.png';
import enemySrc from './enemy.png';

function App() {

  const canvasRef = React.useRef();

  const movementListener = React.useCallback(() => {

  }, [])

  React.useEffect(() => {
    if(!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvasRef.current.getContext('2d');


    const keyMap = {
      87: 'up',
      83: 'down',
      65: 'left',
      68: 'right',
      69: 'shoot',
    }

    const keyPressedMap = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false,
    }

    ctx.fillStyle = "#fff"

    const theGuyImage = new Image();

    theGuyImage.src = theGuySrc

    const missileImage = new Image();
    missileImage.src = missileSrc

    const enemyImage = new Image();
    enemyImage.src = enemySrc;

    let score = 0;

    const imageHalfSize = 8;
    const speed = 5;

    let x = 250 - imageHalfSize;
    let y = 250 - imageHalfSize;


    ctx.drawImage(theGuyImage, x, y, 16, 16);

    const move = () => {
      if(keyPressedMap.up) {
        y -= speed;
      }
      if(keyPressedMap.down) {
        y += speed;
      }
      if(keyPressedMap.left) {
        x-= speed;
      }
      if(keyPressedMap.right) {
        x+= speed;
      }
      if(y < 0 ) {
        y = 8
      }

      if(y > 500) {
        y = 492
      }

      if(x < 0) {
        x = 500
      }

      if(x > 500) {
        x = 0
      }

      ctx.drawImage(theGuyImage, x, y, 16, 16);
    }


    let enemies = [];
    let missiles = [];


    const spawnEnemy = () => {
      if(enemies.length >= 5) return;
      const xPos = Math.round(Math.random() * (500 - 12));

      enemies.push({y: 0, x: xPos, dead: false })
    }

    const shoot = () => {
      if(keyPressedMap.shoot) {
        keyPressedMap.shoot = false;
        const nextMissile = {
          x: x,
          y: y
        }
  
        missiles.unshift(nextMissile);

      }

      missiles = missiles.filter(m => !m.wasted)

      for(let missile of missiles) {
        missile.y = missile.y - speed;

        ctx.drawImage(missileImage, missile.x, missile.y , 5, 8)
      }

      


    }

    const drawEnemies = () => {
      for(let enemy of enemies) {
        ctx.drawImage(enemyImage, enemy.x, enemy.y , 21, 26)
      }
    }

    let lastSpawnTime = 0;
    let lastMoveTime = 0;
    let lastRender = 0;

    const processEnemies = () => {
      if(!enemies.length) return;
      if(Date.now() - lastMoveTime >= 200) {

      for(let enemy of enemies) {
          if(enemy.dead) continue;

          enemy.y+= speed;
          lastMoveTime = Date.now()
        
      }

      enemies = enemies.filter(e => !e.dead);
    }
    }

    
    const processShots = () => {
      for(let missile of missiles) {
        const enemyHit = enemies.find(e => {
          const diffX = Math.abs(e.x -missile.x) ;
          const diffY = Math.abs(e.y - missile.y)  ;
          
          return diffX <= 20 && diffY <= 20
        });



        if(enemyHit) {
          enemyHit.dead = true;
          missile.wasted = true;
          score+= 1;
        }
      }
    }

    const loop = (timestamp) => {
      ctx.clearRect(0, 0 , 500, 500);
      move();
      shoot();
      processShots();
      processEnemies();
      drawEnemies()
      
      
      if(Date.now() - lastSpawnTime >= 1000) {
        spawnEnemy();
        

        lastSpawnTime = Date.now();
      }

      ctx.font = "24px serif";
      ctx.fillStyle = "red";
      ctx.fillText(`Score ${score}`, 10, 30)
      window.requestAnimationFrame(loop)
    }



    window.addEventListener('mousedown', (e) => {
      if(e.which === 1) {
        keyPressedMap.shoot = true;
      }
    })

    window.addEventListener('mouseup', (e) => {
      if(e.which === 1) {
        keyPressedMap.shoot = false;
      }
    })

    window.addEventListener('keydown', (e) => {
      keyPressedMap[keyMap[e.keyCode]] = true;
    }, false);
    window.addEventListener('keyup', (e) => {
      keyPressedMap[keyMap[e.keyCode]] = false;
    }, false)
  
    window.requestAnimationFrame(loop)

  }, [canvasRef])

  return (
    <div className="App">
      <canvas width="500" height="500" ref={canvasRef} style={{border: "1px solid skyblue"}}></canvas>
    </div>
  );
}

export default App;
