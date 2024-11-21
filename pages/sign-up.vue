<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

useHead({
  title: 'Sign Up',
})

definePageMeta({
  layout: false,
  middleware: ['redirect-if-authenticated'],
})

const schema = z
  .object({
    email: z
      .string({
        required_error: 'Please enter your email address',
      })
      .email('Invalid email'),
    password: z
      .string({
        required_error: 'Please enter your password',
      })
      .min(8, 'Must be at least 8 characters'),
    confirmPassword: z
      .string({
        required_error: 'Please enter your confirm password',
      })
      .min(8, 'Must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password and confirm password must match',
  })

type InferSchema = z.infer<typeof schema>
type OutputSchema = z.output<typeof schema>

const state = ref<InferSchema>({
  email: '',
  password: '',
  confirmPassword: '',
})

const supabase = useSupabaseClient()
const runtimeConfig = useRuntimeConfig()

const onSubmit = async (event: FormSubmitEvent<OutputSchema>) => {
  const { error } = await supabase.auth.signUp({
    email: event.data.email,
    password: event.data.password,
  })
  if (error) {
    console.log(error)
    push.error('Something went wrong, please try again!')
  }
  push.success('Sign up successfully, please confirm your email')
  await navigateTo('/sign-in')
}

const signInWithGithub = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${runtimeConfig.public.baseUrl}/confirm`,
    },
  })

  if (error) {
    console.log(error)
    push.error('Something went wrong, please try again!')
  }
}
</script>

<template>
  <div class="h-screen flex justify-center items-center">
    <UCard class="w-full max-w-[500px]">
      <template #header>Sign Up</template>
      <div class="space-y-4">
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormField>
          <UFormField label="Password" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormField>
          <UFormField label="Confirm password" name="confirmPassword">
            <UInput v-model="state.confirmPassword" type="password" />
          </UFormField>
          <div class="text-center">
            Already have an account?
            <RouterLink to="/sign-in" class="text-primary text-underline">Sign In</RouterLink>
          </div>
          <UButton type="submit" block>Submit</UButton>
        </UForm>
        <USeparator label="OR" />
        <UButton
          color="neutral"
          label="Sign in with GitHub"
          leading-icon="i-simple-icons-github"
          block
          @click="signInWithGithub"
        />
        <UButton color="neutral" label="Sign in with Google" icon="i-simple-icons-google" block disabled />
      </div>
    </UCard>
  </div>
</template>

<style scoped></style>
