/*

    Male
    Author: Tim Schofield
    Date: 26 Feb 2013

    All Agents inherit from Agent
    Game specific information goes here

    config
        (for Male and Grass)  tileX, tileY
            (for Agent) tileX, tileY, width, height, gameClass, backgroundAnimationObject
                (for Sprite)    x, y, spriteclass, spriteid, backgroundAnimationObject, scalex, scaley, rotation
                    (for Animation) millisecondsPF, animationType, animationDirection
                        (for FilmStrip) bitmapType, startFrame, numFrames, lastFrameCallback, firstFrameCallback
                            (for Frame) src, width, height, xOffset, yOffset, frameclass, frameid

*/

//noinspection JSLint
define(['jquery', 'Agent', 'Animation', 'AppConfig', 'Sprite', 'Keys', 'Button', 'TrainGameConfig','FilmStrip', 'NavPalette'],
            function ($, Agent, Animation, AppConfig, Sprite, Keys, Button, TrainGameConfig, FilmStrip, NavPalette) {

    // Male.LAYMINE = "laymine";
    Male.forbiddenTiles = ["GA"];

    function Male(config) {

        var defaults = {
            gameClass: '00',
            gameID: '00'
        };

        this.transitioning = false;
        this.movementKeyDown = false;
        this.processingButtonClick = false;

        config = $.extend(defaults, config);

        this.trainGame = config.trainGame;
        this.gameID = config.gameID;
        this.gameClass = config.gameClass;

        config.backgroundAnimationObject = undefined; // bug inheritance stomps on this

        // Anything involving the Male inheriting from Sprite must be added after the inheritance
        Agent.apply(this, arguments);

        this.mySpeed = 1;  // seconds to get ot the next tile
        this.selected = false;

        this.designBody();

        // transitions are the liner movement accross the screen - idle does not transition so no onEndTransition
        this.addTransition('all', this.mySpeed, 'linear', this.onEndTransition);

        // Male gets all requests from Button.CLICK and Keys.KEYUP pushed on its request stack
        // which are handled when its their turn
        this.addGameEventListener(Keys.KEYDOWN, this.onProcessKeysDown, this);
        this.addGameEventListener(Keys.KEYUP, this.onProcessKeysUp, this);
        this.addGameEventListener(Button.CLICK, this.onProcessButtonClick, this);
        this.addGameEventListener(NavPalette.CLICK, this.onProcessButtonClick, this);

        this.hideBg();
        this.hideChild("explosion");
        this.bodyContainer.showChildOnly("idle");
        this.bodyContainer.startChild("idle");

    } // eo constructor
    Male.prototype = Object.create(Agent.prototype);
    Male.prototype.constructor = Male;
    /*
     */
    Male.prototype.onProcessButtonClick = function (whichButton) {

        if (this.selected) {

            if(this.transitioning === false) {
                this.processingButtonClick = true;

                switch (whichButton) {
                    case 'Up': this.move("North"); break;
                    case 'Down': this.move("South"); break;
                    case 'Right': this.move("East"); break;
                    case 'Left': this.move("West"); break;
                }
            }

            if(whichButton === "M") {
                this.onLayMine();
            }

        }
    };
    /*
     */
    Male.prototype.onProcessKeysDown = function (eventData) {
        var self;
        if (eventData) {
            self = eventData.data.thisContext;
        }  else {
            self = this;
        }

        if (this.selected) {
            var keys = Keys.theseKeysDown;
            // only move in one direction at once
            // and you cant change direction in the middle of a transition
            if(self.transitioning === false) {

                if(keys.Up) {
                    self.move("North");
                } else {
                    if(keys.Down) {
                        self.move("South");
                    } else {
                        if(keys.Right) {
                            self.move("East");
                        } else
                        if(keys.Left) {
                            self.move("West");
                        }
                    }
                }
            }

            if(keys.M) {
                self.onLayMine();
            }

        }

    };
    /*
     */
   Male.prototype.onProcessKeysUp = function (eventData) {
       this.movementKeyDown = false;
       // deals with the case where the agent has been driven into a wall
       // and there is no transition to end
       if(this.transitioning === false) {
           this.bodyContainer.showChildOnly("idle");
           this.bodyContainer.startChild("idle");
       }
   };
    /*
     */
    Male.prototype.onEndTransition = function (eventData) {
        var self;
        if(eventData) {
            self = eventData.data.thisContext;
        } else {
            self = this;
        }

        // Have to check !self.movementKeyDownhas or idel gets shown between translations
        // but if the translation was initiated by a button click then we need to go back to idle
        if(!self.movementKeyDown || self.processingButtonClick) {
            self.processingButtonClick = false;
            self.bodyContainer.showChildOnly("idle");
            self.bodyContainer.startChild("idle");
        }

       self.dispatchGameEvent(Agent.ENDMOVE, {parameters: [self]});
       self.transitioning = false;
    };
    /*
     */
    Male.prototype.move = function (direction) {
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
     Handled immediatly on click, clickHandler registed in Agent which is fired by Sprite.addSpriteEventListener('click',...
     */
    Male.prototype.clickHandler = function (eventData) {
        //console.log("Select");
        var self = eventData.data.thisContext;
        self.selectMe();
    };
    /*
     */
    Male.prototype.selectMe = function () {
        var n;
        var males = this.trainGame.listOfMales;
        var numMales = males.length;
        for( n = 0; n < numMales; n+=1) {
            males[n].selected = false;
            males[n].hideBg();
        }

        this.selected = true;
        this.showBg();
    };
    /*
     The this action is not pushed on the stack but is handled directly
     Lay a mine MI
     */
    Male.prototype.onLayMine = function () {

        if (this.selected) {

            // only one mine in one location
            var thisLocAgents = this.getGameClassesAtMyLoc();
            if(thisLocAgents.indexOf("MI") === -1) {

                var thisItemInit = {
                    trainGame: this.trainGame,
                    type: "Tile",
                    tileX: this.tileX,
                    tileY: this.tileY,
                    width: TrainGameConfig.tileWidth,
                    height: TrainGameConfig.tileHeight,
                    gameClass: "MI",
                    gameID: "00" + "_" + this.tileX + "_" + this.tileY
                };

                // console.log("lay mine at my location " + this.tileX + " " + this.tileY);

                this.trainGame.addAgent(thisItemInit);
            }
        }
    };
    /*
     */
    Male.prototype.explode = function () {
        this.showChild("explosion");
        this.startChild("explosion", 2);
    };
    /*
     End of the animated explosion - Agent dies
     */
    Male.prototype.onEndExplosion = function () {
        this.removeAgent();
    };
    /*
    Returns true if the location contains a forbidden Agent
    You cant break out of a forEach loop
    */
    Male.prototype.tileForbidden = function (newX, newY) {
        var n;
        var thisLocationAgents = this.trainGame.getSpriteGameClassesAt(newX, newY);
        for (n = 0; n < thisLocationAgents.length; n+=1) {
            if (Male.forbiddenTiles.indexOf(thisLocationAgents[n]) !== -1) {
                return true;
            }
        }
        return false;
    };
    /*

     */
    Male.prototype.designBody = function () {
        var bgAnim = {
            parent: this,   // can be useful
            src: AppConfig.IMG_PATH + "selected.png"
        };
        // because Male <- Agent <- Sprite <- EventDispatcher
        // A new Male is-a new Sprite
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
            src: AppConfig.IMG_PATH + "male_idle.png"
        };
        var idleSprite = new Sprite({ spriteid: "idle", backgroundAnimationObject: new Animation(idleAnim) });
        this.bodyContainer.addChildSprites(idleSprite);

        var walkingAnim = {
            millisecondsPF: 30,
            firstFrame: 0,
            lastFrame: 7,
            src: AppConfig.IMG_PATH + "male_n.png"
        };
        var northSprite = new Sprite({ spriteid: "north", backgroundAnimationObject: new Animation(walkingAnim) });
        this.bodyContainer.addChildSprites(northSprite);

        walkingAnim.src = AppConfig.IMG_PATH + "male_s.png";
        var southSprite = new Sprite({ spriteid: "south", backgroundAnimationObject: new Animation(walkingAnim) });
        this.bodyContainer.addChildSprites(southSprite);

        walkingAnim.src = AppConfig.IMG_PATH + "male_e.png";
        var eastSprite = new Sprite({ spriteid: "east", backgroundAnimationObject: new Animation(walkingAnim) });
        this.bodyContainer.addChildSprites(eastSprite);

        walkingAnim.src = AppConfig.IMG_PATH + "male_w.png";
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


    return Male;

});
