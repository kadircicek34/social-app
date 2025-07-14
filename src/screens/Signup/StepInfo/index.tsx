import React, {useRef} from 'react'
import {type TextInput, View} from 'react-native'
import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import * as EmailValidator from 'email-validator'
import type tldts from 'tldts'

import {isEmailMaybeInvalid} from '#/lib/strings/email'
import {logger} from '#/logger'
import {ScreenTransition} from '#/screens/Login/ScreenTransition'
import {is13, is18, useSignupContext} from '#/screens/Signup/state'
import {Policies} from '#/screens/Signup/StepInfo/Policies'
import {atoms as a, native} from '#/alf'
import {Button} from '#/components/Button'
import * as DateField from '#/components/forms/DateField'
import {type DateFieldRef} from '#/components/forms/DateField/types'
import {FormError} from '#/components/forms/FormError'
import * as TextField from '#/components/forms/TextField'
import {Envelope_Stroke2_Corner0_Rounded as Envelope} from '#/components/icons/Envelope'
import {Lock_Stroke2_Corner0_Rounded as Lock} from '#/components/icons/Lock'
import {Ticket_Stroke2_Corner0_Rounded as Ticket} from '#/components/icons/Ticket'
import {Loader} from '#/components/Loader'
import * as Select from '#/components/Select'
import {BackNextButtons} from '../BackNextButtons'

const TITLE_OPTIONS = [
  {label: 'Avukat', value: 'avukat'},
  {label: 'Profesör', value: 'professor'},
  {label: 'Araştırma Görevlisi', value: 'research'},
  {label: 'Hukuk Doktoru', value: 'doctor'},
  {label: 'Akademisyen', value: 'academic'},
  {label: 'Hakim', value: 'judge'},
  {label: 'Savcı', value: 'prosecutor'},
  {label: 'Noter', value: 'notary'},
  {label: 'Hukuk Öğrencisi', value: 'student'},
  {label: 'Diğer', value: 'other'},
]

function sanitizeDate(date: Date): Date {
  if (!date || date.toString() === 'Invalid Date') {
    logger.error(`Create account: handled invalid date for birthDate`, {
      hasDate: !!date,
    })
    return new Date()
  }
  return date
}

export function StepInfo({
  onPressBack,
  isServerError,
  refetchServer,
  isLoadingStarterPack,
}: {
  onPressBack: () => void
  isServerError: boolean
  refetchServer: () => void
  isLoadingStarterPack: boolean
}) {
  const {_} = useLingui()
  const {state, dispatch} = useSignupContext()

  const inviteCodeValueRef = useRef<string>(state.inviteCode)
  const emailValueRef = useRef<string>(state.email)
  const prevEmailValueRef = useRef<string>(state.email)
  const passwordValueRef = useRef<string>(state.password)
  const titleValueRef = useRef<string>(state.title)
  const barNumberValueRef = useRef<string>(state.barNumber)
  const universityValueRef = useRef<string>(state.university)
  const cityValueRef = useRef<string>(state.city)
  const notaryNoValueRef = useRef<string>(state.notaryNo)
  const studentClassValueRef = useRef<string>(state.studentClass)

  const emailInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const birthdateInputRef = useRef<DateFieldRef>(null)
  const barNumberInputRef = useRef<TextInput>(null)
  const universityInputRef = useRef<TextInput>(null)
  const cityInputRef = useRef<TextInput>(null)
  const notaryNoInputRef = useRef<TextInput>(null)
  const studentClassInputRef = useRef<TextInput>(null)

  const [hasWarnedEmail, setHasWarnedEmail] = React.useState<boolean>(false)

  const tldtsRef = React.useRef<typeof tldts>()
  React.useEffect(() => {
    // @ts-expect-error - valid path
    import('tldts/dist/index.cjs.min.js').then(tldts => {
      tldtsRef.current = tldts
    })
    // This will get used in the avatar creator a few steps later, so lets preload it now
    // @ts-expect-error - valid path
    import('react-native-view-shot/src/index')
  }, [])

  const onNextPress = () => {
    const inviteCode = inviteCodeValueRef.current
    const email = emailValueRef.current
    const emailChanged = prevEmailValueRef.current !== email
    const password = passwordValueRef.current

    if (!is13(state.dateOfBirth)) {
      return
    }

    if (state.serviceDescription?.inviteCodeRequired && !inviteCode) {
      return dispatch({
        type: 'setError',
        value: _(msg`Please enter your invite code.`),
        field: 'invite-code',
      })
    }
    if (!email) {
      return dispatch({
        type: 'setError',
        value: _(msg`Please enter your email.`),
        field: 'email',
      })
    }
    if (!EmailValidator.validate(email)) {
      return dispatch({
        type: 'setError',
        value: _(msg`Your email appears to be invalid.`),
        field: 'email',
      })
    }
    if (emailChanged && tldtsRef.current) {
      if (isEmailMaybeInvalid(email, tldtsRef.current)) {
        prevEmailValueRef.current = email
        setHasWarnedEmail(true)
        return dispatch({
          type: 'setError',
          value: _(
            msg`Please double-check that you have entered your email address correctly.`,
          ),
        })
      }
    } else if (hasWarnedEmail) {
      setHasWarnedEmail(false)
    }
    prevEmailValueRef.current = email
    if (!password) {
      return dispatch({
        type: 'setError',
        value: _(msg`Please choose your password.`),
        field: 'password',
      })
    }
    if (password.length < 8) {
      return dispatch({
        type: 'setError',
        value: _(msg`Your password must be at least 8 characters long.`),
        field: 'password',
      })
    }

    dispatch({type: 'setTitle', value: titleValueRef.current})
    dispatch({type: 'setBarNumber', value: barNumberValueRef.current})
    dispatch({type: 'setUniversity', value: universityValueRef.current})
    dispatch({type: 'setCity', value: cityValueRef.current})
    dispatch({type: 'setNotaryNo', value: notaryNoValueRef.current})
    dispatch({type: 'setStudentClass', value: studentClassValueRef.current})

    dispatch({type: 'setInviteCode', value: inviteCode})
    dispatch({type: 'setEmail', value: email})
    dispatch({type: 'setPassword', value: password})
    dispatch({type: 'next'})
    logger.metric(
      'signup:nextPressed',
      {
        activeStep: state.activeStep,
      },
      {statsig: true},
    )
  }

  return (
    <ScreenTransition>
      <View style={[a.gap_md]}>
        <FormError error={state.error} />
        {/* Hosting provider fixed to pds.aiturklaw.com */}
        {state.isLoading || isLoadingStarterPack ? (
          <View style={[a.align_center]}>
            <Loader size="xl" />
          </View>
        ) : state.serviceDescription ? (
          <>
            {state.serviceDescription.inviteCodeRequired && (
              <View>
                <TextField.LabelText>
                  <Trans>Invite code</Trans>
                </TextField.LabelText>
                <TextField.Root isInvalid={state.errorField === 'invite-code'}>
                  <TextField.Icon icon={Ticket} />
                  <TextField.Input
                    onChangeText={value => {
                      inviteCodeValueRef.current = value.trim()
                      if (
                        state.errorField === 'invite-code' &&
                        value.trim().length > 0
                      ) {
                        dispatch({type: 'clearError'})
                      }
                    }}
                    label={_(msg`Required for this provider`)}
                    defaultValue={state.inviteCode}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    returnKeyType="next"
                    submitBehavior={native('submit')}
                    onSubmitEditing={native(() =>
                      emailInputRef.current?.focus(),
                    )}
                  />
                </TextField.Root>
              </View>
            )}
            <View>
              <TextField.LabelText>
                <Trans>Email</Trans>
              </TextField.LabelText>
              <TextField.Root isInvalid={state.errorField === 'email'}>
                <TextField.Icon icon={Envelope} />
                <TextField.Input
                  testID="emailInput"
                  inputRef={emailInputRef}
                  onChangeText={value => {
                    emailValueRef.current = value.trim()
                    if (hasWarnedEmail) {
                      setHasWarnedEmail(false)
                    }
                    if (
                      state.errorField === 'email' &&
                      value.trim().length > 0 &&
                      EmailValidator.validate(value.trim())
                    ) {
                      dispatch({type: 'clearError'})
                    }
                  }}
                  label={_(msg`Enter your email address`)}
                  defaultValue={state.email}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  returnKeyType="next"
                  submitBehavior={native('submit')}
                  onSubmitEditing={native(() =>
                    passwordInputRef.current?.focus(),
                  )}
                />
              </TextField.Root>
            </View>
            <View>
              <TextField.LabelText>
                <Trans>Password</Trans>
              </TextField.LabelText>
              <TextField.Root isInvalid={state.errorField === 'password'}>
                <TextField.Icon icon={Lock} />
                <TextField.Input
                  testID="passwordInput"
                  inputRef={passwordInputRef}
                  onChangeText={value => {
                    passwordValueRef.current = value
                    if (state.errorField === 'password' && value.length >= 8) {
                      dispatch({type: 'clearError'})
                    }
                  }}
                  label={_(msg`Choose your password`)}
                  defaultValue={state.password}
                  secureTextEntry
                  autoComplete="new-password"
                  autoCapitalize="none"
                  returnKeyType="next"
                  submitBehavior={native('blurAndSubmit')}
                  onSubmitEditing={native(() =>
                    birthdateInputRef.current?.focus(),
                  )}
                  passwordRules="minlength: 8;"
                />
              </TextField.Root>
            </View>
            <View>
              <DateField.LabelText>
                <Trans>Your birth date</Trans>
              </DateField.LabelText>
              <DateField.DateField
                testID="date"
                inputRef={birthdateInputRef}
                value={state.dateOfBirth}
                onChangeDate={date => {
                  dispatch({
                    type: 'setDateOfBirth',
                    value: sanitizeDate(new Date(date)),
                  })
                }}
                label={_(msg`Date of birth`)}
                accessibilityHint={_(msg`Select your date of birth`)}
                maximumDate={new Date()}
              />
            </View>
            <View>
              <TextField.LabelText>Unvan</TextField.LabelText>
              <Select.Root
                value={state.title}
                onValueChange={v => {
                  titleValueRef.current = v
                  dispatch({type: 'setTitle', value: v})
                }}>
                <Select.Trigger label="Unvan">
                  {({props}) => (
                    <Button
                      {...props}
                      size="small"
                      variant="ghost"
                      color="secondary">
                      <Select.ValueText
                        placeholder="Unvan seçiniz"
                        style={[a.text_md]}
                      />
                      <Select.Icon />
                    </Button>
                  )}
                </Select.Trigger>
                <Select.Content
                  items={TITLE_OPTIONS}
                  renderItem={({label, value}) => (
                    <Select.Item value={value} label={label}>
                      <Select.ItemIndicator />
                      <Select.ItemText>{label}</Select.ItemText>
                    </Select.Item>
                  )}
                />
              </Select.Root>
            </View>
            {state.title === 'avukat' && (
              <View>
                <TextField.LabelText>Sicil Numarası</TextField.LabelText>
                <TextField.Root isInvalid={state.errorField === 'bar-number'}>
                  <TextField.Input
                    inputRef={barNumberInputRef}
                    onChangeText={v => {
                      barNumberValueRef.current = v
                      dispatch({type: 'setBarNumber', value: v})
                    }}
                    label="Sicil No"
                    defaultValue={state.barNumber}
                    returnKeyType="next"
                  />
                </TextField.Root>
              </View>
            )}
            {[
              'professor',
              'research',
              'doctor',
              'academic',
              'student',
            ].includes(state.title) && (
              <View>
                <TextField.LabelText>Üniversite</TextField.LabelText>
                <TextField.Root isInvalid={state.errorField === 'university'}>
                  <TextField.Input
                    inputRef={universityInputRef}
                    onChangeText={v => {
                      universityValueRef.current = v
                      dispatch({type: 'setUniversity', value: v})
                    }}
                    label="Üniversite"
                    defaultValue={state.university}
                    returnKeyType="next"
                  />
                </TextField.Root>
              </View>
            )}
            {['judge', 'prosecutor', 'notary'].includes(state.title) && (
              <View>
                <TextField.LabelText>İl</TextField.LabelText>
                <TextField.Root isInvalid={state.errorField === 'city'}>
                  <TextField.Input
                    inputRef={cityInputRef}
                    onChangeText={v => {
                      cityValueRef.current = v
                      dispatch({type: 'setCity', value: v})
                    }}
                    label="İl"
                    defaultValue={state.city}
                    returnKeyType="next"
                  />
                </TextField.Root>
              </View>
            )}
            {state.title === 'notary' && (
              <View>
                <TextField.LabelText>Kaçıncı Noter</TextField.LabelText>
                <TextField.Root isInvalid={state.errorField === 'notary-no'}>
                  <TextField.Input
                    inputRef={notaryNoInputRef}
                    onChangeText={v => {
                      notaryNoValueRef.current = v
                      dispatch({type: 'setNotaryNo', value: v})
                    }}
                    label="Noter No"
                    defaultValue={state.notaryNo}
                    returnKeyType="next"
                  />
                </TextField.Root>
              </View>
            )}
            {state.title === 'student' && (
              <View>
                <TextField.LabelText>Sınıf</TextField.LabelText>
                <TextField.Root
                  isInvalid={state.errorField === 'student-class'}>
                  <TextField.Input
                    inputRef={studentClassInputRef}
                    onChangeText={v => {
                      studentClassValueRef.current = v
                      dispatch({type: 'setStudentClass', value: v})
                    }}
                    label="Sınıf"
                    defaultValue={state.studentClass}
                    returnKeyType="next"
                  />
                </TextField.Root>
              </View>
            )}
            <Policies
              serviceDescription={state.serviceDescription}
              needsGuardian={!is18(state.dateOfBirth)}
              under13={!is13(state.dateOfBirth)}
            />
          </>
        ) : undefined}
      </View>
      <BackNextButtons
        hideNext={!is13(state.dateOfBirth)}
        showRetry={isServerError}
        isLoading={state.isLoading}
        onBackPress={onPressBack}
        onNextPress={onNextPress}
        onRetryPress={refetchServer}
        overrideNextText={hasWarnedEmail ? _(msg`It's correct`) : undefined}
      />
    </ScreenTransition>
  )
}
