import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Retirada } from './retirada.entity';
import { RetiradasController } from './retiradas.controller';
import { RetiradasService } from './retiradas.service';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [TypeOrmModule.forFeature([Retirada]), UsuariosModule],
  controllers: [RetiradasController],
  providers: [RetiradasService],
})
export class RetiradasModule {}
