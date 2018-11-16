<template>
  <v-container grid-list-xl>
    <v-layout column align-center>
      <v-card>

        <v-data-table :headers="headers" :items="timesSave" hide-actions  :disable-initial-sort="disableinitialsort">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.nome }}</td>
            <td class="text-xs-left">
              <v-btn color="grey" flat icon small class="white--text" @click="escolheTime(props.item.id)">
                <v-icon>play_arrow</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>        
      </v-card>

    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      headers: [
        { text: 'Time', value: 'time' }
      ],
      disableinitialsort: true
    }
  },
  computed: {
    timesSave () {
      return this.$store.getters.timesSaveUltimaDivisao
    }
  },
  methods: {
    escolheTime: function (id) {
      this.$store.dispatch('escolheTime', id)
      this.$router.push('/rodadas')
    }
  }
}
</script>