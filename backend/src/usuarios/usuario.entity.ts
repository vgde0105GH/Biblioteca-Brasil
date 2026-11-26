import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum CategoriaConta {
  Individual = 'individual',
  Institucional = 'institucional',
  Funcionario = 'funcionario',
  Admin = 'admin',
  Dev = 'dev',
}

@Entity('usuarios')
export class Usuario {
  @ApiProperty()
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @ApiProperty()
  @Column({ length: 150 })
  nome!: string;

  @ApiProperty()
  @Column({ length: 254, unique: true })
  email!: string;

  @ApiProperty()
  @Column({ type: 'char', length: 11, unique: true })
  cpf!: string;

  @ApiProperty()
  @Column({ length: 11 })
  telefone!: string;

  @ApiProperty()
  @Column({ type: 'char', length: 8 })
  cep!: string;

  @ApiProperty()
  @Column({ length: 150 })
  logradouro!: string;

  @ApiProperty()
  @Column({ length: 20 })
  numero!: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  complemento!: string | null;

  @ApiProperty()
  @Column({ length: 100 })
  bairro!: string;

  @ApiProperty()
  @Column({ length: 100 })
  cidade!: string;

  @ApiProperty()
  @Column({ type: 'char', length: 2 })
  estado!: string;

  @Column({ name: 'senha_hash', length: 161, select: false })
  senhaHash!: string;

  @ApiProperty({ enum: CategoriaConta })
  @Column({ type: 'enum', enum: CategoriaConta })
  categoria!: CategoriaConta;
}
