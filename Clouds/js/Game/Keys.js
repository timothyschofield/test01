/*
*/
//noinspection JSLint
define(['jquery', 'EventDispatcher'], function ($, EventDispatcher) {

    Keys.KEYDOWN = "keydown";
    Keys.KEYUP = "keyup";
    Keys.theseKeysDown = {
        'Up': false,
        'Down': false,
        'Right': false,
        'Left': false,
        'M': false
    };

    function Keys() {

        var self = this;

        /*
         */
        document.addEventListener('keyup', function (eventData) {
           // var request;

            var thisKeyUp = self.getKey(eventData.keyCode);
            if(thisKeyUp) {
                Keys.theseKeysDown[thisKeyUp] = false;
            }

           self.dispatchGameEvent(Keys.KEYUP);

        }); // eo keyup

        /*
         */
        document.addEventListener('keydown', function (eventData) {
            var thisKeyDown = self.getKey(eventData.keyCode);
            if(thisKeyDown) {
                Keys.theseKeysDown[thisKeyDown] = true;
            }

            self.dispatchGameEvent(Keys.KEYDOWN);

        }); // eo keydown


    } // eo constructor
    Keys.prototype = Object.create(EventDispatcher.prototype);
    Keys.prototype.constructor = Keys;
    /*
     */
    Keys.prototype.getKey = function (keyCode) {
        var thisAction;

        switch (keyCode) {
            case 38: thisAction = 'Up'; break;          // arrow up
            case 40: thisAction = 'Down'; break;        // arrow down
            case 39: thisAction = 'Right'; break;       // arrow right
            case 37: thisAction = 'Left'; break;        // arrow left
            case 77: thisAction = 'M'; break;           // m or M
            default:
        }

        return thisAction;
    };
    /*
     */
    Keys.prototype.getKeysDown = function () {
        return Keys.theseKeysDown;
    };

    return Keys;
});



