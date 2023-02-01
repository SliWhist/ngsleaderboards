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
        var CharacterName = inputArray[0];
        var ServerID = inputArray[1];
        var PlayerName = inputArray[3];
        var userID = inputArray[2];
		console.log(inputArray[3]);

        var poolConnection = await sql.connect(config);

        var sqlTest = `
        
        SELECT UserID FROM Users.Information WHERE UserID = @test

        `;

        var testresults = await poolConnection.request().input('test',sql.NVarChar, userID).query(sqlTest);

		if (testresults.rowsAffected != 0) {
			poolConnectionRead.close();
			context.res = {
				contentType: "application/json",
					status: 200, /* Defaults to 200 */
					body: "Error"
			};
			return;
		}

		sqlTest = `
        
        SELECT PlayerName FROM Players.Information WHERE PlayerName = @test AND PlayerID > 107

        `;

        var testresults = await poolConnection.request().input('test',sql.NVarChar, PlayerName).query(sqlTest);

		if (testresults.rowsAffected != 0) {
			poolConnectionRead.close();
			context.res = {
				contentType: "application/json",
					status: 200, /* Defaults to 200 */
					body: "Error"
			};
			return;
		}


        var sqlAdd = `
        
        INSERT INTO Players.Information (PlayerName,CharacterName)
		VALUES (@PlayerName,@CharacterName)

        `;

        await poolConnection.request().input('PlayerName',sql.NVarChar, PlayerName).input('CharacterName',sql.NVarChar, CharacterName).query(sqlAdd);

        sqlAdd = `SELECT PlayerID FROM Players.Information 
		WHERE PlayerName = @PlayerName 
		AND CharacterName = @CharacterName AND PlayerID > 107`

        var results = await poolConnection.request().input('PlayerName',sql.NVarChar, PlayerName).input('CharacterName',sql.NVarChar, CharacterName).query(sqlAdd);
        
        sqlAdd = `
        
        INSERT INTO Players.Customization(PlayerID,Server)
        VALUES(@pid,@server)

        `;

        await poolConnection.request().input('pid',sql.Int, results.recordset[0].PlayerID).input('server',sql.NVarChar, ServerID).query(sqlAdd);

        sqlAdd = `
        
        INSERT INTO Users.Information(PlayerID,UserID,Role)
        VALUES(@pid,@uid,@newuser)

        `;

        await poolConnection.request().input('pid',sql.Int, results.recordset[0].PlayerID).input('uid',sql.NVarChar, userID).input('newuser',sql.NVarChar, "user").query(sqlAdd);

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
