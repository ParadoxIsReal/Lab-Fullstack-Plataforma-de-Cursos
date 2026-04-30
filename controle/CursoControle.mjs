import { CursoServico } from '../servico/CursoServico.mjs';
import { CategoriaServico } from '../servico/CategoriaServico.mjs';
import { UsuarioServico } from '../servico/UsuarioServico.mjs';
import { ModuloServico } from '../servico/ModuloServico.mjs';

const cursoServico = new CursoServico();
const categoriaServico = new CategoriaServico();
const usuarioServico = new UsuarioServico();
const moduloServico = new ModuloServico();

// Retorna o modal de curso que está na página
function getModalCurso() {
  return document.getElementById('modalCurso');
}

// Atualiza o título e o botão do modal de curso conforme criacao ou edicao
function atualizarTextoModalCurso(edicao = false) {
  const modal = getModalCurso();
  if (!modal) return;
  modal.querySelector('.modal-title').textContent = edicao ? 'Editar Curso' : 'Novo Curso';
  modal.querySelector('.modal-footer .btn-primary').textContent = edicao ? 'Atualizar' : 'Salvar';
}

// Limpa todos os campos do formulário do curso
function limparFormularioCurso() {
  const modal = getModalCurso();
  if (!modal) return;
  delete modal.dataset.editId;
  document.getElementById('curTitulo').value = '';
  document.getElementById('curDesc').value = '';
  document.getElementById('curInstrutor').value = '';
  document.getElementById('curCategoria').value = '';
  document.getElementById('curNivel').value = '';
  document.getElementById('curTotalAulas').value = '0';
  document.getElementById('curTotalHoras').value = '0';
  document.getElementById('curDataPublicacao').value = '';
  window.limparErro('erroCurso');
  atualizarTextoModalCurso(false);
}

// Prepara o modal para criar um novo curso
export function ctrlNovoCurso() {
  limparFormularioCurso();
  window.abrirModal('modalCurso');
}

// Abre o modal de curso para edição de um curso existente
export function ctrlEditarCurso(id) {
  const modal = getModalCurso();
  if (!modal) return;
  modal.dataset.editId = String(id);
  atualizarTextoModalCurso(true);
  window.abrirModal('modalCurso');
}

// Preenche o filtro de categorias na lista de cursos
export function popularFiltroCategorias() {
  window.popularSelectOpts(
    'filtroCursoCategoria',
    categoriaServico.listar(),
    categoria => categoria.ID_Categoria,
    categoria => categoria.Nome,
    'Todas as categorias'
  );
}

// Preenche as opções do modal de curso com instrutores e categorias
export function popularModalCurso() {
  window.popularSelectOpts(
    'curInstrutor',
    usuarioServico.listarInstrutores(),
    usuario => usuario.ID_Usuario,
    usuario => usuario.NomeCompleto,
    'Selecione instrutor...'
  );
  window.popularSelectOpts(
    'curCategoria',
    categoriaServico.listar(),
    categoria => categoria.ID_Categoria,
    categoria => categoria.Nome,
    'Selecione categoria...'
  );

  const modal = getModalCurso();
  const editId = modal?.dataset.editId;
  if (!editId) {
    atualizarTextoModalCurso(false);
    return;
  }

  const curso = cursoServico.buscarPorId(editId);
  if (!curso) return;
  document.getElementById('curTitulo').value = curso.Titulo;
  document.getElementById('curDesc').value = curso.Descricao;
  document.getElementById('curInstrutor').value = String(curso.ID_Instrutor);
  document.getElementById('curCategoria').value = String(curso.ID_Categoria);
  document.getElementById('curNivel').value = curso.Nivel;
  document.getElementById('curTotalAulas').value = String(curso.TotalAulas);
  document.getElementById('curTotalHoras').value = String(curso.TotalHoras);
  document.getElementById('curDataPublicacao').value = curso.DataPublicacao;
  atualizarTextoModalCurso(true);
}

// Salva um novo curso ou atualiza um curso existente
export function ctrlSalvarCurso() {
  window.limparErro('erroCurso');

  const modal = getModalCurso();
  const editId = modal?.dataset.editId;
  const payload = {
    Titulo: document.getElementById('curTitulo').value,
    Descricao: document.getElementById('curDesc').value,
    ID_Instrutor: document.getElementById('curInstrutor').value,
    ID_Categoria: document.getElementById('curCategoria').value,
    Nivel: document.getElementById('curNivel').value,
    DataPublicacao: document.getElementById('curDataPublicacao').value,
    TotalAulas: document.getElementById('curTotalAulas').value,
    TotalHoras: document.getElementById('curTotalHoras').value
  };

  try {
    const curso = editId ? cursoServico.atualizar(editId, payload) : cursoServico.salvar(payload);
    limparFormularioCurso();
    window.fecharModal('modalCurso');
    ctrlRenderCursos();
    window.renderDashboard();
    window.mostrarToast(editId ? `Curso "${curso.Titulo}" atualizado!` : `Curso "${curso.Titulo}" cadastrado!`);
  } catch (error) {
    window.mostrarErro('erroCurso', error.message);
  }
}

// Mostra os cursos na tela, usando os filtros selecionados
export function ctrlRenderCursos() {
  const grid = document.getElementById('gridCursos');
  if (!grid) return;

  const cursos = cursoServico.listarFiltrado({
    ID_Categoria: document.getElementById('filtroCursoCategoria')?.value ?? '',
    Nivel: document.getElementById('filtroCursoNivel')?.value ?? ''
  });

  if (cursos.length === 0) {
    grid.innerHTML = '<div class="col-12"><p class="text-muted">Nenhum curso cadastrado.</p></div>';
    return;
  }

  grid.innerHTML = cursos.map(curso => `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span class="fw-semibold text-truncate me-2">${curso.Titulo}</span>
          <span>${curso.Nivel}</span>
        </div>
        <div class="card-body">
          <p class="card-text text-muted small mb-2">${curso.Descricao}</p>
          <ul class="list-unstyled small mb-0">
            <li><strong>Categoria:</strong> ${window.getNomeCategoria(curso.ID_Categoria)}</li>
            <li><strong>Instrutor:</strong> ${window.getNomeUsuario(curso.ID_Instrutor)}</li>
            <li><strong>Aulas:</strong> ${curso.TotalAulas} | <strong>Horas:</strong> ${curso.TotalHoras}h</li>
            <li><strong>Publicacao:</strong> ${window.formatarData(curso.DataPublicacao)}</li>
          </ul>
        </div>
        <div class="card-footer d-flex justify-content-end gap-2">
          <button class="btn btn-sm btn-outline-primary" onclick="ctrlEditarCurso(${curso.ID_Curso})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="ctrlExcluirCurso(${curso.ID_Curso})">Excluir</button>
        </div>
      </div>
    </div>`).join('');
}

// Remove um curso após a confirmação e atualiza a lista
export function ctrlExcluirCurso(id) {
  if (!confirm('Excluir este curso?')) return;
  cursoServico.excluir(id);
  ctrlRenderCursos();
  window.renderDashboard();
  window.mostrarToast('Curso removido.', false);
}

// Preenche o filtro de módulos com os cursos disponíveis
export function popularSelectModulos() {
  window.popularSelectOpts('filtroCursoModulos', cursoServico.listar(), curso => curso.ID_Curso, curso => curso.Titulo, 'Selecione um curso...');
}

// Preenche o filtro de aulas com os módulos existentes
export function popularSelectAulasFiltro() {
  window.popularSelectOpts(
    'filtroModuloAulas',
    moduloServico.listarModulos(),
    modulo => modulo.ID_Modulo,
    modulo => `[Curso #${modulo.ID_Curso}] ${modulo.Titulo} (Ord.${modulo.Ordem})`,
    'Selecione um modulo...'
  );
}