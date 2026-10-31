# Diretrizes de automação de testes — autWeb

Documento de referência de como os testes E2E deste projeto são escritos. Vale para
todo arquivo novo em `cypress/` e para revisão de teste existente. Onde houver número,
ele foi medido no site, não estimado — se divergir, refaça a medição em vez de ajustar
o texto no escuro.

## 1. O projeto e o alvo

Disciplina de automação web da pós. O alvo é o site público de prática
`https://www.automationexercise.com`, definido em `baseUrl` no `cypress.config.js`.

Consequência direta disso: **é um site de terceiros, que muda sem aviso**. Catálogo de
produtos, preços, textos e layout podem mudar entre duas execuções. Nenhum teste pode
depender de dado que não esteja garantido pelo próprio fluxo — nem contagem exata de
produtos, nem preço fixo, nem ordem de catálogo.

Stack: Cypress 13 (`devDependencies`), JavaScript puro, `cypress-mochawesome-reporter`
como reporter. Não há TypeScript, não há Cucumber, não há framework de page object
externo.

## 2. Fonte de verdade do requisito

O requisito de cada teste vem da página `/test_cases` do próprio site, que lista os
Test Cases oficiais numerados. O processo é:

1. Ler o texto oficial do caso (não a memória de alguém).
2. Numerar os passos.
3. Mapear passo a passo contra o código que existe.
4. Só então dizer que o caso está coberto.

Isso não é formalidade. No Test Case 8 ("Verify All Products and product detail page"),
o mapeamento passo a passo mostrou que o caso estava verde sem cobrir o passo 3 (validar
home dentro do fluxo) e o passo 6 ("The products list is visible"), e o passo 9 estava
parcial (quatro campos sem verificação de visibilidade). Teste verde que não cobre o
passo é pior que teste vermelho: esconde o buraco.

O nome do `it` deve permitir ligar o teste ao caso oficial sem consultar nada.

## 3. Estrutura de pastas

```
.github/workflows/cypress.yml           CI manual e push na main
.gitignore                               dependências e artefatos gerados
cypress/
  e2e/
    automation-exercise-modules.cy.js   spec oficial (usa os módulos)
  modules/
    common/     index.js, seletores.js
    cadastro/   index.js, seletores.js
    login/      index.js, seletores.js
    home/       index.js, seletores.js
    produtos/   index.js, seletores.js
    checkout/   index.js, seletores.js   carrinho, checkout, pagamento, confirmação
  fixtures/
    conta.json
    pagamento.json
  support/
    e2e.js, commands.js
```

Regras da pasta `modules/`:

- **Uma pasta por jornada**, não por seletor. Cadastro e login são jornadas diferentes
  mesmo começando na mesma página e usando formulários distintos (`signup-*` num,
  `login-*` no outro).
- `common/` guarda o que **vive no cabeçalho**, ou seja, aparece em toda página: acesso
  à conta, logout, delete account, link de produtos. O critério é ONDE o elemento vive,
  não quantas vezes a função é chamada — `entrarComCredenciais` é chamado três vezes e
  mora em `login/`, porque o formulário é daquela página.
- `index.js` tem só **ações** (cadeia de `cy.*`). `seletores.js` tem só **dado de
  localização** (seletores) e **texto do site** (mensagens exibidas).
- Nome proibido para pasta dentro de `modules/`: `support`, `e2e`, `fixtures`. São
  pastas reservadas do Cypress e criam dois significados para o mesmo nome.
- `import` de pasta resolve o `index.js` automaticamente:
  `import { x } from "../modules/produtos"` funciona sem citar arquivo nem extensão.
  É isso que permite quebrar a pasta por dentro sem mexer em nenhum spec.

## 4. As três camadas

**Spec (`cypress/e2e/*.cy.js`)** — um `it` por caso de teste oficial. Contém os dados do
teste (e-mail, nome, senha) e a ordem dos passos. Não contém seletor.

**Módulo (`cypress/modules/<jornada>/index.js`)** — funções que empacotam a cadeia de
`cy.*`. Fazem uma coisa reconhecível e são chamadas pelo nome no spec, o que deixa o
teste legível como o texto do requisito.

**Seletores (`seletores.js`)** — objeto com os localizadores agrupados por bloco da tela
(`formularioDeLogin`, `paginaDeProdutos`) e o objeto de textos exibidos.

Fronteira que mais gera dúvida: **texto do SITE mora no módulo, dado do TESTE mora no
spec**. "Your email or password is incorrect!" é seletor (está em `textosDeLogin`). Nome
do usuário, senha e data de nascimento são dado de teste (estão no spec ou no fixture).
Um módulo com usuário fixo dentro quebra no dia em que o teste precisar de outro usuário.

## 5. Convenções de nome

**Ação = verbo + alvo**, colado no que a função faz ao pé da letra:
`abrirPaginaDeProdutos`, `entrarComCredenciais`, `validarDetalhesDoProdutoCerto`,
`coletarProdutosDaLista`.

**Seletor = `<grupo>.<o que é pontualmente>`**: nunca `senha`, sempre
`formularioDeLogin.campoSenha`; nunca `pais`, sempre
`formularioDeDadosDaConta.selectPais`.

Nome que mente é bug, não estilo. `preencherLogin` que preenche o formulário de signup
briga com o `preencherLogin` de verdade; o conserto é renomear para `iniciarCadastro` na
mesma tarefa em que se descobre o problema, não deixar para depois.

Nome de função de validação que compara duas coisas deve dizer **o que** está sendo
comparado: `validarDetalhesDoProdutoCerto(produto)` recebe o produto lido da lista e
prova que a tela de detalhes é daquele produto, não de outro.

## 6. Seletores: ordem de preferência

1. **`data-qa`** quando existe. É o atributo estável do site — mas só nas páginas de
   login e cadastro. Em `/products` e `/product_details/<id>` **não existe `data-qa`**
   (medido: a listagem tem zero ocorrências).
2. **Classe estável + escopo.** Escopar sempre dentro do bloco que interessa.
3. **Texto**, quando não há atributo (`cy.contains("a", "Logout")`).

Armadilhas medidas em `/products`, que voltam a aparecer em qualquer teste novo:

- `.single-products` = 34 cards, mas `.single-products h2` e `.single-products p`
  casam **68** vezes: nome e preço estão duplicados em `.productinfo` (visível) e
  `.product-overlay` (aparece no hover). Escopar em `.productinfo`.
- O link "View Product" **não** está dentro de `.single-products`: é irmão, dentro de
  `.product-image-wrapper > .choose`. Para chegar nele:
  `.parent(".product-image-wrapper").find('a[href*="/product_details/"]')`.
- Na home, `#slider-carousel h1` casa **3 vezes** (um por slide), e o texto do `<h1>` no
  DOM é `AutomationExercise` **sem espaço** (o espaço é CSS). Usar `.first()` e regex.
- Na tela de detalhes, cada campo é um `<p>` com rótulo e valor no mesmo texto
  ("Availability: In Stock"). Validar com regex sobre o texto, não com `contains` do
  valor solto: "In Stock" é igual nos 34 produtos e não prova que o campo existe.
- **Link do cabeçalho: escopar em `.shop-menu`.** O carrinho vazio tem
  `<div class="text-center"><a href="/products">here</a></div>`, então
  `a[href="/products"]` casa **2** elementos nessa página e `cy.click()` estoura com
  "can only be called on a single element". Medido em `/view_cart`.
- **`.add-to-cart` também duplica.** Cada card tem o botão em `.productinfo` (visível) e
  em `.overlay-content` (hover): `cy.get('.add-to-cart[data-product-id="1"]')` devolve
  **2**. Use `.productinfo .add-to-cart[...]`. `.first()` também passa, mas esconde o
  problema em vez de resolvê-lo.
- **Texto em caixa alta na tela pode não estar em caixa alta no DOM.** O `#footer h2` tem
  `textContent === "Subscription"` e aparece como `SUBSCRIPTION` por
  `text-transform: uppercase`. `cy.contains` compara `textContent`, então procurar
  `"SUBSCRIPTION"` **não acha nada**. Mesma família do `AutomationExercise` da home.
  Regra: abra o DOM medido (`textContent`) antes de escrever o literal.

## 7. Regras de asserção

Esta é a parte que decide se o teste vale alguma coisa.

**Ler não prova exibir.** `should("not.be.empty")`, `invoke("text")` e
`should("have.attr", ...)` passam em elemento com `display: none`. Se o passo do caso diz
"visível", "aparece" ou "is displayed", só `be.visible` (ou critério de dimensão) cobre.
Prova: escondendo os 34 `.productinfo` com `display: none`, a versão antiga de
`validarCardsDeProduto` (quatro asserções de leitura por card) continuou verde.

**`be.visible` no nó certo.** Medido: escondendo o `.productinfo`, o
`.product-image-wrapper` e o `.single-products` continuam `is(":visible") === true` (o
link "View Product" sustenta 40px de altura) e o `.single-products` fica com
`height() === 0`. Ou seja, `be.visible` no wrapper passa com o card vazio. O nó que
realmente responde é o `.productinfo`.

**`be.visible` não detecta elemento fora do viewport.** Só falha com `display: none`,
`visibility: hidden`, `opacity: 0` ou dimensão zero. Não venda como teste de "está na
tela do usuário" sem `scrollIntoView`.

**URL: `eq` quando o requisito é "o item certo"; `include` quando é "a página".**
`include("/product_details/1")` passa quando o site abre o produto **11**, porque é
substring. A asserção correta é
`cy.url().should("eq", \`${Cypress.config("baseUrl")}${produto.link}\`)`. Preço dessa
escolha: quebra com barra final ou query string; se isso acontecer, troque por regex,
nunca volte para `include`.

**Contagem precisa de piso, não de número exato.** `greaterThan(0)` passa com 1 card, o
que não prova "todos". `have.length` fixo quebra quando o catálogo muda. O meio termo em
uso é `greaterThan(30)`, sobre 34 produtos medidos: pega colapso de renderização sem
quebrar quando o site adicionar o produto 35.

**Mensagem de falha nomeada.** `expect(valor, "quantidade de produtos na listagem")`
faz o relatório dizer o que falhou sem abrir o código.

## 8. Sincronização e a fila do Cypress

- `cy.*` só executa dentro de `it` ou de hook. Chamar `cy.get` no topo do arquivo não
  roda nada.
- A fila é sequencial: você descreve a ordem e o Cypress executa um comando por vez,
  esperando o anterior. Não há `async`/`await` nesse caminho.
- **`.then()` é a única janela onde o valor existe.** `coletarProdutosDaLista()` devolve
  um `Chainable`, não o array. Só dentro de
  `coletarProdutosDaLista().then((produtos) => { ... })` o array está disponível; fora
  dali a variável não existe.
- Função utilitária **empacota** a cadeia de comandos; quem dispara é o `it`.
- `cy.wrap($el)` transforma jQuery em `Chainable` para permitir `.should()`/`.find()`.
  Ele **não** reconsulta o DOM: se o elemento for substituído, vira erro de detached.
- Nada de `cy.wait(ms)`. Se algo precisa esperar, espere por um estado
  (`should("be.visible")`, `cy.url()`, `cy.contains`), que tem retry.
- `cy.visit("/")` precisa da barra inicial; sem ela o caminho resolve relativo à URL
  atual e o teste vaza da `baseUrl`.
- URL nunca escrita à mão: use `Cypress.config("baseUrl")` para não duplicar o valor que
  o config já centraliza.

## 9. Dado de teste

`cypress/fixtures/conta.json` guarda os dados do cadastro (senha, data de nascimento,
endereço, país). O e-mail é gerado com `Date.now()` no `describe` para criar uma conta
nova por execução.

Regra de limpeza:

- O teste de **cadastro** apaga a conta que criou (`Delete Account`). Não remova esse
  passo: sem ele as contas se acumulam no site.
- O teste de **login** não apaga a conta fixa existente (`teste_thales@teste.com`) — ela
  precisa sobreviver aos outros testes. Esse `Delete Account` fica fora de propósito.
- O teste de **pedido com login** (TC16) reaproveita essa mesma conta fixa, então ele
  **não** pode apagá-la. Como o carrinho sobrevive ao logout (é cookie, não conta), ele
  esvazia o carrinho no começo — senão o produto de uma execução anterior entra no
  pedido e a quantidade deixa de ser 1.
- `cypress/fixtures/pagamento.json` guarda os dados de cartão fictícios e o comentário do
  pedido. São dado de teste, não constante de módulo.

## 10. Asserção em loop: colete e valide em JS

Um `cy.get(...).each()` com quatro asserções por elemento custa caro: 34 cards × 4
asserções levou o caso de produtos a **28-55s** (a variação é latência do site se
amplificando asserção por asserção). A forma em uso:

1. Uma asserção Cypress por card no `each`, só do que exige o motor do Cypress
   (`be.visible`).
2. Coleta dos campos com `coletarProdutosDaLista()`, que devolve dado puro.
3. Validação do dado com `expect` em JS, dentro de `validarDadosDosProdutos(produtos)`.

Resultado medido: o caso caiu para **7,7s** e a suíte inteira para 53s.

Preço dessa escolha, que é real: perde-se granularidade no Command Log. Antes cada card
gerava quatro linhas; agora gera uma, e as falhas de campo aparecem como `AssertionError`
com o nome do produto na mensagem. Em troca o log fica legível em vez de 136 linhas.

## 11. Config e execução

`cypress.config.js` define `baseUrl`, o reporter e o `setupNodeEvents` do Mochawesome. A saída é
`cypress/reports/html/automation-exercise-report.html`, com os JSONs intermediários em
`.jsons/`. O relatório HTML usa assets inline e incorpora screenshots para ser um artefato único
no GitHub Actions.

Comandos locais:

- `npm test`: roda apenas `cypress/e2e/automation-exercise-modules.cy.js` em headless e gera
  o relatório HTML.
- `npm run test:open`: abre o Cypress em modo interativo; esse modo não gera o relatório final
  do `cypress run`.

O workflow `.github/workflows/cypress.yml` roda em `workflow_dispatch` (manual) e em push para
`main`. O relatório é enviado como artifact mesmo se o teste falhar, por 14 dias. Para abrir:
Actions → execução → Artifacts → baixar `mochawesome-report-<run_number>` e abrir o HTML.

`package-lock.json` é necessário para o `npm ci` no workflow. Não o remova nem deixe desatualizado
quando alterar dependências.

`cypress.config.js` também define o `setupNodeEvents` do reporter; `cypress/support/e2e.js`
registra `cypress-mochawesome-reporter/register`.


Rodar um spec (headless, o caminho normal):

```
npx cypress run --spec cypress/e2e/automation-exercise-modules.cy.js
```

Abrir a UI: `npx cypress open`. No WSL a janela é X11 via WSLg (`DISPLAY=:0`); quando
"não abre", quase sempre é janela não desenhada ou atrás de outra, não binário quebrado.

Checagem de sintaxe sem browser, antes de qualquer execução:

```
node --check cypress/modules/produtos/index.js
```

`node --check` prova **parse**, não que o símbolo existe. Import de nome que ninguém
exportou passa no check e explode em runtime dentro do browser
(`TypeError: ... is not a function`).

Ao renomear um export, rode os dois greps antes de executar:

```
grep -rn "export const" cypress/modules
grep -rn "nomeAntigo" cypress/e2e
```

O segundo tem que voltar zero, contando a lista do `import` **e** o corpo dos `it`s.

## 12. Antes de dizer que está pronto

1. `node --check` nos arquivos tocados.
2. `grep` do símbolo antigo, quando houve rename.
3. `grep` de `.only` e `.skip`: `it.only` faz o run imprimir `1 passing` e esconder os
   outros testes, sem avisar no resumo.
4. Rodar o spec e **entregar o número real** (`7 passing`, `53s`). Nunca descrever o que
   "deveria" acontecer como se fosse output.
5. **Provar que o assert falha quando deve.** Este é o passo que mais salvou o projeto:
   antes de confiar num teste verde, quebre a condição de propósito — esconda o elemento
   com `$els.css("display", "none")`, remova itens do DOM, abra a URL errada — e confirme
   que o teste reprova. Foi assim que se descobriu que a validação de "lista visível"
   passava com tudo escondido.

Spec de sonda é descartável: fica em `cypress/e2e/_probe-*.cy.js`, roda uma vez e é
apagado no mesmo bloco de comandos. Não deixe sonda no repo.

## 13. Armadilhas conhecidas

- **jQuery não é iterável.** `[...$cards]` explode com `TypeError: $cards is not
  iterable` (jQuery 3 não implementa `Symbol.iterator`). Use `$cards.toArray().map(...)`.
- **`cy.get` duplicado por overlay.** Ver seção 6 (`h2`/`p` casando em dobro).
- **`it.only` mentindo no resumo.** Ver seção 12.
- **Login/logout deste site é flaky.** Já apareceu `Expected to find content: 'Logged in
  as' ... never did` no teste de logout, que passou nas execuções seguintes sem mudança
  de código. Antes de acusar regressão, rode de novo e compare: se só o caso de sessão
  oscila, é o site.
- **`assertion` em `:contains()` é caríssima.** Quatro
  `cy.get('.product-information p:contains("...")')` subiram o caso de 28s para 43s. Leia
  os elementos uma vez e valide em JS.
- O spec legado `automation-exercise.cy.js` foi removido. O spec oficial modular é o
  único spec Cypress executável deste projeto.
- **Carrinho sobrevive ao logout.** O carrinho é cookie, não conta: o que o TC15 deixou
  fica no navegador e o TC16 soma por cima. Sintoma medido:
  `expected '3' to equal '1'` na quantidade. Teste que fala de carrinho começa com
  `abrirCarrinho()` + `esvaziarCarrinho()` **antes** de adicionar — e depois de adicionar
  é tarde: você apaga o que acabou de pôr.
- **`/checkout` e `/payment` respondem 200 sem sessão**, com menu de visitante, em vez de
  redirecionar para o login. Asserção de URL não prova que o usuário está logado; a
  prova é `validarUsuarioLogadoComo` antes do fluxo.
- **Texto do documento oficial diverge do site.** O TC15/TC16 pedem
  "Your order has been placed successfully!", que **não existe** na página de sucesso;
  o que existe é `Order Placed!` + `Congratulations! Your order has been confirmed!`.
  Asserção usa o texto real (medido), não o do requisito.
- **URL de sucesso carrega o valor:** `/payment_done/1000`. Aqui `include` é o correto;
  `eq` quebraria conforme o total do carrinho.

## 14. Estilo de código neste repo

- **Sem comentários.** Nenhum `//` em `cypress/modules` nem nos specs. Nome de função
  explica o quê; comentário que explica por quê morre no primeiro refactor que muda o
  contexto. (Exceção: `cypress/support/commands.js` e `e2e.js`, que são boilerplate do
  `cypress init`.)
- Aspas duplas, ponto e vírgula, `const` por padrão, arrow function nos helpers.
- Arquivo e símbolo em inglês; conteúdo textual (nomes de campo, rótulos) em PT-BR.
- Nome de variável de teste em PT-BR quando descreve o dado do usuário
  (`nomeDoUsuario`, `emailExistente`).

## 15. Débito aberto

Itens conhecidos, não corrigidos, que devem ser tratados quando houver decisão:

- `cy.visit("/")` repetido em todos os `it`s — candidato a `beforeEach`.
- `paginaDeProdutos.botaoAdicionarAoCarrinho` sem nenhum uso (o `data-product-id` passou
  a ser validado no `id` coletado).
- `quantidade` em `paginaDoCarrinho` não é mais asserido: a quantidade depende do que
  sobrou no carrinho, então `TC16` limpa antes em vez de fixar `"1"`.
- `screenshots/` de falhas antigas: falha gera screenshot automático, então rodada
  vermelha deixa lixo em `cypress/screenshots/`.
- O `npm test` foi configurado para executar somente `automation-exercise-modules.cy.js`.
- Fixtures de exemplo do Cypress ainda no repo (`example.json`, `users.json`,
  `profile.json`).
- `validarPaginaDeProdutos` usa `include("/products")` enquanto o detalhe usa `eq`;
  assimetria proposital (página vs item), mas vale saber que existe.
- `.gitignore` ignora `node_modules/` e artefatos locais de Cypress (`reports/`, `screenshots/`,
  `videos/`, `downloads/`); o relatório é preservado no artifact do GitHub Actions.

## 16. Mapa dos casos cobertos

`automation-exercise-modules.cy.js`, caso a caso:

- **TC1 — Register User**: conta nova por execução, apaga ao final.
- **TC2 — Login User with correct email and password**: usa a conta fixa.
- **TC3 — Login User with incorrect email and password**: espera a mensagem de erro.
- **TC4 — Logout User**: login, logout, valida volta para `/login`.
- **TC5 — Register User with existing email**: espera "Email Address already exist!".
- **TC8 — Verify All Products and product detail page**: cobre os nove passos, com o
  mapeamento abaixo.
- **TC9 — Search Product**: busca `jeans`, valida URL `/products?search=jeans`, título
  "Searched Products" e que todo resultado contém o termo no nome.
- **TC10 — Verify Subscription in home page**: scroll até o rodapé, inscrição de e-mail
  novo e validação da mensagem de confirmação antes de ela sumir (1,5s).
- **TC15 — Place Order: Register before Checkout**: cadastro, carrinho, checkout,
  pagamento e confirmação, com `Delete Account` no fim.
- **TC16 — Place Order: Login before Checkout**: mesma jornada, começando pelo login da
  conta fixa (`teste_thales@teste.com`), sem deletar a conta.
- **Home visível**: caso próprio, valida header, logo, carrossel e rodapé.

Mapeamento do TC8 no código:

- Passos 1-2 (`cy.visit("/")`).
- Passo 3: `validarHomeCarregada()` dentro do próprio `it` — não basta existir no `it` de
  home.
- Passo 4: `abrirPaginaDeProdutos()` (clique no link do cabeçalho).
- Passo 5: `validarPaginaDeProdutos()` — URL `/products` + "All Products" visível.
- Passo 6: `validarCardsDeProduto()` — `be.visible` no `.productinfo` de cada card;
  `validarDadosDosProdutos()` — piso de contagem e formato de id/nome/preço/link.
- Passos 7-8: `abrirDetalhesDoPrimeiroProduto()` + `validarDetalhesDoProdutoCerto()`
  com `eq` na URL e nome/preço comparados com o card.
- Passo 9: `validarCamposDoDetalheDoProduto()` — nome e preço visíveis e iguais ao card;
  Category, Availability, Condition e Brand existentes, visíveis e com valor.
