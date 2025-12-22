export default defineNuxtRouteMiddleware((to) => {
  // Skip auth check for login page
  if (to.path === '/login') {
    return
  }

  // Use auth composable for consistent state (avoids race with cookie)
  const auth = useAuth()

  if (!auth.isAuthenticated.value) {
    return navigateTo('/login')
  }
})
