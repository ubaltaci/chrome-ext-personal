const AUTH_USER_PARAM = "authuser";

const filters = {
    url: [
        {
            hostSuffix: "google.com",
            pathContains: "maps"
        },
    ]
};

chrome.webNavigation.onCommitted.addListener((details) => {redirect(details)}, filters);

chrome.webNavigation.onBeforeNavigate.addListener((details) => {redirect(details)}, filters);


function redirect(details) {
    if (details.transitionType !== "link" &&
        details.transitionType !== "typed" &&
        details.transitionType !== "auto_bookmark" &&
        details.transitionType !== "generated" &&
        details.transitionType !== "generated"
    ) {
        return
    }
    const currentUrl = details.url;
    const redirectUrl = updateUrlParameter(currentUrl, AUTH_USER_PARAM, "1");

    if (currentUrl !== redirectUrl) {
        chrome.tabs.update(details.tabId, {
            url: redirectUrl,
        });
    }
}

// https://gist.github.com/niyazpk/f8ac616f181f6042d1e0
function updateUrlParameter(uri, key, value) {
    // remove the hash part before operating on the uri
    const i = uri.indexOf("#");
    const hash = i === -1 ? "" : uri.substr(i);
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
