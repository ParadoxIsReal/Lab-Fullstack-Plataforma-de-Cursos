import { AulaServico } from '../servico/AulaServico.mjs';
import { ModuloServico } from '../servico/ModuloServico.mjs';

const aulaServico = new AulaServico();
const moduloServico = new ModuloServico();

function getModalAula() {
  return document.getElementById('modalAula');
}

function atualizarTextoModalAula(edicao = false) {
  const modal = getModalAula();
  if (!modal) return;
  modal.querySelector('.modal-title').textContent = edicao ? 'Editar Aula' : 'Nova Aula';
  modal.querySelector('.modal-footer .btn-success').textContent = edicao ? 'Atualizar' : 'Salvar';
}

function limparFormularioAula() {
  const modal = getModalAula();
  if (!modal) return;
  delete modal.dataset.editId;
  document.getElementById('aulaModulo').value = '';
  document.getElementById('aulaTitulo').value = '';
  document.getElementById('aulaTipo').value = '';
  document.getElementById('aulaDuracao').value = '10';
  document.getElementById('aulaOrdem').value = '1';
  document.getElementById('aulaURL').value = '';
  window.limparErro('erroAula');
  atualizarTextoModalAula(false);
}

export function ctrlNovaAula() {
  limparFormularioAula();
  window.abrirModal('modalAula');
}

export function ctrlEditarAula(id) {
  const modal = getModalAula();
  if (!modal) return;
  modal.dataset.editId = String(id);
  atualizarTextoModalAula(true);
  window.abrirModal('modalAula');
}

export function popularModalAula() {
  window.popularSelectOpts(
    'aulaModulo',
    moduloServico.listarModulos(),
    modulo => modulo.ID_Modulo,
    modulo => `[Curso #${modulo.ID_Curso}] ${modulo.Titulo} (Ord.${modulo.Ordem})`,
    'Selecione um modulo...'
  );

  const modal = getModalAula();
  const editId = modal?.dataset.editId;
  if (!editId) {
    atualizarTextoModalAula(false);
    return;
  }

  const aula = aulaServico.buscarPorId(editId);
  if (!aula) return;
  document.getElementById('aulaModulo').value = String(aula.ID_Modulo);
  document.getElementById('aulaTitulo').value = aula.Titulo;
  document.getElementById('aulaTipo').value = aula.TipoConteudo;
  document.getElementById('aulaDuracao').value = String(aula.DuracaoMinutos);
  document.getElementById('aulaOrdem').value = String(aula.Ordem);
  document.getElementById('aulaURL').value = aula.URL_Conteudo ?? '';
  atualizarTextoModalAula(true);
}

export function ctrlSalvarAula() {
  window.limparErro('erroAula');

  const modal = getModalAula();
  const editId = modal?.dataset.editId;
  const payload = {
    ID_Modulo: document.getElementById('aulaModulo').value,
    Titulo: document.getElementById('aulaTitulo').value,
    TipoConteudo: document.getElementById('aulaTipo').value,
    URL_Conteudo: document.getElementById('aulaURL').value,
    DuracaoMinutos: document.getElementById('aulaDuracao').value,
    Ordem: document.getElementById('aulaOrdem').value
  };

  try {
    const aula = editId ? aulaServico.atualizar(editId, payload) : aulaServico.salvar(payload);
    limparFormularioAula();
    window.fecharModal('modalAula');
    ctrlRenderAulas();
    if (window.ctrlRenderModulos) window.ctrlRenderModulos();
    window.mostrarToast(editId ? `Aula "${aula.Titulo}" atualizada!` : `Aula "${aula.Titulo}" adicionada!`);
  } catch (error) {
    window.mostrarErro('erroAula', error.message);
  }
}

export function ctrlRenderAulas() {
  const tbody = document.getElementById('bodyAulas');
  const filtroModulo = document.getElementById('filtroModuloAulas');
  if (!tbody || !filtroModulo) return;

  const idModulo = Number(filtroModulo.value);
  if (!idModulo) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Selecione um modulo.</td></tr>';
    return;
  }

  const aulas = aulaServico.listarPorModulo(idModulo);
  if (aulas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhuma aula neste modulo.</td></tr>';
    return;
  }

  const badgeTipo = { 'Vídeo': 'primary', Texto: 'success', Quiz: 'warning' };
  tbody.innerHTML = aulas.map(aula => `
    <tr>
      <td>${aula.Ordem}</td>
      <td>${aula.Titulo}</td>
      <td>${aula.TipoConteudo}</td>
      <td>${aula.DuracaoMinutos} min</td>
      <td class="d-flex gap-1">
        <button class="btn btn-sm btn-outline-primary" onclick="ctrlEditarAula(${aula.ID_Aula})">Editar</button>
        <button class="btn btn-sm btn-outline-danger" onclick="ctrlExcluirAula(${aula.ID_Aula})">Excluir</button>
      </td>
    </tr>`).join('');
}

export function ctrlExcluirAula(id) {
  if (!confirm('Excluir esta aula?')) return;
  aulaServico.excluir(id);
  ctrlRenderAulas();
  if (window.ctrlRenderModulos) window.ctrlRenderModulos();
  window.mostrarToast('Aula removida.', false);
}