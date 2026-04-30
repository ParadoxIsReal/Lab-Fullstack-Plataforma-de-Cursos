import { Pagamento } from '../modelo/Pagamento.mjs';

const KEY = 'pagamentos';

function hoje() {
  return new Date().toISOString().split('T')[0];
}

function gerarIdTransacao() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export class PagamentoServico {
  listar() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  salvar(dados) {
    const pagamento = new Pagamento({
      ID_Pagamento: this.#proximoId(),
      ID_Assinatura: Number(dados.ID_Assinatura),
      ValorPago: Number(dados.ValorPago),
      DataPagamento: dados.DataPagamento ?? hoje(),
      MetodoPagamento: dados.MetodoPagamento,
      ID_Transacao_Gateway: dados.ID_Transacao_Gateway ?? gerarIdTransacao()
    });

    const lista = this.listar();
    lista.push(pagamento);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return pagamento;
  }

  #proximoId() {
    const lista = this.listar();
    if (lista.length === 0) return 1;
    return Math.max(...lista.map(pagamento => Number(pagamento.ID_Pagamento) || 0)) + 1;
  }
}