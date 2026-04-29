export class Curso {

  constructor({ ID_Curso, Titulo, Descricao, ID_Instrutor, ID_Categoria, Nivel, DataPublicacao, TotalAulas, TotalHoras }) {
    this.ID_Curso = ID_Curso;
    this.Titulo = Titulo;
    this.Descricao = Descricao;
    this.ID_Instrutor = ID_Instrutor;
    this.ID_Categoria = ID_Categoria;
    this.Nivel = Nivel;
    this.DataPublicacao = DataPublicacao;
    this.TotalAulas = TotalAulas;
    this.TotalHoras = TotalHoras;
  }

  static validar(data) {
    if (!data.Titulo?.trim() || !data.ID_Instrutor || !data.ID_Categoria || !data.Nivel || !data.DataPublicacao) {
      return 'Campos obrigatórios faltando: Titulo, ID_Instrutor, ID_Categoria, Nivel, DataPublicacao.';
    }
    return null;
  }
}