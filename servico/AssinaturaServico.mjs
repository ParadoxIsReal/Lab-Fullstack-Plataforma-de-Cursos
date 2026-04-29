import { Assinatura } from '../modelo/Assinatura.mjs';

const KEY = 'assinaturas';

export class AssinaturaServico {
  listar() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  salvar(dados) {
    const assinatura = new Assinatura({
      ID_Assinatura: this.#proximoId(),
      ID_Usuario: Number(dados.ID_Usuario),
      ID_Plano: Number(dados.ID_Plano),
      DataInicio: dados.DataInicio,
      DataFim: dados.DataFim
    });

    const lista = this.listar();
    lista.push(assinatura);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return assinatura;
  }

  excluir(id) {
    const lista = this.listar().filter(assinatura => Number(assinatura.ID_Assinatura) !== Number(id));
    localStorage.setItem(KEY, JSON.stringify(lista));
  }

  #proximoId() {
    const lista = this.listar();
    if (lista.length === 0) return 1;
    return Math.max(...lista.map(assinatura => Number(assinatura.ID_Assinatura) || 0)) + 1;
  }
}