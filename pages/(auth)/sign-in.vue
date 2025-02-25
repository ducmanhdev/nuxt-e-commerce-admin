<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

definePageMeta({
  layout: false
})

useHead({
  title: 'Sign In'
})

const user = useSupabaseUser()
watchEffect(() => {
  if (user.value) return navigateTo('/')
})

const schema = z.object({
  email: z
    .string({
      required_error: 'Please enter your email address'
    })
    .email('Invalid email'),
  password: z
    .string({
      required_error: 'Please enter your password'
    })
    .min(8, 'Must be at least 8 characters')
})

type InferSchema = z.infer<typeof schema>
type OutputSchema = z.output<typeof schema>

const state = ref<InferSchema>({
  email: '',
  password: ''
})

const supabase = useSupabaseClient()
const isSubmitLoading = ref(false)
const toast = useCustomToast()
const onSubmit = async (event: FormSubmitEvent<OutputSchema>) => {
  isSubmitLoading.value = true
  const { error } = await supabase.auth.signInWithPassword({
    email: event.data.email,
    password: event.data.password
  })
  if (error) {
    console.error('[LOGIN_ERROR]', error)
    toast.error(
      error.code === 'invalid_credentials'
        ? 'Wrong email or password. Please try again!'
        : error.message || 'Something went wrong, please try again!'
    )
  }
  isSubmitLoading.value = false
  await navigateTo('/')
}

const handleSignInOAuth = async (provider: 'google' | 'facebook') => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider
  })
  if (error) {
    console.error('[LOGIN_ERROR]', error)
    toast.error(
      error.code === 'invalid_credentials'
        ? 'Wrong email or password. Please try again!'
        : error.message || 'Something went wrong, please try again!'
    )
  }
  await navigateTo('/')
}
</script>

<template>
  <div class="min-h-svh flex justify-center items-center">
    <UCard class="w-full max-w-[500px]">
      <template #header>Sign In</template>
      <div class="space-y-4">
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormField>
          <UFormField label="Password" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormField>
          <UButton type="submit" block :loading="isSubmitLoading">Submit</UButton>
          <p class="text-end">
            <NuxtLink class="text-primary font-medium text-sm" to="/forgot-password">Forgot password?</NuxtLink>
          </p>
          <USeparator>OR</USeparator>
          <UButton icon="ion:logo-google" color="neutral" block variant="outline" @click="handleSignInOAuth('google')">
            Sign in with Google
          </UButton>
          <UButton
            icon="ion:logo-facebook"
            color="neutral"
            block
            variant="outline"
            @click="handleSignInOAuth('facebook')"
          >
            Sign in with Facebook
          </UButton>
          <p class="mt-6 text-sm text-center">
            Don't have an account?
            <NuxtLink to="/sign-up" class="underline">Sign up</NuxtLink>
          </p>
        </UForm>
      </div>
    </UCard>
  </div>
</template>

<style scoped></style>
