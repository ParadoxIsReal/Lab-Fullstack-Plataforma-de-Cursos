export class Avaliacao {

  constructor({ ID_Avaliacao, ID_Usuario, ID_Curso, Nota, Comentario, DataAvaliacao }) {
    this.ID_Avaliacao = ID_Avaliacao;
    this.ID_Usuario = ID_Usuario;
    this.ID_Curso = ID_Curso;
    this.Nota = Nota;
    this.Comentario = Comentario;
    this.DataAvaliacao = DataAvaliacao;
  }

  static validar(data) {
    if (!data.ID_Usuario || !data.ID_Curso || data.Nota == null || !data.DataAvaliacao) {
      return 'Campos obrigatórios faltando: ID_Usuario, ID_Curso, Nota, DataAvaliacao.';
    }
    if (data.Nota < 0 || data.Nota > 10) return 'Nota deve ser entre 0 e 10.';
    return null;
  }
}