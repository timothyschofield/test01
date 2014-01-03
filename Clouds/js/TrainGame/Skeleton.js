/*

    Skeleton
    Author: Tim Schofield
    Date: 22 Feb 2013

    All Agents inherit from Agent
    Game specific information goes here

    config
        (for Skeleton and Grass)  tileX, tileY
            (for Agent) tileX, tileY, width, height, gameClass, backgroundAnimationObject
                (for Sprite)    x, y, spriteclass, spriteid, backgroundAnimationObject, scalex, scaley, rotation
                    (for Animation) millisecondsPF, animationType, animationDirection
                        (for FilmStrip) bitmapType, startFrame, numFrames, lastFrameCallback, firstFrameCallback
                            (for Frame) src, width, height, xOffset, yOffset, frameclass, frameid

*/
//noinspection JSLint
define(['jquery', 'Agent', 'Animation', 'AppConfig', 'Sprite', 'Keys', 'Button','FilmStrip', 'AI'],
    function ($, Agent, Animation, AppConfig, Sprite, Keys, Button, FilmStrip, AI) {

    Skeleton.forbiddenTiles = ["GA"];

    function Skeleton(config) {
       
        var defaults = {
            gameClass: '00',
            gameID: '00'
        };

        this.transitioning = false;

        config = $.extend(defaults, config);

        this.trainGame = config.trainGame;
        this.gameID = config.gameID;
        this.gameClass = config.gameClass;

        config.backgroundAnimationObject = undefined; // bug inheritance stomps on this

        // Anything involving the Skeleton inheriting from Sprite must be added after the inheritance
        Agent.apply(this, arguments);

        this.mySpeed = 0.7;  // seconds to get ot the next tile
        this.selected = true;

        this.designBody();

        this.addTransition('all', this.mySpeed, 'linear', this.onEndTransition);
        this.addGameEventListener(Agent.ENDMOVE, this.onCheckKill, this);

        this.ai = new AI(this);
        this.ai.start();

        this.hideBg();
        this.hideChild("explosion");
        this.bodyContainer.showChildOnly("idle");
        this.bodyContainer.startChild("idle");

    } // eo constructor
    Skeleton.prototype = Object.create(Agent.prototype);              
    Skeleton.prototype.constructor = Skeleton;
    /*
     */
    Skeleton.prototype.processAICommand = function (command) {
        //console.log(command);
        if(this.transitioning === false) {
            this.move(command);
        }
    };
    /*
     */
    Skeleton.prototype.move = function (direction) {
        //console.log("move " + direction);
        var dx = 0;                 // pixels
        var dy = 0;                 // pixels
        var newX = this.tileX;      // tile
        var newY = this.tileY;      // tile
        var childID = "";

        this.movementKeyDown = true;

        switch (direction) {
            case 'North':
                dy = -this.height;
                newY = this.tileY - 1;
                childID = "north";
                break;
            case 'South':
                dy = this.height;
                newY = this.tileY + 1;
                childID = "south";
                break;
            case 'East':
                dx = this.width;
                newX = this.tileX + 1;
                childID = "east";
                break;
            case 'West':
                dx = -this.width;
                newX = this.tileX - 1;
                childID = "west";
                break;

            default: console.log("unrecognised move " + direction);
        } // eo move switch

        if (!this.gameEdgeCollision(newX, newY) && !this.tileForbidden(newX, newY)) {
            // do the walking animation
            this.bodyContainer.showChildOnly(childID);
            this.bodyContainer.startChild(childID);
            this.moveToTile(newX, newY);    // moves Agent in the map
            this.moveRel(dx, dy);           // does the graphical translation
            this.transitioning = true;
        } else {
            this.transitioning = false;
        }

    };
    /*
     */
    Skeleton.prototype.onEndTransition = function (eventData) {
        var self;
        if(eventData) {
            self = eventData.data.thisContext;
        } else {
            self = this;
        }

        self.bodyContainer.showChildOnly("idle");
        self.bodyContainer.startChild("idle");

        self.dispatchGameEvent(Agent.ENDMOVE, {parameters: [self]});
        self.transitioning = false;
    };
    /*
     */
    Skeleton.prototype.explode = function () {
        this.showChild("explosion");
        this.startChild("explosion", 2);
    };
    /*
     End of the animated explosion
     */
    Skeleton.prototype.onEndExplosion = function (request) {
        this.removeAgent();
    };
    /*
    Returns true if the location contains a forbidden Agent
    You cant break out of a forEach loop
    */
    Skeleton.prototype.tileForbidden = function (newX, newY) {
        var n;
        var thisLocation = this.trainGame.getSpriteGameClassesAt(newX, newY);
        for (n = 0; n < thisLocation.length; n+=1) {
            if (Skeleton.forbiddenTiles.indexOf(thisLocation[n]) !== -1)  {
                return true;
            }
        }
        return false;
    };
    /*
     */
    Skeleton.prototype.designBody = function () {
        var bgAnim = {
            parent: this,   // can be useful
            src: AppConfig.IMG_PATH + "selected.png"
        };
        this.addBackgroundAnimation(new Animation(bgAnim));

        // A container Sprite for all five walk cycles needed to animate this Agent
        this.bodyContainer = new Sprite({ spriteid: "idle"});
        this.addChildSprites(this.bodyContainer);

        var idleAnim = {
            millisecondsPF: 320,
            animationType: Animation.animationType.PALINDROME,
            bitmapType: FilmStrip.bitmapType.PORTRAIT,
            firstFrame: 0,
            lastFrame: 2,
            src: AppConfig.IMG_PATH + "skeleton_idle.png"
        };
        var idleSprite = new Sprite({ spriteid: "idle", backgroundAnimationObject: new Animation(idleAnim) });
        this.bodyContainer.addChildSprites(idleSprite);

        var walkingAnim = {
            millisecondsPF: 30,
            firstFrame: 0,
            lastFrame: 7,
            src: AppConfig.IMG_PATH + "skeleton_n.png"
        };
        var northSprite = new Sprite({ spriteid: "north", backgroundAnimationObject: new Animation(walkingAnim) });
        this.bodyContainer.addChildSprites(northSprite);

        walkingAnim.src = AppConfig.IMG_PATH + "skeleton_s.png";
        var southSprite = new Sprite({ spriteid: "south", backgroundAnimationObject: new Animation(walkingAnim) });
        this.bodyContainer.addChildSprites(southSprite);

        walkingAnim.src = AppConfig.IMG_PATH + "skeleton_e.png";
        var eastSprite = new Sprite({ spriteid: "east", backgroundAnimationObject: new Animation(walkingAnim) });
        this.bodyContainer.addChildSprites(eastSprite);

        walkingAnim.src = AppConfig.IMG_PATH + "skeleton_w.png";
        var westSprite = new Sprite({ spriteid: "west", backgroundAnimationObject: new Animation(walkingAnim) });
        this.bodyContainer.addChildSprites(westSprite);

        var explosionAnim = {
            animationStopCallback: { context: this, thisFunc: this.onEndExplosion },
            millisecondsPF: 60,
            firstFrame: 0,
            lastFrame: 4,
            src: AppConfig.IMG_PATH + "ExplosionStrip.png"
        };
        var explosionSprite = new Sprite({ spriteid: "explosion", backgroundAnimationObject: new Animation(explosionAnim) });
        this.addChildSprites(explosionSprite);
    };
    /*
     This is callend on Agent.ENDMOVE
     */
    Skeleton.prototype.onCheckKill = function (request) {

        var classesAtMyLoc = this.getGameClassesAtMyLoc();
        // console.log("at sk Skeleton: " + classesAtMyLoc);

        var MAIndex = classesAtMyLoc.indexOf("MA");
        if(MAIndex !== -1) {
            var agentMA = this.trainGame.map[this.tileY][this.tileX][MAIndex];
            agentMA.explode();
        }


    };

    return Skeleton;
});
