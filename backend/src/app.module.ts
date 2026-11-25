import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SituacaoController } from './situacao.controller';
import { LivrosModule } from './livros/livros.module';
import { RetiradasModule } from './retiradas/retiradas.module';
import { UsuariosModule } from './usuarios/usuarios.module';

// Dados do banco: vêm do arquivo .env, entregue pelo Docker
function lerVariavel(nome: string): string {
  const valor = process.env[nome];
  if (!valor) {
    throw new Error(`Variável ${nome} não encontrada. Confira o arquivo .env`);
  }
  return valor;
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: lerVariavel('DB_HOST'),
        port: Number(process.env.DB_PORT ?? 3306),
        username: lerVariavel('DB_USER'),
        password: lerVariavel('DB_PASSWORD'),
        database: lerVariavel('DB_NAME'),
        // registra sozinho as entidades usadas nos módulos (forFeature)
        autoLoadEntities: true,
        // NUNCA alterar as tabelas do alwaysdata automaticamente
        synchronize: false,
      }),
    }),
    LivrosModule,
    RetiradasModule,
    UsuariosModule,
  ],
  controllers: [SituacaoController],
})
export class AppModule {}
