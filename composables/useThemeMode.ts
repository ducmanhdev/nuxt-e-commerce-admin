export const useThemeMode = () => {
  const colorMode = useColorMode()
  const isDark = computed({
    get() {
      return colorMode.value === 'dark'
    },
    set() {
      colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    },
  })
  const handleToggleMode = () => (isDark.value = !isDark.value)

  return {
    isDark,
    handleToggleMode,
  }
}
