<script setup lang="ts">
interface BlogPost {
  id: number
  date_en: string; date_nl: string
  title_en: string; title_nl: string
  summary_en: string; summary_nl: string
  content_en: string; content_nl: string
}

const { locale, t } = useLocale()
const route = useRoute()

const { data: post } = await useFetch<BlogPost>(`/api/blog/${route.params.id}`)

if (!post.value) throw createError({ statusCode: 404, fatal: true })

const display = computed(() => ({
  date:    post.value![`date_${locale.value}` as keyof BlogPost] as string    || post.value!.date_en,
  title:   post.value![`title_${locale.value}` as keyof BlogPost] as string   || post.value!.title_en,
  content: post.value![`content_${locale.value}` as keyof BlogPost] as string || post.value!.content_en,
}))

const paragraphs = computed(() =>
  display.value.content.split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
)
</script>

<template>
  <div>
    <AppNav />
    <main class="blog-detail">
      <div class="post-header">
        <NuxtLink to="/blog" class="back-link">{{ t.blog.back }}</NuxtLink>
        <div class="post-eyebrow">{{ t.blog.eyebrow }}</div>
        <h1 class="post-title">{{ display.title }}</h1>
        <div class="post-date">{{ display.date }}</div>
      </div>

      <div class="post-content">
        <p v-for="(para, i) in paragraphs" :key="i" class="post-para">{{ para }}</p>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.blog-detail {
  max-width: 780px;
  margin: 0 auto;
  padding: 10rem 4rem 8rem;
}

.back-link {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text);
  text-decoration: none;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 2.5rem;
  transition: color 0.2s;
}
.back-link:hover { color: var(--white); }

.post-eyebrow {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.post-title {
  font-family: var(--display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: var(--white);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.post-date {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--text);
  margin-bottom: 4rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.post-content { display: flex; flex-direction: column; gap: 1.25rem; }

.post-para { font-size: 1rem; line-height: 1.8; }

@media (max-width: 768px) {
  .blog-detail { padding: 8rem 1.5rem 4rem; }
}
</style>
