<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Lucide from '@/components/Base/Lucide'
import { Menu } from '@/components/Base/Headless'

const router = useRouter()
const mobileMenu = ref(false)

const toggleMobileMenu = () => {
  mobileMenu.value = !mobileMenu.value
}
</script>

<template>
  <div class="mobile-menu md:hidden">
    <Menu>
      <Menu.Button
        class="outline-none block mr-4"
        @click="toggleMobileMenu"
      >
        <Lucide icon="Menu" class="w-8 h-8 text-white" />
      </Menu.Button>
      <Menu.Items
        v-if="mobileMenu"
        class="absolute left-0 right-0 mt-2 mx-4 bg-white rounded-md shadow-lg z-50"
      >
        <Menu.Item @click="router.push({ name: 'dashboard' })">
          <Lucide icon="Home" class="w-4 h-4 mr-2" />
          Dashboard
        </Menu.Item>
        <Menu.Item @click="router.push({ name: 'profile' })">
          <Lucide icon="User" class="w-4 h-4 mr-2" />
          Profile
        </Menu.Item>
        <Menu.Item @click="router.push({ name: 'settings' })">
          <Lucide icon="Settings" class="w-4 h-4 mr-2" />
          Settings
        </Menu.Item>
      </Menu.Items>
    </Menu>
  </div>
</template>