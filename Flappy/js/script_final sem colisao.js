function novoElemento(tagName, className){
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function Barreira(reversa = false){
    this.elemento = novoElemento('div', 'barreira');
    
    const borda = novoElemento('div', 'borda');
    const corpo = novoElemento('div', 'corpo');
    this.elemento.appendChild(reversa ? corpo:borda);
    this.elemento.appendChild(reversa ? borda:corpo);

    this.setAltura = altura => corpo.style.height = `${altura}px`;

}

function ParDeBarreiras(altura, abertura, x){
    this.elemento = novoElemento('div', 'par-de-barreiras');

    this.superior = new Barreira(true);
    this.inferior = new Barreira(false);

    this.elemento.appendChild(this.superior.elemento);
    this.elemento.appendChild(this.inferior.elemento);

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura-abertura);
        const alturaInferior = altura - abertura - alturaSuperior;
        this.superior.setAltura(alturaSuperior);
        this.inferior.setAltura(alturaInferior);
    }
    
    this.getX = () => {
        return parseInt(this.elemento.style.left.split('px')[0]);
    }
    //console.log(this.elemento.style.left.split('px')[0]+1);
    //console.log(x, typeof x);
    this.setX = x => {return this.elemento.style.left = `${x}px`}//;console.log('oi'+x)}
    this.getLargura = () => this.elemento.clientWidth; //isso tá ok

    this.sortearAbertura();
    this.setX(x);
    /*
    this.getX = () => parseInt(this.elemento.style.left.split('px')[0]); // Aqui retorna o valor
    this.setX = x => this.elemento.style.left = `${x}px`;
    this.getLargura = () => this.elemento.clientWidth;
   
    this.sortearAbertura();
    this.setX(x);
    */
}

//const b = new ParDeBarreiras(700, 400, 400);
//window.document.querySelector('[wm-flappy]').appendChild(b.elemento); 

function Barreiras(altura, largura, abertura, espaco, notificarPonto){
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura+espaco),
        new ParDeBarreiras(altura, abertura, largura+espaco*2),
        new ParDeBarreiras(altura, abertura, largura+espaco*3)
    ]

    const deslocamento = 3;
    this.animar = () =>{
        this.pares.forEach(par => {par.setX(par.getX()-deslocamento);
        //console.log('oi'.toUpperCase(), deslocamento);
        //quando o elemento sair da tela:
        if(par.getX() < -par.getLargura()){
            par.setX(par.getX()+espaco*this.pares.length);
            par.sortearAbertura();
        }

        const meio = largura/2;
        const cruzouOMeio = par.getX() + deslocamento >= meio && par.getX() < meio;
        if(cruzouOMeio) notificarPonto();
        });
    }
}

function Passaro(alturaJogo){
    let voando = false;
    this.elemento = novoElemento('img', 'passaro');
    this.elemento.src = 'imgs/passaro.png';

    this.getY = () => {return parseInt(this.elemento.style.bottom.split('px')[0]);}
    this.setY = (x) => this.elemento.style.bottom = `${x}px`;
        //return this;}

    window.onkeydown = event => {voando = true; return voando;}
    window.onkeyup = event =>{voando = false; return voando;}

    this.animar = () => {
        const novoY = this.getY() + (voando?8:-5);
        const alturaMaxima = alturaJogo - this.elemento.clientHeight;
        if(novoY<=0){
            this.setY(0);
        }else if(novoY>=alturaMaxima){
            this.setY(alturaMaxima);
        }else{
            this.setY(novoY);
        }
    }

    this.setY(alturaJogo/2);

}

function Progresso(){
    this.elemento = novoElemento('span', 'progresso');
    this.atualizarPontos = pontos =>{
        this.elemento.innerHTML = pontos;
    }
    this.atualizarPontos(0);
}


/*
const passaro = new Passaro(700);
const barreiras = new Barreiras(700, 1200, 400, 300);
const areaDoJogo = window.document.querySelector('[wm-flappy]');

areaDoJogo.appendChild(passaro.elemento);
areaDoJogo.appendChild(new Progresso().elemento);
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento));
setInterval(() => {barreiras.animar(); passaro.animar()}, 20);

*/

function FlappyBird(){
    let pontos = 0;
    const areaDoJogo = window.document.querySelector('[wm-flappy]');
    const altura = areaDoJogo.clientHeight;
    const largura = areaDoJogo.clientWidth;

    const progresso = new Progresso();
    const barreiras = new Barreiras(altura, largura, 200, 400, 
        () => progresso.atualizarPontos(++pontos));
    const passaro = new Passaro(altura);

    areaDoJogo.appendChild(progresso.elemento);
    areaDoJogo.appendChild(passaro.elemento);
    barreiras.pares.forEach(par=>areaDoJogo.appendChild(par.elemento));

    this.start = () => {
        const temporizador = setInterval(() =>{
            passaro.animar();
            barreiras.animar();
        }, 20);
    }

}

const obj_jogo = new FlappyBird();

obj_jogo.start();