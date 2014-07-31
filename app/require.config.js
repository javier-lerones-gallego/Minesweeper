// require.js looks for the following global when initializing
var require = {
    baseUrl: ".",
    paths: {
        "bootstrap":            "bower_components/bootstrap/dist/js/bootstrap",
        "jquery":               "bower_components/jquery/dist/jquery"
    },
    shim: {
        "bootstrap": { deps: ["jquery"] }
    }
};