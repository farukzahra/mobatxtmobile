<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>

        <v-layout align-center justify-center column fill-height>
          <img id="logo" class="logo" src="~@/assets/logo.png" alt="electron-vue" style="width: 50%;">
          <br /><br /><br />
          <v-flex>
            <v-btn @click="login" class="red white--text">
              <v-icon left dark>fab fa-google</v-icon>
              Entrar com Google
            </v-btn>
          </v-flex>
        </v-layout>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as firebase from 'firebase'

export default {
  data () {
    return {
      usuario: '',
      senha: ''
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/carregarJogo')
      }
    }
  },
  methods: {
    login: function () {
      var provider = new firebase.auth.GoogleAuthProvider()

      firebase.auth().signInWithRedirect(provider).then(function () {
        return firebase.auth().getRedirectResult()
      }).then((result) => {
        var token = result.credential.accessToken
        console.log(token)

        var user = result.user
        this.$store.dispatch('login', user)
        console.log(user)
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>

<style>
.v-btn .v-icon--left {
  margin-bottom: 5px;
}
</style>

