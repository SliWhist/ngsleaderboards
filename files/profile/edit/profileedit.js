
var countrysel = document.getElementById('countrypicker');
var fragment = document.createDocumentFragment();

var color1 = '#FFFFFF';
var color2 = '#FFFFFF';
var colorType = 0;

var userData = '';

var colorInput1 = document.getElementById('colorInput1');
var colorInput2 = document.getElementById('colorInput2');

colorInput1.addEventListener("input",(event)=>{
	color1 = colorInput1.value;
	changeColor(document.getElementById('mainname'));

 });

 colorInput2.addEventListener("input",(event)=>{
	color2 = colorInput2.value;
	changeColor(document.getElementById('mainname'));

 });

var countries = [
	{ "text": "None", "value": "" },
    { "text": "Afghanistan", "value": "AF" },
    { "text": "Åland Islands", "value": "AX" },
    { "text": "Albania", "value": "AL" },
    { "text": "Algeria", "value": "DZ" },
    { "text": "American Samoa", "value": "AS" },
    { "text": "Andorra", "value": "AD" },
    { "text": "Angola", "value": "AO" },
    { "text": "Anguilla", "value": "AI" },
    { "text": "Antarctica", "value": "AQ" },
    { "text": "Antigua and Barbuda", "value": "AG" },
    { "text": "Argentina", "value": "AR" },
    { "text": "Armenia", "value": "AM" },
    { "text": "Aruba", "value": "AW" },
    { "text": "Australia", "value": "AU" },
    { "text": "Austria", "value": "AT" },
    { "text": "Azerbaijan", "value": "AZ" },
    { "text": "Bahamas", "value": "BS" },
    { "text": "Bahrain", "value": "BH" },
    { "text": "Bangladesh", "value": "BD" },
    { "text": "Barbados", "value": "BB" },
    { "text": "Belarus", "value": "BY" },
    { "text": "Belgium", "value": "BE" },
    { "text": "Belize", "value": "BZ" },
    { "text": "Benin", "value": "BJ" },
    { "text": "Bermuda", "value": "BM" },
    { "text": "Bhutan", "value": "BT" },
    { "text": "Bolivia", "value": "BO" },
    { "text": "Bosnia and Herzegovina", "value": "BA" },
    { "text": "Botswana", "value": "BW" },
    { "text": "Bouvet Island", "value": "BV" },
    { "text": "Brazil", "value": "BR" },
    { "text": "British Indian Ocean Territory", "value": "IO" },
    { "text": "Brunei Darussalam", "value": "BN" },
    { "text": "Bulgaria", "value": "BG" },
    { "text": "Burkina Faso", "value": "BF" },
    { "text": "Burundi", "value": "BI" },
    { "text": "Cambodia", "value": "KH" },
    { "text": "Cameroon", "value": "CM" },
    { "text": "Canada", "value": "CA" },
    { "text": "Cape Verde", "value": "CV" },
    { "text": "Cayman Islands", "value": "KY" },
    { "text": "Central African Republic", "value": "CF" },
    { "text": "Chad", "value": "TD" },
    { "text": "Chile", "value": "CL" },
    { "text": "China", "value": "CN" },
    { "text": "Christmas Island", "value": "CX" },
    { "text": "Cocos (Keeling) Islands", "value": "CC" },
    { "text": "Colombia", "value": "CO" },
    { "text": "Comoros", "value": "KM" },
    { "text": "Congo", "value": "CG" },
    { "text": "Congo, The Democratic Republic of the", "value": "CD" },
    { "text": "Cook Islands", "value": "CK" },
    { "text": "Costa Rica", "value": "CR" },
    { "text": "Cote D'Ivoire", "value": "CI" },
    { "text": "Croatia", "value": "HR" },
    { "text": "Cuba", "value": "CU" },
    { "text": "Cyprus", "value": "CY" },
    { "text": "Czech Republic", "value": "CZ" },
    { "text": "Denmark", "value": "DK" },
    { "text": "Djibouti", "value": "DJ" },
    { "text": "Dominica", "value": "DM" },
    { "text": "Dominican Republic", "value": "DO" },
    { "text": "Ecuador", "value": "EC" },
    { "text": "Egypt", "value": "EG" },
    { "text": "El Salvador", "value": "SV" },
    { "text": "Equatorial Guinea", "value": "GQ" },
    { "text": "Eritrea", "value": "ER" },
    { "text": "Estonia", "value": "EE" },
    { "text": "Ethiopia", "value": "ET" },
    { "text": "Falkland Islands (Malvinas)", "value": "FK" },
    { "text": "Faroe Islands", "value": "FO" },
    { "text": "Fiji", "value": "FJ" },
    { "text": "Finland", "value": "FI" },
    { "text": "France", "value": "FR" },
    { "text": "French Guiana", "value": "GF" },
    { "text": "French Polynesia", "value": "PF" },
    { "text": "French Southern Territories", "value": "TF" },
    { "text": "Gabon", "value": "GA" },
    { "text": "Gambia", "value": "GM" },
    { "text": "Georgia", "value": "GE" },
    { "text": "Germany", "value": "DE" },
    { "text": "Ghana", "value": "GH" },
    { "text": "Gibraltar", "value": "GI" },
    { "text": "Greece", "value": "GR" },
    { "text": "Greenland", "value": "GL" },
    { "text": "Grenada", "value": "GD" },
    { "text": "Guadeloupe", "value": "GP" },
    { "text": "Guam", "value": "GU" },
    { "text": "Guatemala", "value": "GT" },
    { "text": "Guernsey", "value": "GG" },
    { "text": "Guinea", "value": "GN" },
    { "text": "Guinea-Bissau", "value": "GW" },
    { "text": "Guyana", "value": "GY" },
    { "text": "Haiti", "value": "HT" },
    { "text": "Heard Island and Mcdonald Islands", "value": "HM" },
    { "text": "Holy See", "value": "VA" },
    { "text": "Honduras", "value": "HN" },
    { "text": "Hong Kong", "value": "HK" },
    { "text": "Hungary", "value": "HU" },
    { "text": "Iceland", "value": "IS" },
    { "text": "India", "value": "IN" },
    { "text": "Indonesia", "value": "ID" },
    { "text": "Iran", "value": "IR" },
    { "text": "Iraq", "value": "IQ" },
    { "text": "Ireland", "value": "IE" },
    { "text": "Isle of Man", "value": "IM" },
    { "text": "Israel", "value": "IL" },
    { "text": "Italy", "value": "IT" },
    { "text": "Jamaica", "value": "JM" },
    { "text": "Japan", "value": "JP" },
    { "text": "Jersey", "value": "JE" },
    { "text": "Jordan", "value": "JO" },
    { "text": "Kazakhstan", "value": "KZ" },
    { "text": "Kenya", "value": "KE" },
    { "text": "Kiribati", "value": "KI" },
    { "text": "South Korea", "value": "KR" },
    { "text": "Kuwait", "value": "KW" },
    { "text": "Kyrgyzstan", "value": "KG" },
    { "text": "Lao People's Democratic Republic", "value": "LA" },
    { "text": "Latvia", "value": "LV" },
    { "text": "Lebanon", "value": "LB" },
    { "text": "Lesotho", "value": "LS" },
    { "text": "Liberia", "value": "LR" },
    { "text": "Libyan Arab Jamahiriya", "value": "LY" },
    { "text": "Liechtenstein", "value": "LI" },
    { "text": "Lithuania", "value": "LT" },
    { "text": "Luxembourg", "value": "LU" },
    { "text": "Macao", "value": "MO" },
    { "text": "Macedonia", "value": "MK" },
    { "text": "Madagascar", "value": "MG" },
    { "text": "Malawi", "value": "MW" },
    { "text": "Malaysia", "value": "MY" },
    { "text": "Maldives", "value": "MV" },
    { "text": "Mali", "value": "ML" },
    { "text": "Malta", "value": "MT" },
    { "text": "Marshall Islands", "value": "MH" },
    { "text": "Martinique", "value": "MQ" },
    { "text": "Mauritania", "value": "MR" },
    { "text": "Mauritius", "value": "MU" },
    { "text": "Mayotte", "value": "YT" },
    { "text": "Mexico", "value": "MX" },
    { "text": "Micronesia, Federated States of", "value": "FM" },
    { "text": "Moldova, Republic of", "value": "MD" },
    { "text": "Monaco", "value": "MC" },
    { "text": "Mongolia", "value": "MN" },
    { "text": "Montserrat", "value": "MS" },
    { "text": "Morocco", "value": "MA" },
    { "text": "Mozambique", "value": "MZ" },
    { "text": "Myanmar", "value": "MM" },
    { "text": "Namibia", "value": "NA" },
    { "text": "Nauru", "value": "NR" },
    { "text": "Nepal", "value": "NP" },
    { "text": "Netherlands", "value": "NL" },
    { "text": "Netherlands Antilles", "value": "AN" },
    { "text": "New Caledonia", "value": "NC" },
    { "text": "New Zealand", "value": "NZ" },
    { "text": "Nicaragua", "value": "NI" },
    { "text": "Niger", "value": "NE" },
    { "text": "Nigeria", "value": "NG" },
    { "text": "Niue", "value": "NU" },
    { "text": "Norfolk Island", "value": "NF" },
    { "text": "Northern Mariana Islands", "value": "MP" },
    { "text": "Norway", "value": "NO" },
    { "text": "Oman", "value": "OM" },
    { "text": "Pakistan", "value": "PK" },
    { "text": "Palau", "value": "PW" },
    { "text": "State of Palestine", "value": "PS" },
    { "text": "Panama", "value": "PA" },
    { "text": "Papua New Guinea", "value": "PG" },
    { "text": "Paraguay", "value": "PY" },
    { "text": "Peru", "value": "PE" },
    { "text": "Philippines", "value": "PH" },
    { "text": "Pitcairn", "value": "PN" },
    { "text": "Poland", "value": "PL" },
    { "text": "Portugal", "value": "PT" },
    { "text": "Puerto Rico", "value": "PR" },
    { "text": "Qatar", "value": "QA" },
    { "text": "Reunion", "value": "RE" },
    { "text": "Romania", "value": "RO" },
    { "text": "Russian Federation", "value": "RU" },
    { "text": "Rwanda", "value": "RW" },
    { "text": "Saint Helena", "value": "SH" },
    { "text": "Saint Kitts and Nevis", "value": "KN" },
    { "text": "Saint Lucia", "value": "LC" },
    { "text": "Saint Pierre and Miquelon", "value": "PM" },
    { "text": "Saint Vincent and the Grenadines", "value": "VC" },
    { "text": "Samoa", "value": "WS" },
    { "text": "San Marino", "value": "SM" },
    { "text": "Sao Tome and Principe", "value": "ST" },
    { "text": "Saudi Arabia", "value": "SA" },
    { "text": "Senegal", "value": "SN" },
    { "text": "Serbia and Montenegro", "value": "CS" },
    { "text": "Seychelles", "value": "SC" },
    { "text": "Sierra Leone", "value": "SL" },
    { "text": "Singapore", "value": "SG" },
    { "text": "Slovakia", "value": "SK" },
    { "text": "Slovenia", "value": "SI" },
    { "text": "Solomon Islands", "value": "SB" },
    { "text": "Somalia", "value": "SO" },
    { "text": "South Africa", "value": "ZA" },
    { "text": "South Georgia and the South Sandwich Islands", "value": "GS" },
    { "text": "Spain", "value": "ES" },
    { "text": "Sri Lanka", "value": "LK" },
    { "text": "Sudan", "value": "SD" },
    { "text": "Suriname", "value": "SR" },
    { "text": "Svalbard and Jan Mayen", "value": "SJ" },
    { "text": "Swaziland", "value": "SZ" },
    { "text": "Sweden", "value": "SE" },
    { "text": "Switzerland", "value": "CH" },
    { "text": "Syria", "value": "SY" },
    { "text": "Taiwan", "value": "TW" },
    { "text": "Tajikistan", "value": "TJ" },
    { "text": "Tanzania, United Republic of", "value": "TZ" },
    { "text": "Thailand", "value": "TH" },
    { "text": "Timor-Leste", "value": "TL" },
    { "text": "Togo", "value": "TG" },
    { "text": "Tokelau", "value": "TK" },
    { "text": "Tonga", "value": "TO" },
    { "text": "Trinidad and Tobago", "value": "TT" },
    { "text": "Tunisia", "value": "TN" },
    { "text": "Turkey", "value": "TR" },
    { "text": "Turkmenistan", "value": "TM" },
    { "text": "Turks and Caicos Islands", "value": "TC" },
    { "text": "Tuvalu", "value": "TV" },
    { "text": "Uganda", "value": "UG" },
    { "text": "Ukraine", "value": "UA" },
    { "text": "United Arab Emirates", "value": "AE" },
    { "text": "United Kingdom", "value": "GB" },
    { "text": "United States", "value": "US" },
    { "text": "United States Minor Outlying Islands", "value": "UM" },
    { "text": "Uruguay", "value": "UY" },
    { "text": "Uzbekistan", "value": "UZ" },
    { "text": "Vanuatu", "value": "VU" },
    { "text": "Venezuela", "value": "VE" },
    { "text": "Viet Nam", "value": "VN" },
    { "text": "Virgin Islands, British", "value": "VG" },
    { "text": "Virgin Islands, U.S.", "value": "VI" },
    { "text": "Wallis and Futuna", "value": "WF" },
    { "text": "Western Sahara", "value": "EH" },
    { "text": "Yemen", "value": "YE" },
    { "text": "Zambia", "value": "ZM" },
    { "text": "Zimbabwe", "value": "ZW" }
];

window.addEventListener('load', function() {
	disableButtons();
	loadProfile();
});

function disableButtons() {
	document.getElementById('applychanges').classList.add("disabled");
}

function enableButtons() {
	document.getElementById('applychanges').classList.remove("disabled");
}

async function saveChanges() {
	disableButtons();
	var a = document.getElementById('maincharacter').value;
	var b = document.getElementById('namepref').value;
	var c = document.getElementById('shippicker').value;
	var d = document.getElementById('countrypicker').value;
	var e = document.getElementById('colorInput1').value;
	e = e.replace('#','');
	var f = document.getElementById('colorInput2').value;
	f = f.replace('#','');
	var g = document.querySelector('input[name="colorTypePick"]:checked').value;
	var h = document.getElementById('youtube1input').value;
	var i = document.getElementById('youtube2input').value;
	var j = document.getElementById('twitchtvinput').value;
	var k = document.getElementById('twitterinput').value;
	var l = document.getElementById('discordinput').value;
	var m = await getUserInfo();
    m = m.userId;
	var params = (a + '@!@!@!@' + b + '@!@!@!@' + c + '@!@!@!@' + d + '@!@!@!@' + e + '@!@!@!@' + f + '@!@!@!@' + g + '@!@!@!@' + h + '@!@!@!@' + i + '@!@!@!@' + j + '@!@!@!@' + k + '@!@!@!@' + l + '@!@!@!@' + m)
    sendSaveRequest(params);
}

async function sendSaveRequest (params) {

	const httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
			console.log(httpRequest.response);
            window.location.replace("/profile");
		}
	}

	httpRequest.open('POST', '/api/updateProfile', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send(params);
}

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
			data = JSON.parse(httpRequest.response);
			userData = data;
			enableButtons();
			setInitial(data);
		}
	}

    var param = userkey.userId;
	
	httpRequest.open('POST', '/api/loadProfile', true);
	httpRequest.setRequestHeader('Content-type', 'x-www-form-urlencoded');
	httpRequest.send(param);
}

function setInitial(input) {
	setPref(input[0]);
	setSocials(input[0]);
	setInitialColorType(input[0]);
	prepareCountries(input[0].Flag);
	enableShips(input[0].Server,input[0].Ship);
	document.getElementById('playername').innerHTML = input[0].PlayerName;
	document.getElementById('server').innerHTML = input[0].Server.charAt(0).toUpperCase() + input[0].Server.slice(1).toLowerCase();
	document.getElementById('maincharacter').value = input[0].CharacterName;
	makeName(input[0],document.getElementById('mainname'));
	color1 = '#' + input[0].NameColor1;
	color2 = '#' + input[0].NameColor2;
	colorType = input[0].NameType;
	colorInput1.value = '#' + input[0].NameColor1;
	colorInput2.value = '#' + input[0].NameColor2;
	changeColor(document.getElementById('mainname'));
}

function setPref(i) {
	var active = document.querySelector('#namepref option[value=' + CSS.escape(i.PreferredName) + ']');
	active.setAttribute('selected','');
}

function setSocials(i) {

	document.getElementById('youtube1input').value = i.Youtube;
	document.getElementById('youtube2input').value = i.Youtube2;
	document.getElementById('twitchtvinput').value = i.Twitch;
	document.getElementById('twitterinput').value = i.Twitter;
	document.getElementById('discordinput').value = i.Discord;

}

function changeColor(target) {
	target.style.cssText = `--bs-btn-padding-y: 0px; --bs-btn-padding-x: 0px; background-color: #0000; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF; text-decoration: none; font-weight: bold;`;
	// Check the name customization setting.
	
	switch (colorType) {
		// Flat Color
		case 1:
			target.style.cssText += `color:` + color1 + `; --bs-btn-hover-color:` + color1 + `; --bs-btn-active-color:` + color1 + `;`;
			break;
		// Gradient Color
		case 2:
			target.style.cssText += `background: -webkit-linear-gradient(0deg, ` + color1 + `, ` + color2 + `);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;`;
			break;
		// Glow Color
		case 3:
			target.style.cssText += `text-shadow: 0px 0px 5px ` + color1 + `, 0px 0px 5px ` + color1 + `, 0px 0px 5px ` + color1 + `;`;
			break;
		default:
			break;
	}
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
	target.innerHTML = newname;

}

function enableShips(input,ship) {
	const list = document.getElementById('shippicker');
	if (input == 'global') {
		list.innerHTML = `
		<option value="">Don't Show</option>
		<option value="1">Ship 1</option>
		<option value="2">Ship 2</option>
		<option value="3">Ship 3</option>
		<option value="4">Ship 4</option>`;
	}
	if (input == 'japan') {
		list.innerHTML = `
		<option value="">Don't Show</option>
		<option value="1">Ship 1</option>
		<option value="2">Ship 2</option>
		<option value="3">Ship 3</option>
		<option value="4">Ship 4</option>
		<option value="5">Ship 5</option>
		<option value="6">Ship 6</option>
		<option value="7">Ship 7</option>
		<option value="8">Ship 8</option>
		<option value="9">Ship 9</option>`;
	}
    console.log(ship);
    if(ship != null) {
        var active = document.querySelector('#shippicker option[value=' + CSS.escape(ship) + ']');
        active.setAttribute('selected','');
    }
}

function prepareCountries(input) {
	console.log(input);
	countries.forEach(function(country, index) {
		var opt = document.createElement('option');
		opt.innerHTML = country.text;
		opt.value = country.value.toLowerCase();
		if(country.value.toLowerCase() == input) {
			opt.setAttribute('selected','');
		}
		fragment.appendChild(opt);
		
	});
	
	countrysel.appendChild(fragment);
}

function updateNameColor() {
	console.log('blep');
	var nameType = document.querySelector('input[name="nameThemeSelectorRadio"]:checked').value;
	console.log(nameType);
	switch(nameType) {
		case '1':
			namer.style.cssText = defaultCSS + `color:` + color1 + `;`;
			break;
		case '2':
			namer.style.cssText = defaultCSS + `background: -webkit-linear-gradient(0deg, ` + color1 + `, ` + color2 + `);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;`;
			break;
		case '3':
			namer.style.cssText = defaultCSS + `text-shadow: 0px 0px 5px ` + color1 + `, 0px 0px 5px ` + color1 + `, 0px 0px 5px ` + color1 + `;`;
			break;
		default:
			namer.style.cssText = '' + defaultCSS;
			break;

	};

}

function changeType(i) {
	colorType = i;
	if (colorType > 3 || colorType < 0) {
		colorType = 0;
	}
	changeColor(document.getElementById('mainname'));
}

function setInitialColorType(i) {
	b = document.querySelector('#group-colorpicker input[value=' + CSS.escape(i.NameType) + ']');
	b.setAttribute('checked','');
	b.setAttribute('aria-pressed','true');
}