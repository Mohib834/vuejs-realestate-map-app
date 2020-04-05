<template>
  <!-- style="overflow-y:scroll" -->
  <v-card
    height="678px"
    width="420px"
    style="overflow:hidden; border-radius: 5px; box-shadow: rgba(0, 0, 0, .2) 0px 4px 14px 0px"
  >
    <Autocomplete
      class="mb-4"
      @locationSelected="getProperties"
    />
    <Filters
      @filterApplied="getProperties"
    />
    <p
      v-if="properties"
      class="caption px-5 mb-0"
      style="font-size:13px !important;"
    >
      Showing {{ properties.length }} results
    </p>

    <template v-if="!properties">
      <v-img
        :src="require('@/assets/house-search.png')"
        contain
        width="250px"
        height="250px"
        class="mx-auto"
        style="top:20px"
      />
      <v-sheet
        color="primary"
        width="80%"
        height="40px"
        class="d-flex justify-center align-center mx-auto mt-6 text-center"
        dark=""
        style="box-shadow: 0 10px 5px rgba(0,0,0,.2); cursor: context-menu"
      >
        Search city to get the property listings
      </v-sheet>
    </template>
    <template v-if="loadingProperties && !loadingMoreProperties">
      <v-sheet
        v-for="n in 3"
        :key="n"
        class="px-4 d-flex align-center mt-11"
      >
        <v-skeleton-loader
          type="card-avatar"
          width="125px"
          height="125px"
        />
        <v-skeleton-loader
          height="94"
          type="list-item-three-line"
          style="flex: 1;"
        />
      </v-sheet>
    </template>
    <v-list
      v-else
    >
      <v-list-item-group
        ref="propertiesContainer"
        style="height:522px"
        class="properties pb-2"
        :style="properties && 'overflow-y: scroll;'"
      >
        <v-list-item
          v-for="(property, i) in properties"
          :key="i"
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
            >
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    width="2"
                    size="20"
                    indeterminate
                    color="primary"
                  />
                </v-row>
              </template>
            </v-img>
            <v-img
              v-else
              class="mr-5"
              :src="require('@/assets/no-image.png')"
              width="120px"
              height="120px"
              style="border-radius:3px"
            >
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    width="2"
                    size="20"
                    indeterminate
                    color="primary"
                  />
                </v-row>
              </template>
            </v-img>
          </v-sheet>
          <v-sheet>
            <p
              class="mb-0 subtitle-2"
            >
              {{ property.beds }} Bedroom, {{ property.baths }} Bathroom Apartment
            </p>
            <p class="mb-0 caption">
              {{ property.address }}
            </p>
            <p class="title font-weight-bold">
              {{ property.price.includes('+') ? property.price.split('+')[0] : property.price.split('/')[0] }}
            </p>
          </v-sheet>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'nuxt-property-decorator'
import { store } from '../store'

@Component({
  components: {
    Autocomplete: () => import('@/components/Autocomplete.vue'),
    Filters: () => import('@/components/Filters.vue')
  }
})
export default class PropertyListings extends Vue {
  loadingMoreProperties = false;

  @Ref('propertiesContainer') propertiesContainer!: any;

  get loadingProperties () {
    return store.getters.loadingProperties
  }

  get properties () {
    return store.getters.fetchedProperties
  }

  mounted () {
    this.scrollFetch()
  }

  scrollFetch () {
    const propertiesContainer = this.propertiesContainer.$el

    propertiesContainer.onscroll = () => {
      let bottom = false
      const containerScrollHeight = propertiesContainer.scrollHeight
      const scrollPosition = Math.ceil(propertiesContainer.scrollTop + propertiesContainer.offsetHeight)

      bottom = containerScrollHeight === scrollPosition
      if (bottom) {
        this.loadingMoreProperties = true
        let currentPage = store.getters.page
        currentPage++
        store.commit.SET_PAGE(currentPage)
        this.getProperties({ page: currentPage })
          .then(() => {
            this.loadingMoreProperties = false
          })
          .catch(() => {
            this.loadingMoreProperties = false
          })
      }
    }
  }

  getProperties (payload: {page: number} | undefined = undefined) {
    return new Promise((resolve, reject) => {
      store.dispatch
        .fetchProperties(payload)
        .then(() => {
          this.$emit('emitPlaceMarker')
          this.scrollFetch()
          resolve()
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        })
    })
  }

  goToLocation (value: Array<number>) {
    this.$emit('emitGoToLocation', value)
  }
}
</script>

<style lang="scss" scoped>
.properties::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

.properties::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

.properties::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #ccc;
}
</style>
