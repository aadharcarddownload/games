////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage;
var canvasW = 0;
var canvasH = 0;

/*!
 *
 * START GAME CANVAS - This is the function that runs to setup game canvas
 *
 */
function initGameCanvas(w, h) {
  var gameCanvas = document.getElementById("gameCanvas");
  gameCanvas.width = w;
  gameCanvas.height = h;

  canvasW = w;
  canvasH = h;
  stage = new createjs.Stage("gameCanvas");

  createjs.Touch.enable(stage);
  stage.enableMouseOver(20);
  stage.mouseMoveOutside = true;

  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", tick);
}

var guide = false;
var canvasContainer, mainContainer, gameContainer, resultContainer;
var guideline,
  bg,
  logo,
  buttonStart,
  buttonReplay,
  buttonFacebook,
  buttonTwitter,
  buttonGoogle,
  buttonFullscreen,
  buttonSoundOn,
  buttonSoundOff;

/*!
 *
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 *
 */
function buildGameCanvas() {
  canvasContainer = new createjs.Container();
  mainContainer = new createjs.Container();
  gameContainer = new createjs.Container();
  shapeContainer = new createjs.Container();
  blockContainer = new createjs.Container();
  resultContainer = new createjs.Container();

  backgroundWhite = new createjs.Bitmap(loader.getResult("backgroundWhite"));
  backgroundWhite.alpha = 0;
  bg = new createjs.Bitmap(loader.getResult("background"));
  logo = new createjs.Bitmap(loader.getResult("logo"));

  buttonStart = new createjs.Bitmap(loader.getResult("buttonStart"));
  centerReg(buttonStart);
  buttonStart.x = canvasW / 2;
  buttonStart.y = (canvasH / 100) * 55;

  gradient = new createjs.Bitmap(loader.getResult("gradient"));

  itemHeadHit = new createjs.Bitmap(loader.getResult("itemHeadHit"));
  centerReg(itemHeadHit);
  itemHeadHit.x = -500;

  var _frameW = 39;
  var _frameH = 51;
  var _frame = {
    regX: 20,
    regY: 33,
    height: _frameH,
    count: 2,
    width: _frameW,
  };
  var _animations = {
    static: { frames: [0], speed: 1 },
    power: { frames: [1], speed: 1 },
  };

  itemHeadData = new createjs.SpriteSheet({
    images: [loader.getResult("itemHead").src],
    frames: _frame,
    animations: _animations,
  });

  itemHeadAnimate = new createjs.Sprite(itemHeadData, "static");
  itemHeadAnimate.framerate = 20;
  itemHeadAnimate.x = -100;

  itemTail1 = new createjs.Bitmap(loader.getResult("itemTail1"));
  centerReg(itemTail1);
  itemTail2 = new createjs.Bitmap(loader.getResult("itemTail2"));
  centerReg(itemTail2);
  itemTail3 = new createjs.Bitmap(loader.getResult("itemTail3"));
  centerReg(itemTail3);
  itemTail1.x = itemTail2.x = itemTail3.x = -500;

  itemBlockWhite = new createjs.Bitmap(loader.getResult("itemBlockWhite"));
  centerReg(itemBlockWhite);
  itemBlock1 = new createjs.Bitmap(loader.getResult("itemBlock1"));
  centerReg(itemBlock1);
  itemBlock2 = new createjs.Bitmap(loader.getResult("itemBlock2"));
  centerReg(itemBlock2);
  itemBlock3 = new createjs.Bitmap(loader.getResult("itemBlock3"));
  centerReg(itemBlock3);
  itemBlockWhite.x = itemBlock1.x = itemBlock2.x = itemBlock3.x = -500;

  itemDivider = new createjs.Bitmap(loader.getResult("itemDivider"));
  centerReg(itemDivider);

  iconShield = new createjs.Bitmap(loader.getResult("iconShield"));
  centerReg(iconShield);

  iconTail = new createjs.Bitmap(loader.getResult("iconTail"));
  centerReg(iconTail);

  iconExplode = new createjs.Bitmap(loader.getResult("iconExplode"));
  centerReg(iconExplode);

  iconMagnet = new createjs.Bitmap(loader.getResult("iconMagnet"));
  centerReg(iconMagnet);

  iconShield.x = iconTail.x = iconExplode.x = iconMagnet.x = -500;

  itemPowerShield = new createjs.Bitmap(loader.getResult("itemPowerShield"));
  centerReg(itemPowerShield);
  itemPowerMagnet = new createjs.Bitmap(loader.getResult("itemPowerMagnet"));
  centerReg(itemPowerMagnet);
  itemDivider.x =
    iconShield.x =
    iconTail.x =
    iconExplode.x =
    itemPowerShield.x =
    itemPowerMagnet.x =
      -500;

  itemSide = new createjs.Bitmap(loader.getResult("itemSide"));

  scoreTxt = new createjs.Text();
  scoreTxt.font = "45px aspergitbold";
  scoreTxt.color = "#fff";
  scoreTxt.textAlign = "center";
  scoreTxt.textBaseline = "alphabetic";
  scoreTxt.text = "";
  scoreTxt.x = canvasW / 2;

  headScoreTxt = new createjs.Text();
  headScoreTxt.font = "35px aspergitbold";
  headScoreTxt.color = "#fff";
  headScoreTxt.textAlign = "center";
  headScoreTxt.textBaseline = "alphabetic";
  headScoreTxt.text = "";

  //result
  resultTitleTxt = new createjs.Text();
  resultTitleTxt.font = "50px aspergitbold";
  resultTitleTxt.color = "#fff";
  resultTitleTxt.textAlign = "center";
  resultTitleTxt.textBaseline = "alphabetic";
  resultTitleTxt.text = resultTitleText;
  resultTitleTxt.x = canvasW / 2;
  resultTitleTxt.y = (canvasH / 100) * 32;

  resultScoreTxt = new createjs.Text();
  resultScoreTxt.font = "120px aspergitbold";
  resultScoreTxt.color = "#51B9AD";
  resultScoreTxt.textAlign = "center";
  resultScoreTxt.textBaseline = "alphabetic";
  resultScoreTxt.text = resultScoreText;
  resultScoreTxt.x = canvasW / 2;
  resultScoreTxt.y = (canvasH / 100) * 44;

  resultShareTxt = new createjs.Text();
  resultShareTxt.font = "25px aspergitbold";
  resultShareTxt.color = "#DDDDDC";
  resultShareTxt.textAlign = "center";
  resultShareTxt.textBaseline = "alphabetic";
  resultShareTxt.text = shareText;
  resultShareTxt.x = canvasW / 2;
  resultShareTxt.y = (canvasH / 100) * 65;

  buttonFacebook = new createjs.Bitmap(loader.getResult("buttonFacebook"));
  buttonTwitter = new createjs.Bitmap(loader.getResult("buttonTwitter"));
  buttonGoogle = new createjs.Bitmap(loader.getResult("buttonGoogle"));
  centerReg(buttonFacebook);
  createHitarea(buttonFacebook);
  centerReg(buttonTwitter);
  createHitarea(buttonTwitter);
  centerReg(buttonGoogle);
  createHitarea(buttonGoogle);
  buttonFacebook.x = (canvasW / 100) * 35;
  buttonTwitter.x = canvasW / 2;
  buttonGoogle.x = (canvasW / 100) * 65;
  buttonFacebook.y = buttonTwitter.y = buttonGoogle.y = (canvasH / 100) * 72;

  buttonReplay = new createjs.Bitmap(loader.getResult("buttonReplay"));
  centerReg(buttonReplay);
  createHitarea(buttonReplay);
  buttonReplay.x = canvasW / 2;
  buttonReplay.y = (canvasH / 100) * 55;

  //option
  buttonFullscreen = new createjs.Bitmap(loader.getResult("buttonFullscreen"));
  centerReg(buttonFullscreen);
  buttonSoundOn = new createjs.Bitmap(loader.getResult("buttonSoundOn"));
  centerReg(buttonSoundOn);
  buttonSoundOff = new createjs.Bitmap(loader.getResult("buttonSoundOff"));
  centerReg(buttonSoundOff);
  buttonSoundOn.visible = false;

  if (guide) {
    guideline = new createjs.Shape();
    guideline.graphics
      .setStrokeStyle(2)
      .beginStroke("red")
      .drawRect(
        (stageW - contentW) / 2,
        (stageH - contentH) / 2,
        contentW,
        contentH
      );
  }

  mainContainer.addChild(logo, buttonStart);
  gameContainer.addChild(
    itemSide,
    itemHeadAnimate,
    itemHeadHit,
    itemTail1,
    itemTail2,
    itemTail3,
    itemBlock1,
    itemBlock2,
    itemBlock3,
    itemDivider,
    iconShield,
    iconTail,
    iconExplode,
    iconMagnet,
    blockContainer,
    shapeContainer,
    gradient,
    scoreTxt
  );
  resultContainer.addChild(resultTitleTxt, resultScoreTxt, buttonReplay);

  if (shareEnable) {
    resultContainer.addChild(
      resultShareTxt,
      buttonFacebook,
      buttonTwitter,
      buttonGoogle
    );
  }

  canvasContainer.addChild(
    bg,
    backgroundWhite,
    mainContainer,
    gameContainer,
    resultContainer,
    buttonFullscreen,
    buttonSoundOn,
    buttonSoundOff,
    guideline
  );
  stage.addChild(canvasContainer);

  resizeCanvas();
}

/*!
 *
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 *
 */
function resizeCanvas() {
  if (canvasContainer != undefined) {
    gradient.y = offset.y;
    scoreTxt.y = offset.y + 60;

    buttonSoundOn.x = buttonSoundOff.x = canvasW - offset.x;
    buttonSoundOn.y = buttonSoundOff.y = offset.y;
    buttonSoundOn.x = buttonSoundOff.x -= 40;
    buttonSoundOn.y = buttonSoundOff.y += 30;

    buttonFullscreen.x = buttonSoundOn.x - 50;
    buttonFullscreen.y = buttonSoundOn.y;
  }
}

/*!
 *
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 *
 */
function removeGameCanvas() {
  stage.autoClear = true;
  stage.removeAllChildren();
  stage.update();
  createjs.Ticker.removeEventListener("tick", tick);
  createjs.Ticker.removeEventListener("tick", stage);
}

/*!
 *
 * CANVAS LOOP - This is the function that runs for canvas loop
 *
 */
function tick(event) {
  updateGame();
  stage.update(event);
}

/*!
 *
 * CANVAS MISC FUNCTIONS
 *
 */
function centerReg(obj) {
  obj.regX = obj.image.naturalWidth / 2;
  obj.regY = obj.image.naturalHeight / 2;
}

function createHitarea(obj) {
  obj.hitArea = new createjs.Shape(
    new createjs.Graphics()
      .beginFill("#000")
      .drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight)
  );
}
