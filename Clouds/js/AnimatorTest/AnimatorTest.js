//noinspection JSLint,JSLint
/**
 * Created by Timothy on 19/11/13.
 */

//noinspection JSLint
define(['jquery', 'Frame', 'AppConfig', 'FilmStrip', 'Animation'],
    function ($, Frame, AppConfig, FilmStrip, Animation) {

        function AnimatorTest(rootNode) {

            /*
            // Test for Frame
            var config = {
                src: AppConfig.IMG_PATH + "LandscapeTestStrip.png",
                xOffset: -48 * 2,
                yOffset: 0
            };

            this.thisFrame = new Frame(config);
            rootNode.append(this.thisFrame.getNode());
            */
            /*
            // Test for FilmStrip
            var config = {
                src: AppConfig.IMG_PATH + "LandscapeTestStrip.png",
                firstFrame: 0,
                lastFrame: 4,
                width: 48,
                height: 48
            };

            this.thisFilmStrip = new FilmStrip(config);
            rootNode.append(this.thisFilmStrip.getNode());
            */

            /*
             LOOP works (infinate)
                BACKWARD and FORWARD
             LOOP works (play a specific number of times including once (1))
                BACKWARD and FORWARD
             PALINDROME works (infinate)
                BACKWARD and FORWARD
             PALINDROME works (play a specific number of times including once (1))
             BACKWARD and FORWARD

             LANDSCAPE and PORTRAIT fine

            */

            var config = {
                src: AppConfig.IMG_PATH + "LandscapeTestStrip.png",
                // The animations will LOOP or PALINDROME between these two frame.
                // Usualy these will be the first and last frames of the animated strip of bitmaps, but it doesnt have to be.
                // The algorithem is in agnostic to how big the animation strip actualy is.
                // However firstFrame should always be smaller or equal to lastFrame.
                firstFrame: 0,
                lastFrame: 4,
                bitmapType: FilmStrip.bitmapType.LANDSCAPE,
                animationDirection: Animation.direction.FORWARD,
                animationType: Animation.animationType.LOOP,
                millisecondsPF: 1800
            };

            this.thisAnimation = new Animation(config);
            rootNode.append(this.thisAnimation.getNode());

            var _self = this;
            $('#startanimation').bind('click', {},
                function () {
                    _self.thisAnimation.start();
                });

            $('#stopanimation').bind('click', {},
                function () {
                    _self.thisAnimation.stop();
                });


        } // eo constructor

        return AnimatorTest;
    });
