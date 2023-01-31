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
		var inputArray = input.split("@!@!@");
            var runID = inputArray[0];
            var playerID = inputArray[1];
        	var characterName = inputArray[2];
        	var patch = inputArray[3];
            var region = inputArray[4];
            var rank = inputArray[5];
            var time = inputArray[6];
            var mainClass = inputArray[7];
            var subClass = inputArray[8];
            var w1 = inputArray[9];
            var w2 = inputArray[10];
            if(w2 == null) {
                w2 = '';
            };
            var w3 = inputArray[11];
            if(w3 == null) {
                w3 = '';
            };
            var w4 = inputArray[12];
            if(w4 == null) {
                w4 = '';
            };
            var w5 = inputArray[13];
            if(w5 == null) {
                w5 = '';
            };
            var w6 = inputArray[14];
            if(w6 == null) {
                w6 = '';
            };
            var link = inputArray[15];
            var notes = inputArray[16];
            if(notes == null) {
                notes = '';
            }
            var submittime = inputArray[17];
            var userinfo = inputArray[18].split(",");
            var submitter = inputArray[19];

            if (userinfo == null) {
                console.log("RETURNED A");
                return;
                console.log("I never appear, hopefully!");
            }
            else if (userinfo != null)
            {

                if (!userinfo.includes('moderator') && !userinfo.includes('administrator')) {
                    console.log(userinfo);
                    console.log("RETURNED B");
                    return;
                    console.log("I never appear, hopefully!");

                }
            }

            var poolConnection = await sql.connect(config);
        var sqlRemove = `
        
            UPDATE Submissions.Pending
            SET SubmissionStatus = 1
            WHERE RunID = @0;
            
         `
    
        await poolConnection.request().input('0',sql.Int,runID).query(sqlRemove);

        console.log("PASSED");
		
		var sqlQuery = `

        INSERT INTO 
        Purples.Solo (PlayerID,RunCharacterName,Patch,Region,Rank,Time,MainClass,SubClass,WeaponInfo1,WeaponInfo2,WeaponInfo3,WeaponInfo4,WeaponInfo5,WeaponInfo6,Link,Notes,SubmissionTime,SubmitterID)
        VALUES (@1,@2,@3,@4,@5,@6,@7,@8,@9,@10,@11,@12,@13,@14,@15,@16,@17,@18);`;
			
		var results = await poolConnection.request().input('1',sql.Int, playerID).input('2',sql.NVarChar, characterName).input('3',sql.NVarChar, patch).input('4',sql.NVarChar, region).input('5',sql.Int, rank).input('6',sql.NVarChar, time).input('7',sql.NVarChar, mainClass).input('8',sql.NVarChar, subClass).input('9',sql.NVarChar, w1).input('10',sql.NVarChar, w2).input('11',sql.NVarChar, w3).input('12',sql.NVarChar, w4).input('13',sql.NVarChar, w5).input('14',sql.NVarChar, w6).input('15',sql.NVarChar, link).input('16',sql.NVarChar, notes).input('17',sql.DateTime, submittime).input('18',sql.Int, submitter).query(sqlQuery);
		
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
