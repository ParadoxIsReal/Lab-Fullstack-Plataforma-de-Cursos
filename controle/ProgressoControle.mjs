import { UsuarioServico } from '../servico/UsuarioServico.mjs';
import { MatriculaServico } from '../servico/MatriculaServico.mjs';
import { ModuloServico } from '../servico/ModuloServico.mjs';
import { CursoServico } from '../servico/CursoServico.mjs';
import { AulaServico } from '../servico/AulaServico.mjs';
import { ProgressoServico } from '../servico/ProgressoServico.mjs';

const usuarioServico = new UsuarioServico();
const matriculaServico = new MatriculaServico();
const moduloServico = new ModuloServico();
const cursoServico = new CursoServico();
const aulaServico = new AulaServico();
const progressoServico = new ProgressoServico();

export function atualizarAulasProgresso() {
  const selectUsuario = document.getElementById('progUsuario');
  if (!selectUsuario) return;
  const idUsuario = Number(selectUsuario.value);
  if (Number.isNaN(idUsuario)) {
    window.popularSelectOpts('progAula', [], aula => aula.ID_Aula, aula => aula.Titulo, 'Selecione aula...');
    return;
  }

  const idsCursos = matriculaServico.listar()
    .filter(matricula => Number(matricula.ID_Usuario) === Number(idUsuario))
    .map(matricula => matricula.ID_Curso);
  const idsModulos = moduloServico.listarModulos()
    .filter(modulo => idsCursos.includes(modulo.ID_Curso))
    .map(modulo => modulo.ID_Modulo);
  const aulas = aulaServico.listar().filter(aula => idsModulos.includes(aula.ID_Modulo));
  window.popularSelectOpts('progAula', aulas, aula => aula.ID_Aula, aula => aula.Titulo, 'Selecione aula...');
}

export function popularModalProgresso() {
  const idsMatriculados = [...new Set(matriculaServico.listar().map(matricula => matricula.ID_Usuario))];
  const alunos = usuarioServico.listar().filter(usuario => idsMatriculados.includes(usuario.ID_Usuario));
  window.popularSelectOpts('progUsuario', alunos, usuario => usuario.ID_Usuario, usuario => usuario.NomeCompleto, 'Selecione aluno...');
  atualizarAulasProgresso();
  document.getElementById('progData').value = window.hoje();
  document.getElementById('progUsuario').onchange = atualizarAulasProgresso;
}

export function ctrlSalvarProgresso() {
  window.limparErro('erroProgresso');

  try {
    progressoServico.salvar({
      ID_Usuario: document.getElementById('progUsuario').value,
      ID_Aula: document.getElementById('progAula').value,
      DataConclusao: document.getElementById('progData').value
    });
    window.fecharModal('modalProgresso');
    ctrlRenderProgresso();
    window.mostrarToast('Progresso registrado!');
  } catch (error) {
    window.mostrarErro('erroProgresso', error.message);
  }
}

export function ctrlRenderProgresso() {
  const tbody = document.getElementById('bodyProgresso');
  if (!tbody) return;

  const progresso = progressoServico.listar();
  if (progresso.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum progresso registrado.</td></tr>';
    return;
  }

  tbody.innerHTML = progresso.map(item => `
    <tr>
      <td>${window.getNomeUsuario(item.ID_Usuario)}</td>
      <td>${window.getNomeAula(item.ID_Aula)}</td>
      <td>${item.Status}</td>
      <td>${window.formatarData(item.DataConclusao)}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger" onclick="ctrlExcluirProgresso(${item.ID_Usuario}, ${item.ID_Aula})">Excluir</button>
      </td>
    </tr>`).join('');
}

export function ctrlExcluirProgresso(idUsuario, idAula) {
  progressoServico.excluir(idUsuario, idAula);
  ctrlRenderProgresso();
  window.mostrarToast('Progresso removido.', false);
}