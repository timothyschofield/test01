/*

 */
define(['jquery', 'Layer','AppConfig', 'Sprite', 'Animation', 'SpriteGame', 'Loader'],
    function ($, Layer, AppConfig, Sprite, Animation, SpriteGame, Loader) {


        function Prop() {

            this.container = new Sprite({ spriteid: "PropContainer"});


            var war = {
                width: 622, // full size of the background
                height: 465, // full size of the background
                src: AppConfig.IMG_PATH + "ww2_stpauls_flames_smoke.jpg",
               // mask: AppConfig.IMG_PATH + "cityMask.png" // masks - not cross browser

            };
            var singingSprite = new Sprite({ spriteid: "war_id", backgroundAnimationObject: new Animation(war) });
            this.container.addChildSprites(singingSprite);





        }

    return Prop;

});
