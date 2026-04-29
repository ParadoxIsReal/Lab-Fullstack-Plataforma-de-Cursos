export class Modulo {

  constructor({ ID_Modulo, ID_Curso, Titulo, Ordem }) {
    this.ID_Modulo = ID_Modulo;
    this.ID_Curso = ID_Curso;
    this.Titulo = Titulo;
    this.Ordem = Ordem;
  }

  static validar(data) {
    if (!data.ID_Curso || !data.Titulo?.trim() || data.Ordem == null) {
      return 'Campos obrigatórios faltando: ID_Curso, Titulo, Ordem.';
    }
    return null;
  }
}