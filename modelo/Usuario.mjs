export class Usuario {

  constructor({ ID_Usuario, NomeCompleto, Email, SenhaHash, DataCadastro}) {
    this.ID_Usuario = ID_Usuario;
    this.NomeCompleto = NomeCompleto;
    this.Email = Email;
    this.SenhaHash = SenhaHash;
    this.DataCadastro = DataCadastro;
  }

  static validar({ NomeCompleto, Email, Senha }, listaUsuarios = []) {
    if (!NomeCompleto?.trim()) return 'Nome completo é obrigatório.';
    if (!Email?.trim()) return 'E-mail é obrigatório.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) return 'Formato de e-mail inválido.';
    if (listaUsuarios.some(u => u.Email === Email)) return 'E-mail já cadastrado.';
    if (!Senha || Senha.length < 8) return 'Senha deve ter ao menos 8 caracteres.';
    return null;
  }
}