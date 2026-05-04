<script setup lang="ts">
const { t, locale, toggle } = useLocale()

const isDark = ref(false)

onMounted(() => {
  const onScroll = () => { isDark.value = window.scrollY > 60 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <nav :class="{ dark: isDark }">
    <div class="nav-mark">NIELS MAES <em>//</em> SEC</div>
    <ul class="nav-menu">
      <li><a href="/#about">{{ t.nav.about }}</a></li>
      <li><a href="/#projects">{{ t.nav.projects }}</a></li>
      <li><a href="/#skills">{{ t.nav.skills }}</a></li>
      <li><a href="/#events">{{ t.nav.events }}</a></li>
      <li><a href="/#contact">{{ t.nav.contact }}</a></li>
    </ul>
    <button class="lang-toggle" @click="toggle">
      <span :class="{ active: locale === 'en' }">EN</span>
      <span class="sep">/</span>
      <span :class="{ active: locale === 'nl' }">NL</span>
    </button>
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 2rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.4s;
}

nav.dark {
  background: rgba(10, 10, 10, 0.97);
  border-bottom: 1px solid var(--border);
}

.nav-mark {
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--white);
  letter-spacing: 0.1em;
}

.nav-mark em {
  color: var(--accent);
  font-style: normal;
}

.nav-menu {
  display: flex;
  gap: 2.5rem;
  list-style: none;
}

.nav-menu a {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--text);
  text-decoration: none;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: color 0.2s;
}

.nav-menu a:hover {
  color: var(--white);
}

.lang-toggle {
  font-family: var(--mono);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
  cursor: pointer;
  padding: 0.35rem 0.7rem;
  display: flex;
  gap: 0.3rem;
  align-items: center;
  transition: border-color 0.2s;
}

.lang-toggle:hover {
  border-color: var(--text);
}

.lang-toggle .sep {
  opacity: 0.3;
}

.lang-toggle span.active {
  color: var(--accent);
}
</style>
