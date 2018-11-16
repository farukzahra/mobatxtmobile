<template>
  <v-container grid-list-xl>
    <v-layout column align-center>
      <v-card>
        <v-tabs fixed-tabs>
          <v-tab>
            Tabela
          </v-tab>
          <v-tab-item>
            <v-card flat>
              <v-layout row wrap text-xs-center>
                <template v-for="(t1,i2) in timesJogo" v-if="timesJogo">
                  <v-flex xs12 :key="i2" v-if="rodadaAtual == t1.rodada && !t1.terminou">
                    <v-btn id="btnrodada" color="red" class="white--text" @click="loadRodadaAtual(t1.rodada)">{{t1.rodada}}º RODADA</v-btn>
                  </v-flex>
                </template>
                <v-flex xs12 v-if="terminouCampeonato">
                  <v-btn color="green" class="white--text" @click="reiniciar()" v-if="terminouCampeonato">Reiniciar</v-btn>
                </v-flex>
              </v-layout>
              <div v-for="(times,i) in timesSave" :key="i">
                <v-card-title>
                  <div class="font-weight-black">{{i+1}}º divisão</div>
                  <v-spacer></v-spacer>
                </v-card-title>
                <v-data-table :headers="headers" :items="times" hide-actions :disable-initial-sort="disableinitialsort">
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.pontos }}</td>
                    <td>{{ props.item.nome }} <v-icon v-if="props.item.meutime" color="red">star</v-icon>
                    </td>
                    <td>R$ {{ (props.item.caixa).toLocaleString('pt-BR') }}</td>
                    <td>{{ props.item.kill }}/{{ props.item.mortes }}</td>
                    <td>{{ props.item.kill - props.item.mortes }}</td>
                  </template>
                </v-data-table>
              </div>
            </v-card>
            <v-card-title>
              <h4>Vendas da Rodada</h4>
            </v-card-title>
            <v-divider></v-divider>
            <v-list dense>
              <template v-for="(log,index) in logvendas">

                <v-list-tile :key="index">
                  <v-list-tile-content>
                    <v-list-tile-content v-text="log"></v-list-tile-content>
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider v-if="index + 1 < logvendas.length" :key="`divider-${index}`"></v-divider>

              </template>

            </v-list>
          </v-tab-item>

          <v-tab>
            Meu Time
          </v-tab>
          <v-tab-item>
            <v-card flat>
              <v-data-table :headers="headersmt" :items="meutime()" hide-actions>
                <template slot="items" slot-scope="props">
                  <td>
                    <v-radio-group v-model="selected" name="rowSelector">
                      <v-radio :value="props.item" />
                    </v-radio-group>
                  </td>
                  <td>{{ props.item.lane }}</td>
                  <td>{{ props.item.nome }}</td>
                  <td>{{ props.item.forca }}</td>
                  <td>R$ {{ (props.item.forca * 1500).toLocaleString('pt-BR') }}</td>
                </template>
              </v-data-table>
              <v-data-table :headers="headersmt" :items="meutimereserva()" hide-actions>
                <template slot="items" slot-scope="props">
                  <td>
                    <v-radio-group v-model="selectedreserva" name="rowSelector">
                      <v-radio :value="props.item" />
                    </v-radio-group>
                  </td>
                  <td>{{ props.item.lane }}</td>
                  <td>{{ props.item.nome }}</td>
                  <td>R$ {{ (props.item.forca * 1500).toLocaleString('pt-BR') }}</td>
                  <td>
                    <v-btn color="red" class="white--text" @click="vender(props.item)" :disabled="props.item.venda">Vender</v-btn>
                  </td>
                </template>
              </v-data-table>

              <v-container grid-list-md text-xs-center>
                <v-layout row wrap>
                  <v-btn color="red" class="white--text" @click="trocar()" v-if="selected !== '' && selectedreserva !== ''">Trocar</v-btn>
                </v-layout>
              </v-container>
            </v-card>
          </v-tab-item>

          <v-tab>
            Vendas
          </v-tab>
          <v-tab-item>
            <v-card flat>
              <v-card-title>
                <h4>Meu caixa : R$ {{meucaixa.toLocaleString('pt-BR')}}</h4>
              </v-card-title>
              <v-divider></v-divider>
              <v-data-table :headers="headersvendas" :items="jogadoresvendas" item-key="nome" hide-actions>
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.nome }}</td>
                  <td>{{ timeSaveByID(props.item.time).nome }}</td>
                  <td>R$ {{ (props.item.forca * 1500).toLocaleString('pt-BR') }}</td>
                  <td>
                    <v-btn color="red" class="white--text" @click="comprar(props.item.id)" :disabled="((props.item.forca * 1500) > meucaixa) || (props.item.time === meutimenome)">Comprar</v-btn>
                  </td>
                </template>
              </v-data-table>

            </v-card>
          </v-tab-item>
        </v-tabs>

      </v-card>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  data () {
    return {
      selected: '',
      rodada: 1,
      selectedreserva: '',
      headers: [
        { text: 'Pontos', value: 'pontos' },
        { text: 'Time', value: 'time' },
        { text: 'Caixa', value: 'caixa' },
        { text: 'K/D', value: 'k/d' },
        { text: 'Saldo', value: 'saldo' }
      ],
      headersmt: [
        { text: 'Trocar', value: 'trocar' },
        { text: 'Lane', value: 'lane' },
        { text: 'Nome', value: 'nome' },
        { text: 'Valor', value: 'valor' }
      ],
      headersvendas: [
        { text: 'Nome', value: 'nome' },
        { text: 'Time', value: 'time' },
        { text: 'Valor', value: 'valor' }
      ],
      disableinitialsort: true
    }
  },
  computed: {
    reservas () {
      var reservas = ''
      this.$store.getters.save.times.forEach(tj => {
        reservas += tj.nome + ' ' + tj.reservas.length + ' | '
      })
      return reservas
    },
    logvendas () {
      return this.$store.getters.save.logvendas
    },
    mt () {
      return this.$store.getters.meutime
    },
    meucaixa () {
      return this.$store.getters.meutime.caixa
    },
    meutimenome () {
      return this.$store.getters.meutime.nome
    },
    timesJogo () {
      return this.$store.getters.save.timesJogo
    },
    jogadoresvendas () {
      return this.$store.getters.save.jogadoresvendas
    },
    times1divisao () {
      return this.timesSave[0]
    },
    times2divisao () {
      return this.timesSave[1]
    },
    times3divisao () {
      return this.timesSave[2]
    },
    times4divisao () {
      return this.timesSave[3]
    },
    timesSave () {
      var timesSave = []
      timesSave[0] = this.$store.getters.timesSave.filter(e => e.divisao === '1').sort((j1, j2) => {
        return (j1.pontos > j2.pontos) || (j1.pontos === j2.pontos && j1.kill - j1.mortes > j2.kill - j2.mortes) ? -1 : 1
      })
      timesSave[1] = this.$store.getters.timesSave.filter(e => e.divisao === '2').sort((j1, j2) => {
        return (j1.pontos > j2.pontos) || (j1.pontos === j2.pontos && j1.kill - j1.mortes > j2.kill - j2.mortes) ? -1 : 1
      })
      timesSave[2] = this.$store.getters.timesSave.filter(e => e.divisao === '3').sort((j1, j2) => {
        return (j1.pontos > j2.pontos) || (j1.pontos === j2.pontos && j1.kill - j1.mortes > j2.kill - j2.mortes) ? -1 : 1
      })
      timesSave[3] = this.$store.getters.timesSave.filter(e => e.divisao === '4').sort((j1, j2) => {
        return (j1.pontos > j2.pontos) || (j1.pontos === j2.pontos && j1.kill - j1.mortes > j2.kill - j2.mortes) ? -1 : 1
      })
      return timesSave
    },
    rodadaAtual () {
      return this.$store.getters.rodadaAtual
    },
    terminouCampeonato () {
      console.log('this.$store.getters.rodadaAtual', this.$store.getters.rodadaAtual)
      console.log('this.$store.getters.save.totalRodadas', this.$store.getters.save.totalRodadas)
      console.log('this.timesJogo[this.rodadaAtual - 1].terminou', this.timesJogo[this.rodadaAtual - 1].terminou)
      console.log('this.timesJogo[this.rodadaAtual - 1].terminou', this.timesJogo)
      return this.$store.getters.rodadaAtual === this.$store.getters.save.totalRodadas && this.timesJogo[this.rodadaAtual - 1].terminou === true
    }
  },
  methods: {
    reiniciar () {
      this.rodada = 1
      var ultimo1 = this.findUltimoColocado(1)
      var ultimo2 = this.findUltimoColocado(2)
      var ultimo3 = this.findUltimoColocado(3)
      console.log('ultimo1', ultimo1.nome)
      console.log('ultimo2', ultimo2.nome)
      console.log('ultimo3', ultimo3.nome)

      var primeiro2 = this.findPrimeiroColocado(2)
      var primeiro3 = this.findPrimeiroColocado(3)
      var primeiro4 = this.findPrimeiroColocado(4)
      console.log('primeiro2', primeiro2.nome)
      console.log('primeiro3', primeiro3.nome)
      console.log('primeiro4', primeiro4.nome)

      ultimo1.divisao = '2'
      ultimo2.divisao = '3'
      ultimo3.divisao = '4'

      primeiro2.divisao = '1'
      primeiro3.divisao = '2'
      primeiro4.divisao = '3'

      this.$store.getters.timesSave.forEach(t => {
        t.pontos = 0
        t.kill = 0
        t.assist = 0
        t.mortes = 0
      })

      var timesJogo = this.geraTimesJogo()
      timesJogo = timesJogo.concat(this.geraTimesJogo())

      this.$store.getters.save.rodadaAtual = 1
      this.$store.getters.save.timesJogo = timesJogo

      this.$store.commit('setSave', this.$store.getters.save)
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
    findUltimoColocado (divisao) {
      console.log(this.timesSave[divisao - 1])
      return this.timesSave[divisao - 1].slice(-1)[0]
    },
    findPrimeiroColocado (divisao) {
      console.log(this.timesSave[divisao - 1])
      return this.timesSave[divisao - 1].slice(0)[0]
    },
    trocaDivisoes (div1, div2, strdiv1, strdiv2) {
      var time = this.timesSave[div1].sort((j1, j2) => {
        return j1.pontos < j2.pontos ? -1 : 1
      })[0]

      this.$store.dispatch('trocaDivisao', { time: time, divisao: strdiv1 })

      time = this.timesSave[div2].sort((j1, j2) => {
        return j1.pontos > j2.pontos ? -1 : 1
      })[0]

      this.$store.dispatch('trocaDivisao', { time: time, divisao: strdiv2 })
    },
    meutimereserva: function () {
      var meutime = []
      var mt = this.mt

      console.log('mt', mt)

      mt.reservas.forEach(r => {
        meutime.push({
          id: r.id,
          nome: r.nome,
          lane: 'reserva',
          forca: r.forca,
          time: mt.nome,
          venda: r.venda
        })
      })
      return meutime
    },
    meutime: function () {
      var meutime = []
      var mt = this.mt
      console.log('this.$store.getters.meutime', this.$store.getters.meutime)
      meutime.push({
        id: mt.top.id,
        nome: mt.top.nome,
        lane: mt.top.lane,
        forca: mt.top.forca
      })
      meutime.push({
        id: mt.jungler.id,
        nome: mt.jungler.nome,
        lane: mt.jungler.lane,
        forca: mt.jungler.forca
      })
      meutime.push({
        id: mt.mid.id,
        nome: mt.mid.nome,
        lane: mt.mid.lane,
        forca: mt.mid.forca
      })
      meutime.push({
        id: mt.carry.id,
        nome: mt.carry.nome,
        lane: mt.carry.lane,
        forca: mt.carry.forca
      })
      meutime.push({
        id: mt.support.id,
        nome: mt.support.nome,
        lane: mt.support.lane,
        forca: mt.support.forca
      })

      return meutime
    },
    comprar: function (id) {
      this.$store.dispatch('comprarJogador', { time: this.$store.getters.meutime.id, jogador: id, trocarauto: false })
    },
    vender: function (item) {
      item.venda = true
      this.$store.dispatch('venderJogador', item.id)
    },
    loadRodadaAtual: function (rodada) {
      console.log(rodada)
      this.$store.commit('setRodadaAtual', rodada)
      this.$router.push('/jogosRodada')
    },
    trocar: function () {
      console.log(this.selected)
      this.$store.dispatch('inverterLane', { titular: this.selected, reserva: this.selectedreserva })
      console.log('meutimecomputed', this.meutime)
      console.log('meutimecomputed', this.meutimereserva)
    },
    timeSaveByID (id) {
      return this.$store.getters.timeSaveByID(id)
    }

  }
}
</script>

<style>
@media only screen and (max-width: 600px) {
  table.v-table tbody td:first-child,
  table.v-table tbody td:not(:first-child),
  table.v-table tbody th:first-child,
  table.v-table tbody th:not(:first-child),
  table.v-table thead td:first-child,
  table.v-table thead td:not(:first-child),
  table.v-table thead th:first-child,
  table.v-table thead th:not(:first-child) {
    padding: 5px !important;
  }
}
</style>
