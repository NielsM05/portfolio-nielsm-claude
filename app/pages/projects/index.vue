<script setup lang="ts">
interface Project {
  id: number
  category_en: string; category_nl: string
  title_en: string;    title_nl: string
  description_en: string; description_nl: string
}

const { locale, t } = useLocale()
useReveal()

const { data: projects } = await useFetch<Project[]>('/api/projects')

const display = computed(() => (projects.value ?? []).map((p, i) => ({
  id: p.id,
  index: i,
  category: p[`category_${locale.value}` as keyof Project] as string || p.category_en,
  title:    p[`title_${locale.value}` as keyof Project] as string    || p.title_en,
  description: p[`description_${locale.value}` as keyof Project] as string || p.description_en,
})))

const showTop = ref(false)

onMounted(() => {
  const onScroll = () => { showTop.value = window.scrollY > 400 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

function jumpTo(id: number) {
  document.getElementById(`project-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div>
    <AppNav />
    <main class="projects-page">
      <div class="page-header reveal">
        <NuxtLink to="/#projects" class="back-link">← {{ t.nav.projects }}</NuxtLink>
        <div class="page-eyebrow">{{ t.projects.eyebrow }}</div>
        <h1 class="page-title">{{ t.projects.title }}<br><em>{{ t.projects.titleEm }}</em></h1>
      </div>

      <nav v-if="display.length" class="proj-index reveal">
        <button
          v-for="project in display"
          :key="project.id"
          class="index-item"
          @click="jumpTo(project.id)"
        >
          <span class="index-num">{{ String(project.index + 1).padStart(2, '0') }}</span>
          <span class="index-title">{{ project.title }}</span>
          <span class="index-cat">{{ project.category }}</span>
        </button>
      </nav>

      <div class="proj-list">
        <div
          v-for="project in display"
          :id="`project-${project.id}`"
          :key="project.id"
          class="proj-editorial reveal"
          :class="{ reverse: project.index % 2 === 1 }"
        >
          <div class="proj-visual">
            <div class="proj-visual-inner">{{ String(project.index + 1).padStart(2, '0') }}</div>
          </div>
          <div class="proj-info">
            <div>
              <div class="proj-cat">{{ project.category }}</div>
              <div class="proj-h">{{ project.title }}</div>
              <p class="proj-p">{{ project.description }}</p>
            </div>
            <NuxtLink :to="`/projects/${project.id}`" class="proj-link">{{ t.project.readMore }}</NuxtLink>
          </div>
        </div>
        <p v-if="!display.length" class="empty">{{ t.blog.empty }}</p>
      </div>
    </main>

    <Transition name="fade">
      <button v-if="showTop" class="back-top" aria-label="Terug naar boven" @click="scrollTop">↑</button>
    </Transition>

    <AppFooter />
  </div>
</template>

<style scoped>
.projects-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10rem 4rem 8rem;
}

.page-header { margin-bottom: 3rem; }

.back-link {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text);
  text-decoration: none;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 2rem;
  transition: color 0.2s;
}
.back-link:hover { color: var(--white); }

.page-eyebrow {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.page-title {
  font-family: var(--display);
  font-size: clamp(2.5rem, 6vw, 5rem);
  color: var(--white);
  font-weight: 900;
  line-height: 0.9;
}
.page-title em { font-style: italic; color: var(--accent); }

/* Index */
.proj-index {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border);
  margin-bottom: 4rem;
}

.index-item {
  display: grid;
  grid-template-columns: 3rem 1fr auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
  background: none;
  border-left: none;
  border-right: none;
  color: var(--text);
  cursor: pointer;
  text-align: left;
  transition: color 0.2s;
}
.index-item:hover { color: var(--white); }
.index-item:hover .index-num { color: var(--accent); }

.index-num {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.1em;
  transition: color 0.2s;
}

.index-title {
  font-family: var(--display);
  font-size: 1rem;
  font-weight: 700;
  color: inherit;
}

.index-cat {
  font-family: var(--mono);
  font-size: 0.55rem;
  color: var(--text);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Cards */
.proj-list { display: flex; flex-direction: column; }

.proj-editorial {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid var(--border);
  margin-bottom: 1px;
  overflow: hidden;
  transition: border-color 0.3s;
  scroll-margin-top: 7rem;
}
.proj-editorial:hover { border-color: var(--accent); }
.proj-editorial.reverse { direction: rtl; }
.proj-editorial.reverse > * { direction: ltr; }

.proj-visual {
  background: var(--surface);
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.proj-visual-inner {
  font-family: var(--display);
  font-size: 8rem;
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 1px rgba(192, 57, 43, 0.2);
  user-select: none;
}

.proj-info {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: 1px solid var(--border);
}
.proj-editorial.reverse .proj-info { border-left: none; border-right: 1px solid var(--border); }

.proj-cat {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.proj-h {
  font-family: var(--display);
  font-size: 1.8rem;
  color: var(--white);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.proj-p { font-size: 0.85rem; line-height: 1.7; margin-bottom: 2rem; }

.proj-link {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--accent);
  text-decoration: none;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.proj-link:hover { text-decoration: underline; }

.empty { font-family: var(--mono); font-size: 0.65rem; color: var(--text); letter-spacing: 0.1em; padding: 2rem 0; border-top: 1px solid var(--border); }

/* Back to top */
.back-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--accent);
  color: var(--white);
  border: none;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  z-index: 50;
}
.back-top:hover { opacity: 0.8; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .projects-page { padding: 8rem 1.5rem 4rem; }

  .index-item { grid-template-columns: 2.5rem 1fr; }
  .index-cat { display: none; }

  .proj-editorial { grid-template-columns: 1fr; direction: ltr; }
  .proj-editorial.reverse { direction: ltr; }
  .proj-visual { min-height: 140px; }
  .proj-visual-inner { font-size: 5rem; }
  .proj-info { padding: 1.5rem; border-left: none; border-top: 1px solid var(--border); }
  .proj-editorial.reverse .proj-info { border-right: none; border-top: 1px solid var(--border); }
  .proj-h { font-size: 1.4rem; }
}
</style>
