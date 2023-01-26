module.exports = async function (context, req) {

    var data = {
        "roles": [
          "Reader",
          "Contributor"
        ]
      }

    data = JSON.stringify(data);
    data = JSON.parse(data);

    context.res = {
        contentType: "application/json",
            status: 200, /* Defaults to 200 */
            body: data
    };

}