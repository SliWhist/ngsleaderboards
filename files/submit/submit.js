document.addEventListener( 'submit', (event) => {
    
    disableButtons();
    playerName = document.getElementById('playerNameSearch').value;
    //console.log(playerName);
    characterName = document.getElementById('characterNameInput').value;
    //console.log(characterName);
    serverID = document.querySelector('input[name="serverRadio"]:checked').value;
    //console.log(serverID);
    mainClass = document.getElementById('mainClassDrop').value;
    //console.log(mainClass);
    subClass = document.getElementById('subClassDrop').value;
    //console.log(subClass);
    weapon1 = document.getElementById('weapon1drop').value;
    //console.log(weapon1);
    weapon2 = document.getElementById('weapon2drop').value;
    //console.log(weapon2);
    weapon3 = document.getElementById('weapon3drop').value;
    //console.log(weapon3);
    weapon4 = document.getElementById('weapon4drop').value;
    //console.log(weapon4);
    weapon5 = document.getElementById('weapon5drop').value;
    //console.log(weapon5);
    weapon6 = document.getElementById('weapon6drop').value;
    //console.log(weapon6);
    region = document.getElementById('regionDrop').value;
   // console.log(region);
    rank = document.getElementById('rankSpinner').value;
    //console.log(rank);
    timeMins = document.getElementById('runtimeMins').value;
    //console.log(timeMins);
    timeSecs = document.getElementById('runtimeSecs').value;
    //console.log(timeSecs);
    patch = document.getElementById('patchPicker').value;
    //console.log(patch);
    link = document.getElementById('submitFormYoutube').value;
    //console.log(link);
    notes = document.getElementById('customNotes').value;
    //console.log(notes);

    var param = playerName + "@!@!@" + characterName + "@!@!@" + serverID + "@!@!@" + mainClass + "@!@!@" + subClass + "@!@!@" + weapon1 + "@!@!@" + weapon2 + "@!@!@" + weapon3 + "@!@!@" + weapon4 + "@!@!@" + weapon5 + "@!@!@" + weapon6 + "@!@!@" + region + "@!@!@" + rank + "@!@!@" + timeMins + "@!@!@" + timeSecs + "@!@!@" + patch + "@!@!@" + link + "@!@!@" + notes;

    //console.log(param)

    ConfirmRun(param)

});

async function getUserInfo() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
}

async function ConfirmRun (i) {
	
    var userkey = await getUserInfo();

	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
			//console.log(httpRequest.response);
            window.location.replace("/submitted");
		}
	}

    var param = i + '@!@!@' + userkey.userId;
	
	httpRequest.open('POST', '/api/submitrun', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send(param);
}

function disableButtons() {
    r = document.getElementById('submitrun')
	r.classList.add("disabled");
}