import { UsuarioServico } from '../servico/UsuarioServico.mjs';
import { MatriculaServico } from '../servico/MatriculaServico.mjs';
import { CursoServico } from '../servico/CursoServico.mjs';
import { TrilhaServico } from '../servico/TrilhaServico.mjs';
import { CertificadoServico } from '../servico/CertificadoServico.mjs';

const usuarioServico = new UsuarioServico();
const matriculaServico = new MatriculaServico();
const cursoServico = new CursoServico();
const trilhaServico = new TrilhaServico();
const certificadoServico = new CertificadoServico();

function atualizarEstadoEmissaoCertificado(mensagem = '') {
  const selectUsuario = document.getElementById('certUsuario');
  const selectCurso = document.getElementById('certCurso');
  const info = document.getElementById('certInfo');
  const botao = document.getElementById('btnEmitirCertificado');

  if (!selectUsuario || !selectCurso || !info || !botao) return;

  const possuiCursosElegiveis = selectCurso.options.length > 1;
  let texto = mensagem;
  let desabilitado = true;

  if (!selectUsuario.value) {
    texto ||= 'Selecione um usuario com pelo menos um curso concluido.';
  } else if (!possuiCursosElegiveis) {
    texto ||= 'Este usuario ainda nao possui curso concluido disponivel para certificado.';
  } else if (!selectCurso.value) {
    texto ||= 'Selecione um curso concluido para emitir o certificado.';
  } else {
    texto = 'Curso concluido selecionado. Voce ja pode emitir o certificado.';
    desabilitado = false;
  }

  selectCurso.disabled = !possuiCursosElegiveis;
  botao.disabled = desabilitado;
  info.textContent = texto;
}

export function atualizarCursosCertificado() {
  const selectUsuario = document.getElementById('certUsuario');
  if (!selectUsuario) return;
  const idUsuario = Number(selectUsuario.value);
  if (Number.isNaN(idUsuario)) {
    window.popularSelectOpts('certCurso', [], curso => curso.ID_Curso, curso => curso.Titulo, 'Selecione curso...');
    atualizarEstadoEmissaoCertificado();
    return;
  }

  const idsCursos = matriculaServico.listarConcluidasPorUsuario(idUsuario)
    .map(matricula => matricula.ID_Curso);
  const cursos = cursoServico.listar().filter(curso => idsCursos.includes(curso.ID_Curso));
  window.popularSelectOpts('certCurso', cursos, curso => curso.ID_Curso, curso => curso.Titulo, 'Selecione curso...');
  atualizarEstadoEmissaoCertificado(
    cursos.length === 0
      ? 'Este usuario ainda nao possui curso concluido disponivel para certificado.'
      : ''
  );
}

export function popularModalCertificado() {
  const idsMatriculados = [...new Set(
    matriculaServico.listarConcluidas().map(matricula => matricula.ID_Usuario)
  )];
  const alunos = usuarioServico.listar().filter(usuario => idsMatriculados.includes(usuario.ID_Usuario));
  window.popularSelectOpts('certUsuario', alunos, usuario => usuario.ID_Usuario, usuario => usuario.NomeCompleto, 'Selecione aluno...');
  atualizarCursosCertificado();
  window.popularSelectOpts('certTrilha', trilhaServico.listar(), trilha => trilha.ID_Trilha, trilha => trilha.Titulo, '- Nenhuma -');
  document.getElementById('certData').value = window.hoje();
  document.getElementById('certUsuario').onchange = atualizarCursosCertificado;
  document.getElementById('certCurso').onchange = () => atualizarEstadoEmissaoCertificado();
  atualizarEstadoEmissaoCertificado(
    alunos.length === 0
      ? 'Nenhum usuario com curso concluido disponivel para certificado.'
      : ''
  );
}

export function ctrlSalvarCertificado() {
  window.limparErro('erroCertificado');

  try {
    certificadoServico.salvar({
      ID_Usuario: document.getElementById('certUsuario').value,
      ID_Curso: document.getElementById('certCurso').value,
      ID_Trilha: document.getElementById('certTrilha').value,
      DataEmissao: document.getElementById('certData').value
    });
    window.fecharModal('modalCertificado');
    ctrlRenderCertificados();
    window.renderDashboard();
    window.mostrarToast('Certificado emitido com sucesso!');
  } catch (error) {
    window.mostrarErro('erroCertificado', error.message);
  }
}

export function ctrlRenderCertificados() {
  const grid = document.getElementById('gridCertificados');
  const search = document.getElementById('searchCertificados');
  if (!grid || !search) return;

  const certificados = certificadoServico.filtrarPorCodigo(search.value);
  if (certificados.length === 0) {
    grid.innerHTML = '<div class="col-12"><p class="text-muted">Nenhum certificado encontrado.</p></div>';
    return;
  }

  grid.innerHTML = certificados.map(certificado => {
    const trilhaNome = certificado.ID_Trilha ? trilhaServico.buscarPorId(certificado.ID_Trilha)?.Titulo ?? '-' : null;
    return `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h6 class="card-title">${window.getNomeUsuario(certificado.ID_Usuario)}</h6>
            <p class="card-text small text-muted mb-1">Curso: ${window.getNomeCurso(certificado.ID_Curso)}</p>
            ${trilhaNome ? `<p class="card-text small text-muted mb-1">Trilha: ${trilhaNome}</p>` : ''}
            <p class="card-text small mb-1"><strong>Codigo:</strong> <code>${certificado.CodigoVerificacao}</code></p>
            <p class="card-text small text-muted">Emitido em: ${window.formatarData(certificado.DataEmissao)}</p>
          </div>
          <div class="card-footer text-end">
            <button class="btn btn-sm btn-outline-danger" onclick="ctrlExcluirCertificado(${certificado.ID_Certificado})">Revogar</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

export function ctrlExcluirCertificado(id) {
  if (!confirm('Revogar este certificado?')) return;
  certificadoServico.excluir(id);
  ctrlRenderCertificados();
  window.renderDashboard();
  window.mostrarToast('Certificado revogado.', false);
}