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

  @Column({ name: 'senha_hash', length: 161, select: false })
  senhaHash!: string;

  @ApiProperty({ enum: CategoriaConta })
  @Column({ type: 'enum', enum: CategoriaConta })
  categoria!: CategoriaConta;
}
