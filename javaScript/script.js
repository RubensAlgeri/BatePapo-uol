let nomeUsuario;
let promessaEnviada;
let verificacao;
let mensagens;
let nomeUsuarioObjeto;
let caixaMensagem;
let mensagem;
let mensagemAEnviar;
let nomeDestinatario = "Todos";
let mensagem1 = [];
let buscarMensagens;
let promessaUsuariosOnline;
let usuariosOnline = [];
let visibilidadeDaMensagem = "message";
let intervaloUsuariosOnline;

function pegarNome(){
    nomeUsuario = document.querySelector("aside input").value;
    nomeUsuarioObjeto = {
    name: nomeUsuario
    }

    promessaEnviada = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', nomeUsuarioObjeto);
    promessaEnviada.catch(checarErro);
    promessaEnviada.then(liberarPagina);
}
function checarErro(erro){
    if(erro.response.status === 400){
        alert("Esse nome já esta sendo utilizado, escolha outro por favor.")
    }
}
function liberarPagina(){
    document.querySelector("aside").classList.add("none");
    document.querySelector("body").classList.remove("overflow");
    verificacao = setInterval(manterOnline, 5000);
    buscarMensagens = setInterval(pegarMensagens, 3000);
}
function manterOnline(){
    verificarStatus = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', nomeUsuarioObjeto)
}
function pegarMensagens(){
    mensagens = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    mensagens.then(classificarMensagem);
}
function classificarMensagem(mensagem){
    mensagem1 = mensagem.data;
    document.querySelector('main').innerHTML = '';

    mensagem1.forEach((element) => {
        if(nomeUsuario === element.to || nomeUsuario === element.from || element.to === 'Todos'){
            document.querySelector('main').innerHTML += (`<article class="${element.type}">
            <p data-identifier="message"><em>${element.time}</em>  <strong>${element.from}</strong> para <strong>${element.to}</strong>:  ${element.text}</p>
            </article>`);
    
    
        const elementoQueQueroQueApareca = document.querySelector('body');
        // elementoQueQueroQueApareca.scrollIntoView({block: "end"});
        }
    }
)
} 
function enviarMensagem(){
    mensagemAEnviar = {
                from: nomeUsuario,
                to: nomeDestinatario,
                text: document.querySelector("footer input").value,
                type: visibilidadeDaMensagem
    };
    let mensagemEnviada = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', mensagemAEnviar);
    mensagemEnviada.then();
    mensagemEnviada.catch(recarregarPagina);
    document.querySelector("footer input").value = "";
}
function recarregarPagina(){
    window.location.reload();
}
function fecharBarraLateral(){
    document.querySelector(".fundo-escuro").removeAttribute("onclick");
    document.querySelector(".usuarios-online").classList.add("none");
    document.querySelector(".fundo-escuro").classList.add("none");

    clearInterval(intervaloUsuariosOnline);
}
function mostrarBarraLateral(){
    document.querySelector(".usuarios-online").classList.remove("none");
    document.querySelector(".fundo-escuro").classList.remove("none");
    document.querySelector(".fundo-escuro").setAttribute("onclick", "fecharBarraLateral();");
    intervaloUsuariosOnline = setInterval(pegarUsuariosOnline, 5000);
}
function pegarUsuariosOnline(){
    promessaUsuariosOnline = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');
    promessaUsuariosOnline.then(mostrarUsuariosOnline)
}
function mostrarUsuariosOnline(usuarios) {
    usuariosOnline = usuarios.data;
    document.querySelector('.usuarios').innerHTML = `
    <h2>Escolha um contato para enviar mensagem:</h2>
    <li onclick="selecionarUsuario(this)">
        <ion-icon name="people"></ion-icon>
        <p>Todos</p>
    </li>`;
    usuariosOnline.forEach((element) => {

        document.querySelector('.usuarios').innerHTML += `
            <li onclick="selecionarUsuario(this)">
                <ion-icon name="person-circle"></ion-icon>
                <p>${element.name}</p>
            </li>`;
    })
}
function selecionarUsuario(elemento){
    nomeDestinatario = elemento.querySelector("p").innerHTML;
}
function selecionarVisibilidade(elemento){
    const visivel = elemento.querySelector("p").innerHTML;
    if(visivel === "Reservadamente"){
        visibilidadeDaMensagem = 'private_message';
    }else{
        visibilidadeDaMensagem = 'message';
    }
}
window.addEventListener('keyup', event => {
    
    if (event.code === 'NumpadEnter' || event.code === 'Enter'){
        if(document.querySelector("footer input").value !== ''){
            enviarMensagem();
        }
    }
});