import { Plano } from '../modelo/Plano.mjs';

const KEY = 'planos';

export class PlanoServico {
  listar() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  buscarPorId(id) {
    return this.listar().find(plano => Number(plano.ID_Plano) === Number(id)) ?? null;
  }

  salvar(dados) {
    const payload = this.#normalizar(dados);
    const erro = Plano.validar(payload);
    if (erro) throw new Error(erro);

    const plano = new Plano({ ID_Plano: this.#proximoId(), ...payload });
    const lista = this.listar();
    lista.push(plano);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return plano;
  }

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) throw new Error('Plano nao encontrado.');

    const payload = this.#normalizar(dados);
    const erro = Plano.validar(payload);
    if (erro) throw new Error(erro);

    const planoAtualizado = { ...atual, ...payload };
    const lista = this.listar().map(plano => Number(plano.ID_Plano) === Number(id) ? planoAtualizado : plano);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return planoAtualizado;
  }

  excluir(id) {
    const lista = this.listar().filter(plano => Number(plano.ID_Plano) !== Number(id));
    localStorage.setItem(KEY, JSON.stringify(lista));
  }

  #normalizar(dados) {
    return {
      Nome: dados.Nome?.trim(),
      Descricao: dados.Descricao?.trim() ?? '',
      Preco: Number(dados.Preco),
      DuracaoMeses: Number(dados.DuracaoMeses)
    };
  }

  #proximoId() {
    const lista = this.listar();
    if (lista.length === 0) return 1;
    return Math.max(...lista.map(plano => Number(plano.ID_Plano) || 0)) + 1;
  }
}