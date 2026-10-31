import {
  abrirFormulariosDeAcesso,
  abrirPaginaDeProdutos,
  validarUsuarioLogadoComo,
  sairDaConta,
  validarUrlDeLogin,
  deletarConta,
  validarContaDeletada,
} from "../modules/common";
import {
  validarFormularioDeInscricaoVisivel,
  iniciarCadastro,
  preencherDadosDaConta,
  validarContaCriada,
  continuarAposCriarConta,
  validarEmailJaCadastrado,
} from "../modules/cadastro";
import {
  validarFormularioDeLoginVisivel,
  entrarComCredenciais,
  validarErroDeCredenciaisInvalidas,
} from "../modules/login";
import {
  validarHomeCarregada,
  irParaORodape,
  validarRodapeComInscricao,
  inscreverEmail,
  validarInscricaoConfirmada,
} from "../modules/home";
import {
  validarPaginaDeProdutos,
  validarCardsDeProduto,
  validarDadosDosProdutos,
  coletarProdutosDaLista,
  abrirDetalhesDoPrimeiroProduto,
  validarDetalhesDoProdutoCerto,
  validarCamposDoDetalheDoProduto,
  buscarProduto,
  validarPaginaDeBusca,
  validarResultadosDaBusca,
} from "../modules/produtos";
import {
  adicionarProdutoAoCarrinho,
  continuarComprandoAposAdicionar,
  abrirCarrinho,
  esvaziarCarrinho,
  validarCarrinhoComProduto,
  irParaOCheckout,
  validarEnderecoERevisaoDoPedido,
  informarComentarioDoPedido,
  irParaOPagamento,
  preencherDadosDePagamento,
  pagarEConfirmarPedido,
  validarPedidoConfirmado,
} from "../modules/checkout";

describe("Automation Exercise", () => {
  const timestamp = Date.now();

  const emailNovo = `thales_${timestamp}@test.com`;
  const nomeDoUsuario = "Thales TEST";
  const senha = "123456";

  const emailExistente = "teste_thales@teste.com";
  const nomeDoUsuarioExistente = "teste2";

  beforeEach(() => {
    cy.fixture("conta").as("dadosDaConta");
    cy.fixture("pagamento").as("dadosDoPagamento");
  });

  it("Verificar que a home é exibida com sucesso", () => {
    cy.visit("/");

    validarHomeCarregada();
  });

  it("Cadastrar um novo usuario com sucesso", () => {
    cy.visit("/");

    cy.get("@dadosDaConta").then((dadosDaConta) => {
      abrirFormulariosDeAcesso();
      validarFormularioDeInscricaoVisivel();
      iniciarCadastro(nomeDoUsuario, emailNovo);

      preencherDadosDaConta(dadosDaConta);
    });

    validarContaCriada();

    continuarAposCriarConta();
    validarUsuarioLogadoComo(nomeDoUsuario);

    deletarConta();
    validarContaDeletada();
  });

  it("Logar com um usuário já cadastrado com sucesso", () => {
    cy.visit("/");

    abrirFormulariosDeAcesso();
    validarFormularioDeLoginVisivel();
    entrarComCredenciais(emailExistente, senha);

    validarUsuarioLogadoComo(nomeDoUsuarioExistente);
  });

  it('Logar com credenciais inválidas deve receber a mensagem "Your email or password is incorrect!"', () => {
    cy.visit("/");

    abrirFormulariosDeAcesso();
    entrarComCredenciais("thales_ERRADO@test2.com", senha);

    validarErroDeCredenciaisInvalidas();
  });

  it("Deslogar um usuário logado com sucesso", () => {
    cy.visit("/");

    abrirFormulariosDeAcesso();
    validarFormularioDeLoginVisivel();
    entrarComCredenciais(emailExistente, senha);

    validarUsuarioLogadoComo(nomeDoUsuarioExistente);

    sairDaConta();
    validarUrlDeLogin();
    validarFormularioDeLoginVisivel();
  });

  it('Cadastrando um email que já existe deve retornar mensagem de erro "Email Address already exist!"', () => {
    cy.visit("/");

    abrirFormulariosDeAcesso();
    validarFormularioDeInscricaoVisivel();
    iniciarCadastro(nomeDoUsuario, emailExistente);

    validarEmailJaCadastrado();
  });

  it('Verificar todos os produtos e a tela de detalhes dos produtos com sucesso', () => {
    cy.visit("/");
    validarHomeCarregada();

    abrirPaginaDeProdutos();
    validarPaginaDeProdutos();
    validarCardsDeProduto();

    coletarProdutosDaLista().then((produtos) => {
      validarDadosDosProdutos(produtos);
      cy.log(`${produtos.length} produtos encontrados na listagem`);

      abrirDetalhesDoPrimeiroProduto();
      validarDetalhesDoProdutoCerto(produtos[0]);
      validarCamposDoDetalheDoProduto();
    });
  })

  it('Buscar produto e verificar todos os resultados relacionados com sucesso', () => {
    const termoDeBusca = "jeans";

    cy.visit("/");
    validarHomeCarregada();

    abrirPaginaDeProdutos();
    validarPaginaDeProdutos();

    buscarProduto(termoDeBusca);
    validarPaginaDeBusca(termoDeBusca);
    validarResultadosDaBusca(termoDeBusca);
  })

  it('Verificar a inscrição na newsletter pela home com sucesso', () => {
    cy.visit("/");
    validarHomeCarregada();

    irParaORodape();
    validarRodapeComInscricao();

    inscreverEmail(`inscrito_${timestamp}@test.com`);
    validarInscricaoConfirmada();
  })

  it('Fazer pedido com cadastro antes do checkout com sucesso', () => {
    const emailDoPedido = `pedido_${timestamp}@test.com`;
    const idDoProduto = 1;

    cy.visit("/");
    validarHomeCarregada();

    abrirFormulariosDeAcesso();
    validarFormularioDeInscricaoVisivel();

    cy.get("@dadosDaConta").then((dadosDaConta) => {
      iniciarCadastro(nomeDoUsuario, emailDoPedido);
      preencherDadosDaConta(dadosDaConta);
    });

    validarContaCriada();
    continuarAposCriarConta();
    validarUsuarioLogadoComo(nomeDoUsuario);

    abrirPaginaDeProdutos();
    adicionarProdutoAoCarrinho(idDoProduto);
    continuarComprandoAposAdicionar();

    abrirCarrinho();
    validarCarrinhoComProduto(idDoProduto);

    irParaOCheckout();
    validarEnderecoERevisaoDoPedido();

    cy.get("@dadosDoPagamento").then((dadosDoPagamento) => {
      informarComentarioDoPedido(dadosDoPagamento.comentarioDoPedido);
      irParaOPagamento();
      preencherDadosDePagamento(dadosDoPagamento);
    });

    pagarEConfirmarPedido();
    validarPedidoConfirmado();

    deletarConta();
    validarContaDeletada();
  })

  it('Fazer pedido com login antes do checkout com sucesso', () => {
    const idDoProduto = 1;

    cy.visit("/");
    validarHomeCarregada();

    abrirFormulariosDeAcesso();
    validarFormularioDeLoginVisivel();
    entrarComCredenciais(emailExistente, senha);
    validarUsuarioLogadoComo(nomeDoUsuarioExistente);

    abrirCarrinho();
    esvaziarCarrinho();

    abrirPaginaDeProdutos();
    adicionarProdutoAoCarrinho(idDoProduto);
    continuarComprandoAposAdicionar();

    abrirCarrinho();
    validarCarrinhoComProduto(idDoProduto);

    irParaOCheckout();
    validarEnderecoERevisaoDoPedido();

    cy.get("@dadosDoPagamento").then((dadosDoPagamento) => {
      informarComentarioDoPedido(dadosDoPagamento.comentarioDoPedido);
      irParaOPagamento();
      preencherDadosDePagamento(dadosDoPagamento);
    });

    pagarEConfirmarPedido();
    validarPedidoConfirmado();
  })
});
