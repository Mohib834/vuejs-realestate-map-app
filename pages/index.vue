<template>
  <main>
    <section>
      <v-container>
        <v-row>
          <v-col>
            <Autocomplete />
            <MapBox />
            <v-btn
              color="primary"
              @click="fetchData"
            >
              Fetch
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import axios from 'axios'

@Component({
  components: {
    MapBox: () => import('@/components/MapBox.vue'),
    Autocomplete: () => import('@/components/Autocomplete.vue')
  }
})
export default class Index extends Vue {
  fetchData () {
    axios.get('https://realtor.p.rapidapi.com/properties/list-for-sale', {
      headers: {
        'x-rapidapi-host': 'realtor.p.rapidapi.com',
        'x-rapidapi-key': 'd7a73d6dd8msh29a06dcb77bd699p18e444jsn45f9a3b34ad4'
      },
      params: {
        city: 'New york city',
        state_code: 'NY'
      }
    }).then((response) => {
      console.log(response)
    })
  }
}
</script>
