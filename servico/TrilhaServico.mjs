import { Trilha } from '../modelo/Trilha.mjs';
import { TrilhaCursoServico } from './TrilhaCursoServico.mjs';

const KEY = 'trilhas';

export class TrilhaServico {
  constructor() {
    this.trilhaCursoServico = new TrilhaCursoServico();
  }

  listar() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  buscarPorId(id) {
    return this.listar().find(trilha => Number(trilha.ID_Trilha) === Number(id)) ?? null;
  }

  salvar(dados) {
    const payload = this.#normalizar(dados);
    if (!payload.Titulo) throw new Error('Titulo e obrigatorio.');

    const trilha = new Trilha({ ID_Trilha: this.#proximoId(), ...payload });
    const lista = this.listar();
    lista.push(trilha);
    localStorage.setItem(KEY, JSON.stringify(lista));
    this.trilhaCursoServico.salvarVinculos(trilha.ID_Trilha, dados.CursosSelecionados ?? []);
    return trilha;
  }

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) throw new Error('Trilha nao encontrada.');

    const payload = this.#normalizar(dados);
    if (!payload.Titulo) throw new Error('Titulo e obrigatorio.');

    const trilhaAtualizada = { ...atual, ...payload };
    const lista = this.listar().map(trilha => Number(trilha.ID_Trilha) === Number(id) ? trilhaAtualizada : trilha);
    localStorage.setItem(KEY, JSON.stringify(lista));
    this.trilhaCursoServico.removerPorTrilha(id);
    this.trilhaCursoServico.salvarVinculos(id, dados.CursosSelecionados ?? []);
    return trilhaAtualizada;
  }

  excluir(id) {
    const lista = this.listar().filter(trilha => Number(trilha.ID_Trilha) !== Number(id));
    localStorage.setItem(KEY, JSON.stringify(lista));
    this.trilhaCursoServico.removerPorTrilha(id);
  }

  #normalizar(dados) {
    return {
      Titulo: dados.Titulo?.trim(),
      Descricao: dados.Descricao?.trim() ?? '',
      ID_Categoria: dados.ID_Categoria ? Number(dados.ID_Categoria) : null
    };
  }

  #proximoId() {
    const lista = this.listar();
    if (lista.length === 0) return 1;
    return Math.max(...lista.map(trilha => Number(trilha.ID_Trilha) || 0)) + 1;
  }
}