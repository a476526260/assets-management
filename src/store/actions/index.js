import * as ajax from '@/assets/script/ajaxApi';
import state from '../states/index'

export default {
  getCdnQty: function ({commit}) {
    state.showLoading=true;
    return ajax.fetch_get('/api/cdn')
  },
  getGroupUser:function ({commit}) {
    return ajax.fetch_get('api/groupaccess/'+state.gid)
  },
}





