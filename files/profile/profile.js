const testtext = document.getElementById("test");

async function loadUser() {

    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;

    testtext.innerHTML += clientPrincipal.userId
    console.log(clientPrincipal);

}