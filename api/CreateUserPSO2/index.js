const sql = require('mssql');

const path = require('path');

require('dotenv').config()

const config = {
	user: process.env["DB_SUBMIT_USER"], // better stored in an app setting such as process.env.DB_USER
	password: process.env["DB_SUBMIT_PASSWORD"], // better stored in an app setting such as process.env.DB_PASSWORD
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
		var poolConnection = await sql.connect(config);
        //console.log(req.body);
        const newUser = JSON.parse(req.body);
        //console.log(userID.userId);
        //console.log("BLEP")

		var sqlQuery = `

        INSERT INTO Players.Information(PlayerName)
        VALUES(@name)`;
			
		await poolConnection.request().input('name',sql.NVarChar, newUser.displayName).query(sqlQuery);

        sqlQuery = `
        
        SELECT PlayerID FROM Players.Information WHERE PlayerName = @name
        `;
        var results = await poolConnection.request().input('name',sql.NVarChar, newUser.displayName).query(sqlQuery);
		
		var playerIDRef = results.recordset[0].PlayerID;

        sqlQuery = `
        
        INSERT INTO Players.Customization(PlayerID,PreferredName,Server,NameColor1,NameColor2)
        VALUES(@PIDRef,0,@Region,'FFFFFF','FFFFFF')
        `;
        await poolConnection.request().input('PIDRef',sql.Int,playerIDRef).input('Region',sql.NVarChar,newUser.extension_ServerRegion).query(sqlQuery);

        sqlQuery = `
        
        INSERT INTO Users.Information(PlayerID,UserID)
        VALUES(@PIDRef,@UserID)
        `;

        await poolConnection.request().input('PIDRef',sql.Int,playerIDRef).input('UserID',sql.NVarChar,newUser.objectId).query(sqlQuery);

        var data = {
            "version": "1.0.0",
            "action": "Continue"
        }

        data = JSON.stringify(data);
        data = JSON.parse(data);

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