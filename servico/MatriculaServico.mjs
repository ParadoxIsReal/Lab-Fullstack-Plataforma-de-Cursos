import { Matricula } from '../modelo/Matricula.mjs';

const KEY = 'matriculas';

function hoje() {
  return new Date().toISOString().split('T')[0];
}

export class MatriculaServico {
  listar() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  listarConcluidas() {
    return this.listar().filter(matricula => Boolean(matricula.DataConclusao));
  }

  listarConcluidasPorUsuario(idUsuario) {
    return this.listarConcluidas().filter(
      matricula => Number(matricula.ID_Usuario) === Number(idUsuario)
    );
  }

  buscarPorId(id) {
    return this.listar().find(matricula => Number(matricula.ID_Matricula) === Number(id)) ?? null;
  }

  salvar(dados, cursoServico) {
    const payload = {
      ID_Usuario: Number(dados.ID_Usuario),
      ID_Curso: Number(dados.ID_Curso),
      DataMatricula: dados.DataMatricula
    };

    if (!payload.ID_Usuario) throw new Error('Selecione um aluno.');
    if (!payload.ID_Curso) throw new Error('Selecione um curso.');
    if (!payload.DataMatricula) throw new Error('Data de matricula e obrigatoria.');

    const matriculas = this.listar();
    if (matriculas.some(matricula =>
      Number(matricula.ID_Usuario) === payload.ID_Usuario &&
      Number(matricula.ID_Curso) === payload.ID_Curso
    )) {
      throw new Error('Este usuario ja esta matriculado neste curso.');
    }

    const curso = cursoServico.buscarPorId(payload.ID_Curso);
    if (curso?.ID_Instrutor === payload.ID_Usuario) {
      throw new Error('O instrutor nao pode se matricular em seu proprio curso.');
    }

    const matricula = new Matricula({ ID_Matricula: this.#proximoId(), ...payload });
    const lista = this.listar();
    lista.push(matricula);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return matricula;
  }

  concluir(id) {
    const lista = this.listar().map(matricula =>
      Number(matricula.ID_Matricula) === Number(id)
        ? { ...matricula, DataConclusao: hoje() }
        : matricula
    );
    localStorage.setItem(KEY, JSON.stringify(lista));
  }

  excluir(id) {
    const lista = this.listar().filter(matricula => Number(matricula.ID_Matricula) !== Number(id));
    localStorage.setItem(KEY, JSON.stringify(lista));
  }

  #proximoId() {
    const lista = this.listar();
    if (lista.length === 0) return 1;
    return Math.max(...lista.map(matricula => Number(matricula.ID_Matricula) || 0)) + 1;
  }
}