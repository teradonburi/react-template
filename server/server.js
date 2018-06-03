const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const grpc_client = require('../microservice/grpc_client')
const config = require('config')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// 例外ハンドリング
process.on('uncaughtException', (err) => console.log('uncaughtException => ' + err))
process.on('unhandledRejection', (err) => console.log('unhandledRejection => ' + err))

// webpackでbuild済みのSSRモジュールを読み込む
const ssr = require('./dist/ssr.build').default

let bundles = []
if (process.env.NODE_ENV === 'dev') {
  // webpack-dev-serverのbundle.jsにredirect
  app.get('/bundle.js', (req, res) => res.redirect('http://localhost:7070/bundle.js'))
} else if (process.env.NODE_ENV === 'production') {
  const jsdom = require('jsdom')
  const { JSDOM } = jsdom
  // distフォルダをホスティング
  app.use(express.static('dist'))
  // distのtemplate.htmlのbundle.jsパスを取得
  JSDOM.fromFile(__dirname + '/dist/template.html').then(dom => {
    const document = dom.window.document
    const scripts = document.querySelectorAll('script[type="text/javascript"]')
    for (let i = 0; i < scripts.length; i++) {
      const s = scripts[i]
      if (s.src.indexOf('bundle.js') !== -1 || s.src.indexOf('core.js') !== -1 || s.src.indexOf('react.js') !== -1) {
        bundles.push(s.src.replace('file:///', '/'))
      }
    }
    console.log(bundles)
  })
  app.all('*', (req, res, next) => {
    req.bundles = bundles
    next()
  })
}

async function UserPage(req, res) {
  // redux storeに代入する初期パラメータ、各ページの初期ステートと同じ構造にする
  const users = await grpc_client.index()
  const initialData = {
    user: {
      users,
    },
  }
  ssr(req, res, initialData)
}

async function TodoPage(req, res) {
  const initialData = {}
  ssr(req, res, initialData)
}

// UserPage
app.get('/',UserPage)
app.get('/amp',UserPage)
// TodoPage
app.get('/todo', TodoPage)
app.get('/amp/todo', TodoPage)

// ユーザ取得
app.get('/users', async (req, res) => {
  const users = await grpc_client.index()
  res.json({results: users})
})

// ユーザ作成
app.post('/users', async (req, res) => {
  console.log(req.body)
  const user = await grpc_client.create(req.body)
  res.json({results: user})
})

const port = config.get('port')
app.listen(port, function () {
  console.log(`app listening on port ${port}`)
})
