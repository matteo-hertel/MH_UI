/*
 * UI wrapper, usefull to create UI element without hardcoding stuff
 *
 * Public methods: modal, progressbar
 *
 * Usage: UI.progressbar(75); || UI.modal({title:"<h4>I'm a modal</h4>", body: "<p style='color:blue'>Hello Folks!</p>"})
 */


var UI = UI || (function($, window, undefined) {
    var UserInterface = {
        // set the components to an empty object than we can store
        // here our components the first components is actually an array where the ids are stored
        components: {skeletons: {}},
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
                self.modalCreate();
            }

            // the return object will be like:
            return {
                // object: the actual modal, the Jquery object that can be manipulated
                object: self.components.modal.skeleton.object,
                // title: the method to overwrite the title
                title: self.components.modal.skeleton.title,
                // titleAppend: the method to append content to the title
                titleAppend: self.components.modal.skeleton.titleAppend,
                // body: the method to overwrite the body
                body: self.components.modal.skeleton.body,
                // bodyAppend the method to append content to the title
                bodyAppend: self.components.modal.skeleton.bodyAppend,
                // footer, the method to append objects to the footer
                footer: self.components.modal.skeleton.footer,
                // show: a method to show the modal
                show: self.components.modal.skeleton.show,
                // hide: a method to hide the modal
                hide: self.components.modal.skeleton.hide
            };
        },
        modalCreate: function() {
            var self = UserInterface;
            var component = "modal";
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
                    UI.button({class: "close", default: false, text: "x", data: {dismiss: "modal"}}).object
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

            if (typeof self.components[component].data === "object") {
                for (var data in self.components[component].data) {
                    if (self.components[component].data.hasOwnProperty(data)) {
                        self.components[component].skeleton.object.attr("data-" + data, self.components[component].data[data]);
                    }
                }
            }

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
                $("#" + self.components.modal.id).modal().on("hide.bs.modal", self.modalRemove);
            };
            // hide method
            // nice to have method, it can be useful
            self.components.modal.skeleton.hide = function() {
                $("#" + self.components.modal.id).modal("hide");
            };

            //by default the close button is appended, you can disable it
            // by passing false to defaultFooter
            if (self.components.modal.defaultFooter === true) {
                self.components.modal.skeleton.footer(
                        UI.button({
                            text: "Close",
                            data: {
                                dismiss: "modal"
                            }
                        }).object);
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
        modalRemove: function() {
            $(this).remove();
        },
        /*
         * -------------------------------------------Progressbar-----------------------------------------------------
         *
         *   public progressbar method
         *
         *   this method accept an integer or an object as parameter and will return an object with:
         *   - the HTML object
         *   - the animate function
         *   - the button ID .
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
                return self.progressbarCreate();
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
                return self.progressbarCreate();
            }
        },
        // a function to build the class string that will be used in the progressbar
        progressbarBuildComponent: function() {
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
        progressbarAnimate: function(obj) {
            var self = UserInterface;
            //get the progressbar and apply the jQuery animate
            var id = obj.id || self.components.progressbar.id;
            var progressbar = $("#" + id);
            if (typeof obj === "number") {
                var temp_object = {
                    time: data,
                    percentage: 100};
                obj = temp_object;
            }
            // the jQuery animation in percentage is bugged, so the right way is to get the parent width and
            // transform thepercentage in pixels, easy math:
            // (parent widht * percentaqge)/100
            var width = progressbar.width();
            $(progressbar.children()[0]).animate({
                width: (width * obj.percentage) / 100 + "px"
            }, obj.time, function() {
                // if a callback is provided fire it
                if (typeof obj.callback === "function") {
                    obj.callback();
                }
            });
            return{object: $("#" + id),
                id: id}
        },
        // the core function that will create the progressbar
        progressbarCreate: function() {
            var self = UserInterface;
            var component = "progressbar";
            //build the class and add an ID
            self.progressbarBuildComponent();
            var progressbar_id = self.components.progressbar.id || self.randomId();
            self.components.progressbar.id = progressbar_id;
            // create the container for the bar
            self.components.progressbar.skeleton = $("<div/>", {class: self.components.progressbar.class, id: self.components.progressbar.id}).append(
                    //append the bar itself
                    $("<div/>", {class: self.components.progressbar.level,
                        style: "width: " + (parseInt(self.components.progressbar.percentage) || 0) + "%"
                    })
                    );

            if (typeof self.components[component].data === "object") {
                for (var data in self.components[component].data) {
                    if (self.components[component].data.hasOwnProperty(data)) {
                        self.components[component].skeleton.attr("data-" + data, self.components[component].data[data]);
                    }
                }
            }
            // fire the callback function is a valid function is passed
            if (typeof self.components.progressbar.callback === "function") {
                self.components.progressbar.callback(self.components.progressbar.skeleton);
            }
            // return the htmo object, the animate function and the ID
            return {
                object: self.components.progressbar.skeleton,
                animate: self.progressbarAnimate,
                id: self.components.progressbar.id
            };

        },
        /*
         * -------------------------------------------Button-----------------------------------------------------
         *
         *   public button method
         *
         *   this method accept an string or an object as parameter and will return and object with:
         *   - the HTML object
         *   - the changeText function
         *   - the addAction function
         *   - the button ID .
         *
         *   if an string is passed a default button with the provided text will be created
         *
         *   if an object is passed the button will be created according to the object passed
         *   
         * Object properties:
         *     text: text of the button
         *     level:  Twitter Bootstrap message level: success, info, danger, warning, link, default, primary
         *     class: {optional} a custom class for the button
         *     disabled: {optional} if true is passed the button will be disabled
         *     size: {optional} Twitter Bootstrap size: lg, sm, xs
         *     id: {optional} a custom id for the button if no id is provided a random one will be assigned
         *     default: {optional} if the value is false the default btn and btn- classes will not be added to the button
         *     actions: {optional} an object with key the event you want to bind (click, mouseenter, customEvent, NOTE: do not quote the event), and the relative function 
         *     callback: {optional} a callback function that will be executed once the button is created, to this function will be passed the HTML object for the button
         */
        button: function(data) {

            var self = UserInterface;
            // if an object is passed the user want a custom button
            if (typeof data === "object") {
                // make the object availabe to all the components
                self.components.button = data;
                // retunr the button
                return self.buttonCreate();
            }
            // if a string is passed the user want a default button
            else if (typeof data === "string") {
                //empty object for the button
                self.components.button = {};
                // set the text, default and level
                self.components.button.text = data;
                // return the button
                return self.buttonCreate();
            }
        },
        //this function will take care of all the borgin stuff like create the right class and so on
        buttonBuildComponent: function() {
            var self = UserInterface;
            // set the text
            self.components.button.text = self.components.button.text || "";
            //create the class
            self.components.button.default = self.components.button.default !== undefined ? self.components.button.default : true;
            self.components.button.level = self.components.button.level ? "btn-" + self.components.button.level : (self.components.button.default ? "btn-default" : "");
            self.components.button.class = self.components.button.class ? self.components.button.class + " " + (self.components.button.default ? "btn " : "") + self.components.button.level : (self.components.button.default ? "btn " : "") + self.components.button.level;
            self.components.button.disabled ? self.components.button.class += " disabled" : null;
            self.components.button.size ? self.components.button.class += " btn-" + self.components.button.size : null;
            // set the id
            self.components.button.id = self.components.button.id || self.randomId();

        },
        // want to chage the text after the button is created, no problem!
        buttonChangeText: function(obj) {
            var self = UserInterface;
            // if no text return false
            if (!obj.text) {
                return false;
            }
            // we need an Id, if no id is passed the last button id will be used
            var id = obj.id || self.components.button.id;
            //change the text
            $("#" + id).text(obj.text);

        },
        // you forgot to bind some event to the button didn't you, this function will help you
        buttonAddActions: function(obj, htmlObj) {
            var self = UserInterface;
            // if no object return false
            if (typeof obj !== "object") {
                return false;
            }
            // we need Jquery object, if none is passed the function will use the last button object
            var button_obj = htmlObj || self.components.button.skeleton;
            //bind the event
            $(button_obj).on(obj);

        },
        // let's create the button
        buttonCreate: function() {
            var self = UserInterface;
            var component = "button";
            // build the components
            self.buttonBuildComponent();
            // the button finally
            self.components.button.skeleton = $("<button/>", {
                type: "button", text: self.components.button.text,
                class: self.components.button.class,
                id: self.components.button.id});
            //if a valid action object is passed let's bind the events
            if (typeof self.components.button.actions === "object") {
                self.components.button.skeleton.on(self.components.button.actions);
            }

            if (typeof self.components[component].data === "object") {
                for (var data in self.components[component].data) {
                    if (self.components[component].data.hasOwnProperty(data)) {
                        self.components[component].skeleton.attr("data-" + data, self.components[component].data[data]);
                    }
                }
            }

            // fire the callback function is a valid function is passed
            if (typeof self.components.button.callback === "function") {
                self.components.button.callback(self.components.button.skeleton);
            }
            //return the HTML object, the two functions and the ID
            return {object: self.components.button.skeleton,
                changeText: self.buttonChangeText,
                addActions: self.buttonAddActions,
                id: self.components.button.id
            };
        },
        /*
         * Alert
         *
         * By calling this method and passing an object with the right properties
         * the process will create an alert, insert the information passed and return the
         * HTML, the id and the timeOut method
         *
         * Object properties:
         *     html: the HTML for the body of the alert
         *     level:  Twitter Bootstrap message level: success, info, danger, warning
         *     class : {optional} a custom class for the alert
         *     dismissable: if true is passed the "X" to close the alert will be added
         *     id: {optional} an optional id can be passed, if no id is provided a random id will be generated
         *     time: {optional} object with the following properties:
         *          time: integer that represent the milliseconds
         *          effect: {optional} the jQuery effect to hide the alert eg fadeOut, slideUp
         *          effectTime: {optional} the duration of the effect in milliseconds
         *     data: {optional} object with key the name of the data and as value the value of the data element
         *     callback: {optional} a callback function that will be executed once the modal is displayed
         *
         *
         *
         */
        alert: function(data) {

            var self = UserInterface;
            // if an object is passed add the data to the right component
            if (typeof data === "object") {

                self.components.alert = data;
                //create the alert
                return self.alertCreate();
            }

            else if (typeof data === "string") {

                self.components.alert = $.extend({}, self.default.alert, {html: data});
                //create the toast
                return self.alertCreate();
            }
        },
        alertBuildComponent: function() {
            var self = UserInterface;
            //internal ID, if no id is provided the same id will be used for the HTML node
            self.components.alert.alertID = self.randomId();
            // set the html NOTE: in this component HTML gives more flexibility to the dev
            // so rather than use text, HTML is allowed
            self.components.alert.html = self.components.alert.html || "";
            //create the class
            self.components.alert.level = self.components.alert.level ? "alert-" + self.components.alert.level : "alert-info";
            self.components.alert.class = self.components.alert.class ? self.components.alert.class + " " + "alert " + self.components.alert.level : "alert " + self.components.alert.level;
            self.components.alert.dismissable ? self.components.alert.class += " alert-dismissable" : null;
            // set the id
            self.components.alert.id = self.components.alert.id || self.components.alert.alertID;

        },
        alertTimeOut: function(object, data) {
            // if a number is passed let's use it as time
            if (typeof data === "number") {
                var temp_object = {time: data};
                data = temp_object;
            }
            //the core is the time, if not time is passed exit the function
            if (!data.time) {
                return false;
            }
            // a simple timeout to destroy the alert
            setTimeout(function() {
                // if an effect is passed than use it
                if (data.effect) {
                    // if no effect time passed than use 400 ms
                    object[data.effect](data.effectTime || 400, function() {
                        // alert("close") will remove the alert from the DOM
                        object.alert("close");
                    });
                } else {
                    // alert("close") will remove the alert from the DOM
                    object.alert("close");
                }
            }, data.time);

            return object;

        },
        alertAppend: function(object, html) {
            object.append(html);
            return object;
        },
        // let's create the alert
        alertCreate: function() {
            var self = UserInterface;

            // build the components
            self.alertBuildComponent();
            // from here the magic begins.
            if (typeof self.components.skeletons.alert !== "object") {
                self.components.skeletons.alert = {};
            }

            var component = $("<div/>", {
                html: self.components.alert.html,
                class: self.components.alert.class,
                id: self.components.alert.id});

            var id = self.components.alert.alertID;

            self.components.skeletons[id] = component;

            //if alert.data is an object lets use the key for the data- name and the value for the data value
            if (typeof self.components.alert.data === "object") {
                self.addData(self.components.skeletons[id], self.components.alert.data);
            }
            // add the "X" to close if dismissable is true
            if (self.components.alert.dismissable) {
                self.components.skeletons[id].prepend(UI.button({
                    default: false,
                    class: "close",
                    text: "x",
                    data: {
                        dismiss: "alert"
                    }
                }
                ).object);
            }

            // init the alert, actually the alert can work without this line BUT
            // to user the alert("close") and the data-dismiss = "alert" we need to init the alert 
            self.components.skeletons[id].alert();

            // if time is passed let's pass the data to the right method
            if (self.components.alert.time) {
                self.alertTimeOut(self.components.skeletons[id], self.components.alert.time);
            }

            // fire the callback function is a valid function is passed
            if (typeof self.components.alert.callback === "function") {
                self.components.alert.callback(self.components.skeletons[id]);
            }
            //return the HTML object, the id and the timeOut method
            var out = new Array();

            out.push(self.components.skeletons[id]);
            out.timeOut = self.partial(self.alertTimeOut, self.components.skeletons[id]);
            out.append = self.partial(self.alertAppend, self.components.skeletons[id])

            return out;
        },
        /*
         * Toast
         * 
         * A toast according to microsoft is :
         * 
         * "A transient message to the user that contains relevant, time-sensitive 
         *  information and provides quick access to related content in an app."
         *
         * By calling this method and passing an object with the right properties
         * the process will create a toast, insert the information passed and return the
         * HTML, the id and the append method
         *
         * Object properties:
         *     html: the HTML for the body of the alert
         *     level:  Twitter Bootstrap message level: success, info, danger, warning
         *     class : {optional} a custom class for the alert
         *     dismissable: if true is passed the "X" to close the alert will be added
         *     position: the position of the toast, there are 4 predefined position:
         *          top-left, top-right, bottom-left, bottom-right, if you want to 
         *          create the toast in a different location you can pass on object
         *          with the css properties like right, top etc, avery element will be 
         *          passed to the jQuery .css()
         *     append: {optional} if you want to add a jQuery object to the toast, 
         *              just create an object with any number of element the value of every key-value pair
         *              will be added to the toast
         *     id: {optional} an optional id can be passed, if no id is provided a random id will be generated
         *     time: {optional} object with the following properties:
         *          time: integer that represent the milliseconds
         *          effect: {optional} the jQuery effect to hide the alert eg fadeOut, slideUp
         *          effectTime: {optional} the duration of the effect in milliseconds
         *     data: {optional} object with key the name of the data and as value the value of the data element
         *     callback: {optional} a callback function that will be executed once the modal is displayed
         *
         *
         *
         */
        toast: function(data) {

            var self = UserInterface;
            // if an object is passed add the data to the right component
            if (typeof data === "object") {

                self.components.toast = data;
                //create the toast
                return self.toastCreate();
            }

            else if (typeof data === "string") {

                self.components.toast = {
                    html: data,
                    level: "info",
                    time: 5000,
                    position: "top-right"
                };
                //create the toast
                return self.toastCreate();
            }

        },
        // append method, use this to append stuff to the toast
        toastAppend: function(data) {
            var self = UserInterface;
            // if a string is passed lets assume that is HTML
            if (typeof data === "string") {
                var temp_object = {html: data};
                data = temp_object;
            }
            // no HTML exit the function
            if (!data.html) {
                return false;
            }
            //if an id is passed use is as query selector
            if (data.id) {
                $("#" + toast_id).append(data.html);
            } else {
                // if no id let's assume that the toast is not in the DOM yet
                // so the skeleton will be used
                self.components.toast.skeleton.append(data.html);
            }
        },
        toastCreate: function() {
            var self = UserInterface;
            // name the component
            var component = "toast";
            // get rid of the callback and store it in a variable
            if (typeof self.components.toast.callback === "function") {
                var callback = self.components.toast.callback;
                self.components.toast.callback = null;
            }
            // a toast is nothing more than an alert floating on the screen
            // so let's use the UI to create a toast
            var alert = UI.alert(self.components.toast);
            // the returning object is wrappend in jquery
            self.components.toast.skeleton = $(alert.object);
            // fetch the ID
            self.components.toast.skeleton.id = alert.id;

            // the toast can be dismissed by clicking on it if a data is passed 
            // add the dismiss to that object
            if (typeof self.components[component].data === "object") {
                self.components[component].data.dismiss = "alert";
            } else {
                // otherwise create a new data object
                self.components[component].data = {dismiss: "alert"};
            }
            // if a string is passed check for a custom position
            if (self.components.toast.position && typeof self.components.toast.position === "string") {

                switch (self.components.toast.position) {

                    case "top-right":

                        self.components.toast.skeleton.css("position", "fixed");
                        self.components.toast.skeleton.css("right", 10);
                        self.components.toast.skeleton.css("top", 100);
                        break;

                    case "top-left":

                        self.components.toast.skeleton.css("position", "fixed");
                        self.components.toast.skeleton.css("left", 10);
                        self.components.toast.skeleton.css("top", 100);
                        break;

                    case "bottom-left":

                        self.components.toast.skeleton.css("position", "fixed");
                        self.components.toast.skeleton.css("left", 10);
                        self.components.toast.skeleton.css("bottom", 50);
                        break;

                    case "bottom-right":

                        self.components.toast.skeleton.css("position", "fixed");
                        self.components.toast.skeleton.css("right", 10);
                        self.components.toast.skeleton.css("bottom", 50);
                        break;
                }
            }
            // if an object is pass, let's pass the element to the .css()
            else if (self.components.toast.position && typeof self.components.toast.position === "object") {
                self.components.toast.skeleton.css("position", "fixed");
                for (var css in self.components.toast.position) {
                    self.components.toast.skeleton.css(css, self.components.toast.position[css]);
                }

            }
            // if append is an object let's all its element to the Toast
            if (typeof self.components.toast.append === "object") {
                for (var elem in self.components.toast.append) {
                    self.toastAppend({html: self.components.toast.append[elem]});
                }

            }
            // if toast.data is an object lets use the key for the data- name and the value for the data value
            for (var data in self.components[component].data) {
                if (self.components[component].data.hasOwnProperty(data)) {
                    self.components[component].skeleton.attr("data-" + data, self.components[component].data[data]);
                }
            }

            // fire the callback function is a valid function is passed
            if (typeof callback === "function") {
                callback(self.components.alert.skeleton);
            }
            $("#" + self.components.toast.skeleton.id).alert();

            //return the HTML object, the id and the append method
            return {object: self.components.toast.skeleton,
                id: self.components.toast.skeleton.id,
                append: self.toastAppend
            };
        },
        randomId: function() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 18; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        },
        partial: function(func /*, 0..n args */) {
            var args = Array.prototype.slice.call(arguments, 1);
            return function() {
                var allArguments = args.concat(Array.prototype.slice.call(arguments));
                return func.apply(this, allArguments);
            };
        },
        addData: function(object, data) {
            for (var item in data) {
                // a simple check to be sure the key exist
                if (data.hasOwnProperty(item)) {
                    object.attr("data-" + item, data[item]);
                }
            }
        },
        log: function() {
            return UserInterface.components;
        },
        destroy: function() {
            var self = UserInterface;

            for (var id in self.components.skeletons) {
                $(self.components.skeletons[id]).remove();
            }
            self.component = {
                skeletons: {}
            };
        },
        extend: function(name, object) {
            UserInterface.default[name] = $.extend({}, self.default[name], object);
        },
        getComponent: function(id) {
            return UserInterface.components.skeletons[id];
        },
        // set the default object, it can be extended by the function extend
        default: {alert: {
                html: "",
                level: "info",
                dismissable: true
            }
        }
    };
    return {
        modal: UserInterface.modal,
        progressbar: UserInterface.progressbar,
        button: UserInterface.button,
        alert: UserInterface.alert,
        toast: UserInterface.toast,
        log: UserInterface.log,
        destroy: UserInterface.destroy,
        extend: UserInterface.extend,
        get: UserInterface.getComponent
    };

})(jQuery, window);
