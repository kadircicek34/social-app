import {View, StyleSheet} from 'react-native'
import Animated from 'react-native-reanimated'

import {PressableScale} from '#/lib/custom-animations/PressableScale'
import {useHaptics} from '#/lib/haptics'
import {useMinimalShellHeaderTransform} from '#/lib/hooks/useMinimalShellTransform'
import {emitSoftReset} from '#/state/events'
import {useShellLayout} from '#/state/shell/shell-layout'
import {Text} from '#/view/com/util/text/Text'
import {usePalette} from '#/lib/hooks/usePalette'
import {useTheme} from '#/lib/ThemeContext'
import {atoms as a} from '#/alf'
import * as Layout from '#/components/Layout'
import {ButtonIcon} from '#/components/Button'
import {Link} from '#/components/Link'
import {Message_Stroke2_Corner0_Rounded as Message} from '#/components/icons/Message'
import {Bell_Stroke2_Corner0_Rounded as Bell} from '#/components/icons/Bell'
import {useUnreadMessageCount} from '#/state/queries/messages/list-conversations'
import {useUnreadNotifications} from '#/state/queries/notifications/unread'

export function HomeHeaderLayoutMobile({
  children,
}: {
  children: React.ReactNode
  tabBarAnchor: JSX.Element | null | undefined
}) {
  const t = useTheme()
  const pal = usePalette('default')
  const {headerHeight} = useShellLayout()
  const headerMinimalShellTransform = useMinimalShellHeaderTransform()
  const playHaptic = useHaptics()
  const unreadMessages = useUnreadMessageCount()
  const unreadNotifications = useUnreadNotifications()

  return (
    <Animated.View
      style={[
        a.fixed,
        a.z_10,
        pal.view,
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

        <Layout.Header.Slot>
          <View style={[a.flex_row, a.align_center, a.gap_sm]}>
            <Link
              to="/messages"
              hitSlop={10}
              label="Chat"
              style={[{position: 'relative'}]}
              PressableComponent={PressableScale}>
              <ButtonIcon icon={Message} size="lg" />
              {unreadMessages.numUnread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeLabel}>{unreadMessages.numUnread}</Text>
                </View>
              )}
            </Link>
            <Link
              to="/notifications"
              hitSlop={10}
              label="Notifications"
              style={[{position: 'relative'}]}
              PressableComponent={PressableScale}>
              <ButtonIcon icon={Bell} size="lg" />
              {unreadNotifications !== '' && (
                <View style={styles.badge}>
                  <Text style={styles.badgeLabel}>{unreadNotifications}</Text>
                </View>
              )}
            </Link>
          </View>
        </Layout.Header.Slot>
      </Layout.Header.Outer>
      {children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff3b30',
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeLabel: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 12,
  },
})
