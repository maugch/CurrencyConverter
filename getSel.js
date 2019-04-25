console.log('inject for seelctionChange.');
document.addEventListener('selectionchange', function () {
    var str = window.getSelection().toString().trim();
    if (str.match(/[a-z]/i)) {
        chrome.runtime.sendMessage({
            request: 'getSelection',
            content: str
        });
    }
});