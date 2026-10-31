import { formularioDeLogin, textosDeLogin } from "./seletores";

export const validarFormularioDeLoginVisivel = () => {
  cy.contains("h2", textosDeLogin.tituloDoFormulario).should("be.visible");
};

export const entrarComCredenciais = (email, senha) => {
  cy.get(formularioDeLogin.campoEmail).type(email);
  cy.get(formularioDeLogin.campoSenha).type(senha);
  cy.get(formularioDeLogin.botaoEntrar).click();
};

export const validarErroDeCredenciaisInvalidas = () => {
  cy.contains("p", textosDeLogin.erroDeCredenciaisInvalidas).should(
    "have.text",
    textosDeLogin.erroDeCredenciaisInvalidas
  );
};
