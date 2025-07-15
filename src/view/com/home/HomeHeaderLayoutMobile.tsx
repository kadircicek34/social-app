import {View} from 'react-native'
import Animated from 'react-native-reanimated'
import {msg} from '@lingui/macro'
import {useLingui} from '@lingui/react'

import {HITSLOP_10} from '#/lib/constants'
import {PressableScale} from '#/lib/custom-animations/PressableScale'
import {useHaptics} from '#/lib/haptics'
import {useMinimalShellHeaderTransform} from '#/lib/hooks/useMinimalShellTransform'
import {emitSoftReset} from '#/state/events'
import {useSession} from '#/state/session'
import {useShellLayout} from '#/state/shell/shell-layout'
import {Text} from '#/view/com/util/text/Text'
import {atoms as a, useTheme} from '#/alf'
import {ButtonIcon} from '#/components/Button'
import * as Layout from '#/components/Layout'
import {Link} from '#/components/Link'

export function HomeHeaderLayoutMobile({
  children,
}: {
  children: React.ReactNode
  tabBarAnchor: JSX.Element | null | undefined
}) {
  const t = useTheme()
  const {_} = useLingui()
  const {headerHeight} = useShellLayout()
  const headerMinimalShellTransform = useMinimalShellHeaderTransform()
  const {hasSession} = useSession()
  const playHaptic = useHaptics()

  return (
    <Animated.View
      style={[
        a.fixed,
        a.z_10,
        t.atoms.bg,
        {
          top: 0,
          left: 0,
          right: 0,
        },
        headerMinimalShellTransform,
      ]}
      onLayout={e => {
        headerHeight.set(e.nativeEvent.layout.height)
      }}>
      <Layout.Header.Outer noBottomBorder>
        <Layout.Header.Slot>
          <Layout.Header.MenuButton />
        </Layout.Header.Slot>

        <View style={[a.flex_1, a.align_center]}>
          <PressableScale
            targetScale={0.9}
            onPress={() => {
              playHaptic('Light')
              emitSoftReset()
            }}>
            <Text
              style={{
                color: t.palette.default.brandText,
                fontWeight: 'bold',
                fontSize: 24,
              }}>
              TÜRKLAW
            </Text>
          </PressableScale>
        </View>

        <Layout.Header.Slot />
      </Layout.Header.Outer>
      {children}
    </Animated.View>
  )
}
