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

    mensagem1.forEach(mostrarMensagem);
}
function mostrarMensagem(mensagem){
    caixaMensagem = document.querySelector('main')
    caixaMensagem.innerHTML = `<article class="${mensagem.type}">
    <p><em>${mensagem.time}</em>  <strong>${mensagem.from}</strong> para <strong>${mensagem.to}</strong>:  ${mensagem.text}</p>
    </article>`;

    const elementoQueQueroQueApareca = document.querySelector('p');
    elementoQueQueroQueApareca.scrollIntoView();
}   
function enviarMensagem(){
    mensagemAEnviar = {
                from: nomeUsuario,
                to: nomeDestinatario,
                text: document.querySelector("footer input").value,
                type: "message"
    };
    let mensagemEnviada = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', mensagemAEnviar);
    mensagemEnviada.then(apagarInput)
}
function apagarInput(){
    document.querySelector("footer input").value = "";
}