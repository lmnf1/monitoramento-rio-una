let nivelAtual = 2.8;

let medicoes = [
    {
        horario: "08:00",
        nivel: 2.4
    },
    {
        horario: "10:00",
        nivel: 2.6
    },
    {
        horario: "12:00",
        nivel: 2.8
    }
];


const nivelElemento =
    document.getElementById("nivelAtual");

const situacaoElemento =
    document.getElementById("situacao");

const historicoElemento =
    document.getElementById("historico");

const linhaGrafico =
    document.getElementById("linhaGrafico");

const pontosGrafico =
    document.getElementById("pontosGrafico");

const horariosGrafico =
    document.getElementById("horariosGrafico");

const botaoAtualizar =
    document.getElementById("botaoAtualizar");

const botaoTema =
    document.getElementById("botaoTema");

const horarioAtualizacao =
    document.getElementById("horarioAtualizacao");

const tituloAviso =
    document.getElementById("tituloAviso");

const textoAviso =
    document.getElementById("textoAviso");


// ATUALIZA NÍVEL E SITUAÇÃO

function atualizarNivel() {

    nivelElemento.textContent =
        nivelAtual.toFixed(1).replace(".", ",") + " m";


    if (nivelAtual < 2.5) {

        situacaoElemento.textContent = "Normal";

        situacaoElemento.className =
            "situacao normal";

    } else if (nivelAtual < 3.0) {

        situacaoElemento.textContent = "Atenção";

        situacaoElemento.className =
            "situacao atencao";

    } else {

        situacaoElemento.textContent = "Alerta";

        situacaoElemento.className =
            "situacao alerta";
    }

    atualizarAviso();
}


// ATUALIZA AVISO

function atualizarAviso() {

    if (nivelAtual >= 3.0) {

        tituloAviso.textContent =
            "Nível de alerta";

        textoAviso.textContent =
            "O nível simulado atingiu ou ultrapassou 3,0 m.";

    } else if (nivelAtual >= 2.5) {

        tituloAviso.textContent =
            "Nível em elevação";

        textoAviso.textContent =
            "O nível registrado apresenta atenção no monitoramento.";

    } else {

        tituloAviso.textContent =
            "Nível normal";

        textoAviso.textContent =
            "O nível simulado está dentro da faixa considerada normal.";
    }
}


// ATUALIZA HISTÓRICO

function atualizarHistorico() {

    historicoElemento.innerHTML = "";

    medicoes.forEach(function(medicao) {

        const item =
            document.createElement("div");

        item.className =
            "medicao";

        item.innerHTML = `
            <span>${medicao.horario}</span>

            <strong>
                ${medicao.nivel
                    .toFixed(1)
                    .replace(".", ",")} m
            </strong>
        `;

        historicoElemento.appendChild(item);

    });
}


// ATUALIZA GRÁFICO

function atualizarGrafico() {

    const esquerda = 70;
    const direita = 770;

    const topo = 40;
    const base = 250;

    const nivelMinimo = 1.5;
    const nivelMaximo = 3.5;

    let pontos = [];


    medicoes.forEach(function(medicao, index) {

        let x;

        if (medicoes.length === 1) {

            x = esquerda;

        } else {

            x =
                esquerda +
                (
                    index *
                    (direita - esquerda) /
                    (medicoes.length - 1)
                );
        }


        const proporcao =
            (medicao.nivel - nivelMinimo) /
            (nivelMaximo - nivelMinimo);


        const y =
            base -
            proporcao *
            (base - topo);


        pontos.push({
            x: x,
            y: y,
            horario: medicao.horario
        });

    });


    linhaGrafico.setAttribute(
        "points",

        pontos.map(function(ponto) {

            return `${ponto.x},${ponto.y}`;

        }).join(" ")
    );


    pontosGrafico.innerHTML = "";

    pontos.forEach(function(ponto) {

        const circulo =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );

        circulo.setAttribute(
            "cx",
            ponto.x
        );

        circulo.setAttribute(
            "cy",
            ponto.y
        );

        circulo.setAttribute(
            "r",
            "6"
        );

        circulo.setAttribute(
            "class",
            "ponto-grafico"
        );

        pontosGrafico.appendChild(circulo);

    });


    horariosGrafico.innerHTML = "";

    pontos.forEach(function(ponto) {

        const texto =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );

        texto.setAttribute(
            "x",
            ponto.x
        );

        texto.setAttribute(
            "y",
            "285"
        );

        texto.setAttribute(
            "text-anchor",
            "middle"
        );

        texto.setAttribute(
            "class",
            "texto-horario"
        );

        texto.textContent =
            ponto.horario;

        horariosGrafico.appendChild(texto);

    });
}


// ADICIONAR NOVA MEDIÇÃO

function adicionarMedicao() {

    nivelAtual =
        Number(
            (nivelAtual + 0.1).toFixed(1)
        );


    if (nivelAtual > 3.5) {
        nivelAtual = 2.0;
    }


    const agora =
        new Date();


    const horas =
        String(
            agora.getHours()
        ).padStart(2, "0");


    const minutos =
        String(
            agora.getMinutes()
        ).padStart(2, "0");


    const horario =
        `${horas}:${minutos}`;


    medicoes.push({

        horario: horario,

        nivel: nivelAtual

    });


    if (medicoes.length > 6) {
        medicoes.shift();
    }


    atualizarNivel();

    atualizarHistorico();

    atualizarGrafico();


    horarioAtualizacao.textContent =
        horario;
}


// BOTÃO ATUALIZAR

botaoAtualizar.addEventListener(
    "click",
    adicionarMedicao
);


// MODO ESCURO

botaoTema.addEventListener(
    "click",
    function() {

        document.body.classList.toggle("dark");


        if (
            document.body.classList.contains("dark")
        ) {

            botaoTema.textContent =
                "Modo claro";

        } else {

            botaoTema.textContent =
                "Modo escuro";
        }

    }
);


// INICIA O SISTEMA

atualizarNivel();

atualizarHistorico();

atualizarGrafico();