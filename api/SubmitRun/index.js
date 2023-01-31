const sql = require('mssql');

const path = require('path');

require('dotenv').config()

const configwrite = {
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

const configread = {
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

var youtubeCode = '';

module.exports = async function (context, req) {
	try {
		var input = req.body;
		var inputArray = input.split("@!@!@");
		var playerName = inputArray[0];
		var characterName = inputArray[1];
		var serverID = inputArray[2];
		var mainClass = inputArray[3];
		var subClass = inputArray[4];
		var weapon1 = inputArray[5];
		var weapon2 = inputArray[6];
		if(weapon2 == null) {
			weapon2 = "NULL";
		}
		var weapon3 = inputArray[7];
		if(weapon3 == null) {
			weapon3 = "NULL";
		}
		var weapon4 = inputArray[8];
		if(weapon4 == null) {
			weapon4 = "NULL";
		}
		var weapon5 = inputArray[9];
		if(weapon5 == null) {
			weapon5 = "NULL";
		}
		var weapon6 = inputArray[10];
		if(weapon6 == null) {
			weapon6 = "NULL";
		}
		var region = inputArray[11];
		var rank = inputArray[12];
		var timeMins = inputArray[13];
		var timeSecs = inputArray[14];
		var patch = inputArray[15];
		var link = inputArray[16];
		var notes = inputArray[17]
		var userID = inputArray[18];
		//console.log(inputArray);
	
		var strsec = Number(timeSecs).toString();
		if (strsec.length < 2) {
			//console.log("REE");
			strsec = '0' + strsec;
		}
		var strmin = Number(timeMins).toString();
		if (strmin.length < 2) {
			//console.log("REE");
			strmin = '0' + strmin;
		}
		var time = strmin+':'+strsec+':00';
		//console.log(time);
		// For testing.
		var urls = [
				link
		];
			
		var i, r, rx = /^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]{7,15})(?:[\?&][a-zA-Z0-9\_-]+=[a-zA-Z0-9\_-]+)*$/;
			
		for (i = 0; i < urls.length; ++i) {
			r = urls[i].match(rx);
			//console.log(r[1]);
			youtubeCode = r[1];
		}

		//console.log(youtubeCode);
		var youtubeLink = `https://youtu.be/` + youtubeCode;

		var poolConnectionRead = await sql.connect(configread);

		var sqlQuery = `SELECT Link FROM Purples.Solo WHERE Link = @Link`;

		var results = await poolConnectionRead.request().input('Link',sql.NVarChar, youtubeLink).query(sqlQuery);

		//console.log(results.rowsAffected[0]);

		if (results.rowsAffected != 0) {
			poolConnectionRead.close();
			context.res = {
				contentType: "application/json",
					status: 200, /* Defaults to 200 */
					body: "Error"
			};
			return;
		}
		sqlQuery = `SELECT Link FROM Submissions.Pending WHERE Link = @Link`;
		results = await poolConnectionRead.request().input('Link',sql.NVarChar, youtubeLink).query(sqlQuery);
		if (results.rowsAffected != 0) {
			poolConnectionRead.close();
			context.res = {
				contentType: "application/json",
					status: 200, /* Defaults to 200 */
					body: "Error"
			};
			return;
		}

		sqlQuery = `
		SELECT Players.Information.PlayerID
		FROM Players.Information

		INNER JOIN
		Players.Customization ON Players.Customization.PlayerID = [Players].[Information].[PlayerID]
		
		WHERE
		Players.Information.PlayerName = @pn`;

		results = await poolConnectionRead.request().input('pn',sql.NVarChar,playerName).query(sqlQuery);

		if (results.rowsAffected == 0) {
			if(region == 'japan') {
				var playerID = 107;
			}
			if(region == 'global') {
				var playerID = 106;
			}
		}
		else {
			var playerID = results.recordset[0].PlayerID;
		}

		sqlQuery = `
		SELECT Users.Information.PlayerID
		FROM Users.Information
		
		WHERE
		Users.Information.UserID = @uid`

		results = await poolConnectionRead.request().input('uid',sql.NVarChar,userID).query(sqlQuery);

		var submitID = results.recordset[0].PlayerID;

		poolConnectionRead.close();

		var poolConnectionWrite = await sql.connect(configwrite);

		var sqlQuery = `

        INSERT INTO 
        Submissions.Pending (PlayerID,RunCharacter,Patch,Region,Rank,Time,MainClass,SubClass,W1,W2,W3,W4,W5,W6,Link,Notes,SubmissionTime,SubmitterID,ServerID)
        VALUES (@0,@1,@2,@3,@4,@5,@6,@7,@8,@9,@10,@11,@12,@13,@14,@15,@16,@17,@18);`;
		var date = new Date();

		await poolConnectionWrite.request().input('0',sql.Int,playerID).input('1',sql.NVarChar,characterName).input('2',sql.NVarChar,patch).input('3',sql.NVarChar,region).input('4',sql.Int,rank).input('5',sql.NVarChar,time).input('6',sql.NVarChar,mainClass).input('7',sql.NVarChar,subClass).input('8',sql.NVarChar,weapon1).input('9',sql.NVarChar,weapon2).input('10',sql.NVarChar,weapon3).input('11',sql.NVarChar,weapon4).input('12',sql.NVarChar,weapon5).input('13',sql.NVarChar,weapon6).input('14',sql.NVarChar,youtubeLink).input('15',sql.NVarChar,notes).input('16',sql.DateTime,date).input('17',sql.Int,submitID).input('18',sql.NVarChar,serverID).query(sqlQuery);

		poolConnectionWrite.close();

	}
	catch (err) {
		console.error(err.message);
	}
}
