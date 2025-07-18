import React from 'react'
import {View} from 'react-native'
import {Pressable} from 'react-native'
import Animated from 'react-native-reanimated'
import {msg, plural, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import {useNavigationState} from '@react-navigation/native'

import {useHideBottomBarBorder} from '#/lib/hooks/useHideBottomBarBorder'
import {useMinimalShellFooterTransform} from '#/lib/hooks/useMinimalShellTransform'
import {getCurrentRoute, isTab} from '#/lib/routes/helpers'
import {makeProfileLink} from '#/lib/routes/links'
import {type CommonNavigatorParams} from '#/lib/routes/types'
import {useGate} from '#/lib/statsig/statsig'
import {useHomeBadge} from '#/state/home-badge'
import {useSession} from '#/state/session'
import {useLoggedOutViewControls} from '#/state/shell/logged-out'
import {useShellLayout} from '#/state/shell/shell-layout'
import {useCloseAllActiveElements} from '#/state/util'
import {Link} from '#/view/com/util/Link'
import {Logotype} from '#/view/icons/Logotype'
import {atoms as a, useTheme} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import {Briefcase_Stroke2_Corner0_Rounded as Briefcase} from '#/components/icons/Briefcase'
import {
  HomeOpen_Filled_Corner0_Rounded as HomeFilled,
  HomeOpen_Stoke2_Corner0_Rounded as Home,
} from '#/components/icons/HomeOpen'
import {MagnifyingGlass_Filled_Stroke2_Corner0_Rounded as MagnifyingGlassFilled} from '#/components/icons/MagnifyingGlass'
import {MagnifyingGlass2_Stroke2_Corner0_Rounded as MagnifyingGlass} from '#/components/icons/MagnifyingGlass2'
import {
  UserCircle_Filled_Corner0_Rounded as UserCircleFilled,
  UserCircle_Stroke2_Corner0_Rounded as UserCircle,
} from '#/components/icons/UserCircle'
import {Text} from '#/components/Typography'
import {styles} from './BottomBarStyles'

export function BottomBarWeb() {
  const {_} = useLingui()
  const {hasSession, currentAccount} = useSession()
  const t = useTheme()
  const footerMinimalShellTransform = useMinimalShellFooterTransform()
  const {requestSwitchToAccount} = useLoggedOutViewControls()
  const closeAllActiveElements = useCloseAllActiveElements()
  const {footerHeight} = useShellLayout()
  const hideBorder = useHideBottomBarBorder()
  const iconWidth = 26

  const hasHomeBadge = useHomeBadge()
  const gate = useGate()

  const showSignIn = React.useCallback(() => {
    closeAllActiveElements()
    requestSwitchToAccount({requestedAccount: 'none'})
  }, [requestSwitchToAccount, closeAllActiveElements])

  const showCreateAccount = React.useCallback(() => {
    closeAllActiveElements()
    requestSwitchToAccount({requestedAccount: 'new'})
    // setShowLoggedOut(true)
  }, [requestSwitchToAccount, closeAllActiveElements])

  return (
    <Animated.View
      role="navigation"
      style={[
        styles.bottomBar,
        styles.bottomBarWeb,
        t.atoms?.bg,
        hideBorder
          ? {borderColor: t.atoms?.bg?.backgroundColor}
          : t.atoms.border_contrast_low,
        footerMinimalShellTransform,
      ]}
      onLayout={event => footerHeight.set(event.nativeEvent.layout.height)}>
      {hasSession ? (
        <>
          <NavItem
            routeName="Home"
            href="/"
            hasNew={hasHomeBadge && gate('remove_show_latest_button')}>
            {({isActive}) => {
              const Icon = isActive ? HomeFilled : Home
              return (
                <Icon
                  aria-hidden={true}
                  width={iconWidth + 1}
                  style={[styles.ctrlIcon, t.atoms.text, styles.homeIcon]}
                />
              )
            }}
          </NavItem>
          <NavItem routeName="Search" href="/search">
            {({isActive}) => {
              const Icon = isActive ? MagnifyingGlassFilled : MagnifyingGlass
              return (
                <Icon
                  aria-hidden={true}
                  width={iconWidth + 2}
                  style={[styles.ctrlIcon, t.atoms.text, styles.searchIcon]}
                />
              )
            }}
          </NavItem>
          <Pressable
            onPress={() => {
              // open in the current tab
              window.location.href = 'https://chat.aiturklaw.com'
            }}
            style={[styles.ctrl, a.pb_lg]}
            accessibilityRole="link"
            accessibilityLabel="AI Chat"
            accessibilityHint="Opens AI chat in the current tab"
            accessible={true}>
            <View style={styles.ctrlIconSizingWrapper}>
              <Text
                aria-hidden={true}
                style={[
                  styles.ctrlIcon,
                  t.atoms.text,
                  styles.aiIcon,
                  {fontSize: iconWidth + 2},
                ]}>
                🤖
              </Text>
              <Text
                style={{
                  position: 'absolute',
                  color: '#FFD700',
                  fontWeight: 'bold',
                  fontSize: 10,
                }}>
                AI
              </Text>
            </View>
          </Pressable>

          <NavItem routeName="Jobs" href="/jobs">
            {() => (
              <Briefcase
                aria-hidden={true}
                width={iconWidth}
                style={[styles.ctrlIcon, t.atoms.text]}
              />
            )}
          </NavItem>

          {hasSession && (
            <>
              <NavItem
                routeName="Profile"
                href={
                  currentAccount
                    ? makeProfileLink({
                        did: currentAccount.did,
                        handle: currentAccount.handle,
                      })
                    : '/'
                }>
                {({isActive}) => {
                  const Icon = isActive ? UserCircleFilled : UserCircle
                  return (
                    <Icon
                      aria-hidden={true}
                      width={iconWidth}
                      style={[
                        styles.ctrlIcon,
                        t.atoms.text,
                        styles.profileIcon,
                      ]}
                    />
                  )
                }}
              </NavItem>
            </>
          )}
        </>
      ) : (
        <>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 14,
              paddingBottom: 14,
              paddingLeft: 14,
              paddingRight: 6,
              gap: 8,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
              <Logotype width={80} />
            </View>

            <View style={[a.flex_row, a.flex_wrap, a.gap_sm]}>
              <Button
                onPress={showCreateAccount}
                label={_(msg`Create account`)}
                size="small"
                variant="solid"
                color="primary">
                <ButtonText>
                  <Trans>Create account</Trans>
                </ButtonText>
              </Button>
              <Button
                onPress={showSignIn}
                label={_(msg`Sign in`)}
                size="small"
                variant="solid"
                color="secondary">
                <ButtonText>
                  <Trans>Sign in</Trans>
                </ButtonText>
              </Button>
            </View>
          </View>
        </>
      )}
    </Animated.View>
  )
}

const NavItem: React.FC<{
  children: (props: {isActive: boolean}) => React.ReactChild
  href: string
  routeName: string
  hasNew?: boolean
  notificationCount?: string
}> = ({children, href, routeName, hasNew, notificationCount}) => {
  const {_} = useLingui()
  const {currentAccount} = useSession()
  const currentRoute = useNavigationState(state => {
    if (!state) {
      return {name: 'Home'}
    }
    return getCurrentRoute(state)
  })

  // Checks whether we're on someone else's profile
  const isOnDifferentProfile =
    currentRoute.name === 'Profile' &&
    routeName === 'Profile' &&
    (currentRoute.params as CommonNavigatorParams['Profile']).name !==
      currentAccount?.handle

  const isActive =
    currentRoute.name === 'Profile'
      ? isTab(currentRoute.name, routeName) &&
        (currentRoute.params as CommonNavigatorParams['Profile']).name ===
          (routeName === 'Profile'
            ? currentAccount?.handle
            : (currentRoute.params as CommonNavigatorParams['Profile']).name)
      : isTab(currentRoute.name, routeName)

  return (
    <Link
      href={href}
      style={[styles.ctrl, a.pb_lg]}
      navigationAction={isOnDifferentProfile ? 'push' : 'navigate'}
      aria-role="link"
      aria-label={routeName}
      accessible={true}>
      {children({isActive})}
      {notificationCount ? (
        <View
          style={[styles.notificationCount, styles.notificationCountWeb]}
          aria-label={_(
            msg`${plural(notificationCount, {
              one: '# unread item',
              other: '# unread items',
            })}`,
          )}>
          <Text style={styles.notificationCountLabel}>{notificationCount}</Text>
        </View>
      ) : hasNew ? (
        <View style={styles.hasNewBadge} />
      ) : null}
    </Link>
  )
}
