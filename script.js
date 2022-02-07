var paraula = [];
var mapaResposta = {};
var intents = 0;
var diccionari;
var resposta ;
var encerts = 0;


//Obre el diccionari d'un txt i recollim els de 5 lletres
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
                let tempDiccionari = rawFile.responseText.split('\n');
                diccionari = tempDiccionari.filter((e) => {
                    return e.length == 5;
                })
            }
        }
    }
    rawFile.send(null);
}
readTextFile("DISC2-LP.txt");
//un cop recollits escollim una paraula.
resposta = diccionari[Math.floor(Math.random() * 11012)];


/*
//Segon intent, falla el retorn de fetch. Per Què?
!async function loadTxt(){
    let respostaTemp = await fetch('DISC2-LP.txt')
    .then(function(response){
        return response.text();
    })
    .then(function(data){
        return data;
    });
    console.log(respostaTemp)
}();
*/

//crearem un mapa amb les lletres de la paraula per a saber si h iha repetides.
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

window.onload = function() {
    var input = document.getElementById("teclat").focus();
  }

//Escolta de tecles polsades
document.addEventListener('keydown', logKey);

function logKey(e){
    if (e.keyCode === 13){
        checkParaula();
    } else if (e.keyCode === 8){
        paraula.pop();
        document.getElementsByClassName('linia')[intents].children[paraula.length].innerText = "";
    } else if ((e.keyCode >= 65 && e.keyCode <= 90) && paraula.length < 5){
        ompleQuadre(e.key.toUpperCase());
        paraula.push(e.key.toUpperCase())
    } 
}

//Quan es polsa una lletra, s'omple el quadre corresponent
function ompleQuadre(lletra){
    var liniaActual = document.getElementsByClassName('linia')[intents];
    var casellaActual = paraula.length;
    liniaActual.children[casellaActual].innerText = lletra;
}

//Al polsar ENTER comprovem i la paraula és la correcta.
function checkParaula(){
    let mapaTemp = mapaResposta;
    var liniaActual = document.getElementsByClassName('linia')[intents];
    encerts = 0;
    if (paraula.length !== 5){
        liniaActual.classList.add('error');
        setTimeout(() => {
            liniaActual.classList.remove('error')
            alert("La Paraula ha de tenir 5 lletres!")
        }, 300);
    } else {
        if (diccionari.includes(paraula.join(''))){
            for(let i = 0; i < 5; i++){
                setTimeout(()=>{
                    liniaActual.children[i].style.transform = "rotateY(90deg)";
                    setTimeout(() => {
                        if (paraula[i]=== resposta[i]){
                            liniaActual.children[i].classList.add('correcte');
                            encerts++;
                            mapaTemp[paraula[i]]--;
                        } 
                        for(let j = 0; j < 5; j++){
                            if (paraula[i] === resposta[j] && i !== j && mapaTemp[paraula[i]] > 0){
                                liniaActual.children[i].classList.add('casi');
                                mapaTemp[paraula[i]]--;
                            }                       
                        }
                        }, 199);
                   
                    setTimeout(() => {
                        if(!liniaActual.children[i].classList.contains('correcte') && !liniaActual.children[i].classList.contains('casi') ){
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
        } else {
            liniaActual.classList.add('error');
            setTimeout(() => {
                liniaActual.classList.remove('error')
            }, 300);
        }
    }
    setTimeout(checkVictoria, 1360);
}

//Check si s'ha guanyat o perdut.
function checkVictoria(){
    if(encerts === 5){
        alert(`Enhorabona! Has encertat amb ${intents} intents!`)
    } else {
        if (intents > 5){
            alert("Has sobrepassat el nombre màxim d'intents.")
        }
    }
}