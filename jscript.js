const scorebody = document.querySelector("#ranking > tbody");

function loadScores (scoreID) {
  const request = new XMLHttpRequest();
  var boardref;
  
  	boardref = document.getElementsByClassName("score-ranking")[0];
	boardref.style.visibility = "visible";
  
	switch (scoreID) {
		// Aelio
		case "purp-ael-1":
			//fetch('scores/ael_1p.json')
			fetch('scores/noScore.json')
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
			
	}
	
}

function populateRankings (json) {
    cleanupScore();
    // Populate Leaderboard
    json.forEach((row) => {
        const tr = document.createElement("tr");

        Object.values(row).forEach((cell, index) => {
			if (index == 7) {
				if (cell == "") {
					const td = document.createElement("td");
		            td.textContent = cell;
		            tr.appendChild(td);
				}
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
			else {
				const td = document.createElement("td");
	            td.textContent = cell;
	            tr.appendChild(td);
			}
        });

        scorebody.appendChild(tr);
    });
}

function changeCategory(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("category-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("catlink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

function cleanupScore() {
    while (scorebody.firstChild) {
        scorebody.removeChild(scorebody.firstChild);
    }
}

function changeSubCategory(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks, boardref;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("subcategory-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
	boardref = document.getElementsByClassName("score-ranking")[0];
	boardref.style.visibility = "hidden";
	
  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("subcatlink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  
  tablinks = document.getElementsByClassName("partylink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}
  
function changeBracket(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;
	
  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("partylink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  evt.currentTarget.className += " active";
  
  loadScores(cityName);
}
