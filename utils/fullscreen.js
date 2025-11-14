// ===== PATCHES =====

function patchPromises() {
    console.log("# patchPromises");

    const fakePromise = Promise.resolve();

    Element.prototype.requestFullscreen = function() {
        return fakePromise;
    };

    Document.prototype.requestFullscreen = function() {
        return fakePromise;
    };
}

function patchProperties() {
    console.log("# patchProperties");

    Object.defineProperty(document, "fullscreenElement", {
        get: () => document.documentElement
    });

    Object.defineProperty(document, "fullscreenEnabled", {
        get: () => true
    });
}


// ===== APPLICATION =====

patchPromises();
patchProperties();

const observer = new MutationObserver(patchProperties);
observer.observe(document.documentElement, { childList: true, subtree: true });

