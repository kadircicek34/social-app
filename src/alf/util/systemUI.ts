import * as SystemUI from 'expo-system-ui'

import {isAndroid} from '#/platform/detection'
import {type Theme} from '../types'

export function setSystemUITheme(themeType: 'theme' | 'lightbox', t: Theme) {
  if (isAndroid) {
    if (themeType === 'theme') {
      const color = t?.atoms?.bg?.backgroundColor
      if (color) {
        SystemUI.setBackgroundColorAsync(color)
      }
    } else {
      SystemUI.setBackgroundColorAsync('black')
    }
  }
}
