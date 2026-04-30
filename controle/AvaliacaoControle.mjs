import { UsuarioServico } from '../servico/UsuarioServico.mjs';
import { MatriculaServico } from '../servico/MatriculaServico.mjs';
import { CursoServico } from '../servico/CursoServico.mjs';
import { AvaliacaoServico } from '../servico/AvaliacaoServico.mjs';

const usuarioServico = new UsuarioServico();
const matriculaServico = new MatriculaServico();
const cursoServico = new CursoServico();
const avaliacaoServico = new AvaliacaoServico();

export function atualizarCursosAvaliacao() {
  const selectUsuario = document.getElementById('avalUsuario');
  if (!selectUsuario) return;
  const idUsuario = Number(selectUsuario.value);
  if (Number.isNaN(idUsuario)) {
    window.popularSelectOpts('avalCurso', [], curso => curso.ID_Curso, curso => curso.Titulo, 'Selecione curso...');
    return;
  }

  const idsCursos = matriculaServico.listar()
    .filter(matricula => Number(matricula.ID_Usuario) === Number(idUsuario))
    .map(matricula => matricula.ID_Curso);
  const cursos = cursoServico.listar().filter(curso => idsCursos.includes(curso.ID_Curso));
  window.popularSelectOpts('avalCurso', cursos, curso => curso.ID_Curso, curso => curso.Titulo, 'Selecione curso...');
}

export function popularModalAvaliacao() {
  const idsMatriculados = [...new Set(matriculaServico.listar().map(matricula => matricula.ID_Usuario))];
  const alunos = usuarioServico.listar().filter(usuario => idsMatriculados.includes(usuario.ID_Usuario));
  window.popularSelectOpts('avalUsuario', alunos, usuario => usuario.ID_Usuario, usuario => usuario.NomeCompleto, 'Selecione aluno...');
  atualizarCursosAvaliacao();
  document.getElementById('avalData').value = window.hoje();
  document.getElementById('avalUsuario').onchange = atualizarCursosAvaliacao;
}

export function ctrlSalvarAvaliacao() {
  window.limparErro('erroAvaliacao');

  try {
    avaliacaoServico.salvar({
      ID_Usuario: document.getElementById('avalUsuario').value,
      ID_Curso: document.getElementById('avalCurso').value,
      Nota: document.getElementById('avalNota').value,
      Comentario: document.getElementById('avalComentario').value,
      DataAvaliacao: document.getElementById('avalData').value
    });
    window.fecharModal('modalAvaliacao');
    ctrlRenderAvaliacoes();
    window.mostrarToast('Avaliacao registrada!');
  } catch (error) {
    window.mostrarErro('erroAvaliacao', error.message);
  }
}

export function ctrlRenderAvaliacoes() {
  const tbody = document.getElementById('bodyAvaliacoes');
  if (!tbody) return;

  const avaliacoes = avaliacaoServico.listar();
  if (avaliacoes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhuma avaliacao registrada.</td></tr>';
    return;
  }

  tbody.innerHTML = avaliacoes.map(avaliacao => `
    <tr>
      <td>${window.getNomeUsuario(avaliacao.ID_Usuario)}</td>
      <td>${window.getNomeCurso(avaliacao.ID_Curso)}</td>
      <td>${avaliacao.Nota}/10</td>
      <td>${avaliacao.Comentario || '-'}</td>
      <td>${window.formatarData(avaliacao.DataAvaliacao)}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger" onclick="ctrlExcluirAvaliacao(${avaliacao.ID_Avaliacao})">Excluir</button>
      </td>
    </tr>`).join('');
}

export function ctrlExcluirAvaliacao(id) {
  avaliacaoServico.excluir(id);
  ctrlRenderAvaliacoes();
  window.mostrarToast('Avaliacao removida.', false);
}