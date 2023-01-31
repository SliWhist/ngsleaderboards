

var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
var tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

const scoreTable = document.querySelector("#top10body");

addEventListener("load", (event) => {

    loadScoresBegin();

});

function generateClassImages(input) {
	const input2 = input.toLowerCase();
	switch (input2) {
		case "hunter":
			return '<img src="/img/class-hunter.png"> ';
			break;
		case "fighter":
			return '<img src="/img/class-fighter.png"> ';
			break;
		case "ranger":
			return '<img src="/img/class-ranger.png"> ';
			break;
		case "gunner":
			return '<img src="/img/class-gunner.png"> ';
			break;
		case "force":
			return '<img src="/img/class-force.png"> ';
			break;
		case "techter":
			return '<img src="/img/class-techter.png"> ';
			break;
		case "braver":
			return '<img src="/img/class-braver.png"> ';
			break;
		case "bouncer":
			return '<img src="/img/class-bouncer.png"> ';
			break;
		case "waker":
			return '<img src="/img/class-waker.png"> ';
			break;
		case "gunblade-placeholder":
			return '<img src="/img/class-gunblade.png"> ';
			break;
		case "?":
			return '<img src="/img/class-unknown.png"> ';
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

function loadScoresBegin() {
	getDatabase();
}

// This function requests Solo purple rankings
function getDatabase () {

	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
			loadScores(httpRequest.response);
		}
	}
	
	httpRequest.open('POST', '/api/purple10', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send();
}

// This function loads Solo purple rankings.
function loadScores (data) {

	// Make the JSON readable by the forEach function.
	var parsed = JSON.parse(data);

	// If the response was nothing, generate the 'No Scores' line.
	//if (Object.keys(parsed).length === 0) {
    //    createNoScores();
	//	return;
	//}

	// Start filling out the leaderboard. This iterates over each 'row', which in our case is each returned run.
	parsed.forEach((row) => {

		// This is the row we'll fill out.
		const tr = document.createElement("tr");

		// Create the name column.
		const tdname = document.createElement("td")
		var tdname2 = ``;
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

		// Create the 'button'. Really just a clickable name.

		const buttonref = document.createElement("a");
		buttonref.setAttribute("role","button");
		buttonref.setAttribute("href","/run/purple");
		// Make the button the size of the names and align everything.
		buttonref.classList.add("btn","btn-link","m-0","p-0","d-inline-flex","align-items-center","gap-1");
		// Set the default name customization.
        if(row.PlayerID != 106 && row.PlayerID != 107) {
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
        }
        else {
            buttonref.style.cssText = `--bs-btn-padding-y: 0px; --bs-btn-padding-x: 0px; background-color: #0000; --bs-btn-color: #a7b5c1; --bs-btn-hover-color: #a7b5c1; --bs-btn-active-color: #a7b5c1; text-decoration: none; font-weight: normal; color:#a7b5c1!important; opacity:100%!important`;
            buttonref.setAttribute('disabled',"");
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
        }

		// Apply everything to the button. Flag -> Ship -> Preferred Name
		buttonref.innerHTML = generateClassImages(row.MainClass) + name;
        buttonref.style.fontSize = '14px';
		buttonref.style.textAlign = 'left';
		tdname.appendChild(buttonref);
		if (name != row.RunCharacterName) {
			tdname2 = document.createElement("span");
			tdname2.innerHTML = `<br>` + row.RunCharacterName;
			tdname2.style.fontSize = '12px';
			tdname2.style.textAlign = 'left';
			tdname2.style.color = '#a7b5c1';
			tdname.appendChild(tdname2);
		}
		
		tdname.style.verticalAlign = 'middle';
		tdname.style.textAlign = 'left';
		tr.appendChild(tdname);

		// Create the Time...
		const tdtime = document.createElement("td");
        const timeSplit = row.Time.split(":");
		tdtime.textContent = timeSplit[0] + 'm ' + timeSplit[1] + 's';
        tdtime.classList.add('text-center')
        tdtime.style.fontSize = '14px';
		tdtime.style.verticalAlign = 'middle';
		tr.appendChild(tdtime);

		const tdcat = document.createElement("td");
		tdcat.textContent = row.Region.charAt(0).toUpperCase() + row.Region.slice(1).toLowerCase() + ' (R.' + row.Rank + ')';
		tdcat.classList.add('text-center')
        tdcat.style.fontSize = '14px';
		tdcat.style.verticalAlign = 'middle';
		tr.appendChild(tdcat);

		// Finally, add the row.
        scoreTable.appendChild(tr);

	});
}