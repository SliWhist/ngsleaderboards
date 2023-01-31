const HeaderMain = document.querySelector("#lbHeader");
const HeaderUserbuttons = document.querySelector("#lbHeader > ul");

document.body.onload = LoadAll();

var userInfo = null;
var userinfoName = null;
var userinfoNametype = null;
var userinfoColor1 = null;
var userinfoColor2 = null;

function LoadAll()
{

    headerGenerate();
    loadScoresBegin();

}

async function headerGenerate () {

    if (userInfo == null) {
        userInfo = await getUserInfo();

        if (userInfo != null)
        {
            //console.log(userInfo);
            const iterator = userInfo.claims.values();
    
            for (const value of iterator) {
                //console.log(value.typ);
                if (value.typ == "extension_playerDisplayname")
                {
                    userinfoName = value.val;
                };
                if (value.typ == "extension_playerNametype")
                {
                    userinfoNametype = parseInt(value.val);
                };
                if (value.typ == "extension_playerNamecolor1")
                {
                    userinfoColor1 = value.val;
                };
                if (value.typ == "extension_playerNamecolor2")
                {
                    userinfoColor2 = value.val;
                };
            }
        }

    }

    if (userInfo == null) {
        HeaderUserbuttons.innerHTML += `<li>
        <a class="btn btn-outline-secondary" href="/login" role="button">Login</a>
        </li>`;
    }
    if (userInfo != null) {
        if (userInfo.userId != null) {
            createNameButton();
        }
    }

    
}

async function getUserInfo() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
}

function createNameButton() {
    const li = document.createElement("li")
  // Create the 'button'. Really just a clickable name.
  const buttonref = document.createElement("a");
  // Set the default name customization.
  buttonref.style.cssText = `background-color: #0000; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF; text-decoration: none; font-weight: bold;`;
  // Check the name customization setting.
  switch (userinfoNametype) {
      // Flat Color
      case 1:
          buttonref.style.cssText += `--bs-btn-color: #` + userinfoColor1 + `; --bs-btn-hover-color: #` + userinfoColor1 + `; --bs-btn-active-color: #` + userinfoColor1 + `;`;
          break;
      // Gradient Color
      case 2:
          buttonref.style.cssText += `background: -webkit-linear-gradient(0deg, #` + userinfoColor1 + `, #` + userinfoColor2 + `);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;`;
          break;
      // Glow Color
      case 3:
          //console.log(row.NameColor1);
          buttonref.style.cssText += `text-shadow: 0px 0px 5px #` + userinfoColor1 + `, 0px 0px 5px #` + userinfoColor1 + `, 0px 0px 5px #` + userinfoColor1 + `;`;
          break;
      default:
          break;
  }
  buttonref.classList.add("btn","btn-link");
  buttonref.setAttribute("role","button");
  buttonref.setAttribute("href","/logout");
  buttonref.innerHTML = userinfoName;
  li.appendChild(buttonref);
  HeaderUserbuttons.appendChild(li);
}
