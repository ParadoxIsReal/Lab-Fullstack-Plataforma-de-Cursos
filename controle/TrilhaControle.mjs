import { TrilhaServico } from '../servico/TrilhaServico.mjs';
import { TrilhaCursoServico } from '../servico/TrilhaCursoServico.mjs';
import { CategoriaServico } from '../servico/CategoriaServico.mjs';
import { CursoServico } from '../servico/CursoServico.mjs';

const trilhaServico = new TrilhaServico();
const trilhaCursoServico = new TrilhaCursoServico();
const categoriaServico = new CategoriaServico();
const cursoServico = new CursoServico();

function getModalTrilha() {
  return document.getElementById('modalTrilha');
}

function atualizarTextoModalTrilha(edicao = false) {
  const modal = getModalTrilha();
  if (!modal) return;
  modal.querySelector('.modal-title').textContent = edicao ? 'Editar Trilha' : 'Nova Trilha';
  modal.querySelector('.modal-footer .btn-primary').textContent = edicao ? 'Atualizar' : 'Salvar';
}

function limparFormularioTrilha() {
  const modal = getModalTrilha();
  if (!modal) return;
  delete modal.dataset.editId;
  document.getElementById('trilhaTitulo').value = '';
  document.getElementById('trilhaDesc').value = '';
  document.getElementById('trilhaCategoria').value = '';
  Array.from(document.getElementById('trilhaCursos').options).forEach(option => {
    option.selected = false;
  });
  window.limparErro('erroTrilha');
  atualizarTextoModalTrilha(false);
}

export function ctrlNovaTrilha() {
  limparFormularioTrilha();
  window.abrirModal('modalTrilha');
}

export function ctrlEditarTrilha(id) {
  const modal = getModalTrilha();
  if (!modal) return;
  modal.dataset.editId = String(id);
  atualizarTextoModalTrilha(true);
  window.abrirModal('modalTrilha');
}

export function popularModalTrilha() {
  window.popularSelectOpts('trilhaCategoria', categoriaServico.listar(), categoria => categoria.ID_Categoria, categoria => categoria.Nome, '- Nenhuma -');
  window.popularSelectOpts('trilhaCursos', cursoServico.listar(), curso => curso.ID_Curso, curso => curso.Titulo, '');
  document.getElementById('trilhaCursos')?.querySelector('option[value=""]')?.remove();

  const modal = getModalTrilha();
  const editId = modal?.dataset.editId;
  if (!editId) {
    atualizarTextoModalTrilha(false);
    return;
  }

  const trilha = trilhaServico.buscarPorId(editId);
  if (!trilha) return;
  const cursosSelecionados = trilhaCursoServico.listarPorTrilha(editId).map(vinculo => String(vinculo.ID_Curso));
  document.getElementById('trilhaTitulo').value = trilha.Titulo;
  document.getElementById('trilhaDesc').value = trilha.Descricao ?? '';
  document.getElementById('trilhaCategoria').value = trilha.ID_Categoria ? String(trilha.ID_Categoria) : '';
  Array.from(document.getElementById('trilhaCursos').options).forEach(option => {
    option.selected = cursosSelecionados.includes(option.value);
  });
  atualizarTextoModalTrilha(true);
}

export function ctrlSalvarTrilha() {
  window.limparErro('erroTrilha');

  const modal = getModalTrilha();
  const editId = modal?.dataset.editId;
  const payload = {
    Titulo: document.getElementById('trilhaTitulo').value,
    Descricao: document.getElementById('trilhaDesc').value,
    ID_Categoria: document.getElementById('trilhaCategoria').value,
    CursosSelecionados: Array.from(document.getElementById('trilhaCursos').selectedOptions).map(option => Number(option.value))
  };

  try {
    const trilha = editId ? trilhaServico.atualizar(editId, payload) : trilhaServico.salvar(payload);
    limparFormularioTrilha();
    window.fecharModal('modalTrilha');
    ctrlRenderTrilhas();
    window.mostrarToast(editId ? `Trilha "${trilha.Titulo}" atualizada!` : `Trilha "${trilha.Titulo}" criada!`);
  } catch (error) {
    window.mostrarErro('erroTrilha', error.message);
  }
}

export function ctrlRenderTrilhas() {
  const grid = document.getElementById('gridTrilhas');
  if (!grid) return;

  const trilhas = trilhaServico.listar();
  if (trilhas.length === 0) {
    grid.innerHTML = '<div class="col-12"><p class="text-muted">Nenhuma trilha cadastrada.</p></div>';
    return;
  }

  grid.innerHTML = trilhas.map(trilha => {
    const cursos = trilhaCursoServico.listarPorTrilha(trilha.ID_Trilha)
      .map(vinculo => `<li class="list-group-item list-group-item-action py-1 small">${window.getNomeCurso(vinculo.ID_Curso)}</li>`)
      .join('');
    return `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <strong>${trilha.Titulo}</strong>
            <span>${window.getNomeCategoria(trilha.ID_Categoria)}</span>
          </div>
          <div class="card-body">
            <p class="card-text text-muted small">${trilha.Descricao || 'Sem descricao.'}</p>
            <ul class="list-group list-group-flush">${cursos || '<li class="list-group-item text-muted small">Sem cursos.</li>'}</ul>
          </div>
          <div class="card-footer d-flex justify-content-end gap-2">
            <button class="btn btn-sm btn-outline-primary" onclick="ctrlEditarTrilha(${trilha.ID_Trilha})">Editar</button>
            <button class="btn btn-sm btn-outline-danger" onclick="ctrlExcluirTrilha(${trilha.ID_Trilha})">Excluir</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

export function ctrlExcluirTrilha(id) {
  if (!confirm('Excluir esta trilha?')) return;
  trilhaServico.excluir(id);
  ctrlRenderTrilhas();
  window.mostrarToast('Trilha removida.', false);
}