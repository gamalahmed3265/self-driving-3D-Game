// ------------------------------------------------------------
// map
// ------------------------------------------------------------

function getFun(val) {
  return (i) => val;
}

function genMap() {
  let map = [];

  for (var i = 0; i < mapLength; i += getRand(0, 50)) {
    let section = {
      from: i,
      to: (i = i + getRand(300, 600)),
    };

    let randHeight = getRand(-5, 5);
    let randCurve = getRand(5, 30) * (Math.random() >= 0.5 ? 1 : -1);
    let randInterval = getRand(20, 40);

    if (Math.random() > 0.9)
      Object.assign(section, {
        curve: (_) => randCurve,
        height: (_) => randHeight,
      });
    else if (Math.random() > 0.8)
      Object.assign(section, {
        curve: (_) => 0,
        height: (i) => Math.sin(i / randInterval) * 1000,
      });
    else if (Math.random() > 0.8)
      Object.assign(section, {
        curve: (_) => 0,
        height: (_) => randHeight,
      });
    else
      Object.assign(section, {
        curve: (_) => randCurve,
        height: (_) => 0,
      });

    map.push(section);
  }

  map.push({
    from: i,
    to: i + N,
    curve: (_) => 0,
    height: (_) => 0,
    special: ASSETS.IMAGE.FINISH,
  });
  map.push({ from: Infinity });
  return map;
}

let map = genMap();
