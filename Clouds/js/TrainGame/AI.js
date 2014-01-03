/**
 * Created by Timothy on 24/11/13.
 */
//noinspection JSLint
define(['jquery'],
    function ($) {

        function AI(agent) {

            this.myAgent = agent;
            this.minJourneyDist = 1;
            this.maxJourneyDist = 10;
            this.thisAction = {};
            this.AINewJournyRate = 1000;

        } // eo AI
        /*

         */
        AI.prototype.start = function () {
            this.refreshTimer = setInterval(this.choseNewJourney, this.AINewJournyRate, this); //
        };
        /*
         */
        AI.prototype.choseNewJourney = function (self) {

            var journeyDistance = Math.floor((Math.random() * self.maxJourneyDist) + self.minJourneyDist);

            switch(Math.floor((Math.random() * 4) + 1)) {
                case 1: self.thisAction = 'North'; break;
                case 2: self.thisAction = 'South'; break;
                case 3: self.thisAction = 'East'; break;
                case 4: self.thisAction = 'West'; break;
            }

           self.myAgent.processAICommand(self.thisAction);
        };


    return AI;
});