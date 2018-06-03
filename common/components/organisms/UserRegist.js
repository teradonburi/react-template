import React from 'react'
import { CardContent } from '@material-ui/core'
import StyledCard from 'components/atoms/StyledCard'
import FormTextField from 'components/atoms/FormTextField'
import FormSelectGender from 'components/modules/FormSelectGender'
import SubmitButton from 'components/atoms/SubmitButton'


const UserRegist = ({handleSubmit, sendItems, disabled}) => (
  <StyledCard>
    <CardContent>
      <form onSubmit={handleSubmit(sendItems)} action-xhr='/users' method='post' target='_top'>
        <FormTextField name='firstname' label='姓' />
        <FormTextField name='lastname' label='名' />
        <FormSelectGender name='gender' />
        <FormTextField name='email' label='メールアドレス' />
        <br />
        <SubmitButton disabled={disabled} />
      </form>
    </CardContent>
  </StyledCard>
)

export default UserRegist