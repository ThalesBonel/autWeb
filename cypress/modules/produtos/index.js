import {
  paginaDeProdutos,
  paginaDeDetalhesDoProduto,
  camposObrigatoriosDoDetalhe,
  textosDeProdutos,
} from "./seletores";

export const validarPaginaDeProdutos = () => {
  cy.url().should("include", "/products");
  cy.get(paginaDeProdutos.tituloDaPagina)
    .should("have.length", 1)
    .and("be.visible")
    .and("have.text", textosDeProdutos.tituloDaLista);
};

export const buscarProduto = (termo) => {
  cy.get(paginaDeProdutos.campoDeBusca).should("have.length", 1).clear().type(termo);
  cy.get(paginaDeProdutos.botaoDeBusca).should("have.length", 1).click();
};

export const validarPaginaDeBusca = (termo) => {
  cy.url().should("include", `/products?search=${termo}`);
  cy.get(paginaDeProdutos.tituloDaPagina)
    .should("have.length", 1)
    .and("be.visible")
    .and("have.text", textosDeProdutos.tituloDaBusca);
};

export const validarResultadosDaBusca = (termo) => {
  cy.get(paginaDeProdutos.cardDoProduto)
    .should("have.length.at.least", 1)
    .each(($card) => {
      cy.wrap($card)
        .find(paginaDeProdutos.blocoDeInformacaoDoProduto)
        .should("have.length", 1)
        .and("be.visible");
    });

  coletarProdutosDaLista().then((produtos) => {
    produtos.forEach((produto) => {
      expect(
        produto.nome.toLowerCase(),
        `nome de "${produto.nome}" deveria conter "${termo}"`
      ).to.include(termo.toLowerCase());
    });
  });
};

export const validarCardsDeProduto = () => {
  cy.get(paginaDeProdutos.cardDoProduto).each(($card) => {
    cy.wrap($card)
      .find(paginaDeProdutos.blocoDeInformacaoDoProduto)
      .should("have.length", 1)
      .and("be.visible");
  });
};

export const validarDadosDosProdutos = (produtos) => {
  expect(produtos.length, "quantidade de produtos na listagem").to.be.greaterThan(30);

  produtos.forEach((produto) => {
    expect(produto.id, `id de "${produto.nome}"`).to.match(/^\d+$/);
    expect(produto.nome, "nome do produto").to.not.be.empty;
    expect(produto.preco, `preço de "${produto.nome}"`).to.match(/^Rs\. \d+$/);
    expect(produto.link, `link de "${produto.nome}"`).to.match(
      /^\/product_details\/\d+$/
    );
  });
};

export const coletarProdutosDaLista = () => {
  return cy.get(paginaDeProdutos.cardDoProduto).then(($cards) => {
    return $cards.toArray().map((card) => {
      const $card = Cypress.$(card);
      const $nome = $card.find(paginaDeProdutos.nomeDoProduto);
      const $preco = $card.find(paginaDeProdutos.precoDoProduto);
      const $link = $card
        .parent(paginaDeProdutos.agrupadorDoCard)
        .find(paginaDeProdutos.linkVerProduto);

      expect($nome.length, "quantidade de nomes no card").to.equal(1);
      expect($preco.length, "quantidade de preços no card").to.equal(1);
      expect($link.length, "quantidade de links de detalhe no card").to.equal(1);

      const link = $link.attr("href");
      const id = link?.match(/^\/product_details\/(\d+)$/)?.[1];

      return {
        id,
        nome: $nome.text().trim(),
        preco: $preco.text().trim(),
        link,
      };
    });
  });
};

export const abrirDetalhesDoProduto = (produto) => {
  cy.get(paginaDeProdutos.linkVerProduto)
    .filter(`[href="${produto.link}"]`)
    .should("have.length", 1)
    .click();
};

export const validarDetalhesDoProdutoCerto = (produto) => {
  cy.url().should("eq", `${Cypress.config("baseUrl")}${produto.link}`);

  cy.get(paginaDeDetalhesDoProduto.nome)
    .should("have.length", 1)
    .and("be.visible")
    .and("have.text", produto.nome);
  cy.get(paginaDeDetalhesDoProduto.preco)
    .should("have.length", 1)
    .and("be.visible")
    .and("have.text", produto.preco);
};

export const validarCamposDoDetalheDoProduto = () => {
  cy.get(paginaDeDetalhesDoProduto.campos).then(($campos) => {
    const campos = $campos.toArray().map((campo) => {
      const $campo = Cypress.$(campo);

      return { texto: $campo.text().trim(), visivel: $campo.is(":visible") };
    });

    camposObrigatoriosDoDetalhe.forEach(({ prefixo, nome }) => {
      const camposCorrespondentes = campos.filter(({ texto }) => texto.startsWith(prefixo));
      expect(camposCorrespondentes.length, `quantidade do campo "${nome}"`).to.equal(1);

      const [campo] = camposCorrespondentes;
      expect(campo.visivel, `campo "${nome}" visível`).to.be.true;
      expect(campo.texto, `campo "${nome}"`).to.match(new RegExp(`^${prefixo} \\S`));
    });
  });
};
