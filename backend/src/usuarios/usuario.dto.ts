import { ApiProperty } from '@nestjs/swagger';
import { CategoriaConta } from './usuario.entity';

export class CadastroUsuarioDto {
  @ApiProperty({ maxLength: 150, example: 'Leitora de Exemplo' })
  nome!: string;

  @ApiProperty({ format: 'email', maxLength: 254, example: 'leitora@example.com' })
  email!: string;

  @ApiProperty({ example: '529.982.247-25' })
  cpf!: string;

  @ApiProperty({ example: '(11) 99999-1234' })
  telefone!: string;

  @ApiProperty({ format: 'password', minLength: 8, maxLength: 128 })
  senha!: string;

  @ApiProperty({ format: 'password', minLength: 8, maxLength: 128 })
  confirmarSenha!: string;

  @ApiProperty({ enum: [CategoriaConta.Individual] })
  categoria!: CategoriaConta.Individual;
}

export class SessaoUsuarioDto {
  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty({ format: 'password' })
  senha!: string;
}

export class ContaCriadaDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ enum: [CategoriaConta.Individual] })
  categoria!: CategoriaConta.Individual;
}

export class ContaAutenticadaDto {
  @ApiProperty()
  nome!: string;
}
