const translateable = document.querySelectorAll("[data-translationKey]");

var userLocale;

window.addEventListener("load", (event) => {
    if (userLocale == 'EN') {
        userLocale = null;
    }
    if (userLocale != null) {
        translatePage();
    }
});

async function translatePage() {

    let translationTable;

    const res = await fetch('/locale/translations' + userLocale + '.json')
  
    translationTable = await res.json();
  
    console.log(translationTable)

    console.log(translationTable['testValue'])

    translateable.forEach((tl) => {

        if (translationTable[tl.dataset.translationkey] != null) {
            var output = translationTable[tl.dataset.translationkey]
            tl.textContent = output;
        }
    });

}