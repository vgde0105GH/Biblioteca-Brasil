import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('livros')
export class Livro {
  @ApiProperty()
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @ApiProperty()
  @Column({ length: 255 })
  titulo!: string;

  @ApiProperty()
  @Column({ length: 150 })
  autor!: string;

  @ApiPropertyOptional({ description: 'Coleção', nullable: true, type: String })
  @Column({ name: 'colecao', type: 'varchar', length: 150, nullable: true })
  colecao!: string | null;

  @ApiPropertyOptional({ description: 'Descrição', nullable: true, type: String })
  @Column({ name: 'descricao', type: 'text', nullable: true })
  descricao!: string | null;

  @ApiPropertyOptional({ description: 'Editora', nullable: true, type: String })
  @Column({ name: 'editora', type: 'varchar', length: 150, nullable: true })
  editora!: string | null;

  @ApiPropertyOptional({ description: 'Ano de publicação', nullable: true, type: Number })
  @Column({ name: 'publicacao_ano', type: 'int', nullable: true })
  publicacaoAno!: number | null;

  @ApiPropertyOptional({ description: 'Mês de publicação', nullable: true, type: Number })
  @Column({ name: 'publicacao_mes', type: 'int', nullable: true })
  publicacaoMes!: number | null;

  @ApiPropertyOptional({ description: 'Dia de publicação', nullable: true, type: Number })
  @Column({ name: 'publicacao_dia', type: 'int', nullable: true })
  publicacaoDia!: number | null;

  @ApiPropertyOptional({ description: 'ISBN 13', nullable: true, type: String })
  @Column({ name: 'isbn13', type: 'varchar', length: 13, nullable: true })
  isbn13!: string | null;

  @ApiPropertyOptional({ description: 'ISBN 10', nullable: true, type: String })
  @Column({ name: 'isbn10', type: 'varchar', length: 10, nullable: true })
  isbn10!: string | null;

  @ApiPropertyOptional({ description: 'Páginas', nullable: true, type: Number })
  @Column({ name: 'paginas', type: 'int', nullable: true })
  paginas!: number | null;

  @ApiPropertyOptional({ description: 'Imagem da capa em base64', nullable: true, type: String })
  @Column({ name: 'capa', type: 'longtext', nullable: true })
  capa!: string | null;
}
