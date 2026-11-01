import { cabecalho } from "../common/seletores";
import { paginaDeProdutos } from "../produtos/seletores";
import {
  paginaDoCarrinho,
  paginaDeCheckout,
  paginaDePagamento,
  paginaDePedidoConfirmado,
  textosDoCheckout,
} from "./seletores";

export const adicionarProdutoAoCarrinho = (idDoProduto) => {
  cy.get(paginaDeProdutos.botaoAdicionarAoCarrinho)
    .filter(`[data-product-id="${idDoProduto}"]`)
    .should("have.length", 1)
    .and("be.visible")
    .click();
  cy.get("#cartModal").should("be.visible");
};

export const continuarComprandoAposAdicionar = () => {
  cy.get("#cartModal")
    .should("be.visible")
    .find("button.close-modal")
    .should("have.length", 1)
    .click();
  cy.get("#cartModal").should("not.be.visible");
};

export const abrirCarrinho = () => {
  cy.get(cabecalho.linkCarrinho).should("have.length", 1).click();
};

export const validarCarrinhoComProduto = (idDoProduto) => {
  cy.url().should("include", "/view_cart");
  cy.get(paginaDoCarrinho.tabelaDoCarrinho).should("be.visible");
  cy.get(`#product-${idDoProduto}`).should("have.length", 1).and("be.visible");
  cy.get(`#product-${idDoProduto}`)
    .find(paginaDoCarrinho.nomeDoProduto)
    .should("have.length", 1)
    .and("be.visible");
};

export const esvaziarCarrinho = () => {
  cy.get("body").then(($body) => {
    const idsDasLinhas = $body
      .find(paginaDoCarrinho.linhaDoProduto)
      .toArray()
      .map((linha) => linha.id);

    idsDasLinhas.forEach((idDaLinha) => {
      const idDoProduto = idDaLinha.match(/^product-(\d+)$/)?.[1];
      expect(idDoProduto, `id da linha "${idDaLinha}"`).to.not.be.undefined;
      cy.get(paginaDoCarrinho.botaoRemoverDoProduto(idDoProduto))
        .should("have.length", 1)
        .click();
    });
  });

  cy.get("body").should(($body) => {
    expect($body.find(paginaDoCarrinho.linhaDoProduto), "linhas restantes no carrinho")
      .to.have.length(0);
  });
};

export const irParaOCheckout = () => {
  cy.contains(paginaDoCarrinho.botaoIrParaCheckout, "Proceed To Checkout")
    .should("have.length", 1)
    .and("be.visible")
    .click();
};

export const validarEnderecoERevisaoDoPedido = () => {
  cy.url().should("include", "/checkout");

  cy.contains(paginaDeCheckout.tituloDoEndereco, textosDoCheckout.tituloDoEnderecoDeEntrega)
    .should("have.length", 1)
    .and("be.visible");
  cy.contains(paginaDeCheckout.tituloDoEndereco, textosDoCheckout.tituloDoEnderecoDeCobranca)
    .should("have.length", 1)
    .and("be.visible");

  cy.get(paginaDeCheckout.enderecoDeEntrega).should("be.visible");
  cy.get(paginaDeCheckout.enderecoDeCobranca).should("be.visible");

  cy.contains(textosDoCheckout.tituloDaRevisaoDoPedido)
    .should("be.visible");
  cy.get(paginaDeCheckout.tabelaDoPedido).should("be.visible");
};

export const informarComentarioDoPedido = (comentario) => {
  cy.get(paginaDeCheckout.campoDeComentario).should("be.visible").type(comentario);
};

export const irParaOPagamento = () => {
  cy.contains(paginaDeCheckout.botaoFazerPedido, "Place Order")
    .should("have.length", 1)
    .and("be.visible")
    .click();
  cy.url().should("include", "/payment");
};

export const preencherDadosDePagamento = (dadosDoCartao) => {
  cy.get(paginaDePagamento.campoNomeNoCartao)
    .should("have.length", 1)
    .and("be.visible")
    .type(dadosDoCartao.nomeNoCartao);
  cy.get(paginaDePagamento.campoNumeroDoCartao)
    .should("have.length", 1)
    .and("be.visible")
    .type(dadosDoCartao.numeroDoCartao);
  cy.get(paginaDePagamento.campoCvc)
    .should("have.length", 1)
    .and("be.visible")
    .type(dadosDoCartao.cvc);
  cy.get(paginaDePagamento.campoMesDeExpiracao)
    .should("have.length", 1)
    .and("be.visible")
    .type(dadosDoCartao.mesDeExpiracao);
  cy.get(paginaDePagamento.campoAnoDeExpiracao)
    .should("have.length", 1)
    .and("be.visible")
    .type(dadosDoCartao.anoDeExpiracao);
};

export const pagarEConfirmarPedido = () => {
  cy.get(paginaDePagamento.botaoPagarEConfirmar)
    .should("have.length", 1)
    .and("be.visible")
    .click();
};

export const validarPedidoConfirmado = () => {
  cy.url().should("include", "/payment_done");

  cy.get(paginaDePedidoConfirmado.tituloDoPedido)
    .should("have.length", 1)
    .and("be.visible")
    .and("have.text", textosDoCheckout.pedidoConfirmado);

  cy.contains(textosDoCheckout.confirmacaoDoPedido)
    .should("have.length", 1)
    .and("be.visible");
};
