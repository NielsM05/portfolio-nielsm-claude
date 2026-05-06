<script setup lang="ts">
const route = useRoute()
const state = ref<'loading' | 'success' | 'error'>('loading')

onMounted(async () => {
  try {
    await $fetch(`/api/unsubscribe?token=${route.query.token}`)
    state.value = 'success'
  } catch {
    state.value = 'error'
  }
})
</script>

<template>
  <div class="page">
    <AppNav />
    <main class="content">
      <div v-if="state === 'loading'" class="message">...</div>
      <div v-else-if="state === 'success'" class="message">
        <div class="label">Uitgeschreven</div>
        <h1 class="title">Je bent uitgeschreven.</h1>
        <p class="sub">Je ontvangt geen mails meer van nielsm.dev.</p>
        <NuxtLink to="/blog" class="link">← Terug naar blog</NuxtLink>
      </div>
      <div v-else class="message">
        <div class="label">Fout</div>
        <h1 class="title">Ongeldige link.</h1>
        <p class="sub">Deze uitschrijflink is al gebruikt of ongeldig.</p>
        <NuxtLink to="/" class="link">← Naar home</NuxtLink>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; }
.content { max-width: 600px; margin: 0 auto; padding: 14rem 2rem 8rem; }
.label { font-family: var(--mono); font-size: 0.6rem; color: var(--accent); letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 1rem; }
.title { font-family: var(--display); font-size: clamp(2rem, 5vw, 3.5rem); color: var(--white); font-weight: 900; margin-bottom: 1rem; }
.sub { font-size: 0.9rem; line-height: 1.7; margin-bottom: 2rem; }
.link { font-family: var(--mono); font-size: 0.65rem; color: var(--accent); text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase; }
.link:hover { opacity: 0.7; }
</style>
