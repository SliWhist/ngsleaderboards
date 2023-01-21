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
        var input = req.body;
		var inputArray = input.split("@!@!@");
        	var mainclass = inputArray[1];
        	var region = inputArray[0];
        	var rank = inputArray[2];
            var gamepatch = inputArray[4];
		var poolConnection = await sql.connect(config);
		
        var patchQuery = 'AND Patch IS NULL';
        var classQuery = '';

        if(mainclass != 'none') {
            classQuery = ` AND MainClass = @ClassInput `;
        }

        if(gamepatch != 'none') {
            patchQuery = "AND Patch = @PatchInput";
        }

		var sqlQuery = `

        SELECT
            [Players].[Information].[PlayerID],
            [Players].[Information].[PlayerName],
            [Players].[Information].[CharacterName],
            [Players].[Information].[Description],
            [Players].[Information].[Youtube],
            [Players].[Information].[Twitch],
            [Players].[Information].[Twitter],
            [Players].[Information].[Discord],

            PreferredName,
            Server,
            Ship,
            Flag,
            BackgroundType,
            BackgroundImage,
            BackgroundColor,
            NameType,
            NameColor1,
            NameColor2,

            RunID,
            [RunCharacterName],
            ShipOverride,
            MainClass,
            SubClass,
            CONCAT_WS(' ', WeaponInfo1, WeaponInfo2, WeaponInfo3, WeaponInfo4, WeaponInfo5, WeaponInfo6) as WeaponInfo,
            CONVERT(VARCHAR(5), time, 108) as Time,
            Link,
            Notes


        FROM Purples.Solo, Players.Information
            INNER JOIN
            Players.Customization ON Players.Customization.PlayerID = [Players].[Information].[PlayerID]

        WHERE
            Players.Information.PlayerID = Purples.Solo.PlayerID
            AND
            Rank = @RankInput
            AND
            Region = @RegionInput
            ` + classQuery + patchQuery + `
            
        ORDER BY time ASC`;
			
		var results = await poolConnection.request().input('ClassInput', sql.VarChar, mainclass).input('RegionInput', sql.VarChar, region).input('RankInput', sql.Int, rank).input('PatchInput', sql.VarChar, gamepatch).query(sqlQuery);
		
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
