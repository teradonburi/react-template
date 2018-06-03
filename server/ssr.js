/*globals CONFIG: false  */
import React from 'react'
// SSR用ライブラリ
import ReactDOMServer from 'react-dom/server'
// headタグreplace
import Helmet from 'react-helmet'
// Redux
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
// Material-UI SSR
import { SheetsRegistry } from 'react-jss/lib/jss'
import JssProvider from 'react-jss/lib/JssProvider'
import { MuiThemeProvider, createGenerateClassName } from '@material-ui/core/styles'
// React Router
import { StaticRouter } from 'react-router'
import { Route, Switch } from 'react-router-dom'
// reducer
import reducer from 'reducer/reducer'
// material-ui theme
import theme from 'common/theme'

// クライアントサイドと同じComponentを使う
import UserPage from 'components/pages/UserPage'
import TodoPage from 'components/pages/TodoPage'

const webOrigin = CONFIG.webOrigin


export default function ssr(req, res, initialData) {
  console.log('------------------ssr------------------')
  const context = {}
  // Material-UIの初期化
  const sheetsRegistry = new SheetsRegistry()
  const generateClassName = createGenerateClassName({productionPrefix: 'mm'})

  // Redux Storeの作成(initialDataには各Componentが参照するRedux Storeのstateを代入する)
  const store = createStore(reducer, initialData, applyMiddleware(thunk))


  let body = ReactDOMServer.renderToString(
    <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
        <Provider store={store}>
          {/* ここでurlに対応するReact RouterでComponentを取得 */}
          <StaticRouter location={req.url} context={context}>
            <Switch>
              <Route exact path="/" component={UserPage} />
              <Route exact path="/amp" component={UserPage} />
              <Route path="/todo" component={TodoPage} />
              <Route path="/amp/todo" component={TodoPage} />
            </Switch>
          </StaticRouter>
        </Provider>
      </MuiThemeProvider>
    </JssProvider>
  )


  const isAMP = /^\/amp/.test(req.path)
  if (isAMP) {
    // imgタグをamp-imgに置き換え
    body = body
      .replace(/<img layout=["']([\w\-]*)["'](("[\s\S]*?"|'[\s\S]*?'|[^'"])*?)>/g, (_, m1, m2) => `<amp-img layout="${m1}"${m2.slice(0, -1)}></amp-img>`)
      .replace(/<img(("[\s\S]*?"|'[\s\S]*?'|[^'"])*?)>/g, (_, m1) => `<amp-img layout="responsive" ${m1.slice(0, -1)}></amp-img>`)
      .replace(/focusable="false"/g, '')
  }

  res.write('<!doctype html>')
  // htmlを生成
  ReactDOMServer.renderToNodeStream(
    <HTML
      body={body}
      helmet={Helmet.renderStatic()}
      style={sheetsRegistry.toString()}
      initialData={initialData}
      isAMP={isAMP}
      originalURL={webOrigin + req.path.replace(/^\/amp\//, '/')}
      ampURL={isAMP ? '' : webOrigin + '/amp' + req.path}
    />
  ).pipe(res)
}

const HTML = ({bundles, style, initialData, helmet, isAMP, originalURL, ampURL, body}) => {
  return (
    <html lang='ja' {...(isAMP ? {amp: ''} : {})}>
      <head>
        <meta charSet="utf-8" />
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {helmet.script.toComponent()}
        {!isAMP && <link rel="amphtml" href={ampURL} />}
        <link rel="canonical" href={originalURL} />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='robots' content='noarchive' />
        <meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1' />
        {isAMP ? [
          <style key='bt' amp-boilerplate=''>{'body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}'}</style>,
          <noscript key='nos' dangerouslySetInnerHTML={{__html: '<style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style>'}} />,
          <style key='style' amp-custom='' dangerouslySetInnerHTML={{__html: style}} />,
          <script key='amp' async src='https://cdn.ampproject.org/v0.js'></script>,
          <script key='form' async custom-element="amp-form" src="https://cdn.ampproject.org/v0/amp-form-0.1.js"></script>,
        ] : [
          <style key='style' dangerouslySetInnerHTML={{__html: style}} />,
        ]
        }
      </head>
      <body>
        <div id='root' dangerouslySetInnerHTML={{__html: body}} />
        {!isAMP &&
            [
              <script key='data' id='initial-data' type='text/plain' data-json={JSON.stringify(initialData)}></script>,
              bundles ?
                bundles.map(bundle => <script key={bundle} type='text/javascript' src={bundle}></script>)
                :
                <script key='script' type='text/javascript' src='/bundle.js'></script>
            ]
        }
      </body>
    </html>
  )
}