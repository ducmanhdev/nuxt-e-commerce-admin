<script setup lang="ts">
useHead({
  title: 'Home'
})

const dressStyles = ['Casual', 'Formal', 'Party', 'Gym']
</script>

<template>
  <div>
    <section class="section">
      <UContainer>
        <h2 class="section__title">NEW ARRIVALS</h2>
        <div class="grid grid-cols-4 gap-4">
          <CardProduct
            v-for="item in 4"
            :key="item"
            title="Product Name"
            image="https://dummyimage.com/300"
            :old-price="30"
            :price="40"
            :rating="4"
            link="/"
          />
        </div>
        <div class="flex justify-center mt-8">
          <UButton to="/" variant="outline" color="neutral" class="px-10">View All</UButton>
        </div>
      </UContainer>
    </section>
    <UContainer>
      <USeparator />
    </UContainer>
    <section class="section">
      <UContainer>
        <h2 class="section__title">TOP SELLING</h2>
        <div class="grid grid-cols-4 gap-4">
          <CardProduct
            v-for="item in 4"
            :key="item"
            title="Product Name"
            image="https://dummyimage.com/300"
            :old-price="30"
            :price="40"
            :rating="4"
            link="/"
          />
        </div>
        <div class="flex justify-center mt-8">
          <UButton to="/" variant="outline" color="neutral" class="px-10">View All</UButton>
        </div>
      </UContainer>
    </section>
    <section class="section">
      <UContainer>
        <div class="p-10 rounded-xl bg-gray-400 text-black">
          <h2 class="section__title">BROWSE BY dress STYLE</h2>
          <div class="grid grid-cols-3 gap-4">
            <template v-for="item in dressStyles" :key="item">
              <div
                class="rounded-xl text-white text-lg font-medium p-10 nth-[3n+2]:col-span-2 nth-[3n+3]:col-span-2 bg-gray-600 bg-cover bg-center"
              >
                {{ item }}
              </div>
            </template>
          </div>
        </div>
      </UContainer>
    </section>
    <section class="section">
      <UContainer>
        <h2 class="section__title">OUR HAPPY CUSTOMERS</h2>
      </UContainer>
    </section>
  </div>
</template>
