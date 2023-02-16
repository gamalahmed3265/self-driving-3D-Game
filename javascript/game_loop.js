// ------------------------------------------------------------
// game loop
// ------------------------------------------------------------

function update(step) {
  // prepare this iteration
  pos += speed;
  while (pos >= N * segL) pos -= N * segL;
  while (pos < 0) pos += N * segL;

  var startPos = (pos / segL) | 0;
  let endPos = (startPos + N - 1) % N;

  scoreVal += speed * step;
  countDown -= step;

  // left / right position
  playerX -= (lines[startPos].curve / 5000) * step * speed;

  if (KEYS.ArrowRight)
    (hero.style.backgroundPosition = "-220px 0"),
      (playerX += 0.007 * step * speed);
  else if (KEYS.ArrowLeft)
    (hero.style.backgroundPosition = "0 0"),
      (playerX -= 0.007 * step * speed);
  else hero.style.backgroundPosition = "-110px 0";

  playerX = playerX.clamp(-3, 3);

  // speed

  if (inGame && KEYS.ArrowUp) speed = accelerate(speed, accel, step);
  else if (KEYS.ArrowDown) speed = accelerate(speed, breaking, step);
  else speed = accelerate(speed, decel, step);

  if (Math.abs(playerX) > 0.55 && speed >= maxOffSpeed) {
    speed = accelerate(speed, offDecel, step);
  }

  speed = speed.clamp(0, maxSpeed);

  // update map
  let current = map[mapIndex];
  let use = current.from < scoreVal && current.to > scoreVal;
  if (use) sectionProg += speed * step;
  lines[endPos].curve = use ? current.curve(sectionProg) : 0;
  lines[endPos].y = use ? current.height(sectionProg) : 0;
  lines[endPos].special = null;

  if (current.to <= scoreVal) {
    mapIndex++;
    sectionProg = 0;

    lines[endPos].special = map[mapIndex].special;
  }

  // win / lose + UI

  if (!inGame) {
    speed = accelerate(speed, breaking, step);
    speed = speed.clamp(0, maxSpeed);
  } else if (countDown <= 0 || lines[startPos].special) {
    tacho.style.display = "none";

    home.style.display = "block";
    road.style.opacity = 0.4;
    text.innerText = "INSERT COIN";

    highscores.push(lap.innerText);
    highscores.sort();
    updateHighscore();

    inGame = false;
  } else {
    time.innerText = (countDown | 0).pad(3);
    score.innerText = (scoreVal | 0).pad(8);
    tacho.innerText = speed | 0;

    let cT = new Date(timestamp() - start);
    lap.innerText = `${cT.getMinutes()}'${cT.getSeconds().pad(2)}"${cT
      .getMilliseconds()
      .pad(3)}`;
  }

  // sound
  if (speed > 0) audio.play("engine", speed * 4);

  // draw cloud
  cloud.style.backgroundPosition = `${
    (cloudOffset -= lines[startPos].curve * step * speed * 0.13) | 0
  }px 0`;

  // other cars
  for (let car of cars) {
    car.pos = (car.pos + enemy_speed * step) % N;

    // respawn
    if ((car.pos | 0) === endPos) {
      if (speed < 30) car.pos = startPos;
      else car.pos = endPos - 2;
      car.lane = randomProperty(LANE);
    }

    // collision
    const offsetRatio = 5;
    if (
      (car.pos | 0) === startPos &&
      isCollide(playerX * offsetRatio + LANE.B, 0.5, car.lane, 0.5)
    ) {
      speed = Math.min(hitSpeed, speed);
      if (inGame) audio.play("honk");
    }
  }

  // draw road
  let maxy = height;
  let camH = H + lines[startPos].y;
  let x = 0;
  let dx = 0;

  for (let n = startPos; n < startPos + N; n++) {
    let l = lines[n % N];
    let level = N * 2 - n;

    // update view
    l.project(
      playerX * roadW - x,
      camH,
      startPos * segL - (n >= N ? N * segL : 0)
    );
    x += dx;
    dx += l.curve;

    // clear assets
    l.clearSprites();

    // first draw section assets
    if (n % 10 === 0) l.drawSprite(level, 0, ASSETS.IMAGE.TREE, -2);
    if ((n + 5) % 10 === 0)
      l.drawSprite(level, 0, ASSETS.IMAGE.TREE, 1.3);

    if (l.special)
      l.drawSprite(level, 0, l.special, l.special.offset || 0);

    for (let car of cars)
      if ((car.pos | 0) === n % N)
        l.drawSprite(level, car.element, car.type, car.lane);

    // update road

    if (l.Y >= maxy) continue;
    maxy = l.Y;

    let even = ((n / 2) | 0) % 2;
    let grass = ASSETS.COLOR.GRASS[even * 1];
    let rumble = ASSETS.COLOR.RUMBLE[even * 1];
    let tar = ASSETS.COLOR.TAR[even * 1];

    let p = lines[(n - 1) % N];

    drawQuad(
      l.elements[0],
      level,
      grass,
      width / 4,
      p.Y,
      halfWidth + 2,
      width / 4,
      l.Y,
      halfWidth
    );
    drawQuad(
      l.elements[1],
      level,
      grass,
      (width / 4) * 3,
      p.Y,
      halfWidth + 2,
      (width / 4) * 3,
      l.Y,
      halfWidth
    );

    drawQuad(
      l.elements[2],
      level,
      rumble,
      p.X,
      p.Y,
      p.W * 1.15,
      l.X,
      l.Y,
      l.W * 1.15
    );
    drawQuad(l.elements[3], level, tar, p.X, p.Y, p.W, l.X, l.Y, l.W);

    if (!even) {
      drawQuad(
        l.elements[4],
        level,
        ASSETS.COLOR.RUMBLE[1],
        p.X,
        p.Y,
        p.W * 0.4,
        l.X,
        l.Y,
        l.W * 0.4
      );
      drawQuad(
        l.elements[5],
        level,
        tar,
        p.X,
        p.Y,
        p.W * 0.35,
        l.X,
        l.Y,
        l.W * 0.35
      );
    }
  }
}

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
