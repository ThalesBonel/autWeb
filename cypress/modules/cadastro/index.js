import {
  formularioDeInscricao,
  formularioDeDadosDaConta,
  textosDeCadastro,
} from "./seletores";

export const validarFormularioDeInscricaoVisivel = () => {
  cy.contains("h2", textosDeCadastro.tituloDoFormularioDeInscricao).should("be.visible");
};

export const iniciarCadastro = (nomeDoUsuario, email) => {
  cy.get(formularioDeInscricao.campoNome).type(nomeDoUsuario);
  cy.get(formularioDeInscricao.campoEmail).type(email);
  cy.get(formularioDeInscricao.botaoInscrever).click();
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
  cy.get("b").contains(textosDeCadastro.contaCriada).should("be.visible");
};

export const continuarAposCriarConta = () => {
  cy.get(formularioDeDadosDaConta.botaoContinuar).click();
};

export const validarEmailJaCadastrado = () => {
  cy.get(formularioDeInscricao.mensagemDeErro).should(
    "have.text",
    textosDeCadastro.emailJaCadastrado
  );
};
