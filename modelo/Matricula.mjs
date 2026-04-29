export class Matricula {

  constructor({ ID_Matricula, ID_Usuario, ID_Curso, DataMatricula, DataConclusao = null }) {
    this.ID_Matricula = ID_Matricula;
    this.ID_Usuario = ID_Usuario;
    this.ID_Curso = ID_Curso;
    this.DataMatricula = DataMatricula;
    this.DataConclusao = DataConclusao;
  }

  static validar(data) {
    if (!data.ID_Usuario || !data.ID_Curso || !data.DataMatricula) {
      return 'Campos obrigatórios faltando: ID_Usuario, ID_Curso, DataMatricula.';
    }
    return null;
  }
}