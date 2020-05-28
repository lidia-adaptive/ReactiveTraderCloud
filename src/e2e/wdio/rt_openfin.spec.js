"use strict";

var webdriver = require('webdriverio'),
    config = require("./config").config,
    spawn = require('child_process').spawn;


describe('Hello OpenFin App testing with webdriver.io', function() {
    var client;

    this.timeout(config.waitforTimeout);

    before(function() {
        if (config.capabilities.chromeOptions.debuggerAddress) {
            // if debuggerAddress is set,  ChromeDriver does NOT start "binary" and assumes it is already running,
            // it needs to start separately
            spawn(config.capabilities.chromeOptions.binary, config.capabilities.chromeOptions.args);
        }

        // configure webdriver
        var driverOptions = {
            capabilities: config.capabilities,
            host: config.remoteDriverHost,
            port: config.remoteDriverPort,
            waitforTimeout: config.waitforTimeout,
            logLevel: 'verbose'  // http://webdriver.io/guide/getstarted/configuration.html
        };
        client = webdriver.remote(driverOptions);

        if (!config.remoteDriverPath) {
            client.requestHandler.startPath = "";  // webdriverio defaults it to '/wd/hub';
        }
        client.init();
    });

    after(function() {
        return client.end();
    });

    function startClient(){
        if (config.capabilities.chromeOptions.debuggerAddress) {
            // if debuggerAddress is set,  ChromeDriver does NOT start "binary" and assumes it is already running,
            // it needs to start separately
            spawn(config.capabilities.chromeOptions.binary, config.capabilities.chromeOptions.args);
        }

        // configure webdriver
        var driverOptions = {
            capabilities: config.capabilities,
            host: config.remoteDriverHost,
            port: config.remoteDriverPort,
            waitforTimeout: config.waitforTimeout,
            logLevel: 'verbose'  // http://webdriver.io/guide/getstarted/configuration.html
        };
        client = webdriver.remote(driverOptions);

        if (!config.remoteDriverPath) {
            client.requestHandler.startPath = "";  // webdriverio defaults it to '/wd/hub';
        }
        client.init();
    }


    /**
     * Select a Window
     * @param windowHandle handle of the window
     * @param callback callback with window title if selection is successful
     */
    function switchWindow(windowHandle, callback) {
        client.switchTab(windowHandle).then(function () {
            client.getTitle().then(function (title) {
                callback(title);
            });
        });
    }

    /**
     * Select the window with specified title
     * @param windowTitle window title
     * @param done done callback for Mocha
     */
    function switchWindowByTitle(windowTitle, done) {
        client.getTabIds().then(function (tabIds) {
            var handleIndex = 0;
            var checkTitle = function (title) {
                if (title === windowTitle) {
                    done();
                } else {
                    handleIndex++;
                    if (handleIndex < tabIds.length) {
                        switchWindow(tabIds[handleIndex], checkTitle);
                    } else {
                        // the window may not be loaded yet, so call itself again
                        switchWindowByTitle(windowTitle, done);
                    }
                }
            };
            switchWindow(tabIds[handleIndex], checkTitle);
        });
    }

    it('Switch to RT OpenFin Main window', function() {
        startClient();
        expect(client).exist;
    });
});
