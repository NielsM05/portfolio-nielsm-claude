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

interface Event {
  id: number
  date: string
  type: string
  title: string
  description: string
  linkedinUrl: string
}

// Auth
const isLoggedIn = ref(false)
const loginPassword = ref('')
const loginError = ref('')
const loginLoading = ref(false)

onMounted(async () => {
  try {
    await $fetch('/api/auth')
    isLoggedIn.value = true
    await loadAll()
  } catch {
    isLoggedIn.value = false
  }
})

async function login() {
  loginLoading.value = true
  loginError.value = ''
  try {
    await $fetch('/api/auth', { method: 'POST', body: { password: loginPassword.value } })
    isLoggedIn.value = true
    await loadAll()
  } catch {
    loginError.value = 'Ongeldig wachtwoord'
  } finally {
    loginLoading.value = false
  }
}

async function logout() {
  await $fetch('/api/auth', { method: 'DELETE' })
  isLoggedIn.value = false
  loginPassword.value = ''
}

// Data
const projects = ref<Project[]>([])
const events = ref<Event[]>([])

async function loadAll() {
  const [p, e] = await Promise.all([
    $fetch<Project[]>('/api/projects'),
    $fetch<Event[]>('/api/events'),
  ])
  projects.value = p
  events.value = e
}

// ─── Projects ───────────────────────────────────────────────
const showProjectForm = ref(false)
const editingProjectId = ref<number | null>(null)
const projectSaving = ref(false)
const photoUploading = ref(false)

function emptyProjectForm(): Omit<Project, 'id'> {
  return { category: '', title: '', description: '', content: '', externalLink: '', photos: [], collaborators: [] }
}
const projectForm = ref(emptyProjectForm())

function startNewProject() {
  editingProjectId.value = null
  projectForm.value = emptyProjectForm()
  showProjectForm.value = true
}

function startEditProject(p: Project) {
  editingProjectId.value = p.id
  projectForm.value = {
    category: p.category,
    title: p.title,
    description: p.description,
    content: p.content ?? '',
    externalLink: p.externalLink ?? '',
    photos: [...(p.photos ?? [])],
    collaborators: (p.collaborators ?? []).map(c => ({ ...c })),
  }
  showProjectForm.value = true
}

function cancelProjectForm() {
  showProjectForm.value = false
  editingProjectId.value = null
}

async function saveProject() {
  projectSaving.value = true
  try {
    if (editingProjectId.value !== null) {
      const updated = await $fetch<Project>(`/api/projects/${editingProjectId.value}`, { method: 'PUT', body: projectForm.value })
      const idx = projects.value.findIndex(p => p.id === editingProjectId.value)
      if (idx >= 0) projects.value[idx] = updated
    } else {
      const created = await $fetch<Project>('/api/projects', { method: 'POST', body: projectForm.value })
      projects.value.push(created)
    }
    cancelProjectForm()
  } finally {
    projectSaving.value = false
  }
}

async function deleteProject(id: number) {
  if (!confirm('Dit project verwijderen?')) return
  await $fetch(`/api/projects/${id}`, { method: 'DELETE' })
  projects.value = projects.value.filter(p => p.id !== id)
}

// Photos
async function uploadPhotos(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  photoUploading.value = true
  try {
    for (const file of Array.from(files)) {
      const form = new FormData()
      form.append('file', file)
      const { url } = await $fetch<{ url: string }>('/api/upload', { method: 'POST', body: form })
      projectForm.value.photos.push(url)
    }
  } finally {
    photoUploading.value = false
    ;(e.target as HTMLInputElement).value = ''
  }
}

function removePhoto(idx: number) {
  projectForm.value.photos.splice(idx, 1)
}

// Collaborators
function addCollaborator() {
  projectForm.value.collaborators.push({ name: '', linkedinUrl: '' })
}

function removeCollaborator(idx: number) {
  projectForm.value.collaborators.splice(idx, 1)
}

// ─── Events ────────────────────────────────────────────────
const showEventForm = ref(false)
const editingEventId = ref<number | null>(null)
const eventSaving = ref(false)

function emptyEventForm(): Omit<Event, 'id'> {
  return { date: '', type: '', title: '', description: '', linkedinUrl: '' }
}
const eventForm = ref(emptyEventForm())

function startNewEvent() {
  editingEventId.value = null
  eventForm.value = emptyEventForm()
  showEventForm.value = true
}

function startEditEvent(ev: Event) {
  editingEventId.value = ev.id
  eventForm.value = { date: ev.date, type: ev.type, title: ev.title, description: ev.description, linkedinUrl: ev.linkedinUrl }
  showEventForm.value = true
}

function cancelEventForm() {
  showEventForm.value = false
  editingEventId.value = null
}

async function saveEvent() {
  eventSaving.value = true
  try {
    if (editingEventId.value !== null) {
      const updated = await $fetch<Event>(`/api/events/${editingEventId.value}`, { method: 'PUT', body: eventForm.value })
      const idx = events.value.findIndex(e => e.id === editingEventId.value)
      if (idx >= 0) events.value[idx] = updated
    } else {
      const created = await $fetch<Event>('/api/events', { method: 'POST', body: eventForm.value })
      events.value.push(created)
    }
    cancelEventForm()
  } finally {
    eventSaving.value = false
  }
}

async function deleteEvent(id: number) {
  if (!confirm('Dit event verwijderen?')) return
  await $fetch(`/api/events/${id}`, { method: 'DELETE' })
  events.value = events.value.filter(e => e.id !== id)
}
</script>

<template>
  <div class="admin-wrap">
    <!-- Login -->
    <div v-if="!isLoggedIn" class="login-screen">
      <div class="login-box">
        <div class="login-eyebrow">Niels Maes</div>
        <h1 class="login-title">Admin</h1>
        <form class="login-form" @submit.prevent="login">
          <input
            v-model="loginPassword"
            type="password"
            placeholder="Wachtwoord"
            class="field"
            autocomplete="current-password"
          />
          <p v-if="loginError" class="login-error">{{ loginError }}</p>
          <button type="submit" class="btn-action" :disabled="loginLoading">
            {{ loginLoading ? 'Bezig…' : 'Inloggen' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Admin UI -->
    <div v-else class="admin-inner">
      <header class="admin-header">
        <div>
          <span class="admin-eyebrow">Niels Maes</span>
          <h1 class="admin-title">Admin</h1>
        </div>
        <button class="btn-ghost" @click="logout">Uitloggen</button>
      </header>

      <!-- ── Projecten ── -->
      <section class="admin-section">
        <div class="section-head">
          <h2 class="section-title">Projecten</h2>
          <button class="btn-action" @click="startNewProject">+ Nieuw project</button>
        </div>

        <div v-if="showProjectForm" class="form-card">
          <h3 class="form-title">{{ editingProjectId !== null ? 'Project bewerken' : 'Nieuw project' }}</h3>

          <div class="form-grid">
            <label class="form-label">
              Categorie
              <input v-model="projectForm.category" type="text" class="field" placeholder="Penetration Test" />
            </label>
            <label class="form-label">
              Titel
              <input v-model="projectForm.title" type="text" class="field" placeholder="Projecttitel" />
            </label>
            <label class="form-label form-full">
              Korte omschrijving <span class="form-hint">(zichtbaar in de lijst)</span>
              <textarea v-model="projectForm.description" class="field field-textarea" placeholder="Beschrijf het project in één zin…" />
            </label>
            <label class="form-label form-full">
              Uitgebreide inhoud <span class="form-hint">(zichtbaar op de detailpagina)</span>
              <textarea v-model="projectForm.content" class="field field-textarea field-textarea-lg" placeholder="Gedetailleerde beschrijving, aanpak, resultaten…" />
            </label>
            <label class="form-label form-full">
              Externe link <span class="form-hint">(optioneel — bijv. GitHub)</span>
              <input v-model="projectForm.externalLink" type="text" class="field" placeholder="https://github.com/…" />
            </label>
          </div>

          <!-- Foto's -->
          <div class="form-block">
            <div class="form-block-label">Foto's</div>
            <div class="photos-grid">
              <div v-for="(photo, idx) in projectForm.photos" :key="idx" class="photo-thumb">
                <img :src="photo" alt="Project foto" />
                <button class="photo-remove" type="button" @click="removePhoto(idx)">×</button>
              </div>
              <label class="photo-add" :class="{ loading: photoUploading }">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  class="photo-input"
                  :disabled="photoUploading"
                  @change="uploadPhotos"
                />
                <span>{{ photoUploading ? 'Uploaden…' : '+ Foto' }}</span>
              </label>
            </div>
          </div>

          <!-- Medewerkers -->
          <div class="form-block">
            <div class="form-block-label">Medewerkers</div>
            <div class="collab-rows">
              <div v-for="(c, idx) in projectForm.collaborators" :key="idx" class="collab-row">
                <input v-model="c.name" type="text" class="field" placeholder="Naam" />
                <input v-model="c.linkedinUrl" type="text" class="field" placeholder="LinkedIn URL" />
                <button class="btn-icon btn-icon-danger" type="button" @click="removeCollaborator(idx)">×</button>
              </div>
              <button class="btn-ghost btn-sm" type="button" @click="addCollaborator">+ Medewerker toevoegen</button>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-action" :disabled="projectSaving" @click="saveProject">
              {{ projectSaving ? 'Opslaan…' : 'Opslaan' }}
            </button>
            <button class="btn-ghost" @click="cancelProjectForm">Annuleren</button>
          </div>
        </div>

        <div class="item-list">
          <div v-for="(p, i) in projects" :key="p.id" class="item-row">
            <div class="item-num">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="item-info">
              <div class="item-cat">{{ p.category }}</div>
              <div class="item-title">{{ p.title }}</div>
            </div>
            <div class="item-actions">
              <NuxtLink :to="`/projects/${p.id}`" target="_blank" class="btn-icon">Bekijk</NuxtLink>
              <button class="btn-icon" @click="startEditProject(p)">Bewerk</button>
              <button class="btn-icon btn-icon-danger" @click="deleteProject(p.id)">Verwijder</button>
            </div>
          </div>
          <div v-if="!projects.length" class="empty-state">Nog geen projecten.</div>
        </div>
      </section>

      <!-- ── Events ── -->
      <section class="admin-section">
        <div class="section-head">
          <h2 class="section-title">Events &amp; Blog</h2>
          <button class="btn-action" @click="startNewEvent">+ Nieuw event</button>
        </div>

        <div v-if="showEventForm" class="form-card">
          <h3 class="form-title">{{ editingEventId !== null ? 'Event bewerken' : 'Nieuw event' }}</h3>
          <div class="form-grid">
            <label class="form-label">
              Datum
              <input v-model="eventForm.date" type="text" class="field" placeholder="15 april 2025" />
            </label>
            <label class="form-label">
              Type
              <input v-model="eventForm.type" type="text" class="field" placeholder="Conferentie" />
            </label>
            <label class="form-label form-full">
              Titel
              <input v-model="eventForm.title" type="text" class="field" placeholder="Evenementtitel" />
            </label>
            <label class="form-label form-full">
              Omschrijving
              <textarea v-model="eventForm.description" class="field field-textarea" placeholder="Beschrijf het event…" />
            </label>
            <label class="form-label form-full">
              LinkedIn URL
              <input v-model="eventForm.linkedinUrl" type="text" class="field" placeholder="https://linkedin.com/…" />
            </label>
          </div>
          <div class="form-actions">
            <button class="btn-action" :disabled="eventSaving" @click="saveEvent">
              {{ eventSaving ? 'Opslaan…' : 'Opslaan' }}
            </button>
            <button class="btn-ghost" @click="cancelEventForm">Annuleren</button>
          </div>
        </div>

        <div class="item-list">
          <div v-for="ev in events" :key="ev.id" class="item-row">
            <div class="item-meta-col">
              <div class="item-cat">{{ ev.type }}</div>
              <div class="item-date">{{ ev.date }}</div>
            </div>
            <div class="item-info">
              <div class="item-title">{{ ev.title }}</div>
            </div>
            <div class="item-actions">
              <button class="btn-icon" @click="startEditEvent(ev)">Bewerk</button>
              <button class="btn-icon btn-icon-danger" @click="deleteEvent(ev.id)">Verwijder</button>
            </div>
          </div>
          <div v-if="!events.length" class="empty-state">Nog geen events.</div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-wrap {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: var(--body);
}

/* Login */
.login-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 100%;
  max-width: 380px;
  padding: 2rem;
}

.login-eyebrow {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.login-title {
  font-family: var(--display);
  font-size: 2.5rem;
  color: var(--white);
  font-weight: 900;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-error {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--accent);
}

/* Admin layout */
.admin-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem 2rem 6rem;
}

.admin-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 4rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.admin-eyebrow {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.5rem;
}

.admin-title {
  font-family: var(--display);
  font-size: 2rem;
  color: var(--white);
  font-weight: 900;
}

/* Sections */
.admin-section { margin-bottom: 4rem; }

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.section-title {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--white);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

/* Form card */
.form-card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 2rem;
  margin-bottom: 1.5rem;
}

.form-title {
  font-family: var(--display);
  font-size: 1.1rem;
  color: var(--white);
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-full { grid-column: 1 / -1; }

.form-label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.form-hint {
  font-size: 0.55rem;
  color: var(--text);
  letter-spacing: 0.05em;
  text-transform: none;
  font-family: var(--body);
  opacity: 0.6;
}

.form-block {
  margin-bottom: 1.5rem;
}

.form-block-label {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  margin-top: 1.5rem;
}

/* Fields */
.field {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--white);
  font-family: var(--body);
  font-size: 0.85rem;
  padding: 0.65rem 0.85rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}

.field:focus { border-color: var(--accent); }

.field-textarea {
  resize: vertical;
  min-height: 80px;
}

.field-textarea-lg {
  min-height: 140px;
}

/* Photos */
.photos-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.photo-thumb {
  position: relative;
  width: 110px;
  height: 80px;
  overflow: hidden;
  background: var(--bg);
  border: 1px solid var(--border);
}

.photo-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: var(--accent);
  color: var(--white);
  border: none;
  cursor: pointer;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.photo-add {
  width: 110px;
  height: 80px;
  border: 1px dashed var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: border-color 0.2s, color 0.2s;
}

.photo-add:hover { border-color: var(--accent); color: var(--accent); }
.photo-add.loading { opacity: 0.5; pointer-events: none; }

.photo-input {
  display: none;
}

/* Collaborators */
.collab-rows {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.collab-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.5rem;
  align-items: center;
}

/* Item list */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.item-row {
  display: grid;
  grid-template-columns: 3rem 1fr auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--border);
}

.item-row:first-child { border-top: 1px solid var(--border); }

.item-num {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--accent);
  letter-spacing: 0.1em;
}

.item-meta-col {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 130px;
}

.item-cat {
  font-family: var(--mono);
  font-size: 0.55rem;
  color: var(--accent);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.item-date {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text);
}

.item-title {
  font-size: 0.9rem;
  color: var(--white);
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.empty-state {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--text);
  letter-spacing: 0.1em;
  padding: 1.5rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

/* Buttons */
.btn-action {
  font-family: var(--mono);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.75rem 1.5rem;
  background: var(--accent);
  color: var(--white);
  border: 1px solid var(--accent);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover:not(:disabled) {
  background: transparent;
  color: var(--accent);
}

.btn-action:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-ghost {
  font-family: var(--mono);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn-ghost:hover { border-color: var(--white); color: var(--white); }

.btn-sm { padding: 0.5rem 1rem; }

.btn-icon {
  font-family: var(--mono);
  font-size: 0.55rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.4rem 0.8rem;
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  text-decoration: none;
  display: inline-block;
}

.btn-icon:hover { border-color: var(--white); color: var(--white); }
.btn-icon-danger:hover { border-color: var(--accent); color: var(--accent); }
</style>
