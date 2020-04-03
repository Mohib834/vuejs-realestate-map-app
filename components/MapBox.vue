<template>
  <div id="map" />
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Index extends Vue {
    accessToken = 'pk.eyJ1IjoibW9oaWI2NjQ0IiwiYSI6ImNrN3llMnY1NzA1b2szb213Z2hndmhybzAifQ.qioZ5_Cu7zc4Xwc6hd6LrQ';
    map = {};

    mounted () {
      this.createMap()
    }

    createMap () {
      const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
      mapboxgl.accessToken = this.accessToken

      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [-79.4512, 43.6568],
        zoom: 13
      })
    }
}
</script>
<style lang="scss" scoped>
#map{
  height: 600px;
  margin-top: 20px;
}
</style>
