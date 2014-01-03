/*
    TileGame
    Author: Tim Schofield
    Date: 21 Feb 2013

    Any game in a world of tiles.
*/
//noinspection JSLint
define(['jquery', 'Sprite', 'TrainGameConfig', 'Game'], function ($, Sprite, TrainGameConfig, Game) {

    function TileGame(worldRoot) {

        Game.apply(this, arguments);

        // initalTiletMap is used to describe the inital positions of the stationary Tiles.
        // This map is not used once the game is running.
        // Each location has a Tile.code.
        this.initalTiletMap = [];

        // initalAgentMap is used to describe the inital positions of the Agents which move over the Tiles.
        // This map is not used once the game is running.
        // Locations with Agents have an Agent.code.
        this.initalAgentMap = [];

        // This is map maintains the state of the game and is used during the running of the game. Each location in the game is represented by a list of Agents.
        // As the game progresses, Agents will move around the map. Any number of Agents can occupy a single map location - hence the list for each location.
        this.map = [];

    } // eo Game constructor
    TileGame.prototype = Object.create(Game.prototype);
    TileGame.prototype.constructor = Game;
    /*
    For debugging - you can click on a game tile and find the sprites at that location
    */
    TileGame.prototype.onClick = function (eventData) {
        var x = Math.floor(eventData.clientX / TrainGameConfig.tileWidth);
        var y = Math.floor(eventData.clientY / TrainGameConfig.tileHeight);
        // console.log("at (" + x + "," + y + ") [" + this.getSpriteGameClassesAt(x, y) + "]");
    };
    /*
        returns a list of the Agent gameClass s at the location, e.g. ["MA", "GA"]
    */
    TileGame.prototype.getSpriteGameClassesAt = function (x, y) {
        var thisLoc = this.map[y][x];

        var thisLocLen = thisLoc.length;
        var classes = [];
        for (var n = 0; n < thisLocLen; n++) {
            classes.push(thisLoc[n].gameClass);
        }

        return classes;
    };

    return TileGame;
});








