// ------------------------------------------------------------
// init
// ------------------------------------------------------------

function reset() {
  inGame = false;

  start = timestamp();
  countDown = map[map.length - 2].to / 130 + 10;

  playerX = 0;
  speed = 0;
  scoreVal = 0;

  pos = 0;
  cloudOffset = 0;
  sectionProg = 0;
  mapIndex = 0;

  for (let line of lines) line.curve = line.y = 0;

  text.innerText = "INSERT COIN";
  text.classList.add("blink");

  road.style.opacity = 0.4;
  hud.style.display = "none";
  home.style.display = "block";
  tacho.style.display = "block";
}

function updateHighscore() {
  let hN = Math.min(12, highscores.length);
  for (let i = 0; i < hN; i++) {
    highscore.children[i].innerHTML = `${(i + 1).pad(2, "&nbsp;")}. ${
      highscores[i]
    }`;
  }
}

function init() {
  game.style.width = width + "px";
  game.style.height = height + "px";

  hero.style.top = height - 80 + "px";
  hero.style.left = halfWidth - ASSETS.IMAGE.HERO.width / 2 + "px";
  hero.style.background = `url(${ASSETS.IMAGE.HERO.src})`;
  hero.style.width = `${ASSETS.IMAGE.HERO.width}px`;
  hero.style.height = `${ASSETS.IMAGE.HERO.height}px`;

  cloud.style.backgroundImage = `url(${ASSETS.IMAGE.SKY.src})`;

  audio = new Audio();
  Object.keys(ASSETS.AUDIO).forEach((key) =>
    audio.load(ASSETS.AUDIO[key], key, (_) => 0)
  );

  cars.push(new Car(0, ASSETS.IMAGE.CAR, LANE.C));
  cars.push(new Car(10, ASSETS.IMAGE.CAR, LANE.B));
  cars.push(new Car(20, ASSETS.IMAGE.CAR, LANE.C));
  cars.push(new Car(35, ASSETS.IMAGE.CAR, LANE.C));
  cars.push(new Car(50, ASSETS.IMAGE.CAR, LANE.A));
  cars.push(new Car(60, ASSETS.IMAGE.CAR, LANE.B));
  cars.push(new Car(70, ASSETS.IMAGE.CAR, LANE.A));

  for (let i = 0; i < N; i++) {
    var line = new Line();
    line.z = i * segL + 270;

    for (let j = 0; j < 6 + 2; j++) {
      var element = document.createElement("div");
      road.appendChild(element);
      line.elements.push(element);
    }

    lines.push(line);
  }

  for (let i = 0; i < 12; i++) {
    var element = document.createElement("p");
    highscore.appendChild(element);
  }
  updateHighscore();

  reset();

  // START GAME LOOP
  (function loop() {
    requestAnimationFrame(loop);

    let now = timestamp();
    let delta = now - then;

    if (delta > targetFrameRate) {
      then = now - (delta % targetFrameRate);
      update(delta / 1000);
    }
  })();
}

init();
//# sourceURL=pen.js
