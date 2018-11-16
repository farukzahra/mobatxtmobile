<template>
  <v-container grid-list-xl>
    <v-layout column align-center>
      <v-flex>
        <v-card>
          <v-flex xs12>
            <v-text-field label="Nome" v-model="jogador.nome" required></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Força" v-model="jogador.forca" required></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-select :items="lanes" label="Lanes" v-model="jogador.lane"></v-select>
          </v-flex>
          <v-flex xs12>
            <v-select :items="times" label="Time" name="time" item-text="nome" item-value="id" v-model="jogador.time"></v-select>
          </v-flex>
          <v-flex xs12>
            <v-btn color="primary" class="white--text" to="/jogadores">
              <v-icon left>chevron_left</v-icon>
              Voltar
            </v-btn>
            <v-btn color="orange darken-4" class="white--text" @click="salvar()">
              Salvar
              <v-icon right>save</v-icon>
            </v-btn>
          </v-flex>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ['id'],
  data: () => ({
    lanes: ['top', 'jungler', 'mid', 'carry', 'support', 'reserva']
  }),
  computed: {
    jogador () {
      if (this.id === '0') {
        console.log('vazio')
        return { id: '', nome: '', forca: 0 }
      } else {
        console.log(this.id)
        return this.$store.getters.jogadorByID(this.id)
      }
    },
    times () {
      return this.$store.getters.times
    }
  },
  methods: {
    salvar: function () {
      if (this.id === '0') {
        this.$store.dispatch('criarJogador', this.jogador)
      } else {
        this.$store.dispatch('alterarJogador', this.jogador)
      }
      this.$router.push('/jogadores')
      console.log(this.jogador)
    }
  }
}
</script>


<style scoped>
</style>
