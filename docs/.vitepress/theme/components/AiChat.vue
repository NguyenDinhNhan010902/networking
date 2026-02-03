<script setup>
import { ref, nextTick } from 'vue'

// =========================================================================
// CẤU HÌNH API KEY (NGƯỜI DÙNG TỰ ĐIỀN VÀO ĐÂY)
// =========================================================================
const API_KEY = 'AIzaSyAp9b0-fZD7fYoVvpQZ89Xm4bKX2lgOmxc' 
// Ví dụ: 'AIzaSyD...'
// =========================================================================

const isOpen = ref(false)
const isLoading = ref(false)
const userInput = ref('')
const messages = ref([
  { role: 'model', text: 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn về Mạng máy tính?' }
])
const chatBoxApi = ref(null)

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatBoxApi.value) {
    chatBoxApi.value.scrollTop = chatBoxApi.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim()) return
  if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    messages.value.push({ role: 'model', text: '⚠️ Lỗi: Bạn chưa điền API Key vào file AiChat.vue!' })
    return
  }

  const text = userInput.value
  messages.value.push({ role: 'user', text: text })
  userInput.value = ''
  isLoading.value = true
  await scrollToBottom()

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: text }] }]
      })
    })

    const data = await response.json()
    if (data.error) {
      throw new Error(data.error.message)
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi không hiểu ý bạn."
    messages.value.push({ role: 'model', text: reply })

  } catch (error) {
    console.error('Gemini API Error:', error)
    messages.value.push({ role: 'model', text: `❌ Có lỗi xảy ra: ${error.message}` })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}
</script>

<template>
  <div class="ai-chat-container">
    <!-- Nút mở Chat -->
    <button class="chat-toggle-btn" @click="toggleChat">
      <span v-if="!isOpen">🤖 Hỏi AI</span>
      <span v-else>✖ Đóng</span>
    </button>

    <!-- Khung Chat -->
    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <h3>Trợ lý Ảo Network</h3>
      </div>
      
      <div class="chat-messages" ref="chatBoxApi">
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
          <div class="message-content">{{ msg.text }}</div>
        </div>
        <div v-if="isLoading" class="message model">
          <div class="message-content">Drafting... ✍️</div>
        </div>
      </div>

      <div class="chat-input">
        <input 
          v-model="userInput" 
          @keyup.enter="sendMessage" 
          placeholder="Nhập câu hỏi của bạn..." 
          :disabled="isLoading"
        />
        <button @click="sendMessage" :disabled="isLoading">Gửi ➤</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: sans-serif;
}

.chat-toggle-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.chat-toggle-btn:hover {
  transform: scale(1.05);
}

.chat-window {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 320px;
  height: 450px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: var(--vp-c-brand);
  color: white;
  padding: 12px;
  text-align: center;
  font-weight: bold;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--vp-c-bg-soft);
}

.message {
  max-width: 80%;
  display: flex;
}

.message.user {
  align-self: flex-end;
}

.message.model {
  align-self: flex-start;
}

.message-content {
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
}

.message.user .message-content {
  background: #667eea;
  color: white;
  border-bottom-right-radius: 2px;
}

.message.model .message-content {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  border-bottom-left-radius: 2px;
}

.chat-input {
  padding: 10px;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  gap: 5px;
  background: var(--vp-c-bg);
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
}

.chat-input button {
  background: var(--vp-c-brand);
  color: white;
  border: none;
  padding: 0 15px;
  border-radius: 4px;
  cursor: pointer;
}

.chat-input button:disabled {
  background: gray;
  cursor: not-allowed;
}
</style>
