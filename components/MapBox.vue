<template>
  <div class="position:relative">
    <div id="map" />
    <PropertyListings
      style="position:absolute; top:50%; left: 80px; transform:translateY(-50%)"
      @emitGoToLocation="flyLocation"
      @emitPlaceMarker="addLocationMarker"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { store } from '../store'

let mapboxgl:any
if (process.client) {
  mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
}

@Component({
  components: {
    PropertyListings: () => import('@/components/PropertyListings.vue')
  }
})
export default class Index extends Vue {
    accessToken = 'pk.eyJ1IjoibW9oaWI2NjQ0IiwiYSI6ImNrN3llMnY1NzA1b2szb213Z2hndmhybzAifQ.qioZ5_Cu7zc4Xwc6hd6LrQ';
    map = {} as {[key:string]: any}
    flying = false;

    get properties () {
      return store.getters.fetchedProperties
    }

    mounted () {
      this.createMap()
    }

    createMap () {
      mapboxgl.accessToken = this.accessToken

      // initializing the Map
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mohib6644/ck8mwus9w21t31inxb3qtcdsm?optimize=true',
        center: [-74.0066, 40.7135],
        zoom: 13
      })
    }

    flyLocation (payload: Array<number>) {
      this.map.flyTo({
        center: payload,
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
        zoom: 15
      })
    }

    addLocationMarker () {
      // # Setting the markers on the searched locations on the map

      // Creating a geojson object of the property locations
      const geojson = {
        type: 'FeatureCollection',
        features: [] as Array<{
          type: string;
          geometry:{
            type: string;
            coordinates: Array<number>;
          };
          properties: {
            title: string;
            description: string;
          }
        }>
      }

      this.properties!.forEach((p:any) => {
        geojson.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [p.lon, p.lat]
          },
          properties: {
            title: 'Mapbox',
            description: p.address
          }
        })
      })

      // Setting the marker on the map with the help of geojson object.
      geojson.features.forEach((marker, idx) => {
        // create a HTML element for each feature
        const el = document.createElement('div')
        el.className = 'marker'
        // @ts-ignore
        const propertyPrice = this.properties![idx].price.includes('+') ? this.properties![idx].price.split('+')[0] : this.properties![idx].price.split('/')[0]
        el.innerHTML = `<div style="position:relative"><div class="price">${propertyPrice}</div><div class="shape"></div></div>`

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .addTo(this.map)
      })
    }
}
</script>
<style lang="scss">
#map{
  height: 100vh;
  width: 100vw;
}
</style>
