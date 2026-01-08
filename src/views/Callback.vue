<template>
  <v-main>
    <v-container fluid class="fill-height">
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="pa-8" elevation="8" rounded="xl">
            <div v-if="loading" class="text-center">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
                class="mb-4"
              ></v-progress-circular>
              <v-card-title class="text-h6">Processing OAuth callback...</v-card-title>
            </div>

            <div v-else-if="error">
              <v-card-title class="text-h5 mb-4">Login Failed</v-card-title>
              <v-alert type="error" variant="tonal" class="mb-4">
                {{ error }}
              </v-alert>
              <v-btn block color="primary" @click="$router.push('/')">
                Back to Login
              </v-btn>
            </div>

            <div v-else-if="user">
              <v-card-title class="text-h5 mb-2">
                {{ providerDisplayName }} login successful!
              </v-card-title>
              <v-card-subtitle class="mb-4">
                OAuth provider login completed. Below is the user information returned from the callback.
              </v-card-subtitle>
              <v-card-text>
                <v-avatar size="80" class="mb-4">
                  <v-img v-if="user.avatar" :src="user.avatar" :alt="user.username"></v-img>
                  <v-icon v-else size="40">mdi-account</v-icon>
                </v-avatar>
                
                <v-list lines="two" class="mb-4">
                  <v-list-item>
                    <v-list-item-title>Username</v-list-item-title>
                    <v-list-item-subtitle>{{ user.username }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item v-if="user.nickname">
                    <v-list-item-title>Nickname</v-list-item-title>
                    <v-list-item-subtitle>{{ user.nickname }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item v-if="user.email">
                    <v-list-item-title>Email</v-list-item-title>
                    <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item v-if="user.uuid">
                    <v-list-item-title>User ID</v-list-item-title>
                    <v-list-item-subtitle>{{ user.uuid }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>

              <v-card-actions>
                <v-btn block color="primary" @click="$router.push('/')">
                  Back to Login
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { oauthApi } from '../services/api'
import type { OAuthProvider, OAuthUser } from '../types/oauth'

const route = useRoute()

const loading = ref(true)
const error = ref('')
const user = ref<OAuthUser | null>(null)
const provider = ref<OAuthProvider | null>(null)

const providerDisplayName = computed(() => {
  if (provider.value === 'OAUTH_GOOGLE') return 'Google'
  if (provider.value === 'OAUTH_TWITTER') return 'Twitter'
  return 'Unknown Provider'
})

onMounted(async () => {
  try {
    // Extract provider from route params or URL path
    let detectedProvider: OAuthProvider | undefined = route.params.provider as OAuthProvider

    if (!detectedProvider) {
      // Fallback: try to extract from path
      const pathParts = route.path.split('/')
      const providerIndex = pathParts.findIndex(part => part === 'callback')
      if (providerIndex !== -1 && providerIndex < pathParts.length - 1) {
        detectedProvider = pathParts[providerIndex + 1] as OAuthProvider
      }
    }
    
    if (!detectedProvider) {
      error.value = 'Invalid callback URL: provider not found'
      loading.value = false
      return
    }
    
    if (detectedProvider !== 'OAUTH_GOOGLE' && detectedProvider !== 'OAUTH_TWITTER') {
      error.value = `Unsupported OAuth provider: ${detectedProvider}`
      loading.value = false
      return
    }

    provider.value = detectedProvider

    // Get query parameters
    const queryParams = new URLSearchParams(window.location.search)
    
    // Call backend to handle OAuth callback
    const response = await oauthApi.handleCallback(detectedProvider, queryParams)
    
    if (response.success && response.user) {
      user.value = response.user
    } else {
      error.value = response.error || 'OAuth authentication failed'
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Failed to process OAuth callback'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>

