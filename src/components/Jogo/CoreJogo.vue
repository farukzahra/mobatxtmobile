<template>
  <v-flex v-if="time1 !== null && time2 !== null" column align-center class="pa-0">
    <v-card :dark="meutime" :light="!meutime" :style="styleacabou">
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs6 text-xs-right pr-2 font-weight-black title>
            <div class="white darken-2 text-xs-center">
              <span class="black--text">
                <v-avatar slot="activator" size="36px">
                  <v-img :src="time1.logo"></v-img>
                </v-avatar>
                {{time1.sigla}}
              </span>
            </div>
            <div class="red darken-4 text-xs-center">
              <span class="white--text">{{time1kills}}</span>
            </div>
          </v-flex>
          <v-flex xs6 pl-2 font-weight-black title>
            <div class="white darken-2 text-xs-center">
              <span class="black--text">
                {{time2.sigla}}
                <v-avatar slot="activator" size="36px">
                  <v-img :src="time2.logo"></v-img>
                </v-avatar>
              </span>
            </div>
            <div class="red darken-4 text-xs-center">
              <span class="white--text">{{time2kills}}</span>
            </div>
          </v-flex>
          <v-flex xs12 class="pa-0">
            <p class="text-xs-center subheading mb-0">{{contador}} minutos</p>
          </v-flex>
          <v-flex xs12 class="pa-0">
            <p class="text-xs-center subheading font-weight-bold mb-0">{{resultado}}</p>
          </v-flex>
        </v-layout>
        <v-expansion-panel>
          <v-expansion-panel-content>
            <div slot="header" class="font-weight-bold body">Estatisticas</div>
            <v-divider></v-divider>
            <v-layout row align-center>
              <v-flex xs6>
                <v-card dark>
                  <template v-for="(item, index) in timesPlayerkills1">
                    <v-list-tile :key="index">
                      <v-list-tile-content>
                        <v-list-tile-title>{{ time1[item.lane].nome }}</v-list-tile-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-list-tile-action-text>{{ item.score }}</v-list-tile-action-text>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider v-if="index + 1 < timesPlayerkills1.length" :key="`divider-${index}`"></v-divider>
                  </template>
                </v-card>
              </v-flex>
              <v-flex xs6>
                <v-card dark>
                  <template v-for="(item, index) in timesPlayerkills2">
                    <v-list-tile :key="index">
                      <v-list-tile-content>
                        <v-list-tile-title>{{ time2[item.lane].nome }}</v-list-tile-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-list-tile-action-text>{{ item.score }}</v-list-tile-action-text>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider v-if="index + 1 < timesPlayerkills2.length" :key="`divider-${index}`"></v-divider>
                  </template>
                </v-card>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-card-text>
    </v-card>
    <v-flex v-if="debug">
      <v-card>
        {{log}}
        <hr />
        {{time1}}
        <hr />
        {{time2}}
        <hr />
        {{time1Playerkills}}
        <hr />
        {{time2Playerkills}}
        <hr />
      </v-card>
    </v-flex>
  </v-flex>
</template>

<script>
export default {
  props: ['jogo', 'partida', 'meutime'],
  data: () => ({
    debug: false,
    jogorapido: false,
    premiokill: 0.05,
    premiotitularvitoria: 0.5,
    premioreservavitoria: 0.25,
    styleacabou: '',
    log: '',
    resultado: '',
    contador: 0,
    tempoJogo: 0,
    time1kills: 0,
    time2kills: 0,
    time1Playerkills: {
      top: {
        kill: 0,
        assist: 0,
        mortes: 0
      },
      jungler: {
        kill: 0,
        assist: 0,
        mortes: 0
      },
      mid: {
        kill: 0,
        assist: 0,
        mortes: 0
      },
      carry: {
        kill: 0,
        assist: 0,
        mortes: 0
      },
      support: {
        kill: 0,
        assist: 0,
        mortes: 0
      }
    },
    time2Playerkills: {
      top: {
        kill: 0,
        assist: 0,
        mortes: 0
      },
      jungler: {
        kill: 0,
        assist: 0,
        mortes: 0
      },
      mid: {
        kill: 0,
        assist: 0,
        mortes: 0
      },
      carry: {
        kill: 0,
        assist: 0,
        mortes: 0
      },
      support: {
        kill: 0,
        assist: 0,
        mortes: 0
      }
    },
    time1: null,
    time2: null
  }),
  computed: {
    times () {
      return this.$store.getters.times
    },
    timesPlayerkills1 () {
      var timesPlayerkills = []
      for (var key in this.time1Playerkills) {
        var pk = { lane: key, score: this.time1Playerkills[key].kill + '/' + this.time1Playerkills[key].mortes + '/' + this.time1Playerkills[key].assist }
        timesPlayerkills.push(pk)
      }
      // console.log(timesPlayerkills)
      return timesPlayerkills
    },
    timesPlayerkills2 () {
      var time2Playerkills = []
      for (var key in this.time2Playerkills) {
        var pk = { lane: key, score: this.time2Playerkills[key].kill + '/' + this.time2Playerkills[key].mortes + '/' + this.time2Playerkills[key].assist }
        time2Playerkills.push(pk)
      }
      // console.log(time2Playerkills)
      return time2Playerkills
    }
  },
  mounted () {
    this.jogar()
  },
  methods: {
    jogar: function () {
      this.contador = 0
      this.tempoJogo = Math.floor(Math.random() * 40) + 15
      this.time1 = this.$store.getters.timeSaveByID(this.jogo.time1Selecao.id)
      this.time2 = this.$store.getters.timeSaveByID(this.jogo.time2Selecao.id)
      console.log('time1', JSON.stringify(this.time1))
      console.log('time2', JSON.stringify(this.time2))
      this.time1kills = 0
      this.time2kills = 0
      this.resultado = ''
      if (this.jogorapido) {
        this.tempoJogo = 2
      }
      this.doJogar()
    },
    doJogar: function () {
      setTimeout(() => {
        this.log = ''
        var r1 = this.calcularForcaTime(this.time1)
        var r2 = this.calcularForcaTime(this.time2)
        if (r1.total !== r2.total) {
          if (r1.total > r2.total) {
            this.time1kills++
            this.log = 'Kill da ' + this.time1.nome + ' ' + r1.total + ' quem matou ' + r1.kill + ' quem morreu ' + r2.morte + ' ' + r2.total
            console.log('this.time1[r1.kill].forca + ' + this.premiokill, this.time1[r1.kill].forca + ' ' + this.premiokill)
            this.time1[r1.kill].forca = (Number(this.time1[r1.kill].forca) + this.premiokill).toFixed(2)
            console.log('this.time1[r1.kill].forca ', this.time1[r1.kill].forca)
            this.time1Playerkills[r1.kill].kill++
            this.time1Playerkills[r1.assist].assist++
            this.time2Playerkills[r2.morte].mortes++
            this.time1.kill++
            this.time1.assist++
            this.time2.mortes++
          } else {
            this.time2kills++
            this.log = 'Kill da ' + this.time2.nome + ' ' + r2.total + ' quem matou ' + r2.kill + ' quem morreu ' + r1.morte + ' ' + r1.total
            console.log('this.time1[r2.kill].forca + ' + this.premiokill, this.time2[r2.kill].forca + ' ' + this.premiokill)
            this.time2[r2.kill].forca = (Number(this.time2[r2.kill].forca) + this.premiokill).toFixed(2)
            console.log('this.time2[r2.kill].forca ', this.time2[r2.kill].forca)
            this.time2Playerkills[r2.kill].kill++
            this.time2Playerkills[r2.assist].assist++
            this.time1Playerkills[r1.morte].mortes++
            this.time2.kill++
            this.time2.assist++
            this.time1.mortes++
          }
          console.log('---------------------')
        }
        this.contador++
        if (this.contador < this.tempoJogo) {
          this.doJogar()
        } else {
          console.log(this.time1kills + ' ' + this.time2kills)
          if (this.time1kills === this.time2kills) {
            this.tempoJogo++
            this.doJogar()
            return null
          }
          console.log(this.jogo)
          if (this.time1kills > this.time2kills) {
            this.premiaTime(1)
          } else {
            this.premiaTime(2)
          }
          return null
        }
      }, 1000)
    },
    premiaTime: function (qual) {
      var timeVencedor = ''
      if (qual === 1) {
        timeVencedor = this.time1
      } else {
        timeVencedor = this.time2
      }
      this.resultado = 'GG ' + timeVencedor.nome
      this.styleacabou = 'background-color:#267F77 !important;'
      this.$store.dispatch('salvaGanhador', {
        partida: this.partida,
        timeVencedor: timeVencedor
      })

      timeVencedor.top.forca = (Number(timeVencedor.top.forca) + this.premiotitularvitoria).toFixed(2)
      timeVencedor.jungler.forca = (Number(timeVencedor.jungler.forca) + this.premiotitularvitoria).toFixed(2)
      timeVencedor.mid.forca = (Number(timeVencedor.mid.forca) + this.premiotitularvitoria).toFixed(2)
      timeVencedor.carry.forca = (Number(timeVencedor.carry.forca) + this.premiotitularvitoria).toFixed(2)
      timeVencedor.support.forca = (Number(timeVencedor.support.forca) + this.premiotitularvitoria).toFixed(2)

      timeVencedor.reservas.forEach((r) => {
        r.forca = (Number(r.forca) + this.premioreservavitoria).toFixed(2)
      })
    },
    calcularForcaTime: function (time) {
      console.log(time)
      var forcaTimeArray = []
      forcaTimeArray.push({ lane: 'top', forca: this.calcularForca(time.top.forca) })
      forcaTimeArray.push({ lane: 'mid', forca: this.calcularForca(time.mid.forca) })
      forcaTimeArray.push({ lane: 'jungler', forca: this.calcularForca(time.jungler.forca) })
      forcaTimeArray.push({ lane: 'carry', forca: this.calcularForca(time.carry.forca) })
      forcaTimeArray.push({ lane: 'support', forca: this.calcularForca(time.support.forca) })
      // //console.log(forcaTimeArray)
      var total = 0
      forcaTimeArray.forEach(function (e) {
        total = total + e.forca
      })

      forcaTimeArray.sort((a, b) => a.forca > b.forca ? -1 : 1)

      // console.log(forcaTimeArray)

      return { total: total, kill: forcaTimeArray[0].lane, assist: forcaTimeArray[1].lane, morte: forcaTimeArray[forcaTimeArray.length - 1].lane }
    },
    calcularForca: function (forca) {
      // console.log(forca)
      var forcaArray = Array.from({ length: forca }, () => Math.floor(Math.random() * 10))
      var max = forcaArray.reduce(function (a, b) {
        return Math.max(a, b)
      })
      return max
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.logs {
  overflow: auto;
}

.v-list__tile__title {
  font-size: 12px;
}
</style>
