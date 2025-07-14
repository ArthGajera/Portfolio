//responsive Tile Size
let tileSize = 40;
if(window.innerWidth < 500) {
  tileSize = 24; // Mobile
} else if(window.innerWidth < 768) {
  tileSize = 32; //Tablet
} else {
  tileSize = 40; //Desktop
}
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileMap = [
  [0, 0, 1, 1, 1, 0, 0, 2, 2, 2, 0, 0, 1, 1, 1],
  [0, 1, 1, 0, 0, 1, 1, 2, 0, 0, 2, 2, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1, 2, 0, 0, 2, 2, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 2, 2, 2, 2, 0, 0, 1, 1, 1],
  [0, 0, 1, 1, 1, 2, 2, 0, 0, 0, 2, 2, 1, 1, 0],
  [1, 1, 1, 0, 0, 2, 0, 0, 1, 1, 1, 2, 2, 1, 0],
  [0, 0, 1, 1, 1, 0, 0, 2, 2, 2, 0, 0, 1, 1, 1],
  [1, 1, 0, 0, 0, 1, 1, 2, 0, 0, 2, 2, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 2, 2, 2, 2, 0, 0, 1, 1, 1],
  [0, 0, 1, 1, 1, 2, 2, 0, 0, 0, 2, 2, 1, 1, 0],
  [1, 1, 1, 0, 0, 2, 0, 0, 1, 1, 1, 2, 2, 1, 0],
  [1, 0, 0, 1, 1, 2, 2, 2, 2, 2, 0, 0, 1, 1, 1],
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0],
  [1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 2, 2, 1, 0],
  [0, 0, 1, 1, 1, 2, 2, 2, 0, 0, 0, 2, 2, 2, 1]
];

const tileColors = {
  0: "#228B22", // grass
  1: "#DEB887", // dirt
  2: "#87CEEB"  // water
};

function drawMap(ctx) {
  const mapWidth = tileMap[0].length * tileSize;
  const mapHeight = tileMap.length * tileSize;
  const offsetX = (canvas.width - mapWidth) / 2;
  const offsetY = (canvas.height - mapHeight) / 2;

  for (let row = 0; row < tileMap.length; row++) {
    for (let col = 0; col < tileMap[row].length; col++) {
      const tileType = tileMap[row][col];
      const color = tileColors[tileType];
      ctx.fillStyle = color;
      ctx.fillRect(offsetX + col * tileSize, offsetY + row * tileSize, tileSize, tileSize);
    }
  }
}

function showCanvas() {
  document.getElementById("start-screen").style.display = "none";
  canvas.style.display = "block";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawMap(ctx);
}

window.addEventListener("resize", () => {
  if (canvas.style.display === "block") {
    if(window.innerWidth < 500)
    {
      tileSize = 24;
    } else if (window.innerWidth < 768)
    {
      tileSize = 32;
    } else{
      tileSize = 40;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawMap(ctx);
  }
});
