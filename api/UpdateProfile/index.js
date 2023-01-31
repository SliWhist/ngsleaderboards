const sql = require('mssql');
const { userInfo } = require('os');

const path = require('path');

require('dotenv').config()

const config = {
	user: process.env.DB_SUBMIT_USER, // better stored in an app setting such as process.env.DB_USER
	password: process.env.DB_SUBMIT_PASSWORD, // better stored in an app setting such as process.env.DB_PASSWORD
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
        console.log(req.body);
        var input = req.body;
		var inputArray = input.split("@!@!@!@");
        var CharacterName = inputArray[0];
        if(CharacterName == '') {
			CharacterName = null;
		}       
        var NamePref = inputArray[1];
        var ShipSelected = inputArray[2];
        if(ShipSelected == '') {
			ShipSelected = null;
		}       
        var country = inputArray[3];
        if(country == '') {
			country = null;
		}
        var color1 = inputArray[4];
        if(color1 == '') {
			color1 = null;
		}
        var color2 = inputArray[5];
        if(color2 == '') {
			color2 = null;
		}
        var NameColorMode = inputArray[6];
        var YT1Link = inputArray[7];
        if(YT1Link == '') {
			YT1Link = null;
		}
        var YT2Link = inputArray[8];
        if(YT2Link == '') {
			YT2Link = null;
		}
        var TwitchLink = inputArray[9];
        if(TwitchLink == '') {
			TwitchLink = null;
		}
        var TwitterLink = inputArray[10];
        if(TwitterLink == '') {
			TwitterLink = null;
		}
        var DiscordLink = inputArray[11];
        if(DiscordLink == '') {
			DiscordLink = null;
		}
        var userID = inputArray[12];

        var poolConnection = await sql.connect(config);

        var sqlGetID = `
        
        SELECT
        PlayerID
        FROM
        Users.Information
        WHERE
        UserID = @0

        `
        var results = await poolConnection.request().input('0',sql.NVarChar, userID).query(sqlGetID);
        
        var sqlUpdate = `
        
            UPDATE Players.Information

            SET

            CharacterName = @1,
            Youtube = @2,
            Youtube2 = @3,
            Twitch = @4,
            Twitter = @5,
            Discord = @6

            WHERE PlayerID = @0;
            
         `
    
        await poolConnection.request().input('0',sql.Int, results.recordset[0].PlayerID).input('1',sql.NVarChar,CharacterName).input('2',sql.NVarChar,YT1Link).input('3',sql.NVarChar,YT2Link).input('4',sql.NVarChar,TwitchLink).input('5',sql.NVarChar,TwitterLink).input('6',sql.NVarChar,DiscordLink).query(sqlUpdate);

        console.log("PASSED");
		
		sqlUpdate = `
        
            UPDATE Players.Customization

            SET

            PreferredName = @1,
            Ship = @2,
            Flag = @3,
            NameType = @4,
            NameColor1 = @5,
            NameColor2 = @6

            WHERE PlayerID = @0;
            
         `
			
		await poolConnection.request().input('0',sql.Int, results.recordset[0].PlayerID).input('1',sql.Int, NamePref).input('2',sql.Int, ShipSelected).input('3',sql.NVarChar, country).input('4',sql.Int, NameColorMode).input('5',sql.NVarChar, color1).input('6',sql.NVarChar, color2).query(sqlUpdate);
		

		//console.log(returner);
		poolConnection.close();

		//returner = context.req.body;
		
        	// context.res.status(200).json(returner);
		context.res = {
			contentType: "application/json",
    			status: 200, /* Defaults to 200 */
    			body: null
		};
	
	}
	catch (err) {
		console.error(err.message);
	}
}
