import { Curso } from '../modelo/Curso.mjs';

const CURSO_KEY = 'cursos';

export class CursoServico {
    listar() {
    return JSON.parse(localStorage.getItem(CURSO_KEY) ?? '[]');
  }

  buscarPorId(id) {
    return this.listar().find(curso => Number(curso.ID_Curso) === Number(id)) ?? null;
  }

  salvar(dados) {
    const payload = this.#normalizarCurso(dados);
    const erro = Curso.validar(payload);
    if (erro) throw new Error(erro);

    const curso = new Curso({ ID_Curso: this.#proximoCursoId(), ...payload });
    const lista = this.listar();
    lista.push(curso);
    localStorage.setItem(CURSO_KEY, JSON.stringify(lista));
    return curso;
  }

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) throw new Error('Curso nao encontrado.');

    const payload = this.#normalizarCurso(dados);
    const erro = Curso.validar(payload);
    if (erro) throw new Error(erro);

    const cursoAtualizado = { ...atual, ...payload };
    const lista = this.listar().map(curso => Number(curso.ID_Curso) === Number(id) ? cursoAtualizado : curso);
    localStorage.setItem(CURSO_KEY, JSON.stringify(lista));
    return cursoAtualizado;
  }

  listarFiltrado({ ID_Categoria = '', Nivel = '' } = {}) {
    let cursos = this.listar();
    if (ID_Categoria) cursos = cursos.filter(curso => Number(curso.ID_Categoria) === Number(ID_Categoria));
    if (Nivel) cursos = cursos.filter(curso => curso.Nivel === Nivel);
    return cursos;
  }

  excluir(id) {
    const lista = this.listar().filter(curso => Number(curso.ID_Curso) !== Number(id));
    localStorage.setItem(CURSO_KEY, JSON.stringify(lista));
  }

    #proximoCursoId() {
      const lista = this.listar();
      if (lista.length === 0) return 1;
      return Math.max(...lista.map(curso => Number(curso.ID_Curso) || 0)) + 1;
    }

    #normalizarCurso(dados) {
      return {
        Titulo: dados.Titulo?.trim(),
        Descricao: dados.Descricao?.trim(),
        ID_Instrutor: Number(dados.ID_Instrutor),
        ID_Categoria: Number(dados.ID_Categoria),
        Nivel: dados.Nivel,
        DataPublicacao: dados.DataPublicacao,
        TotalAulas: Number(dados.TotalAulas) || 0,
        TotalHoras: Number(dados.TotalHoras) || 0
      };
    }
}