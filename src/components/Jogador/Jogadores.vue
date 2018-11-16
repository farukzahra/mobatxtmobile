
<template>
  <v-container class="mt-5">
    <v-card absolute top>
      <v-btn color="green" dark medium absolute top right fab to="/jogador/0">
        <v-icon>add</v-icon>
      </v-btn>
      <v-card-title>
        Jogadores
        <v-spacer></v-spacer>
        <v-select :items="times" label="Times" name="nome" item-text="nome" item-value="id" v-model="timeselecionado"></v-select>
      </v-card-title>

      <v-data-table :headers="headers" :items="jogadoresFiltrados" hide-actions  :disable-initial-sort="disableinitialsort" :search="search">
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">
            <v-text-field v-model="props.item.nome" required style="width:200px" @keyup.native="alterarJogador(props.item)"></v-text-field>
          </td>
          <td class="text-xs-left">{{ props.item.lane }}</td>
          <td class="text-xs-left">
            <v-text-field v-model="props.item.forca" required style="width:20px" @keyup.native="alterarJogador(props.item)"></v-text-field>
          </td>
          <!-- <td class="text-xs-left">{{ props.item.time }}</td> -->
          <td class="text-xs-left">{{ timeByID(props.item.time).nome }}</td>
          <td class="text-xs-left">
            <v-btn color="grey" flat icon small class="white--text" :to="'/jogador/' + props.item.id">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn color="grey" flat icon small class="white--text" @click="remover(props.item.id)">
              <v-icon>delete</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      headers: [
        { text: 'Nome', value: 'nome' },
        { text: 'Lane', value: 'lane' },
        { text: 'Força', value: 'forca' },
        { text: 'Time', value: 'time' },
        { text: 'Ações', value: 'acoes' }
      ],
      disableinitialsort: true,
      timeselecionado: null
    }
  },
  mounted () {
    this.$store.dispatch('loadJogadores')
  },
  computed: {
    jogadores () {
      return this.$store.getters.jogadores.sort((j1, j2) => { return j1.time > j2.time ? 1 : -1 })
    },
    times () {
      return this.$store.getters.times
    },
    jogadoresFiltrados () {
      return this.jogadores.filter((i) => {
        console.log(this.timeselecionado)
        console.log(i.type)
        return !this.timeselecionado || (i.time === this.timeselecionado)
      })
    }
  },
  methods: {
    remover (id) {
      this.$store.dispatch('removerJogador', id)
    },
    timeByID (id) {
      var a = this.$store.getters.timeByID(id)
      console.log(a)
      return a
    },
    alterarJogador (jogador) {
      this.$store.dispatch('alterarJogador', jogador)
    }

  }
}
</script>
