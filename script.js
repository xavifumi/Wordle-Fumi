var paraula = [];
var mapaResposta = {};
var intents = 0;
var resposta = "truca";
var encerts = 0;

/*
var urlpath = "DISC2-LP.txt";
var oReq = new XMLHttpRequest();
oReq.open("GET", urlpath, false);
oReq.responseType = "arraybuffer";
*/
//proves per obrir la llista de paraules
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    //rawFile.send(null);
}

readTextFile("DISC2-LP.txt");

//Escolta de tecles polsades
document.addEventListener('keydown', logKey);

function logKey(e){
    if (e.keyCode === 13){
        checkParaula();
    } else if (e.keyCode === 8){
        paraula.pop();
        document.getElementsByClassName('linia')[intents].children[paraula.length].innerText = "";
    } else if ((e.keyCode >= 65 && e.keyCode <= 90) && paraula.length < 5){
        ompleQuadre(e.key);
        paraula.push(e.key)
    } 
}

function creaMapa(){
    for(let i = 0; i < resposta.length; i++){
        if(mapaResposta[resposta[i]] == undefined){
            mapaResposta[resposta[i]] = 1;
        } else{
            mapaResposta[resposta[i]]++;
        }
        
    }
}

creaMapa();

function ompleQuadre(lletra){
    var liniaActual = document.getElementsByClassName('linia')[intents];
    var casellaActual = paraula.length;
    liniaActual.children[casellaActual].innerText = lletra;
}

function checkParaula(){
    let mapaTemp = mapaResposta;
    var liniaActual = document.getElementsByClassName('linia')[intents];
    encerts = 0;
    if (paraula.length !== 5){
        alert("La Paraula ha de tenir 5 lletres!")
    } else {
        for(let i = 0; i < 5; i++){
            setTimeout(()=>{
                liniaActual.children[i].style.transform = "rotateY(90deg)";
                setTimeout(() => {
                    if (paraula[i]=== resposta[i]){
                        liniaActual.children[i].classList.add('correcte');
                        //console.log("correcte!")
                        encerts++;
                        mapaTemp[paraula[i]]--;
                    } 
                    for(let j = 0; j < 5; j++){
                        if (paraula[i] === resposta[j] && i !== j && mapaTemp[paraula[i]] > 0){
                            liniaActual.children[i].classList.add('casi');
                            //console.log("casi!");
                            mapaTemp[paraula[i]]--;
                        }                       
                    }
                    }, 199);
               
                setTimeout(() => {
                    if(!liniaActual.children[i].classList.contains('correcte') && !liniaActual.children[i].classList.contains('casi') ){
                        //console.log("ni correcte ni casi")
                        liniaActual.children[i].classList.add('nope');
                    };
                    liniaActual.children[i].style.transform = "rotateY(0deg)";  
                }, 201);
            }, i*250)
        }
        setTimeout(() => {
            intents++;
            paraula = [];       
        }, 1350);
    }
    setTimeout(checkVictoria, 1360);
}

function checkVictoria(){
    if(encerts === 5){
        alert(`Enhorabona! Has encertat amb ${intents} intents!`)
    } else {
        if (intents > 5){
            alert("Has sobrepassat el nombre màxim d'intents.")
        }
    }
}