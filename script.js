var paraula = [];
var mapaResposta = {};
var intents = 0;
var diccionari;
var resposta ;
var encerts = 0;
var teclat = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L","Ç"],
    ["ENTER","Z","X","C","V","B","N","M","DEL"]
]


function generaTecles(){
    let teclatHTML = document.getElementById('teclat');
    for (fila in teclat){
        for (tecla in teclat[fila]){
            teclatHTML.children[fila].innerHTML +=
            `
            <button id="${teclat[fila][tecla]}" class="tecla" onmousedown="ompleQuadre(this.innerText)">${teclat[fila][tecla]}</button>
            `
        }
    }
    teclatHTML.children[2].firstElementChild.onmousedown = function(){checkParaula()};
    teclatHTML.children[2].lastElementChild.onmousedown = function(){buidaQuadre()};

}


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

//prova de posar focus en l'input amagat perquè aparegui teclat
window.onload = function() {
 //   document.getElementById("noTeclat").focus();
    generaTecles();
    document.getElementById('modal').style.display = 'block';
}

function closeModal(){
    document.getElementById('modal').style.display = 'none';
}

//Escolta de tecles polsades
document.addEventListener('keydown', logKey);

//Funcions de Tecles:

function logKey(e){
    if (e.keyCode === 13){
        checkParaula();
    } else if (e.keyCode === 8){
        buidaQuadre();
    } else if (((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode == 191) && paraula.length < 5){
        ompleQuadre(e.key.toUpperCase());
    } 
}

function buidaQuadre(){
    paraula.pop();
    document.getElementsByClassName('linia')[intents].children[paraula.length].innerText = "";
}

//Quan es polsa una lletra, s'omple el quadre corresponent
function ompleQuadre(lletra){
    var liniaActual = document.getElementsByClassName('linia')[intents];
    var casellaActual = paraula.length;
    liniaActual.children[casellaActual].innerText = lletra;
    paraula.push(lletra)
}

//Al polsar ENTER comprovem i la paraula és la correcta.
function checkParaula(){
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
            let mapaTemp = {...mapaResposta};

            for(let i = 0; i < 5; i++){
                
                setTimeout(()=>{
                    liniaActual.children[i].style.transform = "rotateY(90deg)";
                    setTimeout(() => {
                        if (paraula[i]=== resposta[i]){
                            liniaActual.children[i].classList.add('correcte');
                            document.getElementById(paraula[i]).classList.remove('nope', 'casi');
                            document.getElementById(paraula[i]).classList.add('correcte');
                            encerts++;
                            mapaTemp[paraula[i]]--;
                        } else {
                            for(let j = 0; j < 5; j++){
                                console.log(mapaTemp)
                                if (paraula[i] === resposta[j] && i !== j && mapaTemp[paraula[i]] > 0){
                                    liniaActual.children[i].classList.add('casi');
                                    document.getElementById(paraula[i]).classList.remove('nope');
                                    if(!document.getElementById(paraula[i]).classList.contains('correcte')){
                                        document.getElementById(paraula[i]).classList.add('casi');
                                    }
                                    mapaTemp[paraula[i]]--;
                                }                       
                            }

                        }
                        }, 199);
                   
                    setTimeout(() => {
                        if(!liniaActual.children[i].classList.contains('correcte') && !liniaActual.children[i].classList.contains('casi') ){
                            liniaActual.children[i].classList.add('nope');
                            if(!document.getElementById(paraula[i]).classList.contains('correcte', 'casi')){
                                document.getElementById(paraula[i]).classList.add('nope');
                            }
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
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
       // alert(`Enhorabona! Has encertat amb ${intents} intents!`)
       document.getElementById('modal-content').innerHTML = `
       <button id="modal-close" style="position:absolute; right:30px; top:30px" onclick="closeModal()">X</button>
       <h2 style="text-align: center; font-size: 2em;">Enhorabona!</h2>
       <p>Has encertat amb ${intents} intents!</p>
       
       `
       document.getElementById('modal').style.display = "block";
    } else {
        if (intents > 5){
            //alert("Has sobrepassat el nombre màxim d'intents. \n La paraula: " + resposta)
            document.getElementById('modal-content').innerHTML = `
            <button id="modal-close" style="position:absolute; right:30px; top:30px" onclick="closeModal()">X</button>
            <h2 style="text-align: center; font-size: 2em; color:#f2cf07">Llàstima!</h2>
            <p>Has sobrepassat el nombre màxim d'intents.<br>La paraula era:</p>
            <h3 style="text-align: center">${resposta}</h3>
            
            `
            document.getElementById('modal').style.display = "block";
        }
    }
}