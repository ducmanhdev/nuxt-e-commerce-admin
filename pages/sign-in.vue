<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

useHead({
  title: 'Sign In',
})

definePageMeta({
  layout: false,
  middleware: ['redirect-if-authenticated'],
})

const schema = z.object({
  email: z.string({
    required_error: 'Please enter your email address',
  }).email('Invalid email'),
  password: z.string({
    required_error: 'Please enter your password',
  }).min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: undefined,
  password: undefined,
})

const supabase = useSupabaseClient()
const runtimeConfig = useRuntimeConfig()

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: event.data.email,
    password: event.data.password,
  })
  if (error) {
    console.log(error)
  }
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
  }
}
</script>

<template>
  <div class="h-screen flex justify-center items-center">
    <UCard class="w-full max-w-[500px]">
      <template #header>
        Sign In
      </template>
      <div class="space-y-4">
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormGroup>
          <div class="text-center">
            Already have an account?
            <RouterLink to="/sign-in" class="text-primary text-underline">
              Sign In
            </RouterLink>
          </div>
          <UButton type="submit" block>
            Submit
          </UButton>
        </UForm>
        <UDivider label="OR" />
        <UButton
          color="black" label="Sign in with GitHub" icon="i-simple-icons-github" block
          @click="signInWithGithub"
        />
        <UButton color="black" label="Sign in with Google" icon="i-simple-icons-google" block />
      </div>
    </UCard>
  </div>
</template>

<style scoped>

</style>
