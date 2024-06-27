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
        return parseInt(this.elemento.style.left.split("px")[0]);
    }
    //console.log(this.elemento.style.left.split('px')[0]+1);
    //console.log(x, typeof x);
    this.setX = x => {return this.elemento.style.left = `${x}px;`}//;console.log('oi'+x)}
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

const areaDoJogo = window.document.querySelector('[wm-flappy]');
const barreiras = new Barreiras(700, 1200, 400, 300);

barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento));
setInterval(() => {barreiras.animar()}, 2000)