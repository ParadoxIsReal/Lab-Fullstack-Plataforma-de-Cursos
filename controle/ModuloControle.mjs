import { ModuloServico } from '../servico/ModuloServico.mjs';
import { CursoServico } from '../servico/CursoServico.mjs';
import { AulaServico } from '../servico/AulaServico.mjs';

const moduloServico = new ModuloServico();
const cursoServico = new CursoServico();
const aulaServico = new AulaServico();

function getModalModulo() {
  return document.getElementById('modalModulo');
}

function atualizarTextoModalModulo(edicao = false) {
  const modal = getModalModulo();
  if (!modal) return;
  modal.querySelector('.modal-title').textContent = edicao ? 'Editar Módulo' : 'Novo Módulo';
  modal.querySelector('.modal-footer .btn-primary').textContent = edicao ? 'Atualizar' : 'Salvar';
}

function limparFormularioModulo() {
  const modal = getModalModulo();
  if (!modal) return;
  delete modal.dataset.editId;
  document.getElementById('modCurso').value = '';
  document.getElementById('modTitulo').value = '';
  document.getElementById('modOrdem').value = '1';
  window.limparErro('erroModulo');
  atualizarTextoModalModulo(false);
}

export function ctrlNovoModulo() {
  limparFormularioModulo();
  window.abrirModal('modalModulo');
}

export function ctrlEditarModulo(id) {
  const modal = getModalModulo();
  if (!modal) return;
  modal.dataset.editId = String(id);
  atualizarTextoModalModulo(true);
  window.abrirModal('modalModulo');
}

export function popularModalModulo() {
  window.popularSelectOpts('modCurso', cursoServico.listar(), curso => curso.ID_Curso, curso => curso.Titulo, 'Selecione um curso...');

  const modal = getModalModulo();
  const editId = modal?.dataset.editId;
  if (!editId) {
    atualizarTextoModalModulo(false);
    return;
  }

  const modulo = moduloServico.buscarModuloPorId(editId);
  if (!modulo) return;
  document.getElementById('modCurso').value = String(modulo.ID_Curso);
  document.getElementById('modTitulo').value = modulo.Titulo;
  document.getElementById('modOrdem').value = String(modulo.Ordem);
  atualizarTextoModalModulo(true);
}

export function ctrlSalvarModulo() {
  window.limparErro('erroModulo');

  const modal = getModalModulo();
  const editId = modal?.dataset.editId;
  const payload = {
    ID_Curso: document.getElementById('modCurso').value,
    Titulo: document.getElementById('modTitulo').value,
    Ordem: document.getElementById('modOrdem').value
  };

  try {
    const modulo = editId ? moduloServico.atualizarModulo(editId, payload) : moduloServico.salvarModulo(payload);
    limparFormularioModulo();
    window.fecharModal('modalModulo');
    popularSelectAulasFiltro();
    ctrlRenderModulos();
    if (window.ctrlRenderAulas) window.ctrlRenderAulas();
    window.mostrarToast(editId ? `Modulo "${modulo.Titulo}" atualizado!` : `Modulo "${modulo.Titulo}" adicionado!`);
  } catch (error) {
    window.mostrarErro('erroModulo', error.message);
  }
}

export function ctrlRenderModulos() {
  const tbody = document.getElementById('bodyModulos');
  const filtroCurso = document.getElementById('filtroCursoModulos');
  if (!tbody || !filtroCurso) return;

  const idCurso = Number(filtroCurso.value);
  if (!idCurso) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Selecione um curso.</td></tr>';
    return;
  }

  const modulos = moduloServico.listarModulosPorCurso(idCurso);
  if (modulos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhum modulo neste curso.</td></tr>';
    return;
  }

  tbody.innerHTML = modulos.map(modulo => {
    const quantidadeAulas = aulaServico.listarPorModulo(modulo.ID_Modulo).length;
    return `
      <tr>
        <td>${modulo.Ordem}</td>
        <td>${modulo.Titulo}</td>
        <td>${quantidadeAulas}</td>
        <td class="d-flex gap-1">
          <button class="btn btn-sm btn-outline-primary" onclick="ctrlEditarModulo(${modulo.ID_Modulo})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="ctrlExcluirModulo(${modulo.ID_Modulo})">Excluir</button>
        </td>
      </tr>`;
  }).join('');
}

export function ctrlExcluirModulo(id) {
  if (!confirm('Excluir este modulo?')) return;
  moduloServico.excluirModulo(id);
  popularSelectAulasFiltro();
  ctrlRenderModulos();
  if (window.ctrlRenderAulas) window.ctrlRenderAulas();
  window.mostrarToast('Modulo removido.', false);
}