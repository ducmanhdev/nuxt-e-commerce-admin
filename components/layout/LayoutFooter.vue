<script setup lang="ts">
const footerMenuGroups = [
  {
    label: 'Company',
    children: [
      {
        label: 'About',
        to: '/about'
      },
      {
        label: 'Features',
        to: '/features'
      },
      {
        label: 'Work',
        to: '/work'
      },
      {
        label: 'Career',
        to: '/career'
      }
    ]
  },
  {
    label: 'Help',
    children: [
      {
        label: 'Customer Support',
        to: '/customer-support'
      },
      {
        label: 'Delivery Details',
        to: '/delivery-details'
      },
      {
        label: 'Terms & Conditions',
        to: '/terms-and-conditions'
      },
      {
        label: 'Privacy Policy',
        to: '/privacy-policy'
      }
    ]
  },
  {
    label: 'FAQ',
    children: [
      {
        label: 'Account',
        to: '/account'
      },
      {
        label: 'Manage Deliveries',
        to: '/manage-deliveries'
      },
      {
        label: 'Orders',
        to: '/orders'
      },
      {
        label: 'Payments',
        to: '/payments'
      }
    ]
  },
  {
    label: 'Resources',
    children: [
      {
        label: 'Free eBooks',
        to: '/free-ebooks'
      },
      {
        label: 'Development Tutorials',
        to: '/development-tutorials'
      },
      {
        label: 'How to - Blog',
        to: '/how-to-blog'
      },
      {
        label: 'Youtube Playlist',
        to: '/youtube-playlist'
      }
    ]
  }
]
const acceptPayments = [
  '/images/icons/payments/visa.svg',
  '/images/icons/payments/mastercard.svg',
  '/images/icons/payments/paypal.svg',
  '/images/icons/payments/apple-pay.svg',
  '/images/icons/payments/google-pay.svg'
]
const socialIcons = ['lucide:twitter', 'lucide:facebook', 'lucide:github', 'lucide:instagram']
</script>

<template>
  <div>
    <div class="translate-y-1/2">
      <UContainer>
        <div class="rounded-4xl bg-black text-white p-10 grid grid-cols-[6fr_4fr] gap-4 items-center">
          <p class="font-bold text-4xl">STAY UPTO DATE ABOUT <br />OUR LATEST OFFERS</p>
          <div>
            <UInput
              size="xl"
              icon="lucide:mail"
              variant="outline"
              placeholder="Enter your email address"
              class="mb-2"
            />
            <UButton size="xl" block>Subscribe to Newsletter</UButton>
          </div>
        </div>
      </UContainer>
    </div>
    <footer class="pb-10 pt-[140px] bg-gray-100 dark:bg-gray-800">
      <UContainer>
        <div class="grid grid-cols-[3fr_2fr_2fr_2fr_2fr] gap-4">
          <div class="">
            <h1 class="font-bold text-2xl mb-4">SHOP.CO</h1>
            <p class="mb-6">We have clothes that suits your style and which you’re proud to wear. From women to men.</p>
            <ul class="flex items-center gap-3">
              <li v-for="item in socialIcons" :key="item">
                <UButton :icon="item" color="neutral" variant="outline" square />
              </li>
            </ul>
          </div>
          <div v-for="group in footerMenuGroups" :key="group.label">
            <h3 class="font-bold uppercase mb-3">{{ group.label }}</h3>
            <ul class="*:not-first:mt-2">
              <li v-for="item in group.children" :key="item.label">
                <NuxtLink :to="item.to" class="transition hover:text-primary">{{ item.label }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
        <USeparator class="my-5"></USeparator>
        <div class="flex items-center justify-between gap-4 text-sm">
          <p>Shop.co © 2000-2023, All Rights Reserved</p>
          <ul class="flex gap-3 items-center">
            <li v-for="item in acceptPayments" :key="item">
              <img :src="item" alt="" class="block" />
            </li>
          </ul>
        </div>
      </UContainer>
    </footer>
  </div>
</template>

<style scoped></style>