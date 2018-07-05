// ==UserScript==
// @name         Drag & Drop Steam profile sections
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Let the user change the layout of his profile
// @author       MrMarble
// @match        https://steamcommunity.com/id/*/edit
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js

// ==/UserScript==

(function () {
    'use strict';

    let isModified = false;
    $.noConflict();
    addStyles();
    dragDropEvent();

    function addStyles() {
        GM_addStyle(`
            #DragDropSteam {
                position: fixed;
                background-color: rgba(255, 0, 0, 0.22);
                bottom: 20px; 
                z-index: 100;
                left: 20px;
                padding: 10px;
                border-radius: 3px;
                border: 1px solid rgba(255, 0, 0, 0.5);
                color: rgb(255, 255, 255);
                cursor: auto;
            }`);
        GM_addStyle('.profile_customization_header:hover{cursor:move}');
        GM_addStyle('#DragDropSteam:hover{cursor:pointer}');
    }

    function dragDropEvent(element = null) {
        let selector = element || '.profile_showcase_selector';
        jQuery(selector).draggable({
            revert: "invalid",
            revertDuration: 200,
            helper: "clone",
            opacity: .8,
            handle: ".profile_customization_header",
            cursor: "move"
        }).droppable({
            drop: function (event, ui) {
                var $dragElem = jQuery(ui.draggable).clone().replaceAll(this);
                jQuery(this).replaceAll(ui.draggable);
                jQuery(this).css('box-shadow', 'none');
                dragDropEvent(this);
                dragDropEvent($dragElem);
                isModified = true;
                showReminder();
            },
            over: function (event, ui) {
                jQuery(this).css('box-shadow', '0 0 5px 5px white');
            },
            out: function (event, ui) {
                jQuery(this).css('box-shadow', 'none');
            }
        });
    };

    function showReminder() {
        if (!isModified || jQuery('#DragDropSteam').lenght > 1) return;
        let $reminder = jQuery('<div id="DragDropSteam">There are unsaved changes!</div>');
        $reminder.on('click', function () {
            jQuery(this).remove();
        });
        jQuery('body').append($reminder);
    }
})();
