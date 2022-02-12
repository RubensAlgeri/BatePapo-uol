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
// function mostrarMensagem(mensagem){
//     if(nomeUsuario === mensagem.to || nomeUsuario === mensagem.from || mensagem.to === 'Todos'){
//         document.querySelector('main').add(`<article class="${mensagem.type}">
//         <p data-identifier="message"><em>${mensagem.time}</em>  <strong>${mensagem.from}</strong> para <strong>${mensagem.to}</strong>:  ${mensagem.text}</p>
//         </article>`);


//     const elementoQueQueroQueApareca = document.querySelector('p');
//     elementoQueQueroQueApareca.scrollIntoView();
//     }
// }   
function enviarMensagem(){
    mensagemAEnviar = {
                from: nomeUsuario,
                to: nomeDestinatario,
                text: document.querySelector("footer input").value,
                type: "message"
    };
    let mensagemEnviada = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', mensagemAEnviar);
    mensagemEnviada.then(classificarMensagem);
    mensagemEnviada.catch(recarregarPagina);
    document.querySelector("footer input").value = "";
}
function recarregarPagina(){
    window.location.reload();
}
window.addEventListener('keyup', event => {
    
    if (event.code === 'NumpadEnter' || event.code === 'Enter'){
        if(document.querySelector("footer input").value !== ''){
            enviarMensagem();
        }
    }
});