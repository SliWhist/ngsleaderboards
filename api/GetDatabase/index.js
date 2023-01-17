const express = require("express");

const sql = require('mssql');

const path = require('path');

//const app = express();

require('dotenv').config()

//app.use(express.static('files'))
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

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
        	var partysize = inputArray[3];

		var addQuery = ' '
		
		if (mainclass != 'none' && partysize == 'solo') {
			addQuery = ' AND mainclass = @classFilter ';
			console.log("SOLO DETECTED, FILTERED");
		}
		
		var poolConnection = await sql.connect(config);
		
		console.log("Connected to PSO2Central! Reading data...");
		
		var sqlQuery = "";
		
		if (partysize == 'solo') {
			sqlQuery = "SELECT patch, runner, mainclass, subclass, CONCAT_WS(' ', weapon1, weapon2, weapon3, weapon4, weapon5, weapon6) as weapon, CONVERT(VARCHAR(5), time, 108) as time, link, notes FROM dbo.PurpleTriggerRuns WHERE rank = @rankIn AND region = @regionIn" + addQuery + "ORDER BY time ASC";
			var results = await poolConnection.request().input('classFilter', sql.VarChar, mainclass).input('rankIn', sql.Int, rank).input('regionIn', sql.VarChar, region).query(sqlQuery);
		}
		else if (partysize != 'solo') {
			var partySizeQuery = '';
			switch (partysize) {
				case "duo":
					partySizeQuery = 2;
					break;
				case "trio":
					partySizeQuery = 3;
					break;
				case "party":
					partySizeQuery = 4;
					break;
			}
			sqlQuery = "SELECT MAX(PurpleTriggerPartyRuns.patch) as patch, COALESCE(STRING_AGG(PurpleTriggerRunners.runner,'@@@'),'No Scores') as runner, COALESCE(STRING_AGG(PurpleTriggerRunners.mainclass,'@@@'),'') as mainclass, COALESCE(STRING_AGG(PurpleTriggerRunners.subclass,'@@@'),'') as subclass, COALESCE(STRING_AGG(CONCAT_WS(' ', weapon1, weapon2, weapon3, weapon4, weapon5, weapon6),'@@@'),'') as weapon, COALESCE(CONVERT(VARCHAR(5), MAX(PurpleTriggerPartyRuns.time), 108),'') as time, MAX(PurpleTriggerPartyRuns.link) as link, MAX(PurpleTriggerPartyRuns.notes) as notes FROM dbo.PurpleTriggerPartyRuns INNER JOIN dbo.PurpleTriggerRunners ON PurpleTriggerPartyRuns.id=PurpleTriggerRunners.partyID WHERE PurpleTriggerPartyRuns.rank = @rankIn AND PurpleTriggerPartyRuns.region = @regionIn AND PurpleTriggerPartyRuns.partysize = @partySizeIn ORDER BY MAX(PurpleTriggerPartyRuns.time) ASC";
			var results = await poolConnection.request().input('classFilter', sql.VarChar, mainclass).input('rankIn', sql.Int, rank).input('regionIn', sql.VarChar, region).input('partySizeIn', sql.Int, partySizeQuery).query(sqlQuery);
		}
		
		var returner = results.recordset;
		console.log(returner);
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
