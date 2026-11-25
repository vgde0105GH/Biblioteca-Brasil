import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Livro } from './livro.entity';
import { LivroDto } from './livro.dto';
import { validarLivro } from './livro.validacao';
import { Retirada } from '../retiradas/retirada.entity';

@Injectable()
export class LivrosService {
  constructor(@InjectRepository(Livro) private readonly livros: Repository<Livro>) {}

  async listar() {
    // Uma retirada sem devolução deixa o exemplar indisponível.
    const livros = await this.livros.createQueryBuilder('livro')
      .leftJoin(Retirada, 'retirada', 'retirada.livro_id = livro.id AND retirada.devolvido_em IS NULL')
      .select('livro.id', 'id').addSelect('livro.titulo', 'titulo')
      .addSelect('livro.autor', 'autor').addSelect('retirada.id', 'retiradaId')
      .orderBy('livro.titulo', 'ASC')
      .getRawMany<{ id: number; titulo: string; autor: string; retiradaId: number | null }>();
    return livros.map(({ retiradaId, ...livro }) => ({ ...livro, disponivel: retiradaId === null }));
  }

  async buscar(id: number) {
    const livro = await this.livros.findOneBy({ id });
    if (!livro) throw new NotFoundException('Livro não encontrado.');
    return livro;
  }

  criar(dados: LivroDto) {
    return this.livros.save(this.livros.create(validarLivro(dados)));
  }
}
