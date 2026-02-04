<script setup>
import DefaultTheme from 'vitepress/theme'
import AiChat from './components/AiChat.vue'
import TextToSpeech from './components/TextToSpeech.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <TextToSpeech />
    </template>
    <template #layout-bottom>
      <AiChat />
    </template>
  </Layout>
</template>
