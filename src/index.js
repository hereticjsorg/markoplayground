import template from "./index.marko";

(async () => {
    template.render({}).then(data => data.appendTo(document.getElementById("main")));
})();
