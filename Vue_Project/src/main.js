/* eslint-disable quote-props */


import "vuetify/styles"
import { createApp } from 'vue'

import vuetify from './plugins/vuetify'
import { x3DDashboardUtils } from './lib/widget'
import store from './store';
import App from './components/app';
import i18n from "./locale";



function init() {
    // Internalization
    

    x3DDashboardUtils.disableCSS(true);

    window.title = "ASCO Change Management Widget";
    widget.setTitle(window.title);
    window.i18n=i18n;
    window.appStore = store;
    store.dispatch("init").then(() => {
        const app = createApp(App)
        .use(i18n)
        .use(store)
        .use(vuetify)
        .mount('app');}
    );



    requirejs(["DS/PlatformAPI/PlatformAPI"], PlatformAPI => {
        window.PlatformAPI = PlatformAPI;
    });
}
/**
 * Entry point for both standalone & 3DDashboard modes
 * Assuming widget object has been loaded through widget-starter module
 */


function loadWindowFunction() {
    const pref = widget.getPreference("ListComponentIDs");
    if (typeof pref === "undefined") {
        widget.addPreference({
            name: "ListComponentIDs",
            type: "hidden",
            label: "ListComponentIDs",
            defaultValue: ""
        });
    }

    window.getPreferenceListComponentIDs = function() {
        let listStr = widget.getValue("ListComponentIDs");
        if (!listStr) listStr = "[]";
        return JSON.parse(listStr);
    };

    window.updatePreferenceListComponentIDs = function(newArray) {
        widget.setValue("ListComponentIDs", JSON.stringify(newArray));
    };
}

export default function() {
    widget.addEvent("onLoad", () => {
        loadWindowFunction();
        init();
    });

    widget.addEvent("onRefresh", () => {
        window.appStore.dispatch("init");
    });
}