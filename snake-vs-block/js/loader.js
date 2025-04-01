////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

/*!
 *
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 *
 */
function initPreload() {
  toggleLoader(true);

  checkMobileEvent();

  $(window).resize(function () {
    resizeGameFunc();
  });
  resizeGameFunc();

  loader = new createjs.LoadQueue(false);
  manifest = [
    { src: "assets/background.png", id: "background" },
    { src: "assets/background_white.png", id: "backgroundWhite" },
    { src: "assets/logo.png", id: "logo" },
    { src: "assets/button_start.png", id: "buttonStart" },

    { src: "assets/side_line.png", id: "itemSide" },
    { src: "assets/item_head.png", id: "itemHead" },
    { src: "assets/item_head_hit.png", id: "itemHeadHit" },
    { src: "assets/item_tail1.png", id: "itemTail1" },
    { src: "assets/item_tail2.png", id: "itemTail2" },
    { src: "assets/item_tail3.png", id: "itemTail3" },
    { src: "assets/item_block1.png", id: "itemBlock1" },
    { src: "assets/item_block2.png", id: "itemBlock2" },
    { src: "assets/item_block3.png", id: "itemBlock3" },
    { src: "assets/item_block_white.png", id: "itemBlockWhite" },
    { src: "assets/item_divider.png", id: "itemDivider" },
    { src: "assets/item_power_shield.png", id: "itemPowerShield" },
    { src: "assets/item_power_magnet.png", id: "itemPowerMagnet" },
    { src: "assets/icon_shield.png", id: "iconShield" },
    { src: "assets/icon_tail.png", id: "iconTail" },
    { src: "assets/icon_explode.png", id: "iconExplode" },
    { src: "assets/icon_magnet.png", id: "iconMagnet" },
    { src: "assets/gradient.png", id: "gradient" },

    { src: "assets/button_replay.png", id: "buttonReplay" },
    { src: "assets/button_facebook.png", id: "buttonFacebook" },
    { src: "assets/button_twitter.png", id: "buttonTwitter" },
    { src: "assets/button_google.png", id: "buttonGoogle" },
    { src: "assets/button_fullscreen.png", id: "buttonFullscreen" },
    { src: "assets/button_sound_on.png", id: "buttonSoundOn" },
    { src: "assets/button_sound_off.png", id: "buttonSoundOff" },
  ];

  soundOn = true;
  if ($.browser.mobile || isTablet) {
    if (!enableMobileSound) {
      soundOn = false;
    }
  }

  if (soundOn) {
    manifest.push({ src: "assets/sounds/music.ogg", id: "musicMain" });
    manifest.push({ src: "assets/sounds/clear.ogg", id: "soundClear" });
    manifest.push({ src: "assets/sounds/hit.ogg", id: "soundHit" });
    manifest.push({ src: "assets/sounds/coin.ogg", id: "soundCoin" });
    manifest.push({ src: "assets/sounds/power.ogg", id: "soundPower" });
    manifest.push({ src: "assets/sounds/fail.ogg", id: "soundFail" });

    createjs.Sound.alternateExtensions = ["mp3"];
    loader.installPlugin(createjs.Sound);
  }

  loader.addEventListener("complete", handleComplete);
  loader.addEventListener("fileload", fileComplete);
  loader.addEventListener("error", handleFileError);
  loader.on("progress", handleProgress, this);
  loader.loadManifest(manifest);
}

/*!
 *
 * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
 *
 */
function fileComplete(evt) {
  var item = evt.item;
  //console.log("Event Callback file loaded ", evt.item.id);
}

/*!
 *
 * CANVAS FILE HANDLE EVENT - This is the function that runs to handle file error
 *
 */
function handleFileError(evt) {
  console.log("error ", evt);
}

/*!
 *
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 *
 */
function handleProgress() {
  $("#mainLoader span").html(Math.round((loader.progress / 1) * 100) + "%");
}

/*!
 *
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 *
 */
function handleComplete() {
  toggleLoader(false);
  initMain();
}

/*!
 *
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 *
 */
function toggleLoader(con) {
  if (con) {
    $("#mainLoader").show();
  } else {
    $("#mainLoader").hide();
  }
}
