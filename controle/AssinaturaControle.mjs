import { AssinaturaServico } from '../servico/AssinaturaServico.mjs';

const assinaturaServico = new AssinaturaServico();

// Enche a tabela de assinaturas com os dados salvos
export function ctrlRenderAssinaturas() {
  const tbody = document.getElementById('bodyAssinaturas');
  if (!tbody) return;

  const assinaturas = assinaturaServico.listar();
  if (assinaturas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhuma assinatura.</td></tr>';
    return;
  }

  tbody.innerHTML = assinaturas.map(assinatura => `
    <tr>
      <td>${window.getNomeUsuario(assinatura.ID_Usuario)}</td>
      <td>${window.getNomePlano(assinatura.ID_Plano)}</td>
      <td>${window.formatarData(assinatura.DataInicio)}</td>
      <td>${window.formatarData(assinatura.DataFim)}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger" onclick="ctrlExcluirAssinatura(${assinatura.ID_Assinatura})">Cancelar</button>
      </td>
    </tr>`).join('');
}

// Apaga uma assinatura após pedir confirmação ao usuário
export function ctrlExcluirAssinatura(id) {
  if (!confirm('Cancelar esta assinatura?')) return;
  assinaturaServico.excluir(id);
  ctrlRenderAssinaturas();
  window.mostrarToast('Assinatura cancelada.', false);
}