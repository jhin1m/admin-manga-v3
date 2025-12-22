export default defineNuxtRouteMiddleware(() => {
  // Use auth composable for consistent state
  const auth = useAuth()

  // Redirect authenticated users away from login
  if (auth.isAuthenticated.value) {
    return navigateTo('/')
  }
})
