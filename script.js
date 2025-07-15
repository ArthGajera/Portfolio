// Responsive Tile Size
let tileSize = 40;
if (window.innerWidth < 500) {
  tileSize = 24; // Mobile
} else if (window.innerWidth < 768) {
  tileSize = 32; // Tablet
} else {
  tileSize = 40; // Desktop
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Load tile images
const tileImages = {
  0: new Image(), // grass
  1: new Image(), // dirt
  2: new Image()  // water
};
tileImages[0].src = "floor.png";
tileImages[1].src = "wall.png";
tileImages[2].src = "floor.png";

// Player data
let player = {
  row: 7,
  col: 7,
  color: "#FF69B4"
};

// Draw the player
function drawPlayer(ctx) {
  const mapWidth = tileMap[0].length * tileSize;
  const mapHeight = tileMap.length * tileSize;
  const offsetX = (canvas.width - mapWidth) / 2;
  const offsetY = (canvas.height - mapHeight) / 2;

  ctx.fillStyle = player.color;
  ctx.fillRect(
    offsetX + player.col * tileSize + 4,
    offsetY + player.row * tileSize + 4,
    tileSize - 8,
    tileSize - 8
  );
}

// Draw the tile map with images
function drawMap(ctx) {
  const mapWidth = tileMap[0].length * tileSize;
  const mapHeight = tileMap.length * tileSize;
  const offsetX = (canvas.width - mapWidth) / 2;
  const offsetY = (canvas.height - mapHeight) / 2;

  for (let row = 0; row < tileMap.length; row++) {
    for (let col = 0; col < tileMap[row].length; col++) {
      const tileType = tileMap[row][col];
      const img = tileImages[tileType];
      ctx.drawImage(img, offsetX + col * tileSize, offsetY + row * tileSize, tileSize, tileSize);
    }
  }
}

// Handle start button click
function showCanvas() {
  document.getElementById("start-screen").style.display = "none";
  canvas.style.display = "block";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const images = Object.values(tileImages);
  let loaded = 0;
  const total = images.length;

  images.forEach(img => {
    if (img.complete) {
      loaded++;
      if (loaded >= total) {
        drawMap(ctx);
        drawPlayer(ctx);
      }
    } else {
      img.onload = () => {
        loaded++;
        if (loaded >= total) {
          drawMap(ctx);
          drawPlayer(ctx);
        }
      };
    }
  });
}

// Resize support
window.addEventListener("resize", () => {
  if (canvas.style.display === "block") {
    if (window.innerWidth < 500) tileSize = 24;
    else if (window.innerWidth < 768) tileSize = 32;
    else tileSize = 40;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawMap(ctx);
    drawPlayer(ctx);
  }
});

// Movement (WASD)
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if (key === "w" && player.row > 0) player.row--;
  else if (key === "s" && player.row < tileMap.length - 1) player.row++;
  else if (key === "a" && player.col > 0) player.col--;
  else if (key === "d" && player.col < tileMap[0].length - 1) player.col++;

  drawMap(ctx);
  drawPlayer(ctx);
});
