export const paginaDoCarrinho = {
  tabelaDoCarrinho: "#cart_info_table",
  linhaDoProduto: "#cart_info_table tbody tr",
  nomeDoProduto: ".cart_description h4 a",
  precoDoProduto: ".cart_price p",
  quantidade: ".cart_quantity button",
  totalDoProduto: ".cart_total_price",
  removerDoCarrinho: ".cart_quantity_delete",
  botaoIrParaCheckout: "a.check_out",
};

export const paginaDeCheckout = {
  enderecoDeEntrega: "#address_delivery",
  enderecoDeCobranca: "#address_invoice",
  tituloDoEndereco: ".address_title",
  tabelaDoPedido: "#cart_info",
  campoDeComentario: "#ordermsg textarea",
  botaoFazerPedido: "a.check_out",
};

export const paginaDePagamento = {
  campoNomeNoCartao: '[data-qa="name-on-card"]',
  campoNumeroDoCartao: '[data-qa="card-number"]',
  campoCvc: '[data-qa="cvc"]',
  campoMesDeExpiracao: '[data-qa="expiry-month"]',
  campoAnoDeExpiracao: '[data-qa="expiry-year"]',
  botaoPagarEConfirmar: '[data-qa="pay-button"]',
};

export const paginaDePedidoConfirmado = {
  tituloDoPedido: '[data-qa="order-placed"]',
  botaoContinuar: '[data-qa="continue-button"]',
};

export const textosDoCheckout = {
  tituloDoEnderecoDeEntrega: "Your delivery address",
  tituloDoEnderecoDeCobranca: "Your billing address",
  tituloDaRevisaoDoPedido: "Review Your Order",
  pedidoConfirmado: "Order Placed!",
  confirmacaoDoPedido: "Congratulations! Your order has been confirmed!",
};
