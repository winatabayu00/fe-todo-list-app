<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

router.replace({ path: 'app/dashboard' })

// if (user?.is_admin) {
//   router.replace({ name: 'dashboard-admin-view' })
// } else {
//   router.replace({ name: 'dashboard-user-view' })
// }
</script>

<template>
  <div>Loading...</div>
</template>