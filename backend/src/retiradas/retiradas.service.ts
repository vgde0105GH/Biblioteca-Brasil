import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Livro } from '../livros/livro.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { Retirada } from './retirada.entity';
import { RetiradaDto } from './retirada.dto';

@Injectable()
export class RetiradasService {
  constructor(@InjectRepository(Retirada) private readonly retiradas: Repository<Retirada>) {}

  listar(usuario: Usuario) {
    return this.retiradas.find({
      where: { usuario: { id: usuario.id } },
      relations: { livro: true },
      order: { retiradoEm: 'DESC' },
    });
  }

  async retirar(dados: RetiradaDto, usuario: Usuario) {
    if (!Number.isSafeInteger(dados?.livroId) || dados.livroId < 1) {
      throw new BadRequestException('Informe o exemplar que deseja retirar.');
    }
    return this.retiradas.manager.transaction(async (gerenciador) => {
      // Serializa as retiradas da mesma pessoa para respeitar o limite.
      const conta = await gerenciador.getRepository(Usuario).findOne({
        where: { id: usuario.id }, lock: { mode: 'pessimistic_write' },
      });
      if (!conta) throw new NotFoundException('Conta não encontrada.');
      const quantidadeAtiva = await gerenciador.getRepository(Retirada).countBy({
        usuario: { id: usuario.id }, devolvidoEm: IsNull(),
      });
      if (quantidadeAtiva >= 5) {
        throw new ConflictException('Você já está com 5 livros. Devolva um exemplar antes de retirar outro.');
      }

      // Trava o exemplar até concluir: duas pessoas não retiram o mesmo livro.
      const livro = await gerenciador.getRepository(Livro).findOne({
        where: { id: dados.livroId }, lock: { mode: 'pessimistic_write' },
      });
      if (!livro) throw new NotFoundException('Livro não encontrado.');
      const repositorio = gerenciador.getRepository(Retirada);
      if (await repositorio.findOne({ where: { livro: { id: livro.id }, devolvidoEm: IsNull() }, lock: { mode: 'pessimistic_write' } })) {
        throw new ConflictException('Este exemplar já está retirado.');
      }
      return repositorio.save(repositorio.create({
        livro, usuario: { id: usuario.id }, retiradoEm: new Date(), devolvidoEm: null,
      }));
    });
  }

  async devolver(id: number, usuario: Usuario) {
    // O usuário só pode devolver uma retirada da própria conta.
    const resultado = await this.retiradas.update(
      { id, usuario: { id: usuario.id }, devolvidoEm: IsNull() },
      { devolvidoEm: new Date() },
    );
    if (!resultado.affected) throw new NotFoundException('Retirada ativa não encontrada para sua conta.');
  }
}
