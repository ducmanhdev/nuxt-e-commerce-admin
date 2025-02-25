<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

definePageMeta({
  layout: false
})

useHead({
  title: 'Reset Password'
})

const schema = z
  .object({
    password: z
      .string({
        required_error: 'Please enter your password'
      })
      .min(8, 'Must be at least 8 characters'),
    confirmPassword: z
      .string({
        required_error: 'Please confirm password'
      })
      .min(8, 'Must be at least 8 characters')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

type InferSchema = z.infer<typeof schema>
type OutputSchema = z.output<typeof schema>

const state = ref<InferSchema>({
  password: '',
  confirmPassword: ''
})

const supabase = useSupabaseClient()
const isSubmitLoading = ref(false)
const toast = useCustomToast()
const route = useRoute()
const onSubmit = async (event: FormSubmitEvent<OutputSchema>) => {
  isSubmitLoading.value = true

  const { access_token } = route.query
  if (!access_token) {
    toast.error('Missing reset token. Please try again.')
    isSubmitLoading.value = false
    return
  }
  const { error } = await supabase.auth.updateUser({
    password: event.data.password
    // access_token: access_token
  })
  isSubmitLoading.value = false
  if (error) {
    console.error('[RESET_PASSWORD_ERROR]', error)
    toast.error(error.message || 'Something went wrong, please try again!')
  }
  toast.success('Password reset successful! You can now sign in.')
  await navigateTo('/sign-in')
}
</script>

<template>
  <div class="min-h-svh flex justify-center items-center">
    <UCard class="w-full max-w-[500px]">
      <template #header>Reset Password</template>
      <div class="space-y-4">
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="New password" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormField>
          <UFormField label="Confirm new password" name="confirmPassword">
            <UInput v-model="state.confirmPassword" type="password" />
          </UFormField>
          <UButton type="submit" block :loading="isSubmitLoading">Reset Password</UButton>
        </UForm>
        <p class="mt-6 text-sm text-center">
          Remember your login details?
          <NuxtLink to="/sign-in" class="underline">Sign In</NuxtLink>
        </p>
      </div>
    </UCard>
  </div>
</template>

<style scoped></style>
