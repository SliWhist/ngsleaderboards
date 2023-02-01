const HeaderMain = document.querySelector("#lbHeader");
const HeaderUserbuttons = document.querySelector("#lbHeader > div > div> ul");

var userInfo = null;
var userinfoName = null;
var userinfoNametype = null;
var userinfoColor1 = null;
var userinfoColor2 = null;

export async function headerGenerate () {

    if (userInfo == null) {
        userInfo = await getUserInfo();

        if (userInfo != null)
        {
            //console.log(userInfo.userDetails);
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
        HeaderUserbuttons.innerHTML += `<li class="nav-item">
        <a class="nav-link" href="/login"><i class="bi bi-box-arrow-in-right me-2"></i>Log in</a>
      </li>`;
    }
    if (userInfo != null) {
        if (userInfo.userId != null && userInfo.userRoles.includes('user')) {
            if (userInfo.userRoles.includes('user')) {
                createSubmitButton();
            }
            if (userInfo.userRoles.includes('moderator') || userInfo.userRoles.includes('administrator')) {
                createModeratorButton();
            }
            createNameButton();
        }
        if (userInfo.userId != null && !userInfo.userRoles.includes('user')) {
            HeaderUserbuttons.innerHTML += `<li class="nav-item">
            <a class="nav-link" href="/setup"><i class="bi bi-gear me-2"></i>Finish Setup</a>
          </li>`;
        }
        if (userInfo.userId != null && !userInfo.userRoles.includes('user')) {
            HeaderUserbuttons.innerHTML += `<li class="nav-item">
            <a class="nav-link" href="/logout"><i class="bi bi-box-arrow-right me-2"></i>Log out</a>
          </li>`;
        }
    }

    
}

async function getUserInfo() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
}

function createSubmitButton() {
    const li = document.createElement("li");
    li.classList.add("nav-item");
    //console.log(window.location.pathname.match(/submit/gi));
    const ahref = document.createElement("a");
    ahref.classList.add("nav-link");
    ahref.href = "/submit";
    ahref.innerHTML = `<i class="bi bi-envelope-paper me-2"></i>Submit a Run</a>`
    if (window.location.pathname.match(/submit/gi)) {
        ahref.classList.add("active");
    };
    //<li><a class="dropdown-item" href="/moderator/alerts"><i class="bi bi-envelope-exclamation me-2"></i>Alerts<!-- <span class="badge text-bg-danger rounded-pill ms-auto">99+<span class="visually-hidden">unread alerts</span></span>--></a></li>`;
    //if(userInfo.userRoles.includes('administrator')) {
     //   liInner += `<li><hr class="dropdown-divider"></li>
    //    <li><a class="dropdown-item" href="/admin"><i class="bi bi-speedometer2 me-2"></i>Admin Dashboard</a>`;
    //}
    //liInner += `</li></ul>`;
    li.appendChild(ahref);
  HeaderUserbuttons.appendChild(li);
}

function createModeratorButton() {
    const li = document.createElement("li");
    li.classList.add("nav-item","dropdown");
    li.setAttribute("data-bs-theme","dark");
    var liInner = `            <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
    <i class="bi bi-shield-shaded me-2"></i>Moderation
  </a>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="/moderator/submissions"><i class="bi bi-inboxes me-2"></i>Run Submissions<!-- <span class="badge text-bg-danger rounded-pill ms-auto">99+<span class="visually-hidden">unapproved runs</span></span>--></a></li>`;
    //<li><a class="dropdown-item" href="/moderator/alerts"><i class="bi bi-envelope-exclamation me-2"></i>Alerts<!-- <span class="badge text-bg-danger rounded-pill ms-auto">99+<span class="visually-hidden">unread alerts</span></span>--></a></li>`;
    //if(userInfo.userRoles.includes('administrator')) {
     //   liInner += `<li><hr class="dropdown-divider"></li>
    //    <li><a class="dropdown-item" href="/admin"><i class="bi bi-speedometer2 me-2"></i>Admin Dashboard</a>`;
    //}
    //liInner += `</li></ul>`;
    li.innerHTML = liInner;
  HeaderUserbuttons.appendChild(li);
}

function createNameButton() {
    const li = document.createElement("li");
    li.classList.add("nav-item","dropdown");
    li.setAttribute("data-bs-theme","dark");
  // Create the 'button'. Really just a clickable name.
  const buttonref = document.createElement("a");
  // Set the default name customization.
  buttonref.style.cssText = `background-color: #0000; --bs-btn-color: #FFFFFF; --bs-btn-hover-color: #FFFFFF; --bs-btn-active-color: #FFFFFF; text-decoration: none; font-weight: bold;`;
  // Check the name customization setting.
  switch (userinfoNametype) {
      // Flat Color
      case 1:
          buttonref.style.cssText += `color: #` + userinfoColor1 + `; --bs-btn-color: #` + userinfoColor1 + `; --bs-btn-hover-color: #` + userinfoColor1 + `; --bs-btn-active-color: #` + userinfoColor1 + `;`;
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
          buttonref.style.cssText += `color: #FFFFFF; text-shadow: 0px 0px 5px #` + userinfoColor1 + `, 0px 0px 5px #` + userinfoColor1 + `, 0px 0px 5px #` + userinfoColor1 + `;`;
          break;
      default:
          break;
  }
  buttonref.classList.add("nav-link","dropdown-toggle");
  buttonref.setAttribute("role","button");
  buttonref.setAttribute("data-bs-toggle","dropdown");
  buttonref.innerHTML = userinfoName;
  li.appendChild(buttonref);
  const dropref = document.createElement("ul");
  dropref.classList.add("dropdown-menu");
  dropref.innerHTML = `<li><a class="dropdown-item" href="/profile"><i class="bi bi-person-vcard me-2"></i>Profile</a></li>
  <li><hr class="dropdown-divider"></li>
  <li><a class="dropdown-item" href="/logout"><i class="bi bi-box-arrow-right me-2"></i>Log out</a></li>`;
  li.appendChild(dropref);
  HeaderUserbuttons.appendChild(li);
}

//<li><a class="dropdown-item" href="/settings"><i class="bi bi-gear me-2"></i>Settings</a></li>