<template>
    <v-list dense nav>
        <template
            v-for="(usage, i) in docUsageCategories"
            :key="i"
        >
            <v-list-item
                
                color="rgb(59, 115, 145)"
                dark
                :input-value="usageCategoryStatus[usage.text].active"
                :class="[usageCategoryStatus[usage.text].dragOver ? 'DropZoneContainer' : '']"
                @dragover.prevent.stop="dragOverEvent(usage.text)"
                @drop.prevent.stop="dropEvent($event, usage.text)"
                @dragleave.stop="dragLeaveEvent(usage.text)"
                @click="resetSelection($event, usage.text)"
            >
                <v-list-item-action>
                    <v-checkbox
                        v-model="usageCategoryStatus[usage.text].chboxSelected"
                        light
                        color="rgb(54, 142, 196)"
                        :ripple="false"
                    />
                </v-list-item-action>
                <div
                    :class="[usageCategoryStatus[usage.text].dragOver ? 'dropFileInactive' : '']"
                >
                    <!-- <v-list-item-icon style="margin: 15px 15px;"> -->
                        <!-- <v-badge
                            bordered
                            light
                            color="blue"
                            :content="componentTable.rows[usage.text].length"
                            :value="componentTable.rows[usage.text].length"
                            overlap
                            offset-x="8"
                            offset-y="15"
                        >
                            <v-icon v-if="usageCategoryStatus[usage.text].active" color="#3b7391">{{ usage.iconOpen }}</v-icon>
                            <v-icon v-else color="#3b7391">{{ usage.iconClose }}</v-icon>
                        </v-badge> -->
                    <!-- </v-list-item-icon> -->
                </div>
                <div
                    :class="[usageCategoryStatus[usage.text].dragOver ? '' : 'dropFileInactive']"
                >
                    <!-- <v-list-item-icon style="margin: 15px 15px;"> -->
                        <!-- <v-icon color="#a34e53">mdi-file-move</v-icon> -->
                    <!-- </v-list-item-icon> -->
                </div>
                <v-list-item>
                    <v-list-item-title class="usage">{{ usage.text }}</v-list-item-title>
                </v-list-item>
            </v-list-item>
            <v-divider style="margin-bottom:8px;" />
        </template>
    </v-list>
</template>

<style>
.DropZoneContainer {
    z-index: 10;
    background-color: #8a8a8a26;
    border: 2px dashed #368ec4;
}
.dropFileInactive {
    display: none;
}
.usage {
    font-weight: 600;
    color: rgb(119, 121, 124);
    /* color: rgb(54, 142, 196); */
    display: inline-block;
    vertical-align: top;
    font-family: Arial;
    font-size: 15px;
    margin-bottom: 35px;
}
.list-active {
    background-color: #3b7391;
}
.list-inactive {
    background-color: #ffffff;
}
</style>

<script>
import { mapState, mapActions } from "vuex";
export default {
    data: function() {
        return { };
    },
    computed: {
        ...mapState(["docUsageCategories", "usageCategoryStatus", "componentTable",])
    },
    methods: {
        ...mapActions(["updateDragOverStatusOnUsage", "resetAndGoto", "displayAlert", "addOrReplaceDocument", "getDocCountOfUsage", ""]),
        dragOverEvent: function(usage) {
            this.updateDragOverStatusOnUsage({ usage: usage, dragOver: true });
        },
        dragLeaveEvent: function(usage) {
            this.updateDragOverStatusOnUsage({ usage: usage, dragOver: false });
        },
        dropEvent: function(event, usage) {
            try {
                if (event && event.dataTransfer) {
                    const dropData = JSON.parse(event.dataTransfer.getData("text"));
                    if (dropData && dropData.ObjectInfo) {
                        this.addOrReplaceDocument({ data: dropData.ObjectInfo, docUsageArea: usage });
                    }
                }
            } catch (error) {
                console.error(error);
                this.displayAlert({ type: "error", text: this.$i18n.t("Invalid Drop Data"), active: true });
            }
            this.updateDragOverStatusOnUsage({ usage: usage, dragOver: false });
        },
        resetSelection: function(event, usage) {
            this.$store.state.isTableVisible = true;
            this.resetAndGoto(usage);
        }
    }
};
</script>
