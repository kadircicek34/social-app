import {StyleSheet} from 'react-native'
import {WebView} from 'react-native-webview'

import {isWeb} from '#/platform/detection'
import * as Layout from '#/components/Layout'

export default function JobsScreen() {
  return (
    <Layout.Screen testID="JobsScreen">
      {isWeb ? (
        <iframe
          src="https://www.linkedin.com/jobs"
          style={styles.frame}
          title="LinkedIn Jobs"
        />
      ) : (
        <WebView
          source={{uri: 'https://www.linkedin.com/jobs'}}
          style={styles.webview}
        />
      )}
    </Layout.Screen>
  )
}

const styles = StyleSheet.create({
  webview: {flex: 1},
  frame: {flex: 1, borderWidth: 0},
})
