// require.js looks for the following global when initializing
var require = {
    baseUrl: ".",
    paths: {
        "bootstrap":            "bower_components/bootstrap/dist/js/bootstrap",
        "jquery":               "bower_components/jquery/dist/jquery",
        "holder":               "bower_components/holderjs/holder"
    },
    shim: {
        "bootstrap": { deps: ["jquery"] }
    }
};