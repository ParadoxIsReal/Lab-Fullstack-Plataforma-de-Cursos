import { Usuario } from '../modelo/Usuario.mjs';

const KEY = 'usuarios';

function hoje() {
  return new Date().toISOString().split('T')[0];
}

function hashSenha(senha) {
  let hash = 5381;
  for (let i = 0; i < senha.length; i++) {
    hash = ((hash << 5) + hash) + senha.charCodeAt(i);
  }
  return hash.toString();
}

export class UsuarioServico {
  listar() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  listarInstrutores() {
    return this.listar();
  }

  buscarPorId(id) {
    return this.listar().find(usuario => Number(usuario.ID_Usuario) === Number(id)) ?? null;
  }

  salvar({ NomeCompleto, Email, Senha }) {
    const erro = Usuario.validar({ NomeCompleto, Email, Senha }, this.listar());
    if (erro) throw new Error(erro);

    const usuario = new Usuario({
      ID_Usuario: this.#proximoId(),
      NomeCompleto: NomeCompleto.trim(),
      Email: Email.trim(),
      SenhaHash: hashSenha(Senha),
      DataCadastro: hoje()
    });

    const lista = this.listar();
    lista.push(usuario);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return usuario;
  }

  atualizar(id, { NomeCompleto, Email, Senha }) {
    const atual = this.buscarPorId(id);
    if (!atual) throw new Error('Usuario nao encontrado.');
    if (!NomeCompleto?.trim()) throw new Error('Nome completo e obrigatorio.');
    if (!Email?.trim()) throw new Error('E-mail e obrigatorio.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) throw new Error('Formato de e-mail invalido.');
    if (this.listar().some(usuario => usuario.Email === Email && Number(usuario.ID_Usuario) !== Number(id))) {
      throw new Error('E-mail ja cadastrado.');
    }
    if (Senha && Senha.length < 8) throw new Error('Senha deve ter ao menos 8 caracteres.');

    const usuarioAtualizado = {
      ...atual,
      NomeCompleto: NomeCompleto.trim(),
      Email: Email.trim(),
      SenhaHash: Senha ? hashSenha(Senha) : atual.SenhaHash
    };

    const lista = this.listar().map(usuario => Number(usuario.ID_Usuario) === Number(id) ? usuarioAtualizado : usuario);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return usuarioAtualizado;
  }

  buscarPorTexto(filtro = '') {
    const termo = filtro.trim().toLowerCase();
    if (!termo) return this.listar();
    return this.listar().filter(usuario =>
      usuario.NomeCompleto.toLowerCase().includes(termo) ||
      usuario.Email.toLowerCase().includes(termo)
    );
  }

  excluir(id) {
    const lista = this.listar().filter(usuario => Number(usuario.ID_Usuario) !== Number(id));
    localStorage.setItem(KEY, JSON.stringify(lista));
  }

  #proximoId() {
    const lista = this.listar();
    if (lista.length === 0) return 1;
    return Math.max(...lista.map(usuario => Number(usuario.ID_Usuario) || 0)) + 1;
  }
}