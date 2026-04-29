export class Trilha {

  constructor({ ID_Trilha, Titulo, Descricao, ID_Categoria = null }) {
    this.ID_Trilha = ID_Trilha;
    this.Titulo = Titulo;
    this.Descricao = Descricao;
    this.ID_Categoria = ID_Categoria;
  }

  static validar(data) {
    if (!data.Titulo?.trim() || data.ID_Categoria == null) {
      return 'Campos obrigatórios faltando: Titulo, ID_Categoria.';
    }
    return null;
  }
}