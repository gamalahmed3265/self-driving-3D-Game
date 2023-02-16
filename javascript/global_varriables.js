
// ------------------------------------------------------------
// global varriables
// ------------------------------------------------------------

const highscores = [];

const width = 800;
const halfWidth = width / 2;
const height = 500;
const roadW = 4000;
const segL = 200;
const camD = 0.2;
const H = 1500;
const N = 70;

const maxSpeed = 200;
const accel = 38;
const breaking = -80;
const decel = -40;
const maxOffSpeed = 40;
const offDecel = -70;
const enemy_speed = 8;
const hitSpeed = 20;

const LANE = {
  A: -2.3,
  B: -0.5,
  C: 1.2,
};

const mapLength = 15000;

// loop
let then = timestamp();
const targetFrameRate = 1000 / 25; // in ms

let audio;

// game
let inGame,
  start,
  playerX,
  speed,
  scoreVal,
  pos,
  cloudOffset,
  sectionProg,
  mapIndex,
  countDown;
let lines = [];
let cars = [];
