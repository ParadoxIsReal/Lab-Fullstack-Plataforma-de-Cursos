import { CategoriaServico } from '../servico/CategoriaServico.mjs';
import { CursoServico } from '../servico/CursoServico.mjs';

const categoriaServico = new CategoriaServico();
const cursoServico = new CursoServico();

function getModalCategoria() {
  return document.getElementById('modalCategoria');
}

function atualizarTextoModalCategoria(edicao = false) {
  const modal = getModalCategoria();
  if (!modal) return;
  modal.querySelector('.modal-title').textContent = edicao ? 'Editar Categoria' : 'Nova Categoria';
  modal.querySelector('.modal-footer .btn-primary').textContent = edicao ? 'Atualizar' : 'Salvar';
}

function limparFormularioCategoria() {
  const modal = getModalCategoria();
  if (!modal) return;
  delete modal.dataset.editId;
  document.getElementById('catNome').value = '';
  document.getElementById('catDesc').value = '';
  window.limparErro('erroCategoria');
  atualizarTextoModalCategoria(false);
}

export function ctrlNovaCategoria() {
  limparFormularioCategoria();
  window.abrirModal('modalCategoria');
}

export function ctrlEditarCategoria(id) {
  const categoria = categoriaServico.buscarPorId(id);
  if (!categoria) return;
  limparFormularioCategoria();
  const modal = getModalCategoria();
  modal.dataset.editId = String(id);
  document.getElementById('catNome').value = categoria.Nome;
  document.getElementById('catDesc').value = categoria.Descricao ?? '';
  atualizarTextoModalCategoria(true);
  window.abrirModal('modalCategoria');
}

export function ctrlSalvarCategoria() {
  window.limparErro('erroCategoria');

  const modal = getModalCategoria();
  const editId = modal?.dataset.editId;
  const payload = {
    Nome: document.getElementById('catNome').value.trim(),
    Descricao: document.getElementById('catDesc').value.trim()
  };

  try {
    const categoria = editId
      ? categoriaServico.atualizar(editId, payload)
      : categoriaServico.salvar(payload);
    limparFormularioCategoria();
    window.fecharModal('modalCategoria');
    ctrlRenderCategorias();
    window.renderDashboard();
    window.mostrarToast(editId
      ? `Categoria "${categoria.Nome}" atualizada!`
      : `Categoria "${categoria.Nome}" criada!`);
  } catch (error) {
    window.mostrarErro('erroCategoria', error.message);
  }
}

export function ctrlRenderCategorias() {
  const tbody = document.getElementById('bodyCategorias');
  if (!tbody) return;

  const categorias = categoriaServico.listar();
  const cursos = cursoServico.listar();
  if (categorias.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum registro encontrado.</td></tr>';
    return;
  }

  tbody.innerHTML = categorias.map(categoria => {
    const quantidadeCursos = cursos.filter(curso => Number(curso.ID_Categoria) === Number(categoria.ID_Categoria)).length;
    return `
      <tr>
        <td>${categoria.ID_Categoria}</td>
        <td>${categoria.Nome}</td>
        <td>${categoria.Descricao || '-'}</td>
        <td>${quantidadeCursos}</td>
        <td class="d-flex gap-1">
          <button class="btn btn-sm btn-outline-primary" onclick="ctrlEditarCategoria(${categoria.ID_Categoria})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="ctrlExcluirCategoria(${categoria.ID_Categoria})">Excluir</button>
        </td>
      </tr>`;
  }).join('');
}

export function ctrlExcluirCategoria(id) {
  if (!confirm('Excluir esta categoria?')) return;
  categoriaServico.excluir(id);
  ctrlRenderCategorias();
  window.renderDashboard();
  window.mostrarToast('Categoria removida.', false);
}