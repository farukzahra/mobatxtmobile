<template>
  <v-container grid-list-xl>
    <v-layout column align-center>

      <v-card>
        <v-divider></v-divider>
        <div class="text-xs-center ma-3">
          <link href="https://fonts.googleapis.com/css?family=Cookie" rel="stylesheet"><a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/farukzahra"><img src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg" alt="Buy me a coffee"><span style="margin-left:5px">Buy me a coffee</span></a>
          <a target="_blank" href="https://discord.gg/b3RUXk">
            <img id="discord" src="~@/assets/discord.png" alt="discord" style="width: 10%;">
          </a>
        </div>
        <v-divider></v-divider>

        <div class="text-xs-center ma-2">
          <v-btn @click="novoJogo" color="green" dark class="">Novo Jogo</v-btn>
        </div>
        <v-divider></v-divider>

        <v-data-table :items="saves" hide-actions :disable-initial-sort="disableinitialsort">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.data }}</td>
            <td class="text-xs-left">
              <v-btn color="grey" flat icon small class="white--text" @click="carregarJogo(props.item)">
                <v-icon>play_arrow</v-icon>
              </v-btn>
              <v-btn color="grey" flat icon small class="white--text" @click="removerJogo(props.item)">
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'

export default {
  data: () => ({
    jogos: null,
    disableinitialsort: true,
    rodada: 1
  }),
  methods: {
    carregarJogo: function (save) {
      this.$store.dispatch('loadSave', save)
      this.$router.push('/rodadas')
    },
    novoJogo: function () {
      this.$store.dispatch('loadJogadores')
      this.$store.dispatch('loadTimes')
      var jogadores = this.$store.getters.jogadores

      var timesJogo = this.geraTimesJogo()
      timesJogo = timesJogo.concat(this.geraTimesJogo())

      var data = moment().format('DD/MM/YYYY HH:mm:ss')
      var save = {
        data: data,
        user: this.user.uid,
        times: this.times,
        timesJogo: timesJogo,
        jogadores: this.carregarForcas(jogadores),
        rodadaAtual: 1,
        totalRodadas: timesJogo.length,
        jogadoresvendas: [],
        logvendas: []
      }
      // Monta os times com os jogadores
      console.log('novoJogo', save.times)
      save.times.forEach((time, index, times) => {
        times[index] = this.carregarTime(time)
      })

      console.log('novoJogo save', save)

      this.$store.dispatch('newSave', save)
      this.$router.push('/escolheTime')
    },
    geraTimesJogo: function () {
      var timesJogo = []
      var t = 4
      var m = 2
      for (var i = 0; i < t - 1; i++) {
        timesJogo.push({
          rodada: this.rodada++,
          jogos: [],
          terminou: false
        })
        for (var j = 0; j < m; j++) {
          timesJogo[i].jogos.push(this.geraTJ(t, j, i, this.times1divisao, 1))
          timesJogo[i].jogos.push(this.geraTJ(t, j, i, this.times2divisao, 2))
          timesJogo[i].jogos.push(this.geraTJ(t, j, i, this.times3divisao, 3))
          timesJogo[i].jogos.push(this.geraTJ(t, j, i, this.times4divisao, 4))
        }
        this.times1divisao.splice(1, 0, this.times1divisao[this.times1divisao.length - 1])
        this.times1divisao.splice(this.times1divisao.length - 1, 1)

        this.times2divisao.splice(1, 0, this.times2divisao[this.times2divisao.length - 1])
        this.times2divisao.splice(this.times2divisao.length - 1, 1)

        this.times3divisao.splice(1, 0, this.times3divisao[this.times3divisao.length - 1])
        this.times3divisao.splice(this.times3divisao.length - 1, 1)

        this.times4divisao.splice(1, 0, this.times4divisao[this.times4divisao.length - 1])
        this.times4divisao.splice(this.times4divisao.length - 1, 1)
      }

      return timesJogo
    },
    geraTJ (t, j, i, a, divisao) {
      var tj = ''
      if ((j % 2 === 1) || (i % 2 === 1 && j === 0)) {
        tj = {
          divisao: divisao,
          time1Selecao: a[t - j - 1],
          time2Selecao: a[j],
          timeVencedor: null
        }
      } else {
        tj = {
          divisao: divisao,
          time1Selecao: a[j],
          time2Selecao: a[t - j - 1],
          timeVencedor: null
        }
      }
      return tj
    },
    carregarForcas (jogadores) {
      jogadores.forEach(j => {
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
      })
      return jogadores
    },
    carregarTime: function (time_) {
      var jogadores_ = this.$store.getters.jogadoresByTime(time_.id)

      console.log('jogadores_', jogadores_)
      var caixa = 13500
      if (time_.divisao === '2') {
        caixa = 12000
      } else if (time_.divisao === '3') {
        caixa = 10500
      } else if (time_.divisao === '4') {
        caixa = 9000
      }
      var time = {
        id: time_.id,
        caixa: caixa,
        nome: time_.nome,
        sigla: time_.sigla,
        logo: time_.logo,
        divisao: time_.divisao,
        pontos: 0,
        kill: 0,
        assist: 0,
        mortes: 0,
        top: jogadores_.find(jogador => {
          return jogador.lane === 'top'
        }),
        jungler: jogadores_.find(jogador => {
          return jogador.lane === 'jungler'
        }),
        mid: jogadores_.find(jogador => {
          return jogador.lane === 'mid'
        }),
        carry: jogadores_.find(jogador => {
          return jogador.lane === 'carry'
        }),
        support: jogadores_.find(jogador => {
          return jogador.lane === 'support'
        }),
        reservas: this.carregarReservas(jogadores_)
      }
      console.log('carregarTime time', time)
      return time
    },
    removerJogo: function (save) {
      console.log(save)
      this.$store.dispatch('removerSave', save)
    },
    carregarReservas: function (jogadores_) {
      var reservas = jogadores_.filter(jogador => {
        return jogador.lane === 'reserva'
      })
      return reservas
    }
  },
  computed: {
    times () {
      return this.$store.getters.times
    },
    times1divisao () {
      return this.$store.getters.times1divisao
    },
    times2divisao () {
      return this.$store.getters.times2divisao
    },
    times3divisao () {
      return this.$store.getters.times3divisao
    },
    times4divisao () {
      return this.$store.getters.times4divisao
    },
    saves () {
      return this.$store.getters.savesByUser
    },
    user () {
      return this.$store.getters.user
    }
  }
}
</script>

<style>
.bmc-button img {
  width: 27px !important;
  margin-bottom: 1px !important;
  box-shadow: none !important;
  border: none !important;
  vertical-align: middle !important;
}
.bmc-button {
  line-height: 36px !important;
  height: 37px !important;
  text-decoration: none !important;
  display: inline-flex !important;
  color: #ffffff !important;
  background-color: #ff813f !important;
  border-radius: 3px !important;
  border: 1px solid transparent !important;
  padding: 1px 9px !important;
  font-size: 22px !important;
  letter-spacing: 0.6px !important;
  box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5) !important;
  -webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;
  margin: 0 auto !important;
  font-family: "Cookie", cursive !important;
  -webkit-box-sizing: border-box !important;
  box-sizing: border-box !important;
  -o-transition: 0.3s all linear !important;
  -webkit-transition: 0.3s all linear !important;
  -moz-transition: 0.3s all linear !important;
  -ms-transition: 0.3s all linear !important;
  transition: 0.3s all linear !important;
}
.bmc-button:hover,
.bmc-button:active,
.bmc-button:focus {
  -webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;
  text-decoration: none !important;
  box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;
  opacity: 0.85 !important;
  color: #ffffff !important;
}
</style>