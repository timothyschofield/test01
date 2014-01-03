/**
 * Created by Timothy on 14/12/13.
 */
//noinspection JSLint
define(['jquery', 'jqueryui', 'EventDispatcher'],
    function ($, jqueryui, EventDispatcher) {

        NavPalette.CLICK = 'navclick';

        function NavPalette(config) {

            EventDispatcher.apply(this, []);

            this.main = $('#' + config.id);
            this.main.draggable();

            var self = this;
            $("#northButton").on('click', function() { self.dispatchGameEvent(NavPalette.CLICK, "Up"); });
            $("#southButton").on('click', function() { self.dispatchGameEvent(NavPalette.CLICK, "Down"); });
            $("#eastButton").on('click', function() { self.dispatchGameEvent(NavPalette.CLICK, "Right"); });
            $("#westButton").on('click', function() { self.dispatchGameEvent(NavPalette.CLICK, "Left"); });
            $("#mineButton").on('click', function() { self.dispatchGameEvent(NavPalette.CLICK, "M"); });

        }
        NavPalette.prototype = Object.create(EventDispatcher.prototype);
        NavPalette.prototype.constructor = NavPalette;



       return NavPalette;

    });