import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LivroDto, LivroDisponivelDto } from './livro.dto';
import { Livro } from './livro.entity';
import { LivrosService } from './livros.service';

@ApiTags('livros')
@Controller('api/livros')
export class LivrosController {
  constructor(private readonly livros: LivrosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista exemplares e disponibilidade para retirada' })
  @ApiOkResponse({ type: [LivroDisponivelDto] })
  listar() { return this.livros.listar(); }

  @Get(':id')
  @ApiOperation({ summary: 'Consulta um exemplar' })
  @ApiOkResponse({ type: Livro })
  @ApiNotFoundResponse()
  buscar(@Param('id', ParseIntPipe) id: number) { return this.livros.buscar(id); }

  @Post()
  @ApiOperation({ summary: 'Cadastra um exemplar no acervo, sem preço' })
  @ApiCreatedResponse({ type: Livro })
  @ApiBadRequestResponse()
  criar(@Body() dados: LivroDto) { return this.livros.criar(dados); }
}
