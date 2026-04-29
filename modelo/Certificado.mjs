export class Certificado {

  constructor({ ID_Certificado, ID_Usuario, ID_Curso, ID_Trilha = null, CodigoVerificacao, DataEmissao }) {
    this.ID_Certificado = ID_Certificado;
    this.ID_Usuario = ID_Usuario;
    this.ID_Curso = ID_Curso;
    this.ID_Trilha = ID_Trilha;
    this.CodigoVerificacao = CodigoVerificacao;
    this.DataEmissao = DataEmissao;
  }

  static validar(data) {
    if (!data.ID_Usuario || !data.ID_Curso || !data.CodigoVerificacao || !data.DataEmissao) {
      return 'Campos obrigatórios faltando: ID_Usuario, ID_Curso, CodigoVerificacao, DataEmissao.';
    }
    return null;
  }
}