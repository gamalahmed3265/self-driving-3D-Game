
// ------------------------------------------------------------
// objects
// ------------------------------------------------------------

class Line {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.X = 0;
    this.Y = 0;
    this.W = 0;

    this.curve = 0;
    this.scale = 0;

    this.elements = [];
    this.special = null;
  }

  project(camX, camY, camZ) {
    this.scale = camD / (this.z - camZ);
    this.X = (1 + this.scale * (this.x - camX)) * halfWidth;
    this.Y = Math.ceil(((1 - this.scale * (this.y - camY)) * height) / 2);
    this.W = this.scale * roadW * halfWidth;
  }

  clearSprites() {
    for (let e of this.elements) e.style.background = "transparent";
  }

  drawSprite(depth, layer, sprite, offset) {
    let destX = this.X + this.scale * halfWidth * offset;
    let destY = this.Y + 4;
    let destW = (sprite.width * this.W) / 265;
    let destH = (sprite.height * this.W) / 265;

    destX += destW * offset;
    destY += destH * -1;

    let obj = layer instanceof Element ? layer : this.elements[layer + 6];
    obj.style.background = `url('${sprite.src}') no-repeat`;
    obj.style.backgroundSize = `${destW}px ${destH}px`;
    obj.style.left = destX + `px`;
    obj.style.top = destY + `px`;
    obj.style.width = destW + `px`;
    obj.style.height = destH + `px`;
    obj.style.zIndex = depth;
  }
}

class Car {
  constructor(pos, type, lane) {
    this.pos = pos;
    this.type = type;
    this.lane = lane;

    var element = document.createElement("div");
    road.appendChild(element);
    this.element = element;
  }
}

class Audio {
  constructor() {
    this.audioCtx = new AudioContext();

    // volume
    this.destination = this.audioCtx.createGain();
    this.volume = 1;
    this.destination.connect(this.audioCtx.destination);

    this.files = {};

    let _self = this;
    this.load(ASSETS.AUDIO.theme, "theme", function (key) {
      let source = _self.audioCtx.createBufferSource();
      source.buffer = _self.files[key];

      let gainNode = _self.audioCtx.createGain();
      gainNode.gain.value = 0.6;
      source.connect(gainNode);
      gainNode.connect(_self.destination);

      source.loop = true;
      source.start(0);
    });
  }

  get volume() {
    return this.destination.gain.value;
  }

  set volume(level) {
    this.destination.gain.value = level;
  }

  play(key, pitch) {
    if (this.files[key]) {
      let source = this.audioCtx.createBufferSource();
      source.buffer = this.files[key];
      source.connect(this.destination);
      if (pitch) source.detune.value = pitch;
      source.start(0);
    } else this.load(key, () => this.play(key));
  }

  load(src, key, callback) {
    let _self = this;
    let request = new XMLHttpRequest();
    request.open("GET", src, true);
    request.responseType = "arraybuffer";
    request.onload = function () {
      _self.audioCtx.decodeAudioData(
        request.response,
        function (beatportBuffer) {
          _self.files[key] = beatportBuffer;
          callback(key);
        },
        function () {}
      );
    };
    request.send();
  }
}
