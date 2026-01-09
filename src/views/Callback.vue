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
              <v-card-title class="text-h5 mb-2">
                Login Successful!
              </v-card-title>
              <v-card-subtitle class="mb-4">
                You have been successfully logged in via OAuth.
              </v-card-subtitle>
              <v-card-text>
                <v-icon size="80" color="success" class="mb-4">mdi-check-circle</v-icon>
                <p class="text-body-1">
                  Your session has been created. You can now use the application.
                </p>

                <div v-if="userInfo" class="mt-4">
                  <v-divider class="mb-4"></v-divider>
                  <h3 class="text-h6 mb-3">User Information</h3>
                  <v-row class="mb-2">
                    <v-col cols="12" class="d-flex align-center">
                      <v-avatar size="48" class="mr-3">
                        <v-img :src="userInfo.avatar" :alt="userInfo.nickname"></v-img>
                      </v-avatar>
                      <div>
                        <div class="text-body-1 font-weight-medium">{{ userInfo.nickname }}</div>
                        <div class="text-body-2 text-medium-emphasis">@{{ userInfo.username }}</div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
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
import { oauthApi } from '../services/api'
import type { UserVo } from '../types/oauth'

const route = useRoute()

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorMessage = ref('')
const userInfo = ref<UserVo | null>(null)

onMounted(async () => {
  // Check URL parameters for success or error
  const urlParams = new URLSearchParams(window.location.search)
  const message = urlParams.get('message')

  // Check if this is a success or error callback
  if (route.path.includes('/callback/success')) {
    status.value = 'success'
    await fetchUserInfo()
  } else if (route.path.includes('/callback/error') || message) {
    status.value = 'error'
    errorMessage.value = message || 'OAuth authentication failed'
  } else {
    // Default: treat as success if redirected from backend
    status.value = 'success'
    await fetchUserInfo()
  }
})

const fetchUserInfo = async () => {
  try {
    userInfo.value = await oauthApi.getUserInfo()
  } catch (error) {
    console.error('Failed to fetch user info:', error)
    // Keep userInfo as null, don't show user info section
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>

