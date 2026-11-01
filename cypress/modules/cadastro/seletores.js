export const formularioDeInscricao = {
  titulo: ".signup-form h2",
  campoNome: '.signup-form [data-qa="signup-name"]',
  campoEmail: '.signup-form [data-qa="signup-email"]',
  botaoInscrever: '.signup-form [data-qa="signup-button"]',
  mensagemDeErro: ".signup-form p",
};

export const formularioDeDadosDaConta = {
  radioTituloSr: "#id_gender1",
  campoSenha: '[data-qa="password"]',
  selectDiaDeNascimento: '[data-qa="days"]',
  selectMesDeNascimento: '[data-qa="months"]',
  selectAnoDeNascimento: '[data-qa="years"]',
  campoPrimeiroNome: '[data-qa="first_name"]',
  campoSobrenome: '[data-qa="last_name"]',
  campoEndereco: '[data-qa="address"]',
  selectPais: '[data-qa="country"]',
  campoEstado: '[data-qa="state"]',
  campoCidade: '[data-qa="city"]',
  campoCep: '[data-qa="zipcode"]',
  campoTelefone: '[data-qa="mobile_number"]',
  botaoCriarConta: '[data-qa="create-account"]',
};

export const paginaDaContaCriada = {
  titulo: '[data-qa="account-created"]',
  botaoContinuar: '[data-qa="continue-button"]',
};

export const textosDeCadastro = {
  tituloDoFormularioDeInscricao: "New User Signup!",
  contaCriada: "Account Created!",
  emailJaCadastrado: "Email Address already exist!",
};
