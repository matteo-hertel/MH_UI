/*
 * UI wrapper, usefull to create UI element without hardonding stuff
 *
 * Public methods: modal, progressbar
 *
 * Usage: UI.progressbar(75); || UI.modal({title:"<h4>I'm a modal</h4>", body: "<p style='color:blue'>Hello Folks!</p>"})
 */


var UI = UI || (function($) {
    var UserInterface = {
        // set the components to an empty object than we can store
        // here our components
        components: {},
        /*
         * Modal
         *
         * By calling this method and passing an object with the right properties
         * the process will create a new modal, insert the information passed, display it and
         * bind the event to destroy that modal once is hided
         *
         * Object properties:
         *     show: boolean, if true is passed the modal will automaticaly displayed, otherwise the .show() method is required to show the modal
         *     title:  html for the title, if no header is passed a palceholder will be inserted
         *     id: {optional} an optional id can be passed, if no id is provided a random id will be generated
         *     body: html for the body, if no body is passed a palceholder will be inserted
         *     footer: an object of any type is allowed, but a jquery object for a button with custom callback is highly recomended
         *     defaultFooter: boolean, if true is passed the default close button is added to the modal
         *     callback: {optional} a callback function that will be executed once the modal is displayed
         *
         *
         *
         */
        modal: function(data) {
            var self = UserInterface;
            // if an object is passed to the modal let's create the modal
            if (typeof data === "object") {
                self.components.modal = data;
                self.createModal();
            }

            // the return object will be like:
            // object: the actual modal, the Jquery object that can be manipulated
            // title: the method to overwrite the title
            // titleAppend: the method to append content to the title
            // body: the method to overwrite the body
            // bodyAppend the method to append content to the title
            // footer, the method to append objects to the footer
            // show: a method to show the modal
            // hide: a method to hide the modal

            return {
                object: self.components.modal.skeleton.object,
                title: self.components.modal.skeleton.title,
                titleAppend: self.components.modal.skeleton.titleAppend,
                body: self.components.modal.skeleton.body,
                bodyAppend: self.components.modal.skeleton.bodyAppend,
                footer: self.components.modal.skeleton.footer,
                show: self.components.modal.skeleton.show,
                hide: self.components.modal.skeleton.hide
            }
        },
        createModal: function() {
            var self = UserInterface;
            //init the id, show, defaultFooter and skeleton proprietes to prevent call to undefined stuff
            self.components.modal.id = self.components.modal.id || self.randomId();
            self.components.modal.show = self.components.modal.show !== undefined ? self.components.modal.show : true;
            self.components.modal.defaultFooter = self.components.modal.defaultFooter !== undefined ? self.components.modal.defaultFooter : true;
            self.components.modal.skeleton = {};

            // the hard part of this method, the skeleton, in theory the Twitter bootstrap's
            // dev team will never change this classes for the modal so the jQuery objects
            // will work also in the future

            //main div modal fade
            self.components.modal.skeleton.object = $("<div/>", {
                class: "modal fade",
                id: self.components.modal.id
            }).append(
                    //modal dialog
                    $("<div/>", {class: "modal-dialog"}).append(
                    //the content
                    $("<div/>", {class: "modal-content"}).append(
                    //Header
                    $("<div/>", {class: "modal-header"}).append(
                    //the x close button
                    $("<button/>", {
                        type: "button",
                        class: "close",
                        "data-dismiss": "modal",
                        "aria-hidden": "true",
                        html: "&times;",
                    })
                    )
                    ).append(
                    //Body
                    $("<div/>", {class: "modal-body"})
                    ).append(
                    //Footer
                    $("<div/>", {class: "modal-footer"}).append()
                    )
                    )
                    ).appendTo("body");

            // title method
            // this method will add a title at our modal
            self.components.modal.skeleton.title = function(html) {
                self.components.modal.skeleton.object.find(".modal-header").html(html);
            };
            // titleAppend method
            // do you want to append something at the modal's title? No probem, use this method!
            self.components.modal.skeleton.titleAppend = function(html) {
                self.components.modal.skeleton.object.find(".modal-header").append(html);
            };
            // body method
            // this method will add the body at our modal
            self.components.modal.skeleton.body = function(html) {
                self.components.modal.skeleton.object.find(".modal-body").html(html);
            };
            // bodyAppend method
            // do you want to append something at the modal's body? No probem, use this method!
            self.components.modal.skeleton.bodyAppend = function(html) {
                self.components.modal.skeleton.object.find(".modal-body").append(html);
            };
            // footer method
            // this method will append the content rather that insert the HTML, is better for the footer
            // and only if a object is passed will be appended
            self.components.modal.skeleton.footer = function(obj) {
                if (typeof obj === "object") {
                    self.components.modal.skeleton.object.find(".modal-footer").append(obj);
                }
            };

            // show method
            // if you set false the show propety, with this method you can display the modal
            self.components.modal.skeleton.show = function() {
                // to keep the body clean when the modal is closed it will be removed from the DOM
                $("#" + self.components.modal.id).modal().on("hide.bs.modal", self.removeModal);
            }
            // hide method
            // nice to have method, it can be useful
            self.components.modal.skeleton.hide = function() {
                $("#" + self.components.modal.id).modal("hide");
            }

            //by default the close button is appended, you can disable it
            // by passing false to defaultFooter
            if (self.components.modal.defaultFooter === true) {
                self.components.modal.skeleton.footer($("<button/>", {
                    type: "button",
                    class: "btn btn-default",
                    "data-dismiss": "modal",
                    text: "Close"
                }))
            }
            // add the content using the method above
            //note the append to the title to avoi the deltion of the cross to close the modal
            self.components.modal.skeleton.titleAppend(self.components.modal.title);
            self.components.modal.skeleton.body(self.components.modal.body);
            self.components.modal.skeleton.footer(self.components.modal.footer);

            // show the modal if you want to
            if (self.components.modal.show === true) {
                self.components.modal.skeleton.show();
            }
            // a callback function is always nice, so if one is passed it will be fired after the modal is created
            // and the Jquery object for the modal will be passed
            if (typeof self.components.modal.callback === "function") {
                self.components.modal.callback({object: self.components.modal.skeleton.object}
                );
            }
        },
        // method to remove the modal from the DOM
        removeModal: function() {
            $(this).remove();
        },
        /*
         * -------------------------------------------Progressbar-----------------------------------------------------
         *
         *   public progressbar method
         *
         *   this method accept an integer or an object as parameter and will return the html for
         *   the progressbar.
         *
         *   if an integer is passed a default active and striped proressbar will be created
         *
         *   if an object is passed the progressbar will be created according to the object
         *   
         * Object properties:
         *     class: {optional} a custom class for the container of the progressbar
         *     id: {optional} a custom id for the container of the progressbar, if no id is provided a random one will be assigned
         *     level:  Twitter Bootstrap message level: success, info, danger, warning
         *     percentage:  an integer from 0 to 100, default 0
         *     striped:  {optional} boolean to make the progressbar striepd
         *     active:  {optional} boolean to make the progressbar active
         *     callback: {optional} a callback function that will be executed once the bar is created, to this function will be passed an object with a reference to the bar and the aniamte function
         */
        progressbar: function(data) {

            var self = UserInterface;
            // if an object is passed to the progressbar let's create it
            if (typeof data === "object") {
                // make the object availabe to all the components
                self.components.progressbar = data;
                // retunr the progressbar
                return self.createProgressbar();
            }
            // if an interger is passed the user want a default progressbar
            else if (typeof data === "number") {
                // empty object to be populated
                self.components.progressbar = {};
                // some nice active and striped effect
                self.components.progressbar.striped = true;
                self.components.progressbar.active = true;
                // set the percentage
                self.components.progressbar.percentage = parseInt(data);
                // return the progressbar
                return self.createProgressbar();
            }
        },
        // a function to build the class string that will be used in the progressbar
        buildClass: function() {
            var self = UserInterface;
            // if no class property is passed start with an empty string 
            self.components.progressbar.class = self.components.progressbar.class || "";
            // add the class progress
            self.components.progressbar.class += " progress";
            // than the level
            self.components.progressbar.level = self.components.progressbar.level ? " progress-bar progress-bar-" + self.components.progressbar.level : "progress-bar";
            // add class striped and active if needed 
            self.components.progressbar.class += self.components.progressbar.striped ? " progress-striped" : "";
            self.components.progressbar.class += self.components.progressbar.active ? " active" : "";

        },
        /* the animate function will take an object as input with two property:
         *   time : time in milliseconds to complete the animation
         *   width: and integer from 0 to 100 to set the width %
         *   callback: {optional} always nice to have a callback, when the aniamtion is complete and 
         *   a valid function is passed the callback will be executed
         *
         */
        animateProgressbar: function(obj) {
            var self = UserInterface;
            //get the progressbar and apply the jQuery animate
            progressbar = $("#" + self.components.progressbar.id).children()[0]
            $(progressbar).animate({
                width: obj.percentage + "%"
            }, obj.time, function() {
                // if a callback is provided fire it
                if (typeof obj.callback === "function") {
                    obj.callback();
                }
            });
        },
        // the core function that will create the progressbar
        createProgressbar: function() {
            var self = UserInterface;
            //build the class and add an ID
            self.buildClass();
            self.components.progressbar.id = self.components.progressbar.id || self.randomId()
            // create the container for the bar
            self.components.progressbar.skeleton = $("<div/>", {class: self.components.progressbar.class, id: self.components.progressbar.id}).append(
                    //append the bar itself
                    $("<div/>", {class: self.components.progressbar.level,
                        style: "width: " + (parseInt(self.components.progressbar.percentage) || 0) + "%"
                    })
                    )
            // fire the callback function is a valid function is passed
            if (typeof self.components.progressbar.callback === "function") {
                self.components.progressbar.callback({
                    object: self.components.progressbar.skeleton,
                    animate: self.animateProgressbar
                })
            }

            return self.components.progressbar.skeleton;

        },
        randomId: function() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        },
        log: function() {
            return UserInterface.components
        },
        wipeComponents: function() {
            UserInterface.components = {};
        }
    };
    return {
        modal: UserInterface.modal,
        progressbar: UserInterface.progressbar,
        log: UserInterface.log,
        wipeComponents: UserInterface.wipeComponents
    }

})(jQuery);