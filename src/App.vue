<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer fixed :mini-variant="miniVariant" :clipped="clipped" v-model="drawer" app>
        <v-list v-if="userIsAuthenticated">
          <v-list-tile router :to="item.to" :key="i" v-for="(item, i) in items" exact>
            <v-list-tile-action>
              <v-icon v-html="item.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar fixed app :clipped-left="clipped" color="primary">
        <v-toolbar-side-icon @click.native.stop="drawer = !drawer" class="white--text" v-if="userIsAuthenticated" />

        <v-toolbar-title v-text="title" class="white--text"></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat icon color="white" @click.native.stop="logout" v-if="userIsAuthenticated">
          <v-icon>power_settings_new</v-icon>
        </v-btn>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <v-slide-y-transition mode="out-in">
            <router-view></router-view>
          </v-slide-y-transition>
        </v-container>
      </v-content>
      <v-footer :fixed="fixed" app>
        <v-spacer></v-spacer>
        <span>&copy; MOBA.txt v0.0.21 - 16/11/2018</span>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'MOBA.txt'
    }
  },
  computed: {
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },
    items () {
      return (this.$store.getters.user.email === 'farukz@gmail.com' || this.$store.getters.user.email === 'gdstorebr@gmail.com' || this.$store.getters.user.email === 'mobatxtadm@gmail.com')
        ? [
          { icon: 'videogame_asset', title: 'Jogar', to: '/carregarJogo' },
          { icon: 'person_pin', title: 'Jogadores', to: '/jogadores' },
          { icon: 'group', title: 'Times', to: '/times' }
        ]
        : [
          { icon: 'videogame_asset', title: 'Jogar', to: '/carregarJogo' }
        ]
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  },
  name: 'MOBAtxt'
}
</script>
