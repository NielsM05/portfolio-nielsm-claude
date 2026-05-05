<script setup lang="ts">
interface Event {
  id: number
  date_iso?: string
  date_en: string;  date_nl: string
  type_en: string;  type_nl: string
  title_en: string; title_nl: string
  description_en: string; description_nl: string
  linkedinUrl: string
}

const { locale, t } = useLocale()
useReveal()

const { data: events } = await useFetch<Event[]>('/api/events')

const display = computed(() => (events.value ?? []).map(e => ({
  id: e.id,
  linkedinUrl: e.linkedinUrl,
  date:        e[`date_${locale.value}` as keyof Event] as string        || e.date_en,
  type:        e[`type_${locale.value}` as keyof Event] as string        || e.type_en,
  title:       e[`title_${locale.value}` as keyof Event] as string       || e.title_en,
  description: e[`description_${locale.value}` as keyof Event] as string || e.description_en,
})))

const showTop = ref(false)

onMounted(() => {
  const onScroll = () => { showTop.value = window.scrollY > 400 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

function jumpTo(id: number) {
  document.getElementById(`event-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div>
    <AppNav />
    <main class="events-page">
      <div class="page-header reveal">
        <NuxtLink to="/#events" class="back-link">← {{ t.nav.events }}</NuxtLink>
        <div class="page-eyebrow">{{ t.events.eyebrow }}</div>
        <h1 class="page-title">{{ t.events.title }}<br><em>{{ t.events.titleEm }}</em></h1>
      </div>

      <nav v-if="display.length" class="event-index reveal">
        <button
          v-for="event in display"
          :key="event.id"
          class="index-item"
          @click="jumpTo(event.id)"
        >
          <span class="index-type">{{ event.type }}</span>
          <span class="index-title">{{ event.title }}</span>
          <span class="index-date">{{ event.date }}</span>
        </button>
      </nav>

      <div class="events-list">
        <article
          v-for="event in display"
          :id="`event-${event.id}`"
          :key="event.id"
          class="event-card reveal"
        >
          <div class="event-meta">
            <span class="event-type">{{ event.type }}</span>
            <span class="event-date">{{ event.date }}</span>
          </div>
          <div class="event-body">
            <h3 class="event-title">{{ event.title }}</h3>
            <p class="event-desc">{{ event.description }}</p>
          </div>
          <a v-if="event.linkedinUrl" :href="event.linkedinUrl" target="_blank" rel="noopener" class="event-link">
            {{ t.events.linkedin }}
          </a>
        </article>
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
.events-page {
  max-width: 1100px;
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
.event-index {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border);
  margin-bottom: 4rem;
}

.index-item {
  display: grid;
  grid-template-columns: 10rem 1fr auto;
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
.index-item:hover .index-type { color: var(--accent); }

.index-type {
  font-family: var(--mono);
  font-size: 0.55rem;
  color: var(--accent);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: color 0.2s;
}

.index-title {
  font-family: var(--display);
  font-size: 1rem;
  font-weight: 700;
  color: inherit;
}

.index-date {
  font-family: var(--mono);
  font-size: 0.55rem;
  color: var(--text);
  white-space: nowrap;
}

/* Cards */
.events-list { display: flex; flex-direction: column; gap: 1px; }

.event-card {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  align-items: center;
  gap: 2rem;
  padding: 2.5rem 0;
  border-bottom: 1px solid var(--border);
  transition: border-color 0.3s;
  scroll-margin-top: 7rem;
}
.event-card:first-child { border-top: 1px solid var(--border); }
.event-card:hover { border-color: var(--accent); }

.event-meta { display: flex; flex-direction: column; gap: 0.5rem; }
.event-type { font-family: var(--mono); font-size: 0.6rem; color: var(--accent); letter-spacing: 0.2em; text-transform: uppercase; }
.event-date { font-family: var(--mono); font-size: 0.65rem; color: var(--text); }

.event-title { font-family: var(--display); font-size: 1.25rem; color: var(--white); font-weight: 700; margin-bottom: 0.5rem; line-height: 1.3; }
.event-desc { font-size: 0.85rem; line-height: 1.7; }

.event-link { font-family: var(--mono); font-size: 0.6rem; color: var(--text); text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap; transition: color 0.2s; flex-shrink: 0; }
.event-link:hover { color: var(--accent); }

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
  .events-page { padding: 8rem 1.5rem 4rem; }

  .index-item { grid-template-columns: 1fr; gap: 0.25rem; }
  .index-date { display: none; }

  .event-card { grid-template-columns: 1fr; gap: 0.75rem; padding: 1.5rem 0; }
}
</style>
