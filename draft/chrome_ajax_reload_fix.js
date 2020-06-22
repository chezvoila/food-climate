/*
 * NEXT FUNCTION FIXES CHROME ERRATIC SCROLL IN AJAX RELOAD.
 * Using sessionStorage will only affect to current tab.
 */
var currentPageY,
    varPageY = 'page_y';
try {
    // Scroll on AJAX reload.
    currentPageY = sessionStorage.getItem(varPageY);
    if (typeof currentPageY === 'undefined') {
        sessionStorage.setItem(varPageY, 0);
    }
    if (currentPageY !== null) {
        window.scrollTo( 0, currentPageY );
    }
} catch (e) {
    // if no sessionStorage available, do nothing.
}
function storePagePosition() {
    clearTimeout($.data(this, 'badAjaxScrollTimer'));
    $.data(this, 'badAjaxScrollTimer', setTimeout(function () {
        // Store current position.
        if (typeof sessionStorage === 'object') {
            sessionStorage.setItem(varPageY, window.pageYOffset);
        }
    }, 100));
}
function removePagePosition() {
    if (typeof sessionStorage === 'object') {
        sessionStorage.removeItem(varPageY);
    }
}
window.addEventListener('scroll', storePagePosition);
window.onload = function() {removePagePosition();};
window.onbeforeunload = function() {removePagePosition();};
/* END AJAX SCROLL */