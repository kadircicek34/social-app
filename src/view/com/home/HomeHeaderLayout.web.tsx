import {View, StyleSheet} from 'react-native'
import {msg} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import type React from 'react'

import {useSession} from '#/state/session'
import {useShellLayout} from '#/state/shell/shell-layout'
import {HomeHeaderLayoutMobile} from '#/view/com/home/HomeHeaderLayoutMobile'
import {Text} from '#/view/com/util/text/Text'
import {usePalette} from '#/lib/hooks/usePalette'
import {atoms as a, useBreakpoints, useGutters} from '#/alf'
import {useTheme} from '#/lib/ThemeContext'
import {ButtonIcon} from '#/components/Button'
import {Hashtag_Stroke2_Corner0_Rounded as FeedsIcon} from '#/components/icons/Hashtag'
import {
  Message_Stroke2_Corner0_Rounded as Message,
  Message_Stroke2_Corner0_Rounded_Filled as MessageFilled,
} from '#/components/icons/Message'
import {
  Bell_Stroke2_Corner0_Rounded as Bell,
  Bell_Filled_Corner0_Rounded as BellFilled,
} from '#/components/icons/Bell'
import {useUnreadMessageCount} from '#/state/queries/messages/list-conversations'
import {useUnreadNotifications} from '#/state/queries/notifications/unread'
import * as Layout from '#/components/Layout'
import {Link} from '#/components/Link'

export function HomeHeaderLayout(props: {
  children: React.ReactNode
  tabBarAnchor: JSX.Element | null | undefined
}) {
  const {gtMobile} = useBreakpoints()
  if (!gtMobile) {
    return <HomeHeaderLayoutMobile {...props} />
  } else {
    return <HomeHeaderLayoutDesktopAndTablet {...props} />
  }
}

function HomeHeaderLayoutDesktopAndTablet({
  children,
  tabBarAnchor,
}: {
  children: React.ReactNode
  tabBarAnchor: JSX.Element | null | undefined
}) {
  const t = useTheme()
  const pal = usePalette('default')
  const {headerHeight} = useShellLayout()
  const {hasSession} = useSession()
  const unreadMessages = useUnreadMessageCount()
  const unreadNotifications = useUnreadNotifications()
  const {_} = useLingui()
  const gutters = useGutters([0, 'base'])

  return (
    <>
      {hasSession && (
        <Layout.Center>
          <View
            style={[a.flex_row, a.align_center, gutters, a.pt_md, pal.view]}>
            <View style={{width: 34}} />
            <View style={[a.flex_1, a.align_center, a.justify_center]}>
              <Text
                style={{
                  color: t.palette.default.brandText,
                  fontWeight: 'bold',
                  fontSize: 24,
                }}>
                TÜRKLAW
              </Text>
            </View>
            <View style={[a.flex_row, a.align_center, a.gap_sm]}>
              <Link
                to="/messages"
                hitSlop={10}
                label={_(msg`Chat`)}
                size="small"
                variant="ghost"
                color="secondary"
                shape="square"
                style={[a.justify_center, {position: 'relative'}]}>
                <ButtonIcon icon={Message} size="lg" />
                {unreadMessages.numUnread > 0 && (
                  <View style={[styles.badge]}>
                    <Text style={styles.badgeLabel}>{unreadMessages.numUnread}</Text>
                  </View>
                )}
              </Link>
              <Link
                to="/notifications"
                hitSlop={10}
                label={_(msg`Notifications`)}
                size="small"
                variant="ghost"
                color="secondary"
                shape="square"
                style={[a.justify_center, {position: 'relative'}]}>
                <ButtonIcon icon={Bell} size="lg" />
                {unreadNotifications !== '' && (
                  <View style={[styles.badge]}>
                    <Text style={styles.badgeLabel}>{unreadNotifications}</Text>
                  </View>
                )}
              </Link>
              <Link
                to="/feeds"
                hitSlop={10}
                label={_(msg`View your feeds and explore more`)}
                size="small"
                variant="ghost"
                color="secondary"
                shape="square"
                style={[a.justify_center]}>
                <ButtonIcon icon={FeedsIcon} size="lg" />
              </Link>
            </View>
          </View>
        </Layout.Center>
      )}
      {tabBarAnchor}
      <Layout.Center
        style={[a.sticky, a.z_10, a.align_center, pal.view, {top: 0}]}
        onLayout={e => {
          headerHeight.set(e.nativeEvent.layout.height)
        }}>
        {children}
      </Layout.Center>
    </>
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
