import { call3DSpaceWithTraces } from "./engItemUtilities";

// Method to call a service which returns range values for a given attribute
export async function getRangeValuesForAttribute(attribute) {
    const attributeName = attribute.fullName;
    let responseData;
    if (attribute.range.length > 0) {
        responseData = {
            attributeName: attributeName,
            range: attribute.range
        };
    } else {
        try {
            responseData = await call3DSpaceWithTraces(`/resources/eri/widgets/ElectricalData/Attributes/${attributeName}`, { method: "GET" });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            responseData = {
                attributeName: attributeName,
                range: attribute.range
            };
        }
    }
    return responseData;
}
