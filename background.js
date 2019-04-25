function mycheck(text,currencylist) {
    for (curr in currencylist) {
        if (text.startsWith(curr)|| text.endsWith(curr)) {
            return true
        }
    }
    return false
}

function convertValue(text) {
    text = text.trim();
    var nochar = text.replace(/\D/g, '');
    var fvalue = parseFloat(nochar);
    var textlist = text.split(' ');
    if (textlist.length >= 2 && ( textlist[0].endsWith('k') || textlist[0].endsWith('K'))) {
        fvalue = fvalue*1000;
    }
    var rate = '';
    if (mycheck(text,['EUR'])) {
        rate = rates['rates']['EUR']
        rate = parseFloat(rate);
    } else if (mycheck(text,['AUD$','AUD'])) {
        rate = rates['rates']['AUD']
        rate = parseFloat(rate);
    } else if (mycheck(text,['NZD'])) {
        rate = rates['rates']['NZD']
        rate = parseFloat(rate);
    }
    if (rate != '') {
        return text + ' = ' + Math.round(fvalue / rate,2) + ' USD'+fvalue;
    }
    return text + ' unknown'; 
}

// "activeTab" permission is sufficient for this:
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    chrome.tabs.executeScript(tab.id, { file: "getSel.js" })
});


// ID to manage the context menu entry
var cmid;
/*  
// The onClicked callback function.
function onClickHandler(info, tab) {
    var sText = info.selectionText;
    var url = "https://www.google.com/search?q=" + encodeURIComponent(sText);
    window.open(url, '_blank');
};
*/

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.request === 'getSelection') {
        var selText = msg.content;
        if (selText == '') {
            // Remove the context menu entry
            if (cmid != null) {
                chrome.contextMenus.remove(cmid);
                cmid = null; // Invalidate entry now to avoid race conditions
            } // else: No contextmenu ID, so nothing to remove
        } else { // Add/update context menu entry
            var options = {
                title: convertValue(selText),
                contexts: ['selection']
            };
            var createOptions = {
                id:'currencyConverter2019',
                title: convertValue(selText),
                contexts: ['selection']
            };
            if (cmid != null) {
                chrome.contextMenus.update(cmid, options);
            } else {
                // Create new menu, and remember the ID
                cmid = chrome.contextMenus.create(createOptions);
                //chrome.contextMenus.onClicked.addListener(onClickHandler);
            }
        }
    }
});

var rates = ''
$.ajax({
    url: 'https://api.exchangeratesapi.io/latest?base=USD',

    type: "GET",
    dataType: 'json',
    crossDomain: true,
    success: function (data) {
        console.log(JSON.stringify(data));
        rates = data;
    },
    error: function (data, errorThrown) {
        console.log(errorThrown);
    }
});