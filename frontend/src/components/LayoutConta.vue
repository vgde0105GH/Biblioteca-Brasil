<template>
  <div class="pagina-conta">
    <a class="pular-cadastro" href="#formulario-cadastro">Ir para o cadastro</a>
    <header class="topo-conta">
      <a href="#inicio" class="marca-biblioteca" aria-label="Biblioteca Brasil, início">
        <svg class="marca-icone" viewBox="0 0 36 36" aria-hidden="true">
          <path d="M18 11c-3.5-2-7.4-2.1-11-.7v14.8c3.6-1.4 7.5-1.3 11 .7m0-14.8c3.5-2 7.4-2.1 11-.7v14.8c-3.6-1.4-7.5-1.3-11 .7m0-14.8v14.8" />
        </svg>
        <span class="marca-nome">biblioteca<span>brasil</span></span>
      </a>
      <nav aria-label="Navegação do cadastro">
        <span class="rotulo-topo">Cadastro de leitores</span>
        <a class="link-cadastro" href="#formulario-cadastro">Criar minha conta</a>
      </nav>
    </header>
    <main id="inicio" class="conteudo-cadastro">
      <slot />
    </main>
    <footer class="rodape-pagina">
      <span>Biblioteca Brasil</span>
      <span>Cadastro de leitores</span>
    </footer>
  </div>
</template>
<style src="@/assets/conta.css"></style>
