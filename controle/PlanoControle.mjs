import { PlanoServico } from '../servico/PlanoServico.mjs';

const planoServico = new PlanoServico();

function getModalPlano() {
  return document.getElementById('modalPlano');
}

function atualizarTextoModalPlano(edicao = false) {
  const modal = getModalPlano();
  if (!modal) return;
  modal.querySelector('.modal-title').textContent = edicao ? 'Editar Plano' : 'Novo Plano';
  modal.querySelector('.modal-footer .btn-primary').textContent = edicao ? 'Atualizar' : 'Salvar';
}

function limparFormularioPlano() {
  const modal = getModalPlano();
  if (!modal) return;
  delete modal.dataset.editId;
  document.getElementById('plNome').value = '';
  document.getElementById('plDesc').value = '';
  document.getElementById('plPreco').value = '';
  document.getElementById('plDuracao').value = '1';
  window.limparErro('erroPlano');
  atualizarTextoModalPlano(false);
}

export function ctrlNovoPlano() {
  limparFormularioPlano();
  window.abrirModal('modalPlano');
}

export function ctrlEditarPlano(id) {
  const plano = planoServico.buscarPorId(id);
  if (!plano) return;
  limparFormularioPlano();
  const modal = getModalPlano();
  modal.dataset.editId = String(id);
  document.getElementById('plNome').value = plano.Nome;
  document.getElementById('plDesc').value = plano.Descricao ?? '';
  document.getElementById('plPreco').value = String(plano.Preco);
  document.getElementById('plDuracao').value = String(plano.DuracaoMeses);
  atualizarTextoModalPlano(true);
  window.abrirModal('modalPlano');
}

export function ctrlSalvarPlano() {
  window.limparErro('erroPlano');

  const modal = getModalPlano();
  const editId = modal?.dataset.editId;
  const payload = {
    Nome: document.getElementById('plNome').value,
    Descricao: document.getElementById('plDesc').value,
    Preco: document.getElementById('plPreco').value,
    DuracaoMeses: document.getElementById('plDuracao').value
  };

  try {
    const plano = editId ? planoServico.atualizar(editId, payload) : planoServico.salvar(payload);
    limparFormularioPlano();
    window.fecharModal('modalPlano');
    ctrlRenderPlanos();
    window.mostrarToast(editId ? `Plano "${plano.Nome}" atualizado!` : `Plano "${plano.Nome}" criado!`);
  } catch (error) {
    window.mostrarErro('erroPlano', error.message);
  }
}

export function ctrlRenderPlanos() {
  const grid = document.getElementById('gridPlanos');
  if (!grid) return;

  const planos = planoServico.listar();
  if (planos.length === 0) {
    grid.innerHTML = '<div class="col-12"><p class="text-muted">Nenhum plano cadastrado.</p></div>';
    return;
  }

  grid.innerHTML = planos.map(plano => `
    <div class="col-md-4 col-lg-3">
      <div class="card h-100 text-center">
        <div class="card-header fw-bold">${plano.Nome}</div>
        <div class="card-body">
          <h3 class="card-title">R$ ${Number(plano.Preco).toFixed(2).replace('.', ',')}</h3>
          <p class="card-text text-muted small">${plano.DuracaoMeses} mes${plano.DuracaoMeses > 1 ? 'es' : ''} de acesso</p>
          <p class="card-text small">${plano.Descricao || 'Sem descricao.'}</p>
        </div>
        <div class="card-footer d-flex justify-content-center gap-2">
          <button class="btn btn-sm btn-outline-primary" onclick="ctrlEditarPlano(${plano.ID_Plano})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="ctrlExcluirPlano(${plano.ID_Plano})">Excluir</button>
        </div>
      </div>
    </div>`).join('');
}

export function ctrlExcluirPlano(id) {
  if (!confirm('Excluir este plano?')) return;
  planoServico.excluir(id);
  ctrlRenderPlanos();
  window.mostrarToast('Plano removido.', false);
}