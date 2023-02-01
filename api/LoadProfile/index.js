const sql = require('mssql');

const path = require('path');

require('dotenv').config()

const config = {
	user: process.env.DB_USER, // better stored in an app setting such as process.env.DB_USER
	password: process.env.DB_PASSWORD, // better stored in an app setting such as process.env.DB_PASSWORD
	server: process.env.DB_SERVER, // better stored in an app setting such as process.env.DB_SERVER
	database: process.env.DB_NAME, // better stored in an app setting such as process.env.DB_NAME
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
        var userID = req.body;
		var sqlQuery = `

        SELECT 

            pi.PlayerName,
            pi.CharacterName,
            pi.Description,
            pi.Youtube,
            pi.Youtube2,
            pi.Twitch,
            pi.Twitter,
            pi.Discord,

            pc.PreferredName,
            pc.Server as Server,
            pc.Ship as Ship,
            pc.Flag as Flag,
            pc.NameType as NameType,
            pc.NameColor1 as NameColor1,
            pc.NameColor2 as NameColor2

        FROM Users.Information
        
        INNER JOIN
        Players.Information AS pi ON Users.Information.PlayerID = pi.PlayerID

        INNER JOIN
        Players.Customization AS pc ON Users.Information.PlayerID = pc.PlayerID

        WHERE UserID = @INuserID`;
			
		var results = await poolConnection.request().input('INuserID', sql.NVarChar, userID).query(sqlQuery);
		
		var returner = results.recordset;
		//console.log(returner[0].PreferredName);
		poolConnection.close();

		//returner = context.req.body;
		
        	// context.res.status(200).json(returner);
		context.res = {
			contentType: "application/json",
    			status: 200, /* Defaults to 200 */
    			body: returner
		};
	
	}
	catch (err) {
		console.error(err.message);
	}
}
