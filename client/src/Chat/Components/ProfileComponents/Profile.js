import React from 'react'
import PersonalInfo from '../ProfileComponents/PersonalInfo'
import PersonalInfoSetting from '../ProfileComponents/PersonalInfoSetting'
import { ProfileBox } from '../ProfileComponents/Theme/Theme'

export default function Profile() {
  return (
    <ProfileBox>
      <PersonalInfo />
      <PersonalInfoSetting />
    </ProfileBox>
  )
}
