const AUTH_USER_PARAM = "authuser";

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        const currentUrl = details.url;
        const redirectUrl = updateUrlParameter(currentUrl, AUTH_USER_PARAM, "1");

        if (currentUrl !== redirectUrl) {
            return {
                redirectUrl: redirectUrl
            };
        }
    },
    {
        urls: [
            "*://*.google.com/maps"
        ],
        types: ["main_frame"]
    },
    ["blocking"]);

// https://gist.github.com/niyazpk/f8ac616f181f6042d1e0
function updateUrlParameter(uri, key, value) {
    // remove the hash part before operating on the uri
    const i = uri.indexOf("#");
    const hash = i === -1 ? ""  : uri.substr(i);
    uri = i === -1 ? uri : uri.substr(0, i);

    const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    const separator = uri.indexOf("?") !== -1 ? "&" : "?";
    if (uri.match(re)) {
        uri = uri.replace(re, "$1" + key + "=" + value + "$2");
    } else {
        uri = uri + separator + key + "=" + value;
    }
    return uri + hash;  // finally append the hash as well
}
