import { UsuarioServico } from '../servico/UsuarioServico.mjs';
import { CursoServico } from '../servico/CursoServico.mjs';
import { MatriculaServico } from '../servico/MatriculaServico.mjs';

const usuarioServico = new UsuarioServico();
const cursoServico = new CursoServico();
const matriculaServico = new MatriculaServico();

export function atualizarCursosMatricula() {
  const selectUsuario = document.getElementById('matUsuario');
  if (!selectUsuario) return;
  const idUsuario = Number(selectUsuario.value);
  const cursosDisponiveis = Number.isNaN(idUsuario)
    ? cursoServico.listar()
    : cursoServico.listar().filter(curso => Number(curso.ID_Instrutor) !== Number(idUsuario));
  window.popularSelectOpts('matCurso', cursosDisponiveis, curso => curso.ID_Curso, curso => curso.Titulo, 'Selecione curso...');
}

export function popularModalMatricula() {
  window.popularSelectOpts('matUsuario', usuarioServico.listar(), usuario => usuario.ID_Usuario, usuario => usuario.NomeCompleto, 'Selecione aluno...');
  atualizarCursosMatricula();
  document.getElementById('matData').value = window.hoje();
  document.getElementById('matUsuario').onchange = atualizarCursosMatricula;
}

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
    window.mostrarToast('Matricula realizada!');
  } catch (error) {
    window.mostrarErro('erroMatricula', error.message);
  }
}

export function ctrlRenderMatriculas() {
  const tbody = document.getElementById('bodyMatriculas');
  if (!tbody) return;

  const matriculas = matriculaServico.listar();
  if (matriculas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhuma matricula registrada.</td></tr>';
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

export function ctrlConcluirMatricula(id) {
  matriculaServico.concluir(id);
  ctrlRenderMatriculas();
  window.mostrarToast('Matricula concluida!');
}

export function ctrlExcluirMatricula(id) {
  if (!confirm('Excluir esta matricula?')) return;
  matriculaServico.excluir(id);
  ctrlRenderMatriculas();
  window.renderDashboard();
  window.mostrarToast('Matricula removida.', false);
}