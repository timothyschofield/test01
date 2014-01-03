/*
    Loader
    Author: Tim Schofield
    Date: 26 Feb 2013

*/

//noinspection JSLint
define(['jquery'], function ($) {

    function Loader() {

    }
    /*
    */
    Loader.prototype.loadImages = function (thisImagePath, imageNameList) {
        var n;
        var nameListLen = imageNameList.length;

        // This seems to work - very simple but no callback
        for(n = 0; n < nameListLen; n+=1) {
            $("#main").append($('<div></div>').css('background-image', "url('" + thisImagePath + imageNameList[n] + "')"));

        }



    };

    return Loader;
});
