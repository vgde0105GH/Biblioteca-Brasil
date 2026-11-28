import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import {
  LessThanOrEqual,
  MoreThan,
  QueryFailedError,
  Repository,
} from "typeorm";
import { validarCadastro } from "./cadastro.validacao";
import {
  CadastroUsuarioDto,
  ContaCriadaDto,
  LoginUsuarioDto,
} from "./usuario.dto";
import { CategoriaConta, Usuario } from "./usuario.entity";

import { SessaoUsuario } from "./sessao-usuario.entity";

export const DURACAO_SESSAO_MS = 24 * 60 * 60 * 1000;
function calcularHashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

const opcoesScrypt = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };

function calcularHashSenha(senha: string, sal: string): Promise<Buffer> {
  return new Promise((resolver, rejeitar) => {
    scrypt(senha, sal, 64, opcoesScrypt, (erro, hash) => {
      if (erro) rejeitar(erro);
      else resolver(hash);
    });
  });
}

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarios: Repository<Usuario>,
    @InjectRepository(SessaoUsuario)
    private readonly sessoes: Repository<SessaoUsuario>,
  ) {}

  async cadastrar(dados: CadastroUsuarioDto): Promise<ContaCriadaDto> {
    const { senha, ...dadosValidados } = validarCadastro(dados);
    const { cpf, email } = dadosValidados;
    const mensagemDuplicidade = "Já existe uma conta com esse CPF ou e-mail.";

    if (await this.usuarios.existsBy([{ cpf }, { email }])) {
      throw new ConflictException(mensagemDuplicidade);
    }

    const sal = randomBytes(16).toString("hex");
    const hash = await calcularHashSenha(senha, sal);
    const categoria = CategoriaConta.Individual;

    try {
      const usuario = await this.usuarios.save({
        ...dadosValidados,
        categoria,
        senhaHash: `${sal}:${hash.toString("hex")}`,
      });
      return { id: usuario.id, categoria };
    } catch (erro) {
      // Os índices únicos cobrem dois cadastros enviados ao mesmo tempo.
      if (
        erro instanceof QueryFailedError &&
        erro.driverError.code === "ER_DUP_ENTRY"
      ) {
        throw new ConflictException(mensagemDuplicidade);
      }
      throw erro;
    }
  }

  async entrar(dados: LoginUsuarioDto, tokenAnterior: string) {
    const email =
      typeof dados?.email === "string" ? dados.email.trim().toLowerCase() : "";
    const senha = typeof dados?.senha === "string" ? dados.senha : "";
    if (!email || email.length > 254 || !senha || [...senha].length > 128)
      throw new UnauthorizedException("E-mail ou senha inválidos.");
    const usuario = await this.usuarios.findOne({
      where: { email },
      select: { id: true, nome: true, senhaHash: true },
    });
    const partes = usuario?.senhaHash.match(/^([a-f0-9]{32}):([a-f0-9]{128})$/);
    const hash = await calcularHashSenha(senha, partes?.[1] ?? "0".repeat(32));
    if (
      !timingSafeEqual(
        hash,
        Buffer.from(partes?.[2] ?? "0".repeat(128), "hex"),
      ) ||
      !usuario ||
      !partes
    ) {
      throw new UnauthorizedException("E-mail ou senha inválidos.");
    }
    const token = randomBytes(32).toString("hex");
    await this.sessoes.delete({ expiraEm: LessThanOrEqual(new Date()) });
    await this.sessoes.manager.transaction(async (gerenciador) => {
      const sessoes = gerenciador.getRepository(SessaoUsuario);
      if (tokenAnterior)
        await sessoes.delete({ tokenHash: calcularHashToken(tokenAnterior) });
      await sessoes.insert({
        tokenHash: calcularHashToken(token),
        usuario: { id: usuario.id },
        expiraEm: new Date(Date.now() + DURACAO_SESSAO_MS),
      });
    });
    return { token, nome: usuario.nome };
  }

  async consultarSessao(token: string) {
    if (!token) throw new UnauthorizedException();
    const sessao = await this.sessoes.findOne({
      where: {
        tokenHash: calcularHashToken(token),
        expiraEm: MoreThan(new Date()),
      },
      relations: { usuario: true },
      select: { tokenHash: true, usuario: { id: true, nome: true } },
    });
    if (!sessao) throw new UnauthorizedException();
    return { nome: sessao.usuario.nome };
  }

  async sair(token: string) {
    if (token)
      await this.sessoes.delete({ tokenHash: calcularHashToken(token) });
  }
}
