const dateRegex = / (?<month>\d{1,2})\/(?<day>\d{1,2})\/(?<year>\d{4})$/;

const bodyElement = document.body;
const config = { childList: true, subtree: true };

let activeLocale = undefined;

// Update active locale
chrome.storage.sync.get({ selectedLocale: "nl-NL" }, ({ selectedLocale }) => {
    activeLocale = selectedLocale;
});

// Callback on MutationObserver
const callback = (mutationsList) => {
    // Wait until activeLocale is defined
    if (activeLocale === undefined) {
        setTimeout(() => {
            callback(mutationsList);
        }, 100);
        return;
    }

    // Process mutations
    for (const mutation of mutationsList) {
        recurseThroughNodeList(mutation.addedNodes);
    }
}

function recurseThroughNodeList(nodeList) {
    for (const node of nodeList) {
        // Check if a mutation contains a date
        if (node.nodeType === Node.TEXT_NODE && node.parentNode && node.parentNode.classList.contains("deadline")) {
            const dateString = node.textContent;
            const dateMatch = dateString.match(dateRegex);

            // If so, convert it to the active locale
            if (dateMatch) {
                const { year, month, day } = dateMatch.groups;
                const date = new Date(year, month - 1, day);

                const dateString = date.toLocaleDateString(activeLocale, {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                });
                node.textContent = dateString;
            }
        } else if (node.nodeType == Node.ELEMENT_NODE) {
            // If not, recurse through the children
            recurseThroughNodeList(node.childNodes);
        }
    }
}

// Register callback on the body element
const observer = new MutationObserver(callback);
observer.observe(bodyElement, config);