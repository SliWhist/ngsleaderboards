const mainName = document.getElementById('mainname');
const playerName = document.getElementById('playername');
const characterName = document.getElementById('charactername');
const serverregion = document.getElementById('server');
const ship = document.getElementById('ship');
const locationPlayer = document.getElementById('location');
const descriptionPlayer = document.getElementById('description');
const socialMedia = document.getElementById('socialmedia');

let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

window.addEventListener("load", (event) => {
    
    loadProfile();

});

async function getUserInfo() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
}

async function loadProfile () {
	
    var userkey = await getUserInfo();

	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
			console.log(httpRequest.response);
			setupProfile(httpRequest.response);
		}
	}

    var param = userkey.userId;
	
	httpRequest.open('POST', '/api/loadProfile', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send(param);
}

function setupProfile(input) {
	var parsed = JSON.parse(input);
	makeName(parsed[0],mainName);
	playerName.innerHTML = parsed[0].PlayerName;
	characterName.innerHTML = parsed[0].CharacterName;
	serverregion.innerHTML = parsed[0].Server.charAt(0).toUpperCase() + parsed[0].Server.slice(1).toLowerCase();
	if (parsed[0].Flag != null) {
		var flag = '<span class="fi fi-' + parsed[0].Flag + '"></span>'
		var country = regionNames.of(parsed[0].Flag.toUpperCase());
		infolocation = flag + ' ' + country;
		locationPlayer.innerHTML = infolocation;
	}
	else {
		locationPlayer.innerHTML = 'N/A'
	}
	makeShip(parsed[0]);
	if (parsed[0].Description != null) {
		descriptionPlayer.innerHTML = parsed[0].Description;
	}
	else {
		descriptionPlayer.innerHTML = `We don't have a description for ` + getNamePref(parsed[0]) +`, but they're definitely cool!`;
	}
	createSocialMedia(parsed[0]);
	
	
}

function reloadTooltips() {
    var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    var tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))    
}

function createSocialMedia(i) {
	var socialTwitch = '';
	var socialYoutube = '';
	var socialYoutube2 = '';
	var socialTwitter = '';
	var socialDiscord = '';

	if (i.Twitch != null) {
		socialTwitch = '<a class="btn btn-primary mt-1 ms-1" href="https://twitch.tv/' + i.Twitch + '" target="_blank" rel="noreferrer noopener" style="--bs-btn-border-color: #803be5; --bs-btn-bg: #803be5; --bs-btn-hover-border-color: #a065f5; --bs-btn-hover-bg: #a065f5; --bs-btn-active-border-color:#682cc1; --bs-btn-active-bg:#682cc1; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF;"><i class="bi bi-twitch me-1"></i>Twitch</a>';

	}
	if (i.Youtube != null) {
		socialYoutube = '<a class="btn btn-primary mt-1 ms-1" href="https://youtube.com/@' + i.Youtube + '" target="_blank" rel="noreferrer noopener" style="--bs-btn-border-color: #d11414; --bs-btn-bg: #d11414; --bs-btn-hover-border-color: #f12525; --bs-btn-hover-bg: #f12525; --bs-btn-active-border-color:#ad1616; --bs-btn-active-bg: #ad1616; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF;"><i class="bi bi-youtube me-1"></i>Youtube</a>';
	}
	if (i.Youtube2 != null) {
		socialYoutube2 = '<a class="btn btn-primary mt-1 ms-1" href="https://youtube.com/@' + i.Youtube2 + '" target="_blank" rel="noreferrer noopener" style="--bs-btn-border-color: #d11414; --bs-btn-bg: #d11414; --bs-btn-hover-border-color: #f12525; --bs-btn-hover-bg: #f12525; --bs-btn-active-border-color:#ad1616; --bs-btn-active-bg: #ad1616; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF;"><i class="bi bi-youtube me-1"></i>Youtube - Alt</a>';

	}
	if (i.Twitter != null) {
		socialTwitter = '<a class="btn btn-primary mt-1 ms-1" href="https://twitter.com/' + i.Twitter + '" target="_blank" rel="noreferrer noopener" style="--bs-btn-border-color: #1D9BF0; --bs-btn-bg: #1D9BF0; --bs-btn-hover-border-color: #48b2f9; --bs-btn-hover-bg: #48b2f9; --bs-btn-active-border-color:#1982c9; --bs-btn-active-bg: #1982c9; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF;"><i class="bi bi-twitter me-1"></i>Twitter</a>';

	}
	if (i.Discord != null) {
		socialDiscord = '<a class="btn btn-primary mt-1 ms-1" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="' + i.Discord + '" style="--bs-btn-border-color: #5865F2; --bs-btn-bg: #5865F2; --bs-btn-hover-border-color:#727df9; --bs-btn-hover-bg:#727df9; --bs-btn-active-border-color:#4854d9; --bs-btn-active-bg: #4854d9; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF;"><i class="bi bi-discord me-1"></i>Discord</a>';

	}
	socialMedia.innerHTML = socialYoutube + socialYoutube2 + socialTwitch + socialTwitter + socialDiscord;
	reloadTooltips();
}

function makeShip(i) {
	if (i.Ship != null && i.Server != null) {
		var serverref = i.Server.toLowerCase();
		if(serverref != 'global') {
			switch(serverref) {
				case 'jp':
					serverref = 'japan';
					break;
				case 'japan':
					break;
				case 'jpn':
					serverref = 'japan';
					break;
			}
		}
		var iconref = 'ship' + i.Ship + '-' + serverref;
		var shiphtml = '<img src="/img/' + iconref + '.png" class="img-fluid" style="max-height:100%">'
		var shipinfohtml = ' Ship ' + i.Ship;
		var varship = shiphtml + shipinfohtml;
		ship.innerHTML = varship;
	}
}

function getNamePref(i) {
	var newname = '';
	switch (i.PreferredName) {
		// Player Name
		case 0:
			newname = i.PlayerName;
			break;
		// (Main) Character Name
		case 1:
			newname = i.CharacterName;
			break;
		// In-Video Character Name
		case 2:
			newname = i.CharacterName;
			break;
	}
	return(newname);
}

function makeName(i,target) {

	var newname = '';

	switch (i.PreferredName) {
		// Player Name
		case 0:
			newname = i.PlayerName;
			break;
		// (Main) Character Name
		case 1:
			newname = i.CharacterName;
			break;
		// In-Video Character Name
		case 2:
			newname = i.CharacterName;
			break;
	}
	
	target.style.cssText = `--bs-btn-padding-y: 0px; --bs-btn-padding-x: 0px; background-color: #0000; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF; text-decoration: none; font-weight: bold;`;
	// Check the name customization setting.
	
	switch (i.NameType) {
		// Flat Color
		case 1:
			target.style.cssText += `color: #` + i.NameColor1 + `; --bs-btn-hover-color: #` + i.NameColor1 + `; --bs-btn-active-color: #` + i.NameColor1 + `;`;
			break;
		// Gradient Color
		case 2:
			target.style.cssText += `background: -webkit-linear-gradient(0deg, #` + i.NameColor1 + `, #` + i.NameColor2 + `);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;`;
			break;
		// Glow Color
		case 3:
			target.style.cssText += `text-shadow: 0px 0px 5px #` + i.NameColor1 + `, 0px 0px 5px #` + i.NameColor1 + `, 0px 0px 5px #` + i.NameColor1 + `;`;
			break;
		default:
			break;
	}
	target.innerHTML = newname;

}