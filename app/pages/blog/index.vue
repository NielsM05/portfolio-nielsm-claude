<script setup lang="ts">
interface BlogPost {
  id: number
  date_en: string; date_nl: string
  title_en: string; title_nl: string
  summary_en: string; summary_nl: string
}

const { locale, t } = useLocale()
useReveal()

const { data: posts } = await useFetch<BlogPost[]>('/api/blog')

const display = computed(() => (posts.value ?? []).map(p => ({
  id: p.id,
  date:    p[`date_${locale.value}` as keyof BlogPost] as string    || p.date_en,
  title:   p[`title_${locale.value}` as keyof BlogPost] as string   || p.title_en,
  summary: p[`summary_${locale.value}` as keyof BlogPost] as string || p.summary_en,
})))
</script>

<template>
  <div>
    <AppNav />
    <main class="blog-page">
      <div class="page-header reveal">
        <div class="page-eyebrow">{{ t.blog.eyebrow }}</div>
        <h1 class="page-title">{{ t.blog.title }}<br><em>{{ t.blog.titleEm }}</em></h1>
        <p class="page-sub">{{ t.blog.sub }}</p>
      </div>

      <div class="post-list">
        <article v-for="post in display" :key="post.id" class="post-card reveal">
          <div class="post-date">{{ post.date }}</div>
          <div class="post-body">
            <h2 class="post-title">{{ post.title }}</h2>
            <p class="post-summary">{{ post.summary }}</p>
          </div>
          <NuxtLink :to="`/blog/${post.id}`" class="post-link">{{ t.blog.readMore }}</NuxtLink>
        </article>
        <p v-if="!display.length" class="empty">{{ t.blog.empty }}</p>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.blog-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 10rem 4rem 8rem;
}

.page-header { margin-bottom: 5rem; }

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
  margin-bottom: 1.5rem;
}
.page-title em { font-style: italic; color: var(--accent); }

.page-sub { font-size: 0.9rem; line-height: 1.7; max-width: 500px; }

.post-list { display: flex; flex-direction: column; gap: 1px; }

.post-card {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  align-items: center;
  gap: 2rem;
  padding: 2.5rem 0;
  border-bottom: 1px solid var(--border);
  transition: border-color 0.3s;
}
.post-card:first-child { border-top: 1px solid var(--border); }
.post-card:hover { border-color: var(--accent); }

.post-date { font-family: var(--mono); font-size: 0.65rem; color: var(--text); }

.post-title { font-family: var(--display); font-size: 1.25rem; color: var(--white); font-weight: 700; margin-bottom: 0.5rem; line-height: 1.3; }
.post-summary { font-size: 0.85rem; line-height: 1.7; }

.post-link { font-family: var(--mono); font-size: 0.6rem; color: var(--accent); text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap; transition: opacity 0.2s; flex-shrink: 0; }
.post-link:hover { opacity: 0.7; }

.empty { font-family: var(--mono); font-size: 0.65rem; color: var(--text); letter-spacing: 0.1em; padding: 2rem 0; border-top: 1px solid var(--border); }

@media (max-width: 768px) {
  .blog-page { padding: 8rem 1.5rem 4rem; }
  .post-card { grid-template-columns: 1fr; gap: 0.75rem; padding: 1.5rem 0; }
}
</style>
