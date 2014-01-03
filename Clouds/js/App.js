/*
    App
    Author: Tim Schofield
    Date: Feb 2013
*/

//noinspection JSLint
define(['jquery', 'AppConfig', 'Sprite', 'Loader', 'TrainGame', 'CloudGame'],
    function ($, AppConfig, Sprite, Loader, TrainGame, CloudGame) {

    /*
    */
    function App (htmlRoot, worldId, width, height, color) {

        this.htmlRoot = htmlRoot;
        this.id = worldId;
        this.width = width;
        this.height = height;
        this.color = color;
        this.worldNode = $('<div></div>')
                            .attr('id', this.id)
                            .css({ 'position': 'absolute',
                                'width': this.width,
                                'height': this.height,
                                'background-color': this.color
                            });
        $(this.htmlRoot).append(this.worldNode);

        //////////////////////////////////////////////////
        // The root of the Sprite tree
        this.rootSprite = new Sprite({ id: 'root_sprite', class: 'sprite' });
        this.worldNode.append(this.rootSprite.node);
        //////////////////////////////////////////////////


    }   // eo constructor
    /**********************************************
    This is where we create the world of Sprites
    A Sprite must be appended to the rootSprite to be displayed
    ***********************************************/
    App.prototype.init = function () {

        //this.trainGame = new TrainGame(this.rootSprite);
        this.cloudGame = new CloudGame(this.rootSprite);

        ////////////////////////////////////////////////////

        this.refreshTimer = setInterval(this.update, AppConfig.WORLDREFRESHRATE, this); // called in the context of "this"
        // For the FPS counter
        this.oldTime = new Date();
        this.msperframe = $('#msperframe');
        this.count = 1;
        this.sampleOver = 10; // number of frames to sample over
    };
    /*
    */
    App.prototype.update = function (self) {

        if (self.count === self.sampleOver) {
            var timeNow = new Date();
            self.msperframe.text(parseInt((timeNow - self.oldTime) / self.sampleOver) + "ms/frame");
            self.oldTime = timeNow;
            self.count = 1;
        } else {
            self.count+=1;
        }

        AppConfig.animationController.update();
        AppConfig.physicsEngine.update();
    };

    return App;
});


