export class TrilhaCurso {

  constructor({ ID_Trilha, ID_Curso, Ordem }) {
    this.ID_Trilha = ID_Trilha;
    this.ID_Curso = ID_Curso;
    this.Ordem = Ordem;
  }

  static validar(data) {
    if (!data.ID_Trilha || !data.ID_Curso || data.Ordem == null) {
      return 'Campos obrigatórios faltando: ID_Trilha, ID_Curso, Ordem.';
    }
    return null;
  }
}