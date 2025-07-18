function showCanvas() {
  const canvas = document.getElementById("gameCanvas");
  

  // Show canvas, hide start screen
  document.getElementById("start-screen").style.display = "none";
  canvas.style.display = "block";

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
  const layerObjectMap = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,16,0,0,0,0,0,0,0,0,0,0,15,[3,7],[4,8]],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,5,6],
    [0,0,0,0,0,0,9,10,11,0,0,0,0,0,0],
    [0,0,0,0,0,0,12,13,14,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    const tileSize = 32;
    const player = {
      x: 2,
      y: 2,
      direction: 'down',
      frame: 0,
      frameCount: 2,
      frameTimer: 0,
      frameSpeed: 8,

      moving: false,
      targetX: 12,
      targetY: 10,
      pixelX: 2 * tileSize,
      pixelY: 2 * tileSize,
      speed: 1
    };

    const standingFrames = {
      down: 0,
      up: 16,
      right: 32,
      left: 32
    };

    const walkingFrames = {
      down: [80,96],
      up: [112,128],
      right: [144,160],
      left: [144,160]
    };

    let tilesetLoaded = false;
    let playerLoaded = false;
  // get the sprite of indoor
  let indoorTileset = new Image();
  let playerSprite = new Image();
  
  
  indoorTileset.onload = () => {
    tilesetLoaded = true;
    tryrender();
  };
  playerSprite.onload = () => {
    playerLoaded = true;
    tryrender();
  }
  indoorTileset.src = "indoor.png";
  playerSprite.src = "player.png";

  function tryrender()
  {
    if(tilesetLoaded && playerLoaded) {
      renderScene();
    }
  }

  const objectTiles = {
    1: {sx: 96, sy: 112}, // bed1 
    2: {sx: 96, sy: 128}, //bed 2
    3: {sx: 48, sy: 80}, // table1
    4: {sx: 64, sy: 80},// table2
    5: {sx: 48, sy: 96}, // table3
    6: {sx: 64, sy: 96}, //table4
    7: {sx: 64, sy: 16}, //computer1
    8: {sx: 80, sy: 16}, //computer2
    9: {sx: 0, sy: 80}, //bigtable1
    10:{sx: 16, sy: 80}, //big table 2
    11:{sx: 32, sy: 80},//big table 3
    12:{sx: 0, sy: 96}, //big table 4
    13:{sx: 16, sy: 96}, //big table 5
    14:{sx: 32, sy: 96}, //big table 6
    15:{sx: 48, sy: 16}, // bin
    16:{sx: 80, sy: 80} //samll bin
  }

  // The LoadHandler called when image is loaded.
  function renderScene() {
    for( let y = 0; y<  map.length; y++){
      for( let x = 0; x< map[y].length; x++)
      {
        const tileType = map[y][x];
        if( tileType === 0){
          ctx.drawImage(indoorTileset,48,144,16,16,x*tileSize,y*tileSize,tileSize,tileSize); //floor
        }
        else if(tileType === 1)
        {
         ctx.drawImage(indoorTileset,32,144,16,16,x*tileSize,y*tileSize,tileSize,tileSize); //wall 
        }
      }
    }
    for( let y =0; y< layerObjectMap.length; y++){
      for(let x =0; x< layerObjectMap[y].length; x++){
        const rawStack = layerObjectMap[y][x];
        const stack = Array.isArray(rawStack) ? rawStack : [rawStack];
        for(const objId of stack) {
          if(objId !== 0 && objectTiles[objId]) {
            const tile = objectTiles[objId];

            const isComputer = (objId === 7 || objId === 8);
            const scale = isComputer ? 0.75 : 1;
            const offsetX = isComputer ? 4 : 0; // shift a few px
            const offsetY = isComputer ? -6 : 0; // raise it a bit

            const drawWidth = tileSize * scale;
            const drawHeight = tileSize * scale;
            ctx.drawImage(
              indoorTileset,
              tile.sx,tile.sy,
              16,16,
              x*tileSize + offsetX,
              y*tileSize + offsetY,
              drawWidth,
              drawHeight
            );
          }
        }
      }
    }
   let sx = 0;
   let sy = 0;

   if(player.frame > 0){
    //walking animation
    sx = walkingFrames[player.direction][player.frame];
   } else {
    // idle
    sx = standingFrames[player.direction];
   }

   sy = 0;
   if( player.direction === "left"){
    ctx.save();
    ctx.scale(-1,1);
    ctx.drawImage(
      playerSprite,
      sx,sy,
      16,16,
      -(player.pixelX + tileSize),
      player.pixelY,
      tileSize,tileSize
    );
    ctx.restore();
   } else {
    ctx.drawImage(
      playerSprite,
      sx,sy,
      16,16,
      player.pixelX,
      player.pixelY,
      tileSize,tileSize
    );
   }
  }
  document.addEventListener("keydown", function (event) {
  if(player.moving) return; //no inputs 

  let dx = 0, dy = 0;
  switch(event.key) {
    case "w": dy = -1; player.direction = 'up'; break;
    case "s": dy = 1; player.direction = 'down'; break;
    case "a": dx = -1; player.direction = 'left'; break;
    case "d": dx = 1; player.direction = 'right'; break;
    default: return;
  }

  const newX = player.x + dx;
  const newY = player.y + dy;

  if(newX < 0  || newX >= map[0].length || newY < 0 || newY >= map.length) return;

  player.moving = true;
  player.targetX = newX;
  player.targetY = newY;
  player.frame = (player.frame + 1) % player.frameCount;

  
});

document.addEventListener("keyup", function() {
  player.frame = 0;
  player.frameTimer = 0;
  renderScene();
});

function gameLoop()
{
  if(player.moving) {
    const targetPixelX = player.targetX * tileSize;
    const targetPixelY = player.targetY * tileSize;

    const dx = targetPixelX - player.pixelX;
    const dy = targetPixelY - player.pixelY;

    if(dx !== 0) player.pixelX += Math.sign(dx) * player.speed;
    if(dy !== 0) player.pixelY += Math.sign(dy) * player.speed;


    if( Math.abs(dx) <= player.speed && Math.abs(dy) <= player.speed) {
      player.pixelX = targetPixelX;
      player.pixelY = targetPixelY;
      player.x = player.targetX;
      player.y = player.targetY;
      player.moving = false;
    }
  }

  renderScene();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
}

