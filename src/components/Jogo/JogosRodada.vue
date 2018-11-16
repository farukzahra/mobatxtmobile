<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <template v-for="(jogo,i) in jogos" v-if="jogos">
        <v-flex xs12 sm12 md12 lg6 xl6 :key="i">
          <core-jogo :jogo="jogo" :partida="i" :meutime="meuTime(jogo)"></core-jogo>
        </v-flex>
      </template>
      <div ref='baixo'></div>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  computed: {
    jogos () {
      return this.$store.getters.save.timesJogo[this.$store.getters.rodadaAtual - 1].jogos.sort((j1, j2) => {
        return j1.divisao > j2.divisao ? 1 : -1
      })
    },
    terminouRodada () {
      return this.$store.getters.terminouRodada
    }
  },
  watch: {
    terminouRodada (value) {
      console.log('terminouRodada', value)
      if (value) {
        console.log('this.$store.getters.totalRodadas', this.$store.getters.totalRodadas)
        if (this.$store.getters.rodadaAtual < this.$store.getters.totalRodadas) {
          this.$store.commit('setRodadaAtual', this.$store.getters.rodadaAtual + 1)
        }
        this.vendaJogadores()
        this.$router.push('/rodadas')
      }
    }
  },
  methods: {
    vendaJogadores: function () {
      console.log('this.$store.save.times', this.$store.save)
      this.$store.dispatch('vendaJogadores')
    },
    goto (refName) {
      var element = this.$refs[refName]
      console.log(element)
      var top = element.offsetTop
      console.log(top)
      window.scrollTo(0, top)
    },
    meuTime (jogo) {
      var meutime = this.$store.getters.meutime.id
      if (jogo.time1Selecao.id === meutime || jogo.time2Selecao.id === meutime) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>