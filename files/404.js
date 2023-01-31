document.body.onload = LoadAll();

import * as HeaderGen from "/globalscripts/module/headergen.js"

function Pick404()
{
    const imagecol = document.querySelector("#placeImage");
    const textcol = document.querySelector("#placeText");
    const array404s =
    [
    "HelvianSnoruq",
    "HelvianBall",
    "HelvianBujin",
    "HelvianSlots",
    "KaistaraNogleth",
    "ZoutaAms",
    "ZoutaNex",
    "ZoutaRenus",
    "SukeboyKaiby"
    ]

    var randomPick = array404s[array404s.length * Math.random() | 0]
    console.log(randomPick);

    switch (randomPick) {
        case "HelvianSnoruq":
            imagecol.innerHTML = `<img src="/img/404/helvian-snoruq.png" class="img-fluid" alt="Helvian facing off a Malevolent Snoruq.">
            <div class="text-secondary">Screenshot by Helvian</div>`
            textcol.innerHTML += `<div class="mt-4 mb-2">Consider rolling back to the <a class="link-info" href="/">Home</a> page!</div>`
            break;
        case "HelvianBujin":
            imagecol.innerHTML = `<img src="/img/404/helvian-bujin.png" class="img-fluid" alt="Helvian, short, next to Bujin, tall.">
            <div class="text-secondary">Screenshot by Helvian</div>`
            textcol.innerHTML += `<div class="mt-4 mb-2 text-center">We came up short while looking for this page.<br>Why not head <a class="link-info" href="/">Home</a>?</div>`
            break;
        case "HelvianBall":
            imagecol.innerHTML = `<img src="/img/404/helvian-ball.png" class="img-fluid" alt="Helvian, incapacitated next to a cannonball.">
            <div class="text-secondary">Screenshot by Helvian</div>`
            textcol.innerHTML += `<div class="mt-4 mb-2 text-center">Don't drop the ball!<br>Restart and head <a class="link-info" href="/">Home</a>?</div>`
            break;
        case "HelvianSlots":
            imagecol.innerHTML = `<img src="/img/404/helvian-rappyslots.png" class="img-fluid" alt="Helvian, attacking rappy slots with a large hammer.">
            <div class="text-secondary">Screenshot by Helvian</div>`
            textcol.innerHTML += `<div class="mt-4 mb-2 text-center"><strong>Jackpot!</strong><br>Someone just won big at slots!<br><a class="link-info" href="/">Spin again</a>?</div>`
            break;
        case "KaistaraNogleth":
            imagecol.innerHTML = `<img src="/img/404/kaistara-nogleth.png" class="img-fluid" alt="Kaistara and company fighting a Nogleth.">
            <div class="text-secondary">Screenshot by Kaistara</div>`
            textcol.innerHTML += `<div class="mt-4 mb-2 text-center">Our party couldn't find that page!<br>Try searching on the <a class="link-info" href="/">Home</a> page!</div>`
            break;
        case "ZoutaAms":
            imagecol.innerHTML = `<img src="/img/404/zouta-ams.png" class="img-fluid" alt="Zouta facing off Ams Kvaris.">
            <div class="text-secondary">Screenshot by Zouta</div>`
            textcol.innerHTML += `<div class="mt-4 mb-2 text-center">"Oh, you're approaching me?"<br>"I can't go back to the <a class="link-info" href="/">Home</a> page without getting closer."</div>`
            break;
        case "ZoutaNex":
            imagecol.innerHTML = `<img src="/img/404/zouta-nex.png" class="img-fluid" alt="Zouta staring down a Nex Aelio.">
            <div class="text-secondary">Screenshot by Zouta</div>`
            textcol.innerHTML += `<div class="mt-4 mb-2 text-center">This page is about to have a blast.<br>Dodge to the <a class="link-info" href="/">Home</a> page?</div>`
            break;
        case "ZoutaRenus":
            imagecol.innerHTML = `<img src="/img/404/zouta-renus.png" class="img-fluid" alt="Zouta incapacitated by Renus Retem.">
            <div class="text-secondary">Screenshot by Zouta</div>`
            textcol.innerHTML += `<div class="mt-4 mb-2 text-center">We dug around, but we couldn't find that page.<br>Revive in 5 seconds at the <a class="link-info" href="/">Home</a> page.</div>`
            break;
        case "SukeboyKaiby":
            imagecol.innerHTML = `<img src="/img/404/sukeboy-kaiby.png" class="img-fluid" alt="Sukeboy in a Kaiby look with a gun.">
            <div class="text-secondary">Screenshot by Kat</div>`
            textcol.innerHTML += `<div class="mt-4">You've encountered a Malevolent Kaibygun. What will you do?</div>
            <div class="mb-2"><a class="link-info" href="/"><strong>> Run</strong></a></div>`
            break;
    }
}

function LoadAll()
{

    HeaderGen.headerGenerate();
    Pick404();

}