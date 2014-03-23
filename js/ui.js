/*
* UI wrapper, usefull to create UI element without hardonding stuff
* 
* Public methods: modal, progressbar
*
* Usage: UI.progressbar(75); || UI.modal({title:"<h4>I'm a modal</h4>", body: "<p style='color:blue'>Hello Folks!</p>"})
*/


  var UI =  (function($) {
        var UserInterface = {
            // set the components to an empty object than we can store 
            // here our components
            components : {},
            /*
             * Modal
             * 
             * By calling this method and passing an object with the right properties
             * the process will create a new modal, insert the information passed, display it and 
             * bind the event to destroy that modal once is hided
             * 
             * Object properties:
             *     title:  html for the title, if no header is passed a palceholder will be inserted
             *     id: {optional} an optional id can be passed, if no id is provided a random id will be generated
             *     body: html for the body, if no body is passed a palceholder will be inserted
             *     footer: any type is allowed, but a jquery object for a button with custom callback is highly recomended
             *     callback: {optional} a callback function that will be executed once the modal is displayed
             * 
             */
            modal: function(data) {
                var self = UserInterface;
                if (typeof data === "object") {
                    self.components.modal = data;
                    self.createModal();
                }
            },
            createModal: function() {
                    var self = UserInterface;
                    self.components.modal.id = self.components.modal.id || self.randomId();
                self.components.modal.skeleton = {};
                    self.components.modal.skeleton.object = $("<div/>", {
                        class: "modal fade",
                        id: self.components.modal.id
                    }).append(
                            $("<div/>", {class: "modal-dialog"}).append(
                                $("<div/>", {class: "modal-content"}).append(
                                $("<div/>", {class: "modal-header"}).append(
                                    $("<button/>", {
                                        type: "button",
                                        class: "close",
                                        "data-dismiss": "modal",
                                        "aria-hidden": "true",
                                        html: "&times;",
                                    })
                                )
                                ).append(
                                    $("<div/>", {class: "modal-body"})
                                ).append(
                                $("<div/>", {class: "modal-footer"}).append(
                                    $("<button/>", {
                                        type: "button",
                                        class: "btn btn-default",
                                        "data-dismiss": "modal",
                                        text: "Close"
                                    })
                                    )
                                )
                            )
                            ).appendTo("body");
                self.components.modal.skeleton.title = function(html){
                    self.components.modal.skeleton.object.find(".modal-header").html(html);
                };
                
                self.components.modal.skeleton.titleAppend = function(html){
                    self.components.modal.skeleton.object.find(".modal-header").append(html);
                };
                
                self.components.modal.skeleton.body = function(html){
                    self.components.modal.skeleton.object.find(".modal-body").html(html);
                };
                
                self.components.modal.skeleton.bodyAppend = function(html){
                    self.components.modal.skeleton.object.find(".modal-body").append(html);
                };
                
                self.components.modal.skeleton.footer = function(html){
                    self.components.modal.skeleton.object.find(".modal-footer").html(html);
                };
                
                self.components.modal.skeleton.footerAppend = function(html){
                    self.components.modal.skeleton.object.find(".modal-footer").append(html);
                };
                
                self.components.modal.skeleton.title(self.components.modal.title);
                self.components.modal.skeleton.body(self.components.modal.body);
                self.components.modal.skeleton.footer(self.components.modal.footer);
                
                
                $("#"+self.components.modal.id).modal().on("hide.bs.modal", self.removeModal);
                if(typeof self.components.modal.callback === "function"){
                    self.components.modal.callback(
                        {
                            object: self.components.modal.skeleton.object,
                            title: self.components.modal.skeleton.title,
                            titleAppend: self.components.modal.skeleton.titleAppend,
                            body: self.components.modal.skeleton.body,
                            bodyAppend: self.components.modal.skeleton.bodyAppend,
                            footer: self.components.modal.skeleton.footer,
                            footerAppend: self.components.modal.skeleton.footerAppend
                        }
                    );
                }
            },
            removeModal: function(){
                var self = UserInterface;
                $(this).remove();
            },
            progressbar: function(percentage){
                return  $("<div/>", {class : "progress progress-striped active"}).append(
                    $("<div/>", {class : "progress-bar",
                                 style : "width: " + percentage + "%"
                                })
                )

            },
            randomId: function() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 5; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                return text;
            },
            log : function(){
                return UserInterface.components
            },
            wipeComponents: function(){
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