/**
 * Created by Timothy on 15/12/13.
 */


//noinspection JSLint
define(['jquery', 'Layer','AppConfig', 'Sprite', 'Animation', 'SpriteGame', 'Loader'],
    function ($, Layer, AppConfig, Sprite, Animation, SpriteGame, Loader) {


        function UFO_A4() {

            this.loader = new Loader();
            this.loader.loadImages(AppConfig.IMG_PATH,
                [
                "ufo_no_windows.png",
                "yellow_strip.png",
                "dark_mover.png"
                ]);

            // the container sprite needs to exist for beacuse we cannot drag and animate the same thing
            this.container = new Sprite({ spriteid: "ufoContainer"});


            // ufo1 is animated back and forth and contains 3 children - the body, the yellow light and the dark mover
            var ufo1Sprite = new Sprite({ spriteid: "ufo1"});
            this.container.addChildSprites(ufo1Sprite);
            ufo1Sprite.CSSAnimationStart("ufoMoveKF");

            var ufoYellow = {
                width: 164,
                height: 75,
                src: AppConfig.IMG_PATH + "yellow_strip.png"

            };
            var ufoYellowSprite = new Sprite({ spriteid: "ufo_yellow", backgroundAnimationObject: new Animation(ufoYellow) });
            ufo1Sprite.addChildSprites(ufoYellowSprite);


            var ufoDarkMover = {
                width: 13,
                height: 13,
                src: AppConfig.IMG_PATH + "dark_mover.png"
            };
            var ufoDarkMoverSprite = new Sprite({ spriteid: "ufo_dark_mover", backgroundAnimationObject: new Animation(ufoDarkMover) });
            ufo1Sprite.addChildSprites(ufoDarkMoverSprite);
            ufoDarkMoverSprite.CSSAnimationStart("darkMoveKF");

            var ufoBody = {
                width: 164,
                height: 75,
                src: AppConfig.IMG_PATH + "ufo_no_windows.png"
            };
            var ufoBodySprite = new Sprite({ spriteid: "ufo_body", backgroundAnimationObject: new Animation(ufoBody) });
            ufo1Sprite.addChildSprites(ufoBodySprite);


        } // eo constructor

        return UFO_A4;
    });
