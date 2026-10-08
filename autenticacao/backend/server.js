const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = 3000;

// Em uma aplicação real, essa chave deve ficar em uma variável
// de ambiente e não diretamente no código.
const SECRET_KEY = "chave-secreta-do-projeto";

// Middlewares
app.use(cors());
app.use(express.json());

// Usuário fictício para demonstração
const usuario = {
    id: 1,
    nome: "João da Silva",
    email: "joao@email.com",
    senha: "123456"
};

// Rota inicial
app.get("/", (req, res) => {
    res.json({
        mensagem: "API de autenticação funcionando!"
    });
});

// LOGIN
app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    // Verifica se os dados foram enviados
    if (!email || !senha) {
        return res.status(400).json({
            mensagem: "E-mail e senha são obrigatórios."
        });
    }

    // Verifica usuário e senha
    if (email !== usuario.email || senha !== usuario.senha) {
        return res.status(401).json({
            mensagem: "E-mail ou senha incorretos."
        });
    }

    // Cria o token
    const token = jwt.sign(
        {
            id: usuario.id,
            email: usuario.email
        },
        SECRET_KEY,
        {
            expiresIn: "1h"
        }
    );

    res.json({
        mensagem: "Login realizado com sucesso!",
        token: token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }
    });
});

// Middleware para verificar autenticação
function autenticarToken(req, res, next) {

    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            mensagem: "Token não informado."
        });
    }

    const partes = authorization.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
        return res.status(401).json({
            mensagem: "Formato do token inválido."
        });
    }

    const token = partes[1];

    try {

        const usuarioAutenticado = jwt.verify(
            token,
            SECRET_KEY
        );

        req.usuario = usuarioAutenticado;

        next();

    } catch (erro) {

        return res.status(403).json({
            mensagem: "Token inválido ou expirado."
        });
    }
}

// ROTA PROTEGIDA
app.get("/perfil", autenticarToken, (req, res) => {

    res.json({
        mensagem: "Você acessou uma área protegida!",
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});