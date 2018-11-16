
<template>
  <v-container class="mt-5">
    <v-card absolute top>
      <v-btn color="green" dark medium absolute top right fab to="/time/0">
        <v-icon>add</v-icon>
      </v-btn>
      <v-btn color="red" dark medium absolute top left fab @click="carregarForcas()">
        <v-icon>add</v-icon>
      </v-btn>
      <v-data-table :headers="headers" :items="times" hide-actions >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.nome }}</td>
          <td class="text-xs-left">{{ props.item.sigla }}</td>
          <td class="text-xs-left">
            <v-avatar slot="activator" size="36px">
              <v-img :src="props.item.logo"></v-img>
            </v-avatar>
          </td>
          <td class="text-xs-left">{{ props.item.divisao }}º divisão</td>
          <td class="text-xs-left">{{ props.item.jogadores.length}}</td>
          <td class="text-xs-left">
            <v-btn color="grey" flat icon small class="white--text" :to="'/time/' + props.item.id">
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
      headers: [
        { text: 'Nome', value: 'nome' },
        { text: 'Sigla', value: 'sigla' },
        { text: 'Logo', value: 'logo' },
        { text: 'Divisão', value: 'divisao' },
        { text: 'Jogadores', value: 'jogadores' },
        { text: 'Ações', value: 'acoes' }
      ]
    }
  },
  computed: {
    times () {
      return this.$store.getters.times
    }
  },
  methods: {
    remover (id) {
      this.$store.dispatch('removerTime', id)
    },
    carregarForcas () {
      this.$store.getters.jogadores.forEach(j => {
        var random = Math.floor(Math.random() * 9) + 1

        if (j.lane === 'reserva') {
          random = Math.floor(Math.random() * 5) + 1
        } else if (j.lane === 'support') {
          random = Math.floor(Math.random() * 6) + 1
        } else if (j.lane === 'jungler') {
          random = Math.floor(Math.random() * 7) + 1
        }
        var divisao = Number(this.$store.getters.timeByID(j.time).divisao)
        var forca = random

        if (divisao === '1') {
          forca += 4
        } else if (divisao === '2') {
          forca += 3
        } else if (divisao === '3') {
          forca += 2
        } else if (divisao === '4') {
          forca += 1
        }

        j.forca = forca
        console.log(divisao + 'º ' + j.lane + ' ' + forca)
        this.$store.dispatch('alterarJogador', j)
      })
    },
    carregarJogadores () {
      this.times.forEach(time => {
        this.criaJogador('top', time)
        this.criaJogador('jungler', time)
        this.criaJogador('mid', time)
        this.criaJogador('carry', time)
        this.criaJogador('support', time)
        this.criaJogador('reserva', time)
        this.criaJogador('reserva', time)
      })
      console.log('carregarJogadores')
    },
    criaJogador (lane, time) {
      var jogador = {
        nome: lane + ' - ' + time.nome,
        forca: 1,
        lane: lane,
        time: time.id
      }
      this.$store.dispatch('criarJogador', jogador)
    }
  }
}
</script>
