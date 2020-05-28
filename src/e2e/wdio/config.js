var isWinOS = (process.platform == 'win32');
var launch_target = isWinOS ? 'RunOpenFin.bat' : './RunOpenFin.sh';
var launch_config = isWinOS ? 'http://localhost/openfin/app.json' : './test/app.json';
var remoteDriverHost = "localhost";
var remoteDriverPort = 9515;
var remoteDriverUrl = "http://" + remoteDriverHost + ":" + remoteDriverPort;

const config = {

    runner: 'local',
    loglevel: 'trace',
    specs: [
        './rt_openfin.spec.js'
    ],
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    framework: 'jasmine',
    reporters: ['spec'],
    jasmineNodeOpts: {
        isVerbose: true,
        realtimeFailure: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 300000,
        print: () => {}
    },
    capabilities: [{
        browserName: 'chrome',
        chromeOptions: {
            extensions: [],
            binary: launch_target,
            args: ['--config=' + launch_config],
            // if devtools_port is set in app.json and ChromeDriver needs to communicate on that port,  set the following propery
            // to be the same as devtools_port
            //debuggerAddress: 'localhost:9090'
        }
    }],
    expectedRuntimeVersion: "10.66.41.18",
    remoteDriverHost: remoteDriverHost,
    remoteDriverPort: remoteDriverPort,
    remoteDriverUrl: remoteDriverUrl
}

module.exports.config = config