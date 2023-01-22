// const { parse } = require("path");

var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
var tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const scoretable = document.querySelector("#score-ranking");
const scorebody = document.querySelector("#score-ranking > tbody");
const scoretitle = document.querySelector("#score-ranking > caption > strong");
const filterclassbuttons = document.querySelector("#buttons-classfilter");
const filterallbutton = document.querySelector("#classFilter1");

const buttongroupClasses = document.querySelectorAll("#group-classfilter *");
const buttongroupPatch = document.querySelectorAll("#group-patch *");
const buttongroupCategory = document.querySelectorAll("#group-maincategory *");
const buttongroupSubcategory = document.querySelectorAll("#group-category *");
const buttongroupParty = document.querySelectorAll("#group-partysize *");
const buttongroupServer = document.querySelectorAll("#group-serverfilter *");

// This function requests Solo purple rankings
function Solo_Purple_SendRequest (region,classIn,rank,party,patch,serverFilter) {
	
	var params = region + "@!@!@" + classIn + "@!@!@" + rank + "@!@!@" + party + "@!@!@" + patch + "@!@!@" + serverFilter;

	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
			//console.log(httpRequest.response);
			enableButtons();
			Solo_Purple_LoadRankings(httpRequest.response);
		}
	}
	
	httpRequest.open('POST', '/api/purpleSolo', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send(params);
}

function Party_Purple_SendRequest (region,classIn,rank,party,patch,serverFilter) {
	
	var params = region + "@!@!@" + classIn + "@!@!@" + rank + "@!@!@" + party + "@!@!@" + patch + "@!@!@" + serverFilter;

	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
			//console.log(httpRequest.response);
			enableButtons();
			Party_Purple_LoadRankings(httpRequest.response);
		}
	}
	
	httpRequest.open('POST', '/api/purpleParty', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send(params);
}

// This function loads Solo purple rankings.
function Solo_Purple_LoadRankings (data) {

	// Initialize the Scoreboard
	cleanupScore();

	// Prepare the region names tool.
	let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

	// Initialize Score Rank reference.
	var rank = 0;
	// Initialize the Last Time reference.
	var lasttime = null;

	// Make the JSON readable by the forEach function.
	var parsed = JSON.parse(data);

	// If the response was nothing, generate the 'No Scores' line.
	if (Object.keys(parsed).length === 0) {
        createNoScores();
		return;
	}

	// Start filling out the leaderboard. This iterates over each 'row', which in our case is each returned run.
	parsed.forEach((row) => {

		// This is the row we'll fill out.
		const tr = document.createElement("tr");

		// First, generate a rank for the runner, starting from 1.

		// Check if the last row's time matches this one. If so, don't +1.
		if (lasttime != row.Time){
			rank += 1;
		}
		// Set the last time to this row's time.
		lasttime = row.Time;

		// Create the rank # or rank icons depending on the current rank.
		createRanking(tr,rank);

		// Create the name column.
		const tdname = document.createElement("td");
		var name = '';
		// Check the player's preferred name.
		switch (row.PreferredName) {
			// Player Name
			case 0:
				name = row.PlayerName;
				break;
			// (Main) Character Name
			case 1:
				name = row.CharacterName;
				break;
			// In-Video Character Name
			case 2:
				name = row.RunCharacterName;
				break;
		}
		if (name != row.RunCharacterName)
				name = '<span data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="' + row.RunCharacterName + '">' + name + '</span>';

		// With the name set, we enter the H O R R O R Z O N E (generating the modal)

		// Generate the main modal. I won't go into detail on most of this.
		const modalfade = document.createElement("div");
		modalfade.classList.add("modal","fade");
		// This NEEDS to be unique to be able to open the modal.
		modalfade.setAttribute("id","PlayerInfo-" + row.PlayerID);
		// Store the id for later.
		const modalIDref = '#' + modalfade.getAttribute("id");
		modalfade.setAttribute("tabindex","-1");
		modalfade.setAttribute("aria-labelledby","Runner Information");
		modalfade.setAttribute("aria-hidden","true");
		// Generate the modal div that centers and enables scrolling.
		const modalcentered = document.createElement("div");
		modalcentered.classList.add("modal-dialog","modal-dialog-centered","modal-dialog-scrollable");
		modalfade.appendChild(modalcentered);
		// Generate the modal content...
		const modalcontent = document.createElement("div");
		modalcontent.classList.add("modal-content","text-bg-dark")
		// Because the inner HTML on it would take forever, we do modalcontent all at once. We run generateRunnerInfo in this mess to populate info.
		modalcontent.innerHTML = `<div class="modal-header" style="border-bottom: var(--bs-modal-header-border-width) solid #0000004f">
		<h1 class="modal-title fs-5">Runner Information</h1>
		<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
	</div><div class="modal-body">` + generateRunnerInfoSolo(row) + `</div>
<div class="modal-footer" style="border-top: var(--bs-modal-header-border-width) solid #0000004f">
	<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
</div>`
		modalcentered.appendChild(modalcontent);
		// Create the 'button'. Really just a clickable name.
		const buttonref = document.createElement("button");
		buttonref.setAttribute("type","button");
		// Make the button the size of the names and align everything.
		buttonref.classList.add("btn","btn-link","m-0","p-0","d-inline-flex","align-items-center","gap-1");
		// Set the default name customization.
		buttonref.style.cssText = `--bs-btn-padding-y: 0px; --bs-btn-padding-x: 0px; background-color: #0000; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF; text-decoration: none; font-weight: bold;`;
		// Check the name customization setting.
		switch (row.NameType) {
			// Flat Color
			case 1:
				buttonref.style.cssText += `--bs-btn-color: #` + row.NameColor1 + `; --bs-btn-hover-color: #` + row.NameColor1 + `; --bs-btn-active-color: #` + row.NameColor1 + `;`;
				break;
			// Gradient Color
			case 2:
				buttonref.style.cssText += `background: -webkit-linear-gradient(0deg, #` + row.NameColor1 + `, #` + row.NameColor2 + `);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;`;
				break;
			// Glow Color
			case 3:
				//console.log(row.NameColor1);
				buttonref.style.cssText += `text-shadow: 0px 0px 5px #` + row.NameColor1 + `, 0px 0px 5px #` + row.NameColor1 + `, 0px 0px 5px #` + row.NameColor1 + `;`;
				break;
			default:
				break;
		}
		buttonref.dataset.bsToggle = 'modal';
		buttonref.dataset.bsTarget = modalIDref;

		// We have now exited the H O R R O R Z O N E.

		// Now for the optional stuff...

		// Generate a flag.
		// Start initialized, since this is optional.
		var flag = '';
		// If we do have a flag, go ahead and generate.
		if (row.Flag != null) {
			flag = `<span class="fi fi-` + row.Flag + `" style="max-height:16px;min-width: 25px;" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="top" data-bs-title="` + regionNames.of(row.Flag.toUpperCase()) + `"></span> `;
		}

		// Ignore this, it's for requested memes.
		if (row.PlayerID === 4) {
			flag = '<img src="custom/img/sukeboy/ronaldinho.png" class="img-fluid" style="max-height:100%" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="top" data-bs-title="RONALDINHO SOCCER"> ';
		}

		// Generate a ship.
		// Start initialized, since this is optional.
		var ship = '';
		if (row.Ship != null && row.Server != null) {
			var serverref = row.Server.toLowerCase();
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
			var fixedservername = serverref.charAt(0).toUpperCase() + serverref.slice(1).toLowerCase();
			var iconref = 'ship' + row.Ship + '-' + serverref;
			ship = '<img src="img/' + iconref + '.png" class="img-fluid" style="max-height:100%" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="top" data-bs-title="Ship ' + row.Ship + ' - ' + fixedservername + '"> ';
		}

		// Apply everything to the button. Flag -> Ship -> Preferred Name
		buttonref.innerHTML = flag + ship + name;
		tdname.appendChild(buttonref);
		tdname.appendChild(modalfade);

		tr.appendChild(tdname);

		// Create Main Class Info...
		const tdmc = document.createElement("td");
		tdmc.innerHTML = splitPartyClasses(row.MainClass);
		tr.appendChild(tdmc);

		// Create Sub Class Info...
		const tdsc = document.createElement("td");
		tdsc.innerHTML = splitPartyClasses(row.SubClass);
		tr.appendChild(tdsc);

		// Create Weapon Info...
		const tdweapons = document.createElement("td");
		// We only pass PlayerID for one player's requested meme.
		tdweapons.innerHTML = splitPartyWeapons(row.WeaponInfo, row.PlayerID);
		tr.appendChild(tdweapons);

		// Create the Time...
		const tdtime = document.createElement("td");
		tdtime.textContent = row.Time;
		tr.appendChild(tdtime);

		// Create the link...
		const tdlink = document.createElement("td");
		var link = document.createElement("a");

		link.setAttribute("href", row.Link);
		link.setAttribute("target","_blank");
		link.setAttribute("rel","noreferrer noopener")
		link.textContent = "Link";
		tdlink.textContent = "";

		tr.appendChild(tdlink);
		tdlink.appendChild(link);

		if (row.Notes != null) {
			tr.classList.add("pso2-noted");
			tdlink.innerHTML += ' <i class="bi-info-circle" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="left" data-bs-title="' + row.Notes + '"></i>';
		}

		// Finally, add the row.
        scorebody.appendChild(tr);

	});

	// Reload tooltips, otherwise they won't work.
	reloadTooltips();
}

function Party_Purple_LoadRankings (data) {

	// Initialize the Scoreboard
	cleanupScore();

	// Prepare the region names tool.
	let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

	// Initialize Score Rank reference.
	var rank = 0;
	// Initialize the Last Time reference.
	var lasttime = null;

	// Make the JSON readable by the forEach function.
	var parsed = JSON.parse(data);

	// If the response was nothing, generate the 'No Scores' line.
	if (Object.keys(parsed).length === 0) {
        createNoScores();
		return;
	}

	// Start filling out the leaderboard. This iterates over each 'row', which in our case is each returned run.
	parsed.forEach((row) => {

		// Create arrays so we can actually use the returned data. Parties return with @@@ separators, so this is REQUIRED!
		var partyRunCharacterName = row.RunCharacterName.split('@@@');
		var partyShipOverride = row.ShipOverride.split('@@@');

		var partyLinkPOVs = row.LinkPOV.split('@@@');

		var partyPlayerIDs = row.PlayerID.split('@@@');
		var partyPlayerName = row.PlayerName.split('@@@');
		var partyCharacterName = row.CharacterName.split('@@@');

		var partyDescription = row.Description.split('@@@');
		var partyYoutube = row.Youtube.split('@@@');
		var partyTwitch = row.Twitch.split('@@@');
		var partyTwitter = row.Twitter.split('@@@');
		var partyDiscord = row.Discord.split('@@@');

		var partyPreferredName = row.PreferredName.split('@@@');
		var partyServer = row.Server.split('@@@');
		var partyShip = row.Ship.split('@@@');
		var partyFlag = row.Flag.split('@@@');

		/*
		REGARDING BACKGROUND CUSTOMIZATION:

		This probably wont be used at all in party runs.

		Immediate thought anyone reading this has will probably either be 'Why?' or 'Very understandable.'

		To explain:

		I'm splitting this into a usable array just for consistency in case I use this for anything in profiles later.
		Why it isn't being used on runs is a bit more complex.
		
		I'll leave it at 'we might all have a laugh about it only showing one player's background, but eventually new players might not' and leave it at that.
		*/

		var partyBGType = row.BackgroundType.split('@@@');
		var partyBGImage = row.BackgroundImage.split('@@@');
		var partyBGColor = row.BackgroundColor.split('@@@');

		// Name colors are funni and easy though :)

		var partyNameType = row.NameType.split('@@@');
		var partyNameColor1 = row.NameColor1.split('@@@');
		var partyNameColor2 = row.NameColor2.split('@@@');

		// This is the row we'll fill out.
		const tr = document.createElement("tr");

		// First, generate a rank for the runner, starting from 1.

		// Check if the last row's time matches this one. If so, don't +1.
		if (lasttime != row.Time){
			rank += 1;
		}
		// Set the last time to this row's time.
		lasttime = row.Time;

		// Create the rank # or rank icons depending on the current rank.
		createRanking(tr,rank);

		// And now begins iterating over the players in wild and horrible ways.
		// We can safely use Player IDs as our iterator.
		// Create the name column.
		const tdname = document.createElement("td");
		partyPlayerIDs.forEach((element, index) => {
			var name = '';
			// Check the player's preferred name.
			switch (parseInt(partyPreferredName[index])) {
				// Player Name
				case 0:
					name = partyPlayerName[index];
					break;
				// (Main) Character Name
				case 1:
					name = partyCharacterName[index];
					break;
				// In-Video Character Name
				case 2:
					name = partyRunCharacterName[index];
					break;
			}
			if (name != partyRunCharacterName[index])
				name = '<span data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="' + partyRunCharacterName[index] + '">' + name + '</span>';
				//name = name + ' <span class="text-secondary">' + partyRunCharacterName[index] + '</span>';

			// With the name set, we enter the H O R R O R Z O N E (generating the modal) -- Since this is parties, it's E V E N W O R S E.

			// 7:34 AM, EST, 1/21/2023. I haven't started on this yet, but I get the feeling it's going to suck.
			// 7:37 AM. Actually this might not be so bad, somehow...?
			// 8:13 AM. Got distracted making the name loader work and almost writing a paragraph about party backgrounds. Things suddenly looking a bit scary for the below chaos.
			// Forgot to check back in after doing everything, it wasn't that bad.

			// Generate the main modal. I won't go into detail on most of this.
			const modalfade = document.createElement("div");
			modalfade.classList.add("modal","fade");
			// This NEEDS to be unique to be able to open the modal.
			modalfade.setAttribute("id","PlayerInfo-" + partyPlayerIDs[index] + row.RunID);
			// Store the id for later.
			const modalIDref = '#' + modalfade.getAttribute("id");
			modalfade.setAttribute("tabindex","-1");
			modalfade.setAttribute("aria-labelledby","Runner Information");
			modalfade.setAttribute("aria-hidden","true");
			// Generate the modal div that centers and enables scrolling.
			const modalcentered = document.createElement("div");
			modalcentered.classList.add("modal-dialog","modal-dialog-centered","modal-dialog-scrollable");
			modalfade.appendChild(modalcentered);
			// Generate the modal content...
			const modalcontent = document.createElement("div");
			modalcontent.classList.add("modal-content","text-bg-dark")
			// Because the inner HTML on it would take forever, we do modalcontent all at once. We run generateRunnerInfo in this mess to populate info.
			modalcontent.innerHTML = `<div class="modal-header" style="border-bottom: var(--bs-modal-header-border-width) solid #0000004f">
			<h1 class="modal-title fs-5">Runner Information</h1>
			<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
		</div><div class="modal-body">` + generateRunnerInfoParty(parseInt(partyPreferredName[index]),partyCharacterName[index],partyPlayerName[index],partyTwitch[index],partyTwitter[index],partyYoutube[index],partyDiscord[index],partyFlag[index],parseInt(partyPlayerIDs[index]),partyDescription[index],parseInt(partyShip[index]),partyServer[index]) + `</div>
	<div class="modal-footer" style="border-top: var(--bs-modal-header-border-width) solid #0000004f">
		<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
	</div>`
			modalcentered.appendChild(modalcontent);
			// Create the 'button'. Really just a clickable name.
			const buttonref = document.createElement("button");
			buttonref.setAttribute("type","button");
			// Make the button the size of the names and align everything.
			buttonref.classList.add("btn","btn-link","m-0","p-0","d-inline-flex","align-items-center","gap-1");
			// Set the default name customization.
			buttonref.style.cssText = `--bs-btn-padding-y: 0px; --bs-btn-padding-x: 0px; background-color: #0000; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF; text-decoration: none; font-weight: bold;`;
			// Check the name customization setting.
			switch (parseInt(partyNameType[index])) {
				// Flat Color
				case 1:
					buttonref.style.cssText += `--bs-btn-color: #` + partyNameColor1[index] + `; --bs-btn-hover-color: #` + partyNameColor1[index] + `; --bs-btn-active-color: #` + partyNameColor1[index] + `;`;
					break;
				// Gradient Color
				case 2:
					buttonref.style.cssText += `background: -webkit-linear-gradient(0deg, #` + partyNameColor1[index] + `, #` + partyNameColor2[index] + `);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;`;
					break;
				// Glow Color
				case 3:
					//console.log(partyNameColor1[index]);
					buttonref.style.cssText += `text-shadow: 0px 0px 5px #` + partyNameColor1[index] + `, 0px 0px 5px #` + partyNameColor1[index] + `, 0px 0px 5px #` + partyNameColor1[index] + `;`;
					break;
				default:
					break;
			}
			buttonref.dataset.bsToggle = 'modal';
			buttonref.dataset.bsTarget = modalIDref;

			// We have now exited the H O R R O R Z O N E.

			// Now for the optional stuff...

			// Generate a flag.
			// Start initialized, since this is optional.
			var flag = '';
			// If we do have a flag, go ahead and generate.
			if (partyFlag[index] != null && partyFlag[index] != 'partynull') {
				flag = `<span class="fi fi-` + partyFlag[index] + `" style="max-height:16px;min-width: 25px;" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="top" data-bs-title="` + regionNames.of(partyFlag[index].toUpperCase()) + `"></span> `;
			}

			// Ignore this, it's for requested memes.
			if (parseInt(partyPlayerIDs[index]) === 4) {
				flag = '<img src="custom/img/sukeboy/ronaldinho.png" class="img-fluid" style="max-height:100%" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="top" data-bs-title="RONALDINHO SOCCER"> ';
			}

			// Generate a ship.
			// Start initialized, since this is optional.
			var ship = '';
			if (partyShip[index] != null && partyServer[index] != null && partyShip[index] != '99' && partyServer[index] != 'partynull') {
				var serverref = partyServer[index].toLowerCase();
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
				var fixedservername = serverref.charAt(0).toUpperCase() + serverref.slice(1).toLowerCase();
				var iconref = 'ship' + partyShip[index] + '-' + serverref;
				ship = '<img src="img/' + iconref + '.png" class="img-fluid" style="max-height:100%" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="top" data-bs-title="Ship ' + partyShip[index] + ' - ' + fixedservername + '"> ';
			}

			// Apply everything to the button. Flag -> Ship -> Preferred Name
			buttonref.innerHTML = flag + ship + name;
			tdname.appendChild(buttonref);
			tdname.appendChild(modalfade);
			tdname.innerHTML += '<br>'
		});

		tr.appendChild(tdname);

		// Create Main Class Info...
		const tdmc = document.createElement("td");
		tdmc.innerHTML = splitPartyClasses(row.MainClass);
		tr.appendChild(tdmc);

		// Create Sub Class Info...
		const tdsc = document.createElement("td");
		tdsc.innerHTML = splitPartyClasses(row.SubClass);
		tr.appendChild(tdsc);

		// Create Weapon Info...
		const tdweapons = document.createElement("td");
		// We only pass PlayerID for one player's requested meme.
		tdweapons.innerHTML = splitPartyWeapons(row.WeaponInfo, row.PlayerID);
		tr.appendChild(tdweapons);

		// Create the Time...
		const tdtime = document.createElement("td");
		tdtime.textContent = row.Time;
		tr.appendChild(tdtime);

		// Create the link...
		const tdlink = document.createElement("td");

		partyPlayerIDs.forEach((element, index) => {

			if (partyLinkPOVs[index] != null && partyLinkPOVs[index] != 'partynull') {
				var link = document.createElement("a");
				link.setAttribute("href", partyLinkPOVs[index]);
				link.setAttribute("target","_blank");
				link.setAttribute("rel","noreferrer noopener")
				link.textContent = "Link";
			}
			else {
				var link = document.createElement("div");
				link.textContent = "No POV";
			}
			tdlink.appendChild(link);
			//console.log(index);
			//console.log(partyLinkPOVs.length);
			if (partyLinkPOVs[index] != null && partyLinkPOVs[index] != 'partynull') {
				tdlink.innerHTML += '<br>';
			}

		});
		tdlink.classList.add("text-secondary");
		tr.appendChild(tdlink);

		if (row.Notes != null) {
			tr.classList.add("pso2-noted");
			tdlink.innerHTML += ' <i class="bi-info-circle text-light" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="left" data-bs-title="' + row.Notes + '"></i>';
		}

		// Finally, add the row.
        scorebody.appendChild(tr);

	});

	// Reload tooltips, otherwise they won't work.
	reloadTooltips();
}

// Functions for Data --> Scoreboard Loading

function createNoScores() {
	const tr = document.createElement("tr");

	const tdemptyr = document.createElement("td");
	tdemptyr.classList.add("text-center");
	const tdempty1 = document.createElement("td");
	const tdempty2 = document.createElement("td");
	const tdempty3 = document.createElement("td");
	const tdempty4 = document.createElement("td");
	const tdempty5 = document.createElement("td");
	const tdempty6 = document.createElement("td");
	tdemptyr.innerHTML = '<img src="img/scoreboard-rank1.png">';
	tdempty1.textContent = "No Scores";
	tr.appendChild(tdemptyr);
	tr.appendChild(tdempty1);
	tr.appendChild(tdempty2);
	tr.appendChild(tdempty3);
	tr.appendChild(tdempty4);
	tr.appendChild(tdempty5);
	tr.appendChild(tdempty6);
	scorebody.appendChild(tr);
}

function createRanking(tr,rank) {
	const tdinit = document.createElement("td");
	switch (rank) {
		case 1:
			tdinit.innerHTML = '<img src="img/scoreboard-rank1.png">';
			break;
		case 2:
			tdinit.innerHTML = '<img src="img/scoreboard-rank2.png">';
			break;
		case 3:
			tdinit.innerHTML = '<img src="img/scoreboard-rank3.png">';
			break;
		default:
			tdinit.innerHTML = rank;
			break;
	}
	// Center the rank.
	tdinit.classList.add("text-center");
	tr.appendChild(tdinit);
}

function testLocale() {
	const regionNamesInEnglish = new Intl.DisplayNames(['ja-JP'], { type: 'region' });
	//console.log(regionNamesInEnglish.of('CA'));
}

function generateRunnerInfoSolo (data) {
	const newData = data;
	let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
	var socialTwitch = '';
	var socialYoutube = '';
	var socialTwitter = '';
	var socialDiscord = '';
	var location = '';
	var name = '';
	var ship = '';
	switch(newData.PreferredName) {
		case 1:
			name = newData.CharacterName;
			name2 = newData.PlayerName;
			break;
		default:
			name = newData.PlayerName;
			if (newData.CharacterName != null) {
				name2 = newData.CharacterName;
			}
			else {
				name2 = '';
			}
			break;
	}
	if (newData.Twitch != null) {
		socialTwitch = '<a href="https://twitch.tv/' + newData.Twitch + '" target="_blank" rel="noreferrer noopener" class="link-light"><i class="bi bi-twitch"></i></a>';

	}
	if (newData.Youtube != null) {
		socialYoutube = '<a href="https://youtube.com/@' + newData.Youtube + '" target="_blank" rel="noreferrer noopener" class="link-light"><i class="bi bi-youtube"></i></a>';

	}
	if (newData.Twitter != null) {
		socialTwitter = '<a href="https://twitter.com/' + newData.Twitter + '" target="_blank" rel="noreferrer noopener" class="link-light"><i class="bi bi-twitter"></i></a>';

	}
	if (newData.Discord != null) {
		socialDiscord = '<i class="bi bi-discord" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="' + newData.Discord + '"></i>';

	}
	if (newData.Flag != null) {
		var flag = '<span class="fi fi-' + newData.Flag + '"></span>'
		var country = regionNames.of(newData.Flag.toUpperCase());
		location = flag + country;
	}
	if (newData.PlayerID === 4) {
		location = '<img src="custom/img/sukeboy/ronaldinho.png" class="img-fluid" style="max-height:100%"> RONALDINHO SOCCER';
	}
	var description = `We don't have a description for ` + name + `, but they're definitely cool!`;
	if (newData.Description != null) {
		description = newData.Description;
	}
	if (newData.Ship != null && newData.Server != null) {
		var serverref = newData.Server.toLowerCase();
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
		var fixedservername = serverref.charAt(0).toUpperCase() + serverref.slice(1).toLowerCase();
		var iconref = 'ship' + newData.Ship + '-' + serverref;
		var shiphtml = '<div class="vr"></div><img src="img/' + iconref + '.png" class="img-fluid" style="max-height:100%">'
		var shipinfohtml = 'Ship ' + newData.Ship + ' - ' + fixedservername;
		var ship = shiphtml + shipinfohtml;
	}

	returns = '<div class="d-flex flex-column"><div class="d-flex flex-row gap-2"><div class="me-auto"><strong>' + name + '</strong></div>' + socialYoutube + socialTwitch + socialTwitter + socialDiscord + '</div><div class="d-flex flex-row gap-1 text-white-50">' + name2 + '</div></div><hr style="border-top: var(--bs-modal-header-border-width) solid #000000"><div class="d-flex flex-row">' + description + '</div><div class="d-flex flex-row gap-1 mt-3 align-items-center text-white-50" style="font-size:0.8rem">' + location + ship + '</div></div>';
	return returns;
}
// This is so, so cursed... I'll only admit it here (or if pressed on it) but this is what happens when I give myself a deadline of the 25th.
function generateRunnerInfoParty (PreferredName,CharacterName,PlayerName,Twitch,Twitter,Youtube,Discord,aFlag,PlayerID,aDescription,aShip,aServer) {
	parseShip = parseInt(aShip);
	parsePlayerID = parseInt(PlayerID);
	let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
	var socialTwitch = '';
	var socialYoutube = '';
	var socialTwitter = '';
	var socialDiscord = '';
	var location = '';
	var name = '';
	var ship = '';
	switch(parseInt(PreferredName)) {
		case 1:
			name = CharacterName;
			name2 = PlayerName;
			break;
		default:
			name = PlayerName;
			if (CharacterName != null && CharacterName != 'partynull') {
				name2 = CharacterName;
			}
			else {
				name2 = '';
			}
			break;
	}
	if (Twitch != null && Twitch != 'partynull') {
		socialTwitch = '<a href="https://twitch.tv/' + Twitch + '" target="_blank" rel="noreferrer noopener" class="link-light"><i class="bi bi-twitch"></i></a>';

	}
	if (Youtube != null && Youtube != 'partynull') {
		socialYoutube = '<a href="https://youtube.com/@' + Youtube + '" target="_blank" rel="noreferrer noopener" class="link-light"><i class="bi bi-youtube"></i></a>';

	}
	if (Twitter != null && Twitter != 'partynull') {
		socialTwitter = '<a href="https://twitter.com/' + Twitter + '" target="_blank" rel="noreferrer noopener" class="link-light"><i class="bi bi-twitter"></i></a>';

	}
	if (Discord != null && Discord != 'partynull') {
		socialDiscord = '<i class="bi bi-discord" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="' + Discord + '"></i>';

	}
	if (aFlag != null && aFlag != 'partynull') {
		var flag = '<span class="fi fi-' + aFlag + '"></span>'
		var country = regionNames.of(aFlag.toUpperCase());
		location = flag + country;
	}
	if (parsePlayerID === 4) {
		location = '<img src="custom/img/sukeboy/ronaldinho.png" class="img-fluid" style="max-height:100%"> RONALDINHO SOCCER';
	}
	var description = `We don't have a description for ` + name + `, but they're definitely cool!`;
	if (aDescription != null && aDescription != 'partynull') {
		description = aDescription;
	}
	if (parseShip != null && aServer != null && aServer != 'partynull' && parseShip != '99') {
		var serverref = aServer.toLowerCase();
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
		var fixedservername = serverref.charAt(0).toUpperCase() + serverref.slice(1).toLowerCase();
		var iconref = 'ship' + parseShip + '-' + serverref;
		var shiphtml = '<div class="vr"></div><img src="img/' + iconref + '.png" class="img-fluid" style="max-height:100%">'
		var shipinfohtml = 'Ship ' + parseShip + ' - ' + fixedservername;
		var ship = shiphtml + shipinfohtml;
	}

	returns = '<div class="d-flex flex-column"><div class="d-flex flex-row gap-2"><div class="me-auto"><strong>' + name + '</strong></div>' + socialYoutube + socialTwitch + socialTwitter + socialDiscord + '</div><div class="d-flex flex-row gap-1 text-white-50">' + name2 + '</div></div><hr style="border-top: var(--bs-modal-header-border-width) solid #000000"><div class="d-flex flex-row">' + description + '</div><div class="d-flex flex-row gap-1 mt-3 align-items-center text-white-50" style="font-size:0.8rem">' + location + ship + '</div></div>';
	return returns;
}

function reloadTooltips() {
	tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
	tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function checkScoreOptions() {
	var mainCategory = document.querySelector('input[name="category-purple"]:checked').value;
	var partySize = document.querySelector('input[name="partysize"]:checked').value;
	var primeCategory = document.querySelector('input[name="mainCategory"]:checked').value;
	var patchNo = document.querySelector('input[name="gamepatch"]:checked').value;
	var classFilter = document.querySelector('input[name="classFilter"]:checked').value;
	var serverFilter = document.querySelector('input[name="serverFilter"]:checked').value;
	var classNames = '';
	var myCollapse = new bootstrap.Collapse(filterclassbuttons, { toggle: false } );
	if (partySize != "solo") {
		myCollapse.hide();
		//console.log("hide");
		classFilter = "none";
	}
	else if (partySize == "solo") {
		//console.log("SHOW");
		myCollapse.show();
		if (classFilter != "none") {
			classNames = classFilter;
		}
	}
	if (patchNo == "NULL") {
		patchNo = 'none';
	}
	
	switch(mainCategory) {
		case "aelio":
			rankSelected = '3';
			break;
		case "retem":
			rankSelected = '3';
			break;
		case "kvaris":
			rankSelected = '3';
			break;
		case "stia":
			rankSelected = '1';
			break;
	}
	//console.log(mainCategory);
	//console.log(partySize);
	//console.log(primeCategory);
	//console.log(patchNo);
	
	var scoreCode = primeCategory+'-'+mainCategory+'-'+partySize+'-'+patchNo;
	var categoryName = primeCategory+'-'+mainCategory;
	var output = generateCategoryName(categoryName, partySize, patchNo, classNames,serverFilter);
	scoretitle.innerHTML = output;
	if(primeCategory != 'maincategory-ordinal') {
		loadScoresPrepare(mainCategory,classFilter,rankSelected,partySize,patchNo,serverFilter);
	}
}

// Time for the most sinful function in this file.

function generateCategoryName(category,partysize,patch,classFilter,serverFilter) {
	
	var mainClass = '';
	// First, generate the category name. TODO: Scalability. Right now this is designed to do a switch case check, I could do a string split similar to the weapons generation to create a title.
	switch(category) {
		case "purple-aelio":
			categoryName = 'Aelio Devastators Rank.3';
			break;
		case "purple-retem":
			categoryName = 'Retem Devastators Rank.3';
			break;
		case "purple-kvaris":
			categoryName = 'Kvaris Devastators Rank.3';
			break;
		case "purple-stia":
			categoryName = 'Stia Devastators';
			break;
	}
	// Second, generate the text for the party size.
	switch(partysize) {
		case "solo":
			partyName = '(Solo)';
			break;
		case "duo":
			partyName = '(Duo)';
			break;
		case "trio":
			partyName = '(Trio)';
			break;
		case "party":
			partyName = '(Full Party)';
			break;
	}
	// Finally, the game version number. This is for cases where sega adjusts balance on us.
	switch(patch) {
		case 'none':
			var patchNo = '[Pre-+60 Release]';
			break;
		case '60r':
			var patchNo = '[+60 Release]';
			break;
	}
	
	// Whoops, one more. Build the class name, since other methods break things.
	switch(classFilter) {
		case "none":
			mainClass = '';
			break;
		case "hunter":
			mainClass = '<img src="img/class-hunter.png"> Hunters - ';
			break;
		case "fighter":
			mainClass = '<img src="img/class-fighter.png"> Fighters - ';
			break;
		case "ranger":
			mainClass = '<img src="img/class-ranger.png"> Rangers - ';
			break;
		case "gunner":
			mainClass = '<img src="img/class-gunner.png"> Gunners - ';
			break;
		case "force":
			mainClass = '<img src="img/class-force.png"> Forces - ';
			break;
		case "techter":
			mainClass = '<img src="img/class-techter.png"> Techters - ';
			break;
		case "braver":
			mainClass = '<img src="img/class-braver.png"> Bravers - ';
			break;
		case "bouncer":
			mainClass = '<img src="img/class-bouncer.png"> Bouncers - ';
			break;
		case "waker":
			mainClass = '<img src="img/class-waker.png"> Wakers - ';
			break;
		default:
			mainClass = '';
			break;
	}
	switch (serverFilter)
	{
		case "none":
			serverName = '';
			break;
		case "global":
			serverName = ' - Global';
			break;
		case "japan":
			serverName = ' - Japan';
			break;
	}
	
	// And now, put it all together.
	result = mainClass + categoryName + ' ' + partyName + serverName + ' </strong><br><small>' + patchNo + '</small><strong>';
	
	//console.log(result)
	
	return result;
}

function disableButtons() {
	buttongroupClasses.forEach((element) => {
		element.setAttribute("disabled",'');
	});
	buttongroupPatch.forEach((element) => {
		element.setAttribute("disabled",'');
	});
	buttongroupCategory.forEach((element) => {
		element.setAttribute("disabled",'');
	});
	buttongroupSubcategory.forEach((element) => {
		element.setAttribute("disabled",'');
	});
	buttongroupParty.forEach((element) => {
		element.setAttribute("disabled",'');
	});
	buttongroupServer.forEach((element) => {
		element.setAttribute("disabled",'');
	});
}

function enableButtons() {
	buttongroupClasses.forEach((element) => {
		element.removeAttribute("disabled");
	});
	buttongroupPatch.forEach((element) => {
		element.removeAttribute("disabled");
	});
	buttongroupCategory.forEach((element) => {
		element.removeAttribute("disabled");
	});
	buttongroupSubcategory.forEach((element) => {
		element.removeAttribute("disabled");
	});
	buttongroupParty.forEach((element) => {
		element.removeAttribute("disabled");
	});
	buttongroupServer.forEach((element) => {
		element.removeAttribute("disabled");
	});
}

function loadScoresBegin() {
	disableButtons();
	checkScoreOptions();
}

function loadScoresPrepare (region,mainclass,rank,partySize,patch,serverFilter) {
	
	if (partySize != 'solo')
	{
		Party_Purple_SendRequest(region,mainclass,rank,partySize,patch,serverFilter);
	}
	else
	{
		Solo_Purple_SendRequest(region,mainclass,rank,partySize,patch,serverFilter);
	}
	
}

function splitPartyPlayers(input) {
	var inputArray = input.split('@@@');
	//console.log(inputArray);
	let result = '';
	inputArray.forEach((string) => {
		result = result + string + '<br>';
	});
	return result;
}

function splitPartyWeapons(input, id) {
	var inputArray = input.split('@@@');
	//console.log(inputArray);
	let result = '';
	inputArray.forEach((string) => {
		result = result + generateWeaponImages(string, id) + '<br>';
	});
	return result;
}

function splitPartyClasses(input) {
	var inputArray = input.split('@@@');
	//console.log(inputArray);
	let result = '';
	inputArray.forEach((string) => {
		result = result + generateClassImages(string) + '<br>';
	});
	return result;
}

function generateClassImages(input) {
	const input2 = input.toLowerCase();
	switch (input2) {
		case "hunter":
			return '<img src="img/class-hunter.png"> Hunter';
			break;
		case "fighter":
			return '<img src="img/class-fighter.png"> Fighter';
			break;
		case "ranger":
			return '<img src="img/class-ranger.png"> Ranger';
			break;
		case "gunner":
			return '<img src="img/class-gunner.png"> Gunner';
			break;
		case "force":
			return '<img src="img/class-force.png"> Force';
			break;
		case "techter":
			return '<img src="img/class-techter.png"> Techter';
			break;
		case "braver":
			return '<img src="img/class-braver.png"> Braver';
			break;
		case "bouncer":
			return '<img src="img/class-bouncer.png"> Bouncer';
			break;
		case "waker":
			return '<img src="img/class-waker.png"> Waker';
			break;
		case "gunblade-placeholder":
			return '<img src="img/class-gunblade.png"> Gunblade';
			break;
		case "?":
			return '<img src="img/class-unknown.png"> Unknown';
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
				result = result + '<img src="img/weapon-sword.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Sword">' + ' ';
				break;
			case "wl":
				result = result + '<img src="img/weapon-wire.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Wired Lance">' + ' ';
				break;
			case "partisan":
				result = result + '<img src="img/weapon-partisan.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Partisan">' + ' ';
				break;
			case "td":
				result = result + '<img src="img/weapon-daggers.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Twin Daggers">' + ' ';
				break;
			case "ds":
				result = result + '<img src="img/weapon-saber.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Dual Saber">' + ' ';
				break;
			case "knuckles":
				result = result + '<img src="img/weapon-knux.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Knuckles">' + ' ';
				break;
			case "katana":
				result = result + '<img src="img/weapon-katana.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Katana">' + ' ';
				break;
			case "sb":
				result = result + '<img src="img/weapon-blades.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Soaring Blades">' + ' ';
				break;
			case "rifle":
				if (id === 4) {
					result = result + '<img src="custom/img/sukeboy/kaiby.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Kaibygun (Assault Rifle)">' + ' ';
					break;
				}
				else {
					result = result + '<img src="img/weapon-rifle.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Assault Rifle">' + ' ';
					break;
				}
				break;
			case "launcher":
				result = result + '<img src="img/weapon-launcher.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Launcher">' + ' ';
				break;
			case "tmg":
				result = result + '<img src="img/weapon-tmg.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Twin Machine Guns">' + ' ';
				break;
			case "bow":
				result = result + '<img src="img/weapon-bow.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Bow">' + ' ';
				break;
			case "rod":
				result = result + '<img src="img/weapon-rod.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Rod">' + ' ';
				break;
			case "talis":
				result = result + '<img src="img/weapon-talis.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Talis">' + ' ';
				break;
			case "wand":
				result = result + '<img src="img/weapon-wand.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Wand">' + ' ';
				break;
			case "jb":
				result = result + '<img src="img/weapon-boots.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Jet Boots">' + ' ';
				break;
			case "takt":
				result = result + '<img src="img/weapon-takt.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Harmonizer">' + ' ';
				break;
			case "gunblade":
				result = result + '<img src="img/weapon-gunblade.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Gunblade">' + ' ';
				break;
			default:
				return '';
				break;
		}
	});
	return result;
}

function buildAddonSkills() {
	
}

function cleanupScore() {
    while (scorebody.firstChild) {
        scorebody.removeChild(scorebody.firstChild);
    }
}
