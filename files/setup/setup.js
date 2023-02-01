function finishSetup() {
    disableButtons();
    characterName = document.getElementById('characterNameInput').value;
    //console.log(characterName);
    serverID = document.querySelector('input[name="serverRadio"]:checked').value;
    //console.log(serverID);
    ConfirmSettings(characterName,serverID);
}



async function getUserInfo() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
}

async function ConfirmSettings (characterName,serverID) {
	
    var userkey = await getUserInfo();

	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
			//console.log(httpRequest.response);
            window.location.replace("/logout");
		}
	}

    var param = characterName + '@!@!@' + serverID + '@!@!@' + userkey;
	
	httpRequest.open('POST', '/api/firstSettings', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send(param);
}


function disableButtons() {
    r = document.getElementById('submitrun')
	r.classList.add("disabled");
}
