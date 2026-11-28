import { ApiProperty } from "@nestjs/swagger";
import { CategoriaConta } from "./usuario.entity";

export class CadastroUsuarioDto {
  @ApiProperty({ maxLength: 150, example: "Leitora de Exemplo" })
  nome!: string;

  @ApiProperty({
    format: "email",
    maxLength: 254,
    example: "leitora@example.com",
  })
  email!: string;

  @ApiProperty({ example: "529.982.247-25" })
  cpf!: string;

  @ApiProperty({ example: "(11) 99999-1234" })
  telefone!: string;

  @ApiProperty({ example: "90000-000" })
  cep!: string;

  @ApiProperty({ maxLength: 150, example: "Rua das Flores" })
  logradouro!: string;

  @ApiProperty({ maxLength: 20, example: "123" })
  numero!: string;

  @ApiProperty({ maxLength: 100, example: "Apartamento 4", nullable: true })
  complemento!: string | null;

  @ApiProperty({ maxLength: 100, example: "Centro" })
  bairro!: string;

  @ApiProperty({ maxLength: 100, example: "Santa Cruz do Sul" })
  cidade!: string;

  @ApiProperty({ minLength: 2, maxLength: 2, example: "RS" })
  estado!: string;

  @ApiProperty({ format: "password", minLength: 8, maxLength: 128 })
  senha!: string;

  @ApiProperty({ format: "password", minLength: 8, maxLength: 128 })
  confirmarSenha!: string;

  @ApiProperty({ enum: [CategoriaConta.Individual] })
  categoria!: CategoriaConta.Individual;
}

export class ContaCriadaDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ enum: [CategoriaConta.Individual] })
  categoria!: CategoriaConta.Individual;
}

export class LoginUsuarioDto {
  @ApiProperty({ format: "email" }) email!: string;
  @ApiProperty({ format: "password" }) senha!: string;
}
export class ContaAutenticadaDto {
  @ApiProperty() nome!: string;
}
