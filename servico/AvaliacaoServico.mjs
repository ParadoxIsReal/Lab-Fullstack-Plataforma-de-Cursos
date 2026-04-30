import { Avaliacao } from '../modelo/Avaliacao.mjs';

const KEY = 'avaliacoes';

export class AvaliacaoServico {
  listar() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  salvar(dados) {
    const payload = {
      ID_Usuario: Number(dados.ID_Usuario),
      ID_Curso: Number(dados.ID_Curso),
      Nota: Number(dados.Nota),
      Comentario: dados.Comentario?.trim() ?? '',
      DataAvaliacao: dados.DataAvaliacao
    };

    if (!payload.ID_Usuario) throw new Error('Selecione um aluno.');
    if (!payload.ID_Curso) throw new Error('Selecione um curso.');
    if (!payload.Nota || payload.Nota < 0 || payload.Nota > 10) throw new Error('Nota deve ser entre 0 e 10.');
    if (!payload.DataAvaliacao) throw new Error('Data e obrigatoria.');

    const avaliacao = new Avaliacao({ ID_Avaliacao: this.#proximoId(), ...payload });
    const lista = this.listar();
    lista.push(avaliacao);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return avaliacao;
  }

  excluir(id) {
    const lista = this.listar().filter(avaliacao => Number(avaliacao.ID_Avaliacao) !== Number(id));
    localStorage.setItem(KEY, JSON.stringify(lista));
  }

  #proximoId() {
    const lista = this.listar();
    if (lista.length === 0) return 1;
    return Math.max(...lista.map(avaliacao => Number(avaliacao.ID_Avaliacao) || 0)) + 1;
  }
}