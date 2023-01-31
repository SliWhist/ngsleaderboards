const HeaderMain = document.querySelector("#lbHeader");
const HeaderUserbuttons = document.querySelector("#lbHeader > ul");
const UserName = document.querySelector("#username");

document.body.onload = LoadAll();

var userInfo = null;
var userinfoName = null;
var userinfoNametype = null;
var userinfoColor1 = null;
var userinfoColor2 = null;

function LoadAll()
{

    headerGenerate();

}

async function headerGenerate () {

    if (userInfo == null) {
        userInfo = await getUserInfo();

        if (userInfo != null)
        {
            console.log(userInfo);
            const iterator = userInfo.claims.values();
    
            for (const value of iterator) {
                console.log(value.typ);
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

    if (userInfo != null) {
        if (userInfo.userId != null) {
            customizeNameButton ();
        }
    }

    
}


async function getUserInfo() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
}

function customizeNameButton () {
  // Set the default name customization.
  UserName.style.cssText = `background-color: #0000; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF; text-decoration: none; font-weight: bold;`;
  // Check the name customization setting.
  switch (userinfoNametype) {
      // Flat Color
      case 1:
        UserName.style.cssText += `--bs-btn-color: #` + userinfoColor1 + `; --bs-btn-hover-color: #` + userinfoColor1 + `; --bs-btn-active-color: #` + userinfoColor1 + `;`;
          break;
      // Gradient Color
      case 2:
        UserName.style.cssText += `background: -webkit-linear-gradient(0deg, #` + userinfoColor1 + `, #` + userinfoColor2 + `);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;`;
          break;
      // Glow Color
      case 3:
          //console.log(row.NameColor1);
          UserName.style.cssText += `text-shadow: 0px 0px 5px #` + userinfoColor1 + `, 0px 0px 5px #` + userinfoColor1 + `, 0px 0px 5px #` + userinfoColor1 + `;`;
          break;
      default:
          break;
  }
  UserName.textContent = userinfoName;
}
