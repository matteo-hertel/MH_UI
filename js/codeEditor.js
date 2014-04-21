/* 
 * CodeEditor for Demo
 */

(function($) {
    var CodeEditor = {
        fire: function(config) {
            this.config = config;
            this.bindEvents();

        },
        bindEvents: function() {
            var self = CodeEditor;
            self.config.writer.on('click', self.toggleWriter);
            self.config.run.on('click', self.runCode);
            self.config.styler.on('click', self.styleSwitcher);
        },
        toggleWriter: function(e) {
            e.preventDefault();
            var self = CodeEditor;
            self.resetDefault();

            if (self.config.wrapper.is(":visible")) {
                $(this).text("Write your code");
                self.config.wrapper.fadeOut(400);
                self.config.editor.hide();
                self.config.run.hide();
            } else {
                $(this).text("Hide editor");
                self.config.wrapper.fadeIn(400);
                self.config.editor.show();
                self.config.run.show();
            }
        },
        runCode: function(e) {
            e.preventDefault();
            var self = CodeEditor;
            self.resetDefault();
            var content = self.config.editor.val();
            if (!content) {
                self.config.error.html("<h3>Please insert your code</h3>").show();
                return false;
            }
            content.replace(/^\s*\n/gm);
            if (!content.match(/^["UI."]+[a-z]*\((.)*\)/gi)) {
                self.config.error.html("<h3>You can test only the UI components</h3>").show();
                return false;
            }
            try {
                var execute = eval(content);
                self.config.result.append(execute).fadeIn(400);
            }
            catch (error) {
                self.config.error.html("<h3>An error occurred</h3><br />" + error).show();
            }

        },
        resetDefault: function() {
            var self = CodeEditor;
            self.config.result.html("").hide();
            self.config.error.html("").hide();
        },
        styleSwitcher: function() {
            var self = CodeEditor;
            var modal = UI.modal({title: "Style switcher"});

            var content = $("<select/>").on("change", function() {
                modal.hide();
                $("body").append(UI.toast("Style changed successfully"));
                self.changeStyle(this);
            }).
                    append($("<option/>", {value: "", text: "Select one"})).
                    append($("<option/>", {value: "bootstrap", text: "Default Bootstrap"})).
                    append($("<option/>", {value: "flat_bootstrap", text: "Flat Bootstrap"})).
                    append($("<option/>", {value: "readable_bootstrap", text: "Readable Bootstrap"})).
                    append($("<option/>", {value: "cerulean_bootstrap", text: "Cerulean Bootstrap"})).
                    append($("<option/>", {value: "slate_bootstrap", text: "Slate Bootstrap"})).
                    append($("<option/>", {value: "yeti_bootstrap", text: "Yeti Bootstrap"}));
            modal.bodyAppend(content);
        },
        changeStyle: function(e) {
            var value = $(e).val();
            if (value) {
                $(".styleswitcher").remove();
                $("head").append($("<link/>", {href: "css/" + value + ".min.css", rel: "stylesheet"}));
            }
        }
    };

    CodeEditor.fire({
        wrapper: $('#code_wrapper'),
        writer: $('#code_writer'),
        editor: $('#code_editor'),
        run: $('#code_run'),
        result: $('#code_result'),
        error: $('#code_error'),
        styler: $("#styleswitcher")
    });

    var UIElements = {
        fire: function(config) {
            this.config = config;
            this.bindEvents();

        },
        bindEvents: function() {
            var self = UIElements;
            self.config.launch.on('click', self.toggleComponents);
        },
        toggleComponents: function(e) {
            e.preventDefault();
            var self = UIElements;

            if (self.config.components.is(":visible")) {
                self.config.components.children(".container").children().not("h1").remove();
                self.config.components.slideUp(400);
            } else {
                self.config.components.slideDown(400);
                self.startComponents();
            }

        },
        startComponents: function() {
            var self = UIElements;
            self.config.container = self.config.components.children(".container");
            self.progressbar();
            self.buttons();
            self.alerts();
            self.toasts();
            self.destroy();
        },
        progressbar: function() {
            var self = UIElements;
            self.config.container.append($("<h2/>", {text: "Progressbar", style: "cursor: pointer;"}).on("click", function() {
                UI.modal({title: "<h4>Source Code</h4>", body: '<pre>var div = $("#target_div");<br />var progressbar = UI.progressbar({level:"success",<br /> striped: true,<br /> active:true,<br /> percentage:0<br />});<br /><br />div.append(progressbar.object);<br /><br />div.append(<br />$("&lt;div/&gt;",{id:"progress_bar_slider"}));<br /><br />$("#progress_bar_slider").slider({range:"max",<br />min:0,<br />max:100,<br />value:0,<br />slide:function(event,ui){<br />progressbar.animate({time:5,percentage:ui.value})<br />}});</pre>'})
            }));
            self.config.container.append($("<p/>", {text: "An empty progressbar is created, you can adjust the width with the slider"}));
            var progressbar = UI.progressbar({striped: true, active: true, percentage: 0});
            self.config.container.append(progressbar);
            self.config.container.append($("<div/>", {id: "progress_bar_slider"}));

            $("#progress_bar_slider").slider({
                range: "max",
                min: 0,
                max: 100,
                value: 0,
                slide: function(event, ui) {
                    progressbar.animate({time: 1, percentage: ui.value});
                }
            });
        },
        buttons: function() {
            var self = UIElements;
            self.config.container.append($("<h2/>", {text: "Buttons/Modals"}));
            self.config.container.append($("<p/>", {text: "A couple of example button, click for an action double click to open a modal with the code"}));
            var button1 = UI.button({level: "success", size: "lg", text: "Button number 1", actions: {
                    click: function() {
                        $(this).addClass("btn-warning");
                    },
                    dblclick: function() {
                        UI.modal({title: "<h4>Source Code</h4>", body: '<pre>var button1=UI.button({level:"success",<br />size:"lg",<br />text:"Button number 1",<br />actions:{click:function(){<br />$(this).addClass("btn-warning")}<br />},<br />dblclick:function(){<br />}}<br />});</pre>'});
                    }
                }});
            var button2 = UI.button({level: "danger", text: "Button number 2", class: "pull-right", actions: {
                    click: function() {
                        button2.changeText({text: "Danger!", id: button2.id});
                    },
                    dblclick: function() {
                        UI.modal({title: "<h4>Source Code</h4>", body: '<pre>var button2=UI.button({level:"danger",<br /><br />text:"Button number 2",<br />actions:{<br />click:function(){<br />button2.changeText({text:"Danger!", id: button2.id})<br />},<br />dblclick:function(){<br />}<br />}});</pre>'});
                    }
                }});
            self.config.container.append(button1);
            self.config.container.append(button2);
        },
        alerts: function() {
            var self = UIElements;
            self.config.container.append($("<h2/>", {text: "Alert"}));
            self.config.container.append($("<p/>", {text: "Two alerts, one dismissable the other one is not"}));
            self.config.container.append(UI.alert({
                level: "warning",
                dismissable: false,
                html: "<h4>Hello</h4><p>Thank you to visit the MH_UI page"
            }
            ).append("<br /> This text was append chaining the append method, awesome!"));
            self.config.container.append(UI.alert("<h4>Awesome</h4><p>I'm one-line of code alert"));
        },
        toasts: function() {
            var self = UIElements;
            self.config.container.append($("<h2/>", {text: "Toast"}));
            self.config.container.append($("<p/>", {text: "Some toast examples, click on the button to open the toast"}));
            var toast1 = UI.button("bottom-left Toast");
            var toast2 = UI.button("top-right Toast");

            self.config.container.append(toast1);
            self.config.container.append(toast2);

            toast1.addActions({
                click: function() {
                    $("body").append(
                            UI.toast({
                                level: "danger",
                                position: "bottom-left",
                                html: "<h4>Hi</h4><p>I'm a toast, I will not disappear until you click on me :D</p>"
                            }));
                }
            });
            UI.extend("toast", {level: "success"});
            toast2.addActions({click: function() {
                    $("body").append(
                            UI.toast("<h4>Whoa!</h4><p>one-line code toast</p>"));
                }});
            UI.extend("toast", {level: "info"});
        },
        destroy: function() {
            var self = UIElements;
            self.config.container.append($("<h2/>", {text: "Destroy"}));
            self.config.container.append($("<p/>", {text: "One call to UI.destroy() and every component will be removed"}));

            var confirm_button = UI.button({level: "danger", text: "Remove all the UI component?"});
            confirm_button.addActions({click: function() {
                    confirm_button.changeText("Waiting for confirmation");
                    var modal = UI.modal({title: "Destroy everything", body: "Are you sure that you want to destroy every UI element? they're awesome", defaultFooter: "false"});
                    var button_close = UI.button("close").addActions({click: function() {
                            modal.hide();
                            confirm_button.changeText("Remove all the UI component?");
                        }});
                    var destroy_button = UI.button({level: "danger", text: "Yes, delete everything"}).addActions({click: function() {
                            var progressbar = UI.progressbar(100);
                            modal.bodyAppend(progressbar);
                            progressbar.animate({time: 100, percentage: 100, callback: function() {

                                    modal.hide();

                                    setTimeout(function() {
                                        UI.destroy();
                                        $("body").append(UI.toast("Successfully removed all the components"));
                                    }, 1000);

                                }});
                        }});
                    modal.footer(button_close);
                    modal.footer(destroy_button);
                }});

            self.config.container.append(confirm_button);
        }
    };

    UIElements.fire({
        components: $('#components'),
        launch: $('#launch')
    });



}(jQuery));


