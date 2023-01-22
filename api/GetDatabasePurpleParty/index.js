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
        	var partysize = inputArray[3];
        	var region = inputArray[0];
        	var rank = inputArray[2];
            var gamepatch = inputArray[4];
            var serverFilter = inputArray[5];
		var poolConnection = await sql.connect(config);
		
        var patchQuery = 'AND Patch IS NULL ';
        var serverQuery = '';

        if(gamepatch != 'none') {
            patchQuery = "AND Patch = @PatchInput ";
        }
        if(serverFilter != 'none') {
            serverQuery = "AND RunServer = @ServerInput ";
        }

		switch (partysize) {
			case 'duo':
				partysize = 2;
				break;
			case 'trio':
				partysize = 3;
				break;
			case 'party':
				partysize = 4;
				break;
		}

		var sqlQuery = `

        SELECT

            COALESCE(STRING_AGG([RunCharacterName], '@@@'),'No Scores') as RunCharacterName,
            COALESCE(STRING_AGG(ShipOverride, '@@@'),'') as ShipOverride,
            COALESCE(STRING_AGG(MainClass, '@@@'),'') as MainClass,
            COALESCE(STRING_AGG(SubClass, '@@@'),'') as SubClass,
            COALESCE(STRING_AGG(CONCAT_WS(' ', WeaponInfo1, WeaponInfo2, WeaponInfo3, WeaponInfo4, WeaponInfo5, WeaponInfo6), '@@@'),'') as WeaponInfo,
            COALESCE(CONVERT(VARCHAR(5), MAX(time), 108),'') as Time,
            STRING_AGG(COALESCE(LinkPOV, 'partynull'), '@@@') as LinkPOV,
            MAX(Notes) as Notes,
            MAX(Purples.Party.RunID) as RunID,

            STRING_AGG([Players].[Information].[PlayerID], '@@@') as PlayerID,
            STRING_AGG([Players].[Information].[PlayerName], '@@@') as PlayerName,
            STRING_AGG(COALESCE([Players].[Information].[CharacterName], 'partynull'), '@@@') as CharacterName,
            STRING_AGG(COALESCE([Players].[Information].[Description], 'partynull'), '@@@') as Description,
            STRING_AGG(COALESCE([Players].[Information].[Youtube], 'partynull'), '@@@') as Youtube,
            STRING_AGG(COALESCE([Players].[Information].[Twitch], 'partynull'), '@@@') as Twitch,
            STRING_AGG(COALESCE([Players].[Information].[Twitter], 'partynull'), '@@@') as Twitter,
            STRING_AGG(COALESCE([Players].[Information].[Discord], 'partynull'), '@@@') as Discord,

            STRING_AGG(PreferredName, '@@@') as PreferredName,
            STRING_AGG(COALESCE(Server, 'partynull'), '@@@') as Server,
            STRING_AGG(COALESCE(Ship, '99'), '@@@') as Ship,
            STRING_AGG(COALESCE(Flag, 'partynull'), '@@@') as Flag,
            STRING_AGG(COALESCE(BackgroundType, '99'), '@@@') as BackgroundType,
            STRING_AGG(COALESCE(BackgroundImage, 'partynull'), '@@@') as BackgroundImage,
            STRING_AGG(COALESCE(BackgroundColor, 'partynull'), '@@@') as BackgroundColor,
            STRING_AGG(COALESCE(NameType, '99'), '@@@') as NameType,
            STRING_AGG(COALESCE(NameColor1, 'partynull'), '@@@') as NameColor1,
            STRING_AGG(COALESCE(NameColor2, 'partynull'), '@@@') as NameColor2

        FROM Purples.Party
            INNER JOIN
            Purples.PartyRunners ON Purples.PartyRunners.RunID = Purples.Party.RunID
            INNER JOIN
            Players.Information ON Players.Information.PlayerID = Purples.PartyRunners.PlayerID
            INNER JOIN
            Players.Customization ON Players.Customization.PlayerID = Purples.PartyRunners.PlayerID

        WHERE
            Rank = @RankInput
            AND
            Region = @RegionInput
			AND
            PartySize = @PartySize
			`+ patchQuery + serverQuery + `

        GROUP BY Purples.Party.RunID

        ORDER BY MAX(time) ASC
		`;
			
		var results = await poolConnection.request().input('ServerInput',sql.VarChar, serverFilter).input('PartySize', sql.Int, partysize).input('RegionInput', sql.VarChar, region).input('RankInput', sql.Int, rank).input('PatchInput', sql.VarChar, gamepatch).query(sqlQuery);
		
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
