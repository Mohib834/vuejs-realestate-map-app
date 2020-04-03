<template>
  <main>
    <section>
      <v-container
        fluid
        class="pa-0"
      >
        <v-row class="pa-0">
          <v-col class="pa-0">
            <MapBox />
          </v-col>
        </v-row>
      </v-container>
    </section>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
@Component({
  components: {
    MapBox: () => import('@/components/MapBox.vue')
  }
})
export default class Index extends Vue {
  coordinates = [];
}
</script>
