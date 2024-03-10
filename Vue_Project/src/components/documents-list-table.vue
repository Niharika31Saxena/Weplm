<template>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="rows"
      show-select
    ></v-data-table>
  </template>

<script>
import { mapState, mapActions } from "vuex";

export default {
    data () {
      return {
    

         headers: [   
        //   {title: 'Name',align: 'start', key: 'chrName'},
          { title: 'Title', align: 'center', key: 'chrTitle' },
          { title: 'Description', align: 'center', key: 'chrDescription' },
          { title: 'Manufacturing Change Type', align: 'center', key: 'chrMType'},
          { title: 'Programs', align: 'center', key: 'chrProgram' },
          { title: 'Customer change number', align: 'center', key: 'chrCustChangeNb' },
          { title: 'Change number', align: 'center', key: 'changeNumber' },
          { title: 'Change status', align: 'center', key: 'chrStatus' },
          { title: 'Site', align: 'center', key: 'chrSite' },
          { title: 'State', align: 'center', key: 'state' },
          { title: 'Criticality', align: 'center', key: 'chrCriticality' },
          { title: 'Change Leader', align: 'center', key: 'chrChangeLeader' },
          { title: 'Owner', align: 'center', key: 'owner' },

 ],
 rows: []

 }
    },
  
    computed: {
        ...mapState(["expanded", "componentTable", "selectAll", "usageCategoryStatus", "attributes"]),
        selectAll: {
            get () {
                return this.$store.state.selectAll;
            },
            set(isSelected) {
                this.$store.state.selectAll = isSelected;
                for (const row of this.componentTable.rows[this.getContextUsage()]) {
                   row.selected = isSelected;
                }
            }
        },
        getRows: {
            get () {
               return this.componentTable.rows[this.getContextUsage()];
            }
        },
        getRanges: function() {
            const ranges = [];
            this.attributes.range.forEach(range => {
                const value = range.value.trim();
                if (value !== "") {
                    ranges.push(value);
                }
            });
            return ranges;
        }
    },
    methods: {
        ...mapActions(["updateDocument", "displayAlert", "downloadHighestRevDocFromPRIM"]),
        rowSelected: function(selected, row) {
            if (!selected) {
                this.$store.state.selectAll = false;
            }
            let isAllSelected = true;
            for (const row of this.componentTable.rows[this.getContextUsage()]) {
                   if (row.selected === "undefined" || !row.selected) {
                       isAllSelected = false;
                       break;
                   }
            }
            if (isAllSelected) {
                this.$store.state.selectAll = true;
            }

            if (selected) {
                 const dataSelect = {
                    widgetId: widget.id,
                    data: {
                        tenant: "OnPremise",
                        version: "1.1",
                        paths: [[row.physicalId]],
                        attributes: {}
                    }
                };

            window.PlatformAPI.publish("DS/PADUtils/PADCommandProxy/select", dataSelect);
            }
        },
        update: function(item) {
            this.updateDocument({
                physicalId: item.physicalId,
                oldValue: !item.floatToLatestVersion,
                newValue: item.floatToLatestVersion.toString(),
                usage: this.getContextUsage(),
                identifier: item.globalDocumentIdentifier,
                relationshipId: item.relationshipId,
                attribute: "floatToLatestVersion",
                documentNumber: item.documentNumber
            });
        },
        open: function(oldValue) {
            this.oldValue = oldValue;
            this.newValue = [];
        },
        save: function(item, newSelection) {
            if (!(newSelection && newSelection.length > 0)) {
                console.log(">>> No new selection, nothing to do.");
                this.displayAlert({ type: "warning", text: this.$i18n.t("NoNewOptionSelected"), active: true });
                return;
            }
            this.updateDocument({
                physicalId: item.physicalId,
                oldValue: this.oldValue.split(","),
                newValue: newSelection && newSelection.length > 0 ? newSelection.join(",") : this.oldValue,
                usage: this.getContextUsage(),
                identifier: item.globalDocumentIdentifier,
                relationshipId: item.relationshipId,
                attribute: "documentUsage"
            });
        },
        cancel: function() {
            // do nothing
        },
        getContextUsage: function() {
            if (this.usageCategoryStatus.Main.active) {
                return "Main";
            } else if (this.usageCategoryStatus.Internal.active) {
                    return "Internal";
            } else {
                return "Special";
            }
        },
        checkSelectionLimit: function(items) {
            if (items.length > 3) {
                items.pop();
                this.displayAlert({ type: "warning", text: this.$i18n.t("Only 3 options are allowed to select"), active: true });
            }
            this.newValue = items;
        },
        getSelectedOptions() {
            return this.oldValue ? this.oldValue.split(",") : this.oldValue;
        },
        downloadHighestRevision(doc) {
            console.log(">>> doc : ", doc);
            this.downloadHighestRevDocFromPRIM(
                {
                    documentNumber: doc.documentNumber,
                    physicalId: doc.physicalId,
                    usage: this.getContextUsage(),
                    identifier: doc.globalDocumentIdentifier
                }
            );
        }
    }
};
</script>


<style>
.checkbox-label-container {
    display: flex;
    align-items: center;
  }
  
  .checkbox-label-container v-checkbox {
    margin-right: 5px; 
  }
.vertical-divider {
    border-right: 2.5px solid #b3b3b3; 
    margin: 0 2px; 
    height: 4em; 
}
.app-height-collaps {
    height: calc(100vh - 57px);
}
.app-height-expand {
    height: calc(100vh - 121px);
}
table > thead > tr > th {
    font-family: Arial !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    color: rgb(119, 121, 124) !important;
    background-color: rgb(241, 241, 241) !important;
    border-right: 1px solid #b3b3b3;
    padding: 3px;
}
table > thead > tr > th:first-child {
    border-right: none;
}
table > tbody > tr > td {
    font-family: Arial !important;
    font-size: 11px !important;
    font-weight: 400 !important;
    color: rgb(119, 121, 124) !important;
    background-color: rgba(255, 255, 255) !important;
    border-right: 1px solid #b3b3b3 !important;
    border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
    border: none !important; 
   
}
.alternate-rows .v-data-table__body--light > tr:nth-child(odd) {
    background-color:rgb(119, 121, 124) !important; ;
}

.alternate-rows .v-data-table__body--light > tr:nth-child(even) {
    background-color: #ffffff;
}

.docUsageSelectable {
    font-family: Arial !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    max-width: 300px;
    min-height: 180px;
}
.docUsageSelectable > .v-input__control > .v-input__slot {
    padding: 0 10px !important;
}
.v-list-item--link {
    cursor: pointer;
    user-select: none;
}
.v-menu__content .v-list-item {
    align-items: center;
    display: flex;
    flex: 1 1 100%;
    letter-spacing: normal;
    min-height: 20px !important;
    outline: none;
    padding: 0 16px;
    position: relative;
    text-decoration: none;
}
.v-small-dialog__menu-content  {
    max-width: 350px !important;
    min-width: 350px !important;
}
.v-menu__content .v-select-list {
    max-width: 300px !important;
    min-width: 300px !important;
}
.v-list-item--dense, .v-list--dense .v-list-item {
    height: 18px !important;
}
.v-menu__content .v-small-dialog__actions > button:nth-child(1) {
    color: rgb(224, 27, 60) !important;
}
.v-menu__content .v-small-dialog__actions > button:nth-child(2) {
    color: rgb(66, 162, 218) !important;
}
.v-input--selection-controls__ripple:before {
    opacity: 0 !important;
}
</style>
