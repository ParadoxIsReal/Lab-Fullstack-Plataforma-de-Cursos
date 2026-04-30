import { UsuarioServico } from '../servico/UsuarioServico.mjs';

const usuarioServico = new UsuarioServico();

function getModalUsuario() {
  return document.getElementById('modalUsuario');
}

function atualizarTextoModalUsuario(edicao = false) {
  const modal = getModalUsuario();
  if (!modal) return;
  modal.querySelector('.modal-title').textContent = edicao ? 'Editar Usuário' : 'Novo Usuário';
  modal.querySelector('.modal-footer .btn-primary').textContent = edicao ? 'Atualizar' : 'Salvar';
  const senhaInput = document.getElementById('uSenha');
  if (senhaInput) {
    senhaInput.placeholder = edicao ? '(sem alteracao)' : 'Mínimo 8 caracteres';
  }
}

function limparFormularioUsuario() {
  const modal = getModalUsuario();
  if (!modal) return;
  delete modal.dataset.editId;
  document.getElementById('uNome').value = '';
  document.getElementById('uEmail').value = '';
  document.getElementById('uSenha').value = '';
  window.limparErro('erroUsuario');
  atualizarTextoModalUsuario(false);
}

export function ctrlNovoUsuario() {
  limparFormularioUsuario();
  window.abrirModal('modalUsuario');
}

export function ctrlEditarUsuario(id) {
  const usuario = usuarioServico.buscarPorId(id);
  if (!usuario) return;
  limparFormularioUsuario();
  const modal = getModalUsuario();
  modal.dataset.editId = String(id);
  document.getElementById('uNome').value = usuario.NomeCompleto;
  document.getElementById('uEmail').value = usuario.Email;
  atualizarTextoModalUsuario(true);
  window.abrirModal('modalUsuario');
}

export function ctrlSalvarUsuario() {
  window.limparErro('erroUsuario');

  const modal = getModalUsuario();
  const editId = modal?.dataset.editId;
  const payload = {
    NomeCompleto: document.getElementById('uNome').value.trim(),
    Email: document.getElementById('uEmail').value.trim(),
    Senha: document.getElementById('uSenha').value
  };

  try {
    const usuario = editId
      ? usuarioServico.atualizar(editId, payload)
      : usuarioServico.salvar(payload);

    limparFormularioUsuario();
    window.fecharModal('modalUsuario');
    ctrlRenderUsuarios(document.getElementById('searchUsuarios')?.value ?? '');
    window.renderDashboard();
    window.mostrarToast(editId
      ? `Usuario "${usuario.NomeCompleto}" atualizado com sucesso!`
      : `Usuario "${usuario.NomeCompleto}" cadastrado com sucesso!`);
  } catch (error) {
    window.mostrarErro('erroUsuario', error.message);
  }
}

export function ctrlRenderUsuarios(filtro = '') {
  const tbody = document.getElementById('bodyUsuarios');
  if (!tbody) return;

  const usuarios = usuarioServico.buscarPorTexto(filtro);
  if (usuarios.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum registro encontrado.</td></tr>';
    return;
  }

  tbody.innerHTML = usuarios.map(usuario => `
    <tr>
      <td>${usuario.ID_Usuario}</td>
      <td>${usuario.NomeCompleto}</td>
      <td>${usuario.Email}</td>
      <td>-</td>
      <td>${window.formatarData(usuario.DataCadastro)}</td>
      <td class="d-flex gap-1">
        <button class="btn btn-sm btn-outline-primary" onclick="ctrlEditarUsuario(${usuario.ID_Usuario})">Editar</button>
        <button class="btn btn-sm btn-outline-danger" onclick="ctrlExcluirUsuario(${usuario.ID_Usuario})">Excluir</button>
      </td>
    </tr>`).join('');
}

export function ctrlExcluirUsuario(id) {
  if (!confirm('Excluir este usuario?')) return;
  usuarioServico.excluir(id);
  ctrlRenderUsuarios(document.getElementById('searchUsuarios')?.value ?? '');
  window.renderDashboard();
  window.mostrarToast('Usuario removido.', false);
}