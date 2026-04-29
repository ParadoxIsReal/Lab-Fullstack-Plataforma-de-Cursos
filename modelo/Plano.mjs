export class Plano {

  constructor({ ID_Plano, Nome, Descricao, Preco, DuracaoMeses }) {
    this.ID_Plano = ID_Plano;
    this.Nome = Nome;
    this.Descricao = Descricao;
    this.Preco = Preco;
    this.DuracaoMeses = DuracaoMeses;
  }

  static validar(data) {
    if (!data.Nome?.trim() || data.Preco == null || !data.DuracaoMeses) {
      return 'Campos obrigatórios faltando: Nome, Preco, DuracaoMeses.';
    }
    return null;
  }
}