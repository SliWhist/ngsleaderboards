const scorebody = document.querySelector("#ranking > tbody");

function loadScores (scoreID) {
  const request = new XMLHttpRequest();
  var boardref;
  
  	boardref = document.getElementsByClassName("score-ranking")[0];
	boardref.style.visibility = "visible";
  
	switch (scoreID) {
		// Aelio
		case "purp-ael-1":
			request.open("get", "scores/testScore.js");
			break;
		case "purp-ael-2":
			request.open("get", "scores/ael_2p.js");
			break;
		case "purp-ael-3":
			request.open("get", "scores/ael_3p.js");
			break;
		case "purp-ael-4":
			request.open("get", "scores/ael_4p.js");
			break;
		// Retem
		case "purp-ret-1":
			request.open("get", "scores/ret_1p.js");
			break;
		case "purp-ret-2":
			request.open("get", "scores/ret_2p.js");
			break;
		case "purp-ret-3":
			request.open("get", "scores/ret_3p.js");
			break;
		case "purp-ret-4":
			request.open("get", "scores/ret_4p.js");
			break;
		// Kvaris
		case "purp-kvar-1":
			request.open("get", "scores/kvar_1p.js");
			break;
		case "purp-kvar-2":
			request.open("get", "scores/kvar_2p.js");
			break;
		case "purp-kvar-3":
			request.open("get", "scores/kvar_3p.js");
			break;
		case "purp-kvar-4":
			request.open("get", "scores/kvar_4p.js");
			break;
		// Stia
		case "purp-stia-1":
			request.open("get", "scores/stia_1p.js");
			break;
		case "purp-stia-2":
			request.open("get", "scores/stia_2p.js");
			break;
		case "purp-stia-3":
			request.open("get", "scores/stia_3p.js");
			break;
		case "purp-stia-4":
			request.open("get", "scores/stia_4p.js");
			break;
			
	}
	
	request.onload = () => {
		try {
			const json = JSON.parse(request.responseText);
			populateRankings(json);
		} catch (e) {
			console.warn("Could not load Player Rankings! :(");
		}
	};
	request.send();
}

function populateRankings (json) {
    cleanupScore();
    // Populate Leaderboard
    json.forEach((row) => {
        const tr = document.createElement("tr");

        row.forEach((cell) => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
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
