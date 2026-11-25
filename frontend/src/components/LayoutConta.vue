<script setup lang="ts">
import capa from '@/assets/livro-capa.jpg'
import capaCelular from '@/assets/livro-capa-mobile.jpg'
</script>

<template>
  <div class="pagina-conta">
    <header class="topo-conta">
      <div class="largura-conta navegacao-biblioteca">
        <RouterLink class="marca-biblioteca" :to="{ name: 'livros' }" aria-label="Biblioteca Brasil, início">
          <span class="marca-livro" aria-hidden="true"></span>
          <span>biblioteca brasil</span>
        </RouterLink>
        <RouterLink class="voltar-biblioteca" :to="{ name: 'livros' }">
          <span aria-hidden="true">←</span> Voltar à biblioteca
        </RouterLink>
      </div>
    </header>

    <div class="largura-conta miolo-conta">
      <aside class="painel-biblioteca" aria-label="Apresentação da biblioteca">
        <picture class="capa-biblioteca">
          <source media="(max-width: 860px)" :srcset="capaCelular" />
          <img :src="capa" alt="" fetchpriority="high" />
        </picture>
        <p class="frase-biblioteca">O próximo <br />capítulo <br />é seu.</p>
      </aside>

      <section class="painel-conta" aria-labelledby="titulo-conta">
        <slot />
      </section>
    </div>
  </div>
</template>

<style src="@/assets/conta.css"></style>
