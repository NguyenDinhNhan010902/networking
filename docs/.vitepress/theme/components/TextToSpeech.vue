<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const voices = ref([])
const selectedVoiceURI = ref('')
const isSupported = ref(false)
const isSpeaking = ref(false)
const isPaused = ref(false) // Trạng thái Pause
const rate = ref(1.0) // Tốc độ đọc (0.5 - 2.0)

const currentUtterance = ref(null)
const playingSectionId = ref('')

// === 1. QUẢN LÝ VOICE (Web Speech API) ===
const loadVoices = () => {
    const all = window.speechSynthesis.getVoices()
    voices.value = all
    
    if (!selectedVoiceURI.value && all.length > 0) {
        const vn = all.find(v => v.lang.includes('vi'))
        if (vn) selectedVoiceURI.value = vn.voiceURI
        else selectedVoiceURI.value = all[0].voiceURI
    }
}

// === 2. INJECT NÚT PLAY VÀO TIÊU ĐỀ ===
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

// === 3. LOGIC LẤY TEXT ===
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

// === 4. LOGIC PHÁT (SPEAK) ===
const handleSectionClick = (id) => {
    if (playingSectionId.value === id) {
        if (isPaused.value) {
            resume()
        } else if (isSpeaking.value) {
            pause()
        } else {
             playText(getSectionText(id), id)
        }
        return
    }
    stop() 
    
    const text = getSectionText(id)
    if (!text) return
    
    playText(text, id)
}

const playText = (text, id) => {
    if (!isSupported.value) return

    stop() // Ensure clean state
    playingSectionId.value = id
    isSpeaking.value = true
    isPaused.value = false
    
    currentUtterance.value = new SpeechSynthesisUtterance(text)
    
    // Set Voice & Rate
    const voice = voices.value.find(v => v.voiceURI === selectedVoiceURI.value)
    if (voice) currentUtterance.value.voice = voice
    currentUtterance.value.rate = rate.value
    
    currentUtterance.value.onend = () => {
        isSpeaking.value = false
        isPaused.value = false
        playingSectionId.value = ''
    }
    
    currentUtterance.value.onerror = (e) => {
        console.error("TTS Error:", e)
        isSpeaking.value = false
        isPaused.value = false
        playingSectionId.value = ''
    }
    
    window.speechSynthesis.speak(currentUtterance.value)
}

const stop = () => {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
    isPaused.value = false
    playingSectionId.value = ''
}

const pause = () => {
    window.speechSynthesis.pause()
    isPaused.value = true
    isSpeaking.value = false // Tạm coi là không "speaking" active để UI đổi trạng thái
}

const resume = () => {
    window.speechSynthesis.resume()
    isPaused.value = false
    isSpeaking.value = true
}

// === 5. LOGIC ĐỌC TOÀN BÀI (Global) ===
const playGlobal = () => {
    if (isPaused.value && playingSectionId.value === 'global') {
        resume()
        return
    }
    
    if (isSpeaking.value) {
        pause() // Toggle Play -> Pause
        return
    }
    
    const content = document.querySelector('.vp-doc')
    if (!content) return
    
    const clone = content.cloneNode(true)
    const buttons = clone.querySelectorAll('.tts-section-btn')
    buttons.forEach(b => b.remove())
    
    const text = clone.innerText
    playText(text, 'global')
}

// === LIFECYCLE ===
onMounted(() => {
    if ('speechSynthesis' in window) {
        isSupported.value = true
        loadVoices()
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices
        }
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
  <div v-if="isSupported && voices.length > 0" class="tts-container-top">
    <div class="tts-header">
        <span class="tts-title">🎧 Đọc bài viết</span>
        <span v-if="isSpeaking || isPaused" class="tts-badge" :class="{ paused: isPaused }">
            {{ isPaused ? '⏸ Tạm dừng' : (playingSectionId === 'global' ? '▶ Đang đọc toàn bài' : '▶ Đang đọc đoạn văn') }}
        </span>
    </div>
    
    <div class="tts-controls">
        <!-- Chọn giọng -->
        <select v-model="selectedVoiceURI" class="voice-select" title="Chọn giọng đọc">
            <option v-for="v in voices" :key="v.voiceURI" :value="v.voiceURI">
                {{ v.name.substring(0, 30) }} ({{ v.lang }})
            </option>
        </select>
        
        <!-- Chọn tốc độ -->
        <select v-model="rate" class="rate-select" title="Tốc độ đọc">
            <option :value="0.5">0.5x (Chậm)</option>
            <option :value="0.75">0.75x</option>
            <option :value="1.0">1.0x (Chuẩn)</option>
            <option :value="1.25">1.25x</option>
            <option :value="1.5">1.5x (Nhanh)</option>
            <option :value="2.0">2.0x</option>
        </select>
        
        <!-- Nút điều khiển -->
        <button v-if="!isSpeaking && !isPaused" @click="playGlobal" class="tts-btn play" title="Đọc hết bài">
            ▶️ Đọc
        </button>
        
        <button v-else-if="isPaused" @click="resume" class="tts-btn resume" title="Tiếp tục">
            ⏯ Tiếp tục
        </button>
        
        <button v-else @click="pause" class="tts-btn pause" title="Tạm dừng">
            ⏸ Pause
        </button>
        
        <button v-if="isSpeaking || isPaused" @click="stop" class="tts-btn stop" title="Dừng hẳn">
            ⏹ Dừng
        </button>
    </div>
    
    <div class="tts-hint">
        *Mẹo: Dùng nút 🔊 cạnh tiêu đề để nghe từng mục.
    </div>
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

.tts-badge.paused {
    background: #eab308; /* Yellow for pause */
}

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
    width: 100px;
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg);
    cursor: pointer;
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

.tts-btn.pause {
    background-color: #eab308;
    color: white;
}
.tts-btn.pause:hover {
    background-color: #ca8a04;
}

.tts-btn.stop {
    background-color: #ef4444;
    color: white;
}
.tts-btn.stop:hover {
    background-color: #dc2626;
}

.tts-hint {
    margin-top: 12px;
    font-size: 0.85em;
    color: var(--vp-c-text-2);
    font-style: italic;
}
</style>
