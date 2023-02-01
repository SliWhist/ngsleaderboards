const myModal = document.getElementById('submissionModal')
const myInput = document.getElementById('closeButton')

const submitButton = document.getElementById('approveButton')
const denyButton = document.getElementById('denyButton')

const subtable = document.querySelector("#submissions-table");
const subbody = document.querySelector("#submissions-table > tbody");

submitButton.addEventListener("click", function (event) {
	disableButtons();
	sendApprove();
});

denyButton.addEventListener("click", function (event) {
	disableButtons();
	sendDeny();
});


window.addEventListener("load", (event) => {
    disableButtons();
});

window.addEventListener("load", (event) => {
    RefreshSubmissionsBegin();
});

myModal.addEventListener('shown.bs.modal', () => {
  myInput.focus()
})

myModal.addEventListener('show.bs.modal', function (event) {
    generateInfo(event);
})

myModal.addEventListener('hide.bs.modal', function (event) {
    cleanupPanel();
    disableButtons();
	submitButton.removeAttribute("data-bs-runid");
})

function sendApprove(event)
{
	var button = denyButton;
	//console.log(button);
    var runID = button.getAttribute('data-bs-runid');
	GetApprovedRun(runID);
}

function sendDeny(event)
{
	var button = submitButton;
	//console.log(button);
    var runID = button.getAttribute('data-bs-runid');
	GetDeniedRun(runID);
}

async function getUserInfo() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
}

async function GetApprovedRun(runID) {

	var userkey = await getUserInfo();
	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
            var data = JSON.parse(httpRequest.response);
			ApproveRun(runID,data[0].PlayerID,data[0].RunCharacter,data[0].Patch,data[0].Region,data[0].Rank,data[0].Time,data[0].MainClass,data[0].SubClass,data[0].W1,data[0].W2,data[0].W3,data[0].W4,data[0].W5,data[0].W6,data[0].Link,data[0].Notes,data[0].SubmissionTime,userkey.userRoles,data[0].SubmitterID);
		}
	}
	
	httpRequest.open('POST', '/api/getSubmissionInfo', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send(runID);
}

async function GetDeniedRun(runID) {

	var userkey = await getUserInfo();
	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
            var data = JSON.parse(httpRequest.response);
			DenyRun(runID,data[0].PlayerID,data[0].RunCharacter,data[0].Patch,data[0].Region,data[0].Rank,data[0].Time,data[0].MainClass,data[0].SubClass,data[0].W1,data[0].W2,data[0].W3,data[0].W4,data[0].W5,data[0].W6,data[0].Link,data[0].Notes,data[0].SubmissionTime,userkey.userRoles,data[0].SubmitterID);
		}
	}
	
	httpRequest.open('POST', '/api/getSubmissionInfo', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send(runID);
}

function ApproveRun (runID,playerID,characterName,patch,region,rank,time,mainClass,subClass,w1,w2,w3,w4,w5,w6,link,notes,submitTime,userkey,subID) {
	
	var params = runID + "@!@!@" + playerID + "@!@!@" + characterName + "@!@!@" + patch + "@!@!@" + region + "@!@!@" + rank + "@!@!@" + time + "@!@!@" + mainClass + "@!@!@" + subClass + "@!@!@" + w1 + "@!@!@" + w2 + "@!@!@" + w3 + "@!@!@" + w4 + "@!@!@" + w5 + "@!@!@" + w6 + "@!@!@" + link + "@!@!@" + notes + "@!@!@" + submitTime + "@!@!@" + userkey + "@!@!@" + subID;

	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
			var modal = bootstrap.Modal.getInstance(myModal)
			modal.hide();
			RefreshSubmissionsBegin();
		}
	}
	
	httpRequest.open('POST', '/api/approveRun', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send(params);
}

function DenyRun (runID,playerID,characterName,patch,region,rank,time,mainClass,subClass,w1,w2,w3,w4,w5,w6,link,notes,submitTime,userkey,subID) {
	
	var params = runID + "@!@!@" + playerID + "@!@!@" + characterName + "@!@!@" + patch + "@!@!@" + region + "@!@!@" + rank + "@!@!@" + time + "@!@!@" + mainClass + "@!@!@" + subClass + "@!@!@" + w1 + "@!@!@" + w2 + "@!@!@" + w3 + "@!@!@" + w4 + "@!@!@" + w5 + "@!@!@" + w6 + "@!@!@" + link + "@!@!@" + notes + "@!@!@" + submitTime + "@!@!@" + userkey + "@!@!@" + subID;

	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
			var modal = bootstrap.Modal.getInstance(myModal)
			modal.hide();
			RefreshSubmissionsBegin();
		}
	}
	
	httpRequest.open('POST', '/api/denyRun', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send(params);
}

function RefreshSubmissionsBegin() {

	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
            //console.log(httpRequest.response);
            RefreshSubmissions(httpRequest.response);
		}
	}
	
	httpRequest.open('GET', '/api/getSubmissions', true);
	httpRequest.send();

}

function RefreshSubmissions(input) {
	CleanRows();
    var data = JSON.parse(input);
    //console.log(data);
	if (Object.keys(data).length === 0) {
        CreateRowNone();
		return;
	}
    data.forEach((row) => {
        CreateRow(row);
    });
}

function CleanRows() {
	while (subbody.firstChild) {
        subbody.removeChild(subbody.firstChild);
    }
}

function CreateRow(input) {

    const tr = document.createElement("tr");
    tr.style.cssText = 'cursor: pointer;';
    tr.setAttribute("data-bs-toggle",'modal');
    tr.setAttribute("data-bs-target",'#submissionModal');
    tr.setAttribute("data-bs-submitid",input.RunID.toString());
	const tdempty1 = document.createElement("td");
	const tdempty2 = document.createElement("td");
	const tdempty3 = document.createElement("td");
	const tdempty4 = document.createElement("td");
	const tdempty5 = document.createElement("td");
	const tdempty6 = document.createElement("td");
	const tdempty7 = document.createElement("td");
    const tdempty8 = document.createElement("td");
    const tdempty9 = document.createElement("td");
    const tdempty10 = document.createElement("td");
	const tdempty11 = document.createElement("td");
	tdempty1.innerHTML = createSubmitterRow(input.SubmitterNameType,input.SubmitterNameColor1,input.SubmitterNameColor2,tdempty1);
    tdempty1.textContent = getPrefname(input.SubmitterPrefN,input.SubmitterName,input.SubmitterCName);
    tdempty1.classList.add("col-sm");
	tr.appendChild(tdempty1);
    tdempty2.innerHTML = createPlayerRow(input.PlayerNameType,input.PlayerNameColor1,input.PlayerNameColor2,tdempty2);
    tdempty2.textContent = getPrefname(input.PlayerPrefN,input.PlayerName,input.PlayerCName);
    tdempty2.classList.add("col-sm");
	tr.appendChild(tdempty2);
    tdempty3.innerHTML = input.Region.charAt(0).toUpperCase() + input.Region.slice(1).toLowerCase();
    tdempty3.classList.add("col-sm");
	tr.appendChild(tdempty3);
    tdempty4.innerHTML = input.Rank.toString();
    tdempty4.classList.add("col-sm");
	tr.appendChild(tdempty4);
    tdempty5.innerHTML = createPatch(input.Patch);
    tdempty5.classList.add("col-sm");
	tr.appendChild(tdempty5);
    tdempty6.innerHTML = input.RunCharacter;
    tdempty6.classList.add("col-sm");
	tr.appendChild(tdempty6);
    tdempty7.innerHTML = generateClassImages(input.MainClass,input.PlayerID);
    tdempty7.classList.add("col-sm");
    tr.appendChild(tdempty7);
    tdempty8.innerHTML = generateClassImages(input.SubClass,input.PlayerID);
    tdempty8.classList.add("col-sm");
    tr.appendChild(tdempty8);
    tdempty9.innerHTML = generateWeaponImagesSm(input.WeaponInfo,input.PlayerID);
    tdempty9.classList.add("col-sm");
    tr.appendChild(tdempty9);
    tdempty10.innerHTML = input.Time.toString();
    tdempty10.classList.add("col-sm");
    tr.appendChild(tdempty10);
	tdempty11.innerHTML = new Date(input.SubmissionTime).toDateString() + ' @ ' + new Date(input.SubmissionTime).toTimeString().slice(0,8);
	tdempty11.classList.add("col-sm");
	tr.appendChild(tdempty11);
	subbody.appendChild(tr);
}

function getPrefname(pref,player,char) {
	switch (pref) {
		// Player Name
		case 0:
			return(player);
			break;
		// (Main) Character Name
		case 1:
			return(char);
			break;
		// In-Video Character Name
		case 2:
			return(char);
			break;
	}
}

function CreateRowNone() {

    const tr = document.createElement("tr");

	const tdempty1 = document.createElement("td");
	const tdempty2 = document.createElement("td");
	const tdempty3 = document.createElement("td");
	const tdempty4 = document.createElement("td");
	const tdempty5 = document.createElement("td");
	const tdempty6 = document.createElement("td");
	const tdempty7 = document.createElement("td");
    const tdempty8 = document.createElement("td");
    const tdempty9 = document.createElement("td");
    const tdempty10 = document.createElement("td");
	const tdempty11 = document.createElement("td");
	tdempty1.textContent = "Nothing in Queue! :)";
	tr.appendChild(tdempty1);
	tr.appendChild(tdempty2);
	tr.appendChild(tdempty3);
	tr.appendChild(tdempty4);
	tr.appendChild(tdempty5);
	tr.appendChild(tdempty6);
    tr.appendChild(tdempty7);
    tr.appendChild(tdempty8);
    tr.appendChild(tdempty9);
    tr.appendChild(tdempty10);
	tr.appendChild(tdempty11);
	subbody.appendChild(tr);
}

function generateInfo(event) {
    var button = event.relatedTarget;
    var runID = button.getAttribute('data-bs-submitid');
	submitButton.setAttribute("data-bs-runid",runID);

	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
			//console.log(httpRequest.response);
            enableButtons();
            setInfo(httpRequest.response);
		}
	}
	
	httpRequest.open('POST', '/api/getSubmissionInfo', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send(runID);
}

function setInfo(input) {

    var data = JSON.parse(input);

    data.forEach((row) => {
        //console.log(row);
        createVideo(row.Link);
        createRegion(row.Region);
        createRank(row.Rank);
        createTime(row.Time);
        const patchHTML = document.getElementById('runPatch');
        patchHTML.innerHTML = createPatch(row.Patch);
        createServer(row.PlayerServer);
        createSubmitter(row.SubmitterName,row.SubmitterCName,row.SubmitterPrefN,row.SubmitterNameType,row.SubmitterNameColor1,row.SubmitterNameColor2);
        createNotes(row.Notes);
        createPlayerName(row.PlayerName,row.PlayerCName,row.PlayerPrefN,row.PlayerNameType,row.PlayerNameColor1,row.PlayerNameColor2);
        createCharacterName(row.RunCharacter);
        createWeapons(row.WeaponInfo,row.PlayerID);
        createMainClass(row.MainClass);
        createSubClass(row.SubClass);
    });
}

function createWeapons(weapon, playerid) {

    const mcHTML = document.getElementById('runWeapons');
    mcHTML.innerHTML = generateWeaponImages(weapon,playerid);

}

function createMainClass(mainclass) {

    const mcHTML = document.getElementById('runMainclass');
    mcHTML.innerHTML = generateClassImages(mainclass);

}

function createSubClass(subclass) {

    const mcHTML = document.getElementById('runSubclass');
    mcHTML.innerHTML = generateClassImages(subclass);

}

function createCharacterName(character) {

    const cnHTML = document.getElementById('runCharactername');
    cnHTML.innerHTML = character;

}

function createPlayerName(playername,cname,prefname,type,color1,color2) {

    const pnHTML = document.getElementById('runPlayername');
	switch (prefname) {
		// Player Name
		case 0:
			pnHTML.innerHTML = playername;
			break;
		// (Main) Character Name
		case 1:
			pnHTML.innerHTML = cname;
			//console.log('?')
			break;
		// In-Video Character Name
		case 2:
			pnHTML.innerHTML = cname;
			break;
	}
    pnHTML.style.cssText = `background-color: #0000; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF; text-decoration: none; font-weight: bold;`;
    // Check the name customization setting.
    switch (type) {
        // Flat Color
        case 1:
            pnHTML.style.cssText += `color: #` + color1 + `;`;
            break;
        // Gradient Color
        case 2:
            pnHTML.style.cssText += `background: -webkit-linear-gradient(0deg, #` + color1 + `, #` + color2 + `);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;`;
            break;
        // Glow Color
        case 3:
            //console.log(row.NameColor1);
            pnHTML.style.cssText += `text-shadow: 0px 0px 5px #` + color1 + `, 0px 0px 5px #` + color1 + `, 0px 0px 5px #` + color1 + `;`;
            break;
        default:
            break;
    }

}

function createPlayerRow(type,color1,color2,ref) {

    ref.style.cssText = `background-color: #0000; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF; text-decoration: none; font-weight: bold;`;
    // Check the name customization setting.
    switch (type) {
        // Flat Color
        case 1:
            ref.style.cssText += `color: #` + color1 + `;`;
            break;
        // Gradient Color
        case 2:
            ref.style.cssText += `background: -webkit-linear-gradient(0deg, #` + color1 + `, #` + color2 + `);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;`;
            break;
        // Glow Color
        case 3:
            //console.log(row.NameColor1);
            ref.style.cssText += `text-shadow: 0px 0px 5px #` + color1 + `, 0px 0px 5px #` + color1 + `, 0px 0px 5px #` + color1 + `;`;
            break;
        default:
            break;
    }

}

function createNotes(notes) {

    const noteHTML = document.getElementById('runNotes');
    noteHTML.innerHTML = notes;

}

function createSubmitter(sub,cname,prefname,type,color1,color2) {

    const noteHTML = document.getElementById('runSubmitter');
	switch (prefname) {
		// Player Name
		case 0:
			noteHTML.innerHTML = sub;
			break;
		// (Main) Character Name
		case 1:
			noteHTML.innerHTML = cname;
			break;
		// In-Video Character Name
		case 2:
			noteHTML.innerHTML = cname;
			break;
	}
    noteHTML.style.cssText = `background-color: #0000; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF; text-decoration: none; font-weight: bold;`;
  // Check the name customization setting.
  switch (type) {
      // Flat Color
      case 1:
        noteHTML.style.cssText += `color: #` + color1 + `;`;
          break;
      // Gradient Color
      case 2:
        noteHTML.style.cssText += `background: -webkit-linear-gradient(0deg, #` + color1 + `, #` + color2 + `);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;`;
          break;
      // Glow Color
      case 3:
          //console.log(row.NameColor1);
          noteHTML.style.cssText += `text-shadow: 0px 0px 5px #` + color1 + `, 0px 0px 5px #` + color1 + `, 0px 0px 5px #` + color1 + `;`;
          break;
      default:
          break;
  }

}

function createSubmitterRow(type,color1,color2,ref) {

    ref.style.cssText = `background-color: #0000; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF; text-decoration: none; font-weight: bold;`;
  // Check the name customization setting.
  switch (type) {
      // Flat Color
      case 1:
        ref.style.cssText += `color: #` + color1 + `;`;
          break;
      // Gradient Color
      case 2:
        ref.style.cssText += `background: -webkit-linear-gradient(0deg, #` + color1 + `, #` + color2 + `);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;`;
          break;
      // Glow Color
      case 3:
          //console.log(row.NameColor1);
          ref.style.cssText += `text-shadow: 0px 0px 5px #` + color1 + `, 0px 0px 5px #` + color1 + `, 0px 0px 5px #` + color1 + `;`;
          break;
      default:
          break;
  }

}

function createServer(server) {

    const servHTML = document.getElementById('runServer');
    servHTML.innerHTML = server.charAt(0).toUpperCase() + server.slice(1).toLowerCase();

}

function createPatch(patch) {
    switch(patch) {
        case '60R':
            return(`+60 Release`);
            break;
        default:
            return(`Pre-+60`);
            break;
    };
}

function createRank(rank) {

    const rankHTML = document.getElementById('runRank');
    rankHTML.innerHTML = rank.toString();

}

function createTime(time) {

    const timeHTML = document.getElementById('runTime');
    timeHTML.innerHTML = time.toString();

}

function createRegion(region) {

    const regionHTML = document.getElementById('runRegion')
    var fixedregion = region.charAt(0).toUpperCase() + region.slice(1).toLowerCase();
    regionHTML.innerHTML = fixedregion;

}

function createVideo(url) {

    const videoHTML = document.getElementById('runVideoPreview')

    var urls = [
        url
    ];
    
    var i, r, rx = /^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]{7,15})(?:[\?&][a-zA-Z0-9\_-]+=[a-zA-Z0-9\_-]+)*$/;
    
    for (i = 0; i < urls.length; ++i) {
        r = urls[i].match(rx);
        //console.log(r[1]);
    }

    //console.log(r[1]);

    videoHTML.innerHTML = `<a href='https://youtu.be/` + r[1] + `'>Video Link</a>`

}

function cleanupPanel() {
    const videoHTML = document.getElementById('runVideoPreview');
    const regionHTML = document.getElementById('runRegion')
    const timeHTML = document.getElementById('runTime');
    videoHTML.innerHTML = ``;
    regionHTML.innerHTML = ``;
    timeHTML.innerHTML = ``;
    const rankHTML = document.getElementById('runRank');
    rankHTML.innerHTML = ``;
    const runHTML = document.getElementById('runPatch');
    runHTML.innerHTML = ``;
    const sHTML = document.getElementById('runSubmitter');
    sHTML.innerHTML = ``;
    const noteHTML = document.getElementById('runNotes');
    noteHTML.innerHTML = ``;
    const pnHTML = document.getElementById('runPlayername');
    pnHTML.innerHTML = ``;
    const cnHTML = document.getElementById('runCharactername');
    cnHTML.innerHTML = ``;
    const scHTML = document.getElementById('runSubclass');
    scHTML.innerHTML = ``;
    const mcHTML = document.getElementById('runMainclass');
    mcHTML.innerHTML = ``;
    const wHTML = document.getElementById('runWeapons');
    wHTML.innerHTML = ``;
    const servHTML = document.getElementById('runServer');
    servHTML.innerHTML = ``;
}

function generateClassImages(input) {
	const input2 = input.toLowerCase();
	switch (input2) {
		case "hunter":
			return '<img src="/img/class-hunter.png"> Hunter';
			break;
		case "fighter":
			return '<img src="/img/class-fighter.png"> Fighter';
			break;
		case "ranger":
			return '<img src="/img/class-ranger.png"> Ranger';
			break;
		case "gunner":
			return '<img src="/img/class-gunner.png"> Gunner';
			break;
		case "force":
			return '<img src="/img/class-force.png"> Force';
			break;
		case "techter":
			return '<img src="/img/class-techter.png"> Techter';
			break;
		case "braver":
			return '<img src="/img/class-braver.png"> Braver';
			break;
		case "bouncer":
			return '<img src="/img/class-bouncer.png"> Bouncer';
			break;
		case "waker":
			return '<img src="/img/class-waker.png"> Waker';
			break;
		case "gunblade-placeholder":
			return '<img src="/img/class-gunblade.png"> Gunblade';
			break;
		case "?":
			return '<img src="/img/class-unknown.png"> Unknown';
			break;
		default:
			return '';
			break;
	}
}

function generateWeaponImages(input, id) {
	const input2 = input.toLowerCase();
	var inputArray = input2.split(' ');
	//console.log(inputArray);
	let result = '';
	inputArray.forEach((weapon) => {
		switch (weapon) {
			case "sword":
				result = result + '<span><img src="/img/weapon-sword.png"> Sword' + '</span>';
				break;
			case "wl":
				result = result + '<span><img src="/img/weapon-wire.png"> Wired Lance' + '</span>';
				break;
			case "partisan":
				result = result + '<span><img src="/img/weapon-partisan.png"> Partisan' + '</span>';
				break;
			case "td":
				result = result + '<span><img src="/img/weapon-daggers.png"> Twin Daggers' + '</span>';
				break;
			case "ds":
				result = result + '<span><img src="/img/weapon-saber.png"> Dual Saber' + '</span>';
				break;
			case "knuckles":
				result = result + '<span><img src="/img/weapon-knux.png"> Knuckles' + '</span>';
				break;
			case "katana":
				result = result + '<span><img src="/img/weapon-katana.png"> Katana' + '</span>';
				break;
			case "sb":
				result = result + '<span><img src="/img/weapon-blades.png"> Soaring Blades' + '</span>';
				break;
			case "rifle":
				if (id === 4) {
					result = result + '<span><img src="/custom/img/sukeboy/kaiby.png"> Kaibygun (Assault Rifle)' + '</span>';
					break;
				}
				else {
					result = result + '<span><img src="/img/weapon-rifle.png"> Assault Rifle' + '</span>';
					break;
				}
				break;
			case "launcher":
				result = result + '<span><img src="/img/weapon-launcher.png"> Launcher' + '</span>';
				break;
			case "tmg":
				result = result + '<span><img src="/img/weapon-tmg.png"> Twin Machine Guns' + '</span>';
				break;
			case "bow":
				result = result + '<span><img src="/img/weapon-bow.png"> Bow' + '</span>';
				break;
			case "rod":
				result = result + '<span><img src="/img/weapon-rod.png"> Rod' + '</span>';
				break;
			case "talis":
				result = result + '<span><img src="/img/weapon-talis.png"> Talis' + '</span>';
				break;
			case "wand":
				result = result + '<span><img src="/img/weapon-wand.png"> Wand' + '</span>';
				break;
			case "jb":
				result = result + '<span><img src="/img/weapon-boots.png"> Jet Boots' + '</span>';
				break;
			case "takt":
				result = result + '<span><img src="/img/weapon-takt.png"> Harmonizer' + '</span>';
				break;
			case "gunblade":
				result = result + '<span><img src="/img/weapon-gunblade.png"> Gunblade' + '</span>';
				break;
			default:
				return '';
				break;
		}
	});
	return result;
}

function disableButtons() {

	submitButton.setAttribute("disabled",'');
	denyButton.setAttribute("disabled",'');

}

function enableButtons() {

	submitButton.removeAttribute("disabled");
	denyButton.removeAttribute("disabled");

}

function generateWeaponImagesSm(input, id) {
	const input2 = input.toLowerCase();
	var inputArray = input2.split(' ');
	//console.log(inputArray);
	let result = '';
	inputArray.forEach((weapon) => {
		switch (weapon) {
			case "sword":
				result = result + '<img src="/img/weapon-sword.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Sword">' + ' ';
				break;
			case "wl":
				result = result + '<img src="/img/weapon-wire.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Wired Lance">' + ' ';
				break;
			case "partisan":
				result = result + '<img src="/img/weapon-partisan.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Partisan">' + ' ';
				break;
			case "td":
				result = result + '<img src="/img/weapon-daggers.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Twin Daggers">' + ' ';
				break;
			case "ds":
				result = result + '<img src="/img/weapon-saber.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Dual Saber">' + ' ';
				break;
			case "knuckles":
				result = result + '<img src="/img/weapon-knux.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Knuckles">' + ' ';
				break;
			case "katana":
				result = result + '<img src="/img/weapon-katana.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Katana">' + ' ';
				break;
			case "sb":
				result = result + '<img src="/img/weapon-blades.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Soaring Blades">' + ' ';
				break;
			case "rifle":
				if (id === 4) {
					result = result + '<img src="/custom/img/sukeboy/kaiby.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Kaibygun (Assault Rifle)">' + ' ';
					break;
				}
				else {
					result = result + '<img src="/img/weapon-rifle.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Assault Rifle">' + ' ';
					break;
				}
				break;
			case "launcher":
				result = result + '<img src="/img/weapon-launcher.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Launcher">' + ' ';
				break;
			case "tmg":
				result = result + '<img src="/img/weapon-tmg.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Twin Machine Guns">' + ' ';
				break;
			case "bow":
				result = result + '<img src="/img/weapon-bow.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Bow">' + ' ';
				break;
			case "rod":
				result = result + '<img src="/img/weapon-rod.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Rod">' + ' ';
				break;
			case "talis":
				result = result + '<img src="/img/weapon-talis.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Talis">' + ' ';
				break;
			case "wand":
				result = result + '<img src="/img/weapon-wand.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Wand">' + ' ';
				break;
			case "jb":
				result = result + '<img src="/img/weapon-boots.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Jet Boots">' + ' ';
				break;
			case "takt":
				result = result + '<img src="/img/weapon-takt.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Harmonizer">' + ' ';
				break;
			case "gunblade":
				result = result + '<img src="/img/weapon-gunblade.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Gunblade">' + ' ';
				break;
			default:
				return '';
				break;
		}
	});
	return result;
}