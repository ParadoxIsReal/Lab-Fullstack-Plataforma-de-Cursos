import { Progresso } from '../modelo/Progresso.mjs';

const KEY = 'progressos';

export class ProgressoServico {
  listar() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  salvar(dados) {
    const payload = {
      ID_Usuario: Number(dados.ID_Usuario),
      ID_Aula: Number(dados.ID_Aula),
      DataConclusao: dados.DataConclusao,
      Status: 'Concluido'
    };

    if (!payload.ID_Usuario) throw new Error('Selecione um aluno.');
    if (!payload.ID_Aula) throw new Error('Selecione uma aula.');
    if (!payload.DataConclusao) throw new Error('Data e obrigatoria.');

    const lista = this.listar();
    if (lista.some(progresso =>
      Number(progresso.ID_Usuario) === payload.ID_Usuario &&
      Number(progresso.ID_Aula) === payload.ID_Aula
    )) {
      throw new Error('Progresso ja registrado para este aluno/aula.');
    }

    const progresso = new Progresso(payload);
    lista.push(progresso);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return progresso;
  }

  excluir(idUsuario, idAula) {
    const lista = this.listar().filter(progresso => !(
        Number(progresso.ID_Usuario) === Number(idUsuario) &&
        Number(progresso.ID_Aula) === Number(idAula)
      ));
    localStorage.setItem(KEY, JSON.stringify(lista));
  }
}