let nomeUsuario;
let promessaEnviada;
let verificacao;
function pegarNome(){
    nomeUsuario = document.querySelector("aside input").value;
    let nomeUsuarioObjeto = {
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
function pegarMensagens(){
    mensagens = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
}
let buscarMensagens = setInterval(pegarMensagens, 3000);