import { UsuarioServico } from '../servico/UsuarioServico.mjs';
import { PlanoServico } from '../servico/PlanoServico.mjs';
import { AssinaturaServico } from '../servico/AssinaturaServico.mjs';
import { PagamentoServico } from '../servico/PagamentoServico.mjs';

const usuarioServico = new UsuarioServico();
const planoServico = new PlanoServico();
const assinaturaServico = new AssinaturaServico();
const pagamentoServico = new PagamentoServico();

export function popularModalCheckout() {
  window.popularSelectOpts('ckUsuario', usuarioServico.listar(), usuario => usuario.ID_Usuario, usuario => usuario.NomeCompleto, 'Selecione usuario...');
  window.popularSelectOpts(
    'ckPlano',
    planoServico.listar(),
    plano => plano.ID_Plano,
    plano => `${plano.Nome} - R$ ${Number(plano.Preco).toFixed(2).replace('.', ',')}`,
    'Selecione plano...'
  );
  document.getElementById('ckDataInicio').value = window.hoje();
  const summary = document.getElementById('checkoutSummary');
  if (summary) summary.innerHTML = '<div class="card-body text-muted small">Selecione usuario, plano e data para ver o resumo.</div>';
}

export function ctrlAtualizarResumoCheckout() {
  const idUsuario = Number(document.getElementById('ckUsuario')?.value);
  const idPlano = Number(document.getElementById('ckPlano')?.value);
  const dataInicio = document.getElementById('ckDataInicio')?.value;
  const summary = document.getElementById('checkoutSummary');
  if (!summary) return;

  if (!idUsuario || !idPlano || !dataInicio) {
    summary.innerHTML = '<div class="card-body text-muted small">Selecione usuario, plano e data para ver o resumo.</div>';
    return;
  }

  const usuario = usuarioServico.buscarPorId(idUsuario);
  const plano = planoServico.buscarPorId(idPlano);
  const dataFim = new Date(`${dataInicio}T00:00:00`);
  dataFim.setMonth(dataFim.getMonth() + Number(plano.DuracaoMeses));
  const dataFimString = dataFim.toISOString().split('T')[0];

  summary.innerHTML = `
    <div class="card-body">
      <table class="table table-sm mb-0">
        <tr><th>Usuario</th><td>${usuario.NomeCompleto}</td></tr>
        <tr><th>Plano</th><td>${plano.Nome}</td></tr>
        <tr><th>Duracao</th><td>${plano.DuracaoMeses} mes${plano.DuracaoMeses > 1 ? 'es' : ''}</td></tr>
        <tr><th>Inicio</th><td>${window.formatarData(dataInicio)}</td></tr>
        <tr><th>Vencimento</th><td>${window.formatarData(dataFimString)}</td></tr>
        <tr class="table-success"><th>Total</th><td><strong>R$ ${Number(plano.Preco).toFixed(2).replace('.', ',')}</strong></td></tr>
      </table>
    </div>`;
}

export function ctrlSalvarCheckout() {
  window.limparErro('erroCheckout');

  const idUsuario = Number(document.getElementById('ckUsuario').value);
  const idPlano = Number(document.getElementById('ckPlano').value);
  const dataInicio = document.getElementById('ckDataInicio').value;
  const metodoPagamento = document.getElementById('ckMetodo').value;

  if (!idUsuario) return window.mostrarErro('erroCheckout', 'Selecione um usuario.');
  if (!idPlano) return window.mostrarErro('erroCheckout', 'Selecione um plano.');
  if (!dataInicio) return window.mostrarErro('erroCheckout', 'Data de inicio e obrigatoria.');
  if (!metodoPagamento) return window.mostrarErro('erroCheckout', 'Selecione o metodo de pagamento.');

  const plano = planoServico.buscarPorId(idPlano);
  const dataFim = new Date(`${dataInicio}T00:00:00`);
  dataFim.setMonth(dataFim.getMonth() + Number(plano.DuracaoMeses));

  const assinatura = assinaturaServico.salvar({
    ID_Usuario: idUsuario,
    ID_Plano: idPlano,
    DataInicio: dataInicio,
    DataFim: dataFim.toISOString().split('T')[0]
  });
  pagamentoServico.salvar({
    ID_Assinatura: assinatura.ID_Assinatura,
    ValorPago: plano.Preco,
    MetodoPagamento: metodoPagamento
  });

  window.fecharModal('modalCheckout');
  if (window.ctrlRenderAssinaturas) window.ctrlRenderAssinaturas();
  ctrlRenderPagamentos();
  window.renderDashboard();
  window.mostrarToast('Pagamento confirmado! Assinatura ativada.');
}

export function ctrlRenderPagamentos() {
  const tbody = document.getElementById('bodyPagamentos');
  if (!tbody) return;

  const pagamentos = pagamentoServico.listar();
  if (pagamentos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum pagamento.</td></tr>';
    return;
  }

  tbody.innerHTML = pagamentos.map(pagamento => `
    <tr>
      <td>${pagamento.ID_Assinatura}</td>
      <td>R$ ${Number(pagamento.ValorPago).toFixed(2).replace('.', ',')}</td>
      <td>${pagamento.MetodoPagamento}</td>
      <td><code class="small">${pagamento.Id_Transacao_Gateway}</code></td>
      <td>${window.formatarData(pagamento.DataPagamento)}</td>
    </tr>`).join('');
}