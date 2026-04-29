import { TrilhaCurso } from '../modelo/TrilhaCurso.mjs';

const KEY = 'trilhas-cursos';

export class TrilhaCursoServico {
  listar() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  salvarVinculos(idTrilha, cursosSelecionados = []) {
    const vinculos = cursosSelecionados.map((idCurso, index) => new TrilhaCurso({
      ID_Trilha: Number(idTrilha),
      ID_Curso: Number(idCurso),
      Ordem: index + 1
    }));
    const lista = ([...this.listar(), ...vinculos]);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return vinculos;
  }

  listarPorTrilha(idTrilha) {
    return this.listar()
      .filter(vinculo => Number(vinculo.ID_Trilha) === Number(idTrilha))
      .sort((a, b) => a.Ordem - b.Ordem);
  }

  removerPorTrilha(idTrilha) {
    const lista = this.listar().filter(vinculo => Number(vinculo.ID_Trilha) !== Number(idTrilha));
    localStorage.setItem(KEY, JSON.stringify(lista));
  }
}