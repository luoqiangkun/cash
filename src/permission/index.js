import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import { getLocalStorage,delLocalStorage} from '@/utils/storage'
const whiteList = ['/login'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  // determine whether the user has logged in
const ukey = getLocalStorage('ukey');
  if (ukey) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
    } else {
      // get user ticket
      try {
        if( !store.getters.user.uid ){
          const { userInfo } = await store.dispatch('user/getInfo')
        }
        if( !store.getters.shop.store_id ){
          const { storeInfo } = await store.dispatch('shop/storeInfo')
        }
      } catch (error) {
        await store.dispatch('user/logout')
        Message.error(error || 'Has Error')
        return next(`/login?redirect=${to.path}`)
      }
      next()
    }
  } else {
    /* has no ukey*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
    }
  }
})
router.afterEach(() => {

})
