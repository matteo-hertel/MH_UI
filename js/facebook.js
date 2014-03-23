/**
 * Facebook wrapper to interact with the SDK
 */
var Facebook = (function(){
    var Skeleton = {
        fire: function(config) {    //bootstrap method
            Skeleton.config = config;   //make the config available to all the components
            Skeleton.bindEvents();      // bind events if any

            // here you can remove or show the DOM elements to be used in javascript only
        },
    // bind all the events
        bindEvents: function() {
            var self = Skeleton;
            this.config.target.on('click', self.eventFunction);
        },
    // function fired by event
        eventFunction: function() {
            alert("yep");
        },
        // other functions
        other: function() {
            //other action
        }
    };

return {
    fire: Skeleton.fire,
}

}());