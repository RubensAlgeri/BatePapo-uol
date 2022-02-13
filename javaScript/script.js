let nomeUsuario;
let nomeUsuarioObjeto;
let nomeDestinatario = "Todos";
let mensagemArray = [];
let buscarMensagens;
let usuariosOnline = [];
let visibilidadeDaMensagem = "message";
let intervaloUsuariosOnline;
let checarVisibilidade;
let focarMensagemNoChat;

function conferirNomeUsuario() {
    nomeUsuario = document.querySelector("aside input").value;
    nomeUsuarioObjeto = {
        name: nomeUsuario
    }

    let promessaEnviada = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', nomeUsuarioObjeto);
    promessaEnviada.catch(checarErro);
    promessaEnviada.then(liberarAcesso);
}
function checarErro(erro) {
    if (erro.response.status === 400) {
        alert("Esse nome já esta sendo utilizado, escolha outro por favor.")
    }
}
function liberarAcesso() {
    pegarUsuariosOnline();
    document.querySelector("aside").classList.add("none");
    document.querySelector("body").classList.remove("overflow");
    setInterval(manterOnline, 5000);
    intervaloUsuariosOnline = setInterval(pegarUsuariosOnline, 10000);
    buscarMensagens = setInterval(pegarMensagensDoServidor, 3000);
}
function manterOnline() {
    axios.post('https://mock-api.driven.com.br/api/v4/uol/status', nomeUsuarioObjeto)
}
function pegarMensagensDoServidor() {
    let promessaMensagens = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promessaMensagens.then(imprimirMensagensNaTela);
}
function imprimirMensagensNaTela(mensagem) {
    mensagemArray = mensagem.data;
    document.querySelector('main').innerHTML = '';

    mensagemArray.forEach((element) => {
        if (nomeUsuario === element.to || nomeUsuario === element.from || element.to === 'Todos') {
            document.querySelector('main').innerHTML += (`<article class="${element.type}">
            <p data-identifier="message"><em>${element.time}</em>  <strong>${element.from}</strong> para <strong>${element.to}</strong>:  ${element.text}</p>
            </article>`);

            focarMensagemNoChat = document.querySelector('main').lastChild;
            focarMensagemNoChat.scrollIntoView();
        }

    }
    )

}
function enviarMensagemParaServidor() {
    let mensagemAEnviar = {
        from: nomeUsuario,
        to: nomeDestinatario,
        text: document.querySelector("footer input").value,
        type: visibilidadeDaMensagem
    };
    let promessaMensagemEnviada = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', mensagemAEnviar);
    promessaMensagemEnviada.then();
    promessaMensagemEnviada.catch(recarregarPaginaAoDesconectar);
    document.querySelector("footer input").value = "";
}
function recarregarPaginaAoDesconectar() {
    window.location.reload();
}
function fecharBarraLateral() {
    document.querySelector(".fundo-escuro").removeAttribute("onclick");
    document.querySelector(".usuarios-online").classList.add("none");
    document.querySelector(".fundo-escuro").classList.add("none");
}
function mostrarBarraLateral() {
    document.querySelector(".usuarios-online").classList.remove("none");
    document.querySelector(".fundo-escuro").classList.remove("none");
    document.querySelector(".fundo-escuro").setAttribute("onclick", "fecharBarraLateral();");
}
function pegarUsuariosOnline() {
    let promessaUsuariosOnline = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');
    promessaUsuariosOnline.then(mostrarUsuariosOnline)
}
function mostrarUsuariosOnline(usuarios) {
    usuariosOnline = usuarios.data;
    document.querySelector('.usuarios').innerHTML = `
    <li data-identifier="participant" onclick="selecionarDestinatario(this)">
        <ion-icon name="people"></ion-icon>
        <p>Todos</p>
        <ion-icon class="none icone" name="checkmark-outline"></ion-icon>
    </li>`;
    usuariosOnline.forEach((element) => {

        document.querySelector('.usuarios').innerHTML += `
            <li data-identifier="participant" onclick="selecionarDestinatario(this)">
                <ion-icon name="person-circle"></ion-icon>
                <p>${element.name}</p>
                <ion-icon class="none icone" name="checkmark-outline"></ion-icon>
            </li>`;
    })
}
function selecionarDestinatario(elemento) {
    deselecionar(elemento.parentNode);
    elemento.querySelector(".icone").classList.remove("none");
    nomeDestinatario = elemento.querySelector("p").innerHTML;
    if (checarVisibilidade === "Reservadamente") {
        atualizarReservada();
    }
}
function deselecionar(elemento) {
    const selec = elemento.querySelector(`.icone:not(.none)`);
    if (selec !== null) {
        selec.classList.add("none");
    }
}
function selecionarVisibilidade(elemento) {
    deselecionar(elemento.parentNode);
    elemento.querySelector(".icone").classList.remove("none");

    checarVisibilidade = elemento.querySelector("p").innerHTML;
    if (checarVisibilidade === "Reservadamente") {
        visibilidadeDaMensagem = 'private_message';
        document.querySelector(".msg").innerText =
            `Enviando para ${nomeDestinatario} (reservadamente)`;
    } else {
        visibilidadeDaMensagem = 'message';
        document.querySelector(".msg").innerText = '';
    }
}
function atualizarReservada() {
    document.querySelector(".msg").innerText =
        `Enviando para ${nomeDestinatario} (reservadamente)`;
}


// CODIGO PARA ENVIAR MENSAGEM COM A TECLA ENTER
window.addEventListener('keyup', event => {

    if (event.code === 'NumpadEnter' || event.code === 'Enter') {
        if (document.querySelector(".enviar-msg").value !== '') {
            enviarMensagemParaServidor();
        }else if (document.querySelector(".tela-login input").value !== ''){
            conferirNomeUsuario();
        }
    }
});