import { defineModule } from 'direct-vuex'
import axios from 'axios'
import { moduleActionContext } from '../index'

type State = {
  selectedLocation: string;
  fetchedProperties: null | Array<{}>;
  loadingProperties: boolean;
}

const main = defineModule({
  state: (): State => ({
    selectedLocation: '',
    fetchedProperties: null,
    loadingProperties: false
  }),
  getters: {
    selectedLocation (state:State) {
      return state.selectedLocation
    },
    fetchedProperties (state: State) {
      return state.fetchedProperties
    },
    loadingProperties (state: State) {
      return state.loadingProperties
    }
  },
  mutations: {
    SET_SELECTED_LOCATION (state:State, payload: string) {
      state.selectedLocation = payload
    },
    SET_FETCHED_PROPERTIES (state:State, payload: Array<{}>) {
      state.fetchedProperties = payload
    },
    SET_LOADING_PROPERTIES_STATUS (state:State, payload: boolean) {
      state.loadingProperties = payload
    }
  },
  actions: {
    fetchProperties (context, payload?: {
      price?: {
        min: number;
        max?: number;
      };
      accomodities?: {
        minBeds: number,
        minBaths: number,
      }
    }): Promise<Array<any>> {
      const { getters, commit } = modActionContext(context)

      commit.SET_FETCHED_PROPERTIES([])

      const params = {
        city: getters.selectedLocation.split(', ')[0],
        state_code: getters.selectedLocation.split(', ')[1],
        radius: 10,
        limit: 90,
        price_min: 300,
        beds_min: 1,
        baths_min: 1
      } as {[key: string]: any}

      if (payload) {
        params.price_min = payload.price?.min
        params.price_max = payload.price?.max
        params.beds_min = payload.accomodities?.minBeds
        params.baths_min = payload.accomodities?.minBaths
      }

      commit.SET_LOADING_PROPERTIES_STATUS(true)

      return new Promise((resolve, reject) => {
        axios.get('https://realtor.p.rapidapi.com/properties/list-for-rent', {
          params,
          headers: {
            'x-rapidapi-host': 'realtor.p.rapidapi.com',
            'x-rapidapi-key': 'd7a73d6dd8msh29a06dcb77bd699p18e444jsn45f9a3b34ad4'
          }
        })
          .then((res) => {
            commit.SET_FETCHED_PROPERTIES(res.data.listings)
            commit.SET_LOADING_PROPERTIES_STATUS(false)
            resolve()
          })
          .catch((err) => {
            commit.SET_LOADING_PROPERTIES_STATUS(false)
            console.log(err)
            reject(err)
          })
      })
    }
  }
})

export default main

const modActionContext = (context: any) => moduleActionContext(context, main)
