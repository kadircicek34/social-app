import React from 'react'
import {type ColorSchemeName, useColorScheme} from 'react-native'

import {isWeb} from '#/platform/detection'
import {useThemePrefs} from '#/state/shell'
import {dark, defaultTheme, dim, light} from '#/alf/themes'
import {type ThemeName} from '#/alf/types'

export function useColorModeTheme(): ThemeName {
  const theme = useThemeName()

  React.useLayoutEffect(() => {
    updateDocument(theme)
  }, [theme])

  return theme
}

export function useThemeName(): ThemeName {
  const colorScheme = useColorScheme()
  const {colorMode, darkTheme} = useThemePrefs()

  return getThemeName(colorScheme, colorMode, darkTheme)
}

function getThemeName(
  colorScheme: ColorSchemeName,
  colorMode: 'system' | 'light' | 'dark',
  darkTheme?: ThemeName,
) {
  if (
    (colorMode === 'system' && colorScheme === 'light') ||
    colorMode === 'light'
  ) {
    return 'light'
  } else {
    return darkTheme ?? 'dim'
  }
}

function updateDocument(theme: ThemeName) {
  // @ts-ignore web only
  if (isWeb && typeof window !== 'undefined') {
    // @ts-ignore web only
    const html = window.document.documentElement
    // @ts-ignore web only
    const meta = window.document.querySelector('meta[name="theme-color"]')

    // remove any other color mode classes
    html.className = html.className.replace(/(theme)--\w+/g, '')
    html.classList.add(`theme--${theme}`)
    // set color to 'theme-color' meta tag
    meta?.setAttribute('content', getBackgroundColor(theme))
  }
}

export function getBackgroundColor(theme: ThemeName): string {
  const fallback = '#000'
  const themes: Record<ThemeName, Theme | undefined> = {
    light,
    dark,
    dim,
  }
  const t = themes[theme] ?? defaultTheme
  return t?.atoms?.bg?.backgroundColor ?? fallback
}
