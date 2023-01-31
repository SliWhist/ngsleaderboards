const array404s =
[
    `url('/img/background/aelio-purp.png')`,
    `url('/img/background/aelio-purp-night.png')`,
    `url('/img/background/kvaris-purp.png')`,
    `url('/img/background/kvaris-purp-night.png')`,
    `url('/img/background/retem-purp.png')`,
    `url('/img/background/retem-purp-night.png')`,
    `url('/img/background/stia-purp.png')`,
    `url('/img/background/stia-purp-night.png')`
]

window.addEventListener("load", (event) => {
    
    document.body.style.backgroundImage = array404s[array404s.length * Math.random() | 0];

});