kaboom({
  width: 640,
  height: 640,
  background: [248, 249, 250]
})

let recorder = null;
let isRecording = false;

let enemySpeed = 250;
let bulletSpeed = 100;
let enemyFrequency = 1;
let bulletFrequency = 1;

window.addEventListener("load",function(){
  const rangeEnemySpeed = document.querySelector(`input[type='range'][name='enemySpeed']`);
  rangeEnemySpeed.addEventListener(`input`, () => {
    document.querySelector(`#enemySpeed`).innerHTML = `Enemy Speed : ${rangeEnemySpeed.value}`;
    enemySpeed = rangeEnemySpeed.value;
  });
  const rangeEnemyFrequency = document.querySelector(`input[type='range'][name='enemyFrequency']`);
  rangeEnemyFrequency.addEventListener(`input`, () => {
    document.querySelector(`#enemyFrequency`).innerHTML = `Enemy Frequency : ${rangeEnemyFrequency.value}`;
    enemyFrequency = rangeEnemyFrequency.value;
  });
  const rangeBulletSpeed = document.querySelector(`input[type='range'][name='bulletSpeed']`);
  rangeBulletSpeed.addEventListener(`input`, () => {
    document.querySelector(`#bulletSpeed`).innerHTML = `Bullet Speed : ${rangeBulletSpeed.value}`;
    bulletSpeed = rangeBulletSpeed.value;
  });
  const rangeBulletFrequency = document.querySelector(`input[type='range'][name='bulletFrequency']`);
  rangeBulletFrequency.addEventListener(`input`, () => {
    document.querySelector(`#bulletFrequency`).innerHTML = `Bullet Frequency : ${rangeBulletFrequency.value}`;
    bulletFrequency = rangeBulletFrequency.value;
  });

  onKeyDown(["w", "up"], () => {
    player.move(0, -player.speed);
  })
  onKeyDown(["a", "left"], () => {
    player.move(-player.speed, 0);
  })
  onKeyDown(["s", "down"], () => {
    player.move(0, player.speed);
  })
  onKeyDown(["d", "right"], () => {
    player.move(player.speed, 0);
  })

  spawnEnemy();
  spawnBullet();
})

const player = add([
  rect(10, 10),
  color(0, 0, 0),
  pos(center()),
  origin("center"),
  area(),
  // outline(2),
  {speed: 500},
  "player"
])

function spawnEnemy() {
  add([
    rect(10, 10),
    color(0, 0, 255),
    pos(rand(0, width()), 0),
    origin("top"),
    area(),
    cleanup(),
    "enemy",
    {speed: 200},
    enemyMove()
  ])

  wait(enemyFrequency, spawnEnemy);
}
function enemyMove(){
  return {
    require: ["pos", "area"],
    add() {
      this.onCollide("player", (p, c) => {
        addKaboom(p.pos);
      })
    },
    update() {
      this.move(0, enemySpeed);
    }
  }
}

function spawnBullet() {
  const spawnPos = randi(0, 2);
  if(spawnPos == 0) {
    for(let y=-1; y<=1; y++){
      add([
        rect(10, 10),
        color(255, 0, 0),
        pos(0, rand(0, height())),
        origin("left"),
        area(),
        cleanup(),
        "bullet",
        bulletMove(1, y)
      ])
    }
  } else {
    for(let y=-1; y<=1; y++){
      add([
        rect(10, 10),
        color(255, 0, 0),
        pos(width(), rand(0, height())),
        origin("right"),
        area(),
        cleanup(),
        "bullet",
        bulletMove(-1, y)
      ])
    }
  }
  wait(bulletFrequency, spawnBullet);
}
function bulletMove(x, y){
  return {
    require: ["pos", "area"],
    add() {
      this.onCollide("player", (p, c) => {
        addKaboom(p.pos);
      })
    },
    update() {
      this.move(x * bulletSpeed, y * bulletSpeed);
    }
  }
}

const buttonRecording = document.getElementById("buttonRecording");
function clickRecording() {
  if(!isRecording) {
    recorder = record();
    isRecording = true;
    buttonRecording.textContent = "Stop recording"
  } else {
    recorder.download("sample.webm");
    isRecording = false;
    buttonRecording.textContent = "Start recording"
  }
}