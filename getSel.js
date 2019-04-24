console.log('inject for seelctionChange.');
document.addEventListener('selectionchange', function() {
    chrome.runtime.sendMessage({
        request: 'getSelection',
        content: window.getSelection().toString().trim()
    });
});