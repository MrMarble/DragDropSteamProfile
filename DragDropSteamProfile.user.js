// ==UserScript==
// @name         Drag & Drop Steam profile sections
// @namespace    https://github.com/MrMarble/DragDropSteamProfile
// @version      0.4
// @description  Let the user change the layout of his profile
// @author       MrMarble
// @match        https://steamcommunity.com/id/*/edit
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
//@homepageUrl   https://github.com/MrMarble/DragDropSteamProfile
//@updateURL     https://raw.githubusercontent.com/MrMarble/DragDropSteamProfile/master/DragDropSteamProfile.user.js
//@downloadURL   https://raw.githubusercontent.com/MrMarble/DragDropSteamProfile/master/DragDropSteamProfile.user.js
// ==/UserScript==

(function () {
    'use strict';

    let isModified = false;
    $.noConflict();
    addStyles();
    createDragger();
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
        GM_addStyle(`
			.profile-dragger {
				position: absolute;
				width: 15px;
				height: 15px;
				left: -50px;
				background-color: #2f4058;
				padding: 5px;
				border-radius: 3px;
				text-align: center;
				margin-top: 10px;
			}`);
        GM_addStyle('.profile-dragger svg{height: 15px}');
        GM_addStyle('.profile-dragger:hover{cursor:move}');
        GM_addStyle('#DragDropSteam:hover{cursor:pointer}');
    }

    function createDragger() {
        jQuery('.profile_showcase_selector').prepend('<div class="profile-dragger"><svg viewBox="0 0 256 512"><path fill="currentColor" d="M227.03 388.97H156V123.03h71.03c10.691 0 16.045-12.926 8.485-20.485l-99.029-99.03c-4.686-4.686-12.284-4.686-16.971 0l-99.029 99.03c-7.56 7.56-2.206 20.485 8.485 20.485H100v265.94H28.97c-10.691 0-16.045 12.926-8.485 20.485l99.029 99.03c4.686 4.686 12.284 4.686 16.971 0l99.029-99.03c7.56-7.559 2.206-20.485-8.484-20.485z"></path></svg></div>');
    }
    function dragDropEvent(element = null) {
        let selector = element || '.profile_showcase_selector';
        jQuery(selector).draggable({
            revert: "invalid",
            revertDuration: 200,
            helper: "clone",
            opacity: .8,
            handle: ".profile-dragger",
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
        if (!isModified || jQuery('#DragDropSteam').length >= 1) return;
        let $reminder = jQuery('<div id="DragDropSteam">There are unsaved changes!</div>');
        $reminder.on('click', function () {
            jQuery(this).remove();
        });
        jQuery('body').append($reminder);
    }
})();
