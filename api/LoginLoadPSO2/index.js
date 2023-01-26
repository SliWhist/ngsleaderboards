module.exports = async function (context, req) {

    var data = {
        "version": "1.0.0",
        "action": "Continue",
        "postalCode": "value", // return claim
        "extension_PlayerID": "1", // return claim
        "extensionRunModerator": "2" // return claim
    }

    data = JSON.stringify(data);
    data = JSON.parse(data);

    context.res = {
        contentType: "application/json",
            status: 200, /* Defaults to 200 */
            body: data
    };

}