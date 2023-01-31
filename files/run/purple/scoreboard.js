var currentFiltering = window.location.search;

// Prepare the region names tool.
let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

var filter = new URLSearchParams(currentFiltering);

const categoryList = [ "stia","kvaris","retem","aelio" ]

var globalCategory = '';
var globalRank = '';

var globalPatch = '';
var globalPatchURL = '';
var globalClass = '';
var globalClassURL = '';
var globalServer = '';
var globalServerURL = '';

const buttonsrefClass = document.querySelectorAll("[name='category-class']");
const buttonsrefPatch = document.querySelectorAll("[name='category-patch']");
const buttonsrefServer = document.querySelectorAll("[name='category-server']");
const buttonsrefPurple = document.querySelectorAll("[name='category-purple']");
const buttonsrefRank = document.querySelectorAll("[name='rankbuttons']");

const dropdownRankRef = document.getElementById('dropdownRanksReference');
const applyFiltersButtonRef = document.getElementById('applyFiltersButton');

const runInfoModal = document.getElementById('runInfoModal');

var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
var tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

const scoreTable = document.querySelector("#scoreTable");

runInfoModal.addEventListener('show.bs.modal', function (event) {
    generateInfo(event);
})

runInfoModal.addEventListener('hide.bs.modal', function (event) {
    cleanupPanel();
})

runInfoModal.addEventListener('hide.bs.modal', function (event) {
    //cleanupPanel();
    //disableButtons();
	//submitButton.removeAttribute("data-bs-runid");
})

addEventListener("load", (event) => {

    setActiveButtons();
    loadScoresBegin();

});

function Refresh() {

    cleanupScore();

    currentFiltering = window.location.search;

    filter = new URLSearchParams(currentFiltering);
    document.getElementById('rank-1').classList.remove('active');
    document.getElementById('rank-2').classList.remove('active');
    document.getElementById('rank-3').classList.remove('active');
    setActiveButtons();
	loadScoresBegin();
}

function setActiveButtons() {
    var category = filter.get('cat');
    var rank = filter.get('rank');

    if (!checkFilters('category',category)) {
        category = 'stia';
    }
    if (category == null) {
        category = 'stia';
    }
	
    console.log(category);
    
    rank = checkFilters('rank',rank,category);

    console.log(rank);

    globalPatch = filter.get('patch');
	if (globalPatch == null) {
		globalPatch = '60R';
	}

    globalServer = filter.get('server');
    globalClass = filter.get('class');

    switch (category) {
        case 'stia':
            document.getElementById('category-purple4').setAttribute('checked','');
            document.getElementById('category-purple4').setAttribute('aria-pressed','true');
            document.getElementById('rank-1').classList.remove('disabled');
            document.getElementById('rank-2').classList.add('disabled');
            document.getElementById('rank-3').classList.add('disabled');
            break;
        case 'kvaris':
            document.getElementById('category-purple3').setAttribute('checked','');
            document.getElementById('category-purple3').setAttribute('aria-pressed','true');
            document.getElementById('rank-1').classList.remove('disabled');
            document.getElementById('rank-2').classList.remove('disabled');
            document.getElementById('rank-3').classList.add('disabled');
            break;
        case 'retem':
            document.getElementById('category-purple2').setAttribute('checked','');
            document.getElementById('category-purple2').setAttribute('aria-pressed','true');
            document.getElementById('rank-1').classList.remove('disabled');
            document.getElementById('rank-2').classList.remove('disabled');
            document.getElementById('rank-3').classList.remove('disabled');
            break;
        case 'aelio':
            document.getElementById('category-purple1').setAttribute('checked','');
            document.getElementById('category-purple1').setAttribute('aria-pressed','true');
            document.getElementById('rank-1').classList.remove('disabled');
            document.getElementById('rank-2').classList.remove('disabled');
            document.getElementById('rank-3').classList.remove('disabled');
            break;
    }

    rank = checkFilters('rank',rank,category);

    switch (rank) {
        case '1':
            document.getElementById('RankButtonText').textContent = 'Rank 1';
            document.getElementById('rank-1').classList.add('active');
            break;
        case '2':
            document.getElementById('RankButtonText').textContent = 'Rank 2';
            document.getElementById('rank-2').classList.add('active');
            break;
        case '3':
            document.getElementById('RankButtonText').innerHTML = 'Rank 3';
            document.getElementById('rank-3').classList.add('active');
            break;
    }
    globalRank = rank;
    globalCategory = category;

    switch(globalClass) {
        case 'hunter': 
            document.getElementById('category-class-hunter').setAttribute('checked','');
            break;
        case 'fighter': 
            document.getElementById('category-class-fighter').setAttribute('checked','');
            break;
        case 'ranger': 
            document.getElementById('category-class-ranger').setAttribute('checked','');
            break;
        case 'gunner': 
            document.getElementById('category-class-gunner').setAttribute('checked','');
            break;
        case 'force': 
            document.getElementById('category-class-force').setAttribute('checked','');
            break;
        case 'techter': 
            document.getElementById('category-class-techter').setAttribute('checked','');
            break;
        case 'braver': 
            document.getElementById('category-class-braver').setAttribute('checked','');
            break;
        case 'bouncer': 
            document.getElementById('category-class-bouncer').setAttribute('checked','');
            break;
        case 'waker': 
            document.getElementById('category-class-waker').setAttribute('checked','');
            break;
        default: 
            document.getElementById('category-class-nofilter').setAttribute('checked','');
            break;

    }
    switch(globalPatch) {
        case '60R':
            document.getElementById('category-patch-60r').setAttribute('checked','');
            break;
		case 'P60':
			document.getElementById('category-patch-pre60').setAttribute('checked','');
			break;
        default:
            document.getElementById('category-patch-60r').setAttribute('checked','');
            break;
    }
    switch(globalServer) {
        case 'global':
            document.getElementById('category-server-global').setAttribute('checked','');
            break;
        case 'japan':
            document.getElementById('category-server-japan').setAttribute('checked','');
            break;
        default:
            document.getElementById('category-server-nofilter').setAttribute('checked','');
            break;
    }
	if (globalPatch == 'P60') {
		globalPatch = null;
	}
}

function changeCategory(target) {
    var urlRef = "/run/purple/?cat=" + target + "&rank=" + checkFilters('rank',globalRank,target) + globalClassURL + globalPatchURL + globalServerURL;
    
    history.replaceState(null, '', urlRef);
    Refresh();
}

function changeRank(target) {
    var urlRef = "/run/purple/?cat=" + globalCategory + "&rank=" + target + globalClassURL + globalPatchURL + globalServerURL;
    
    history.replaceState(null, '', urlRef);
    Refresh();
}

function changeFilters() {
    var urlRef = "/run/purple/?cat=" + globalCategory + "&rank=" + globalRank + globalClassURL + globalPatchURL + globalServerURL;

    history.replaceState(null, '', urlRef);
    Refresh();
}

function checkFilters(type,check,check2) {
    switch (type) {
        case 'category':
            if (check == null) {
                return true;
                break;
            }
            if (categoryList.includes(check)) {
                return true;
                break;
            }
            else {
                return false;
                break;
            }
        case 'rank':
            if (check2 == 'stia' && (check == null || parseInt(check) > 1 || parseInt(check) < 1)) {
                console.log(check);
                return '1';
                break;
            }
            if (check2 == 'kvaris' && (check == null || parseInt(check) > 2 || parseInt(check) < 1)) {
                return '2';
                break;
            }
            if (check2 == 'retem' && (check == null || parseInt(check) > 3 || parseInt(check) < 1)) {
                return '3';
                break;
            }
            if (check2 == 'aelio' && (check == null || parseInt(check) > 3 || parseInt(check) < 1)) {
                return '3';
                break;
            }
            else
            {
                return(check);
            }
    }
}

function reloadTooltips() {
    var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    var tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))    
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

function cleanupScore() {
    while (scoreTable.firstChild) {
        scoreTable.removeChild(scoreTable.firstChild);
    }
}

function applyFilters() {

    console.log('--')
    var playerclass = document.querySelector('input[name="category-class"]:checked').value;
    var patch = document.querySelector('input[name="category-patch"]:checked').value;
    var server = document.querySelector('input[name="category-server"]:checked').value;
    globalClass = '';
    globalPatch = '';
    globalServer = '';

    globalClassURL = '';
    globalPatchURL = '';
    globalServerURL = '';

    if(playerclass != 'NULL') {
        globalClass = playerclass;
        globalClassURL = '&class=' + playerclass;
    };
    if(patch != 'NULL') {
        globalPatch = patch;
        globalPatchURL = '&patch=' + patch;
    };
    if(server != 'NULL') {
        globalServer = server;
        globalServerURL = '&server=' + server;

    };

    changeFilters();

}

function loadScoresBegin() {
	disableButtons();
	getDatabase();
}

function disableButtons() {
	buttonsrefClass.forEach((element) => {
		element.setAttribute("disabled",'');
	});
	buttonsrefPatch.forEach((element) => {
		element.setAttribute("disabled",'');
	});
	buttonsrefPurple.forEach((element) => {
		element.setAttribute("disabled",'');
	});
	buttonsrefRank.forEach((element) => {
		element.setAttribute("disabled",'');
	});
	buttonsrefServer.forEach((element) => {
		element.setAttribute("disabled",'');
	});
    dropdownRankRef.classList.add('disabled');
    applyFiltersButtonRef.classList.add('disabled');
}

function enableButtons() {
	buttonsrefClass.forEach((element) => {
		element.removeAttribute("disabled");
	});
	buttonsrefPatch.forEach((element) => {
		element.removeAttribute("disabled");
	});
	buttonsrefPurple.forEach((element) => {
		element.removeAttribute("disabled");
	});
	buttonsrefRank.forEach((element) => {
		element.removeAttribute("disabled");
	});
	buttonsrefServer.forEach((element) => {
		element.removeAttribute("disabled");
	});
    dropdownRankRef.classList.remove('disabled');
    applyFiltersButtonRef.classList.remove('disabled');
}

// This function requests Solo purple rankings
function getDatabase () {
	
	var params = globalCategory + "@!@!@" + globalRank + "@!@!@" + globalClass + "@!@!@" + globalPatch + "@!@!@" + globalServer;

	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
			console.log(httpRequest.response);
			enableButtons();
			loadScores(httpRequest.response);
		}
	}
	
	httpRequest.open('POST', '/api/purpleSolo', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send(params);
}

function createRanking(tr,rank) {
	const tdinit = document.createElement("td");
	switch (rank) {
		case 1:
			tdinit.innerHTML = '<img src="/img/scoreboard-rank1.png">';
			break;
		case 2:
			tdinit.innerHTML = '<img src="/img/scoreboard-rank2.png">';
			break;
		case 3:
			tdinit.innerHTML = '<img src="/img/scoreboard-rank3.png">';
			break;
		default:
			tdinit.innerHTML = rank;
			break;
	}
	// Center the rank.
	tdinit.classList.add("text-center");
	tdinit.style.verticalAlign = 'middle';
	tr.appendChild(tdinit);
}

// This function loads Solo purple rankings.
function loadScores (data) {

	// Initialize Score Rank reference.
	var rank = 0;
	// Initialize the Last Time reference.
	var lasttime = null;

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

		const buttonref = document.createElement("button");
		buttonref.setAttribute("type","button");
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


		// We have now exited the H O R R O R Z O N E.

		// Now for the optional stuff...

		// Generate a flag.
		// Start initialized, since this is optional.
		var flag = '';
		// If we do have a flag, go ahead and generate.
		if (row.Flag != null) {
			flag = `<span class="fi fi-` + row.Flag + `" style="max-height:16px;min-width: 25px;"></span> `;
		}

		// Ignore this, it's for requested memes.
		if (row.PlayerID === 4) {
			flag = '<img src="/custom/img/sukeboy/ronaldinho.png" class="img-fluid" style="max-height:100%"> ';
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
			ship = '<img src="/img/' + iconref + '.png" class="img-fluid" style="max-height:100%"> ';
		}

		// Apply everything to the button. Flag -> Ship -> Preferred Name
		buttonref.innerHTML = flag + ship + name;
        buttonref.style.fontSize = '14px';
		buttonref.setAttribute("data-bs-toggle",'modal');
    	buttonref.setAttribute("data-bs-target",'#runInfoModal');
    	buttonref.setAttribute("data-bs-submitid",row.RunID.toString());
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
		tr.appendChild(tdname);

		// Create Main Class Info...
		const tdmc = document.createElement("td");
		tdmc.innerHTML = generateClassImages(row.MainClass);
        tdmc.classList.add('text-center')
		tdmc.style.verticalAlign = 'middle';
        tdmc.style.fontSize = '14px';
		tr.appendChild(tdmc);

		// Create Sub Class Info...
		const tdsc = document.createElement("td");
		tdsc.innerHTML = generateClassImages(row.SubClass);
        tdsc.classList.add('text-center')
		tdsc.style.verticalAlign = 'middle';
        tdsc.style.fontSize = '14px';
		tr.appendChild(tdsc);

		// Create Weapon Info...
		const tdweapons = document.createElement("td");
		// We only pass PlayerID for one player's requested meme.
		tdweapons.innerHTML = generateWeaponImages(row.WeaponInfo, row.PlayerID);
        tdweapons.classList.add('text-center')
		tdweapons.style.verticalAlign = 'middle';
		tr.appendChild(tdweapons);

		// Create the Time...
		const tdtime = document.createElement("td");
        const timeSplit = row.Time.split(":");
		tdtime.textContent = timeSplit[0] + 'm ' + timeSplit[1] + 's';
        tdtime.classList.add('text-center')
        tdtime.style.fontSize = '14px';
		tdtime.style.verticalAlign = 'middle';
		tr.appendChild(tdtime);

		// Create the link...
		const tdlink = document.createElement("td");
		var link = document.createElement("a");

		link.setAttribute("href", row.Link);
		link.setAttribute("target","_blank");
		link.setAttribute("rel","noreferrer noopener")
        link.innerHTML = '<i class="bi bi-youtube"></i> Link'
		tdlink.textContent = "";
        link.classList.add('link-light','text-decoration-none');
        tdlink.classList.add('text-center')
        tdlink.style.fontSize = '14px';
		tdlink.style.verticalAlign = 'middle';
		tr.appendChild(tdlink);
		tdlink.appendChild(link);

        const tdnote = document.createElement("td");
		if (row.Notes != null) {

			tdnote.innerHTML += ' <i class="bi bi-sticky" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="left" data-bs-title="' + row.Notes + '"></i>';
		}
        tdnote.classList.add('text-center')
		tdnote.style.verticalAlign = 'middle';
        tr.appendChild(tdnote);

		// Finally, add the row.
        scoreTable.appendChild(tr);

	});

	// Reload tooltips, otherwise they won't work.
	reloadTooltips();
}

function generateInfo(event) {
    var button = event.relatedTarget;
	console.log(button);
    var runID = button.getAttribute('data-bs-submitid');

	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
			console.log(httpRequest.response);
            setInfo(httpRequest.response);
		}
	}
	
	httpRequest.open('POST', '/api/getRunInfo', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send(runID);
}

function setInfo(input) {

    var data = JSON.parse(input);

    data.forEach((row) => {
        console.log(row);
        createInfoNamesPlayer(row);
		createInfoNameSubmitter(row);
		createInfoRunNotes(row.Notes);
        createInfoSocials(row);
		createInfoDescription(row);
		createInfoLocations(row);
    });
}

function cleanupPanel() {

		document.getElementById('submittedPlayerName').innerHTML = '';
		document.getElementById('profileName1').innerHTML = '';
		document.getElementById('profileName2').innerHTML = '';
		document.getElementById('runSubmitter').innerHTML = '';
		document.getElementById('runNotes').innerHTML = '';
        document.getElementById('profileSocials').innerHTML = '';
		document.getElementById('profileDescription').innerHTML = '';
		document.getElementById('profileLocations').innerHTML = '';

}

function createInfoDescription(row) {

	if(row.Description != null) {
		document.getElementById('profileDescription').innerHTML = row.Description;
	}
	else {
		var name = '';
		switch (row.NamePref) {
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
				name = row.CharacterName;
				break;
		}
		document.getElementById('profileDescription').innerHTML = `We don't have a description for ` + name + `, but they're definitely cool!`;
	}
}

function createInfoRunNotes(row) {
	var notes = row;
	if (row == null) {
		notes = 'N/A'
	}
	document.getElementById('runNotes').innerHTML = notes;
}

function createInfoSocials(row) {

	console.log(row);
	var socialTwitch = '';
	var socialYoutube = '';
	var socialYoutube2 = '';
	var socialTwitter = '';
	var socialDiscord = '';

	if (row.Twitch != null) {
		socialTwitch = '<a href="https://twitch.tv/' + row.Twitch + '" target="_blank" rel="noreferrer noopener" class="link-light ms-1"><i class="bi bi-twitch"></i></a>';

	}
	if (row.Youtube != null) {
		socialYoutube = '<a href="https://youtube.com/@' + row.Youtube + '" target="_blank" rel="noreferrer noopener" class="link-light ms-1"><i class="bi bi-youtube"></i></a>';

	}
	if (row.Youtube2 != null) {
		socialYoutube2 = '<a href="https://youtube.com/@' + row.Youtube2 + '" target="_blank" rel="noreferrer noopener" class="link-light ms-1"><i class="bi bi-youtube"></i></a>';

	}
	if (row.Twitter != null) {
		socialTwitter = '<a href="https://twitter.com/' + row.Twitter + '" target="_blank" rel="noreferrer noopener" class="link-light ms-1"><i class="bi bi-twitter"></i></a>';

	}
	if (row.Discord != null) {
		socialDiscord = '<i class="bi bi-discord ms-1" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="' + row.Discord + '"></i>';

	}
	document.getElementById('profileSocials').innerHTML = socialYoutube + socialYoutube2 + socialTwitch + socialTwitter + socialDiscord;
	reloadTooltips();


}

function createInfoNamesPlayer(row) {

	ref = document.getElementById('submittedPlayerName');
	ref2 = document.getElementById('profileName1');
	ref3 = document.getElementById('profileName2');


	var name = '';
	var name2 = '';
	// Check the player's preferred name.
	switch (row.NamePref) {
		// Player Name
		case 0:
			name = row.PlayerName;
			name2 = 'Character Name: ' + row.CharacterName;
			break;
		// (Main) Character Name
		case 1:
			name = row.CharacterName;
			name2 = 'Player Name: ' + row.PlayerName;
			break;
		// In-Video Character Name
		case 2:
			name = row.CharacterName;
			name2 = 'Player Name: ' + row.PlayerName;
			break;
	}

	ref.style.cssText = `--bs-btn-padding-y: 0px; --bs-btn-padding-x: 0px; background-color: #0000; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF; text-decoration: none; font-weight: bold;`;
	ref2.style.cssText = `font-size: x-large; --bs-btn-padding-y: 0px; --bs-btn-padding-x: 0px; background-color: #0000; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF; text-decoration: none; font-weight: bold;`;	
	ref3.style.cssText = `color: #a7b5c1;`
	// Check the name customization setting.
		switch (row.NameType) {
			// Flat Color
			case 1:
				ref.style.cssText += `color: #` + row.NameColor1 + `; --bs-btn-hover-color: #` + row.NameColor1 + `; --bs-btn-active-color: #` + row.NameColor1 + `;`;
				ref2.style.cssText += `color: #` + row.NameColor1 + `; --bs-btn-hover-color: #` + row.NameColor1 + `; --bs-btn-active-color: #` + row.NameColor1 + `;`;
				break;
			// Gradient Color
			case 2:
				ref.style.cssText += `background: -webkit-linear-gradient(0deg, #` + row.NameColor1 + `, #` + row.NameColor2 + `);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;`;
				ref2.style.cssText += `background: -webkit-linear-gradient(0deg, #` + row.NameColor1 + `, #` + row.NameColor2 + `);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;`;
				break;
			// Glow Color
			case 3:
				//console.log(row.NameColor1);
				ref.style.cssText += `text-shadow: 0px 0px 5px #` + row.NameColor1 + `, 0px 0px 5px #` + row.NameColor1 + `, 0px 0px 5px #` + row.NameColor1 + `;`;
				ref2.style.cssText += `text-shadow: 0px 0px 5px #` + row.NameColor1 + `, 0px 0px 5px #` + row.NameColor1 + `, 0px 0px 5px #` + row.NameColor1 + `;`;
				break;
			default:
				break;
		}

	ref.innerHTML = name;
	ref2.innerHTML = name;
	ref3.innerHTML = name2;
}

function createInfoNameSubmitter(row) {

	ref = document.getElementById('runSubmitter');

	var name = '';
	// Check the player's preferred name.
	switch (row.SubNamePref) {
		// Player Name
		case 0:
			name = row.SubPlayerName;
			break;
		// (Main) Character Name
		case 1:
			name = row.SubCharacterName;
			break;
		// In-Video Character Name
		case 2:
			name = row.SubCharacterName;
			break;
	}

	ref.style.cssText = `--bs-btn-padding-y: 0px; --bs-btn-padding-x: 0px; background-color: #0000; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF; text-decoration: none; font-weight: bold;`;
	// Check the name customization setting.
		switch (row.SubNameType) {
			// Flat Color
			case 1:
				ref.style.cssText += `color: #` + row.SubNameColor1 + `; --bs-btn-hover-color: #` + row.SubNameColor1 + `; --bs-btn-active-color: #` + row.SubNameColor1 + `;`;
				break;
			// Gradient Color
			case 2:
				ref.style.cssText += `background: -webkit-linear-gradient(0deg, #` + row.SubNameColor1 + `, #` + row.SubNameColor2 + `);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;`;
				break;
			// Glow Color
			case 3:
				//console.log(row.NameColor1);
				ref.style.cssText += `text-shadow: 0px 0px 5px #` + row.SubNameColor1 + `, 0px 0px 5px #` + row.SubNameColor1 + `, 0px 0px 5px #` + row.SubNameColor1 + `;`;
				break;
			default:
				break;
		}

	ref.innerHTML = name;
}

function createInfoLocations(row) {

	var infolocation = '';
	var ship = '';
	if (row.Flag != null) {
		var flag = '<span class="fi fi-' + row.Flag + '"></span>'
		var country = regionNames.of(row.Flag.toUpperCase());
		infolocation = flag + ' ' + country + ' ';
	}
	if (row.PlayerID === 4) {
		infolocation = '<img src="/custom/img/sukeboy/ronaldinho.png" class="img-fluid" style="max-height:100%"> RONALDINHO SOCCER';
	}

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
		var shiphtml = '<img src="/img/' + iconref + '.png" class="img-fluid" style="max-height:100%">'
		var shipinfohtml = ' Ship ' + row.Ship + ' - ' + fixedservername;
		ship = shiphtml + shipinfohtml;
	}

	document.getElementById('profileLocations').innerHTML = infolocation + ship;
	document.getElementById('profileLocations').style.cssText = `color: #a7b5c1;`;

}