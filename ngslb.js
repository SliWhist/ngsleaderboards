var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
var tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const scoretable = document.querySelector("#score-ranking");
const scorebody = document.querySelector("#score-ranking > tbody");
const scoretitle = document.querySelector("#score-ranking > caption > strong");
const filterclassbuttons = document.querySelector("#buttons-classfilter");
const filterallbutton = document.querySelector("#classFilter1");

function reloadTooltips() {
	tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
	tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function checkScoreOptions() {
	var mainCategory = document.querySelector('input[name="category-purple"]:checked').value;
	var partySize = document.querySelector('input[name="partysize"]:checked').value;
	var primeCategory = document.querySelector('input[name="mainCategory"]:checked').value;
	var patchNo = document.querySelector('input[name="gamepatch"]:checked').value;
	var classNames = '';
	var myCollapse = new bootstrap.Collapse(filterclassbuttons, { toggle: false } );
	if (partySize != "solo") {
		myCollapse.hide();
		console.log("hide");
	}
	else if (partySize == "solo") {
		console.log("SHOW");
		myCollapse.show();
		if (checkClassFilter() != "none") {
			classNames = checkClassFilter();
		}
	}
	console.log(mainCategory);
	console.log(partySize);
	console.log(primeCategory);
	console.log(patchNo);
	
	var scoreCode = primeCategory+'-'+mainCategory+'-'+partySize+'-'+patchNo;
	var categoryName = primeCategory+'-'+mainCategory;
	var output = generateCategoryName(categoryName, partySize, patchNo, classNames);
	scoretitle.innerHTML = output;
	return scoreCode;
}

function checkClassFilter() {
	var classFilter = document.querySelector('input[name="classFilter"]:checked').value;
	return classFilter;
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
		case "purple-ael":
			categoryName = 'Aelio Devastators Rank.3';
			break;
		case "purple-ret":
			categoryName = 'Retem Devastators Rank.3';
			break;
		case "purple-kvar":
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
		case "nopatch":
			patchNo = '[No Version Given]';
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

function loadScores () {
	
	var boardref;
	boardref = document.getElementById("score-ranking");
	
	var jsonTarget = 'scores/' + checkScoreOptions() + '.json';
	fetch(jsonTarget)
	.then(response => {
		if (response.ok) {
			fetch(jsonTarget)
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			
		}
		else {
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
		}
	})
}


/* function ngsLoadScores (scoreID) {
	var boardref;
	boardref = document.getElementById("score-ranking");
	boardref.style.visibility = "visible";
	
	switch (scoreID) {
		// Aelio
		case "purp-ael-1":
			//fetch('scores/ael_1p.json')
			fetch('scores/testScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		case "purp-ael-2":
			//fetch('scores/ael_2p.json')
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		case "purp-ael-3":
			//fetch('scores/ael_3p.json')
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		case "purp-ael-4":
			//fetch('scores/ael_4p.json')
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		// Retem
		case "purp-ret-1":
			//fetch('scores/ret_1p.json')
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		case "purp-ret-2":
			//fetch('scores/ret_2p.json')
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		case "purp-ret-3":
			//fetch('scores/ret_3p.json')
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		case "purp-ret-4":
			//fetch('scores/ret_4p.json')
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		// Kvaris
		case "purp-kvar-1":
			//fetch('scores/kvar_1p.json')
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		case "purp-kvar-2":
			//fetch('scores/kvar_2p.json')
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		case "purp-kvar-3":
			//fetch('scores/kvar_3p.json')
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		case "purp-kvar-4":
			//fetch('scores/kvar_4p.json')
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		// Stia
		case "purp-stia-1":
			//fetch('scores/stia_1p.json')
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		case "purp-stia-2":
			//fetch('scores/stia_2p.json')
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		case "purp-stia-3":
			//fetch('scores/stia_3p.json')
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		case "purp-stia-4":
			//fetch('scores/stia_4p.json')
			fetch('scores/noScore.json')
				.then((response) => response.json())
				.then((data) => populateRankings(data));
			break;
		default:
			cleanupScore();
			break;
	}
	
} */


// sinful IF in foreach messy function

function populateRankings (json) {
    cleanupScore();
	
	var partySize = getPartySize();
	var autoRanker = 0;
    // Populate Leaderboard -- AKA the horrible elseif zone.
    json.forEach((row) => {
		if (partySize == "solo"){
			
			if (checkClassFilter() != "none") {
				if (row["Class"] != checkClassFilter()){
					return;
				}
			}
		}

        const tr = document.createElement("tr");

        Object.values(row).forEach((cell, index) => {
			
			// If we're index 7 (Video Link)...
			if (index == 7) {
				// Blank it if there isnt a link (there should be!)
				if (cell == "") {
					const td = document.createElement("td");
		            td.textContent = cell;
		            tr.appendChild(td);
				}
				// Make it a proper link if there is one
				else {
					const td = document.createElement("td");
					var link = document.createElement("a");

					link.setAttribute("href", cell);
					link.textContent = "Link";
		            td.textContent = "";
		            tr.appendChild(td);
					td.appendChild(link);
				}
			}
			else if (index == 0) {
					if (partySize == "solo"){
			
						if (checkClassFilter() != "none") {
							const td = document.createElement("td");
							autoRanker += 1;
							let text = autoRanker.toString()
							td.textContent = text;
							tr.appendChild(td);
						}
						else {
							const td = document.createElement("td");
							td.textContent = cell;
							tr.appendChild(td);
						}
					}
					else {
						const td = document.createElement("td");
						td.textContent = cell;
						tr.appendChild(td);
					}
			}
			// If we're on player... This is for party splits.
			else if (index == 1) {
				if (partySize != "solo") {
					const td = document.createElement("td");
					td.innerHTML = splitPartyPlayers(cell);
					tr.appendChild(td);
				}
				else if (partySize == "solo") {
					const td = document.createElement("td");
					td.textContent = cell;
					tr.appendChild(td);
				}
				
			}
			// If we're on Main Class...
			else if (index == 2) {
				if (partySize != "solo") {
					const td = document.createElement("td");
					td.innerHTML = splitPartyClasses(cell);
					tr.appendChild(td);
				}
				else if (partySize == "solo") {
					const td = document.createElement("td");
					td.innerHTML = generateClassImages(cell);
					tr.appendChild(td);
				}
			}
			// If we're on Sub Class...
			else if (index == 3) {
				if (partySize != "solo") {
					const td = document.createElement("td");
					td.innerHTML = splitPartyClasses(cell);
					tr.appendChild(td);
				}
				else if (partySize == "solo") {
					const td = document.createElement("td");
					td.innerHTML = generateClassImages(cell);
					tr.appendChild(td);
				}
			}
			// If we're on Weapon(s)...
			else if (index == 4) {
				if (partySize != "solo") {
					const td = document.createElement("td");
					td.innerHTML = splitPartyWeapons(cell);
					tr.appendChild(td);
				}
				else if (partySize == "solo") {
					const td = document.createElement("td");
					td.innerHTML = generateWeaponImages(cell);
					tr.appendChild(td);
				}
			}
			// Everywhere else.
			else {
				const td = document.createElement("td");
	            td.textContent = cell;
	            tr.appendChild(td);
			}
        });

        scorebody.appendChild(tr);
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

function cleanupScore() {
    while (scorebody.firstChild) {
        scorebody.removeChild(scorebody.firstChild);
    }
}