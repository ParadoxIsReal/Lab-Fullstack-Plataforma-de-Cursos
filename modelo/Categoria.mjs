export class Categoria {

  constructor({ ID_Categoria, Nome, Descricao }) {
    this.ID_Categoria = ID_Categoria;
    this.Nome = Nome;
    this.Descricao = Descricao;
  }

  static validar(data) {
    if (!data.Nome?.trim()) {
      return 'Nome é obrigatório.';
    }
    return null;
  }
}