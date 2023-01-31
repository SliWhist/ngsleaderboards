
const HeaderNameRef = document.querySelector("#usernameReference");

document.body.onload = LoadAll();

var userInfo = null;
var userinfoName = null;

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
                setDisplayname();
            }
        }

    }
    
}

async function getUserInfo() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
}

function setDisplayname() {
    HeaderNameRef.textContent = userinfoName;
}
