<template>
  <v-sheet
    height="40px"
    class="mb-2 px-4 d-flex align-center"
  >
    <v-icon color="primary">
      mdi-filter-outline
    </v-icon>
    <!-- Pricing -->
    <v-menu
      v-model="priceMenu"
      :close-on-content-click="false"
      :close-on-click="false"
      nudge-bottom="35px"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          height="30px"
          style="text-transform: initial"
          class="mr-2 ml-1"
          color="primary"
          dark=""
          append=""
          v-on="on"
          @click="roomsMenu = false"
        >
          Price
        </v-btn>
      </template>

      <v-card
        class="pa-3"
        width="420px"
        height="200px"
      >
        <v-card-title style="font-size: 16px; font-weight:normal">
          Set min and max rent of the property
        </v-card-title>
        <v-card-text>
          <v-range-slider
            v-model="range"
            :max="3500"
            :min="300"
            hide-details
            class="align-center"
          >
            <template v-slot:prepend>
              <v-text-field
                :value="range[0]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(range, 0, $event)"
              />
            </template>
            <template v-slot:append>
              <v-text-field
                :value="range[1]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(range, 1, $event)"
              />
            </template>
          </v-range-slider>
        </v-card-text>
        <v-card-actions class="d-flex justify-end px-4">
          <v-btn
            color="white"
            elevation="0"
            height="30px"
            width="90px"
            style="text-transform: initial"
            @click="priceMenu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            style="text-transform: initial"
            color="primary"
            dark
            height="30px"
            width="90px"
            @click="setFilter"
          >
            Apply
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    <!-- Rooms -->
    <v-menu
      v-model="roomsMenu"
      :close-on-content-click="false"
      :close-on-click="false"
      nudge-bottom="35px"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          height="30px"
          style="text-transform: initial"
          color="primary"
          elevation="2"
          v-on="on"
          @click="priceMenu = false"
        >
          Rooms/Bath
        </v-btn>
      </template>

      <v-card
        class="pa-5"
        width="420px"
      >
        <v-card-title style="font-size: 16px; font-weight:normal">
          Set min bathrooms / bedrooms number
        </v-card-title>
        <v-list>
          <v-list-item class="d-flex justify-space-between">
            <v-icon class="mr-5">
              mdi-sofa
            </v-icon>
            <span>Bedrooms</span>
            <span class="ml-auto">{{ bedrooms }}</span>
            <v-sheet class="ml-10">
              <v-btn
                icon=""
                color="primary"
                @click="bedrooms === 1 ? bedrooms : bedrooms --"
              >
                <v-icon size="16">
                  mdi-minus
                </v-icon>
              </v-btn>
              <v-btn
                icon
                color="primary"
                @click="bedrooms ++"
              >
                <v-icon
                  size="16"
                >
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-sheet>
          </v-list-item>
          <v-list-item class="d-flex justify-space-between">
            <v-icon class="mr-5">
              mdi-water-pump
            </v-icon>
            <span>Bathrooms</span>
            <span class="ml-auto">{{ bathrooms }}</span>
            <v-sheet class="ml-10">
              <v-btn
                icon=""
                color="primary"
                @click="bathrooms === 1 ? bathrooms : bathrooms --"
              >
                <v-icon size="16">
                  mdi-minus
                </v-icon>
              </v-btn>
              <v-btn
                icon
                color="primary"
                @click="bathrooms ++"
              >
                <v-icon
                  size="16"
                >
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-sheet>
          </v-list-item>
        </v-list>
        <v-card-actions class="d-flex justify-end px-4">
          <v-btn
            color="white"
            elevation="0"
            height="30px"
            width="90px"
            style="text-transform: initial"
            @click="roomsMenu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            dark
            height="30px"
            width="90px"
            @click="setFilter"
          >
            Apply
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-sheet>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { store } from '../store'
@Component
export default class Filters extends Vue {
  bedrooms = 1;
  bathrooms = 1;
  range = [300, 3500]
  priceMenu = false;
  roomsMenu = false;

  setFilter () {
    this.priceMenu = false
    this.roomsMenu = false

    const minPrice = this.range[0]
    const maxPrice = this.range[1]

    store.dispatch.fetchProperties({
      price: {
        min: minPrice,
        max: maxPrice === 3500 ? undefined : maxPrice
      },
      accomodities: {
        minBeds: this.bedrooms,
        minBaths: this.bathrooms
      }
    })
  }
}
</script>
