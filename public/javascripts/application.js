YUI({ combine: true,
      modules: {
         "resource-spinner": {
             fullpath: "/javascripts/resource-spinner.js"
         }
      }
    }).use("widget", "resource-spinner", function(Y) {

    resourceSpinner = new Y.ResourceSpinner();

    resourceSpinner.render();
});
