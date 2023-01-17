var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
var tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const scoretable = document.querySelector("#score-ranking");
const scorebody = document.querySelector("#score-ranking > tbody");
const scoretitle = document.querySelector("#score-ranking > caption > strong");
const filterclassbuttons = document.querySelector("#buttons-classfilter");
const filterallbutton = document.querySelector("#classFilter1");
const modalbody = document.querySelector("#ModalInformational-Body");
const modaltitle = document.querySelector("#ModalInformational-Title");
const modalwhole = document.querySelector("#ModalInformational");

function getDatabaseInfo(region,classIn,rank,party) {
	var request = '/purple/' + region + '/' + classIn + '/' + rank + '/' + party;
	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === 4) {
			//console.log(httpRequest.response);
			loadScoresReady(httpRequest.response);
		}
	}
	
	httpRequest.open('GET', request, true);
	//httpRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
	httpRequest.send();
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
	var classNames = '';
	var myCollapse = new bootstrap.Collapse(filterclassbuttons, { toggle: false } );
	if (partySize != "solo") {
		myCollapse.hide();
		console.log("hide");
		classFilter = "none";
	}
	else if (partySize == "solo") {
		console.log("SHOW");
		myCollapse.show();
		if (classFilter != "none") {
			classNames = classFilter;
		}
	}
	if (patchNo == "NULL") {
		patchNo = null;
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
	console.log(mainCategory);
	console.log(partySize);
	console.log(primeCategory);
	console.log(patchNo);
	
	var scoreCode = primeCategory+'-'+mainCategory+'-'+partySize+'-'+patchNo;
	var categoryName = primeCategory+'-'+mainCategory;
	var output = generateCategoryName(categoryName, partySize, patchNo, classNames);
	scoretitle.innerHTML = output;
	loadScoresPrepare(mainCategory,classFilter,rankSelected,partySize);
}

function getPartySize() {
	var partySize = document.querySelector('input[name="partysize"]:checked').value;
	return partySize;
}

// Time for the most sinful function in this file.

function generateCategoryName(category,partysize,patch,classFilter) {
	
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
		case null:
			var patchNo = '[No Version Given]';
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
	
	// And now, put it all together.
	result = mainClass + categoryName + ' ' + partyName + ' </strong><small>' + patchNo + '</small><strong>';
	
	console.log(result)
	
	return result;
}

function loadScoresBegin() {
	checkScoreOptions()
}

function loadScoresPrepare (region,mainclass,rank,partySize) {
	
	getDatabaseInfo(region,mainclass,rank,partySize);
	
}

function loadScoresReady (json) {
	
	populateRankings(json);
	
	var boardref;
	boardref = document.getElementById("score-ranking");
	
}


// sinful IF in foreach messy function

function populateRankings (json) {
	
    cleanupScore();
	
	//var partySize = getPartySize();
	var rank = 0;
	var rowReference = 0;
	
	var jsonparse = JSON.parse(json);
	
    // Populate Leaderboard.
	
	if (Object.keys(jsonparse).length === 0) {
		console.log("WE GOT NOTHING");
        const tr = document.createElement("tr");

		const tdemptyr = document.createElement("td");
		const tdempty1 = document.createElement("td");
		const tdempty2 = document.createElement("td");
		const tdempty3 = document.createElement("td");
		const tdempty4 = document.createElement("td");
		const tdempty5 = document.createElement("td");
		const tdempty6 = document.createElement("td");
	    tdemptyr.textContent = "1";
		tdempty1.textContent = "No Scores";
	    tr.appendChild(tdemptyr);
		tr.appendChild(tdempty1);
		tr.appendChild(tdempty2);
		tr.appendChild(tdempty3);
		tr.appendChild(tdempty4);
		tr.appendChild(tdempty5);
		tr.appendChild(tdempty6);
		scorebody.appendChild(tr);
		return;
	}
	
	console.log("WE GOT SOMETHING");
	
    jsonparse.forEach((row) => {

        const tr = document.createElement("tr");
		const tdwep = document.createElement("td");
		var notesReference = null;
		
		// First, generate a rank for the runner, starting from 1
		rank += 1;
		rowReference += 1;

		const tdinit = document.createElement("td");
	    tdinit.textContent = rank;
	    tr.appendChild(tdinit);


		// Start iterating through the columns here...
		
        Object.entries(row).forEach((entry, index) => {
			
			const[key,value] = entry;
			
			// We do this to remove the data later.
			const keyPatch = entry.indexOf("patch");
			
			// Assign the index of any column with special behavior here.
			const keyLink = entry.indexOf("link");
			const keyNotes = entry.indexOf("notes");

			const keyWeapon = entry.indexOf("weapon");
			const keyMainClass = entry.indexOf("mainclass");
			const keySubClass = entry.indexOf("subclass");
			const keyName = entry.indexOf("runner");
			
			// We don't use the patch info here, so we get rid of it.
			if (keyPatch == 0) {
				console.log("Skipping column...");
				return;
			}
			
			if(keyLink == 0 && value == null) {
				const td = document.createElement("td");
				td.textContent = value;
				tr.appendChild(td);	
			}
			
			// If the column value is null, we skip it.
			if (value == null) {
				console.log("NULL, so we skip...");
				return;
			}
			
			if (keyNotes == 0) {
				notesReference = value;
				tr.classList.add("pso2-noted");
				return;
			}
			
			// Here comes a horrific else if chain. I admit to not knowing what to do to improve this.
			
			if (keyLink == 0) {
				const td = document.createElement("td");
				var link = document.createElement("a");

				link.setAttribute("href", value);
				link.textContent = "Link";
		        td.textContent = "";
				td.dataset.scoreTableRow = rowReference;
		        tr.appendChild(td);
				td.appendChild(link);
			}
			else if (keyName == 0) {
				const td = document.createElement("td");
				td.innerHTML = splitPartyPlayers(value);
				tr.appendChild(td);
			}
			else if (keyMainClass == 0 || keySubClass == 0) {
				const td = document.createElement("td");
				td.innerHTML = splitPartyClasses(value);
				tr.appendChild(td);
			}
			else if (keyWeapon == 0) {
				const td = document.createElement("td");
				td.innerHTML = splitPartyWeapons(value);
				tr.appendChild(td);
			}
			else {
				const td = document.createElement("td");
				td.textContent = value;
				tr.appendChild(td);
			}

        });

        scorebody.appendChild(tr);
		
		if (notesReference != null) {
			const positionReference = document.querySelector('td[data-score-table-row="' + rowReference + '"]');
			positionReference.innerHTML += ' <i class="bi-info-circle" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="' + notesReference + '"></i>';
		}
		
		reloadTooltips();

    });
}


function splitPartyPlayers(input) {
	var inputArray = input.split('@@@');
	console.log(inputArray);
	let result = '';
	inputArray.forEach((string) => {
		result = result + string + '<br>';
	});
	return result;
}

function splitPartyWeapons(input) {
	var inputArray = input.split('@@@');
	console.log(inputArray);
	let result = '';
	inputArray.forEach((string) => {
		result = result + generateWeaponImages(string) + '<br>';
	});
	return result;
}

function splitPartyClasses(input) {
	var inputArray = input.split('@@@');
	console.log(inputArray);
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

function generateWeaponImages(input) {
	const input2 = input.toLowerCase();
	var inputArray = input2.split(' ');
	console.log(inputArray);
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
				result = result + '<img src="img/weapon-rifle.png" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Assault Rifle">' + ' ';
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