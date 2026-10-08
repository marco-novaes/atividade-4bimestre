const API_URL = "http://localhost:3000";

// Elementos da página
const loginForm = document.getElementById("loginForm");

const telaLogin = document.getElementById("telaLogin");

const telaUsuario = document.getElementById("telaUsuario");

const mensagemLogin =
    document.getElementById("mensagemLogin");

const mensagemUsuario =
    document.getElementById("mensagemUsuario");

const nomeUsuario =
    document.getElementById("nomeUsuario");

const emailUsuario =
    document.getElementById("emailUsuario");

const btnLogout =
    document.getElementById("btnLogout");

const btnPerfil =
    document.getElementById("btnPerfil");


// Verifica se já existe um token
window.addEventListener("load", () => {

    const token = localStorage.getItem("token");

    if (token) {

        carregarPerfil();

    }

});


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    mensagemLogin.textContent = "Entrando...";
    mensagemLogin.style.color = "#2563eb";

    try {

        const resposta = await fetch(
            `${API_URL}/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Erro ao realizar login."
            );

        }

        // Salva o token
        localStorage.setItem(
            "token",
            dados.token
        );

        mensagemLogin.textContent =
            "Login realizado com sucesso!";

        mensagemLogin.style.color = "green";

        // Mostra área protegida
        mostrarTelaUsuario(dados.usuario);

    } catch (erro) {

        mensagemLogin.textContent =
            erro.message;

        mensagemLogin.style.color = "red";

    }

});


// ==========================================
// CARREGAR PERFIL
// ==========================================

async function carregarPerfil() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        return;

    }

    try {

        const resposta = await fetch(
            `${API_URL}/perfil`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Sessão inválida."
            );

        }

        mostrarTelaUsuario(
            dados.usuario
        );

    } catch (erro) {

        console.error(erro);

        // Token inválido ou expirado
        localStorage.removeItem("token");

        mostrarTelaLogin();

    }

}


// ==========================================
// MOSTRAR USUÁRIO
// ==========================================

function mostrarTelaUsuario(usuario) {

    telaLogin.style.display = "none";

    telaUsuario.style.display = "block";

    nomeUsuario.textContent =
        usuario.nome;

    emailUsuario.textContent =
        usuario.email;

    mensagemUsuario.textContent =
        "Login realizado com sucesso!";
}


// ==========================================
// MOSTRAR LOGIN
// ==========================================

function mostrarTelaLogin() {

    telaLogin.style.display = "block";

    telaUsuario.style.display = "none";

}


// ==========================================
// LOGOUT
// ==========================================

btnLogout.addEventListener("click", () => {

    localStorage.removeItem("token");

    mostrarTelaLogin();

    loginForm.reset();

    mensagemLogin.textContent =
        "Você saiu da sua conta.";

    mensagemLogin.style.color = "#334155";

});


// ==========================================
// ACESSAR PERFIL
// ==========================================

btnPerfil.addEventListener("click", () => {

    carregarPerfil();

});