function finishSetup() {
    disableButtons();
    characterName = document.getElementById('characterNameInput').value;
    if(characterName == '' || characterName == null) {
        enableButtons();
        warnName();
        return
    }
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

    //console.log(userkey);

	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
			//console.log(httpRequest.response);
            window.location.replace("/logout");
		}
	}

    var param = characterName + '@!@!@' + serverID + '@!@!@' + userkey.userId + '@!@!@' + userkey.userDetails;
	
    //console.log(param);

	httpRequest.open('POST', '/api/firstSettings', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send(param);
}


function warnName() {
    var cname = document.getElementById('characterNameInputNotice')
    cname.classList.remove('invisible')
}

function enableButtons() {
    var r = document.getElementById('submitrun')
	r.classList.remove("disabled");
}

function disableButtons() {
    var r = document.getElementById('submitrun')
	r.classList.add("disabled");
}
