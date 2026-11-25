import { BadRequestException } from '@nestjs/common';
import { LivroDto } from './livro.dto';

function textoOpcional(valor: unknown, limite: number, campo: string): string | null {
  if (valor === null || valor === undefined || valor === '') return null;
  if (typeof valor !== 'string' || valor.trim().length > limite) {
    throw new BadRequestException(`Confira o campo ${campo} (até ${limite} caracteres).`);
  }
  return valor.trim() || null;
}

function numeroOpcional(valor: unknown, minimo: number, maximo: number, campo: string): number | null {
  if (valor === null || valor === undefined || valor === '') return null;
  if (typeof valor !== 'number' || !Number.isInteger(valor) || valor < minimo || valor > maximo) {
    throw new BadRequestException(`Confira o campo ${campo} (${minimo} a ${maximo}).`);
  }
  return valor;
}

export function validarLivro(dados: LivroDto | undefined) {
  const titulo = textoOpcional(dados?.titulo, 255, 'título');
  const autor = textoOpcional(dados?.autor, 150, 'autor');
  if (!titulo || !autor) throw new BadRequestException('Informe título e autor.');
  const colecao = textoOpcional(dados?.colecao, 150, 'coleção');
  const descricao = textoOpcional(dados?.descricao, 5000, 'descrição');
  const editora = textoOpcional(dados?.editora, 150, 'editora');
  const publicacaoAno = numeroOpcional(dados?.publicacaoAno, 1, 9999, 'ano');
  const publicacaoMes = numeroOpcional(dados?.publicacaoMes, 1, 12, 'mês');
  const publicacaoDia = numeroOpcional(dados?.publicacaoDia, 1, 31, 'dia');
  if ((publicacaoMes !== null && publicacaoAno === null) ||
      (publicacaoDia !== null && (publicacaoMes === null || publicacaoAno === null))) {
    throw new BadRequestException('Informe o ano antes do mês e o mês antes do dia.');
  }
  if (publicacaoAno !== null && publicacaoMes !== null && publicacaoDia !== null) {
    const data = new Date(0);
    data.setUTCFullYear(publicacaoAno, publicacaoMes - 1, publicacaoDia);
    if (data.getUTCMonth() !== publicacaoMes - 1) throw new BadRequestException('A data de publicação não existe.');
  }
  const isbn13 = textoOpcional(dados?.isbn13, 13, 'ISBN 13');
  const isbn10 = textoOpcional(dados?.isbn10, 10, 'ISBN 10')?.toUpperCase() ?? null;
  if (isbn13 && !/^\d{13}$/.test(isbn13)) throw new BadRequestException('ISBN 13 deve conter 13 números.');
  if (isbn10 && !/^\d{9}[\dX]$/.test(isbn10)) throw new BadRequestException('ISBN 10 deve conter 9 números e um número ou X.');
  const paginas = numeroOpcional(dados?.paginas, 1, 100000, 'páginas');
  let capa: string | null = null;
  if (dados?.capa) {
    if (typeof dados.capa !== 'string' || dados.capa.length > 2800000) throw new BadRequestException('A capa deve ter até 2 MB.');
    const imagem = dados.capa.match(/^data:image\/(jpeg|png|gif);base64,([A-Za-z0-9+/]+={0,2})$/);
    if (!imagem) throw new BadRequestException('Use uma capa JPG, PNG ou GIF.');
    const bytes = Buffer.from(imagem[2], 'base64');
    const tipo = imagem[1];
    const assinaturaValida = tipo === 'jpeg' ? bytes.subarray(0, 3).equals(Buffer.from([255,216,255]))
      : tipo === 'png' ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
      : ['GIF87a','GIF89a'].includes(bytes.subarray(0, 6).toString('ascii'));
    if (!assinaturaValida || bytes.length > 2 * 1024 * 1024) throw new BadRequestException('Imagem inválida ou maior que 2 MB.');
    capa = dados.capa;
  }
  return { titulo, autor, colecao, descricao, editora, publicacaoAno, publicacaoMes, publicacaoDia, isbn13, isbn10, paginas, capa };
}
