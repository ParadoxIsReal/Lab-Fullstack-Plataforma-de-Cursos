export class Progresso {

  constructor({ ID_Usuario, ID_Aula, DataConclusao, Status }) {
    this.ID_Usuario = ID_Usuario;
    this.ID_Aula = ID_Aula;
    this.DataConclusao = DataConclusao;
    this.Status = Status;
  }

  static validar(data) {
    if (!data.ID_Usuario || !data.ID_Aula || !data.DataConclusao || !data.Status) {
      return 'Campos obrigatórios faltando: ID_Usuario, ID_Aula, DataConclusao, Status.';
    }
    return null;
  }
}