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
        var runid = req.body;
		var sqlQuery = `

        SELECT 

            run.RunCharacterName as VideoName,
            run.Notes as Notes,
            pi.PlayerName as PlayerName,
            pi.CharacterName as CharacterName,
            pc.Ship as Ship,
            pc.Server as Server,
            pc.Flag as Flag,

            pc.NameType as NameType,
            pc.NameColor1 as NameColor1,
            pc.NameColor2 as NameColor2,
            pc.PreferredName as NamePref,
            
            pi.Description as Description,
            pi.Youtube as Youtube,
            pi.Youtube2 as Youtube2,
            pi.Twitch as Twitch,
            pi.Twitter as Twitter,
            pi.Discord as Discord,

            si.PlayerName as SubPlayerName,
            si.CharacterName as SubCharacterName,

            sc.NameType as SubNameType,
            sc.NameColor1 as SubNameColor1,
            sc.NameColor2 as SubNameColor2,
            sc.PreferredName as SubNamePref

        FROM Purples.Solo AS run
        
        INNER JOIN

        Players.Information AS pi ON run.PlayerID = pi.PlayerID

        INNER JOIN
        Players.Customization AS pc ON run.PlayerID = pc.PlayerID

        INNER JOIN
        Players.Information AS si ON run.SubmitterID = si.PlayerID

        INNER JOIN
        Players.Customization AS sc ON run.SubmitterID = sc.PlayerID

        WHERE RunID = @inRunID`;
			
		var results = await poolConnection.request().input('inRunID', sql.Int, runid).query(sqlQuery);
		
		var returner = results.recordset;
		//console.log(returner);
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
