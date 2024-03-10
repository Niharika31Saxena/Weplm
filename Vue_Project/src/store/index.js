import Vue from "vue";
import { createStore } from 'vuex';
import { initPlatformConnectors, get3DSpaceServiceUrl } from "platform-connectors";
import { x3DDashboardUtils } from "../lib/widget";
import { call3DSpaceWithTraces, getEngItemDetails } from "../lib/engItemUtilities";
import { getRangeValuesForAttribute } from "../lib/ascoUtils";
import i18n from "../locale"



const widgetURL = x3DDashboardUtils.isWidget() ? widget.getUrl() : document.location.href;

const prepareUserMessageFromError = function(error, defaultMessage) {
    let errorMessage = defaultMessage;
    if (typeof error === "string") errorMessage = error;
    else if (error.message && typeof error.message === "string") errorMessage = error;
    else if (typeof error === "object") {
        if (typeof error.backendresponse === "string") errorMessage = error.backendresponse;
            else if (typeof error.backendresponse === "object" && error.backendresponse[1]) errorMessage = error.backendresponse[1];
        else if (typeof error.backendresponse === "object" && error.backendresponse.message) errorMessage = error.backendresponse.message;
        else if (typeof error.backendresponse === "object" && error.backendresponse.errMsg) errorMessage = error.backendresponse.errMsg;
        else if (typeof error.backendresponse === "object" && error.backendresponse.ErrorMessage) errorMessage = error.backendresponse.ErrorMessage;
        else if (typeof error.backendresponse === "object" && (typeof error.backendresponse.error === "object") && error.backendresponse.error.message) errorMessage = error.backendresponse.error.message;
        else if (typeof error.error === "object" && error.error.message) errorMessage = error.error.message;
    }

    return errorMessage;
};



const tableColumnDetails = require("./config/asco-config.json");

const getSortOrder = function(key) {
    return function(a, b) {
        if (a[key] > b[key]) {
            return 1;
        } else if (a[key] < b[key]) {
            return -1;
        }
        return 0;
    };
};
console.log(" This is for i18n", i18n);

const prepareTableHeaders = function(columns) {
    const headers = [];
    if (columns) {
        for (const column of columns) {
            const header = {};
            header.text = i18n.global.t(column.displayName);
            header.value = column.name;
            if (column.width) {
                header.width = column.width;
            }
            if (column.hidden) {
                // ignore
            } else {
                headers.push(header);
            }
        }
    }
    return headers;
};

const store = createStore({
    state: {
        isTableVisible:false,
        componentDetails: {
            revision: "A.1",
            title: "CPD-44852",
            description: "CPD-44852",
            state: "IN_WORK",
            owner: "pbaprdowner",
            created: "9/29/2022 10:54:01 AM",
            modified: "11/3/2022 9:41:09 AM",
            globalProductIdentifier: "ROZ1280374 R1A",
            id: "9278F1F185D1000063355D2900099FE7",
            maturityLevel: "Partly Verified",
            restrictionLevel: "Phase Out Started",
            designResponsible: "Ericsson",
            productHandlingSubType: "Component",
            componentSubGroup: "Ceramic capacitors test test test",
            componentMainGroup: "Capacitors",
            componentType: ""
        },
        /* componentDetails: {
            revision: "",
            title: "",
            description: "",
            state: "",
            owner: "",
            created: "",
            modified: "",
            globalProductIdentifier: "",
            id: "",
            maturityLevel: "",
            restrictionLevel: "",
            designResponsible: "",
            productHandlingSubType: "",
            componentSubGroup: "",
            componentMainGroup: "",
            componentType: ""
        }, */
        docUsageCategories: [
            { text: "Main", iconOpen: "mdi-folder-open", iconClose: "mdi-folder" },
            { text: "Special", iconOpen: "mdi-folder-open", iconClose: "mdi-folder" },
            { text: "Internal", iconOpen: "mdi-folder-open", iconClose: "mdi-folder" }
        ],
        usageCategoryStatus: {
            Main: {
                dragOver: false,
                active: true,
                chboxSelected: false
            },
            Special: {
                dragOver: false,
                active: false,
                chboxSelected: false
            },
            Internal: {
                dragOver: false,
                active: false,
                chboxSelected: false
            }
        },
        componentTable: {
            columns: tableColumnDetails.columns.sort(getSortOrder("order")),
            headers: prepareTableHeaders(tableColumnDetails.columns.sort(getSortOrder("order"))),
            /* rows: {
                Main: [],
                Internal: [],
                Special: []
            } */
            rows: {
                Main: [
                    {
                        physicalId: "0001",
                        globalDocumentIdentifier: "1911-ROA1281234 Ux A",
                        title: "Circuit Diagram",
                        name: "DOC-001-1234",
                        documentUsage: ["Development", "Production"],
                        floatToLatestVersion: false,
                        url: "",
                        id: "1",
                        selected: false,
                        documentNumber: "1911-ROA1281234"
                    },
                    {
                        physicalId: "0002",
                        globalDocumentIdentifier: "1911-ROA1281234 Uen A",
                        title: "Description",
                        name: "DOC-001-1236",
                        documentUsage: ["Operation and Maintenance"],
                        floatToLatestVersion: true,
                        url: "https://hello.hello.com/document2",
                        id: "2",
                        selected: false,
                        documentNumber: "1911-ROA1281234"
                    },
                    {
                        physicalId: "0005",
                        globalDocumentIdentifier: "1911-ROA1281239 Uen A",
                        title: "Description",
                        name: "DOC-001-1239",
                        documentUsage: [],
                        floatToLatestVersion: true,
                        url: "https://hello.hello.com/document2",
                        id: "5",
                        selected: false,
                        documentNumber: "1911-ROA1281239"
                    }
                ],
                Internal: [
                    {
                        physicalId: "0003",
                        globalDocumentIdentifier: "1911-ROA1281234 Usv A",
                        title: "Circuit Diagram",
                        name: "DOC-001-1237",
                        documentUsage: ["Operation and Maintenance"],
                        floatToLatestVersion: true,
                        url: "",
                        id: "1",
                        selected: false
                    },
                    {
                        physicalId: "0004",
                        globalDocumentIdentifier: "1911-ROA1281234 Uen A",
                        title: "Description",
                        name: "DOC-001-1238",
                        documentUsage: ["Operation and Maintenance"],
                        floatToLatestVersion: true,
                        url: "https://hello.hello.com/document3",
                        id: "2",
                        selected: false
                    }
                ],
                Special: []
            }
        },
        attributes: {
            attributeName: "",
           // range: []
            range: [
                {
                    value: "Not to be sent to Supplier",
                    text: "emxFramework.Range.ERI_DocumentUsage_Main.Not to be sent to Supplier"
                },
                {
                    value: "",
                    text: ""
                },
                {
                    value: "Change Information",
                    text: "emxFramework.Range.ERI_DocumentUsage_Main.Change Information"
                },
                {
                    value: "To be sent to Supplier",
                    text: "emxFramework.Range.ERI_DocumentUsage_Main.To be sent to Supplier"
                },
                {
                    value: "Production",
                    text: "emxFramework.Range.ERI_DocumentUsage_Main.Production"
                },
                {
                    value: "Operation and Maintenance",
                    text: "emxFramework.Range.ERI_DocumentUsage_Main.Operation and Maintenance"
                },
                {
                    value: "Development",
                    text: "emxFramework.Range.ERI_DocumentUsage_Main.Development"
                },
                {
                    value: "Informal Information",
                    text: "emxFramework.Range.ERI_DocumentUsage_Main.Informal Information"
                },
                {
                    value: "General Production Info",
                    text: "emxFramework.Range.ERI_DocumentUsage_Main.General Production Info"
                },
                {
                    value: "Associated Document",
                    text: "emxFramework.Range.ERI_DocumentUsage_Main.General Production Info"
                }
            ]
        },
        aCodeRules: {
            applicationCode: ["Change Information", "Operation and Maintenance", "Production", "Development", "General Production Info", "Informal Information"],
            referenceCode: ["Associated Document"],
            supplementaryCode: ["To be sent to Supplier", "Not to be sent to Supplier"]
        },
        expanded: true,
        selectAll: false,
        alerts: [],
        url3DSpace: undefined,
        roots: [],
        backgroundProcess: {
            inProgress: false,
            message: "Loading..."
        },
        widgetBaseURL: widgetURL.substring(0, widgetURL.lastIndexOf("/"))
    },
    getters: {
        getComponentId: state => state.componentDetails.id,
        getRowIndexOfUsageById: state => (physicalId, usage) => state.componentTable.rows[usage].findIndex(row => physicalId === row.physicalId),
        getRowOfUsageById: state => (physicalId, usage) => state.componentTable.rows[usage].find(row => physicalId === row.physicalId),
        getAppCodeIndexofUsage: state => (usage) => state.aCodeRules.applicationCode.findIndex(acode => acode === usage),
        getRefCodeIndexofUsage: state => (usage) => state.aCodeRules.referenceCode.findIndex(acode => acode === usage),
        getSupplementaryCodeIndexofUsage: state => (usage) => state.aCodeRules.supplementaryCode.findIndex(acode => acode === usage)
     },
    mutations: {
        setOrResetDragOver: function(state, category) {
            for (const usage in state.usageCategoryStatus) {
                state.usageCategoryStatus[usage].dragOver = false;
            }
            state.usageCategoryStatus[category.usage].dragOver = category.dragOver;
        },
        toggleHeader: function(state) {
            state.expanded = !state.expanded;
        },
        gotoUsageArea: function(state, usage) {
            for (const key in state.usageCategoryStatus) {
                state.usageCategoryStatus[key].active = false;
            }
            state.usageCategoryStatus[usage].active = true;
        },
        getActiveUsage: function(state, usage) {
            for (const key in state.usageCategoryStatus) {
                state.usageCategoryStatus[key].active = false;
            }
            state.usageCategoryStatus[usage].active = true;
        },
        showHideAlert: function(state, notif) {
            state.alerts.push(notif);
            setTimeout(() => {
                state.alerts.splice(0, 1);
            }, 10000);
        },
        resetAlerts: function(state) { state.alerts = []; },
        setUrl3DSpace: function(state, value) { state.url3DSpace = value; },
        setInProgress: function(state, progressData) {
            if (progressData) {
                state.backgroundProcess.inProgress = progressData.inProgress;
                if (progressData.message && progressData.message !== "") {
                    state.backgroundProcess.message = progressData.message;
                } else {
                    state.backgroundProcess.message = "Loading...";
                }
            }
        },
        updateHeader: function(state, properties) {
            state.componentDetails = properties;
        },
        updateDocumentsInTable: function(state, documents) {
            if (documents) {
                state.docUsageCategories.forEach(usageArea => {
                    const docs = [];
                    if (documents[usageArea.text]) {
                        documents[usageArea.text].forEach(doc => {
                            if (typeof doc.documentUsage === "string") {
                                let docUsage = "";
                                docUsage = doc.documentUsage;
                                if (docUsage.trim().length() === 0) {
                                    doc.documentUsage = [];
                                } else {
                                    doc.documentUsage = docUsage.split(",");
                                }
                            }
                            docs.push(doc);
                        });
                    }
                    state.componentTable.rows[usageArea.text] = docs;
                });
            }
        },
        resetValueOfRow: function(state, row) {
            const rowToUpdate = store.getters.getRowOfUsageById(row.physicalId, row.usage);
            if (rowToUpdate) {
                const idx = store.getters.getRowIndexOfUsageById(row.physicalId, row.usage);
                rowToUpdate[row.attribute] = row.value;
                state.componentTable.rows[row.usage].splice(idx, 1, rowToUpdate);
            }
        },
        addOrReplaceRow: function(state, row) {
            if (row) {
                const rowToReplace = store.getters.getRowOfUsageById(row.data.physicalId, row.usageArea);
                if (rowToReplace) {
                    const idx = store.getters.getRowIndexOfUsageById(row.data.physicalId, row.usageArea);
                    state.componentTable.rows[row.usageArea].splice(idx, 1, row.data);
                } else {
                    // new row to add
                    state.componentTable.rows[row.usageArea].push(row.data);
                }
            }
        },
        removeRow: function(state, row) {
            if (row) {
                const rowToReplace = store.getters.getRowOfUsageById(row.physicalId, row.usageArea);
                if (rowToReplace) {
                    const idx = store.getters.getRowIndexOfUsageById(row.physicalId, row.usageArea);
                    state.componentTable.rows[row.usageArea].splice(idx, 1);
                }
            }
        },
        loadRanges: async function(state) {
            const attribute = { fullName: "ERI_DocumentUsage_Main", range: [] };
            const attributeWithRange = await getRangeValuesForAttribute(attribute);
            state.attributes = attributeWithRange;
        }
    },
    actions: {
    
        init: function(context) {
            context.commit("resetAlerts");
            context.commit("setInProgress", { inProgress: true, message: i18n.global.t("Loading Widget") });
            try {
                initPlatformConnectors({
                    allowTenantsSelection: true, // Allow user to select the tenant (dropdown list added to widget preferences) ?
                    allowSecurityContextSelection: true, // Allow user to select the security context (dropdown list added to widget preferences) ?
                    allowedServicesInUntrustedMode: ["3DSpace"], // Add 3DSpace URL text input in widget preferences
                    allowManualTenantConfigInUntrustedMode: true // In Run your App mode, a tenant is required to retrieve security contexts used for 3DSpace calls.
                });

                get3DSpaceServiceUrl().then(baseUrl => {
                    context.commit("setUrl3DSpace", baseUrl);
                });
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log("Caught exception when initializing platform connectors : platform connectors are probably already initialized");
            }

            const listIDs = window.getPreferenceListComponentIDs();
            if (listIDs.length > 0) {
                context.dispatch("loadItemDetails", listIDs);
                context.commit("loadRanges");
            } else {
                context.commit("setInProgress", { inProgress: false, message: "" });
            }
        },
        loadItemDetails: async function(context, inputID) {
            let arrayOfIDs = [];
            if (inputID instanceof Array) arrayOfIDs = inputID;
            else if (inputID && typeof inputID === "string") arrayOfIDs.push(inputID);
            else {
                context.commit("setInProgress", { inProgress: false, message: "" });
                return;
            }

            if (arrayOfIDs.length > 0) {
                context.commit("setInProgress", { inProgress: true, message: "Loading header component from cache..." });
                if (arrayOfIDs[0]) {
                    const res = await getEngItemDetails(arrayOfIDs[0], true);
                    if (res) {
                        context.dispatch("updateHeaderDetails", res[0]);
                        // update widget pref with new item
                        const prefList = [];
                        prefList.push(arrayOfIDs[0]);
                        window.updatePreferenceListComponentIDs(prefList);
                    }
                }
                context.commit("setInProgress", { inProgress: false, message: "" });
            } else {
                context.commit("setInProgress", { inProgress: false, message: "" });
            }
            this.dispatch("getConnectedDocumentsforItem", { displayName: "", objectId: arrayOfIDs[0] });
            context.commit("setInProgress", { inProgress: false, message: "" });
        },
        updateDragOverStatusOnUsage: function(context, usageCategory) {
            context.commit("setOrResetDragOver", usageCategory);
        },
        toggleComponentHeader: function(context) {
            context.commit("toggleHeader");
        },
        resetAndGoto: function(context, usage) {
            context.commit("gotoUsageArea", usage);
        },
        displayAlert: function(context, notification) {
            context.commit("showHideAlert", notification);
        },
        addOrReplaceItem: async function(context, item) {
            let headerOK = false;
            if (item) {
                const displayName = item.displayName;
                try {
                    context.commit("setInProgress", { inProgress: true, message: `Trying to fetch header details for ${item.displayName}...` });
                    const res = await getEngItemDetails(item.objectId, true);
                    if (res) {
                        context.dispatch("updateHeaderDetails", res[0]);
                        // update widget pref with new item
                        const prefList = [];
                        prefList.push(item.objectId);
                        window.updatePreferenceListComponentIDs(prefList);
                        headerOK = true;
                    }
                    context.commit("setInProgress", { inProgress: false, message: "" });
                } catch (error) {
                    if (error && error.message && error.message === "null") {
                        context.dispatch("displayAlert", { type: "error", text: "The item dropped is not allowed", active: true });
                        const listIDs = window.getPreferenceListComponentIDs();
                        if (listIDs.length > 0) {
                            context.dispatch("loadItemDetails", listIDs);
                        }
                    } else {
                        const errMSG = prepareUserMessageFromError(error, "Issue is getting details of dropped item...");
                        if (errMSG === "URI not Found." || errMSG === "Issue is getting details of dropped item...") {
                            console.warn(">>> Either " + displayName + " not found or do not have acess!!!!!");
                        } else {
                            context.dispatch("displayAlert", { type: "error", text: errMSG, active: true });
                        }
                    }
                }
            }

            if (headerOK) context.dispatch("getConnectedDocumentsforItem", item);

            // switch to default view
            context.dispatch("resetAndGoto", "Main");
            context.commit("setInProgress", { inProgress: false, message: "" });
        },
        getListofAllChangeRequest: async function(context, item) {
            if (item) {
                const displayName = item.displayName;
                try {
                    context.commit("setInProgress", { inProgress: true, message: "Trying to get change request " + displayName + "..." });
                    // const response = await call3DSpaceWithTraces(`/ascoChangeManagement/changeRequest/getList`);
                    const response = [{
                        status: "OK"
                    }]
                    if (response) {
                        context.commit("setInProgress", { inProgress: true, message: "Received response and status is <span style=\"color: green;\">" + response.status + "</span>" });
                        if (response.status === "OK") {
                            context.commit("setInProgress", { inProgress: true, message: "Parsing the response..." });
                            const itemInfo = [{

                                chrTitle: "Title",
                                chrDescription: "Description",
                                chrMType: "Manufacturing Change Type",
                                chrProgram: "Program",
                                chrCustChangeNb: "Customer change number",
                                changeNumber: "Change number",
                                chrStatus: "Change status",
                                chrSite: "Site",
                                state: "State",
                                chrCriticality: "Criticality",
                                chrChangeLeader: "Change Leader",
                                owner: "Owner"
                            }]
                            // const itemInfo = response.result;
                            // update table details
                            context.commit("setInProgress", { inProgress: true, message: "updating documents list..." });
                            context.commit("updateDocumentsInTable", itemInfo.documents);
                        } else {
                            context.dispatch("displayAlert", { type: "error", text: response.errormsg, active: true });
                        }
                    }
                } catch (error) {
                    const errMSG = prepareUserMessageFromError(error, "Issue is getting documents of " + displayName + "...");
                    if (errMSG === "URI not Found.") {
                        console.warn(">>> Either " + displayName + " not found or do not have acess!!!!!");
                    } else {
                        context.dispatch("displayAlert", { type: "error", text: errMSG, active: true });
                    }
                }
                context.commit("setInProgress", { inProgress: false, message: "" });
            }
        },
        updateHeaderDetails: function(context, properties) {
            if (properties) {
                properties.globalProductIdentifier = properties.customerAttributes.ERI_GlobalProductIdentifier;
                properties.restrictionLevel = properties.customerAttributes.ERI_RP_RestrictionLevel;
                properties.designResponsible = properties.customerAttributes.ERI_DesignResponsible;
                if (properties.customerAttributes.ERI_AH_MaturityLevel) {
                    properties.maturityLevel = properties.customerAttributes.ERI_AH_MaturityLevel;
                } else if (properties.customerAttributes.ERI_HSC_MaturityLevel) {
                    properties.maturityLevel = properties.customerAttributes.ERI_HSC_MaturityLevel;
                }

                if (properties.customerAttributes.ERI_HWRealizationProductCustom && properties.customerAttributes.ERI_HWRealizationProductCustom.ERI_HW_ProductHandlingSubType) {
                    properties.productHandlingSubType = properties.customerAttributes.ERI_HWRealizationProductCustom.ERI_HW_ProductHandlingSubType;
                }

                if (properties.customerAttributes.ERI_ComponentClassification) {
                    if (properties.customerAttributes.ERI_ComponentClassification.ERI_ComponentSubGroup) {
                        properties.componentSubGroup = properties.customerAttributes.ERI_ComponentClassification.ERI_ComponentSubGroup;
                    }
                    if (properties.customerAttributes.ERI_ComponentClassification.ERI_ComponentMainGroup) {
                        properties.componentMainGroup = properties.customerAttributes.ERI_ComponentClassification.ERI_ComponentMainGroup;
                    }
                    if (properties.customerAttributes.ERI_ComponentClassification.ERI_ComponentType) {
                        properties.componentType = properties.customerAttributes.ERI_ComponentClassification.ERI_ComponentType;
                    }
                }

                context.commit("setInProgress", { inProgress: true, message: "updating header details..." });
                context.commit("updateHeader", properties);
            }
        },
        addOrReplaceDocument: async function(context, dropData) {
            if (dropData) {
                const docDetails = dropData.data;
                const usage = dropData.docUsageArea;
                const currrentRows = store.state.componentTable.rows[usage];
                context.commit("setInProgress", { inProgress: true, message: `Checking same document already exists on usage area ${usage}` });
                if (currrentRows.find(row => row.documentNumber === docDetails.document_number && row.documentVersion === docDetails.revision && row.languageCode === "U" + docDetails.language)) {
                    context.dispatch("displayAlert", { type: "warning", text: `Document already exists on usage area ${usage}`, active: true });
                } else if (currrentRows.find(row => row.documentNumber === docDetails.document_number)) {
                    context.dispatch("displayAlert", { type: "warning", text: `Same document of different version already exists on usage area ${usage}`, active: true });
                } else {
                    context.commit("setInProgress", { inProgress: true, message: `calling service to process the document ${docDetails.document_number}...` });
                    const time = new Date().getTime();
                    const securityContextPref = widget.getPreference("__platformSecurityContext");
                    const headerWAF = {
                        SecurityContext: securityContextPref.value
                    };
                    const payload = {
                        headers: headerWAF,
                        type: "text/plain",
                        method: "GET"
                    };
                    const urlParams = `docURI=${encodeURIComponent(docDetails.uri)}&docTitle=${encodeURIComponent(docDetails.title)}&docRevision=${encodeURIComponent(docDetails.revision)}&docNumber=${encodeURIComponent(docDetails.document_number)}&docLanguage=${encodeURIComponent(docDetails.language)}&docResponsible=${encodeURIComponent(docDetails.document_responsible)}&docStatus=${encodeURIComponent(docDetails.status)}&docDocumentType=${encodeURIComponent(docDetails.document_type)}&docAccessclass=${encodeURIComponent(docDetails.access_class)}&dropId=${encodeURIComponent(store.getters.getComponentId)}&docUsageArea=${usage}&docDecimalClass=${docDetails.decimal_class}`;
                    let response = await call3DSpaceWithTraces(`/CommercialProduct/GetCommercialProducts/addERIDOC?timestamp=${time}&${urlParams}`, payload);
                    if (response && typeof response === "string") {
                        response = JSON.parse(response);
                    }
                    if (response) {
                        let errorType = "success";
                        let message = "Error during the operation!!!";
                        if (response.msg) {
                            if (response.msg === "KO") {
                                errorType = "error";
                            }
                            message = response.status.replaceAll("\n", "</br>");
                        } else {
                            if (response.status === "KO") {
                                errorType = "error";
                            } else {
                                message = `Document classification successfull on usage ${usage}`;
                                // Update table with new row of data
                                context.commit("addOrReplaceRow", { usageArea: usage, data: response.result });
                            }
                        }
                        context.dispatch("displayAlert", { type: errorType, text: message, active: true });
                    }
                    context.commit("setInProgress", { inProgress: false, message: "" });
                }
                context.commit("setInProgress", { inProgress: false, message: "" });
            }
        },
        updateDocument: async function(context, row) {
            const attributeToUpdate = row.attribute;
            let blockUpdate = false;
            if (row && attributeToUpdate === "documentUsage") {
                context.commit("setInProgress", { inProgress: true, message: `Validating A-Code Rules for ${row.identifier}...` });
                let appCodeExists = false;
                let refCodeExist = false;
                let supplementaryCodeExists = false;
                const selectedUsages = row.newValue.split(",");
                let ivalidCompinations = 0;
                selectedUsages.forEach(usage => {
                    if (store.getters.getAppCodeIndexofUsage(usage) !== -1) {
                        appCodeExists = true;
                    } else if (store.getters.getRefCodeIndexofUsage(usage) !== -1) {
                        refCodeExist = true;
                    } else if (store.getters.getSupplementaryCodeIndexofUsage(usage) !== -1) {
                        supplementaryCodeExists = true;
                        if (usage === "Not to be sent to Supplier" || usage === "To be sent to Supplier") {
                            ivalidCompinations += 1;
                        }
                    }
                });

                if ((supplementaryCodeExists && !appCodeExists && !refCodeExist) || ivalidCompinations > 1) {
                    // rule 3
                    blockUpdate = true;
                    context.commit("resetValueOfRow", { physicalId: row.physicalId, usage: row.usage, value: row.oldValue, attribute: row.attribute });
                    context.dispatch("displayAlert", { type: "error", text: "Selected usage or combination is not allowed", active: true });
                    context.commit("setInProgress", { inProgress: false, message: "" });
                }
            }

            if (row && !blockUpdate) {
                try {
                    let msg = `calling service to update document ${row.identifier}...`;
                    context.commit("setInProgress", { inProgress: true, message: msg });
                    const payload = {};
                    payload.relationshipId = row.relationshipId;
                    payload.interfaceName = row.usage;
                    payload.attributeMap = {};
                    payload.attributeMap[row.attribute] = row.newValue;
                    const response = await call3DSpaceWithTraces("/ERI_InformationStructure/ERI_InformationStructureService/modifyInterfaceOnRelationship", { method: "POST", data: payload });
                    if (response) {
                        if (response.status === "OK") {
                            if (response.errMsg) {
                                context.dispatch("displayAlert", { type: "warning", text: response.errMsg, active: true });
                            } else {
                                msg = msg + "[<span style=\"color: green;\">" + response.status + "</span>]</br>";
                                context.commit("setInProgress", { inProgress: true, message: msg });
                                if (row && attributeToUpdate === "documentUsage") {
                                    context.commit("resetValueOfRow", { physicalId: row.physicalId, usage: row.usage, value: row.newValue.split(","), attribute: row.attribute });
                                }
                                context.dispatch("displayAlert", { type: "success", text: "Document updated successfully", active: true });
                            }
                        } else {
                            context.commit("resetValueOfRow", { physicalId: row.physicalId, usage: row.usage, value: row.oldValue, attribute: row.attribute });
                            context.dispatch("displayAlert", { type: "error", text: response.errMsg, active: true });
                        }
                    }
                    context.commit("setInProgress", { inProgress: false, message: "" });
                } catch (error) {
                    const errMSG = prepareUserMessageFromError(error, `Issue during updating document ${row.identifier}...`);
                    if (errMSG === "URI not Found.") {
                        console.warn(">>> Either " + row.identifier + " not found or do not have acess!!!!!");
                    } else {
                        context.dispatch("displayAlert", { type: "error", text: errMSG, active: true });
                    }
                }
            }
        },
        removeDocumentFromUsageArea: async function(context, selectedRows) {
            if (selectedRows) {
                const rows = selectedRows.selectedRows;
                const payload = {};
                payload.interfaceName = selectedRows.usageArea;
                let msg = "";
                for (const row of rows) {
                    msg = msg + `calling service to remove document ${row.globalDocumentIdentifier}...`;
                    context.commit("setInProgress", { inProgress: true, message: msg });
                    payload.relationshipId = row.relationshipId;
                    const response = await call3DSpaceWithTraces("/ERI_InformationStructure/ERI_InformationStructureService/removeInterfaceOnRelationship", { method: "POST", data: payload });
                    if (response) {
                        if (response.status === "OK") {
                            msg = msg + "[<span style=\"color: green;\">" + response.status + "</span>]";
                            if (response.errMsg) {
                                msg = msg + ` [${response.errMsg}]`;
                            }
                        } else {
                            msg = msg + "[<span style=\"color: red;\">" + response.status + "</span>]";
                            if (response.errMsg) {
                                msg = msg + ` [${response.errMsg}]`;
                            }
                        }
                        msg = msg + "</br>";
                        context.commit("setInProgress", { inProgress: true, message: msg });
                        if (response.status === "OK") {
                            row.usageArea = selectedRows.usageArea;
                            context.commit("removeRow", row);
                        }
                    }
                }
                context.commit("setInProgress", { inProgress: false, message: "" });
            }
        },
        publishDocumentsToPRIM: async function(context, usages) {
            if (usages && usages.length > 0) {
                context.commit("setInProgress", { inProgress: true, message: "publishing documents to PRIM inprogress..." });
                const payloadData = {};
                payloadData.result = {};
                payloadData.result.item = store.state.componentDetails;
                payloadData.result.documentUsageAreas = {};
                for (const usage of usages) {
                    for (const doc of store.state.componentTable.rows[usage]) {
                        if (doc.documentUsage.length === 0) {
                            context.dispatch("displayAlert", { type: "error", text: i18n.global.t("DocumentUsageAreaEmpty", { usage: usage }), active: true });
                            context.commit("setInProgress", { inProgress: false, message: "" });
                            return;
                        }
                    }
                    payloadData.result.documentUsageAreas["usageArea" + usage] = store.state.componentTable.rows[usage];
                }
                const securityContextPref = widget.getPreference("__platformSecurityContext");
                const headerWAF = {
                    SecurityContext: securityContextPref.value
                };
                const payload = {
                    headers: headerWAF,
                    type: "json",
                    method: "POST",
                    data: payloadData
                };
                let response = {};
                try {
                    response = await call3DSpaceWithTraces("/resources/eri/v1/InformationStructurePublish", payload);
                } catch (error) {
                    console.log("error: ", error);
                    response.error = prepareUserMessageFromError(error, "Issue during publish structure");
                }
                console.log("publishDocumentsToPRIM :: ", response);
                if (response) {
                    if (response.error) {
                        context.dispatch("displayAlert", { type: "error", text: response.error, active: true });
                    } else if (response["1"]) {
                        context.dispatch("displayAlert", { type: "error", text: response["1"], active: true });
                    } else {
                        context.dispatch("displayAlert", { type: "success", text: response["0"], active: true });
                    }
                }
                context.commit("setInProgress", { inProgress: false, message: "" });
            }
        },
        
            async fetchTableData() {
                try {
                    // Assuming you have an API endpoint to fetch table data
                    const response = await fetch('https://example.com/api/table-data');
                    if (!response.ok) {
                        throw new Error('Failed to fetch table data');
                    }
                    const jsonData = await response.json();
                    const { headers, items } = jsonData;
                    this.headers = headers;
                    this.desserts = items; 
                    console.log(jsonData);
                    // Handle jsonData as needed, e.g., update component state with the fetched data
                } catch (error) {
                    console.error(error);
                    // Handle error appropriately, e.g., display an error message
                }
            },
        
        
        downloadHighestRevDocFromPRIM: async function(context, doc) {
            if (doc) {
                try {
                    const securityContextPref = widget.getPreference("__platformSecurityContext");
                    const headerWAF = {
                        SecurityContext: securityContextPref.value
                    };
                    const payload = {
                        headers: headerWAF,
                        method: "GET"
                    };
                    context.commit("setInProgress", { inProgress: true, message: `Retriveing highest document of ${doc.documentNumber}...` });
                    const response = await call3DSpaceWithTraces(`/resources/eri/v1/searchDocumentsFromPRIM?documentNumber=${encodeURIComponent(doc.documentNumber)}&revision=Highest`, payload);

                    // const response = {"count":1,"data":[{"documentTitle":"General quality requirements on components","documentStatus":"Released","documentResponsibleOrganization":"BNEPGB","documentInformation":"General quality requirements on components","genericURL":"https://document-acc.internal.ericsson.com/Download?DocNo=10563-2031&Rev=T&lang=en&Status=FREE","languageIssue":"en","globalDocumentVersion":"T","documentNumber":"10563-2031","documentDecimalClass":"10563","documentAccessClassification":"Readable","documentType":"Quality Specification"}]};

                    console.log(">>> response : ", response);
                    if (response) {
                        if (response.data) {
                            const data = response.data[0];
                            if (data) {
                                const url = data.genericURL;
                                console.log(">>> url : ", url);
                                window.open(url, "_blank").focus();
                            }
                        }
                    }
                } catch (error) {
                    console.error(error);
                    const errMSG = prepareUserMessageFromError(error, `Error when retriveing highest document of ${doc.documentNumber}`);
                    context.dispatch("displayAlert", { type: "error", text: errMSG, active: true });
                }
                context.commit("setInProgress", { inProgress: false, message: "" });
            }
        }
    }
});
export default store;
