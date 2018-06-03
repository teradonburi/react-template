import React from 'react'
import Header from 'components/organisms/Header'
import UserRegist from 'components/organisms/UserRegist'

const UserPageTemplate = ({
  headerContent, headerContentMobile, headerButtonTitle, onClickPageMove,
  handleSubmit, sendItems, disabled,
}) => (
  <div>
    <Header
      content={headerContent}
      contentMobile={headerContentMobile}
      buttonTitle={headerButtonTitle}
      onClickPageMove={onClickPageMove}
    />
    <UserRegist
      handleSubmit={handleSubmit}
      sendItems={sendItems}
      disabled={disabled}
    />
  </div>
)

export default UserPageTemplate
