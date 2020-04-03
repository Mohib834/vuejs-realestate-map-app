<template>
  <!-- style="overflow-y:scroll" -->
  <v-card
    height="90vh"
    width="420px"
    style="border-radius: 5px; box-shadow: rgba(0, 0, 0, .2) 0px 4px 14px 0px"
  >
    <Autocomplete @locationSelected="getProperties" />

    <v-list>
      <template v-if="properties">
        <v-list-item-group>
          <v-list-item
            v-for="property in properties"
            :key="property.property_id"
            color="primary"
            flat=""
            class="py-5 px-5 d-flex align-center"
            style="border-radius:0;"
            @click="goToLocation([property.lon, property.lat])"
          >
            <v-sheet>
              <v-img
                v-if="property.photo"
                class="mr-5"
                :src="property.photo"
                width="120px"
                height="120px"
                style="border-radius:3px"
              />
              <v-img
                v-else
                class="mr-5"
                :src="require('@/assets/no-image.jpg')"
                width="120px"
                height="120px"
                style="border-radius:3px"
              />
            </v-sheet>
            <v-sheet>
              <p
                class="mb-0 subtitle-2"
              >
                {{ property.beds }} Bedroom, {{ property.baths }} Bathroom Apartment
              </p>
              <p class="mb-0 caption">
                {{ property.address_new.line }}
              </p>
              <p class="title font-weight-bold">
                {{ property.price }}
              </p>
            </v-sheet>
          </v-list-item>
        </v-list-item-group>
      </template>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { store } from '../store'

@Component({
  components: {
    Autocomplete: () => import('@/components/Autocomplete.vue')
  }
})
export default class PropertyListings extends Vue {
  get properties () {
    return store.getters.fetchedProperties
  }

  getProperties () {
    store.dispatch.fetchProperties().then(() => {
      this.$emit('emitPlaceMarker')
    })
  }

  goToLocation (value: Array<number>) {
    this.$emit('emitGoToLocation', value)
  }
}
</script>
