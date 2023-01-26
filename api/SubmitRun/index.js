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
        // For testing.
        var urls = [
            'www.engadget.com/watch?v=dQw4w9WgXcQ'
        ];
        
        var i, r, rx = /^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]{7,15})(?:[\?&][a-zA-Z0-9\_-]+=[a-zA-Z0-9\_-]+)*$/;
        
        for (i = 0; i < urls.length; ++i) {
            r = urls[i].match(rx);
            console.log(r[1]);
        }
}
