<template>
  <v-toolbar
    color="primary"
  >
    <v-autocomplete
      class="autocomplete"
      prepend-inner-icon="mdi-magnify"
      :search-input.sync="search"
      :items="searchItems"
      :loading="loading"
      hide-no-data=""
      flat=""
      dark=""
      background-color="rgba(255,255,255,.1)"
      solo-inverted=""
      placeholder="Search city"
      color="#fff"
      dense=""
      style="color:#fff; top:15px"
      @change="storeSelectedLocation"
    />
  </v-toolbar>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import axios from 'axios'
import { store } from '../store'

@Component
export default class autocomplete extends Vue {
    searchItems = [];
    search = null;
    loading = false;

    @Watch('search')
    handler (v:string) {
      if (!v) {
        this.searchItems = []
      }
      // Items have already been loaded
      if (this.searchItems.length > 0 || !v) { return }

      // Items have already been requested
      if (this.loading) { return }

      this.loading = true

      axios.get('https://realtor.p.rapidapi.com/locations/auto-complete', {
        params: {
          input: v
        },
        headers: {
          'x-rapidapi-host': 'realtor.p.rapidapi.com',
          'x-rapidapi-key': 'd7a73d6dd8msh29a06dcb77bd699p18e444jsn45f9a3b34ad4'
        }
      }).then((res) => {
        this.searchItems = res.data.autocomplete.map((item:any) => {
          return item.city + ', ' + item.state_code
        })

        this.loading = false
        console.log(res)
      })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
        .finally(() => (this.loading = false))
    }

    storeSelectedLocation (data: string) {
      store.commit.SET_SELECTED_LOCATION(data)
      this.$emit('locationSelected')
    }
}
</script>

<style lang="scss">
.autocomplete {
  .v-input__slot{
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .v-select__slot input {
    color: #fff !important;
  }

  i{
    margin-top:2px !important;
  }

  input::placeholder {
    color:rgba(255,255,255,.5) !important;
  }
}
</style>
