import { Body, Controller, Delete, Get, Header, HttpCode, Post, Req, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse,
  ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import {
  CadastroUsuarioDto, ContaAutenticadaDto, ContaCriadaDto, SessaoUsuarioDto,
} from './usuario.dto';
import { DURACAO_SESSAO_MS, UsuariosService } from './usuarios.service';

import { lerTokenSessao, nomeCookieSessao as nomeCookie } from './sessao-cookie';
const opcoesCookie = { httpOnly: true, sameSite: 'strict', path: '/api' } as const;


@ApiTags('usuários')
@Controller('api/usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma conta de Usuário Individual' })
  @ApiCreatedResponse({ type: ContaCriadaDto })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou categoria indisponível no cadastro público' })
  @ApiConflictResponse({ description: 'CPF ou e-mail já cadastrado' })
  cadastrar(@Body() dados: CadastroUsuarioDto) {
    return this.usuariosService.cadastrar(dados);
  }

  @Post('sessao')
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Entra na conta e abre uma sessão' })
  @ApiOkResponse({ type: ContaAutenticadaDto })
  @ApiUnauthorizedResponse({ description: 'E-mail ou senha inválidos' })
  async entrar(@Body() dados: SessaoUsuarioDto, @Req() requisicao: Request, @Res({ passthrough: true }) resposta: Response) {
    const { token, nome } = await this.usuariosService.entrar(dados, lerTokenSessao(requisicao));
    resposta.clearCookie(nomeCookie, { ...opcoesCookie, path: '/api/usuarios/sessao' });
    resposta.cookie(nomeCookie, token, { ...opcoesCookie, secure: requisicao.secure, maxAge: DURACAO_SESSAO_MS });
    return { nome };
  }

  @Get('sessao')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Consulta a sessão atual' })
  @ApiOkResponse({ type: ContaAutenticadaDto })
  @ApiUnauthorizedResponse({ description: 'Sessão inexistente ou expirada' })
  consultarSessao(@Req() requisicao: Request) {
    return this.usuariosService.consultarSessao(lerTokenSessao(requisicao));
  }

  @Delete('sessao')
  @HttpCode(204)
  @ApiOperation({ summary: 'Encerra a sessão atual' })
  @ApiNoContentResponse()
  async sair(@Req() requisicao: Request, @Res({ passthrough: true }) resposta: Response) {
    await this.usuariosService.sair(lerTokenSessao(requisicao));
    resposta.clearCookie(nomeCookie, { ...opcoesCookie, secure: requisicao.secure });
  }
}
