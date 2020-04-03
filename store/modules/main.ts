import { defineModule } from 'direct-vuex'
import { moduleActionContext } from '../index'

const main = defineModule({
  state: () => ({}),
  getters: {},
  mutations: {},
  actions: {}
})

export default main

const modActionContext = (context: any) => moduleActionContext(context, main)
