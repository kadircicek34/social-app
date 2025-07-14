import React from 'react'
import {Text, TextProps} from 'react-native'
import {usePalette} from '#/lib/hooks/usePalette'

const ratio = 17 / 64

export function Logotype({fill, width, style, ...rest}: {fill?: string; width?: number} & TextProps) {
  const pal = usePalette('default')
  const size = parseInt(String(width || 32))
  return (
    <Text
      {...rest}
      style={[
        {color: fill || '#001f54', fontWeight: 'bold', fontSize: size * ratio, textTransform: 'uppercase'},
        style,
      ]}>
      TÜRKLAW
    </Text>
  )
}
