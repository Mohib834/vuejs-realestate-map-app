import { defineModule } from 'direct-vuex'
import axios from 'axios'
import { moduleActionContext } from '../index'

type Filters = {
  price: {
    min: number;
    max?: number;
  };
  accomodities: {
    baths: number;
    beds: number;
  }
}

type State = {
  selectedLocation: string;
  fetchedProperties: null | Array<{}>;
  loadingProperties: boolean;
  filters: Filters;
  page: number;
}

const main = defineModule({
  state: (): State => ({
    selectedLocation: '',
    fetchedProperties: null,
    loadingProperties: false,
    page: 0,
    filters: {
      price: {
        min: 300,
        max: 3500
      },
      accomodities: {
        baths: 1,
        beds: 1
      }
    }
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
    },
    filters (state: State) {
      return state.filters
    },
    page (state:State) {
      return state.page
    }
  },
  mutations: {
    SET_SELECTED_LOCATION (state:State, payload: string) {
      state.selectedLocation = payload
    },
    SET_FETCHED_PROPERTIES (state:State, payload: {
      properties: Array<{}>;
      pagination: boolean;
    }) {
      if (payload.pagination) { // if pagination then add the properties to existing properties
        payload.properties.forEach((p) => {
          state.fetchedProperties?.push(p) // eslint-disable-line
        })
      } else {
        state.fetchedProperties = payload.properties
      }
    },
    SET_LOADING_PROPERTIES_STATUS (state:State, payload: boolean) {
      state.loadingProperties = payload
    },
    SET_FILTERS (state: State, payload:Filters) {
      state.filters = payload
    },
    SET_PAGE (state: State, payload: number) {
      state.page = payload
    }
  },
  actions: {
    fetchProperties (context, payload?: {page: number}): Promise<Array<any>> {
      const { getters, commit } = modActionContext(context)
      const filters = getters.filters

      const params = {
        city: getters.selectedLocation.split(', ')[0],
        state_code: getters.selectedLocation.split(', ')[1],
        radius: 10,
        limit: 10,
        price_min: filters.price.min,
        price_max: filters.price.max,
        beds_min: filters.accomodities.beds,
        baths_min: filters.accomodities.baths,
        offset: 0,
        sort: 'completeness'
      } as {[key: string]: any}

      if (!payload) { // if no pagination clear the properties tab
        commit.SET_FETCHED_PROPERTIES({
          properties: [],
          pagination: false
        })
      } else { // if pagination add the page number / offset
        params.offset = payload.page * params.limit
      }

      commit.SET_LOADING_PROPERTIES_STATUS(true)

      return new Promise((resolve, reject) => {
        axios.get('https://realtor.p.rapidapi.com/properties/list-for-rent', {
          params,
          headers: {
            'x-rapidapi-host': 'realtor.p.rapidapi.com',
            'x-rapidapi-key': process.env.rapidApi
          }
        })
          .then((res) => {
            if (payload) {
              commit.SET_FETCHED_PROPERTIES({
                properties: res.data.listings,
                pagination: true
              })
            } else {
              commit.SET_FETCHED_PROPERTIES({
                properties: res.data.listings,
                pagination: false
              })
            }
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
