import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LivroDto {
  @ApiProperty({ example: 'Dom Casmurro', maxLength: 255 })
  titulo!: string;

  @ApiProperty({ example: 'Machado de Assis', maxLength: 150 })
  autor!: string;

  @ApiPropertyOptional({ description: 'Coleção', nullable: true, type: String })
  colecao?: string | null;

  @ApiPropertyOptional({ description: 'Descrição', nullable: true, type: String })
  descricao?: string | null;

  @ApiPropertyOptional({ description: 'Editora', nullable: true, type: String })
  editora?: string | null;

  @ApiPropertyOptional({ description: 'Ano de publicação', nullable: true, type: Number })
  publicacaoAno?: number | null;

  @ApiPropertyOptional({ description: 'Mês de publicação', nullable: true, type: Number })
  publicacaoMes?: number | null;

  @ApiPropertyOptional({ description: 'Dia de publicação', nullable: true, type: Number })
  publicacaoDia?: number | null;

  @ApiPropertyOptional({ description: 'ISBN 13', nullable: true, type: String })
  isbn13?: string | null;

  @ApiPropertyOptional({ description: 'ISBN 10', nullable: true, type: String })
  isbn10?: string | null;

  @ApiPropertyOptional({ description: 'Páginas', nullable: true, type: Number })
  paginas?: number | null;

  @ApiPropertyOptional({ description: 'Imagem da capa em base64', nullable: true, type: String })
  capa?: string | null;
}

export class LivroDisponivelDto {
  @ApiProperty() id!: number;
  @ApiProperty() titulo!: string;
  @ApiProperty() autor!: string;
  @ApiProperty() disponivel!: boolean;
}
