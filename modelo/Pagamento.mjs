export class Pagamento {

  constructor({ ID_Pagamento, ID_Assinatura, ValorPago, DataPagamento, MetodoPagamento, ID_Transacao_Gateway }) {
    this.ID_Pagamento = ID_Pagamento;
    this.ID_Assinatura = ID_Assinatura;
    this.ValorPago = ValorPago;
    this.DataPagamento = DataPagamento;
    this.MetodoPagamento = MetodoPagamento;
    this.ID_Transacao_Gateway = ID_Transacao_Gateway;
  }

  static validar(data) {
    if (!data.ID_Assinatura || !data.ValorPago || !data.DataPagamento || !data.MetodoPagamento || !data.ID_Transacao_Gateway) {
      return 'Campos obrigatórios faltando: ID_Assinatura, ValorPago, DataPagamento, MetodoPagamento, ID_Transacao_Gateway.';
    }
    return null;
  }
}