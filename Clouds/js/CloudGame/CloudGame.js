/**
 * Created by Timothy on 10/12/13.
 */
//noinspection JSLint
define(['jquery', 'Layer','AppConfig', 'Sprite', 'Animation', 'SpriteGame', 'Loader', 'Zombies', 'UFO_A4', 'Prop', 'UFO_A9'],
                                    function ($, Layer, AppConfig, Sprite, Animation, SpriteGame, Loader, Zombies, UFO_A4, Prop, UFO_A9) {

        CloudGame.width = 960;
        CloudGame.height = 640;

        function CloudGame(worldRoot) {

            SpriteGame.apply(this, arguments);

            this.loader = new Loader();
            this.loader.loadImages(AppConfig.IMG_PATH,
                [
                "vignette.png",
                "skycover.png",
                "cloud1.png",
                "thundercloud1.png"
                ]);

            this.backgroundLayer = this.addLayer(new Layer("backgroundLayer", {'width': CloudGame.width, 'height': CloudGame.height}));
            this.cloudLayer = this.addLayer(new Layer("cloudLayer", {'width': CloudGame.width, 'height': CloudGame.height, 'overflow':'hidden','pointer-events': 'none'}));
            this.propLayer = this.addLayer(new Layer("propLayer", {'width': CloudGame.width, 'height': CloudGame.height, 'overflow':'hidden','pointer-events': 'none'}));

            this.ufoLayer = this.addLayer(new Layer("ufoLayer", {'width': CloudGame.width, 'height': CloudGame.height, 'overflow':'hidden'}));


///////////////////////////////////////////////////
            var skycover = {
                width: 960,
                height: 640,
                src: AppConfig.IMG_PATH + "skycover.png"
            };
           var bgSprite = new Sprite({ spriteid: "skycover", backgroundAnimationObject: new Animation(skycover) });
           this.backgroundLayer.addSpriteToLayer(bgSprite);
///////////////////////////////////////////////////

            // The container - animates containing two children
            var cloudSprite = new Sprite({ spriteid: "cloud1"});
            cloudSprite.node.css({'pointer-events': 'none'});
            this.cloudLayer.addSpriteToLayer(cloudSprite);

            var thunderCloud = {
                width: 535,
                height: 260,
                src: AppConfig.IMG_PATH + "thundercloud1.png",
                id: "thunderCloud"  // the id of the animation
            };
            var thunderCloudSprite = new Sprite({ spriteid: "thunderCloud", backgroundAnimationObject: new Animation(thunderCloud) });
            cloudSprite.addChildSprites(thunderCloudSprite);

            var whiteCloud = {
                width: 535,
                height: 260,
                src: AppConfig.IMG_PATH + "cloud1.png"
                // dont need id because the whiteCloud is not animated, its container cloudSprite (or more acuratly the div#cloud1) is what animates
            };
            var whiteCloudSprite = new Sprite({ spriteid: "whiteCloud", backgroundAnimationObject: new Animation(whiteCloud) });
            cloudSprite.addChildSprites(whiteCloudSprite);
            cloudSprite.setChildCSS("whiteCloud", {'opacity': 0.75});
            cloudSprite.moveTo(-535,150);
            cloudSprite.transform({scalex:1, scaley:1});


            cloudSprite.CSSAnimationStart("slideX");
            cloudSprite.CSSAnimationStartChild("thunderCloud", "thunder");
///////////////////////////////////////////////////
           // var zombies = new Zombies(worldRoot); // NOTE CHECK ZOMBIE LAYER ORDER
///////////////////////////////////////////////////
            this.vignetteLayer = this.addLayer(new Layer("vignetteLayer", {'pointer-events': 'none'}));
            var vignette = {
                width: 960,
                height: 640,
                src: AppConfig.IMG_PATH + "vignette.png"
            };
           var vignetteSprite = new Sprite({ spriteid: "vignette", backgroundAnimationObject: new Animation( vignette )});
           this.vignetteLayer.addSpriteToLayer(vignetteSprite);
///////////////////////////////////////////////////

            var thisUFO3 = new UFO_A4();
            this.ufoLayer.addSpriteToLayer(thisUFO3.container);
            thisUFO3.container.moveTo(200,170);
            thisUFO3.container.node.draggable();
            thisUFO3.container.transform({scalex:0.25, scaley:0.25});

            var thisUFO = new UFO_A4();
            this.ufoLayer.addSpriteToLayer(thisUFO.container);
            thisUFO.container.moveTo(290,240);
            thisUFO.container.node.draggable();
            thisUFO.container.transform({scalex:0.5, scaley:0.5});

            var thisUFO2 = new UFO_A4();
            this.ufoLayer.addSpriteToLayer(thisUFO2.container);
            thisUFO2.container.moveTo(120,400);
            thisUFO2.container.node.draggable();
            thisUFO2.container.transform({scalex:1.0, scaley:1.0});

///////////////////////////////////////////////////
            // inital physical conditions of thisUFOA9_1
            var physicsConfig = {
                pE: AppConfig.physicsEngine,    // pass in the physics engine for general physical constants
                x: 520,
                y: 400,
                vX: 0,
                vY: 0,
                forceX: 0,
                forceY: 0,
                mass: 1
            };

            var thisUFOA9_1 = new UFO_A9(physicsConfig);
            AppConfig.physicsEngine.addObject(thisUFOA9_1);
            this.ufoLayer.addSpriteToLayer(thisUFOA9_1.container);
            thisUFOA9_1.container.transform( {scalex:1.0, scaley:1.0} );

///////////////////////////////////////////////////


            var prop1 = new Prop();
            this.propLayer.addSpriteToLayer(prop1.container);
            prop1.container.moveTo(100,100);
            prop1.container.setCSS({'opacity': 0.85});


        } // eo constructor
        CloudGame.prototype = Object.create(SpriteGame.prototype);
        CloudGame.prototype.constructor = CloudGame;

        return CloudGame;
    });























