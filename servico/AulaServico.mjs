import { Aula } from '../modelo/Aula.mjs';

const KEY = 'aulas';

export class AulaServico {
  listar() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  buscarPorId(id) {
    return this.listar().find(aula => Number(aula.ID_Aula) === Number(id)) ?? null;
  }

  salvar(dados) {
    const payload = this.#normalizar(dados);
    const erro = Aula.validar(payload);
    if (erro) throw new Error(erro);

    const aula = new Aula({ ID_Aula: this.#proximoId(), ...payload });
    const lista = this.listar();
    lista.push(aula);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return aula;
  }

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) throw new Error('Aula nao encontrada.');

    const payload = this.#normalizar(dados);
    const erro = Aula.validar(payload);
    if (erro) throw new Error(erro);

    const aulaAtualizada = { ...atual, ...payload };
    const lista = this.listar().map(aula => Number(aula.ID_Aula) === Number(id) ? aulaAtualizada : aula);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return aulaAtualizada;
  }

  listarPorModulo(idModulo) {
    return this.listar()
      .filter(aula => Number(aula.ID_Modulo) === Number(idModulo))
      .sort((a, b) => a.Ordem - b.Ordem);
  }

  excluir(id) {
    const lista = this.listar().filter(aula => Number(aula.ID_Aula) !== Number(id));
    localStorage.setItem(KEY, JSON.stringify(lista));
  }

  #normalizar(dados) {
    return {
      ID_Modulo: Number(dados.ID_Modulo),
      Titulo: dados.Titulo?.trim(),
      TipoConteudo: dados.TipoConteudo,
      URL_Conteudo: dados.URL_Conteudo?.trim() ?? '',
      DuracaoMinutos: Number(dados.DuracaoMinutos),
      Ordem: Number(dados.Ordem)
    };
  }

  #proximoId() {
    const lista = this.listar();
    if (lista.length === 0) return 1;
    return Math.max(...lista.map(aula => Number(aula.ID_Aula) || 0)) + 1;
  }
}