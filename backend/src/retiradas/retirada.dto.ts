import { ApiProperty } from '@nestjs/swagger';

export class RetiradaDto {
  @ApiProperty({ example: 1, minimum: 1 })
  livroId!: number;
}
