import React from 'react'
import {View} from 'react-native'
import {Trans} from '@lingui/macro'

import * as Layout from '#/components/Layout'
import {Text} from '#/components/Typography'
import {atoms as a} from '#/alf'

export default function JobsScreen() {
  return (
    <Layout.Screen testID="JobsScreen">
      <View style={[a.p_md]}>
        <Text style={[a.text_lg, a.font_bold]}>
          <Trans>Job Listings</Trans>
        </Text>
      </View>
    </Layout.Screen>
  )
}
