<template>
    <v-app>
        <v-card style="width: 100%; height: 100vh;">
            <div>
                <div class="alert">
                    <v-alert
                        v-for="(alert, index) in alerts"
                        :key="index"
                        v-model="alert.active"
                        :type="alert.type"
                        border="left"
                        dense
                        dark
                        dismissible
                        elevation="3"
                    >
                        <span v-html="alert.text"></span>
                    </v-alert>
                </div>
                <div style="max-width: 100%;">
                    <component-header />
                </div>
                <div :class="['row', expanded ? 'app-height-expand': 'app-height-collaps']" style="max-width: 100%; margin: 0px;">
                    <div :class="['column', expanded ? 'app-height-expand': 'app-height-collaps']" style="width: 14.9%;">
                        <document-usage-category />
                    </div>
                    <div :class="['column', expanded ? 'app-height-expand': 'app-height-collaps']" style="width: 84.9%;">
                        <documents-list-table v-if="isTableVisible"/>
                    </div>
                </div>
            </div>
            <div>
                <list-tool-bar />
            </div>
        </v-card>
        <div>
            <v-overlay v-model="backgroundProcess.inProgress" contained class="align-center justify-center">
                <div class="spinner">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                    <div class="rect5"></div>
                    <span class="text" v-html="backgroundProcess.message"></span>
                </div>
            </v-overlay>
        </div>
    </v-app>
</template>

<style>
html,
body {
  overflow-y: hidden !important;
  height: 100%;
  width: 100%;
}
.column {
  display: flex;
  flex-direction: column;
  border: 1px solid grey;
}
.row {
  display: flex;
  flex-direction: row;
  max-width: 100%;
}
.app-height-collaps {
    height: calc(100vh - 54px);
}
.app-height-expand {
    height: calc(100vh - 130px);
}
.alert {
    z-index:100;
    white-space: normal;
    font-size: 12px;
    text-align: left;
    width: 50%;
    float:right;
    top: 10px;
    right:10px;
    max-width: fit-content;
    position: absolute;
}
.text{
    height: 49px;
    font: 300 12px/12px '3ds';
    display: table-cell;
    text-align: left;
    vertical-align: middle;
    padding:0 5px
}
.spinner {
  margin: 100px auto;
  height: 40px;
  text-align: center;
  font-size: 10px;
}
.spinner > div {
  background-color: #005686;
  height: 100%;
  width: 6px;
  display: inline-block;
  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}
.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}
.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}
.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}
.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}
@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
  20% { -webkit-transform: scaleY(1.0) }
}
@keyframes sk-stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% {
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}
</style>

<script>
import { mapState } from "vuex";
import ComponentHeader from "./component-header.vue";
import DocumentUsageCategory from "./document-usage-category.vue";
import DocumentsListTable from "./documents-list-table.vue";
import ListToolBar from "./list-toolbar.vue";

export default {
    name: "App",
    components: { ComponentHeader, DocumentUsageCategory, ListToolBar, DocumentsListTable },
    data: function() {
      return {
      };
    },
    computed: {
        ...mapState(["isWorking", "alerts", "backgroundProcess", "expanded", "isTableVisible"])
    },
    watch: {},
    mounted: function() {
        this.$store.dispatch("init");
    },
    methods: {
    }
};
</script>
