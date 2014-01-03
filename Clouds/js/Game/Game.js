/**
 * Created by Timothy on 09/12/13.
 */
define(['jquery', 'Sprite', 'Keys'],
    function ($, Sprite, Keys) {

        function Game(worldRoot) {
            this.gameRoot = new Sprite({ spriteid: 'game_root', spriteclass: 'game_root' });
            worldRoot.addChildSprites(this.gameRoot);

            this.layers = {};

            this.keys = new Keys();

        } // eo constructor

        /*
         Passed a Layer Object
         */
        Game.prototype.addLayer = function (newLayer) {
            this.layers[newLayer.name] = newLayer;
            this.gameRoot.node.append(newLayer.node);
            return newLayer;
        };
        /*
         Returns a Layer Object
         */
        Game.prototype.getLayer = function (name) {
            return this.layers[name];
        };

        return Game;
    });