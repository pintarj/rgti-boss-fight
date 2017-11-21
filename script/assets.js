"use strict";

/**
 * Asynchronously loads an asset (from ./asset/ folder) specified by a sub-URI name.
 * @param {string} name - The asset sub-URI.
 * @param {function} successCallback - Called when the asset is loaded (convent in first parameter).
 * @param {function} errorCallback - Called on error (status text in first parameter. This parameter is not required
 *     and if it's not given, the error status will be logged in the console.
 * @return {undefined}
 * */
function loadAsset(name, successCallback, errorCallback) {

    if (errorCallback === undefined) {
        errorCallback = function (statusText) {
            console.error(statusText);
        }
    }

    var request = new XMLHttpRequest();
    request.open('GET', './asset/' + name);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                successCallback(request.responseText);
            } else {
                errorCallback('./asset/' + name + ' ' + request.statusText);
            }
        }
    };

    request.send();
}
