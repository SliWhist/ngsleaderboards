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
		var sqlQuery = `

        SELECT
        submit.RunID, 
        submit.PlayerID, 
        submit.RunCharacter, 
        submit.Patch, 
        submit.Region, 
        submit.Rank, 
        CONVERT(VARCHAR(5), submit.Time, 108) as Time, 
        submit.MainClass, 
        submit.SubClass, 
        CONCAT_WS(' ', submit.W1,submit.W2,submit.W3,submit.W4,submit.W5,submit.W6) as WeaponInfo, 
        submit.Link, 
        submit.Notes, 
        submit.SubmissionTime, 
        submit.SubmitterID,

        pi.PlayerName as PlayerName,
        pi.CharacterName as PlayerCName,
        pc.NameType as PlayerNameType,
        pc.NameColor1 as PlayerNameColor1,
        pc.NameColor2 as PlayerNameColor2,
        pc.Server as PlayerServer,
        pc.PreferredName as PlayerPrefN,

        si.PlayerName as SubmitterName,
        si.CharacterName as SubmitterCName,
        sc.NameType as SubmitterNameType,
        sc.NameColor1 as SubmitterNameColor1,
        sc.NameColor2 as SubmitterNameColor2,
        sc.PreferredName as SubmitterPrefN

        FROM Submissions.Pending AS submit
            
        INNER JOIN

        Players.Information AS pi ON submit.PlayerID = pi.PlayerID

        INNER JOIN
        Players.Customization AS pc ON submit.PlayerID = pc.PlayerID

        INNER JOIN
        Players.Information AS si ON submit.SubmitterID = si.PlayerID

        INNER JOIN
        Players.Customization AS sc ON submit.SubmitterID = sc.PlayerID

        WHERE SubmissionStatus != 1

        ORDER BY SubmissionTime ASC`;
			
		var results = await poolConnection.request().query(sqlQuery);
		
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
