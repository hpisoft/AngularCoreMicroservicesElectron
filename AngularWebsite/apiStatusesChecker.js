const http = require('http');

module.exports = function (launchedApis) {
    var self = this;

    var apiNames = Object.keys(launchedApis);
    var responsesCount = 0;
    var okResponsesCount = 0;

    var promiseResolve = null;
    var promiseReject = null;

    this.checkAllApisStatusOK = function () {
        return new Promise(function (resolve, reject) {
            promiseResolve = resolve;
            promiseReject = reject;

            apiNames.forEach(checkApiStatus);
        });
    }

    function checkApiStatus(apiName) {
        let requestUrl = `http://localhost:${launchedApis[apiName].port}/api/status`;

        http.get(requestUrl, handleResponse).on("error", handleRequestError);
    }

    function handleResponse(response) {
        if (response.statusCode !== 200) {
            responsesCount++;
            checkResponsesAndResolvePromise();
            return;
        }

        let responseData = "";

        response.on("data", function (chunk) { responseData += chunk });
        response.on("end", function () {
            responsesCount++;

            if (responseData === "OK")
                okResponsesCount++;

            checkResponsesAndResolvePromise();
        });
    }

    function handleRequestError(error) {
        responsesCount++;

        checkResponsesAndResolvePromise();
    }

    function checkResponsesAndResolvePromise() {
        if (responsesCount === apiNames.length) {
            if (responsesCount === okResponsesCount)
                promiseResolve();
            else
                promiseReject();
        }
    }
}
