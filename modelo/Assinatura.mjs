export class Assinatura {

  constructor({ ID_Assinatura, ID_Usuario, ID_Plano, DataInicio, DataFim }) {
    this.ID_Assinatura = ID_Assinatura;
    this.ID_Usuario = ID_Usuario;
    this.ID_Plano = ID_Plano;
    this.DataInicio = DataInicio;
    this.DataFim = DataFim;
  }

  static validar(data) {
    if (!data.ID_Usuario || !data.ID_Plano || !data.DataInicio || !data.DataFim) {
      return 'Campos obrigatórios faltando: ID_Usuario, ID_Plano, DataInicio, DataFim.';
    }
    return null;
  }
}