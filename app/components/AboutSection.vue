<script setup lang="ts">
const { t } = useLocale()

const certifications = [
  { name: 'SEC0 - TryHackMe', year: '2026' },
  { name: 'SEC1 - TryHackMe', year: '2026' },
  { name: 'Cybersecurity Bachelor (in progress) - Howest', year: '2023-2026' },

]
</script>

<template>
  <section id="about">
    <p class="about-hero-text reveal" v-html="t.about.intro" />

    <div class="about-cols reveal">
      <div>
        <p>{{ t.about.p1 }}</p>
        <p>{{ t.about.p2 }}</p>
      </div>

      <div>
        <div class="cert-list">
          <div
            v-for="cert in certifications"
            :key="cert.name"
            class="cert-entry"
          >
            <span class="cert-entry-name">{{ cert.name }}</span>
            <span class="cert-entry-yr">{{ cert.year }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
#about {
  padding: 8rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.about-hero-text {
  font-family: var(--display);
  font-size: clamp(2rem, 4vw, 3.5rem);
  color: var(--white);
  line-height: 1.2;
  font-weight: 700;
  max-width: 800px;
  margin-bottom: 4rem;
}

.about-hero-text :deep(em) {
  color: var(--accent);
  font-style: italic;
}

.about-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
}

.about-cols p {
  font-size: 0.9rem;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.cert-list {
  margin-top: 0.5rem;
}

.cert-entry {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.85rem;
}

.cert-entry:first-child {
  border-top: 1px solid var(--border);
}

.cert-entry-name {
  color: var(--white);
}

.cert-entry-yr {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--accent);
}
</style>
