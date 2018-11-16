// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueCordova from 'vue-cordova'
import VueHead from 'vue-head'
import CoreJogo from './components/Jogo/CoreJogo.vue'
import * as firebase from 'firebase'
import { store } from './store'

import App from './App'
import router from './router'

import './assets/stylus-overrides.styl'

Vue.use(Vuetify)
Vue.config.productionTip = false
Vue.use(VueCordova)
Vue.use(VueHead)
Vue.use(router)

Vue.component('core-jogo', CoreJogo)

Vue.use(Vuetify, {
  iconfont: 'fa'
})

// add cordova.js only if serving the app through file://
if (window.location.protocol === 'file:' || window.location.port === '3000') {
  var cordovaScript = document.createElement('script')
  cordovaScript.setAttribute('type', 'text/javascript')
  cordovaScript.setAttribute('src', 'cordova.js')
  document.body.appendChild(cordovaScript)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyCT-bd90JFMT10du1L93e49zDAK7dohLLs',
      authDomain: 'mobatxt.firebaseapp.com',
      databaseURL: 'https://mobatxt.firebaseio.com/',
      projectId: 'mobatxt',
      storageBucket: ''
    })
    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     this.$store.dispatch('autoSignIn', user)
    //   }
    // })
    this.$store.dispatch('loadJogadores')
    this.$store.dispatch('loadTimes')
  },
  head: {
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      }
    ]
  }
})
