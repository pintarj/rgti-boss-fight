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

/**
 * The constructor for the AssetLoadedCounter class.
 * @param {number} target - The number of assets that has to be loaded.
 * @param {function} loadedCallback - Called when the counter reaches the specified target of loaded assets. This is
 *     not a required parameter.
 * */
function AssetLoadedCounter(target, loadedCallback)
{
    this.counter = 0;
    this.target = target;
    this.loadedCallback = loadedCallback || function () {};
}

/**
 * Increments the internal counter.
 * @return {undefined}
 * */
AssetLoadedCounter.prototype.increment = function () {
    ++this.counter;

    if (this.counter === this.target)
        this.loadedCallback();
};


/**
 * Tells if the counter has reached the target.
 * @return {boolean} true if the target were reached, false otherwise.
 * */
AssetLoadedCounter.prototype.isCompleted = function () {
    return this.counter === this.target;
};

/**
 * Count the assets to be loaded.
 * @type {AssetLoadedCounter}
 * */
var assetsLoading = new AssetLoadedCounter(3);
