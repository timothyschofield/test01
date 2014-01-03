/*
    StreetTile
    Author: Tim Schofield
    Date: 05 Mar 2013
*/
//noinspection JSLint
define(['jquery', 'Agent', 'Animation', 'AppConfig'], function ($, Agent, Animation, AppConfig) {

    function StreetTile(config) {

        var defaults = {
            gameClass: '00',
            gameID: '00'
        };

        config = $.extend(defaults, config);

        this.gameID = config.gameID;
        this.gameClass = config.gameClass;

        var animObj = { src: AppConfig.IMG_PATH + "road.png" };
        config.backgroundAnimationObject = new Animation(animObj);

        Agent.apply(this, arguments);

        this.startBg(); // if the tile is animated this will be required

    } // eo constructor
    StreetTile.prototype = Object.create(Agent.prototype);
    StreetTile.prototype.constructor = StreetTile;

    return StreetTile;
});