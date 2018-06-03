import React from 'react'
import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import { Avatar, CardContent } from '@material-ui/core'
import EmailButton from 'components/modules/EmailButton'
import StyledCard from 'components/atoms/StyledCard'

const UserList = ({theme, classes, users, onClick}) => {
  const {primary, secondary} = theme.palette

  if (!users || users.length === 0) return null

  const Name = styled.p`
    && {
      margin: 10px;
      color: ${primary[500]}
    }`

  const Gender = styled.p`
    && {
      margin: 10px;
      color: ${secondary[500]}
    }`

  return users.map((user) => (
    // ループで展開する要素には一意なkeyをつける（ReactJSの決まり事）
    <StyledCard key={user.email}>
      <CardContent>
        <Avatar src={user.picture.thumbnail} imgProps={{width: 40, height: 40}}/>
        <Name>{'名前:' + user.name.first + ' ' + user.name.last}</Name>
        <Gender>{'性別:' + (user.gender == 'male' ? '男性' : '女性')}</Gender>
        <div className={classes.button} >
          <EmailButton onClick={() => onClick(user)} />
        </div>
      </CardContent>
    </StyledCard>
  ))
}

export default withStyles(theme => ({
  button: {
    textAlign: 'right'
  }
}),{withTheme: true})(UserList)