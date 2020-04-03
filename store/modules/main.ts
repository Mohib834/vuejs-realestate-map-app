import { defineModule } from 'direct-vuex'
import axios from 'axios'
import { moduleActionContext } from '../index'

type State = {
  selectedLocation: string;
  fetchedProperties: null | Array<{}>;
}

const main = defineModule({
  state: (): State => ({
    selectedLocation: '',
    fetchedProperties: null
  }),
  getters: {
    selectedLocation (state:State) {
      return state.selectedLocation
    },
    fetchedProperties (state: State) {
      return state.fetchedProperties
    }
  },
  mutations: {
    SET_SELECTED_LOCATION (state:State, payload: string) {
      state.selectedLocation = payload
    },
    SET_FETCHED_PROPERTIES (state:State, payload: Array<{}>) {
      state.fetchedProperties = payload
    }
  },
  actions: {
    fetchProperties (context): Promise<Array<any>> {
      const { getters, commit } = modActionContext(context)
      const params = {
        city: getters.selectedLocation.split(', ')[0],
        state_code: getters.selectedLocation.split(', ')[1],
        radius: 10,
        limit: 3
      }

      return new Promise((resolve, reject) => {
        axios.get('https://realtor.p.rapidapi.com/properties/list-for-sale', {
          params,
          headers: {
            'x-rapidapi-host': 'realtor.p.rapidapi.com',
            'x-rapidapi-key': 'd7a73d6dd8msh29a06dcb77bd699p18e444jsn45f9a3b34ad4'
          }
        })
          .then((res) => {
            commit.SET_FETCHED_PROPERTIES(res.data.listings)
            console.log(res.data.listings)
            resolve()
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    }
  }
})

export default main

const modActionContext = (context: any) => moduleActionContext(context, main)
