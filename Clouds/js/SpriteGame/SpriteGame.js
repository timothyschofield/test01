/**
 * Created by Timothy on 10/12/13.
 */
define(['jquery', 'Sprite', 'Game'],
    function ($, Sprite, Game) {

        function SpriteGame(worldRoot) {

            Game.apply(this, arguments);


        } // eo constructor
        SpriteGame.prototype = Object.create(Game.prototype);
        SpriteGame.prototype.constructor = Game;



        return SpriteGame;
    });
