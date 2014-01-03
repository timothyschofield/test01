
            var ufo = $('<div></div>').attr('id', 'ufo').css({
                'width':'164px',
                'height':'75px',
                'background-color':'#ff0000',
                'position':"relative",
                'left':'100px',
                'top':'100px',
                '-webkit-animation-name': 'ufoMove'
            });

            this.ufoLayer.node.append(ufo);

            ufo.on('mousedown', function() {
                console.log('mousedown');
                //$("#ufo").css('-webkit-animation-play-state', 'paused');
                $("#ufo").removeClass('-webkit-animation');
            });

            $("#ufo").draggable({
                //revert: true,
                start: function () {
                    console.log("START Drag ufo");
                   // $("#ufo").css('-webkit-animation-play-state', 'paused');

                },
                drag: function( event, ui ) {
                    console.log("Drag ufo");},
                stop: function () {
                    console.log("STOP Drag ufo");
                   // $("#ufo").css('-webkit-animation-play-state', 'running');
                }
            });

    /*
     Called by Agent.processRequestStack
     request = {action:X, parameters:[a,b,...]}
    */
    Male.prototype.executeActionFromStack = function (request) {
        var dx = 0;                 // pixels
        var dy = 0;                 // pixels
        var newX = this.tileX;      // tile
        var newY = this.tileY;      // tile
        var childID = "";

        var thisAction = request.action;
        var theseParameters = request.parameters;

        switch (thisAction) {

            case 'mine':
                this.onLayMine();
                break;

            case 'idle':
                switch (theseParameters[0]) {
                    case undefined: childID = "idle"; break;
                    default: console.log("unrecognised parameter " + theseParameters[0] + " to action " + thisAction);
                } // eo idle switch

                // actions idle
                if (childID) {
                    this.bodyContainer.showChildOnly(childID);
                    this.bodyContainer.startChild(childID);
                }

                break;

            case 'move':
                switch (theseParameters[0]) {
                    case 'north':
                        dy = -this.height;
                        newY = this.tileY - 1;
                        childID = "north";
                        break;
                    case 'south':
                        dy = this.height;
                        newY = this.tileY + 1;
                        childID = "south";
                        break;
                    case 'east':
                        dx = this.width;
                        newX = this.tileX + 1;
                        childID = "east";
                        break;
                    case 'west':
                        dx = -this.width;
                        newX = this.tileX - 1;
                        childID = "west";
                        break;

                    default: console.log("unrecognised parameter " + theseParameters[0] + " to action " + thisAction);
                } // eo move switch

                // actions move
                if (!this.gameEdgeCollision(newX, newY) && !this.tileForbidden(newX, newY)) {

                    if (childID) {
                        // do the walking animation
                        this.bodyContainer.showChildOnly(childID);
                        this.bodyContainer.startChild(childID);

                        this.lockRequestStack();    // moving is a "blocking" action - can't move in two directions at once

                        this.moveToTile(newX, newY);    // moves Agent in the map
                        this.moveRel(dx, dy);   // does the graphical translation
                    }
                } else {
                    this.unlockAndPopRequestStack();
                }
                break;

            default: console.log("unrecognised action " + thisAction);

        } // eo thisAction switch

    };




CSS box’s text or children: foreground-blend-mode

text drop shadow: text-shadow-blend-mode

CSS box’s background images: background-blend-mode

CSS box’s shadow: box-shadow-blend-mode

Complete CSS box: blend-mode

p { color: white; 
    foreground-blend-mode: overlay;   // exclusion, overlay
    background-color: hsl(34, 53%, 82%);
     background-image: url );}

       'blend-mode': 'multiply',

   this.node.position().top // relative to container
   this.node.offset().top   // relative to document


