// ------------------------------------------------------------
// additional controls
// ------------------------------------------------------------

addEventListener(`keyup`, function (e) {
  if (e.code === "KeyM") {
    e.preventDefault();

    audio.volume = audio.volume === 0 ? 1 : 0;
    return;
  }

  if (e.code === "KeyC") {
    e.preventDefault();

    if (inGame) return;

    sleep(0)
      .then((_) => {
        text.classList.remove("blink");
        text.innerText = 3;
        audio.play("beep");
        return sleep(1000);
      })
      .then((_) => {
        text.innerText = 2;
        audio.play("beep");
        return sleep(1000);
      })
      .then((_) => {
        reset();

        home.style.display = "none";

        road.style.opacity = 1;
        hero.style.display = "block";
        hud.style.display = "block";

        audio.play("beep", 500);

        inGame = true;
      });

    return;
  }

  if (e.code === "Escape") {
    e.preventDefault();

    reset();
  }
});
