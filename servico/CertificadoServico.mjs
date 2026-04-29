import { Certificado } from '../modelo/Certificado.mjs';
import { MatriculaServico } from './MatriculaServico.mjs';

const KEY = 'certificados';

function gerarCodigo() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export class CertificadoServico {
  constructor() {
    this.matriculaServico = new MatriculaServico();
  }

  listar() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  salvar(dados) {
    const payload = {
      ID_Usuario: Number(dados.ID_Usuario),
      ID_Curso: Number(dados.ID_Curso),
      ID_Trilha: dados.ID_Trilha ? Number(dados.ID_Trilha) : null,
      DataEmissao: dados.DataEmissao
    };

    if (!payload.ID_Usuario) throw new Error('Selecione um aluno.');
    if (!payload.ID_Curso) throw new Error('Selecione um curso.');
    if (!payload.DataEmissao) throw new Error('Data de emissao e obrigatoria.');

    const matriculaConcluida = this.matriculaServico.listarConcluidas().some(matricula =>
      Number(matricula.ID_Usuario) === payload.ID_Usuario &&
      Number(matricula.ID_Curso) === payload.ID_Curso
    );
    if (!matriculaConcluida) {
      throw new Error('Certificados so podem ser emitidos para cursos concluidos.');
    }

    const lista = this.listar();
    if (lista.some(certificado =>
      Number(certificado.ID_Usuario) === payload.ID_Usuario &&
      Number(certificado.ID_Curso) === payload.ID_Curso &&
      Number(certificado.ID_Trilha ?? 0) === Number(payload.ID_Trilha ?? 0)
    )) {
      throw new Error('Certificado ja emitido para este aluno/curso.');
    }

    let codigo = gerarCodigo();
    while (lista.some(certificado => certificado.CodigoVerificacao === codigo)) {
      codigo = gerarCodigo();
    }

    const certificado = new Certificado({
      ID_Certificado: this.#proximoId(),
      ...payload,
      CodigoVerificacao: codigo
    });
    lista.push(certificado);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return certificado;
  }

  filtrarPorCodigo(codigo = '') {
    const termo = codigo.trim().toUpperCase();
    if (!termo) return this.listar();
    return this.listar().filter(certificado => certificado.CodigoVerificacao.includes(termo));
  }

  excluir(id) {
    const lista = this.listar().filter(certificado => Number(certificado.ID_Certificado) !== Number(id));
    localStorage.setItem(KEY, JSON.stringify(lista));
  }

  #proximoId() {
    const lista = this.listar();
    if (lista.length === 0) return 1;
    return Math.max(...lista.map(certificado => Number(certificado.ID_Certificado) || 0)) + 1;
  }
}