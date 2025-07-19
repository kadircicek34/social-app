import React from 'react'
import {View, ScrollView} from 'react-native'
import {Trans} from '@lingui/macro'
import {Link} from '#/components/Link'

import * as Layout from '#/components/Layout'
import {Text} from '#/components/Typography'
import {atoms as a} from '#/alf'

export default function JobsScreen() {
  const jobs = [
    {
      title: 'Frontend Developer',
      company: 'Türklaw Inc.',
      location: 'Istanbul',
      link: 'https://www.linkedin.com/jobs',
    },
    {
      title: 'Backend Developer',
      company: 'Türklaw Inc.',
      location: 'Ankara',
      link: 'https://www.linkedin.com/jobs',
    },
  ]

  return (
    <Layout.Screen testID="JobsScreen">
      <ScrollView contentContainerStyle={[a.p_md, a.gap_md]}>
        <Text style={[a.text_lg, a.font_bold, a.mb_md]}>
          <Trans>Job Listings</Trans>
        </Text>
        {jobs.map(job => (
          <Link
            key={job.title}
            to={job.link}
            style={[a.p_md, a.border, a.rounded_md]}
          >
            <Text style={[a.text_md, a.font_bold]}>{job.title}</Text>
            <Text style={[a.text_sm]}>
              {job.company} - {job.location}
            </Text>
          </Link>
        ))}
      </ScrollView>
    </Layout.Screen>
  )
}
