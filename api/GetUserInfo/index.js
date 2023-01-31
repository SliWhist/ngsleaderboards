module.exports = async function (context, req) {
    console.log(req.body);
    const urlParams = new URL(req.body).searchParams;
    console.log(urlParams);
    console.log(urlParams.get('id'));
}