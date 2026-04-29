export class Aula {

  constructor({ ID_Aula, ID_Modulo, Titulo, TipoConteudo, URL_Conteudo, DuracaoMinutos, Ordem }) {
    this.ID_Aula = ID_Aula;
    this.ID_Modulo = ID_Modulo;
    this.Titulo = Titulo;
    this.TipoConteudo = TipoConteudo;
    this.URL_Conteudo = URL_Conteudo;
    this.DuracaoMinutos = DuracaoMinutos;
    this.Ordem = Ordem;
  }

  static validar(data) {
    if (!data.ID_Modulo || !data.Titulo?.trim() || !data.TipoConteudo || !data.URL_Conteudo || !data.DuracaoMinutos || data.Ordem == null) {
      return 'Campos obrigatórios faltando: ID_Modulo, Titulo, TipoConteudo, URL_Conteudo, DuracaoMinutos, Ordem.';
    }
    return null;
  }
}