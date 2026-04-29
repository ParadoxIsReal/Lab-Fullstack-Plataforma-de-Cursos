import { Categoria } from '../modelo/Categoria.mjs';

const KEY = 'categorias';

export class CategoriaServico {
  listar() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  buscarPorId(id) {
    return this.listar().find(categoria => Number(categoria.ID_Categoria) === Number(id)) ?? null;
  }

  salvar({ Nome, Descricao }) {
    const erro = Categoria.validar({ Nome }, this.listar());
    if (erro) throw new Error(erro);

    const categoria = new Categoria({
      ID_Categoria: this.#proximoId(),
      Nome: Nome.trim(),
      Descricao: Descricao?.trim() ?? ''
    });

    const lista = this.listar();
    lista.push(categoria);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return categoria;
  }

  atualizar(id, { Nome, Descricao }) {
    if (!Nome?.trim()) throw new Error('Nome e obrigatorio.');
    if (this.listar().some(categoria => categoria.Nome.toLowerCase() === Nome.toLowerCase() && Number(categoria.ID_Categoria) !== Number(id))) {
      throw new Error('Ja existe uma categoria com este nome.');
    }

    const atual = this.buscarPorId(id);
    if (!atual) throw new Error('Categoria nao encontrada.');

    const categoriaAtualizada = {
      ...atual,
      Nome: Nome.trim(),
      Descricao: Descricao?.trim() ?? ''
    };

    const lista = this.listar().map(categoria => Number(categoria.ID_Categoria) === Number(id) ? categoriaAtualizada : categoria);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return categoriaAtualizada;
  }

  excluir(id) {
    const lista = this.listar().filter(categoria => Number(categoria.ID_Categoria) !== Number(id));
    localStorage.setItem(KEY, JSON.stringify(lista));
  }

  #proximoId() {
    const lista = this.listar();
    if (lista.length === 0) return 1;
    return Math.max(...lista.map(categoria => Number(categoria.ID_Categoria) || 0)) + 1;
  }
}