export const paginaDeProdutos = {
  tituloDaPagina: ".features_items > h2",
  cardDoProduto: ".features_items .single-products",
  agrupadorDoCard: ".product-image-wrapper",
  blocoDeInformacaoDoProduto: ".productinfo",
  nomeDoProduto: ".productinfo p",
  precoDoProduto: ".productinfo h2",
  botaoAdicionarAoCarrinho: ".productinfo .add-to-cart[data-product-id]",
  linkVerProduto: '.choose a[href^="/product_details/"]',
  campoDeBusca: "#search_product",
  botaoDeBusca: "#submit_search",
};

export const paginaDeDetalhesDoProduto = {
  nome: ".product-information h2",
  preco: ".product-information > span > span",
  campos: ".product-information p",
};

export const camposObrigatoriosDoDetalhe = [
  { prefixo: "Category:", nome: "categoria" },
  { prefixo: "Availability:", nome: "disponibilidade" },
  { prefixo: "Condition:", nome: "condição" },
  { prefixo: "Brand:", nome: "marca" },
];

export const textosDeProdutos = {
  tituloDaLista: "All Products",
  tituloDaBusca: "Searched Products",
};
