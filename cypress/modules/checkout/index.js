import {
  paginaDoCarrinho,
  paginaDeCheckout,
  paginaDePagamento,
  paginaDePedidoConfirmado,
  textosDoCheckout,
} from "./seletores";

export const adicionarProdutoAoCarrinho = (idDoProduto) => {
  cy.get(`.productinfo .add-to-cart[data-product-id="${idDoProduto}"]`).click();
  cy.get("#cartModal").should("be.visible");
};

export const continuarComprandoAposAdicionar = () => {
  cy.get("#cartModal button.close-modal").click();
  cy.get("#cartModal").should("not.be.visible");
};

export const abrirCarrinho = () => {
  cy.get('.shop-menu a[href="/view_cart"]').first().click();
};

export const validarCarrinhoComProduto = (idDoProduto) => {
  cy.url().should("include", "/view_cart");
  cy.get(paginaDoCarrinho.tabelaDoCarrinho).should("be.visible");
  cy.get(`#product-${idDoProduto}`).should("be.visible");
  cy.get(`#product-${idDoProduto}`).find(paginaDoCarrinho.nomeDoProduto).should("not.be.empty");
};

export const esvaziarCarrinho = () => {
  cy.get("body").then(($body) => {
    if ($body.find(paginaDoCarrinho.removerDoCarrinho).length > 0) {
      cy.get(paginaDoCarrinho.removerDoCarrinho).first().click();
      cy.get(paginaDoCarrinho.linhaDoProduto).should("have.length", 0);
    }
  });
};

export const irParaOCheckout = () => {
  cy.contains(paginaDoCarrinho.botaoIrParaCheckout, "Proceed To Checkout").click();
};

export const validarEnderecoERevisaoDoPedido = () => {
  cy.url().should("include", "/checkout");

  cy.contains(paginaDeCheckout.tituloDoEndereco, textosDoCheckout.tituloDoEnderecoDeEntrega)
    .should("be.visible");
  cy.contains(paginaDeCheckout.tituloDoEndereco, textosDoCheckout.tituloDoEnderecoDeCobranca)
    .should("be.visible");

  cy.get(paginaDeCheckout.enderecoDeEntrega).should("be.visible");
  cy.get(paginaDeCheckout.enderecoDeCobranca).should("be.visible");

  cy.contains(textosDoCheckout.tituloDaRevisaoDoPedido).should("be.visible");
  cy.get(paginaDeCheckout.tabelaDoPedido).should("be.visible");
};

export const informarComentarioDoPedido = (comentario) => {
  cy.get(paginaDeCheckout.campoDeComentario).should("be.visible").type(comentario);
};

export const irParaOPagamento = () => {
  cy.contains(paginaDeCheckout.botaoFazerPedido, "Place Order").click();
  cy.url().should("include", "/payment");
};

export const preencherDadosDePagamento = (dadosDoCartao) => {
  cy.get(paginaDePagamento.campoNomeNoCartao).type(dadosDoCartao.nomeNoCartao);
  cy.get(paginaDePagamento.campoNumeroDoCartao).type(dadosDoCartao.numeroDoCartao);
  cy.get(paginaDePagamento.campoCvc).type(dadosDoCartao.cvc);
  cy.get(paginaDePagamento.campoMesDeExpiracao).type(dadosDoCartao.mesDeExpiracao);
  cy.get(paginaDePagamento.campoAnoDeExpiracao).type(dadosDoCartao.anoDeExpiracao);
};

export const pagarEConfirmarPedido = () => {
  cy.get(paginaDePagamento.botaoPagarEConfirmar).click();
};

export const validarPedidoConfirmado = () => {
  cy.url().should("include", "/payment_done");

  cy.get(paginaDePedidoConfirmado.tituloDoPedido)
    .should("be.visible")
    .and("contain", textosDoCheckout.pedidoConfirmado);

  cy.contains(textosDoCheckout.confirmacaoDoPedido).should("be.visible");
};
