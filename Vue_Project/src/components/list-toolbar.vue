<template>
    <div id="ElecListToolbarContainer">
        <div v-if="showToolbar" id="ElecListToolbar">
            <v-sheet
                max-width="500"
            >
                <v-slide-group
                    multiple
                    show-arrows
                    class="ElecListToolbar1"
                >
                    <v-slide-group-item>
                        <v-btn icon :disabled="selectedObjects.length === 0" @click="removeRows()">
                            <v-icon size="35px" color="#3b7391" :title="$t('Remove Selected Documents', {usage: getContextUsage()})">mdi-close</v-icon>
                        </v-btn>
                    </v-slide-group-item>
                    <v-slide-group-item>
                        <div class="separationBar"></div>
                    </v-slide-group-item>
                    <v-slide-group-item>
                        <v-btn icon :disabled="selectedObjects.length === 0" :class="[(selectedObjects.length === 0) ? 'hideProperties' : '']" @click="openProperties()">
                            <img :src="`${widgetBaseURL}/static/images/I_CATSSEditorDisplayProperties.png`" :title="$t('Open Properties Widget')" style="width: 35px; height: 35px; " />
                        </v-btn>
                    </v-slide-group-item>
                    <v-slide-group-item>
                        <div class="separationBar"></div>
                    </v-slide-group-item>
                    <v-slide-group-item>
                        <v-btn icon :disabled="!isUsageSelected" color="#3b7391" @click="publishSelectedToPRIM()">
                            <v-icon large :title="$t('Publish to PRIM')">mdi-keyboard-tab</v-icon>
                        </v-btn>
                    </v-slide-group-item>
                </v-slide-group>
            </v-sheet>
        </div>
        <div style="pointer-events: all"><v-icon v-if="showToolbar" large :title="$t('Hide Toolbar')" @click="showToolbar=!showToolbar">mdi-chevron-down</v-icon><v-icon v-if="!showToolbar" large :title="$t('Show Toolbar')" @click="showToolbar=!showToolbar">mdi-chevron-up</v-icon></div>
    </div>
</template>

<style>
#ElecListToolbarContainer {
    position: fixed;
    bottom: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    pointer-events: none;
}
#ElecListToolbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 10px;
    left: 25%;
    background-color: #e2e4e3;
    z-index: 4;
    border-radius: 2px 2px 0 0;
    box-shadow: 0 0 4px rgba(61, 61, 61, 0.5);
    border-top: 1px solid #b4b6ba;
    border-left: 1px solid #b4b6ba;
    border-right: 1px solid #b4b6ba;
    pointer-events: all;
}
.ElecListToolbar1 {
    background-color: #e2e4e3;
}
.separationBar {
    display: inline-block;
    background-color: #bdbdbd;
    width: 2px;
    height: 30px;
    margin-left: 10px;
    margin-right: 10px;
    border-right: 1px solid white;
}
.hideProperties {
    -moz-filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
    opacity: .5;
    opacity: .4;
}
</style>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
    data: function() {
        return {
            showToolbar: true
        };
    },
    computed: {
        ...mapState(["componentTable", "usageCategoryStatus", "widgetBaseURL"]),
        ...mapGetters(["getRootByID"]),
        selectedObjects: function() {
            const list = [];
            for (const row of this.componentTable.rows[this.getContextUsage()]) {
                if (row.selected) list.push(row);
            }
            return list;
        },
        isUsageSelected: function() {
            let usageSelected = false;
            for (const usage in this.usageCategoryStatus) {
                if (this.usageCategoryStatus[usage].chboxSelected) usageSelected = true;
            }
            return usageSelected;
        }
    },
    methods: {
        ...mapActions(["publishDocumentsToPRIM", "removeDocumentFromUsageArea", "displayAlert"]),
        getContextUsage: function() {
            if (this.usageCategoryStatus.Main.active) {
                return "Main";
            } else if (this.usageCategoryStatus.Internal.active) {
                    return "Internal";
            } else {
                return "Special";
            }
        },
        removeRows: function() {
            this.removeDocumentFromUsageArea({ selectedRows: this.selectedObjects, usageArea: this.getContextUsage() });
        },
        publishSelectedToPRIM: function() {
            const usages = [];
            for (const usage in this.usageCategoryStatus) {
                if (this.usageCategoryStatus[usage].chboxSelected) usages.push(usage);
            }
            if (usages.length > 1) {
                this.displayAlert({ type: "warning", text: this.$i18n.t("Usage Area with Multi Select Not Allowed") });
            } else {
                this.publishDocumentsToPRIM(usages);
            }
        },
        openProperties() {
            let selectedData = {};
            const securityContextPref = widget.getPreference("__platformSecurityContext");
            if (this.selectedObjects.length === 1) {
                const item = this.selectedObjects[0];
                selectedData = {
                    SelectedItem: [
                        {
                            metatype: "businessobject",
                            objectId: item.physicalId,
                            tenant: "OnPremise",
                            source: "3DSpace"
                        }
                    ],
                    x3dPlatformId: "OnPremise",
                    isTransient: "true",
                    loadData: true,
                    asynchronousRequest: true,
                    securityContext: securityContextPref.value
                };
                window.PlatformAPI.publish("ShowWidget", {
                    appId: "ENOLCMT_AP",
                    title: "",
                    data: selectedData,
                    options: { mode: "panel" }
                });
            } else if (this.selectedObjects.length > 1) {
                this.displayAlert({ type: "warning", text: this.$i18n.t("Properties Widget for Multi Select Not Allowed") });
            } else {
                selectedData = {
                    SelectedItem: [],
                    x3dPlatformId: "OnPremise",
                    isTransient: "true",
                    loadData: true,
                    asynchronousRequest: true,
                    securityContext: securityContextPref.value
                };
                window.PlatformAPI.publish("ShowWidget", {
                    appId: "ENOLCMT_AP",
                    title: "",
                    data: selectedData,
                    options: { mode: "panel" }
                });
            }
        }
    }
};
</script>
