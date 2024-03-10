import { call3DSpace } from "platform-connectors";

export async function call3DSpaceWithTraces(url, opt) {
    let postBody = "";
    if (opt && opt.data) postBody = opt.data;

    let method = "GET";
    if (opt && opt.method) method = opt.method;

    if (method === "GET") console.log(`EPI : CALLING 3DSpace ${method} "${url}"`); // eslint-disable-line no-console
    else {
        console.log(`EPI : CALLING 3DSpace ${method} "${url}" with payload :`); // eslint-disable-line no-console
        console.log(postBody); // eslint-disable-line no-console
    }

    const returnInfo = await call3DSpace(url, opt);

    console.log("EPI : RESPONSE from 3DSpace :"); // eslint-disable-line no-console
    console.log(returnInfo); // eslint-disable-line no-console

    return returnInfo;
}

/* const memberMatches = function(member, identificationKey, identificationValue) {
    // Carefull : this function only works for EngItems!!
    if (identificationKey === "partNumber") {
        if (member["dseng:EnterpriseReference"] && member["dseng:EnterpriseReference"].partNumber) {
            return (member["dseng:EnterpriseReference"].partNumber === identificationValue);
        } else return false;
    } else return (member[identificationKey] === identificationValue);
}; */

export async function searchEngItem(identificationField, identificationValue) {
    let searchField;

    if (identificationField === "partNumber") searchField = "bo_46_enterpriseextension_46_v_95_partnumber";
    else if (identificationField === "title") searchField = "bo_46_plmentity_46_v_95_name";
    else if (identificationField === "name") searchField = "bo_46_plmentity_46_plm_95_externalid";
    else if (identificationField === "physicalid") searchField = "physicalid";
    else searchField = `bo_46_${identificationField.toLowerCase().replaceAll("_", "_95_").replaceAll(".", "_46_")}`;

    const searchString = `${searchField}:"${identificationValue}"`;

    const searchResponse = await call3DSpaceWithTraces(`/resources/v1/modeler/dseng/dseng:EngItem/search?$mask=dsmveng:EngItemMask.Details&$searchStr=${searchString}`);

    const ids = [];
    const returnList = [];
    searchResponse.member.forEach(foundEngItem => {
        // if (memberMatches(foundItem, identificationField, identificationValue)) returnList.push(foundItem);
        // NOTE : I don't do this check any more because it will not work for custom attributes...
        const engItem = {
            ...foundEngItem
        };

        // Part Number
        if (engItem["dseng:EnterpriseReference"] && engItem["dseng:EnterpriseReference"].partNumber) {
            engItem.partNumber = engItem["dseng:EnterpriseReference"].partNumber;
        } else engItem.partNumber = "";
        delete engItem["dseng:EnterpriseReference"];

        ids.push(engItem.id);

        returnList.push(engItem);
    });

    return returnList;
}

export async function getEngItemDetails(id, getInterfaces) {
    const searchResponse = await call3DSpaceWithTraces(`/resources/v1/modeler/dseng/dseng:EngItem/${id}?$mask=dsmveng:EngItemMask.Details&$fields=dsmvcfg:attribute.isConfigured,dsmveno:SupportedTypes,dsmveno:CustomerAttributes,dsmvxcad:attribute.ECADExtension`);

    const ids = [];
    const returnList = [];
    searchResponse.member.forEach(foundEngItem => {
        const engItem = {
            ...foundEngItem
        };

        // Part Number
        if (engItem["dseng:EnterpriseReference"] && engItem["dseng:EnterpriseReference"].partNumber) {
            engItem.partNumber = engItem["dseng:EnterpriseReference"].partNumber;
        } else engItem.partNumber = "";
        delete engItem["dseng:EnterpriseReference"];

        if (getInterfaces) {
            engItem.interfaces = engItem.ECADExtension;
        }

        ids.push(engItem.id);

        returnList.push(engItem);
    });

    return returnList;
}

export async function get3DPartDetails(id, getInterfaces) {
    const readResponse = await call3DSpaceWithTraces(`/resources/v1/modeler/dsxcad/dsxcad:Part/${id}?$mask=dsmvxcad:xCADPartMask.EnterpriseDetails&$fields=dsmveno:CustomerAttributes,dsmvxcad:attribute.ECADExtension`);

    const ids = [];
    const returnList = [];
    readResponse.member.forEach(foundEngItem => {
        const engItem = {
            ...foundEngItem
        };

        // Part Number
        if (engItem["dseng:EnterpriseReference"] && engItem["dseng:EnterpriseReference"].partNumber) {
            engItem.partNumber = engItem["dseng:EnterpriseReference"].partNumber;
        } else engItem.partNumber = "";
        delete engItem["dseng:EnterpriseReference"];

        if (getInterfaces) {
            engItem.interfaces = engItem.ECADExtension;
        }

        ids.push(engItem.id);

        returnList.push(engItem);
    });

    return returnList;
}

export async function getEngItemChildren(id) {
    const childEngItems = [];

    const objectInfo = await call3DSpaceWithTraces(`/resources/v1/modeler/dseng/dseng:EngItem/${id}/dseng:EngInstance?$mask=dsmveng:EngInstanceMask.Details`);
    console.log("====== objectInfo =========");
    console.log(objectInfo);
    if (objectInfo && objectInfo.member && objectInfo.member.length && objectInfo.member.length > 0) {
        for (const childInstInfo of objectInfo.member) {
            if (childInstInfo.referencedObject && childInstInfo.referencedObject.id && (childInstInfo.referencedObject.type && childInstInfo.referencedObject.type === "dsxcad:Part")) {
                const instance = {
                    ...childInstInfo,
                    referenceID: childInstInfo.referencedObject.id,
                    referenceType: childInstInfo.referencedObject.type
                };

                delete instance.referencedObject;
                childEngItems.push(instance);
                break;
            };
        }
    }
    console.log("====== childEngItems =========");
    console.log(childEngItems);
    return childEngItems;
}

export async function createEngItem(info) {
    let requestData = {};
    let engItem = {};
    let attributes = {};

    if (!info.customType && !info.customAttributes) {
        attributes = {
            title: info.title || "",
            description: info.description || ""
        };

        if (info.partNumber) {
            attributes["dseng:EnterpriseReference"] = {
                partNumber: info.partNumber
            };
        }
    } else {
        const customerAttributes = {};
        if (info.customAttributes) {
            for (const customAttribute of info.customAttributes) {
                customerAttributes[customAttribute.name] = customAttribute.value;
            }
        }

        attributes = {
            title: info.title || "",
            description: info.description || "",
            customerAttributes: customerAttributes
        };
    }

    if (
        info.interface === "PCBPhysicalComponent" ||
        info.interface === "CBDBoard" ||
        info.interface === "CBDAssembly"
    ) {
        const extention = "dsxcad:" + info.interface;
        attributes[extention] = {};
    }

    engItem = {
        type: info.customType || "VPMReference",
        attributes: attributes
    };

    requestData = {
        items: [
            engItem
        ]
    };
    const responseData = await call3DSpaceWithTraces("/resources/v1/modeler/dseng/dseng:EngItem?$mask=dsmveng:EngItemMask.Details", { method: "POST", data: requestData });
    const engItemID = responseData.member[0].id;
    return engItemID;
}

export async function createEngInstance(parentEngItemID, childEngItemID, info) {
    const requestData = {
        instances: [
            {
                referencedObject: {
                    source: "$3DSpace",
                    type: "VPMReference",
                    id: childEngItemID,
                    relativePath: `resource/v1/dseng/dseng:EngItem/${childEngItemID}`
                }
            }
        ]
    };

    const responseData = await call3DSpaceWithTraces(`/resources/v1/modeler/dseng/dseng:EngItem/${parentEngItemID}/dseng:EngInstance`, { method: "POST", data: requestData });

    return responseData.member[0].id;
}

export async function publishAssemblyStrToPRRIM(rootObjectId) {
    console.log("Inside publishAssemblyStrToPRRIM  with model for id : " + rootObjectId + " with model : ");
    //const responseData = await call3DSpaceWithTraces(`/resources/eri/widgets/ElectricalData/Assembly/${rootObjectId}`, { method: "POST" });
    const responseData = await call3DSpaceWithTraces(`/resources/eri/v1/ProductStructurePublish/${rootObjectId}`, { method: "POST" });
    return responseData;
}

export async function generateAndAssignGPI(objectId, objectModel) {
    console.log("Inside Generate GPI with model for id : " + objectId + " with model : "); // eslint-disable-line no-console
    console.log(objectModel); // eslint-disable-line no-console

    const physicalId = objectId;
    const autoGenerateProductNumber = objectModel["ERI_GlobalProductNumber.AutoAssign"] ? objectModel["ERI_GlobalProductNumber.AutoAssign"] : false;
    const productNumberPrefix = objectModel["ERI_GlobalProductNumber.Prefix"];
    const productNumberBaseNumber = objectModel["ERI_GlobalProductNumber.BaseNumber"] ? objectModel["ERI_GlobalProductNumber.BaseNumber"] : "";
    const productNumberSuffix = objectModel["ERI_GlobalProductNumber.Suffix"];

    const productVersionLetter = objectModel["ERI_GlobalProductVersion.VersionLetter"];
    const productVersionNumber = objectModel["ERI_GlobalProductVersion.VersionNumber"];

    const abcClass = objectModel["ERI_GlobalProductNumber.ABCClass"];
    const abcType = objectModel["ERI_GlobalProductNumber.ABCType"];

    let customProductNumber = productNumberBaseNumber;

    if (productNumberPrefix) {
        customProductNumber = productNumberPrefix + "/" + customProductNumber;
    }

    if (productNumberSuffix) {
        customProductNumber = customProductNumber + "/" + productNumberSuffix;
    }

    let prodVersionLabel = "";

    if (productVersionLetter && productVersionNumber) {
        prodVersionLabel = productVersionLetter + productVersionNumber;
    }
    let responseData;
    if ((autoGenerateProductNumber || customProductNumber) && prodVersionLabel && physicalId) {
        const requestData = {
                    autoGenerateProductNumber: autoGenerateProductNumber,
                    abcClass: abcClass,
                    abcType: abcType,
                    globalProductNumber: customProductNumber,
                    productNumberBaseNumber: productNumberBaseNumber,
                    globalProductVersion: prodVersionLabel

                };
        console.log("Sending Request for GPI with Payload : "); // eslint-disable-line no-console
        console.log(requestData); // eslint-disable-line no-console

        responseData = await call3DSpaceWithTraces(`/resources/eri/widgets/ElectricalData/Hardwares/${physicalId}`, { method: "PATCH", data: requestData });
        // responseData = requestData;
        console.log("Response of GPI Service : " + responseData); // eslint-disable-line no-console
    } else {
        console.log("Invalid Inputs. No call to GPI Service for object id : " + physicalId); // eslint-disable-line no-console
    }

    return responseData;
}

export async function create3DPart(info) {
    console.log("Creating 3DPart");
    let engItemID;
    let attributes = {};
    let requestData = {};
    let engItem = {};

    // Get the checkin ticket
    const checkinData = {
        FileNumber: "2",
        TicketNumber: "1",
        Type: "dsxcad:Part"
    };
    const responseCheckinTicket = await call3DSpaceWithTraces("/resources/v1/modeler/dsxcad/CheckinTicket", { method: "POST", data: checkinData });
    console.log("Checkin ticket is received");
    // Retrive the file checkin URL, checkin ticket and parameter name
    const fcsURL = responseCheckinTicket.ticketURL;
    const checkinTicket = responseCheckinTicket.tickets[0];
    const checkinTicketParam = responseCheckinTicket.jobticket;

    // Checking in Authoring and Visualization files to FCS - START
    // Getting EMPTY-DUMMY files
    //const cgrFileBlob = (await fetch("../static/VisuFile.cgr")).blob;
    //const stepFileBlob = (await fetch("../static/AuthoringFile.cgr")).blob;
    const cgrFileBlob = new Blob([]);
    const stepFileBlob = new Blob([]);

    const formdata = new FormData();
    formdata.append(checkinTicketParam, checkinTicket);
    formdata.append("file", cgrFileBlob, "VisuFile.cgr");
    formdata.append("filename", "VisuFile.cgr");
    formdata.append("file", stepFileBlob, "AuthoringFile.STEP");
    formdata.append("filename", "AuthoringFile.STEP");
    const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow"
    };

    const responseFileCheckin = await fetch(fcsURL, requestOptions)
    .then(response => response.text())
    .then(result => {
        return result;
    })
    .catch(error => {
        throw error;
    });
    console.log("Authoring and Visualization files are checked in");
    // Checking in Authoring and Visualization files to FCS - END

    // Preparing to create 3DPart object

    const cadOrigin = "CADENCEPULSE";
    const authoringFileName = "AuthoringFile.STEP";
    const visualizationFileName = "VisuFile.cgr";
    const md5EmtyFile = "D41D8CD98F00B204E9800998ECF8427E";

    if (!info.customType && !info.customAttributes) {
        attributes = {
            title: info.title || "",
            description: info.description || "",
            "dsxcad:xCADAttributes": {
                cadorigin: cadOrigin
            },
            "dsxcad:AuthoringFile": {
                filename: authoringFileName,
                receipt: responseFileCheckin,
                MD5: md5EmtyFile
            },
            "dsxcad:VisualizationFile": {
                filename: visualizationFileName,
                receipt: responseFileCheckin,
                MD5: md5EmtyFile
            }
        };
        if (info.partNumber) {
            attributes["dseng:EnterpriseReference"] = {
                partNumber: info.partNumber
            };
        }
    } else {
        const customerAttributes = {};
        if (info.customAttributes) {
            for (const customAttribute of info.customAttributes) {
                customerAttributes[customAttribute.name] = customAttribute.value;
            }
        }
        attributes = {
            title: info.title || "",
            description: info.description || "",
            "dsxcad:xCADAttributes": {
                cadorigin: cadOrigin
            },
            "dsxcad:AuthoringFile": {
                filename: authoringFileName,
                receipt: responseFileCheckin,
                MD5: md5EmtyFile
            },
            "dsxcad:VisualizationFile": {
                filename: visualizationFileName,
                receipt: responseFileCheckin,
                MD5: md5EmtyFile
            },
            customerAttributes: customerAttributes
        };
    }
    if (
        info.interface === "PCBPhysicalComponent" ||
        info.interface === "CBDBoard" ||
        info.interface === "CBDAssembly"
    ) {
        const extention = "dsxcad:" + info.interface;
        attributes[extention] = {};
    }

    engItem = {
        type: info.customType || "VPMReference",
        attributes: attributes
    };

    requestData = {
        items: [
            engItem
        ]
    };
    if (responseFileCheckin) {
        const responseData = await call3DSpaceWithTraces("/resources/v1/modeler/dsxcad/dsxcad:Part?$mask=dsmvxcad:xCADPartMask.EnterpriseDetails", { method: "POST", data: requestData });
        engItemID = responseData.member[0].id;
    }
    console.log("3DPart is created: " + engItemID);

    return engItemID;
}
