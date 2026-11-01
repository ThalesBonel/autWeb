import { formularioDeLogin, textosDeLogin } from "./seletores";

export const validarFormularioDeLoginVisivel = () => {
  cy.get(formularioDeLogin.campoEmail).should("be.visible");
  cy.get(formularioDeLogin.campoSenha).should("be.visible");
  cy.get(formularioDeLogin.botaoEntrar).should("be.visible");
  cy.get(formularioDeLogin.titulo)
    .should("have.length", 1)
    .and("be.visible")
    .and("have.text", textosDeLogin.tituloDoFormulario);
};

export const entrarComCredenciais = (email, senha) => {
  cy.get(formularioDeLogin.campoEmail).should("have.length", 1).and("be.visible").type(email);
  cy.get(formularioDeLogin.campoSenha).should("have.length", 1).and("be.visible").type(senha);
  cy.get(formularioDeLogin.botaoEntrar).should("have.length", 1).and("be.visible").click();
};

export const validarErroDeCredenciaisInvalidas = () => {
  cy.get(formularioDeLogin.mensagemDeErro)
    .should("have.length", 1)
    .and("have.text", textosDeLogin.erroDeCredenciaisInvalidas);
};
