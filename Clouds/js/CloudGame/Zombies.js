/**
 * Created by Timothy on 14/12/13.
 */

//noinspection JSLint
define(['jquery', 'Layer','AppConfig', 'Sprite', 'Animation', 'SpriteGame', 'Loader', 'Test', 'FilmStrip', 'CloudGame'],
    function ($, Layer, AppConfig, Sprite, Animation, SpriteGame, Loader, Test, FilmStrip, CloudGame) {

        function Zombies() {

            this.loader = new Loader();
            this.loader.loadImages(AppConfig.IMG_PATH,
                [
                    "ZombieSmall.png",
                    "Zombie2.png",
                    "LadyZombie.png",
                    "strip3.png"]);

            SpriteGame.apply(this, arguments);

            this.zombieLayer = this.addLayer(new Layer("zombieLayer", {'width': '960px', 'height': '640px', 'overflow':'hidden'}));

            var zombie = {
                src: AppConfig.IMG_PATH + "ZombieSmall.png",
                width: 88,
                height: 247
            };
            var zombieSprite = new Sprite({ spriteid: "zombie", backgroundAnimationObject: new Animation(zombie) });
            //this.zombieLayer.addSpriteToLayer(zombieSprite);
            zombieSprite.moveTo(100,380);

            var zombie2 = {
                src: AppConfig.IMG_PATH + "Zombie2.png",
                width: 150,
                height: 384
            };
            var zombie2Sprite = new Sprite({ spriteid: "zombie2", backgroundAnimationObject: new Animation(zombie2) });
           // this.zombieLayer.addSpriteToLayer(zombie2Sprite);
            zombie2Sprite.moveTo(300,250);

            var ladyZombie = {
                src: AppConfig.IMG_PATH + "LadyZombie.png",
                width: 133,
                height: 346
            };
            var ladyZombieSprite = new Sprite({ spriteid: "ladyZombie", backgroundAnimationObject: new Animation(ladyZombie) });
            //this.zombieLayer.addSpriteToLayer(ladyZombieSprite);
            ladyZombieSprite.moveTo(420,280);

            var idle = {
                millisecondsPF: 200,
                animationType: Animation.animationType.PALINDROME,
                bitmapType: FilmStrip.bitmapType.LANDSCAPE,
                src: AppConfig.IMG_PATH + "idle50pc.png",
                firstFrame: 0,
                lastFrame: 2,
                width: 125,
                height:550
            };
            var idleZombieSprite = new Sprite({ spriteid: "idleZombie", backgroundAnimationObject: new Animation(idle) });
            this.zombieLayer.addSpriteToLayer(idleZombieSprite);
            idleZombieSprite.moveTo(600,280);
            idleZombieSprite.startBg();

            var strip3 = {
                millisecondsPF: 200,
                animationType: Animation.animationType.LOOP,
                bitmapType: FilmStrip.bitmapType.LANDSCAPE,
                src: AppConfig.IMG_PATH + "strip3.png",
                firstFrame: 0,
                lastFrame: 3,
                width: 150,
                height: 307
            };

            var stripZombieSprite = new Sprite({ spriteid: "stripZombie", backgroundAnimationObject: new Animation(strip3) });
            this.zombieLayer.addSpriteToLayer(stripZombieSprite);
            stripZombieSprite.moveTo(700,100);
            stripZombieSprite.startBg();
            stripZombieSprite.CSSAnimationStart("zombieWalk");
/////////////////////////////////////////////////
            /*
            var walk2 = {
                millisecondsPF: 200,
                animationType: Animation.animationType.LOOP,
                bitmapType: FilmStrip.bitmapType.LANDSCAPE,
                src: AppConfig.IMG_PATH + "zombie walk cycle 1.png",
                firstFrame: 0,
                lastFrame: 3,
                width: 117,
                height: 319
            };

            var walk2ZombieSprite = new Sprite({ spriteid: "zombieWalk2", backgroundAnimationObject: new Animation(walk2) });
            this.zombieLayer.addSpriteToLayer(walk2ZombieSprite);
            walk2ZombieSprite.moveTo(100,100);
            walk2ZombieSprite.startBg();

            walk2ZombieSprite.CSSAnimationStart("zombieWalk2KF");
*/

            var walk_right = {
                millisecondsPF: 400,
                animationType: Animation.animationType.LOOP,
                bitmapType: FilmStrip.bitmapType.LANDSCAPE,
                src: AppConfig.IMG_PATH + "right_walk.png",
                firstFrame: 0,
                lastFrame: 5,
                width: 140,
                height: 250
            };

            var walkRightSprite = new Sprite({ spriteid: "walkRight", backgroundAnimationObject: new Animation(walk_right) });
            this.zombieLayer.addSpriteToLayer(walkRightSprite);
            walkRightSprite.moveTo(100,100);
            walkRightSprite.startBg();

            walkRightSprite.CSSAnimationStart("walkRightKF");












        }
        Zombies.prototype = Object.create(SpriteGame.prototype);
        Zombies.prototype.constructor = Zombies;

        return Zombies;
    });
