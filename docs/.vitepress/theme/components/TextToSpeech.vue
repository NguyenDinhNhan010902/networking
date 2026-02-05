<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const voices = ref([])
const selectedVoiceURI = ref('')
const isSupported = ref(false)
const isSpeaking = ref(false)
const isPaused = ref(false)
const rate = ref(1.0)
const playingSectionId = ref('')
const errorMsg = ref('')

// Native Logic vars
const currentUtterance = ref(null)

// Online Logic vars
const audioRef = ref(null) // Ref to <audio> tag
const audioQueue = ref([])
const currentAudioIndex = ref(0)
const GOOGLE_ONLINE_URI = 'google_online_vi'

// === 1. QUẢN LÝ VOICE (Hybrid) ===
const loadVoices = () => {
    let all = []
    if ('speechSynthesis' in window) {
        all = window.speechSynthesis.getVoices()
    }

    const googleOption = {
        name: '🌐 Google Tiếng Việt (Online - Khuyên dùng)',
        lang: 'vi-VN',
        voiceURI: GOOGLE_ONLINE_URI,
        default: true
    }
    
    // Đưa Google lên đầu
    voices.value = [googleOption, ...all]
    
    // Logic Auto-select: Ưu tiên Online cho ổn định nếu User chưa chọn
    if (!selectedVoiceURI.value) {
        selectedVoiceURI.value = GOOGLE_ONLINE_URI
    }
}

// === 2. INJECT BUTTONS ===
const createPlayButton = (id) => {
    const btn = document.createElement('span')
    btn.innerHTML = ' 🔊'
    btn.className = 'tts-section-btn'
    btn.onclick = (e) => {
        e.stopPropagation()
        handleSectionClick(id)
    }
    return btn
}

const injectButtons = () => {
    nextTick(() => {
        const content = document.querySelector('.vp-doc')
        if (!content) return
        const headings = content.querySelectorAll('h2, h3, h4')
        headings.forEach(h => {
             if (h.querySelector('.tts-section-btn')) return
             if (h.id) h.appendChild(createPlayButton(h.id))
        })
    })
}

// === 3. TEXT UTILS ===
const getSectionText = (id) => {
    const heading = document.getElementById(id)
    if (!heading) return ''
    let text = ''
    let nextNode = heading.nextElementSibling
    while (nextNode) {
        if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(nextNode.tagName)) break
        if (['P', 'UL', 'OL', 'BLOCKQUOTE', 'LI'].includes(nextNode.tagName)) {
             text += nextNode.innerText + '. ' 
        }
        nextNode = nextNode.nextElementSibling
    }
    return text.replace(/\s+/g, ' ').trim()
}

// === 4. CORE PLAY LOGIC (Hybrid) ===
const handleSectionClick = (id) => {
    if (playingSectionId.value === id) {
        if (isPaused.value) resume()
        else if (isSpeaking.value) pause()
        else playText(getSectionText(id), id)
        return
    }
    stop()
    const text = getSectionText(id)
    if (!text) return
    playText(text, id)
}

const playText = async (text, id) => {
    stop()
    playingSectionId.value = id
    isSpeaking.value = true
    isPaused.value = false
    errorMsg.value = ''

    if (selectedVoiceURI.value === GOOGLE_ONLINE_URI) {
        playOnline(text)
    } else {
        playNative(text)
    }
}

// --- Native Impl ---
const playNative = (text) => {
    if (!('speechSynthesis' in window)) {
        errorMsg.value = "Trình duyệt không hỗ trợ Native TTS."
        return
    }
    currentUtterance.value = new SpeechSynthesisUtterance(text)
    const voice = voices.value.find(v => v.voiceURI === selectedVoiceURI.value)
    if (voice) currentUtterance.value.voice = voice
    currentUtterance.value.rate = rate.value

    currentUtterance.value.onend = () => {
        isSpeaking.value = false
        playingSectionId.value = ''
    }
    currentUtterance.value.onerror = (e) => {
        console.error("Native TTS Error:", e)
        errorMsg.value = "Lỗi Native TTS: " + (e.error || 'Unknown')
        isSpeaking.value = false
        playingSectionId.value = ''
    }
    window.speechSynthesis.speak(currentUtterance.value)
}

// --- Online Impl (Static Audio Tag) ---
const playOnline = (text) => {
    // Chia nhỏ câu (Chunking) logic
    const sentences = text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [text]
    const chunks = []
    let currentChunk = ""
    // Tăng limit lên 200 cho Google gtx
    const MAX_LEN = 200 
    
    for (const sentence of sentences) {
        if (currentChunk.length + sentence.length < MAX_LEN) {
            currentChunk += sentence
        } else {
            if (currentChunk.trim()) chunks.push(currentChunk.trim())
            currentChunk = sentence
        }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim())
    
    audioQueue.value = chunks
    currentAudioIndex.value = 0
    
    if (audioQueue.value.length === 0) return
    
    playNextChunkOnline()
}

const playNextChunkOnline = async () => {
    if (currentAudioIndex.value >= audioQueue.value.length) {
        isSpeaking.value = false
        playingSectionId.value = ''
        return
    }

    if (!audioRef.value) return

    const chunk = audioQueue.value[currentAudioIndex.value]
    const url = `/api/tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=vi&client=gtx`
    
    audioRef.value.src = url
    audioRef.value.playbackRate = rate.value
    
    try {
        await audioRef.value.play()
    } catch (e) {
        console.error("Play Error:", e)
        errorMsg.value = `Không thể phát Audio. (Lỗi: ${e.message})`
        isSpeaking.value = false
    }
}

// Gọi từ @ended event của thẻ Audio
const onAudioEnded = () => {
    currentAudioIndex.value++
    playNextChunkOnline()
}

const onAudioError = (e) => {
    console.error("Audio Tag Error", e)
    // Try next chunk
    currentAudioIndex.value++
    playNextChunkOnline()
}

// === 5. CONTROLS ===
const stop = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel()
    if (audioRef.value) {
        audioRef.value.pause()
        audioRef.value.currentTime = 0
    }
    isSpeaking.value = false
    isPaused.value = false
    playingSectionId.value = ''
    errorMsg.value = ''
}

const pause = () => {
    if (selectedVoiceURI.value === GOOGLE_ONLINE_URI) {
        if (audioRef.value) audioRef.value.pause()
    } else {
        if (window.speechSynthesis) window.speechSynthesis.pause()
    }
    isPaused.value = true
    isSpeaking.value = false
}

const resume = () => {
    if (selectedVoiceURI.value === GOOGLE_ONLINE_URI) {
        if (audioRef.value) audioRef.value.play()
    } else {
        if (window.speechSynthesis) window.speechSynthesis.resume()
    }
    isPaused.value = false
    isSpeaking.value = true
}

const playGlobal = () => {
    if (isPaused.value && playingSectionId.value === 'global') {
        resume(); return
    }
    if (isSpeaking.value) {
        pause(); return
    }
    
    const content = document.querySelector('.vp-doc')
    if (!content) return
    const clone = content.cloneNode(true)
    const buttons = clone.querySelectorAll('.tts-section-btn')
    buttons.forEach(b => b.remove())
    playText(clone.innerText, 'global')
}

// Feature: Test Sound
const testSound = () => {
    const testText = "Âm thanh hoạt động tốt. Một hai ba bốn năm."
    playText(testText, 'test')
}

// === LIFECYCLE ===
onMounted(() => {
    isSupported.value = true
    loadVoices()
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = loadVoices
    }
    injectButtons()
})

onUnmounted(() => stop())

watch(() => route.path, () => {
    stop()
    setTimeout(injectButtons, 500)
})
</script>

<template>
  <div class="tts-container-top">
    <!-- Hidden Audio Element -->
    <audio ref="audioRef" id="tts-audio-hidden" style="display:none;" @ended="onAudioEnded" @error="onAudioError"></audio>
  
    <div class="tts-header">
        <span class="tts-title">🎧 Đọc bài viết (v2.0)</span>
        <span v-if="isSpeaking || isPaused" class="tts-badge" :class="{ paused: isPaused }">
            {{ isPaused ? '⏸ Tạm dừng' : '▶ Đang đọc...' }}
        </span>
    </div>
    
    <div class="tts-controls">
        <select v-model="selectedVoiceURI" class="voice-select">
            <option v-for="v in voices" :key="v.voiceURI" :value="v.voiceURI">
                {{ v.name.length > 30 ? v.name.substring(0, 30) + '...' : v.name }}
            </option>
        </select>
        
        <select v-model="rate" class="rate-select">
            <option :value="0.75">0.75x</option>
            <option :value="1.0">1.0x</option>
            <option :value="1.25">1.25x</option>
            <option :value="1.5">1.5x</option>
        </select>
        
        <button v-if="!isSpeaking && !isPaused" @click="playGlobal" class="tts-btn play">▶️ Đọc Hết</button>
        <button v-else-if="isPaused" @click="resume" class="tts-btn resume">⏯ Tiếp</button>
        <button v-else @click="pause" class="tts-btn pause">⏸ Pause</button>
        <button v-if="isSpeaking || isPaused" @click="stop" class="tts-btn stop">⏹ Dừng</button>
        
        <button @click="testSound" class="tts-btn test" title="Kiểm tra loa">🔔 Test</button>
    </div>
    
    <div class="tts-hint">
        *Mẹo: Chọn "Google Tiếng Việt" nếu máy không đọc được. Dùng nút 🔊 để nghe từng mục.
    </div>
    <div v-if="errorMsg" class="tts-error">⚠️ {{ errorMsg }}</div>
  </div>
</template>

<style>
.tts-section-btn {
    cursor: pointer;
    font-size: 0.9em;
    margin-left: 8px;
    opacity: 0.6;
    transition: all 0.2s;
}
.tts-section-btn:hover {
    opacity: 1;
    transform: scale(1.2);
}
</style>

<style scoped>
.tts-container-top {
    margin-bottom: 24px;
    padding: 16px;
    background-color: var(--vp-c-bg-soft);
    border-radius: 8px;
    border: 1px solid var(--vp-c-divider);
    position: sticky;
    top: var(--vp-nav-height); 
    z-index: 20;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    backdrop-filter: blur(8px);
}

.tts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.tts-title { font-weight: 600; font-size: 1rem; }
.tts-badge { font-size: 0.75rem; background: var(--vp-c-brand); color: white; padding: 2px 8px; border-radius: 12px; }
.tts-badge.paused { background: #eab308; }

.tts-controls { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

.voice-select { flex-grow: 2; padding: 6px; border-radius: 6px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); min-width: 120px; }
.rate-select { flex-grow: 0; padding: 6px; border-radius: 6px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); width: 70px; }

.tts-btn { padding: 6px 12px; border-radius: 6px; font-weight: 500; cursor: pointer; border: none; min-width: 60px; color: white; transition: opacity 0.2s; }
.tts-btn:hover { opacity: 0.9; }

.tts-btn.play, .tts-btn.resume { background-color: var(--vp-c-brand); }
.tts-btn.pause { background-color: #eab308; }
.tts-btn.stop { background-color: #ef4444; }
.tts-btn.test { background-color: #8b5cf6; } /* Tím */

.tts-hint { margin-top: 12px; font-size: 0.85em; color: var(--vp-c-text-2); font-style: italic; }
.tts-error { margin-top: 8px; color: #ef4444; font-weight: 600; font-size: 0.9em; background: #fee2e2; padding: 4px 8px; border-radius: 4px; }
</style>
