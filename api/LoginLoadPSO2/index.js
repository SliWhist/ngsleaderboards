const sql = require('mssql');

const path = require('path');

require('dotenv').config()

const config = {
	user: process.env["DB_USER"], // better stored in an app setting such as process.env.DB_USER
	password: process.env["DB_PASSWORD"], // better stored in an app setting such as process.env.DB_PASSWORD
	server: process.env["DB_SERVER"], // better stored in an app setting such as process.env.DB_SERVER
	database: process.env["DB_NAME"], // better stored in an app setting such as process.env.DB_NAME
	authentication: {
		type: 'default'
	},
	options: {
		encrypt: true
	}
}

module.exports = async function (context, req) {

	try {
		
        const userID = req.body;
        
        var data = {
            "version": "1.0.0",
            "action": "Continue",
            "extension_playerDisplayname": req.body, // return claim
            //"playerNametype" : `"` + nameType + `"`,
            //"playerNamecolor1" : `"` + nameColor1 + `"`,
            "extension_playerNamecolor2" : "burp"
        }

        data = JSON.stringify(data);
        data = JSON.parse(data);

        //data = JSON.stringify(data);
        //data = JSON.parse(data);
        console.log(data);
        context.res = {
            contentType: "application/json",
                status: 200, /* Defaults to 200 */
                body: data
        };

    }
    catch (err) {
		console.error(err.message);
        var data = {
            "version": "1.0.0",
            "action": "Continue",
        }
	}

}