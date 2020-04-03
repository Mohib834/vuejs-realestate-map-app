<template>
  <v-autocomplete
    v-model="location"
    :search-input.sync="search"
    :items="searchItems"
    :loading="loading"
    hide-no-data=""
  />
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import axios from 'axios'

@Component
export default class autocomplete extends Vue {
    location = '';
    searchItems = [];
    search = null;
    loading = false;

    @Watch('search')
    handler (v:string) {
      // Items have already been loaded
      if (this.searchItems.length > 0) { return }

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
}
</script>
