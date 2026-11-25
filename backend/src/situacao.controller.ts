import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('situação')
@Controller('api')
export class SituacaoController {
  @Get()
  @ApiOperation({ summary: 'Confere se a API está no ar' })
  @ApiOkResponse({ description: 'API disponível' })
  consultar() {
    return 'API do projeto final no ar!';
  }
}
