import {store} from '../store'

export default (to, from, next) => {
  if (store.getters.user && (store.getters.user.email === 'farukz@gmail.com' || store.getters.user.email === 'gdstorebr@gmail.com' || store.getters.user.email === 'mobatxtadm@gmail.com')) {
    console.log(store.getters.user)
    next()
  } else {
    next('/login')
  }
}
