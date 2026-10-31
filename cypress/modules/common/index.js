import { cabecalho, textosDaConta } from "./seletores";

export const abrirPaginaDeProdutos = () => {
  cy.get(cabecalho.linkProdutos).click();
};

export const abrirFormulariosDeAcesso = () => {
  cy.get(cabecalho.linkAcessoAConta).click();
};

export const validarUsuarioLogadoComo = (nomeDoUsuario) => {
  cy.contains("a", textosDaConta.indicadorUsuarioLogado)
    .find("b")
    .should("have.text", nomeDoUsuario);
};

export const sairDaConta = () => {
  cy.contains("a", textosDaConta.linkSair).click();
};

export const validarUrlDeLogin = () => {
  cy.url().should("eq", `${Cypress.config("baseUrl")}/login`);
};

export const deletarConta = () => {
  cy.contains("a", textosDaConta.linkDeletarConta).click();
};

export const validarContaDeletada = () => {
  cy.get("b").contains(textosDaConta.contaDeletada).should("be.visible");
};
