/*globals module: false require: false */
import React from 'react'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route, Switch } from 'react-router-dom'

import asyncComponent from 'components/utils/AsyncComponent'
// SSR時は通常import
import UserPage from 'components/pages/UserPage'
import TodoPage from 'components/pages/TodoPage'

// 遅延レンダリング
// magicコメントでwebpackが勝手にファイル名をリネームするのを防ぐ
const NotFound = asyncComponent(() => import(/* webpackChunkName: 'notfound' */ 'components/pages/NotFound'))

// ReactHotLoader時は全部読み込んでしまう
if (module.hot) {
  require('components/pages/NotFound')
}

export default class App extends React.Component {
  render() {
    const { history } = this.props
    return (
      <Router history={history}>
        <Route component={AppRoute} />
      </Router>
    )
  }
}

const AppRoute = () => (
  <Switch>
    <Route exact path="/" component={UserPage} />
    <Route exact path="/amp" component={UserPage} />
    <Route path="/todo" component={TodoPage} />
    <Route path="/amp/todo" component={TodoPage} />
    {/* それ以外のパス */}
    <Route component={NotFound} />
  </Switch>
)