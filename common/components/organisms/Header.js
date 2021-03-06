import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Hidden, AppBar, Toolbar, Button } from '@material-ui/core'

const Header = ({ classes, content, contentMobile, buttonTitle, onClickPageMove }) => (
  <AppBar position="static" color="primary">
    <Toolbar classes={{root: classes.root}}>
      <Hidden key='Header' xsDown>
        {content}
      </Hidden>
      <Hidden key='HeaderMobile' smUp>
        {contentMobile}
      </Hidden>
      <Button className={classes.headerButton} onClick={onClickPageMove}>{buttonTitle}</Button>
    </Toolbar>
  </AppBar>
)

export default withStyles({
  root: {
    fontStyle: 'italic',
    fontSize: 21,
    minHeight: 64,
  },
  headerButton: {
    color: '#fff', 
    position: 'absolute', 
    top: 15,
    right: 0,
  }
})(Header)