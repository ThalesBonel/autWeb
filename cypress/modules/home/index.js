import { paginaInicial, textosDaHome } from "./seletores";

export const validarHomeCarregada = () => {
  cy.location("pathname").should("eq", "/");

  cy.get(paginaInicial.cabecalho).should("be.visible");
  cy.get(paginaInicial.logo).should("be.visible");

  cy.get(paginaInicial.carrossel).should("be.visible");
  cy.get(paginaInicial.tituloDoCarrossel)
    .first()
    .should("be.visible")
    .invoke("text")
    .then((texto) => {
      expect(texto.trim()).to.match(textosDaHome.nomeDoSite);
    });

  cy.get(paginaInicial.rodape).should("exist");
};

export const irParaORodape = () => {
  cy.get(paginaInicial.rodape).scrollIntoView();
};

export const validarRodapeComInscricao = () => {
  cy.get(paginaInicial.rodape).should("be.visible");
  cy.contains(paginaInicial.tituloDaInscricao, textosDaHome.tituloDaInscricao).should(
    "be.visible"
  );
};

export const inscreverEmail = (email) => {
  cy.get(paginaInicial.campoDeEmailDaInscricao).should("be.visible").type(email);
  cy.get(paginaInicial.botaoDeInscricao).click();
};

export const validarInscricaoConfirmada = () => {
  cy.get(paginaInicial.mensagemDeInscricao)
    .should("not.have.class", "hide")
    .and("be.visible")
    .and("contain", textosDaHome.inscricaoConfirmada);
};
