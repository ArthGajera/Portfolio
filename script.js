function showCanvas() {
  const canvas = document.getElementById("gameCanvas");
  

  // Show canvas, hide start screen
  document.getElementById("start-screen").style.display = "none";
  canvas.style.display = "block";
  document.getElementById("main-content").style.display = "flex";

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
    [1,[16,17],0,0,0,0,0,0,0,0,0,0,15,[3,7],[4,8]],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,5,6],
    [0,0,0,0,0,0,9,[10,18],11,0,0,0,0,0,0],
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

    let dialogVisible = false;
    let currentDialog = "";
    let dialogLines = [
      " "
    ];
    let dialogIndex = 0;

    let aboutMeVisible = false;
    let aboutMeText = `Hi! I'm Arth Gajera, an Aspiring Game Developer\n with a strong Foundation in:\n 1) Unity and Unreal Engine.\n 2) Graphics Programming (OpenGL, RayTracing).\n 3) VR/AR Development.\n\nI Love creating an Immersive worlds,\n combining gameplay with code magic!
    `;

    let contactBoxVisible = false;
    let contactText = `Lets Get In Touch!\n      
    Email: arthgajera0007@gmail.com\n
    Phone: +1 (720) 253-5869\n
    LinkedIn: linkedin.com/in/arth-gajera\n
    GitHub: github.com/ArthGajera\n
    Location: Denver, CO`;


    let projectMenuVisible = false;
    let selectedProjectIndex = 0;
    const projectList = [
      { name: "Ray Tracer", description: " A real-time ray tracer built from scratch in c++ and OpenGL."},
      { name: "MTD-SDN", description: "A Moving Target Defence System using SOftware define Networking and Ryu controller."},
      { name: "RL Pathfinding", description: "Unity project using Reinforcment Learning to solve navigation puzzel."}
    ];

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
    16:{sx: 80, sy: 80}, //samll bin
    17:{sx: 16, sy: 16}, // book
    18:{sx: 32, sy: 16}, //page
  }

  const solidObjectsId = new Set([1,2,3,4,7,8,9,10,11,15,16,17,18]);
  function iswalkable(x,y) {
      if(x < 0 || x >= map[0].length || y < 0 || y >= map.length) return false;

      if(map[y][x] === 1) return false;

      const rawStack = layerObjectMap[y][x];
      const stack = Array.isArray(rawStack) ? rawStack : [rawStack];

      for( const objId of stack) {
        if(solidObjectsId.has(objId)) return false;
      }

      return true;
  }
  function checkInteraction() {
    const { x, y, direction } = player;
    let tx = x, ty = y;

    if(direction === "up") ty -= 1;
    else if(direction ==="down") ty += 1;
    else if(direction ==="left") tx -= 1;
    else if(direction ==="right") tx += 1;

    if(tx < 0 || ty < 0 || tx >= map[0].length || ty >= map.length) return;

    const rawStack = layerObjectMap[ty][tx];
    const stack = Array.isArray(rawStack) ? rawStack : [rawStack];

    for(const objId of stack) {
      switch(objId) {
        case 18: 
          dialogLines = [
            "It's a Page with scribbles on it.",
            "Looks like Someone's contact info.",
            "let's check it..."
          ];
          dialogIndex = 0;
          currentDialog = dialogLines[0];
          dialogVisible = true;
          break;

        case 7: 
          dialogLines = [
            "It's a Computer!!",
            "May be there is Something intresting inside, Let's Open it.",
            "Power ON!"
          ];
          dialogIndex = 0;
          currentDialog = dialogLines[0];
          dialogVisible = true;
          break;
        case 17:
          dialogLines = [
            " An Old Book Lies Here.",
            "It seems to be a Owner's Book"
          ];
          dialogIndex = 0;
          currentDialog = dialogLines[0];
          dialogVisible = true;
          break;
        
          default:
            break;
      }
    }
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

            let scale = 1;
            let offsetX = 0;
            let offsetY = 0;

            if (objId === 7 || objId === 8) { // computer
              scale = 0.75;
              offsetX = 5;
              offsetY = -4;
            } else if (objId === 17) { // book
              scale = 0.6;
              offsetX = 6.5;
              offsetY = 0;
            } else if (objId ===18){
              scale = 0.7;
              offsetY = 10;
            }

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

   if(dialogVisible) {
    const boxWidth = canvas.width - 40;
    const boxHeight = 80;
    const boxX = 20;
    const boxY = canvas.height - boxHeight - 20;

    ctx.fillStyle = "#fff";
    ctx.fillRect(boxX,boxY,boxWidth,boxHeight);

    ctx.strokeStyle = "#306850";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX,boxY,boxWidth,boxHeight);


    ctx.fillStyle = "#306850";
    ctx.font = "8px 'Press Start 2P', monospace";
    ctx.textBaseline = "top";
    const words = currentDialog.split(" ");
    let line = "";
    let y = boxY + 10;

    for(let i =0 ;i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const testWidth = ctx.measureText(testLine).width;
      if(testWidth > boxWidth -20 ) {
        ctx.fillText(line, boxX + 10, y);
        line = words[i] + " ";
        y += 20;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, boxX + 10, y);
   }
   
   if(aboutMeVisible) {
    const boxX = 40;
    const boxY = 40;
    const boxWidth = canvas.width - 80;
    const boxHeight = canvas.height - 80;

    ctx.fillStyle = "#fff";
    ctx.fillRect(boxX,boxY,boxWidth,boxHeight);

    ctx.strokeStyle = "#306850";
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX,boxY,boxWidth,boxHeight);

    ctx.fillStyle = "#306850";
    ctx.font = "8px 'Press Start 2P', monospace";
    ctx.textBaseline = "top";

    const words = aboutMeText.split("\n");
    let line = "";
    let y = boxY +16;

    for(let i =0; i< words.length; i++) {
      const testLine = line + words[i] + " ";
      const testWidth = ctx.measureText(testLine).width;
      if(testWidth > boxWidth - 20) {
        ctx.fillText(line, boxX + 10, y);
        line = words[i] + " ";
        y += 12;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line,boxX +10,y);
   }

    if (contactBoxVisible) {
      const boxX = 40;
      const boxY = 40;
      const boxWidth = canvas.width - 80;
      const boxHeight = canvas.height - 80;

      ctx.fillStyle = "#fff";
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

      ctx.strokeStyle = "#306850";
      ctx.lineWidth = 3;
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

      ctx.fillStyle = "#306850";
      ctx.font = "8px 'Press Start 2P', monospace";
      ctx.textBaseline = "top";

      const words = contactText.split("\n");
      let line = "";
      let y = boxY + 16;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > boxWidth - 20) {
          ctx.fillText(line, boxX + 10, y);
          line = words[i] + " ";
          y += 12;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, boxX + 10, y);
    }

    if(projectMenuVisible) {
      const menuX = canvas.width - 160 ;
      const menuY = 40;
      const menuWidth = 120;
      const menuHeight = 100;

      ctx.fillStyle = "#fff";
      ctx.fillRect(menuX,menuY,menuWidth,menuHeight);
      ctx.strokeStyle = "#306850";
      ctx.strokeRect(menuX,menuY,menuWidth,menuHeight);

      ctx.fillStyle = "#306850";
      ctx.font = "8px 'Press Start 2P', monospace";
      ctx.textBaseline = "top";

      for(let i = 0; i< projectList.length;i++) {
        const y = menuY + 10 +i * 14;
        const name = projectList[i].name;
        if( i === selectedProjectIndex) {
          ctx.fillRect(menuX + 5,y-2,menuWidth-10,12);
          ctx.fillStyle = "#fff";
          ctx.fillText(name,menuX+10,y);
          ctx.fillStyle = "#306850";
        } else {
          ctx.fillText(name,menuX + 10, y);
        }
      }

      const descBoxX = 20;
      const descBoxY = 40;
      const descBoxWidth = canvas.width - 200;
      const descBoxHeight = 100;

      ctx.fillStyle = "#fff";
      ctx.fillRect(descBoxX, descBoxY, descBoxWidth, descBoxHeight);
      ctx.strokeStyle = "#306850";
      ctx.strokeRect(descBoxX, descBoxY, descBoxWidth, descBoxHeight);

      ctx.fillStyle = "#306850";
      ctx.font = "8px 'Press Start 2P', monospace";

      const description = projectList[selectedProjectIndex].description;
      const words = description.split(" ");
      let line = "", y = descBoxY + 10;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        if (ctx.measureText(testLine).width > descBoxWidth - 20) {
          ctx.fillText(line, descBoxX + 10, y);
          line = words[i] + " ";
          y += 14;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, descBoxX + 10, y);
    }

  }
  document.addEventListener("keydown", function (event) {
  if(player.moving) return; //no inputs 

  let dx = 0, dy = 0;
  // handle about me box
  if(aboutMeVisible) {
    if(event.key === "e") {
      aboutMeVisible = false;
    }
    return;
  }

  if (contactBoxVisible) {
    if (event.key === "e") {
      contactBoxVisible = false;
    }
    return;
  }

  if(projectMenuVisible) {
    if(event.key === "w"){
      selectedProjectIndex = (selectedProjectIndex - 1 + projectList.length) % projectList.length;
    } else if(event.key === "s") {
      selectedProjectIndex = (selectedProjectIndex + 1) % projectList.length;
    } else if(event.key === "e") {
      projectMenuVisible = false;
    }
    return;
  }


  // block for movement restriction during dialog.
    if(dialogVisible)
    {
      if(event.key === "e") {
        dialogIndex++;
        if(dialogIndex < dialogLines.length) {
          currentDialog = dialogLines[dialogIndex];
        } else {
          dialogVisible = false;
          currentDialog = "";
          if(dialogLines[0].trim().startsWith("An Old Book")) {
            aboutMeVisible = true;
          } else if(dialogLines[0].trim().startsWith("It's a Page")) {
              contactBoxVisible = true;
          } else if(dialogLines[0].trim().startsWith("It's a Computer")) {
            projectMenuVisible = true;
            selectedProjectIndex = 0;
          }
        }
      }
      return;
    }

    if(player.moving) return; // Block input during movement

  switch(event.key) {
    case "w": dy = -1; player.direction = 'up'; break;
    case "s": dy = 1; player.direction = 'down'; break;
    case "a": dx = -1; player.direction = 'left'; break;
    case "d": dx = 1; player.direction = 'right'; break;
    case "e": checkInteraction(); break;
    default: return;
  }

  const newX = player.x + dx;
  const newY = player.y + dy;

  if(!iswalkable(newX,newY)) return;

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

