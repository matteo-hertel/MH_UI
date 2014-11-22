/*
 * UI wrapper, useful to create UI element without hardcoding stuff
 *
 * Public methods: modal, progressbar, button, alert, toast
 *
 */

define(["jquery"], function ($) {
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
             *     show: boolean, if true is passed the modal will automatically displayed, otherwise the .show() method is required to show the modal
             *     title:  html for the title
             *     id: {optional} an optional id can be passed, if no id is provided a random id will be generated
             *     body: html for the body, if no body is passed a palceholder will be inserted
             *     data: {optional} object with key the name of the data and as value the value of the data element
             *     footer: an object of any type is allowed, but a jquery object for a button with custom callback is highly recomended
             *     defaultFooter: boolean, if true is passed the default close button is added to the modal
             *     callback: {optional} a callback function that will be executed once the modal is displayed
             *
             *
             *
             */
            modal: function(data) {
                var self = UserInterface, out;
                // if an object is passed to the modal let's create the modal
                if (typeof data === "object") {
                    self.components.modal = data;
                    id = self.modalCreate();
                }
                //the out object is returned by this function
                out = new Array();
                // at index 0 the HTML node
                out.push(self.components.skeletons[id]);
                //all the function returned are generate by the partial, that means that the first
                // parameter is predefined, in this case the HTML is passed so the function will
                // alway affect the right node
                out.title = self.partial(self.components.modal.skeleton.title, self.components.skeletons[id]);
                out.titleAppend = self.partial(self.components.modal.skeleton.titleAppend, self.components.skeletons[id]);
                out.body = self.partial(self.components.modal.skeleton.body, self.components.skeletons[id]);
                out.bodyAppend = self.partial(self.components.modal.skeleton.bodyAppend, self.components.skeletons[id]);
                out.footer = self.partial(self.components.modal.skeleton.footer, self.components.skeletons[id]);
                out.show = self.partial(self.components.modal.skeleton.show, self.components.skeletons[id]);
                out.hide = self.partial(self.components.modal.skeleton.hide, self.components.skeletons[id]);
                return out;
            },
            modalCreate: function() {
                var self = UserInterface;
                // name the component for two reason:
                // using n the name is shortened and all the code is more abstract
                // and reusable
                var n = "modal";
                self.components[n].modalID = self.randomId();
                //init the id, show, defaultFooter and skeleton proprietes to prevent call to undefined stuff
                self.components[n].id = self.components[n].id || self.components[n].modalID;
                self.components[n].show = self.components[n].show !== undefined ? self.components[n].show : true;
                self.components[n].defaultFooter = self.components[n].defaultFooter !== undefined ? self.components[n].defaultFooter : true;
                self.components[n].skeleton = {};

                // the hard part of this method, the skeleton, in theory the Twitter bootstrap's
                // dev team will never change this classes for the modal so the jQuery objects
                // will work also in the future

                component = $("<div/>", {
                    class: "modal fade",
                    id: self.components[n].id
                }).append(
                        //modal dialog
                        $("<div/>", {class: "modal-dialog"}).append(
                        //the content
                        $("<div/>", {class: "modal-content"}).append(
                        //Header
                        $("<div/>", {class: "modal-header"}).append(
                        //the x close button
                        UI.button({class: "close", default: false, text: "x", data: {dismiss: "modal"}}))
                        ).append(
                        //Body
                        $("<div/>", {class: "modal-body"})
                        ).append(
                        //Footer
                        $("<div/>", {class: "modal-footer"}).append()
                        )
                        )
                        ).appendTo("body");
                // get the id for the internal tracker
                var id = self.components[n].modalID;
                // insert the node in the tracker
                self.components.skeletons[id] = component;

                if (typeof self.components[n].data === "object") {
                    // this function will add data-{key} = {value} to the HTML container
                    self.addData(self.components.skeletons[id], self.components[n].data);
                }

                // title method
                // this method will add a title at our modal
                self.components[n].skeleton.title = function(object, html) {
                    object.find(".modal-header").html(html);
                };
                // titleAppend method
                // do you want to append something at the modal's title? No probem, use this method!
                self.components[n].skeleton.titleAppend = function(object, html) {
                    object.find(".modal-header").append(html);
                };
                // body method
                // this method will add the body at our modal
                self.components[n].skeleton.body = function(object, html) {
                    object.find(".modal-body").html(html);
                };
                // bodyAppend method
                // do you want to append something at the modal's body? No probem, use this method!
                self.components[n].skeleton.bodyAppend = function(object, html) {
                    object.find(".modal-body").append(html);
                };
                // footer method
                // this method will append the content rather that insert the HTML, is better for the footer
                // and only if a object is passed will be appended
                self.components[n].skeleton.footer = function(object, html) {
                    object.find(".modal-footer").append(html);
                };

                // show method
                // if you set false the show propety, with this method you can display the modal
                self.components[n].skeleton.show = function(object) {
                    // to keep the body clean when the modal is closed it will be removed from the DOM
                    object.modal().on("hide.bs.modal", self.partial(self.modalRemove, object));
                };
                // hide method
                // nice to have method, it can be useful
                self.components[n].skeleton.hide = function(object) {
                    object.modal("hide");
                };

                //by default the close button is appended, you can disable it
                // by passing false to defaultFooter
                if (self.components[n].defaultFooter === true) {
                    self.components[n].skeleton.footer(self.components.skeletons[id],
                            UI.button({
                                text: "Close",
                                data: {
                                    dismiss: "modal"
                                }
                            }));
                }
                // add the content using the method above
                //note the append to the title to avoid the deltion of the cross to close the modal
                self.components[n].skeleton.titleAppend(self.components.skeletons[id], self.components[n].title);
                self.components[n].skeleton.body(self.components.skeletons[id], self.components[n].body);
                self.components[n].skeleton.footer(self.components.skeletons[id], self.components[n].footer);

                // show the modal if you want to
                if (self.components[n].show === true) {
                    self.components[n].skeleton.show(self.components.skeletons[id]);
                }
                // a callback function is always nice, so if one is passed it will be fired after the modal is created
                // and the Jquery object for the modal will be passed
                if (typeof self.components[n].callback === "function") {
                    self.components[n].callback(self.components.skeletons[id]);
                }

                return id;
            },
            // method to remove the modal from the DOM
            modalRemove: function(object) {
                object.remove();
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
             *     data: {optional} object with key the name of the data and as value the value of the data element
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
                    // extend the default progressbar object
                    self.components.progressbar = $.extend({}, self.default.progressbar, {percentage: parseInt(data)});
                    // return the progressbar
                    return self.progressbarCreate();
                }
            },
            // a function to build the class string that will be used in the progressbar
            progressbarBuildComponent: function() {
                var self = UserInterface;

                // name the component for two reason:
                // using n the name is shortened and all the code is more abstract
                // and reusable
                var n = "progressbar";

                self.components[n].progressbarID = self.randomId();
                self.components[n].id = self.components[n].id || self.components[n].progressbarID;
                // if no class property is passed start with an empty string 
                self.components[n].class = self.components[n].class || "";
                // add the class progress
                self.components[n].class += " progress";
                // than the level
                self.components[n].level = self.components[n].level ? " progress-bar progress-bar-" + self.components[n].level : "progress-bar";
                // add class striped and active if needed 
                self.components[n].class += self.components[n].striped ? " progress-striped" : "";
                self.components[n].class += self.components[n].active ? " active" : "";

            },
            /* the animate function will take an object as input with two property:
             *   time : time in milliseconds to complete the animation
             *   width: and integer from 0 to 100 to set the width %
             *   callback: {optional} always nice to have a callback, when the aniamtion is complete and 
             *   a valid function is passed the callback will be executed
             *
             */
            progressbarAnimate: function(object, data) {

                if (typeof data === "number") {
                    var temp_object = {
                        time: data,
                        percentage: 100};
                    data = temp_object;
                }

                if (data.percentage === "undefined") {
                    return false;
                }
                // the jQuery animation in percentage is bugged, so the right way is to get the parent width and
                // transform thepercentage in pixels, easy math:
                // (parent widht * percentaqge)/100
                var width = object.width();
                $(object.children()[0]).animate({
                    width: (width * data.percentage) / 100 + "px"
                }, data.time, function() {
                    // if a callback is provided fire it
                    if (typeof data.callback === "function") {
                        data.callback();
                    }
                });
                return object;
            },
            // the core function that will create the progressbar
            progressbarCreate: function() {
                var self = UserInterface, out;

                // name the component for two reason:
                // using n the name is shortened and all the code is more abstract
                // and reusable
                var n = "progressbar";

                //build the class and add an ID
                self.progressbarBuildComponent();
                // create the container for the bar
                var component = $("<div/>", {class: self.components[n].class, id: self.components[n].id}).append(
                        //append the bar itself
                        $("<div/>", {class: self.components[n].level,
                            style: "width: " + (parseInt(self.components[n].percentage) || 0) + "%"
                        })
                        );

                // get the id for the internal tracker
                var id = self.components[n].progressbarID;
                // insert the node in the tracker
                self.components.skeletons[id] = component;

                if (typeof self.components[n].data === "object") {
                    self.addData(self.components.skeletons[id], self.components[n].data);
                }
                // fire the callback function is a valid function is passed
                if (typeof self.components[n].callback === "function") {
                    self.components[n].callback(self.components.skeletons[id]);
                }
                // return the htmo object, the animate function and the ID

                //the out object is returned by this function
                out = new Array();
                // at index 0 the HTML node
                out.push(self.components.skeletons[id]);
                //all the function returned are generate by the partial, that means that the first
                // parameter is predefined, in this case the HTML is passed so the function will
                // alway affect the right node
                out.animate = self.partial(self.progressbarAnimate, self.components.skeletons[id]);
                return out;

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
             *     data: {optional} object with key the name of the data and as value the value of the data element
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
                    self.components.button = $.extend({}, self.default.button, {text: data});
                    // return the button
                    return self.buttonCreate();
                }
            },
            //this function will take care of all the borgin stuff like create the right class and so on
            buttonBuildComponent: function() {
                var self = UserInterface;
                // name the component for two reason:
                // using n the name is shortened and all the code is more abstract
                // and reusable
                var n = "button";

                self.components[n].buttonID = self.randomId();
                // set the text
                self.components[n].text = self.components[n].text || "";
                //create the class
                self.components[n].default = self.components[n].default !== undefined ? self.components[n].default : true;
                self.components[n].level = self.components[n].level ? "btn-" + self.components[n].level : (self.components[n].default ? "btn-default" : "");
                self.components[n].class = self.components[n].class ? self.components[n].class + " " + (self.components[n].default ? "btn " : "") + self.components[n].level : (self.components[n].default ? "btn " : "") + self.components[n].level;
                self.components[n].disabled ? self.components[n].class += " disabled" : null;
                self.components[n].size ? self.components[n].class += " btn-" + self.components[n].size : null;
                // set the id
                self.components[n].id = self.components[n].id || self.components[n].buttonID;

            },
            // want to chage the text after the button is created, no problem!
            buttonChangeText: function(object, data) {
                if (typeof data === "string") {
                    var temp_object = {text: data};
                    data = temp_object;
                }
                // if no text return false
                if (!data.text) {
                    return false;
                }
                //change the text
                object.text(data.text);

                return object;

            },
            // you forgot to bind some event to the button didn't you, this function will help you
            buttonAddActions: function(object, htmlObj) {
                // if no object return false
                if (typeof htmlObj !== "object") {
                    return false;
                }
                //bind the event
                object.on(htmlObj);

                return object;

            },
            // let's create the button
            buttonCreate: function() {
                var self = UserInterface, out;

                var n = "button";

                // build the components
                self.buttonBuildComponent();


                var component = $("<button/>", {
                    type: "button", text: self.components[n].text,
                    class: self.components[n].class,
                    id: self.components[n].id});

                var id = self.components[n].buttonID;

                self.components.skeletons[id] = component;
                //if a valid action object is passed let's bind the events
                if (typeof self.components[n].actions === "object") {
                    self.components.skeletons[id].on(self.components[n].actions);
                }

                if (typeof self.components[n].data === "object") {
                    self.addData(self.components.skeletons[id], self.components[n].data);
                }

                // fire the callback function is a valid function is passed
                if (typeof self.components[n].callback === "function") {
                    self.components[n].callback(self.components.skeletons[id]);
                }
                //return the HTML object, the two functions and the ID
                //the out object is returned by this function
                out = new Array();
                // at index 0 the HTML node
                out.push(self.components.skeletons[id]);
                //all the function returned are generate by the partial, that means that the first
                // parameter is predefined, in this case the HTML is passed so the function will
                // alway affect the right node
                out.changeText = self.partial(self.buttonChangeText, self.components.skeletons[id]);
                out.addActions = self.partial(self.buttonAddActions, self.components.skeletons[id]);
                return out;
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
                    return self.alertCreate();
                }
            },
            alertBuildComponent: function() {
                var self = UserInterface;

                // name the component for two reason:
                // using n the name is shortened and all the code is more abstract
                // and reusable
                var n = "alert";

                //internal ID, if no id is provided the same id will be used for the HTML node
                self.components[n].alertID = self.randomId();
                // set the html NOTE: in this component HTML gives more flexibility to the dev
                // so rather than use text, HTML is allowed
                self.components[n].html = self.components[n].html || "";
                //create the class
                self.components[n].level = self.components[n].level ? "alert-" + self.components[n].level : "alert-info";
                self.components[n].class = self.components[n].class ? self.components[n].class + " " + "alert " + self.components[n].level : "alert " + self.components[n].level;
                self.components[n].dismissable ? self.components[n].class += " alert-dismissable" : null;
                // set the id
                self.components[n].id = self.components[n].id || self.components[n].alertID;

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

                // name the component for two reason:
                // using n the name is shortened and all the code is more abstract
                // and reusable
                var n = "alert";

                // build the components
                self.alertBuildComponent();
                // from here the magic begins.

                var component = $("<div/>", {
                    html: self.components[n].html,
                    class: self.components[n].class,
                    id: self.components[n].id});

                // get the id for the internal tracker
                var id = self.components[n].alertID;
                // insert the node in the tracker
                self.components.skeletons[id] = component;

                //if alert.data is an object lets use the key for the data- name and the value for the data value
                if (typeof self.components[n].data === "object") {
                    self.addData(self.components.skeletons[id], self.components[n].data);
                }
                // add the "X" to close if dismissable is true
                if (self.components[n].dismissable) {
                    self.components.skeletons[id].prepend(UI.button({
                        default: false,
                        class: "close",
                        text: "x",
                        data: {
                            dismiss: "alert"
                        }
                    }
                    ));
                }

                // init the alert, actually the alert can work without this line BUT
                // to user the alert("close") and the data-dismiss = "alert" we need to init the alert 
                self.components.skeletons[id].alert();

                // if time is passed let's pass the data to the right method
                if (self.components[n].time) {
                    self.alertTimeOut(self.components.skeletons[id], self.components[n].time);
                }

                // fire the callback function is a valid function is passed
                if (typeof self.components[n].callback === "function") {
                    self.components[n].callback(self.components.skeletons[id]);
                }

                //the out object is returned by this function
                out = new Array();
                // at index 0 the HTML node
                out.push(self.components.skeletons[id]);
                //all the function returned are generate by the partial, that means that the first
                // parameter is predefined, in this case the HTML is passed so the function will
                // alway affect the right node
                out.timeOut = self.partial(self.alertTimeOut, self.components.skeletons[id]);
                out.append = self.partial(self.alertAppend, self.components.skeletons[id]);

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
             *          with the css properties like right, top etc, every element will be 
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

                    self.components.toast = $.extend({}, self.default.toast, {html: data});
                    //create the toast
                    return self.toastCreate();
                }

            },
            toastCreate: function() {
                var self = UserInterface, out;
                // name the component for two reason:
                // using n the name is shortened and all the code is more abstract
                // and reusable
                var n = "toast";

                self.components[n].alertID = self.randomId();
                self.components[n].id = self.components[n].id || self.components[n].alertID;
                // get rid of the callback and store it in a variable
                if (typeof self.components[n].callback === "function") {
                    var callback = self.components[n].callback;
                    self.components[n].callback = null;
                }
                // a toast is nothing more than an alert floating on the screen
                // so let's use the UI to create a toast
                var component = UI.alert(self.components[n])[0];

                // get the id for the internal tracker
                var id = self.components[n].alertID;
                // insert the node in the tracker
                self.components.skeletons[id] = component;

                // the toast can be dismissed by clicking on it if a data is passed 
                // add the dismiss to that object
                if (typeof self.components[n].data === "object") {
                    self.components[n].data.dismiss = "alert";
                } else {
                    // otherwise create a new data object
                    self.components[n].data = {dismiss: "alert"};
                }
                // if a string is passed check for a custom position
                if (self.components[n].position && typeof self.components[n].position === "string") {

                    switch (self.components[n].position) {

                        case "top-right":

                            self.components.skeletons[id].css("position", "fixed");
                            self.components.skeletons[id].css("right", 10);
                            self.components.skeletons[id].css("top", 100);
                            break;

                        case "top-left":

                            self.components.skeletons[id].css("position", "fixed");
                            self.components.skeletons[id].css("left", 10);
                            self.components.skeletons[id].css("top", 100);
                            break;

                        case "bottom-left":

                            self.components.skeletons[id].css("position", "fixed");
                            self.components.skeletons[id].css("left", 10);
                            self.components.skeletons[id].css("bottom", 50);
                            break;

                        case "bottom-right":

                            self.components.skeletons[id].css("position", "fixed");
                            self.components.skeletons[id].css("right", 10);
                            self.components.skeletons[id].css("bottom", 50);
                            break;
                    }
                }
                // if an object is pass, let's pass the element to the .css()
                else if (self.components[n].position && typeof self.components[n].position === "object") {
                    self.components.skeletons[id].css("position", "fixed");
                    for (var css in self.components[n].position) {
                        self.components.skeletons[id].css(css, self.components[n].position[css]);
                    }

                }
                // if append is an object let's all its element to the Toast
                if (typeof self.components[n].append === "object") {
                    for (var elem in self.components[n].append) {
                        self.alertAppend(self.components.skeletons[id], self.components[n].append[elem]);
                    }

                }
                // if toast.data is an object lets use the key for the data- name and the value for the data value
                if (typeof self.components[n].data === "object") {
                    self.addData(self.components.skeletons[id], self.components[n].data);
                }

                // fire the callback function is a valid function is passed
                if (typeof callback === "function") {
                    callback(self.components.skeletons[id]);
                }

                //the out object is returned by this function
                out = new Array();
                // at index 0 the HTML node
                out.push(self.components.skeletons[id]);
                //all the function returned are generate by the partial, that means that the first
                // parameter is predefined, in this case the HTML is passed so the function will
                // alway affect the right node
                out.append = self.partial(self.alertAppend, self.components.skeletons[id]);
                out.timeOut = self.partial(self.alertTimeOut, self.components.skeletons[id]);
                return out;
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
                UserInterface.default[name] = $.extend({}, UserInterface.default[name], object);
            },
            // set the default object, it can be extended by the function extend
            default: {
                progressbar: {
                    striped: true,
                    active: true,
                    percentage: 100
                },
                alert: {
                    html: "",
                    level: "info",
                    dismissable: true
                },
                button: {
                    text: ""
                },
                toast: {
                    html: "",
                    level: "info",
                    time: 5000,
                    position: "top-right"
                }
            }
        };
        return {
            modal: UserInterface.modal,
            progressbar: UserInterface.progressbar,
            button: UserInterface.button,
            alert: UserInterface.alert,
            toast: UserInterface.toast,
            destroy: UserInterface.destroy,
            extend: UserInterface.extend
        };

    })(jQuery, window);
return UI;
});
