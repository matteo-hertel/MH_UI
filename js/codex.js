/* 
 * Codex object for the documentation
 */
(function($) {
    var Codex = {
        fire: function(config) {
            this.config = config;
            this.renderUI();
            setTimeout(this.bindEvents, 1500);

        },
        bindEvents: function() {
            var self = Codex;

            self.config.item.on("click", self.scrollIntoView);
            self.config.modal_render.on("click", function() {
                self.componentRender("modal")
            });
            self.config.progressbar_render.on("click", function() {
                self.componentRender("progressbar")
            });
            self.config.button_render.on("click", function() {
                self.componentRender("button")
            });
            self.config.alert_render.on("click", function() {
                self.componentRender("alert")
            });
            self.config.toast_render.on("click", function() {
                self.componentRender("toast")
            });
            self.config.extra_render.on("click", function() {
                self.componentRender("extra")
            });
            self.config.extra2_render.on("click", function() {
                self.componentRender("extra2")
            });
            self.config.styler.on('click', self.styleSwitcher);
        },
        renderUI: function() {
            var self = Codex;
            self.config.render.each(function(k, v) {
                var html = $(v).html();
                $(v).removeClass("hide").html(eval(html));
            });

            self.config.modal_render = $("#modal_render");
            self.config.progressbar_render = $("#progressbar_render");
            self.config.button_render = $("#button_render");
            self.config.alert_render = $("#alert_render");
            self.config.toast_render = $("#toast_render");
            self.config.extra_render = $("#extra_render");
            self.config.extra2_render = $("#extra2_render");
        },
        styleSwitcher: function() {
            var self = Codex;
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
                    append($("<option/>", {value: "cyborg_bootstrap", text: "Cyborg Bootstrap"})).
                    append($("<option/>", {value: "cerulean_bootstrap", text: "Cerulean Bootstrap"})).
                    append($("<option/>", {value: "amelia_bootstrap", text: "Amelia Bootstrap"})).
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
        },
        scrollIntoView: function(e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $($(e.target).attr("href")).offset().top + 'px'
            }, 'medium');


        },
        componentRender: function(name) {
            result = $("#" + name + "_result");

            if (result) {
                result.children().remove();
            }
            eval($("#" + name + "_code").val());
        }
    };

    Codex.fire({
        item: $(".doc_item"),
        render: $(".UI_render"),
        styler: $("#styleswitcher")
    });


}(jQuery));

