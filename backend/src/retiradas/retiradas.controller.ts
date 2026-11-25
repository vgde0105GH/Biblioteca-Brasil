import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiCookieAuth, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { UsuariosService } from '../usuarios/usuarios.service';
import { lerTokenSessao } from '../usuarios/sessao-cookie';
import { RetiradaDto } from './retirada.dto';
import { Retirada } from './retirada.entity';
import { RetiradasService } from './retiradas.service';

@ApiTags('retiradas')
@ApiCookieAuth('biblioteca_sessao')
@ApiUnauthorizedResponse({ description: 'Entre na sua conta para continuar' })
@Controller('api/retiradas')
export class RetiradasController {
  constructor(private readonly retiradas: RetiradasService, private readonly usuarios: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista as retiradas da conta conectada' })
  @ApiOkResponse({ type: [Retirada] })
  async listar(@Req() requisicao: Request) {
    const usuario = await this.usuarios.obterUsuarioDaSessao(lerTokenSessao(requisicao));
    return this.retiradas.listar(usuario);
  }

  @Post()
  @ApiOperation({ summary: 'Retira um exemplar disponível' })
  @ApiCreatedResponse({ type: Retirada })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'Exemplar indisponível ou limite de 5 retiradas ativas atingido' })
  async retirar(@Body() dados: RetiradaDto, @Req() requisicao: Request) {
    const usuario = await this.usuarios.obterUsuarioDaSessao(lerTokenSessao(requisicao));
    return this.retiradas.retirar(dados, usuario);
  }

  @Patch(':id/devolucao')
  @HttpCode(204)
  @ApiOperation({ summary: 'Registra a devolução de um exemplar da própria conta' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  async devolver(@Param('id', ParseIntPipe) id: number, @Req() requisicao: Request) {
    const usuario = await this.usuarios.obterUsuarioDaSessao(lerTokenSessao(requisicao));
    await this.retiradas.devolver(id, usuario);
  }
}
