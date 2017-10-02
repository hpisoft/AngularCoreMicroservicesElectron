const { app, BrowserWindow, ipcMain } = require('electron');
const { execFile } = require('child_process');
const path = require('path');
const url = require('url');
const portfinder = require('portfinder');

require('dotenv').config();

let win = null;
let apis = [];
let launchedApis = {};

let apiProcessLoadingError = false;

app.on('ready', startup);
app.on('activate', recreateWindowAndApiIfEmpty);
app.on('window-all-closed', quitApplication);

function recreateWindowAndApiIfEmpty() {
    if (win === null)
        startup();
}

function quitApplication() {
    if (process.platform !== 'darwin')
        app.quit();
}

function startup() {
    createWindow();

    win.on('closed', cleanup);

    if (!isProductionEnvironment())
        showDevTools();

    if (apis.length === 0)
        getApis();

    if (apis.length > 0) {
        if (isLaunchedApisEmpty())
            startApisAndLoadContent();
    }
    else
        loadContent();
}

function createWindow() {
    let defaultWidth = parseInt(process.env.WINDOW_DEFAULT_WIDTH);
    let defaultHeight = parseInt(process.env.WINDOW_DEFAULT_HEIGHT);

    win = new BrowserWindow({
        width: defaultWidth,
        height: defaultHeight
    });
}

function isProductionEnvironment() {
    return process.env.PRODUCTION === "true";
}

function showDevTools() {
    win.webContents.openDevTools();
}

function getApis() {
    apis = JSON.parse(process.env.APIS);
}

function isLaunchedApisEmpty() {
    return launchedApis === null || Object.keys(launchedApis).length === 0;
}

function startApisAndLoadContent() {
    apis.forEach(function (api) {
        let freePortSuccessCallback = createStartApiAndLoadContentCallback(api);
        findFreePort(freePortSuccessCallback, loadErrorFindingFreePortPage);
    });
}

function createStartApiAndLoadContentCallback(api) {
    return function (port) {
        startApiAndLoadContent(api, port);
    }
}

function findFreePort(successCallback, errorCallback) {
    portfinder.getPortPromise()
        .then(successCallback)
        .catch(errorCallback);
}

function startApiAndLoadContent(api, port) {
    if (win === null)
        return;

    startApi(api, port);

    if (areAllApisStarted())
        loadContent();
}

function startApi(api, port) {
    let args = buildApiArguments(api.filePath, port);

    let apiProcess = execFile('dotnet', args, function (error, stdout, stderr) {
        if (error) {
            handleApiLoadingError(error);
            return;
        }
        console.log(`WebAPI stdout: ${stdout}`);
        console.log(`WebAPI stderr: ${stderr}`);
    });

    launchedApis[api.name] = { process: apiProcess, port: port };
}

function buildApiArguments(apiFilePath, port) {
    return [
        apiFilePath,
        `--server.urls=http://localhost:${port}`
    ];
}

function areAllApisStarted() {
    return apis.length === Object.keys(launchedApis).length;
}

function loadErrorFindingFreePortPage(error) {
    console.error(`portfinder error: ${error}`);
    loadWindowContentFromFile(process.env.APPLICATION_PORT_ERROR_FILE_PATH);
}

function handleApiLoadingError(error) {
    console.error(`WebAPI error: ${error}`);
    apiProcessLoadingError = true;
    loadWindowContentFromFile(process.env.APPLICATION_API_ERROR_FILE_PATH);
}

function loadContent() {
    if (apiProcessLoadingError)
        return;

    if (isProductionEnvironment())
        loadWindowContentFromFile(process.env.APPLICATION_FILE_PATH);
    else
        loadWindowContentFromHttpAddress(process.env.APPLICATION_URL);
}

function loadWindowContentFromFile(filePath) {
    win.loadURL(url.format({
        pathname: path.join(__dirname, filePath),
        protocol: 'file:',
        slashes: true
    }));
}

function loadWindowContentFromHttpAddress(url) {
    win.loadURL(url);
}

function cleanup() {
    if (!isLaunchedApisEmpty())
        tryKillApiProcesses();

    launchedApis = null;
    win = null;
}

function tryKillApiProcesses() {
    for (var api in launchedApis) {
        if (launchedApis.hasOwnProperty(api)) {
            try {
                launchedApis[api].process.kill();
            } catch (e) {
                console.error("Can't kill API process: " + e);
            }
        }
    };
}
