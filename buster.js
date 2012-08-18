var config = module.exports;

config["bj"] = {
    rootPath: "./",
    environment: "browser",
    libs: [
    	"lib/underscore.js"
    ],
    sources: [
    	"src/*.js"
    ],
    tests: [
        "test/*test.js"
    ],
    resources: [
    	"bj.html"
    ]
}
