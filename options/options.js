// Saves options to chrome.storage
function save_options() {
    const advancedCheckbox = document.getElementById("advanced");
    const locale = advancedCheckbox.checked ?
        document.getElementById("localeInput").value :
        document.getElementById("localeSelector").value;

    chrome.storage.sync.set({
        selectedLocale: locale
    }, () => {
        // Update status to let user know options were saved.
        const status = document.getElementById("status");
        status.textContent = "Options saved.";
        setTimeout(() => {
            status.textContent = "";
        }, 1000);
    });
}

// Toggle advanced options
function toggleAdvanced(e) {
    const selectItem = document.getElementById("localeSelector");
    const inputItem = document.getElementById("localeInput");
    if (e.target.checked) {
        selectItem.classList.add("invisible");
        inputItem.classList.remove("invisible");
        inputItem.value = selectItem.value;
    } else {
        selectItem.classList.remove("invisible");
        inputItem.classList.add("invisible");
        selectItem.value = inputItem.value;
    }
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = "red" and likesColor = true.
    chrome.storage.sync.get({
        selectedLocale: "nl-NL"
    }, (items) => {
        document.getElementById("localeSelector").value = items.selectedLocale;
        document.getElementById("localeInput").value = items.selectedLocale;
    });
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
document.getElementById("advanced").addEventListener("change", toggleAdvanced);