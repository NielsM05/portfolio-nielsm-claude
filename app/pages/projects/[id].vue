<script setup lang="ts">
interface Collaborator { name: string; linkedinUrl: string }

interface Project {
  id: number
  category: string
  title: string
  description: string
  content: string
  externalLink: string
  photos: string[]
  collaborators: Collaborator[]
}

const route = useRoute()
const { data: project, error } = await useFetch<Project>(`/api/projects/${route.params.id}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project niet gevonden' })
}
</script>

<template>
  <div class="detail-wrap">
    <AppNav />

    <main class="detail-main">
      <NuxtLink to="/#projects" class="back-link">← Terug naar portfolio</NuxtLink>

      <header class="detail-header">
        <div class="detail-eyebrow">{{ project!.category }}</div>
        <h1 class="detail-title">{{ project!.title }}</h1>
        <p class="detail-lead">{{ project!.description }}</p>
      </header>

      <!-- Collaborators -->
      <section v-if="project!.collaborators?.length" class="detail-section">
        <h2 class="detail-section-label">Medewerkers</h2>
        <div class="collab-list">
          <a
            v-for="(c, i) in project!.collaborators"
            :key="i"
            :href="c.linkedinUrl || '#'"
            target="_blank"
            rel="noopener"
            class="collab-card"
          >
            <span class="collab-name">{{ c.name }}</span>
            <span class="collab-li">LinkedIn →</span>
          </a>
        </div>
      </section>

      <!-- Photos -->
      <section v-if="project!.photos?.length" class="detail-section">
        <h2 class="detail-section-label">Foto's</h2>
        <div class="photos-grid">
          <a
            v-for="(photo, i) in project!.photos"
            :key="i"
            :href="photo"
            target="_blank"
            rel="noopener"
            class="photo-link"
          >
            <img :src="photo" :alt="`${project!.title} foto ${i + 1}`" class="photo-img" />
          </a>
        </div>
      </section>

      <!-- Extended content -->
      <section v-if="project!.content" class="detail-section">
        <h2 class="detail-section-label">Details</h2>
        <div class="detail-content">{{ project!.content }}</div>
      </section>

      <!-- External link -->
      <div v-if="project!.externalLink" class="detail-cta">
        <a :href="project!.externalLink" target="_blank" rel="noopener" class="btn btn-red">
          Bekijk project →
        </a>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.detail-wrap {
  min-height: 100vh;
  background: var(--bg);
}

.detail-main {
  max-width: 900px;
  margin: 0 auto;
  padding: 6rem 4rem 8rem;
}

.back-link {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text);
  text-decoration: none;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: color 0.2s;
  display: inline-block;
  margin-bottom: 3rem;
}

.back-link:hover {
  color: var(--white);
}

.detail-header {
  margin-bottom: 4rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid var(--border);
}

.detail-eyebrow {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.detail-title {
  font-family: var(--display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  color: var(--white);
  font-weight: 900;
  line-height: 1.05;
  margin-bottom: 1.5rem;
}

.detail-lead {
  font-size: 1rem;
  line-height: 1.8;
  max-width: 680px;
}

/* Sections */
.detail-section {
  margin-bottom: 3.5rem;
}

.detail-section-label {
  font-family: var(--mono);
  font-size: 0.55rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

/* Collaborators */
.collab-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.collab-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.25rem;
  border: 1px solid var(--border);
  text-decoration: none;
  transition: border-color 0.2s;
}

.collab-card:hover {
  border-color: var(--accent);
}

.collab-name {
  font-size: 0.85rem;
  color: var(--white);
}

.collab-li {
  font-family: var(--mono);
  font-size: 0.55rem;
  color: var(--accent);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Photos */
.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1px;
}

.photo-link {
  display: block;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: var(--surface);
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.photo-link:hover .photo-img {
  transform: scale(1.04);
}

/* Content */
.detail-content {
  font-size: 0.9rem;
  line-height: 1.9;
  white-space: pre-wrap;
  max-width: 680px;
}

/* CTA */
.detail-cta {
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid var(--border);
}
</style>
