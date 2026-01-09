<template>
  <v-main>
    <v-container fluid class="fill-height">
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="pa-8" elevation="8" rounded="xl">
            <div v-if="status === 'loading'" class="text-center">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
                class="mb-4"
              ></v-progress-circular>
              <v-card-title class="text-h6">Processing OAuth login...</v-card-title>
            </div>

            <div v-else-if="status === 'error'">
              <v-card-title class="text-h5 mb-4">Login Failed</v-card-title>
              <v-alert type="error" variant="tonal" class="mb-4">
                {{ errorMessage }}
              </v-alert>
              <v-btn block color="primary" @click="$router.push('/')">
                Back to Login
              </v-btn>
            </div>

            <div v-else-if="status === 'success'">
              <v-card-title class="text-h5 mb-4">
                Welcome back!
              </v-card-title>

              <div v-if="userInfo" class="text-center mb-4">
                <v-avatar size="80" class="mb-4">
                  <v-img :src="userInfo.avatar" :alt="userInfo.nickname" />
                </v-avatar>
                <div class="text-h6 mb-2">{{ userInfo.nickname }}</div>
                <div class="text-body-2 text-medium-emphasis">{{ userInfo.username }}</div>
                <div class="text-caption text-medium-emphasis mt-1">
                  Logged in via {{ getProviderName(userInfo.provider) }}
                </div>
              </div>

              <v-card-text v-else>
                <v-icon size="80" color="success" class="mb-4">mdi-check-circle</v-icon>
                <p class="text-body-1">
                  You have been successfully logged in via OAuth.
                </p>
              </v-card-text>

              <v-card-actions>
                <v-btn block color="primary" @click="$router.push('/')">
                  Continue
                </v-btn>
              </v-card-actions>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorMessage = ref('')
const userInfo = ref<{
  userId: string
  username: string
  provider: string
  nickname: string
  avatar: string
  email?: string
  token: string
} | null>(null)

const getProviderName = (provider: string) => {
  const names: Record<string, string> = {
    'OAUTH_GOOGLE': 'Google',
    'OAUTH_TWITTER': 'Twitter',
    'OAUTH_GITHUB': 'GitHub',
    'OAUTH_GITEE': 'Gitee'
  }
  return names[provider] || provider
}

onMounted(async () => {
  // Check URL parameters for success or error
  const urlParams = new URLSearchParams(window.location.search)
  const message = urlParams.get('message')

  // Check if this is a success or error callback
  if (route.path.includes('/callback/success')) {
    status.value = 'success'

    // Fetch user info from API
    try {
      const response = await axios.get('/api/user/info', {
        withCredentials: true
      })
      userInfo.value = response.data
    } catch (err: any) {
      console.warn('Failed to fetch user info:', err)
      // Don't set error status, just show generic success message
    }
  } else if (route.path.includes('/callback/error') || message) {
    status.value = 'error'
    errorMessage.value = message || 'OAuth authentication failed'
  } else {
    // Default: treat as success if redirected from backend
    status.value = 'success'

    // Try to fetch user info
    try {
      const response = await axios.get('/api/user/info', {
        withCredentials: true
      })
      userInfo.value = response.data
    } catch (err: any) {
      console.warn('Failed to fetch user info:', err)
    }
  }
})
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>

