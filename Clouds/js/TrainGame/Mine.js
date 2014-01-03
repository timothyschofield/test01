/*
 Mine
 Author: Tim Schofield
 Date: Nov 2013

 */
//noinspection JSLint
define(['jquery', 'Agent', 'Animation', 'AppConfig', 'Sprite'],
    function ($, Agent, Animation, AppConfig, Sprite) {

    function Mine(config) {

        var defaults = {
            gameClass: '00',
            gameID: '00'
        };

        // good practice to collect handles to all listeners here or removeListeners will not work properly
        this.myListeners = [];

        config = $.extend(defaults, config);
        this.gameID = config.gameID;
        this.gameClass = config.gameClass;
        this.trainGame = config.trainGame;

        Agent.apply(this, arguments);

        /* design Mine */
        var bgAnim = {
            src: AppConfig.IMG_PATH + "mine.png"
        };
        this.addBackgroundAnimation(new Animation(bgAnim));

        // when two objects are tightly coupled - as in Agent Mine and its Animation explosion
        // then it is better to pass callbacks than use messaging.
        var explosionAnim = {
            animationStopCallback: { context: this, thisFunc: this.onEndExplosion },
            millisecondsPF: 60,
            firstFrame: 0,
            lastFrame: 4,
            src: AppConfig.IMG_PATH + "ExplosionStrip.png"
        };
        var explosionSprite = new Sprite({ spriteid: "explosion", backgroundAnimationObject: new Animation(explosionAnim) });
        this.addChildSprites(explosionSprite);

        this.showBg();
        this.hideChild('explosion');

        // need to remove this listener if the Agent is to be removed
        this.addGameEventListener(Agent.ENDMOVE, this.onCheckIfExplode, this);

    } // eo constructor
    Mine.prototype = Object.create(Agent.prototype);
    Mine.prototype.constructor = Mine;
    /*
        Registered in Agent
     */
    Mine.prototype.clickHandler = function (eventData) {
        var self = eventData.data.thisContext;
    };
    /*
        This is callend on Agent.ENDMOVE
     */
    Mine.prototype.onCheckIfExplode = function (request) {
        var thisClumsyAgent = request.parameters[0];

        if(thisClumsyAgent.tileX === this.tileX && thisClumsyAgent.tileY === this.tileY ) {
          // console.log("MINE EXPLODES at location " + this.tileX + "_" + this.tileY);
           this.showChildOnly("explosion");
           this.startChild("explosion", 2);

           thisClumsyAgent.explode(); // assumes all Agents have an explode method - might use messaging

        }
    };
    /*
        End of the animated explosion
     */
    Mine.prototype.onEndExplosion = function (request) {
        this.removeAgent();
    };

    return Mine;

});


