const express = require("express");

const sql = require('mssql');

const path = require('path');

const app = express();

require('dotenv').config()

app.use(express.static('files'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
});

app.listen(5000, () => {
  console.log('Listening on port ' + 5000);
});

	
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
	
console.log("Connecting to PSO2Central...");  
	
  
async function getPurpleFromDB(region,mainclass,rank,partysize) {
	try {
		
		var addQuery = ' '
		
		console.log(mainclass);
		console.log(partysize);
		
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
		
/* 		console.log(`${results.recordset.length} rows returned.`);
		
        // output column headers
        var columns = "";
        for (var column in results.recordset.columns) {
            columns += column + ", ";
        }
        console.log("%s\t", columns.substring(0, columns.length - 2));

        // ouput row contents from default record set
        results.recordset.forEach(row => {
            console.log("%s\t%s", row.time, row.runner);
        }); */
		
		var returner = results.recordset;
		console.log(returner);
		poolConnection.close();
		
	
	}
	catch (err) {
		console.error(err.message);
	}
	console.log("test complete");
	
	return returner;
}
		
		
  
app.post("/purple", (req, res) => {
	console.log(req.body);
	getPurpleFromDB(req.body.reg, req.body.mc, req.body.rnk, req.body.psize).then((value) => { res.json(value); });
})