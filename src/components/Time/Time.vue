<template>
  <v-container grid-list-xl>
    <v-layout column align-center>
      <v-flex>
        <v-card>
          <v-flex xs12>
            <v-text-field label="Nome" v-model="time.nome" required></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Logo" v-model="time.logo" required></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Sigla" v-model="time.sigla" required></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-radio-group v-model="time.divisao" row>
              <v-radio label="1º divisão" value="1"></v-radio>
              <v-radio label="2º divisão" value="2"></v-radio>
              <v-radio label="3º divisão" value="3"></v-radio>
              <v-radio label="4º divisão" value="4"></v-radio>              
            </v-radio-group>
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
  }),
  computed: {
    time () {
      if (this.id === '0') {
        console.log('vazio')
        return { id: '', logo: '', sigla: '' }
      } else {
        console.log(this.id)
        return this.$store.getters.timeByID(this.id)
      }
    }
  },
  methods: {
    salvar: function () {
      if (this.id === '0') {
        this.$store.dispatch('criarTime', this.time)
      } else {
        this.$store.dispatch('alterarTime', this.time)
      }
      this.$router.push('/times')
      console.log(this.time)
    }
  }
}
</script>


<style scoped>
</style>
