import {
  paginaDeProdutos,
  paginaDeDetalhesDoProduto,
  camposObrigatoriosDoDetalhe,
  textosDeProdutos,
} from "./seletores";

export const validarPaginaDeProdutos = () => {
  cy.url().should("include", "/products");
  cy.contains(paginaDeProdutos.tituloDaPagina, textosDeProdutos.tituloDaLista).should(
    "be.visible"
  );
};

export const buscarProduto = (termo) => {
  cy.get(paginaDeProdutos.campoDeBusca).type(termo);
  cy.get(paginaDeProdutos.botaoDeBusca).click();
};

export const validarPaginaDeBusca = (termo) => {
  cy.url().should("include", `/products?search=${termo}`);
  cy.contains(paginaDeProdutos.tituloDaPagina, textosDeProdutos.tituloDaBusca).should(
    "be.visible"
  );
};

export const validarResultadosDaBusca = (termo) => {
  cy.get(paginaDeProdutos.cardDoProduto)
    .should("have.length.at.least", 1)
    .each(($card) => {
      cy.wrap($card).find(paginaDeProdutos.nomeDoProduto).first().should("be.visible");
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
    cy.wrap($card).find(paginaDeProdutos.nomeDoProduto).first().should("be.visible");
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

      return {
        id: $card.find("[data-product-id]").first().attr("data-product-id"),
        nome: $card.find(paginaDeProdutos.nomeDoProduto).first().text().trim(),
        preco: $card.find(paginaDeProdutos.precoDoProduto).first().text().trim(),
        link: $card
          .parent(paginaDeProdutos.agrupadorDoCard)
          .find(paginaDeProdutos.linkVerProduto)
          .first()
          .attr("href"),
      };
    });
  });
};

export const abrirDetalhesDoPrimeiroProduto = () => {
  cy.get(paginaDeProdutos.linkVerProduto).first().click();
};

export const validarDetalhesDoProdutoCerto = (produto) => {
  cy.url().should("eq", `${Cypress.config("baseUrl")}${produto.link}`);

  cy.get(paginaDeDetalhesDoProduto.nome).should("be.visible").and("have.text", produto.nome);
  cy.get(paginaDeDetalhesDoProduto.preco).should("be.visible").and("have.text", produto.preco);
};

export const validarCamposDoDetalheDoProduto = () => {
  cy.get(paginaDeDetalhesDoProduto.campos).then(($campos) => {
    const campos = $campos.toArray().map((campo) => {
      const $campo = Cypress.$(campo);

      return { texto: $campo.text().trim(), visivel: $campo.is(":visible") };
    });

    camposObrigatoriosDoDetalhe.forEach(({ prefixo, nome }) => {
      const campo = campos.find(({ texto }) => texto.startsWith(prefixo));

      expect(campo, `campo obrigatório "${nome}" na tela de detalhes`).to.not.be.undefined;
      expect(campo.visivel, `campo "${nome}" visível`).to.be.true;
      expect(campo.texto, `campo "${nome}"`).to.match(new RegExp(`^${prefixo} \\S`));
    });
  });
};
