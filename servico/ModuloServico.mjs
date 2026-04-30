import { Modulo } from '../modelo/Modulo.mjs';

const MODULO_KEY = 'modulos';

export class ModuloServico {
  listarModulos() {
    return JSON.parse(localStorage.getItem(MODULO_KEY) ?? '[]');
  }

  buscarModuloPorId(id) {
    return this.listarModulos().find(modulo => Number(modulo.ID_Modulo) === Number(id)) ?? null;
  }

  listarModulosPorCurso(idCurso) {
    return this.listarModulos()
      .filter(modulo => Number(modulo.ID_Curso) === Number(idCurso))
      .sort((a, b) => a.Ordem - b.Ordem);
  }

  salvarModulo(dados) {
    const payload = this.#normalizarModulo(dados);
    const erro = Modulo.validar(payload);
    if (erro) throw new Error(erro);

    const modulo = new Modulo({ ID_Modulo: this.#proximoModuloId(), ...payload });
    const lista = this.listarModulos();
    lista.push(modulo);
    localStorage.setItem(MODULO_KEY, JSON.stringify(lista));
    return modulo;
  }

  atualizarModulo(id, dados) {
    const atual = this.buscarModuloPorId(id);
    if (!atual) throw new Error('Modulo nao encontrado.');

    const payload = this.#normalizarModulo(dados);
    const erro = Modulo.validar(payload);
    if (erro) throw new Error(erro);

    const moduloAtualizado = { ...atual, ...payload };
    const lista = this.listarModulos().map(modulo => Number(modulo.ID_Modulo) === Number(id) ? moduloAtualizado : modulo);
    localStorage.setItem(MODULO_KEY, JSON.stringify(lista));
    return moduloAtualizado;
  }

  excluirModulo(id) {
    const list = this.listarModulos().filter(modulo => Number(modulo.ID_Modulo) !== Number(id));
    localStorage.setItem(MODULO_KEY, JSON.stringify(list));
  }

  #normalizarModulo(dados) {
    return {
      ID_Curso: Number(dados.ID_Curso),
      Titulo: dados.Titulo?.trim(),
      Ordem: Number(dados.Ordem)
    };
  }

  #proximoModuloId() {
    const lista = this.listarModulos();
    if (lista.length === 0) return 1;
    return Math.max(...lista.map(modulo => Number(modulo.ID_Modulo) || 0)) + 1;
  }
}