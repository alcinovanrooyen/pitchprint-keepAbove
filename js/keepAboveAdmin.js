(function(){
    checkApp = 50;
    tryAdmin();
    function tryAdmin() {
        if (!window.app) {
            if (checkApp) {
                setTimeout(tryAdmin, 500);
                checkApp--;
            }
            return;
        }
        if (!window.app.model.vals.isAdmin) return;
        appendKeepAboveToContexMenu();
        app.events.on('c-item-changed', checkIsKeepAbove);
    }

    function checkIsKeepAbove() {
        // if (!designer.model.runtime.design.page) return;
        const cItem = designer.model.runtime.page.cItem;
        if (!cItem) return;
        if (cItem.chain && cItem.chain.match('keepAbove')) 
            jQuery('#customKeepAbove').css('background-color', app.model.lib.config.currentTheme['color4']);
        else
            jQuery('#customKeepAbove').css('background-color', 'transparent ');
    }

    function appendKeepAboveToContexMenu() {
        if (!jQuery('[data-module="secondary-menus"]').length) {
            setTimeout(appendKeepAboveToContexMenu, 500);
            return;
        }
        const btn = '<button id="customKeepAbove"class="button" data-balloon="Keep Above" data-balloon-pos="down"><i class="icon-forward icon-x18"></i></button>';
        jQuery('[data-module="secondary-menus"]').append(btn);
        jQuery('#customKeepAbove').click(keepAbove);
    }

    function keepAbove() {
        const cItem = window.designer.model.runtime.page.cItem;
        if (!cItem) return;
        if (cItem.chain && cItem.chain.match('keepAbove')) {
            cItem.chain = cItem.chain.replace('keepAbove', '');
            checkIsKeepAbove();
            return;
        }
        window.designer.model.runtime.design.cPage.canvas._objects.forEach(_=> _.chain && (_.chain = _.chain.replace('keepAbove', '')));
        cItem.chain = 'keepAbove' ;
        checkIsKeepAbove();
        app.events.fire('depth-updated');
    }
})();