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
        //console.log(req.body);
        var input = req.body;
		var inputArray = input.split("@!@!@");
        var CharacterName = inputArray[0];
        var ServerID = inputArray[1];
        var PlayerName = inputArray[2].userDetails;
        var userID = inputArray[2].userID;

        var poolConnection = await sql.connect(config);

        var sqlTest = `
        
        SELECT UserID FROM Users.Information WHERE UserID = @test

        `;

        testresults = await poolConnection.request().input('test',sql.NVarChar, userID).query(sqlTest);

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
        
        INSERT INTO Players.Information(PlayerName,CharacterName)
        VALUES(@pn,@cn)

        `;

        await poolConnection.request().input('pn',sql.NVarChar, PlayerName).input('cn',sql.NVarChar, CharacterName).query(sqlAdd);

        sqlAdd = `SELECT PlayerID FROM Players.Information WHERE PlayerName = @pn`

        var results = await poolConnection.request().input('pn',sql.NVarChar, PlayerName).query(sqlAdd);
        
        sqlAdd = `
        
        INSERT INTO Players.Customization(PlayerID,Server)
        VALUES(@pid,@server)

        `;

        await poolConnection.request().input('pid',sql.Int, results.recordset[0].PlayerID).input('server',sql.NVarChar, ServerID).query(sqlAdd);

        sqlAdd = `
        
        INSERT INTO Players.Customization(PlayerID,UserID,Role)
        VALUES(@pid,@uid,'user')

        `;

        await poolConnection.request().input('pid',sql.Int, results.recordset[0].PlayerID).input('uid',sql.NVarChar, userID).query(sqlAdd);

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
