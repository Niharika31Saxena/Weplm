<template>
    <div
        :class="[dragOver ? 'DropZoneContainer' : '']"
        style="width: 100%;"
        @dragover.prevent.stop="dragOverEvent()"
        @drop.prevent.stop="dropEvent($event)"
        @dragleave.stop="dragLeaveEvent()"
        @click="close()"
    >
        <v-expansion-panels v-model="defaultOpen" multiple>
            <v-expansion-panel @click="toggleHeader">
                <v-expansion-panel-title expand-icon="mdi-menu-down">
                    <v-row no-gutters>
                        <v-col cols="auto" align-self="start">
                            <section class="section-label header-attribute-label">{{ $t("Header Title") }}</section>
                            <section class="section-value header-attribute-value" @click.stop="publish(componentDetails.id)">{{ componentDetails.globalProductIdentifier }}</section>
                            <section class="section-value header-attribute-label">&nbsp;|&nbsp;</section>
                            <section class="section-value header-attribute-value" @click.stop="publish(componentDetails.id)">{{ componentDetails.title }}</section>
                        </v-col>
                    </v-row>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-row no-gutters>
                        <v-col cols="auto">
                            <section class="section-label attribute-label">{{ $t("Label Header ComponentMainGroup") }}</section>
                            <section class="section-value attribute-value" :data-title="componentDetails.componentMainGroup">{{ componentDetails.componentMainGroup }}</section>
                            <br />
                            <section class="section-label attribute-label">{{ $t("Label Header ComponentSubGroup") }}</section>
                            <section class="section-value attribute-value" :data-title="componentDetails.componentSubGroup">{{ componentDetails.componentSubGroup }}</section>
                        </v-col>
                        <v-divider
                            vertical
                            class="divider"
                        />
                        <v-col cols="auto">
                            <section class="section-label attribute-label">{{ $t("Label Header ComponentType") }}</section>
                            <section class="section-value attribute-value" :data-title="componentDetails.componentType">{{ componentDetails.componentType }}</section>
                            <br />
                            <section class="section-label attribute-label">{{ $t("Label Header ProductHandlingSubType") }}</section>
                            <section class="section-value attribute-value" :data-title="componentDetails.productHandlingSubType">{{ componentDetails.productHandlingSubType }}</section>
                        </v-col>
                        <v-divider
                            vertical
                            class="divider"
                        />
                        <v-col cols="auto">
                            <section class="section-label attribute-label">{{ $t("Label Header MaturityLevel") }}</section>
                            <section class="section-value attribute-value" :data-title="componentDetails.maturityLevel">{{ $t(componentDetails.maturityLevel) }}</section>
                            <br />
                            <section class="section-label attribute-label">{{ $t("Label Header RestrictionLevel") }}</section>
                            <section class="section-value attribute-value" :data-title="componentDetails.restrictionLevel">{{ $t(componentDetails.restrictionLevel) }}</section>
                        </v-col>
                        <v-divider
                            vertical
                            class="divider"
                        />
                        <v-col cols="auto">
                            <section class="section-label attribute-label">{{ $t("Label Header Maturity State") }}</section>
                            <section class="section-value attribute-value">
                                <div v-if="colors[componentDetails.state]" class="state" :style="{ 'background-color': colors[componentDetails.state].active, 'color': colors[componentDetails.state].font }">{{ $t(componentDetails.state) }}</div>
                            </section>
                        </v-col>
                        <v-divider
                            vertical
                            class="divider"
                        />
                        <v-col cols="auto">
                            <section class="section-label attribute-label">{{ $t("Label Header Owner") }}</section>
                            <section class="section-value attribute-value" :data-title="componentDetails.owner">{{ componentDetails.owner }}</section>
                            <br />
                            <section class="section-label attribute-label">{{ $t("Label Header DesignResponsible") }}</section>
                            <section class="section-value attribute-value" :data-title="componentDetails.designResponsible">{{ componentDetails.designResponsible }}</section>
                        </v-col>
                        <v-divider
                            vertical
                            class="divider"
                        />
                        <v-col cols="auto">
                            <section class="section-label attribute-label">{{ $t("Label Header Creation Date") }}</section>
                            <section class="section-value attribute-value" :data-title="componentDetails.created">{{ componentDetails.created }}</section>
                            <br />
                            <section class="section-label attribute-label">{{ $t("Label Header Modification Date") }}</section>
                            <section class="section-value attribute-value" :data-title="componentDetails.modified">{{ componentDetails.modified }}</section>
                        </v-col>
                        <v-divider
                            vertical
                            class="divider"
                        />
                    </v-row>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<style scoped>
.state {
    height: 16px;
    border-radius: 3px;
    max-width: 60px;
    padding-left: 4px;
    padding-right: 4px;
    text-align: center;
}
.DropZoneContainer {
    z-index: 10;
    background-color: #8a8a8a26;
    border: 2px dashed #368ec4;
}
.section-label {
    font-weight: 700;
    color: rgb(119, 121, 124);
    display: inline-block;
    vertical-align: top;
    font-family: Arial;
}
.section-value {
    font-weight: 400;
    color: rgb(61, 61, 61);
    display: inline-block;
    vertical-align: top;
    font-family: Arial;
    white-space:nowrap;
}
.header-attribute-label {
    font-size: 20px;
}
.header-attribute-value {
    font-size: 20px;
    color: #368ec4;
}
.attribute-label {
    font-size: 12px;
}
.attribute-value {
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
}
.divider {
    margin-left: 5px;
    margin-right: 5px;
}
.v-expansion-panel-header, .v-expansion-panel-header--active {
    pointer-events: none;
}
.v-expansion-panel-header::before {
    background-color: rgba(0, 0, 0, 0) !important;
}
.v-expansion-panel-header >>> .v-expansion-panel-header__icon {
    pointer-events: all !important;
}
.v-expansion-panel-header--active >>> .v-expansion-panel-header__icon {
    pointer-events: all !important;
}
.v-expansion-panel-header >>> .header-attribute-value  {
    pointer-events: all !important;
}
.v-expansion-panel-header--active >>> .header-attribute-value  {
    pointer-events: all !important;
}

[data-title]:hover::before {
    content: attr(data-title);
    position:absolute;
    z-index:1050;
    font-size:12px;
    line-height:1;
    padding:3px 8px;
    color:#77797c;
    text-align:center;
    text-decoration:none;
    background-color:#f4f5f6;
    border:1px solid #b4b6ba;
    border-radius:2px;
    white-space: nowrap;
    border-left-width:5px;
    border-right-width:5px;
}

</style>

<script>
import { mapState, mapActions } from "vuex";
export default {
    data: function() {
        return {
            dragOver: false,
            defaultOpen: [0],
            colors: {
                PRIVATE: {
                    inactive: "#CD95CB",
                    active: "#9B2C98",
                    font: "#FFFFFF"
                },
                IN_WORK: {
                    inactive: "#7FBED1",
                    active: "#007DA3",
                    font: "#FFFFFF"
                },
                FROZEN: {
                    inactive: "#80C183",
                    active: "#018308",
                    font: "#FFFFFF"
                },
                RELEASED: {
                    inactive: "#BABABA",
                    active: "#757575",
                    font: "#FFFFFF"
                },
                OBSOLETE: {
                    inactive: "#AC6666",
                    active: "#B32E2E",
                    font: "#FFFFFF"
                }
            }
        };
    },
    computed: {
        ...mapState(["componentDetails"])
    },
    methods: {
        ...mapActions(["toggleComponentHeader", "addOrReplaceItem", "displayAlert"]),
        dragOverEvent: function() {
            this.dragOver = true;
        },
        dragLeaveEvent: function() {
            this.dragOver = false;
        },
        dropEvent: function(event) {
            try {
                if (event && event.dataTransfer) {
                    const dropData = JSON.parse(event.dataTransfer.getData("text"));
                    if (dropData.protocol && dropData.protocol === "3DXContent") {
                        if (dropData.data && dropData.data.items) {
                            for (const item of dropData.data.items) {
                                if (item.objectId && item.objectType && item.objectType === "ERI_HWStandardComponent") {
                                    this.addOrReplaceItem(item);
                                } else {
                                    this.displayAlert({ type: "error", text: this.$i18n.t("Content Not Supported"), active: true });
                                }
                            }
                        }
                    } else {
                        this.displayAlert({ type: "warning", text: this.$i18n.t("Only 3DX Content allowed"), active: true });
                    }
                }
            } catch (error) {
                console.error(error);
                this.displayAlert({ type: "error", text: this.$i18n.t("Invalid Drop Data"), active: true });
            }
            this.dragOver = false;
        },
        close: function() {
            this.dragOver = false;
        },
        toggleHeader: function() {
            this.toggleComponentHeader();
        },
        publish: function(id) {
            const dataSelect = {
                widgetId: widget.id,
                data: {
                    tenant: "OnPremise",
                    version: "1.1",
                    paths: [[id]],
                    attributes: {}
                }
            };
            const selectedData = {
                    SelectedItem: [
                        {
                            metatype: "businessobject",
                            objectId: id,
                            tenant: "OnPremise",
                            source: "3DSpace"
                        }
                    ],
                    x3dPlatformId: "OnPremise",
                    isTransient: "true",
                    loadData: true,
                    asynchronousRequest: true,
                    securityContext: widget.getPreference("__platformSecurityContext").value
                };
            window.PlatformAPI.publish("ShowWidget", {
                appId: "ENOLCMT_AP",
                title: "",
                data: selectedData,
                options: { mode: "panel" }
            });
            window.PlatformAPI.publish("DS/PADUtils/PADCommandProxy/select", dataSelect);
        }
    }
};
</script>
