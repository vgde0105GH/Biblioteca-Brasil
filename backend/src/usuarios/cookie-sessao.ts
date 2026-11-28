import type { Request } from "express";
export const nomeCookieSessao = "biblioteca_sessao";
export function lerTokenSessao(requisicao: Request): string {
  const cookie = (requisicao.headers.cookie?.split(";") ?? [])
    .map((valor) => valor.trim())
    .find((valor) => valor.startsWith(nomeCookieSessao + "="));
  const token = cookie?.slice(nomeCookieSessao.length + 1) ?? "";
  return /^[a-f0-9]{64}$/.test(token) ? token : "";
}
