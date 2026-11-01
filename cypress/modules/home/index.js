import { paginaInicial, textosDaHome } from "./seletores";

export const validarHomeCarregada = () => {
  cy.location("pathname").should("eq", "/");

  cy.get(paginaInicial.cabecalho).should("have.length", 1).and("be.visible");
  cy.get(paginaInicial.logo).should("have.length", 1).and("be.visible");

  cy.get(paginaInicial.carrossel).should("have.length", 1).and("be.visible");
  cy.get(paginaInicial.tituloDoCarrossel)
    .should("have.length", 1)
    .and("be.visible")
    .invoke("text")
    .then((texto) => {
      expect(texto.trim()).to.match(textosDaHome.nomeDoSite);
    });

  cy.get(paginaInicial.rodape).should("have.length", 1).and("exist");
};

export const irParaORodape = () => {
  cy.get(paginaInicial.rodape).scrollIntoView();
};

export const validarRodapeComInscricao = () => {
  cy.get(paginaInicial.rodape).should("be.visible");
  cy.get(paginaInicial.tituloDaInscricao)
    .should("have.length", 1)
    .and("be.visible")
    .and("have.text", textosDaHome.tituloDaInscricao);
};

export const inscreverEmail = (email) => {
  cy.get(paginaInicial.campoDeEmailDaInscricao)
    .should("have.length", 1)
    .and("be.visible")
    .type(email);
  cy.get(paginaInicial.botaoDeInscricao)
    .should("have.length", 1)
    .and("be.visible")
    .click();
};

export const validarInscricaoConfirmada = () => {
  cy.get(paginaInicial.mensagemDeInscricao)
    .should("have.length", 1)
    .and("not.have.class", "hide")
    .and("be.visible")
    .invoke("text")
    .then((texto) => {
      expect(texto.trim()).to.equal(textosDaHome.inscricaoConfirmada);
    });
};
