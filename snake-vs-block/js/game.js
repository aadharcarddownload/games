////////////////////////////////////////////////////////////
// GAME
////////////////////////////////////////////////////////////

/*!
 *
 * GAME SETTING CUSTOMIZATION START
 *
 */
var snakeHeadW = 22; //snake head width
var snakeTailW = 14; //snake tail width
var dividerW = 5; //divider width
var blockW = 100; //block width
var snakePositionY = 600; //snake positon y

var gameScoreText = "[NUMBER]PTS"; //result score text

var levelData = {
  number: 5, //starting block number
  block_arr: [4, 5, 3, 2, 4, 5], //how many blocks per line (maximum 5)
  divider_arr: [1, 2, 3, 1, 2], //how many divider per line (maximum 5)
  powerTimer: 15000, //timer to show power icon
  powerTimer_arr: [0, 5000, 0, 8000], //how long power can use (body, shield, explode, magnet)
  gap_arr: [4, 3, 4, 3, 2], //how many gap after block
  moveSpeed: 3, //screen move speed
  numberIncrease: 1, //number increase
  moveSpeedIncrease: 0.5, //move speed increase
  gridNextLevel: 10,
}; //grid next level check

var scoreData = {
  grid: 10, //score by grid
  power: 30,
}; //score by power obtain

var resultTitleText = "GAME OVER"; //result title text
var resultScoreText = "[NUMBER]PTS"; //result score text

//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareText = "SHARE YOUR SCORE"; //social share message
var shareTitle = "Highscore on Snake VS Block Game is [SCORE]PTS."; //social share score title
var shareMessage =
  "[SCORE]PTS is mine new highscore on Snake VS Block Game! Try it now!"; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */

var playerData = { score: 0 };
var gameData = {
  touch: false,
  moveX: 0,
  stageX: 0,
  stageY: 0,
  body_arr: [],
  block_arr: [],
  divider_arr: [],
  power_arr: [],
  move: true,
  moveSpeed: 1,
  hit: false,
  powerShowTimer: 0,
  timer: 0,
  powerType: [0, 0, 0],
  powerTypeTimer: [0, 0, 0, 0],
  powerNum: 0,
  powerType_arr: [1, 2, 3],
  gridCount: 0,
  number: 0,
  tailCount: 0,
  create: false,
  startX: 0,
  startY: 0,
  curX: 0,
  curY: 0,
  blockSpaceX: 114,
  blockSpaceY: 114,
  blockNum: 0,
  lineNum: 0,
  gapNum: 0,
  gridNum: 0,
  gridY: 0,
  gridType: 1,
  desktop: true,
  paused: true,
};
var collisionMethod = ndgmr.checkRectCollision;
var shapeOffset = { x: 0, y: 0 };

/*!
 *
 * GAME BUTTONS - This is the function that runs to setup button event
 *
 */
function buildGameButton() {
  buttonStart.cursor = "pointer";
  buttonStart.addEventListener("click", function (evt) {
    playSound("soundCoin");
    goPage("game");
  });

  buttonReplay.cursor = "pointer";
  buttonReplay.addEventListener("click", function (evt) {
    playSound("soundCoin");
    goPage("game");
  });

  buttonFacebook.cursor = "pointer";
  buttonFacebook.addEventListener("click", function (evt) {
    share("facebook");
  });
  buttonTwitter.cursor = "pointer";
  buttonTwitter.addEventListener("click", function (evt) {
    share("twitter");
  });
  buttonGoogle.cursor = "pointer";
  buttonGoogle.addEventListener("click", function (evt) {
    share("google");
  });

  buttonSoundOff.cursor = "pointer";
  buttonSoundOff.addEventListener("click", function (evt) {
    toggleGameMute(true);
  });

  buttonSoundOn.cursor = "pointer";
  buttonSoundOn.addEventListener("click", function (evt) {
    toggleGameMute(false);
  });

  buttonFullscreen.cursor = "pointer";
  buttonFullscreen.addEventListener("click", function (evt) {
    toggleFullScreen();
  });
}

/*!
 *
 * DISPLAY PAGES - This is the function that runs to display pages
 *
 */
var curPage = "";
function goPage(page) {
  curPage = page;

  mainContainer.visible = false;
  gameContainer.visible = false;
  resultContainer.visible = false;

  animateButton(buttonStart, false);
  animateButton(buttonReplay, false);

  stopSoundLoop("musicMain");
  TweenMax.killTweensOf(resultScoreTxt);

  var targetContainer = null;
  switch (page) {
    case "main":
      targetContainer = mainContainer;
      animateButton(buttonStart, true);
      playSoundLoop("musicMain");
      break;

    case "game":
      targetContainer = gameContainer;
      startGame();
      break;

    case "result":
      targetContainer = resultContainer;
      resultScoreTxt.text = resultScoreText.replace(
        "[NUMBER]",
        playerData.score
      );
      stopGame();
      animateButton(buttonReplay, true);
      playSound("soundFail");
      TweenMax.to(resultScoreTxt, 3.5, {
        overwrite: true,
        onComplete: function () {
          playSoundLoop("musicMain");
        },
      });
      saveGame(playerData.score);
      break;
  }

  if (targetContainer != null) {
    targetContainer.visible = true;
    targetContainer.alpha = 0;
    TweenMax.to(targetContainer, 0.5, { alpha: 1, overwrite: true });
  }
}

/*!
 *
 * ANIMATE BUTTON - This is the function that runs to animate button
 *
 */
function animateButton(obj, con, alpha) {
  var tweenSpeed = 0.1;
  if (con) {
    var alphaNum = 1;
    if (alpha) {
      alpha = false;
      alphaNum = 0.3;
    } else {
      alpha = true;
    }
    TweenMax.to(obj, tweenSpeed, {
      alpha: alphaNum,
      overwrite: true,
      onComplete: animateButton,
      onCompleteParams: [obj, con, alpha],
    });
  } else {
    TweenMax.to(obj, tweenSpeed, { alpha: 1, overwrite: true });
  }
}

/*!
 *
 * START GAME - This is the function that runs to start play game
 *
 */

function startGame() {
  gameData.paused = false;
  playerData.score = 0;
  backgroundWhite.alpha = 0;
  if (gameData.desktop) {
    gameData.touch = true;
  } else {
    gameData.touch = false;
  }
  gameData.body_arr = [];
  gameData.block_arr = [];
  gameData.divider_arr = [];
  gameData.power_arr = [];
  gameData.move = false;
  gameData.hit = false;
  gameData.powerShowTimer = 0;
  gameData.powerType = [0, 0, 0, 0];
  gameData.powerTypeTimer = [0, 0, 0, 0];
  gameData.tailCount = 1;
  gameData.create = false;
  gameData.gridType = 1;

  gameData.timer = new Date();
  gameData.moveSpeed = levelData.moveSpeed;
  gameData.gridCount = 0;
  gameData.number = levelData.number;

  blockContainer.y = shapeContainer.y = 0;
  shapeOffset.y = shapeContainer.y;

  resetPowerShowTimer();
  createSnakeHead();
  createSnakeTails(4);
  setupLevel();

  createLevelGrid();
}

/*!
 *
 * STOP GAME - This is the function that runs to stop play game
 *
 */
function stopGame() {
  TweenMax.killAll();

  gameData.paused = true;
  backgroundWhite.alpha = 0;
  gameData.touch = false;
  gameData.body_arr = [];
  gameData.block_arr = [];
  gameData.divider_arr = [];
  gameData.power_arr = [];
  gameData.move = false;
  gameData.hit = false;
  gameData.powerShowTimer = 0;
  gameData.create = false;

  shapeContainer.removeAllChildren();
  blockContainer.removeAllChildren();
}

/*!
 *
 * SAVE GAME - This is the function that runs to save game
 *
 */
function saveGame(score) {
  /*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

/*!
 *
 * SETUP GAME - This is the function that runs to setup game
 *
 */
function setupTouchEvents() {
  if ($.browser.mobile || isTablet) {
    gameData.desktop = false;
  }

  //events
  stage.on("stagemousedown", function (evt) {
    if (!gameData.desktop) {
      gameData.touch = true;
    }
    gameData.stageX = evt.stageX;
    gameData.stageY = evt.stageY;
    gameData.stageX =
      gameData.stageX < (canvasW / 100) * 15
        ? (canvasW / 100) * 15
        : gameData.stageX;
    gameData.stageX =
      gameData.stageX > (canvasW / 100) * 85
        ? (canvasW / 100) * 85
        : gameData.stageX;
  });
  stage.on("stagemousemove", function (evt) {
    if (gameData.touch) {
      gameData.stageX = evt.stageX;
      gameData.stageY = evt.stageY;
      gameData.stageX =
        gameData.stageX < (canvasW / 100) * 15
          ? (canvasW / 100) * 15
          : gameData.stageX;
      gameData.stageX =
        gameData.stageX > (canvasW / 100) * 85
          ? (canvasW / 100) * 85
          : gameData.stageX;
    }
  });
  stage.on("stagemouseup", function (evt) {
    if (!gameData.desktop) {
      gameData.touch = false;
    }
  });
}

/*!
 *
 * CREATE SNAKE HEAD - This is the function that runs to create snake head
 *
 */
function createSnakeHead() {
  var newHead = itemHeadHit.clone();
  newHead.x = gameData.stageX = canvasW / 2;
  newHead.y = snakePositionY;
  newHead.visible = false;
  itemHeadAnimate.gotoAndStop("static");
  itemPowerShield.visible = false;
  itemPowerMagnet.visible = false;

  shapeContainer.addChild(
    newHead,
    itemHeadAnimate,
    itemPowerShield,
    itemPowerMagnet,
    headScoreTxt
  );
  gameData.body_arr.push(newHead);
}

/*!
 *
 * CREATE SNAKE TAILS - This is the function that runs to create snake tails
 *
 */
function createSnakeTails(total) {
  var lastTail = gameData.body_arr[gameData.body_arr.length - 1];
  for (var n = 0; n < total; n++) {
    var newTail;
    newTail = this["itemTail" + gameData.tailCount].clone();
    newTail.x = lastTail.x;
    newTail.y = lastTail.y;

    shapeContainer.addChild(newTail);
    gameData.body_arr.push(newTail);

    gameData.tailCount++;
    gameData.tailCount = gameData.tailCount > 3 ? 1 : gameData.tailCount;
  }

  shapeContainer.setChildIndex(
    itemHeadAnimate,
    shapeContainer.getNumChildren() - 1
  );
  shapeContainer.setChildIndex(
    itemPowerMagnet,
    shapeContainer.getNumChildren() - 1
  );
  shapeContainer.setChildIndex(
    itemPowerShield,
    shapeContainer.getNumChildren() - 1
  );
  shapeContainer.setChildIndex(
    headScoreTxt,
    shapeContainer.getNumChildren() - 1
  );
}

function removeTails() {
  if (gameData.body_arr.length == 1) {
    //fail
    goPage("result");
  } else {
    var lastTail = gameData.body_arr[gameData.body_arr.length - 1];
    shapeContainer.removeChild(lastTail);
    gameData.body_arr.splice(gameData.body_arr.length - 1, 1);
    gameData.tailCount--;
    gameData.tailCount = gameData.tailCount < 1 ? 3 : gameData.tailCount;
  }
}

/*!
 *
 * CREATE BLOCK - This is the function that runs to create block
 *
 */
function createBlock(x, y, number) {
  var newBlock;
  newBlock = this["itemBlock3"].clone();

  if (number <= Math.floor(Number(gameData.number) / 2)) {
    newBlock = this["itemBlock1"].clone();
  } else if (number <= Number(gameData.number)) {
    newBlock = this["itemBlock2"].clone();
  }
  newBlock.x = x;
  newBlock.y = y;
  newBlock.hitNumber = number;

  var newText = new createjs.Text();
  newText.font = "50px aspergitbold";
  newText.color = "#fff";
  newText.textAlign = "center";
  newText.textBaseline = "alphabetic";
  newText.text = number;
  newText.x = x;
  newText.y = y + 20;

  blockContainer.addChild(newBlock, newText);
  gameData.block_arr.push({
    obj: newBlock,
    text: newText,
    x: newBlock.x,
    distance: 0,
  });
}

/*!
 *
 * CREATE DIVIDER - This is the function that runs to create divider
 *
 */
function createDivider(x, y) {
  var newDivider = itemDivider.clone();
  newDivider.x = x;
  newDivider.y = y;
  blockContainer.addChild(newDivider);
  gameData.divider_arr.push({ obj: newDivider, x: newDivider.x });
}

/*!
 *
 * CREATE POWER - This is the function that runs to create power
 *
 */
function createPower(x, y, type, number) {
  if (randomBoolean()) {
    x -= 33;
  } else {
    x += 33;
  }

  var newText = new createjs.Text();
  newText.font = "25px aspergitbold";
  newText.color = "#fff";
  newText.textAlign = "center";
  newText.textBaseline = "alphabetic";
  newText.text = number;
  newText.x = x;
  newText.y = y - 25;

  var newPower;
  if (type == 0) {
    newPower = iconTail.clone();
  } else if (type == 1) {
    newPower = iconShield.clone();
    newText.visible = false;
  } else if (type == 2) {
    newPower = iconExplode.clone();
    newText.visible = false;
  } else if (type == 3) {
    newPower = iconMagnet.clone();
    newText.visible = false;
  }
  newPower.x = x;
  newPower.y = y;
  newPower.hitNumber = number;

  animateButton(newPower, true);
  blockContainer.addChild(newPower, newText);
  gameData.power_arr.push({ obj: newPower, text: newText, type: type });
}

/*!
 *
 * UPDATE GAME - This is the function that runs to loop game update
 *
 */
function updateGame() {
  if (!gameData.paused) {
    gameData.timer = new Date();

    //loop game
    loopSnakeTails();

    //update score
    scoreTxt.text = gameScoreText.replace("[NUMBER]", playerData.score);
    headScoreTxt.text = gameData.body_arr.length;

    //screen move
    if (gameData.move) {
      shapeContainer.y += gameData.moveSpeed;
      blockContainer.y = shapeContainer.y;
      shapeOffset.y = shapeContainer.y;
    }

    checkPowerTimer();
    loopLevelScreen();
  }
}

function loopSnakeTails() {
  var firstShape = 0;
  var angle = 0;
  var pos = 0;

  for (var n = 0; n < gameData.body_arr.length; n++) {
    var thisShape = gameData.body_arr[n];
    if (n == 0) {
      //head
      var distance = thisShape.x - gameData.stageX;
      angle = (distance / (canvasW / 2)) * 60;
      itemHeadAnimate.rotation = -angle;

      detectObjectRange(thisShape, gameData.stageX, snakeHeadW);
      detectBlockCollision(thisShape);
      detectPowerCollision(thisShape);

      itemHeadAnimate.x =
        itemPowerShield.x =
        itemPowerMagnet.x =
        headScoreTxt.x =
          thisShape.x;
      if (gameData.move) {
        thisShape.y = snakePositionY - shapeOffset.y;
        itemHeadAnimate.y = itemPowerShield.y = itemPowerMagnet.y = thisShape.y;
        headScoreTxt.y = thisShape.y - 45;
      }
    } else {
      //tails
      angle = getDirection(thisShape, firstShape);
      if (n == 1) {
        pos = getAnglePosition(
          firstShape.x,
          firstShape.y,
          (snakeHeadW - 5) * 2,
          angle + 180
        );
      } else {
        pos = getAnglePosition(
          firstShape.x,
          firstShape.y,
          snakeTailW * 2,
          angle + 180
        );
      }
      detectObjectRange(thisShape, pos.x, snakeTailW);
      thisShape.y = pos.y;
      thisShape.rotation = angle + 90;
    }
    firstShape = thisShape;
  }
}

/*!
 *
 * DETECT BLOCK COLLISION - This is the function that runs to detect block collison
 *
 */
function detectBlockCollision(obj) {
  var hitted = false;
  for (var n = 0; n < gameData.block_arr.length; n++) {
    var thisBlock = gameData.block_arr[n].obj;
    gameData.block_arr[n].distance = getDistance(obj, thisBlock);
  }

  sortOnObject(gameData.block_arr, "distance", false);

  for (var n = 0; n < gameData.block_arr.length; n++) {
    var thisBlock = gameData.block_arr[n].obj;
    var intersection = collisionMethod(obj, thisBlock);
    var thisBlockY = getObjY(thisBlock.y);
    var thisObjY = getObjY(obj.y);

    var rangeNum = gameData.blockSpaceY / 3 + snakeHeadW / 2;
    if (
      intersection &&
      thisBlock.visible &&
      thisObjY <= thisBlockY - rangeNum
    ) {
      hitted = true;
      gameData.move = false;
      startHitBlockAnimation(n);
    }
  }

  if (!hitted) {
    gameData.move = true;
  }
}

/*!
 *
 * DETECT POWER COLLISION - This is the function that runs to detect power collison
 *
 */
function detectPowerCollision(obj) {
  for (var n = 0; n < gameData.power_arr.length; n++) {
    var thisPower = gameData.power_arr[n].obj;
    var thisText = gameData.power_arr[n].text;
    var intersection = collisionMethod(obj, thisPower);

    if (thisPower.visible) {
      if (intersection) {
        thisPower.visible = thisText.visible = false;
        startHitPowerAnimation(n);
      } else if (gameData.powerType[3] == 1) {
        var thisDistance = getDistance(obj, thisPower);
        if (thisDistance < 200) {
          var tweenSpeed = 0.2;
          if (gameData.moveSpeed < 5) {
            tweenSpeed = 0.4;
          }
          TweenMax.to(thisPower, tweenSpeed, {
            x: obj.x,
            y: obj.y,
            overwrite: true,
            onComplete: function () {},
          });
        } else {
          TweenMax.killTweensOf(thisPower);
          animateButton(thisPower, true);
        }
      }
    }
  }
}

/*!
 *
 * START HIT POWER ANIMATION - This is the function that runs to play hit power animation
 *
 */
function startHitPowerAnimation(num) {
  var thisPower = gameData.power_arr[num].obj;
  var thisPowerType = gameData.power_arr[num].type;
  thisPower.visible = false;

  playerData.score += scoreData.power;
  gameData.powerType[thisPowerType] = 1;
  playSound("soundCoin");
  gameData.powerTypeTimer[thisPowerType] = new Date();

  if (thisPowerType == 0) {
    createSnakeTails(thisPower.hitNumber);
  } else if (thisPowerType == 1) {
    //shield
    itemHeadAnimate.gotoAndStop("power");
    itemPowerShield.visible = true;
    playSound("soundPower");
  } else if (thisPowerType == 2) {
    //explode
    playSound("soundClear");
    backgroundWhite.alpha = 1;
    TweenMax.to(backgroundWhite, 0.2, {
      alpha: 0,
      overwrite: true,
      onComplete: function () {},
    });
  } else if (thisPowerType == 3) {
    //magnet
    playSound("soundPower");
    itemPowerMagnet.visible = true;
  }
}

function checkPowerTimer() {
  if (gameData.powerType[1] == 1) {
    var powerDistance =
      gameData.timer.getTime() - gameData.powerTypeTimer[1].getTime();
    if (powerDistance >= levelData.powerTimer_arr[1]) {
      itemHeadAnimate.gotoAndStop("static");
      itemPowerShield.visible = false;
      gameData.powerType[1] = 0;
    } else {
      itemPowerShield.rotation++;
    }
  } else if (gameData.powerType[3] == 1) {
    var powerDistance =
      gameData.timer.getTime() - gameData.powerTypeTimer[3].getTime();
    if (powerDistance >= levelData.powerTimer_arr[3]) {
      itemPowerMagnet.visible = false;
      gameData.powerType[3] = 0;
    } else {
      itemPowerMagnet.rotation++;
    }
  }
}

function resetPowerShowTimer() {
  gameData.powerShowTimer = new Date();
}

/*!
 *
 * START HIT BLOCK ANIMATION - This is the function that runs to play hit block animation
 *
 */
function startHitBlockAnimation(num) {
  if (!gameData.hit) {
    gameData.hit = true;

    var thisBlock = gameData.block_arr[num].obj;
    var thisText = gameData.block_arr[num].text;
    var thisNumber = Number(thisBlock.hitNumber);

    blockContainer.addChild(itemBlockWhite);
    itemBlockWhite.x = thisBlock.x;
    itemBlockWhite.y = thisBlock.y;
    itemBlockWhite.alpha = 1;

    playSound("soundHit");

    if (gameData.powerType[1] == 1) {
      thisBlock.visible = thisText.visible = false;
      gameData.hit = false;
      gameData.move = true;

      TweenMax.to(itemBlockWhite, 0.2, { alpha: 0, overwrite: true });
    } else {
      thisNumber--;
      if (thisNumber >= 0) {
        removeTails();
        thisText.text = thisNumber;
        thisBlock.hitNumber = thisNumber;

        if (thisNumber <= 0) {
          thisBlock.visible = thisText.visible = false;
          gameData.hit = false;
          gameData.move = true;

          TweenMax.to(itemBlockWhite, 0.2, { alpha: 0, overwrite: true });
        } else {
          TweenMax.to(itemBlockWhite, 0.2, {
            alpha: 0,
            overwrite: true,
            onComplete: function () {
              gameData.hit = false;
            },
          });
        }
      }
    }
  }
}

/*!
 *
 * DETECT OBJECT RANGE - This is the function that runs to detect object range
 *
 */
function detectObjectRange(obj, newY, snakeW) {
  var hitted = false;
  if (newY > obj.x) {
    //sortOnObject(gameData.block_arr, 'x', false);
    //sortOnObject(gameData.divider_arr, 'x', false);
  } else {
    //sortOnObject(gameData.block_arr, 'x', true);
    //sortOnObject(gameData.divider_arr, 'x', true);
  }

  //block
  for (var n = 0; n < gameData.block_arr.length; n++) {
    var thisBlock = gameData.block_arr[n].obj;
    var thisBlockY = getObjY(thisBlock.y);
    var thisObjY = getObjY(obj.y);
    var rangeNum = gameData.blockSpaceY / 2 + snakeW / 2;

    if (
      thisObjY >= thisBlockY - rangeNum &&
      thisObjY <= thisBlockY + rangeNum
    ) {
      if (
        obj.x <= thisBlock.x - (snakeW + blockW / 2) &&
        newY >= thisBlock.x - (snakeW + blockW / 2)
      ) {
        n = gameData.block_arr.length;
        hitted = true;
        obj.x = thisBlock.x - (snakeW + blockW / 2);
      }

      if (
        obj.x >= thisBlock.x + (snakeW + blockW / 2) &&
        newY <= thisBlock.x + (snakeW + blockW / 2)
      ) {
        n = gameData.block_arr.length;
        hitted = true;
        obj.x = thisBlock.x + (snakeW + blockW / 2);
      }
    }
  }

  //lines
  for (var n = 0; n < gameData.divider_arr.length; n++) {
    var thisLine = gameData.divider_arr[n].obj;
    var thisLineY = getObjY(thisLine.y);
    var thisObjY = getObjY(obj.y);
    var rangeNum = gameData.blockSpaceY / 2 + snakeW / 2;

    if (thisObjY >= thisLineY - rangeNum && thisObjY <= thisLineY + rangeNum) {
      if (
        obj.x <= thisLine.x - (snakeW + dividerW) &&
        newY >= thisLine.x - (snakeW + dividerW)
      ) {
        n = gameData.divider_arr.length;
        hitted = true;
        obj.x = thisLine.x - (snakeW + dividerW);
      }

      if (
        obj.x >= thisLine.x + (snakeW + dividerW) &&
        newY <= thisLine.x + (snakeW + dividerW)
      ) {
        n = gameData.divider_arr.length;
        hitted = true;
        obj.x = thisLine.x + (snakeW + dividerW);
      }

      var distance = obj.x - thisLine.x;
      if (Math.abs(distance) < snakeW + dividerW) {
        n = gameData.divider_arr.length;
        hitted = true;
        if (distance >= 0) {
          obj.x = thisLine.x + (snakeW + dividerW);
        } else {
          obj.x = thisLine.x - (snakeW + dividerW);
        }
      }
    }
  }

  if (!hitted) {
    obj.x = newY;
  }
}

/*!
 *
 * SETUP LEVELS - This is the function that runs to setup levels
 *
 */
function setupLevel() {
  gameData.create = false;
  gameData.startX = (canvasW / 100) * 20.5;
  gameData.startY = (canvasH / 100) * 10;

  levelData.curX = gameData.startX;
  gameData.curY = gameData.startY;

  gameData.blockNum = 0;
  shuffle(levelData.block_arr);

  gameData.gapNum = 0;
  shuffle(levelData.gap_arr);

  gameData.lineNum = 0;
  shuffle(levelData.divider_arr);

  gameData.powerNum = 0;
  shuffle(gameData.powerType_arr);

  gameData.gridNum = 0;
}

/*!
 *
 * LEVEL LOOP - This is the function that runs to loop level
 *
 */
function loopLevelScreen() {
  if (getObjY(gameData.gridY) <= 1000) {
    //create levels
    if (gameData.create) {
      createLevelGrid();
    }
  }

  var outRange = -100;
  if (gameData.powerType[2] == 1) {
    outRange = 850;
    gameData.powerType[2] = 0;
  }

  //remove objects
  var removeNum = 0;
  var removeLoopNum = 10;
  for (var r = 0; r < removeLoopNum; r++) {
    removeNum = 0;
    for (var n = 0; n < gameData.block_arr.length; n++) {
      var thisBlock = gameData.block_arr[n].obj;
      var thisText = gameData.block_arr[n].text;
      if (getObjY(thisBlock.y) <= outRange) {
        blockContainer.removeChild(thisBlock);
        blockContainer.removeChild(thisText);
        gameData.block_arr.splice(n, 1);
        removeNum++;
      }
    }

    for (var n = 0; n < gameData.divider_arr.length; n++) {
      var thisLine = gameData.divider_arr[n].obj;
      if (getObjY(thisLine.y) <= outRange) {
        blockContainer.removeChild(thisLine);
        gameData.divider_arr.splice(n, 1);
        removeNum++;
      }
    }

    for (var n = 0; n < gameData.power_arr.length; n++) {
      var thisPower = gameData.power_arr[n].obj;
      var thisText = gameData.power_arr[n].text;
      if (getObjY(thisPower.y) <= outRange) {
        TweenMax.killTweensOf(thisPower);

        blockContainer.removeChild(thisPower);
        blockContainer.removeChild(thisText);
        gameData.power_arr.splice(n, 1);
        removeNum++;
      }
    }

    if (removeNum == 0) {
      r = removeLoopNum;
    }
  }
}

/*!
 *
 * CREATE LEVEL BY GRID - This is the function that runs to create level by grid
 *
 */
function createLevelGrid() {
  if (gameData.gridType == 0) {
    createLevelBlocks();
    gameData.gridType = 1;
  } else {
    createLevelSpacing();
    gameData.gridType = 0;
  }
  gameData.gridNum++;
  gameData.gridCount++;
  gameData.create = true;

  if (gameData.gridNum > 0) {
    playerData.score += scoreData.grid;
  }

  if (gameData.gridCount >= levelData.gridNextLevel) {
    gameData.gridCount = 0;
    gameData.moveSpeed += levelData.moveSpeedIncrease;
    gameData.number += levelData.numberIncrease;
  }
}

/*!
 *
 * CREATE LEVEL BLOCKS - This is the function that runs to create level blocks
 *
 */
function createLevelBlocks() {
  //calculate block
  var curBlock_arr = [];
  var curNumber_arr = [];
  var curNumber = gameData.number;
  for (var n = 0; n < 5; n++) {
    if (n == 0 && randomBoolean()) {
      //big number
      curNumber_arr.push(Math.floor(Math.random() * (curNumber * 2)) + 1);
    } else {
      //normal number
      curNumber_arr.push(Math.floor(Math.random() * curNumber) + 1);
    }

    if (gameData.gridNum == 1) {
      //starting number
      if (n < Math.floor(Math.random() * 3) + 1) {
        curBlock_arr.push(1);
      }
    } else {
      if (n < levelData.block_arr[gameData.blockNum]) {
        curBlock_arr.push(1);
      } else {
        curBlock_arr.push(0);
      }
    }
  }
  shuffle(curNumber_arr);
  shuffle(curBlock_arr);

  var count = 1;
  for (var n = 0; n < 5; n++) {
    if (curBlock_arr[n] == 1) {
      createBlock(levelData.curX, gameData.curY, Number(curNumber_arr[n]));
    }
    levelData.curX += gameData.blockSpaceX;
    count++;
    if (count > 5) {
      count = 1;
      levelData.curX = gameData.startX;
      gameData.curY -= gameData.blockSpaceX;
      gameData.gridY = gameData.curY;
    }
  }

  gameData.blockNum++;
  if (gameData.blockNum > levelData.block_arr.length - 1) {
    gameData.blockNum = 0;
    shuffle(levelData.block_arr);
  }
}

/*!
 *
 * CREATE LEVEL SPACING - This is the function that runs to create level spacing
 *
 */
function createLevelSpacing() {
  //calculate divider
  var curDivider_arr = [];
  var additionalDivider = Math.floor(
    Math.random() * levelData.gap_arr[gameData.gapNum]
  );
  for (var n = 0; n < 5; n++) {
    if (n < levelData.divider_arr[gameData.lineNum]) {
      curDivider_arr.push(1);
    } else {
      curDivider_arr.push(0);
    }
  }
  shuffle(curDivider_arr);

  var lineNum = 0;
  var count = 1;
  var total = 1 * levelData.gap_arr[gameData.gapNum];
  total = total * 5;

  //powers
  //how many power tails?
  var totalPowerTails = Math.floor(Math.random() * 3);

  //other powers
  var totalPowerOthers = 0;
  var powerDistance =
    gameData.timer.getTime() - gameData.powerShowTimer.getTime();
  if (powerDistance >= levelData.powerTimer) {
    totalPowerOthers = 1;
    resetPowerShowTimer();
  }

  if (gameData.gridNum == 0) {
    //starting powers
    totalPowerTails = 2;
  }

  //generate powers
  var totalPowers = totalPowerTails + totalPowerOthers;
  var curPowerType_arr = [];
  var powerArrayNum = 0;

  for (var n = 0; n < totalPowers; n++) {
    if (n < totalPowerTails) {
      curPowerType_arr.push(0);
    } else {
      curPowerType_arr.push(gameData.powerType_arr[gameData.powerNum]);
      gameData.powerNum++;
    }
  }

  var curPower_arr = [];
  for (var n = 0; n < total; n++) {
    curPower_arr.push(n);
  }
  shuffle(curPower_arr);
  curPower_arr.splice(totalPowers, curPower_arr.length - totalPowers);
  curPower_arr.sort(sortNumber);

  for (var n = 0; n < total; n++) {
    if (curDivider_arr[count - 1] == 1 && lineNum >= 1) {
      createDivider(levelData.curX, gameData.curY);
    } else {
      if (randomBoolean() && additionalDivider > 0 && lineNum >= 1) {
        additionalDivider--;
        createDivider(levelData.curX, gameData.curY);
      }
    }

    if (n == Number(curPower_arr[powerArrayNum])) {
      var powerNum = Math.floor(Math.random() * (levelData.number / 2)) + 1;
      createPower(
        levelData.curX,
        gameData.curY,
        curPowerType_arr[powerArrayNum],
        powerNum
      );
      powerArrayNum++;
    }

    levelData.curX += gameData.blockSpaceX;
    count++;

    if (count > 5) {
      count = 1;
      levelData.curX = gameData.startX;
      gameData.curY -= gameData.blockSpaceX;
      gameData.gridY = gameData.curY;
      lineNum++;
    }
  }

  gameData.lineNum++;
  if (gameData.lineNum > levelData.divider_arr.length - 1) {
    gameData.lineNum = 0;
    shuffle(levelData.divider_arr);
  }

  if (gameData.powerNum > gameData.powerType_arr.length - 1) {
    console.log("shuffle");
    gameData.powerNum = 0;
    shuffle(gameData.powerType_arr);
  }

  gameData.gapNum++;
  if (gameData.gapNum > levelData.gap_arr.length - 1) {
    gameData.gapNum = 0;
    shuffle(levelData.gap_arr);
  }
}

/*!
 *
 * OTHERS - This is the function that runs for additional function
 *
 */
function getObjY(posY) {
  return canvasH - (shapeOffset.y + posY);
}

/*!
 *
 * OPTIONS - This is the function that runs to mute and fullscreen
 *
 */
function toggleGameMute(con) {
  buttonSoundOff.visible = false;
  buttonSoundOn.visible = false;
  toggleMute(con);
  if (con) {
    buttonSoundOn.visible = true;
  } else {
    buttonSoundOff.visible = true;
  }
}

function toggleFullScreen() {
  if (
    !document.fullscreenElement && // alternative standard method
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(
        Element.ALLOW_KEYBOARD_INPUT
      );
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 *
 * SHARE - This is the function that runs to open share url
 *
 */
function share(action) {
  var loc = location.href;
  loc = loc.substring(0, loc.lastIndexOf("/") + 1);

  var title = "";
  var text = "";

  title = shareTitle.replace("[SCORE]", playerData.score);
  text = shareMessage.replace("[SCORE]", playerData.score);
  var shareurl = "";

  if (action == "twitter") {
    shareurl = "https://twitter.com/intent/tweet?url=" + loc + "&text=" + text;
  } else if (action == "facebook") {
    shareurl =
      "https://www.facebook.com/sharer/sharer.php?u=" +
      encodeURIComponent(
        loc +
          "share.php?desc=" +
          text +
          "&title=" +
          title +
          "&url=" +
          loc +
          "&thumb=" +
          loc +
          "share.jpg&width=590&height=300"
      );
  } else if (action == "google") {
    shareurl = "https://plus.google.com/share?url=" + loc;
  }

  window.open(shareurl);
}
