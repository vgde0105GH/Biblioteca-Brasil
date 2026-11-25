import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Livro } from '../livros/livro.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('retiradas')
export class Retirada {
  @ApiProperty()
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @ApiProperty({ type: () => Livro })
  @ManyToOne(() => Livro, { nullable: false })
  @JoinColumn({ name: 'livro_id' })
  livro!: Livro;

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;

  @ApiProperty()
  @Column({ name: 'retirado_em', type: 'datetime' })
  retiradoEm!: Date;

  @ApiProperty({ nullable: true, type: String, format: 'date-time' })
  @Column({ name: 'devolvido_em', type: 'datetime', nullable: true })
  devolvidoEm!: Date | null;
}
