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
    verificacao = setInterval(manterOnline, 5000);
}
function manterOnline(){
    verificarStatus = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', nomeUsuarioObjeto)
}
let buscarMensagens = setInterval(pegarMensagens, 3000);
function pegarMensagens(){
    mensagens = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    mensagens.then(classificarMensagem);
}
function classificarMensagem(mensagem){
    mensagem1 = mensagem.data;
    let caixaMensagem = document.querySelector('main')
    for(let i=0;i<99;i++){
    if(mensagem1[i].type === 'status'){
        caixaMensagem.innerHTML = `<article class="entrou-na-sala">
        <p><em>${mensagem1[i].time}</em>  <strong>${mensagem1[i].from}</strong> para <strong>${mensagem1[i].to}</strong>:  ${mensagem1[i].text}</p>
        </article>`;
    }else if(mensagem1[i].type === 'message'){
        caixaMensagem.innerHTML = `<article class="mensagem">
        <p><em>${mensagem1[i].time}</em>  <strong>${mensagem1[i].from}</strong> para <strong>${mensagem1[i].to}</strong>:  ${mensagem1[i].text}</p>
        </article>`;
    }else if(mensagem1[i].type === 'private_message'){
        caixaMensagem.innerHTML = `<article class="mensagem-reservada">
        <p><em>${mensagem1[i].time}</em>  <strong>${mensagem1[i].from}</strong> para <strong>${mensagem1[i].to}</strong>:  ${mensagem1[i].text}</p>
        </article>`;
    }
}
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
    document.querySelector("footer input").innerHTML = "";
}