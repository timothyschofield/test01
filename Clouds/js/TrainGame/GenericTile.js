/*
    GenericTile
    Author: Tim Schofield
    Date: 05 Mar 2013
*/
//noinspection JSLint
define(['jquery', 'Agent', 'Animation', 'AppConfig'], function ($, Agent, Animation, AppConfig) {

    function GenericTile(config) {

        var defaults = {
            gameClass: '00',
            gameID: '00'
        };

        config = $.extend(defaults, config);

        this.gameID = config.gameID;
        this.gameClass = config.gameClass;
        this.src = config.src;
        this.yOffset = config.yOffset;  // usefull for half-drop backgrounds

        var animObj = { src: AppConfig.IMG_PATH + this.src, yOffset: this.yOffset };
        config.backgroundAnimationObject = new Animation(animObj);

        Agent.apply(this, arguments);

        this.startBg(); // if the tile is animated this will be required

    } // eo constructor
    GenericTile.prototype = Object.create(Agent.prototype);
    GenericTile.prototype.constructor = GenericTile;

    return GenericTile;

});