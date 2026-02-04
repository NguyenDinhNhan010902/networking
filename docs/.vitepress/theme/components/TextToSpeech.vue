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
const audioPlayer = ref(null)
const audioQueue = ref([])
const currentAudioIndex = ref(0)
const GOOGLE_ONLINE_URI = 'google_online_vi'

// === 1. QUẢN LÝ VOICE (Hybrid) ===
const loadVoices = () => {
    // Lấy giọng Native
    let all = []
    if ('speechSynthesis' in window) {
        all = window.speechSynthesis.getVoices()
    }

    // Thêm giọng Google Online vào list
    const googleOption = {
        name: '🌐 Google Tiếng Việt (Online)',
        lang: 'vi-VN',
        voiceURI: GOOGLE_ONLINE_URI,
        default: false
    }
    
    // Gộp list
    voices.value = [googleOption, ...all]
    
    // Auto select logic
    if (!selectedVoiceURI.value) {
        const vnNative = all.find(v => v.lang.toLowerCase().includes('vi'))
        if (vnNative) {
             // Có native vi -> Dùng native
             selectedVoiceURI.value = vnNative.voiceURI
        } else {
             // Không có native vi -> Dùng Online
             selectedVoiceURI.value = GOOGLE_ONLINE_URI
        }
    }
}

// === 2. INJECT BUTTONS ===
const createPlayButton = (id) => {
    const btn = document.createElement('span')
    btn.innerHTML = ' 🔊'
    btn.className = 'tts-section-btn'
    btn.title = 'Nghe mục này'
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

const splitTextToChunks = (text, maxLength = 150) => {
    const sentences = text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [text]
    const chunks = []
    let currentChunk = ""
    for (const sentence of sentences) {
        if (currentChunk.length + sentence.length < maxLength) {
            currentChunk += sentence
        } else {
            if (currentChunk.trim()) chunks.push(currentChunk.trim())
            currentChunk = sentence
        }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim())
    return chunks
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
    stop() // Clean previous
    playingSectionId.value = id
    isSpeaking.value = true
    isPaused.value = false
    errorMsg.value = ''

    if (selectedVoiceURI.value === GOOGLE_ONLINE_URI) {
        // --- ONLINE MODE ---
        playOnline(text)
    } else {
        // --- NATIVE MODE ---
        playNative(text)
    }
}

// --- Native Impl ---
const playNative = (text) => {
    if (!('speechSynthesis' in window)) return

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
        isSpeaking.value = false
        playingSectionId.value = ''
    }
    window.speechSynthesis.speak(currentUtterance.value)
}

// --- Online Impl ---
const playOnline = (text) => {
    audioQueue.value = splitTextToChunks(text)
    currentAudioIndex.value = 0
    if (audioQueue.value.length === 0) {
        isSpeaking.value = false
        return
    }
    playNextChunkOnline()
}

const playNextChunkOnline = async () => {
    if (currentAudioIndex.value < audioQueue.value.length) {
        const chunk = audioQueue.value[currentAudioIndex.value]
        // Use Proxy to avoid CORS
        const url = `/api/tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=vi&client=gtx`
        
        audioPlayer.value = new Audio(url)
        audioPlayer.value.playbackRate = rate.value // Support rate for Audio
        
        audioPlayer.value.onended = () => {
            currentAudioIndex.value++
            playNextChunkOnline()
        }
        
        audioPlayer.value.onerror = (e) => {
            console.error("Online TTS Error:", e)
            errorMsg.value = "Lỗi tải audio online."
            // Skip chunk error logic? For now just stop or next.
            currentAudioIndex.value++
            playNextChunkOnline()
        }
        
        try {
            await audioPlayer.value.play()
        } catch (e) {
            console.error("Play Error:", e)
            isSpeaking.value = false
        }
    } else {
        // Done
        isSpeaking.value = false
        playingSectionId.value = ''
    }
}

// === 5. CONTROLS (Unified) ===
const stop = () => {
    // Stop Native
    if (window.speechSynthesis) window.speechSynthesis.cancel()
    
    // Stop Online
    if (audioPlayer.value) {
        audioPlayer.value.pause()
        audioPlayer.value.currentTime = 0
    }
    audioQueue.value = []
    
    isSpeaking.value = false
    isPaused.value = false
    playingSectionId.value = ''
}

const pause = () => {
    if (selectedVoiceURI.value === GOOGLE_ONLINE_URI) {
        if (audioPlayer.value) audioPlayer.value.pause()
    } else {
        if (window.speechSynthesis) window.speechSynthesis.pause()
    }
    isPaused.value = true
    isSpeaking.value = false
}

const resume = () => {
    if (selectedVoiceURI.value === GOOGLE_ONLINE_URI) {
        if (audioPlayer.value) audioPlayer.value.play()
    } else {
        if (window.speechSynthesis) window.speechSynthesis.resume()
    }
    isPaused.value = false
    isSpeaking.value = true
}

const playGlobal = () => {
    if (isPaused.value && playingSectionId.value === 'global') {
        resume()
        return
    }
    if (isSpeaking.value) {
        pause()
        return
    }
    
    const content = document.querySelector('.vp-doc')
    if (!content) return
    const clone = content.cloneNode(true)
    const buttons = clone.querySelectorAll('.tts-section-btn')
    buttons.forEach(b => b.remove())
    playText(clone.innerText, 'global')
}

// Watch Rate Change to update on-the-fly (Optional, hard for online)
watch(rate, (newRate) => {
    if (isSpeaking.value) {
        // If native, can't change mid-utterance easily without restart. 
        // For online, can change audioPlayer.playbackRate immediately.
        if (selectedVoiceURI.value === GOOGLE_ONLINE_URI && audioPlayer.value) {
            audioPlayer.value.playbackRate = newRate
        }
        // Native usually requires stop & restart to change rate effectively
    }
})

// === LIFECYCLE ===
onMounted(() => {
    isSupported.value = true // Always true because we have Online fallback
    
    loadVoices()
    if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
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
    <div class="tts-header">
        <span class="tts-title">🎧 Đọc bài viết (Hybrid AI)</span>
        <span v-if="isSpeaking || isPaused" class="tts-badge" :class="{ paused: isPaused }">
            {{ isPaused ? '⏸ Tạm dừng' : (playingSectionId === 'global' ? '▶ Đang đọc toàn bài' : '▶ Đang đọc đoạn văn') }}
        </span>
    </div>
    
    <div class="tts-controls">
        <!-- Voice Select -->
        <select v-model="selectedVoiceURI" class="voice-select" title="Chọn giọng đọc">
            <option v-for="v in voices" :key="v.voiceURI" :value="v.voiceURI">
                {{ v.name.length > 35 ? v.name.substring(0, 35) + '...' : v.name }}
            </option>
        </select>
        
        <!-- Rate Select -->
        <select v-model="rate" class="rate-select" title="Tốc độ">
            <option :value="0.5">0.5x</option>
            <option :value="0.75">0.75x</option>
            <option :value="1.0">1.0x</option>
            <option :value="1.25">1.25x</option>
            <option :value="1.5">1.5x</option>
            <option :value="2.0">2.0x</option>
        </select>
        
        <!-- Buttons -->
        <button v-if="!isSpeaking && !isPaused" @click="playGlobal" class="tts-btn play" title="Đọc tất cả">▶️ Đọc</button>
        <button v-else-if="isPaused" @click="resume" class="tts-btn resume" title="Tiếp tục">⏯ Tiếp tục</button>
        <button v-else @click="pause" class="tts-btn pause" title="Tạm dừng">⏸ Pause</button>
        <button v-if="isSpeaking || isPaused" @click="stop" class="tts-btn stop" title="Dừng">⏹ Dừng</button>
    </div>
    
    <div class="tts-hint">
        *Mẹo: Nếu máy không có tiếng Việt, hãy chọn "Google Online".
    </div>
    <div v-if="errorMsg" class="tts-error">{{ errorMsg }}</div>
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

.tts-title {
    font-weight: 600;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.tts-badge {
    font-size: 0.75rem;
    background: var(--vp-c-brand);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
}
.tts-badge.paused { background: #eab308; }

.tts-controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
}

.voice-select {
    flex-grow: 2;
    min-width: 150px;
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg);
}

.rate-select {
    flex-grow: 0;
    width: 80px;
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg);
}

.tts-btn {
    padding: 6px 12px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
    transition: background 0.2s;
    min-width: 80px;
    text-align: center;
}

.tts-btn.play, .tts-btn.resume {
    background-color: var(--vp-c-brand);
    color: white;
}
.tts-btn.play:hover, .tts-btn.resume:hover {
    background-color: var(--vp-c-brand-dark);
}

.tts-btn.pause { background-color: #eab308; color: white; }
.tts-btn.stop { background-color: #ef4444; color: white; }

.tts-hint {
    margin-top: 12px;
    font-size: 0.85em;
    color: var(--vp-c-text-2);
    font-style: italic;
}
.tts-error {
    color: #ef4444;
    font-weight: bold;
    margin-top: 4px;
    font-size: 0.9em;
}
</style>
