<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

definePageMeta({
  layout: false
})

useHead({
  title: 'Forgot Password'
})

const schema = z.object({
  email: z
    .string({
      required_error: 'Please enter your email address'
    })
    .email('Invalid email')
})

type InferSchema = z.infer<typeof schema>
type OutputSchema = z.output<typeof schema>

const state = ref<InferSchema>({
  email: ''
})

const supabase = useSupabaseClient()
const isSubmitLoading = ref(false)
const toast = useCustomToast()

const onSubmit = async (event: FormSubmitEvent<OutputSchema>) => {
  isSubmitLoading.value = true
  const { error } = await supabase.auth.resetPasswordForEmail(event.data.email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  isSubmitLoading.value = false

  if (error) {
    console.error('[FORGOT_PASSWORD_ERROR]', error)
    toast.error(error.message || 'Something went wrong, please try again!')
  } else {
    toast.success('Password reset email sent successfully!')
  }
}
</script>

<template>
  <div class="min-h-svh flex justify-center items-center">
    <UCard class="w-full max-w-[500px]">
      <template #header>Forgot Password</template>
      <div class="space-y-4">
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormField>
          <UButton type="submit" block :loading="isSubmitLoading">Reset Password</UButton>
        </UForm>
        <p class="mt-6 text-sm text-center">
          Remember your password?
          <NuxtLink to="/sign-in" class="underline">Sign In</NuxtLink>
        </p>
      </div>
    </UCard>
  </div>
</template>

<style scoped></style>
