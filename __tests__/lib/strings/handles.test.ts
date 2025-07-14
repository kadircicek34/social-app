import {IsValidHandle, validateServiceHandle} from '#/lib/strings/handles'

describe('handle validation', () => {
  const valid = [
    ['ali', 'pds.aiturklaw.com'],
    ['alice', 'pds.aiturklaw.com'],
    ['a-lice', 'pds.aiturklaw.com'],
    ['a-----lice', 'pds.aiturklaw.com'],
    ['123', 'pds.aiturklaw.com'],
    ['123456789012345678', 'pds.aiturklaw.com'],
    ['alice', 'custom-pds.com'],
    ['alice', 'my-custom-pds-with-long-name.social'],
    ['123456789012345678', 'my-custom-pds-with-long-name.social'],
  ]
  it.each(valid)(`should be valid: %s.%s`, (handle, service) => {
    const result = validateServiceHandle(handle, service)
    expect(result.overall).toEqual(true)
  })

  const invalid = [
    ['al', 'pds.aiturklaw.com', 'frontLength'],
    ['-alice', 'pds.aiturklaw.com', 'hyphenStartOrEnd'],
    ['alice-', 'pds.aiturklaw.com', 'hyphenStartOrEnd'],
    ['%%%', 'pds.aiturklaw.com', 'handleChars'],
    ['1234567890123456789', 'pds.aiturklaw.com', 'frontLength'],
    [
      '1234567890123456789',
      'my-custom-pds-with-long-name.social',
      'frontLength',
    ],
    ['al', 'my-custom-pds-with-long-name.social', 'frontLength'],
    ['a'.repeat(300), 'toolong.com', 'totalLength'],
  ] satisfies [string, string, keyof IsValidHandle][]
  it.each(invalid)(
    `should be invalid: %s.%s due to %s`,
    (handle, service, expectedError) => {
      const result = validateServiceHandle(handle, service)
      expect(result.overall).toEqual(false)
      expect(result[expectedError]).toEqual(false)
    },
  )
})
