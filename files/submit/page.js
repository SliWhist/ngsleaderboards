document.body.onload = LoadAll();

import * as HeaderGen from "/globalscripts/module/headergen.js"


function LoadAll()
{
	
    HeaderGen.headerGenerate();
	prepareDatalist();
}

function prepareDatalist()
{

	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
            var data = JSON.parse(httpRequest.response);
			console.log(data);
			loadDatalist(data);
		}
	}
	
	httpRequest.open('GET', '/api/getPlayerNamesIDs', true);
	httpRequest.send();
}

function loadDatalist(input)
{
	const data = document.getElementById('datalistOptions');
	input.forEach((row) => {
		var characterNameRef = '';
		if(row.CharacterName != null) {
			characterNameRef =  row.CharacterName
		}
        data.innerHTML += `<option value="` + row.PlayerName + `">`+ characterNameRef +`</option>`;
    });

}

