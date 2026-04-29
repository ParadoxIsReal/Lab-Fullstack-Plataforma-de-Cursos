import { UsuarioServico } from './servico/UsuarioServico.mjs';
import { CategoriaServico } from './servico/CategoriaServico.mjs';
import { CursoServico } from './servico/CursoServico.mjs';
import { AulaServico } from './servico/AulaServico.mjs';
import { MatriculaServico } from './servico/MatriculaServico.mjs';
import { ModuloServico } from './servico/ModuloServico.mjs';
import { CertificadoServico } from './servico/CertificadoServico.mjs';
import { PlanoServico } from './servico/PlanoServico.mjs';
import { PagamentoServico } from './servico/PagamentoServico.mjs';
import { TrilhaServico } from './servico/TrilhaServico.mjs';

import {
  ctrlNovoUsuario,
  ctrlEditarUsuario,
  ctrlSalvarUsuario,
  ctrlExcluirUsuario,
  ctrlRenderUsuarios
} from './controle/UsuarioControle.mjs';
import {
  ctrlNovaCategoria,
  ctrlEditarCategoria,
  ctrlSalvarCategoria,
  ctrlExcluirCategoria,
  ctrlRenderCategorias
} from './controle/CategoriaControle.mjs';
import {
  ctrlNovoCurso,
  ctrlEditarCurso,
  ctrlSalvarCurso,
  ctrlExcluirCurso,
  ctrlRenderCursos,
  popularFiltroCategorias,
  popularModalCurso,
  popularSelectAulasFiltro,
  popularSelectModulos
} from './controle/CursoControle.mjs';
import {
  ctrlNovoModulo,
  ctrlEditarModulo,
  popularModalModulo,
  ctrlSalvarModulo,
  ctrlRenderModulos,
  ctrlExcluirModulo
} from './controle/ModuloControle.mjs';
import {
  ctrlNovaAula,
  ctrlEditarAula,
  popularModalAula,
  ctrlSalvarAula,
  ctrlRenderAulas,
  ctrlExcluirAula
} from './controle/AulaControle.mjs';
import {
  popularModalMatricula,
  atualizarCursosMatricula,
  ctrlSalvarMatricula,
  ctrlRenderMatriculas,
  ctrlConcluirMatricula,
  ctrlExcluirMatricula
} from './controle/MatriculaControle.mjs';
import {
  popularModalProgresso,
  atualizarAulasProgresso,
  ctrlSalvarProgresso,
  ctrlRenderProgresso,
  ctrlExcluirProgresso
} from './controle/ProgressoControle.mjs';
import {
  popularModalAvaliacao,
  atualizarCursosAvaliacao,
  ctrlSalvarAvaliacao,
  ctrlRenderAvaliacoes,
  ctrlExcluirAvaliacao
} from './controle/AvaliacaoControle.mjs';
import {
  ctrlNovaTrilha,
  ctrlEditarTrilha,
  popularModalTrilha,
  ctrlSalvarTrilha,
  ctrlRenderTrilhas,
  ctrlExcluirTrilha
} from './controle/TrilhaControle.mjs';
import {
  popularModalCertificado,
  atualizarCursosCertificado,
  ctrlSalvarCertificado,
  ctrlRenderCertificados,
  ctrlExcluirCertificado
} from './controle/CertificadoControle.mjs';
import {
  ctrlNovoPlano,
  ctrlEditarPlano,
  ctrlSalvarPlano,
  ctrlRenderPlanos,
  ctrlExcluirPlano
} from './controle/PlanoControle.mjs';
import { ctrlRenderAssinaturas, ctrlExcluirAssinatura } from './controle/AssinaturaControle.mjs';
import {
  popularModalCheckout,
  ctrlAtualizarResumoCheckout,
  ctrlSalvarCheckout,
  ctrlRenderPagamentos
} from './controle/PagamentoControle.mjs';

const usuarioServico = new UsuarioServico();
const categoriaServico = new CategoriaServico();
const cursoServico = new CursoServico();
const moduloServico = new ModuloServico();
const aulaServico = new AulaServico();
const matriculaServico = new MatriculaServico();
const certificadoServico = new CertificadoServico();
const planoServico = new PlanoServico();
const pagamentoServico = new PagamentoServico();
const trilhaServico = new TrilhaServico();

function hoje() {
  return new Date().toISOString().split('T')[0];
}

function formatarData(data) {
  if (!data) return '-';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function mostrarErro(idEl, message) {
  const element = document.getElementById(idEl);
  if (!element) return;
  element.textContent = message;
  element.classList.remove('d-none');
}

function limparErro(idEl) {
  const element = document.getElementById(idEl);
  if (!element) return;
  element.textContent = '';
  element.classList.add('d-none');
}

function abrirModal(idModal) {
  new bootstrap.Modal(document.getElementById(idModal)).show();
}

function fecharModal(idModal) {
  bootstrap.Modal.getInstance(document.getElementById(idModal))?.hide();
}

function mostrarToast(message, success = true) {
  const toastElement = document.getElementById('toastFeedback');
  const messageElement = document.getElementById('toastMsg');
  if (!toastElement || !messageElement) return;

  toastElement.classList.remove('bg-success', 'bg-danger');
  toastElement.classList.add(success ? 'bg-success' : 'bg-danger');
  messageElement.textContent = message;
  new bootstrap.Toast(toastElement, { delay: 3000 }).show();
}

function popularSelectOpts(idEl, items, valueFn, labelFn, placeholder = 'Selecione...') {
  const element = document.getElementById(idEl);
  if (!element) return;
  element.innerHTML = `<option value="">${placeholder}</option>${items
    .map(item => `<option value="${valueFn(item)}">${labelFn(item)}</option>`)
    .join('')}`;
}

function getNomeUsuario(id) {
  return usuarioServico.buscarPorId(id)?.NomeCompleto ?? `#${id}`;
}

function getNomeCategoria(id) {
  return categoriaServico.buscarPorId(id)?.Nome ?? '-';
}

function getNomeCurso(id) {
  return cursoServico.buscarPorId(id)?.Titulo ?? `#${id}`;
}

function getNomePlano(id) {
  return planoServico.buscarPorId(id)?.Nome ?? `#${id}`;
}

function getNomeAula(id) {
  return aulaServico.buscarPorId(id)?.Titulo ?? `#${id}`;
}

function getCurrentPage() {
  return document.body.dataset.page ?? 'dashboard';
}

function resolveSectionUrl(section) {
  const inViewDirectory = window.location.pathname.includes('/view/');
  if (section === 'dashboard') return inViewDirectory ? '../index.html' : 'index.html';
  return inViewDirectory ? `${section}.html` : `view/${section}.html`;
}

function navigate(section) {
  window.location.href = resolveSectionUrl(section);
}

function atualizarNavbarAtiva() {
  const currentPage = getCurrentPage();
  document.querySelectorAll('.nav-link[data-section]').forEach(link => {
    link.classList.toggle('active', link.dataset.section === currentPage);
  });
}

function bindEventIfExists(id, eventName, handler) {
  const element = document.getElementById(id);
  if (element) element.addEventListener(eventName, handler);
}

function renderDashboard() {
  const usuarios = usuarioServico.listar();
  const categorias = categoriaServico.listar();
  const cursos = cursoServico.listar();
  const matriculas = matriculaServico.listar();
  const certificados = certificadoServico.listar();
  const pagamentos = pagamentoServico.listar();

  if (!document.getElementById('dash-usuarios')) return;

  document.getElementById('dash-usuarios').textContent = usuarios.length;
  document.getElementById('dash-categorias').textContent = categorias.length;
  document.getElementById('dash-cursos').textContent = cursos.length;
  document.getElementById('dash-matriculas').textContent = matriculas.length;
  document.getElementById('dash-certificados').textContent = certificados.length;
  document.getElementById('dash-pagamentos').textContent = pagamentos.length;

  const listaUsuarios = document.getElementById('dash-lista-usuarios');
  if (listaUsuarios) {
    listaUsuarios.innerHTML = usuarios.length === 0
      ? '<li class="list-group-item text-muted small">Nenhum usuario cadastrado.</li>'
      : [...usuarios].reverse().slice(0, 5).map(usuario => `
          <li class="list-group-item d-flex justify-content-between">
            <span>${usuario.NomeCompleto}</span>
            <small class="text-muted">${formatarData(usuario.DataCadastro)}</small>
          </li>`).join('');
  }

  const listaCursos = document.getElementById('dash-lista-cursos');
  if (listaCursos) {
    listaCursos.innerHTML = cursos.length === 0
      ? '<li class="list-group-item text-muted small">Nenhum curso cadastrado.</li>'
      : [...cursos].reverse().slice(0, 5).map(curso => `
          <li class="list-group-item d-flex justify-content-between">
            <span>${curso.Titulo}</span>
            <span class="badge bg-secondary">${curso.Nivel}</span>
          </li>`).join('');
  }
}

function renderCurrentPage() {
  renderDashboard();

  const currentPage = getCurrentPage();
  if (currentPage === 'dashboard') return;
  if (currentPage === 'usuarios') return ctrlRenderUsuarios(document.getElementById('searchUsuarios')?.value ?? '');
  if (currentPage === 'categorias') return ctrlRenderCategorias();
  if (currentPage === 'cursos') {
    popularFiltroCategorias();
    return ctrlRenderCursos();
  }
  if (currentPage === 'conteudo') {
    popularSelectModulos();
    popularSelectAulasFiltro();
    ctrlRenderModulos();
    return ctrlRenderAulas();
  }
  if (currentPage === 'trilhas') return ctrlRenderTrilhas();
  if (currentPage === 'matriculas') return ctrlRenderMatriculas();
  if (currentPage === 'progressos') {
    ctrlRenderProgresso();
    return ctrlRenderAvaliacoes();
  }
  if (currentPage === 'certificados') return ctrlRenderCertificados();
  if (currentPage === 'financeiro') {
    ctrlRenderPlanos();
    ctrlRenderAssinaturas();
    return ctrlRenderPagamentos();
  }
}

function initializeApp() {
  atualizarNavbarAtiva();

  const dashboardLinks = {
    'dash-card-usuarios': 'usuarios',
    'dash-card-categorias': 'categorias',
    'dash-card-cursos': 'cursos',
    'dash-card-matriculas': 'matriculas',
    'dash-card-certificados': 'certificados',
    'dash-card-pagamentos': 'financeiro'
  };
  Object.entries(dashboardLinks).forEach(([id, section]) => {
    bindEventIfExists(id, 'click', () => navigate(section));
  });

  bindEventIfExists('modalCurso', 'show.bs.modal', popularModalCurso);
  bindEventIfExists('modalModulo', 'show.bs.modal', popularModalModulo);
  bindEventIfExists('modalAula', 'show.bs.modal', popularModalAula);
  bindEventIfExists('modalTrilha', 'show.bs.modal', popularModalTrilha);
  bindEventIfExists('modalMatricula', 'show.bs.modal', popularModalMatricula);
  bindEventIfExists('modalProgresso', 'show.bs.modal', popularModalProgresso);
  bindEventIfExists('modalAvaliacao', 'show.bs.modal', popularModalAvaliacao);
  bindEventIfExists('modalCertificado', 'show.bs.modal', popularModalCertificado);
  bindEventIfExists('modalCheckout', 'show.bs.modal', popularModalCheckout);

  bindEventIfExists('btnFiltrarCursos', 'click', ctrlRenderCursos);
  bindEventIfExists('filtroCursoModulos', 'change', ctrlRenderModulos);
  bindEventIfExists('filtroModuloAulas', 'change', ctrlRenderAulas);
  bindEventIfExists('searchUsuarios', 'input', event => ctrlRenderUsuarios(event.target.value));
  bindEventIfExists('searchCertificados', 'input', ctrlRenderCertificados);
  ['ckUsuario', 'ckPlano', 'ckDataInicio'].forEach(id => {
    bindEventIfExists(id, 'change', ctrlAtualizarResumoCheckout);
  });

  renderCurrentPage();
}

Object.assign(window, {
  hoje,
  formatarData,
  mostrarErro,
  limparErro,
  abrirModal,
  fecharModal,
  mostrarToast,
  popularSelectOpts,
  getNomeUsuario,
  getNomeCategoria,
  getNomeCurso,
  getNomePlano,
  getNomeAula,
  renderDashboard,
  renderCurrentPage,
  ctrlNovoUsuario,
  ctrlEditarUsuario,
  ctrlSalvarUsuario,
  ctrlExcluirUsuario,
  ctrlRenderUsuarios,
  ctrlNovaCategoria,
  ctrlEditarCategoria,
  ctrlSalvarCategoria,
  ctrlExcluirCategoria,
  ctrlRenderCategorias,
  ctrlNovoCurso,
  ctrlEditarCurso,
  ctrlSalvarCurso,
  ctrlExcluirCurso,
  ctrlRenderCursos,
  popularFiltroCategorias,
  popularSelectModulos,
  popularSelectAulasFiltro,
  ctrlNovoModulo,
  ctrlEditarModulo,
  ctrlSalvarModulo,
  ctrlRenderModulos,
  ctrlExcluirModulo,
  ctrlNovaAula,
  ctrlEditarAula,
  ctrlSalvarAula,
  ctrlRenderAulas,
  ctrlExcluirAula,
  atualizarCursosMatricula,
  ctrlSalvarMatricula,
  ctrlRenderMatriculas,
  ctrlConcluirMatricula,
  ctrlExcluirMatricula,
  atualizarAulasProgresso,
  ctrlSalvarProgresso,
  ctrlRenderProgresso,
  ctrlExcluirProgresso,
  atualizarCursosAvaliacao,
  ctrlSalvarAvaliacao,
  ctrlRenderAvaliacoes,
  ctrlExcluirAvaliacao,
  ctrlNovaTrilha,
  ctrlEditarTrilha,
  ctrlSalvarTrilha,
  ctrlRenderTrilhas,
  ctrlExcluirTrilha,
  atualizarCursosCertificado,
  ctrlSalvarCertificado,
  ctrlRenderCertificados,
  ctrlExcluirCertificado,
  ctrlNovoPlano,
  ctrlEditarPlano,
  ctrlSalvarPlano,
  ctrlRenderPlanos,
  ctrlExcluirPlano,
  ctrlRenderAssinaturas,
  ctrlExcluirAssinatura,
  ctrlAtualizarResumoCheckout,
  ctrlSalvarCheckout,
  ctrlRenderPagamentos
});

document.addEventListener('DOMContentLoaded', initializeApp);