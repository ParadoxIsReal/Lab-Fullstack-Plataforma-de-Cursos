import { UsuarioServico } from '../servico/UsuarioServico.mjs';
import { CursoServico } from '../servico/CursoServico.mjs';
import { MatriculaServico } from '../servico/MatriculaServico.mjs';

const usuarioServico = new UsuarioServico();
const cursoServico = new CursoServico();
const matriculaServico = new MatriculaServico();

// Atualiza os cursos disponíveis para o usuário selecionado
export function atualizarCursosMatricula() {
  const selectUsuario = document.getElementById('matUsuario');
  if (!selectUsuario) return;
  const idUsuario = Number(selectUsuario.value);
  const cursosDisponiveis = Number.isNaN(idUsuario)
    ? cursoServico.listar()
    : cursoServico.listar().filter(curso => Number(curso.ID_Instrutor) !== Number(idUsuario));
  window.popularSelectOpts('matCurso', cursosDisponiveis, curso => curso.ID_Curso, curso => curso.Titulo, 'Selecione curso...');
}

// Prepara o modal de matrícula com alunos e cursos iniciais
export function popularModalMatricula() {
  window.popularSelectOpts('matUsuario', usuarioServico.listar(), usuario => usuario.ID_Usuario, usuario => usuario.NomeCompleto, 'Selecione aluno...');
  atualizarCursosMatricula();
  document.getElementById('matData').value = window.hoje();
  document.getElementById('matUsuario').onchange = atualizarCursosMatricula;
}

// Salva a matrícula escolhida e atualiza a tela
export function ctrlSalvarMatricula() {
  window.limparErro('erroMatricula');

  try {
    matriculaServico.salvar({
      ID_Usuario: document.getElementById('matUsuario').value,
      ID_Curso: document.getElementById('matCurso').value,
      DataMatricula: document.getElementById('matData').value
    }, cursoServico);
    window.fecharModal('modalMatricula');
    ctrlRenderMatriculas();
    window.renderDashboard();
    window.mostrarToast('Matrícula realizada!');
  } catch (error) {
    window.mostrarErro('erroMatricula', error.message);
  }
}

// Mostra todas as matrículas cadastradas na tabela
export function ctrlRenderMatriculas() {
  const tbody = document.getElementById('bodyMatriculas');
  if (!tbody) return;

  const matriculas = matriculaServico.listar();
  if (matriculas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhuma matrícula registrada.</td></tr>';
    return;
  }

  tbody.innerHTML = matriculas.map(matricula => `
    <tr>
      <td>${matricula.ID_Matricula}</td>
      <td>${window.getNomeUsuario(matricula.ID_Usuario)}</td>
      <td>${window.getNomeCurso(matricula.ID_Curso)}</td>
      <td>${window.formatarData(matricula.DataMatricula)}</td>
      <td>${matricula.DataConclusao ? window.formatarData(matricula.DataConclusao) : 'Em andamento'}</td>
      <td class="d-flex gap-1">
        ${!matricula.DataConclusao ? `<button class="btn btn-sm btn-outline-success" onclick="ctrlConcluirMatricula(${matricula.ID_Matricula})">Concluir</button>` : ''}
        <button class="btn btn-sm btn-outline-danger" onclick="ctrlExcluirMatricula(${matricula.ID_Matricula})">Excluir</button>
      </td>
    </tr>`).join('');
}

// Marca a matrícula como concluída e atualiza a lista
export function ctrlConcluirMatricula(id) {
  matriculaServico.concluir(id);
  ctrlRenderMatriculas();
  window.mostrarToast('Matrícula concluída!');
}

// Remove a matrícula após confirmação do usuário
export function ctrlExcluirMatricula(id) {
  if (!confirm('Excluir esta matrícula?')) return;
  matriculaServico.excluir(id);
  ctrlRenderMatriculas();
  window.renderDashboard();
  window.mostrarToast('Matrícula removida.', false);
}