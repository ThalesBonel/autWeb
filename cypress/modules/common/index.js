import { cabecalho, paginaDaContaDeletada, textosDaConta } from "./seletores";

export const abrirPaginaDeProdutos = () => {
  cy.get(cabecalho.linkProdutos).should("have.length", 1).click();
};

export const abrirFormulariosDeAcesso = () => {
  cy.get(cabecalho.linkAcessoAConta).should("have.length", 1).click();
};

export const validarUsuarioLogadoComo = (nomeDoUsuario) => {
  cy.get(cabecalho.menu)
    .contains("a", textosDaConta.indicadorUsuarioLogado)
    .should("have.length", 1)
    .find("b")
    .should("have.text", nomeDoUsuario);
};

export const sairDaConta = () => {
  cy.get(cabecalho.linkSair).should("have.length", 1).click();
};

export const validarUrlDeLogin = () => {
  cy.url().should("eq", `${Cypress.config("baseUrl")}/login`);
};

export const deletarConta = () => {
  cy.get(cabecalho.linkDeletarConta).should("have.length", 1).click();
};

export const validarContaDeletada = () => {
  cy.get(paginaDaContaDeletada.titulo)
    .should("have.length", 1)
    .and("be.visible")
    .and("have.text", "Account Deleted!");
};
