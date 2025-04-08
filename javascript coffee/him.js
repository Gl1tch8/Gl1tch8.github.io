const input = document.getElementById("input");
const submit = document.getElementById("submit");
const result = document.getElementById("result");

submit.onclick = function(){
    result.textContent = input.value;
} 

const think = document.getElementById("think");
const ctr = document.getElementById("ctr");
think.onclick = function(){
    ctr.textContent++;
}

const music = document.getElementById("music");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const back = document.getElementById("back");

let wine = [
    'wine/[Official Arctic Monkeys] I Wanna Be Yours.mp3',
    'wine/[Official Arctic Monkeys] 505.mp3',
    'wine/[Official Arctic Monkeys] Do I Wanna Know.mp3',
    'wine/[Official Arctic Monkeys] R U Mine.mp3',
    'wine/[Official Arctic Monkeys] Snap Out Of It.mp3',
    'wine/[Official Arctic Monkeys] Whyd You Only Call Me When Youre High.mp3',
    'wine/[Official Arctic Monkeys] Arabella.mp3',
    'wine/[Official Arctic Monkeys] Fluorescent Adolescent.mp3',
    'wine/[Official Arctic Monkeys] Knee Socks.mp3',
    'wine/[Official Arctic Monkeys] No. 1 Party Anthem.mp3',
    'wine/[Cigarettes After Sex] Affection.mp3',
    'wine/[Cigarettes After Sex] Apocalypse.mp3',
    'wine/[Cigarettes After Sex] Nothings Gonna Hurt You Baby.mp3',
    'wine/[Cigarettes After Sex] Tejano Blue.mp3',
    'wine/[Cigarettes After Sex] K.mp3',
    'wine/[Cigarettes After Sex] Xs.mp3'
]

music.volume = 0.5;
let i = 0;
document.getElementById("next").onclick = function(){
    i++;
    i %= wine.length;
    music.src = wine[i];
}

document.getElementById("back").onclick = function(){
    if (i > 0)
        i--;
    else 
        i = wine.length - 1;
    music.src = wine[i];
}

music.addEventListener('play', function(){
    title.textContent = wine[i].replace('wine/','').replace(/\[.*?\]/,'').replace('.mp3','');
    artist.textContent = wine[i].replace('wine/[','').replace(/\].*/,'');
})

music.addEventListener('ended', function(){
    document.getElementById("next").click();
});





