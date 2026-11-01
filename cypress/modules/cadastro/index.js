import {
  formularioDeInscricao,
  formularioDeDadosDaConta,
  paginaDaContaCriada,
  textosDeCadastro,
} from "./seletores";

export const validarFormularioDeInscricaoVisivel = () => {
  cy.get(formularioDeInscricao.campoNome).should("be.visible");
  cy.get(formularioDeInscricao.campoEmail).should("be.visible");
  cy.get(formularioDeInscricao.botaoInscrever).should("be.visible");
  cy.get(formularioDeInscricao.titulo)
    .should("have.length", 1)
    .and("be.visible")
    .and("have.text", textosDeCadastro.tituloDoFormularioDeInscricao);
};

export const iniciarCadastro = (nomeDoUsuario, email) => {
  cy.get(formularioDeInscricao.campoNome)
    .should("have.length", 1)
    .and("be.visible")
    .type(nomeDoUsuario);
  cy.get(formularioDeInscricao.campoEmail)
    .should("have.length", 1)
    .and("be.visible")
    .type(email);
  cy.get(formularioDeInscricao.botaoInscrever)
    .should("have.length", 1)
    .and("be.visible")
    .click();
};

export const preencherDadosDaConta = (dadosDaConta) => {
  cy.get(formularioDeDadosDaConta.radioTituloSr).click();
  cy.get(formularioDeDadosDaConta.campoSenha).type(dadosDaConta.senha);

  cy.get(formularioDeDadosDaConta.selectDiaDeNascimento).select(dadosDaConta.diaDeNascimento);
  cy.get(formularioDeDadosDaConta.selectMesDeNascimento).select(dadosDaConta.mesDeNascimento);
  cy.get(formularioDeDadosDaConta.selectAnoDeNascimento).select(dadosDaConta.anoDeNascimento);

  cy.get(formularioDeDadosDaConta.campoPrimeiroNome).type(dadosDaConta.primeiroNome);
  cy.get(formularioDeDadosDaConta.campoSobrenome).type(dadosDaConta.sobrenome);

  cy.get(formularioDeDadosDaConta.campoEndereco).type(dadosDaConta.endereco);
  cy.get(formularioDeDadosDaConta.selectPais).select(dadosDaConta.pais);
  cy.get(formularioDeDadosDaConta.campoEstado).type(dadosDaConta.estado);
  cy.get(formularioDeDadosDaConta.campoCidade).type(dadosDaConta.cidade);
  cy.get(formularioDeDadosDaConta.campoCep).type(dadosDaConta.cep);
  cy.get(formularioDeDadosDaConta.campoTelefone).type(dadosDaConta.telefone);

  cy.get(formularioDeDadosDaConta.botaoCriarConta).click();
};

export const validarContaCriada = () => {
  cy.get(paginaDaContaCriada.titulo)
    .should("have.length", 1)
    .and("be.visible")
    .and("have.text", textosDeCadastro.contaCriada);
};

export const continuarAposCriarConta = () => {
  cy.get(paginaDaContaCriada.botaoContinuar).should("have.length", 1).click();
};

export const validarEmailJaCadastrado = () => {
  cy.get(formularioDeInscricao.mensagemDeErro)
    .should("have.length", 1)
    .and("have.text", textosDeCadastro.emailJaCadastrado);
};
