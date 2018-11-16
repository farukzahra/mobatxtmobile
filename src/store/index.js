import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'moba-txt',
  storage: window.localStorage,
  supportCircular: true
})

export const store = new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state: {
    jogadores: [],
    times: [],
    user: null,
    loading: false,
    error: null,
    saves: [],
    save: null
  },
  mutations: {
    setLoadedJogadores (state, payload) {
      state.jogadores = payload
    },
    criarJogador (state, payload) {
      state.jogadores.push(payload)
    },
    alterarJogador (state, payload) {
      var idx = state.jogadores.findIndex(x => x.id === payload.id)
      console.log('alterarJogador', payload.forca)
      state.jogadores[idx] = payload
    },
    removerJogador (state, payload) {
      state.jogadores = state.jogadores.filter(item => item.id !== payload.id)
    },
    setLoadedTimes (state, payload) {
      state.times = payload
    },
    criarTime (state, payload) {
      state.times.push(payload)
    },
    alterarTime (state, payload) {
      var idx = state.times.findIndex(x => x.id === payload.id)
      state.times[idx] = payload
    },
    removerTime (state, payload) {
      state.times = state.times.filter(item => item.id !== payload.id)
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    addSave (state, payload) {
      state.saves.push(payload)
    },
    setSave (state, payload) {
      state.save = payload
    },
    setRodadaAtual (state, payload) {
      state.save.rodadaAtual = payload
    },
    removerSave (state, payload) {
      console.log(payload.data)
      state.saves = state.saves.filter((s) => s.data !== payload.data)
    },
    salvaGanhador (state, payload) {
      state.save.timesJogo[state.save.rodadaAtual - 1].jogos[payload.partida].timeVencedor = payload.timeVencedor
      console.log(payload.timeByID)
      if (payload.timeByID.hasOwnProperty('pontos')) {
        payload.timeByID.pontos++
      } else {
        payload.timeByID.pontos = 1
      }
      payload.timeByID.caixa = payload.timeByID.caixa + 500
      console.log(payload.timeByID.nome + ' ' + payload.timeByID.pontos)
    },
    fechaRodada (state, payload) {
      var terminou = true
      var jogos = state.save.timesJogo[state.save.rodadaAtual - 1].jogos
      jogos.forEach((jogo) => {
        if (jogo.timeVencedor == null) {
          terminou = false
        }
      })
      state.save.timesJogo[state.save.rodadaAtual - 1].terminou = terminou
    },
    escolheTime (state, payload) {
      console.log('state.save.meutime.id', payload)
      var idx = state.save.times.map((t) => { return t.id }).indexOf(payload)
      console.log('state.save.meutime.idx', idx)
      state.save.meutime = state.save.times[idx].id
      console.log('state.save.meutime', state.save.meutime)
      state.save.times[idx].meutime = true
      state.save.times.forEach((time, i) => {
        if (time.id === payload) {
          time.meutime = true
        } else {
          time.meutime = false
        }
      })
    }
  },
  actions: {
    loadJogadores ({ commit, getters }) {
      commit('setLoading', true)
      firebase
        .database()
        .ref('jogadores')
        .once('value')
        .then(data => {
          const jogadores = []
          const obj = data.val()
          for (let key in obj) {
            console.log('time: obj[key].time', obj[key].time)
            jogadores.push({
              id: key,
              nome: obj[key].nome,
              forca: parseInt(obj[key].forca),
              lane: obj[key].lane,
              // time: obj[key].time !== undefined ? getters.timeByID(obj[key].time).nome : ''
              time: obj[key].time
            })
          }
          commit('setLoadedJogadores', jogadores)
          commit('setLoading', false)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    criarJogador ({ commit, getters }, payload) {
      console.log('criarJogador/' + payload)
      firebase
        .database()
        .ref('jogadores')
        .push(payload)
        .then(data => {
          const key = data.key
          commit('criarJogador', {
            ...payload,
            id: key
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    alterarJogador ({ commit, getters }, payload) {
      console.log('alterarJogador/' + payload.id)
      firebase
        .database()
        .ref('jogadores/' + payload.id)
        .update(payload)
        .then(data => {
          commit('alterarJogador', {
            ...payload
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    removerJogador ({ commit, getters }, payload) {
      console.log('removerJogador/' + payload)
      firebase
        .database()
        .ref('jogadores/' + payload)
        .remove()
        .then(data => {
          commit('removerJogador', {
            id: payload
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadTimes ({ commit, getters }) {
      commit('setLoading', true)
      firebase
        .database()
        .ref('times')
        .once('value')
        .then(data => {
          const times = []
          const obj = data.val()
          for (let key in obj) {
            times.push({
              id: key,
              nome: obj[key].nome,
              logo: obj[key].logo,
              divisao: obj[key].divisao,
              sigla: obj[key].sigla,
              jogadores: getters.jogadoresByTime(key)
            })
          }
          commit('setLoadedTimes', times)
          commit('setLoading', false)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    criarTime ({ commit, getters }, payload) {
      console.log('criarTime/' + payload)
      firebase
        .database()
        .ref('times')
        .push(payload)
        .then(data => {
          const key = data.key
          commit('criarTime', {
            ...payload,
            id: key
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    alterarTime ({ commit, getters }, payload) {
      console.log('alterarTime/' + payload.id)
      firebase
        .database()
        .ref('times/' + payload.id)
        .update(payload)
        .then(data => {
          commit('alterarTime', {
            ...payload
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    removerTime ({ commit, getters }, payload) {
      console.log('removerTime/' + payload)
      firebase
        .database()
        .ref('times/' + payload)
        .remove()
        .then(data => {
          commit('removerTime', {
            id: payload
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    login ({ commit }, payload) {
      commit('setUser', payload)
    },
    autoSignIn ({ commit }, payload) {
      commit('setUser', { id: payload.uid, registeredMeetups: [] })
    },
    logout ({ commit }) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    clearError ({ commit }) {
      commit('clearError')
    },
    newSave ({ commit }, payload) {
      commit('setSave', payload)
      commit('addSave', payload)
    },
    escolheTime ({ commit }, payload) {
      commit('escolheTime', payload)
    },
    loadSave ({ commit }, payload) {
      commit('setSave', payload)
    },
    salvaGanhador ({ commit, getters }, payload) {
      payload.timeByID = getters.timeSaveByID(payload.timeVencedor.id)
      commit('salvaGanhador', payload)
      commit('fechaRodada', payload)
    },
    removerSave ({ commit }, payload) {
      commit('removerSave', payload)
    },
    venderJogador ({ commit, getters }, payload) {
      console.log('venderJogador')
      var jogador = getters.meutime.reservas.filter(r => r.id === payload)
      jogador[0].venda = true
      getters.save.jogadoresvendas.push(jogador[0])
      commit('setSave', getters.save)
    },
    vendaJogadores ({ dispatch, commit, getters }, payload) {
      getters.save.logvendas = []
      // Compras
      console.log('times ordenado por divisao', getters.save.times.sort((j1, j2) => { return j1.divisao > j2.divisao ? 1 : -1 }))
      getters.save.times.sort((j1, j2) => { return j1.divisao > j2.divisao ? 1 : -1 }).forEach(time => {
        if (time.meutime === false) {
          if (getters.save.jogadoresvendas.length > 0) {
            // Jogadores do outro time a venda e com valor que eu tenho em caixa
            console.log('time.caixa', time.nome + ' ' + time.caixa)
            var jogadoresvendas = getters.save.jogadoresvendas.filter(j => j.time !== time.id && (j.forca * 1500) <= time.caixa)
            if (jogadoresvendas.length > 0 && time.reservas.length < 3) {
              console.log(time.sigla + ' comprou ' + jogadoresvendas[0].nome + ' do ' + getters.timeSaveByID(jogadoresvendas[0].time).sigla + ' por R$' + (jogadoresvendas[0].forca * 1500).toLocaleString('pt-BR'))
              getters.save.logvendas.push(time.sigla + ' comprou ' + jogadoresvendas[0].nome + ' do ' + getters.timeSaveByID(jogadoresvendas[0].time).sigla + ' por R$' + (jogadoresvendas[0].forca * 1500).toLocaleString('pt-BR'))
              dispatch('comprarJogador', { time: time.id, jogador: jogadoresvendas[0].id, trocarauto: true })
            }
          }
        }
      })
      // Vendas
      getters.save.times.forEach(time => {
        if (time.meutime === false) {
          var reservasvenda = time.reservas.filter(r => r.venda === true)
          console.log(time.nome + ' c/ ' + time.reservas.length + ' reservas e ' + reservasvenda.length + ' à venda')
          if (time.reservas.length > 0 && reservasvenda.length === 0) {
            time.reservas[0].venda = true
            getters.save.jogadoresvendas.push(time.reservas[0])
            console.log('----' + time.reservas[0].nome + ' do time ' + getters.timeSaveByID(time.reservas[0].time).nome + ' à venda')
          }
        }
      })
      commit('setSave', getters.save)
    },
    comprarJogador ({ commit, getters }, payload) {
      console.log('comprarJogador')
      var idx = getters.save.jogadoresvendas.findIndex(j1 => {
        return j1.id === payload.jogador
      })

      // remove do time que foi vendido
      var idxTime = getters.save.times.findIndex(j1 => {
        return j1.id === getters.save.jogadoresvendas[idx].time
      })

      var idxJogadorTime = getters.save.times[idxTime].reservas.findIndex(j1 => {
        return j1.id === getters.save.jogadoresvendas[idx].id
      })

      // remove do time que foi vendido
      var jogadorvendido = getters.save.times[idxTime].reservas.splice(idxJogadorTime, 1)

      var idxMeutime = getters.save.times.findIndex(j1 => {
        return j1.id === payload.time
      })

      // adiciona no meu time
      getters.save.jogadoresvendas[idx].venda = false
      getters.save.jogadoresvendas[idx].time = payload.time
      getters.save.times[idxMeutime].reservas.push(getters.save.jogadoresvendas[idx])

      var valor = jogadorvendido[0].forca * 1500

      // Tira do caixa do comprador
      getters.save.times[idxMeutime].caixa = getters.save.times[idxMeutime].caixa - valor

      // Coloca no caixa do vendedor
      getters.save.times[idxTime].caixa = getters.save.times[idxTime].caixa + valor

      // remove da lista de vendas
      getters.save.jogadoresvendas.splice(idx, 1)

      if (payload.trocarauto) {
        var reservaMaisAlto = getters.save.times[idxMeutime].reservas.reduce(function (max, obj) {
          return obj.forca > max.forca ? obj : max
        })

        console.log('getters.save.times[idxMeutime]', getters.save.times[idxMeutime])
        var jogadores = []
        jogadores.push(getters.save.times[idxMeutime].top)
        jogadores.push(getters.save.times[idxMeutime].jungler)
        jogadores.push(getters.save.times[idxMeutime].mid)
        jogadores.push(getters.save.times[idxMeutime].carry)
        jogadores.push(getters.save.times[idxMeutime].support)

        var jogadorMaisBaixo = jogadores.reduce(function (min, obj) {
          return obj.forca < min.forca ? obj : min
        })

        console.log('reservaMaisAlto', reservaMaisAlto.nome + ' ' + reservaMaisAlto.forca)
        console.log('jogadorMaisBaixo', jogadorMaisBaixo.nome + ' ' + jogadorMaisBaixo.forca)

        if (reservaMaisAlto.forca > jogadorMaisBaixo.forca) {
          var lanetitular = jogadorMaisBaixo.lane
          getters.save.times[idxMeutime][jogadorMaisBaixo.lane] = reservaMaisAlto
          getters.save.times[idxMeutime][jogadorMaisBaixo.lane].lane = lanetitular

          var idxreserva = getters.save.times[idxMeutime].reservas.map((t) => { return t.id }).indexOf(reservaMaisAlto.id)
          getters.save.times[idxMeutime].reservas[idxreserva] = jogadorMaisBaixo
          getters.save.times[idxMeutime].reservas[idxreserva].lane = 'reserva'

          getters.save.logvendas.push(getters.save.times[idxMeutime].sigla + ' trocou de posição ' + jogadorMaisBaixo.nome + ' foi pra reserva ' + reservaMaisAlto.nome + ' virou ' + lanetitular)
        }
      }

      commit('setSave', getters.save)
    },
    inverterLane ({ commit, getters }, payload) {
      var idx = getters.save.times.map((t) => { return t.id }).indexOf(getters.meutime.id)
      var idxreserva = getters.save.times[idx].reservas.map((t) => { return t.id }).indexOf(payload.reserva.id)

      var titular = getters.save.times[idx][payload.titular.lane]
      var reserva = getters.save.times[idx].reservas[idxreserva]

      var lanetitular = getters.save.times[idx][payload.titular.lane].lane
      getters.save.times[idx][payload.titular.lane] = reserva
      getters.save.times[idx][payload.titular.lane].lane = lanetitular

      getters.save.times[idx].reservas[idxreserva] = titular
      getters.save.times[idx].reservas[idxreserva].lane = 'reserva'

      console.log('setSave', getters.save)

      commit('setSave', getters.save)
    },
    trocaDivisao ({ commit, getters }, payload) {
      console.log('trocaDivisao', payload)
      var idx = getters.save.times.map((t) => { return t.id }).indexOf(payload.time.id)
      console.log('getters.save.times[idx]', getters.save.times[idx])
      getters.save.times[idx] = payload.divisao
      commit('setSave', getters.save)
    }
  },
  getters: {
    jogadores (state) {
      return state.jogadores.sort((j1, j2) => {
        return j1.nome > j2.nome ? 1 : -1
      })
    },
    times (state) {
      return state.times.sort((j1, j2) => {
        return j1.nome > j2.nome ? 1 : -1
      })
    },
    timesSave (state) {
      return state.save.times.sort((j1, j2) => {
        return j1.pontos > j2.pontos ? -1 : 1
      })
    },
    timesSaveUltimaDivisao (state) {
      return state.save.times.filter((j1) => {
        return j1.divisao === '4'
      })
    },
    times1divisao (state) {
      return state.times.filter(j1 => {
        return j1.divisao === '1'
      })
    },
    times2divisao (state) {
      return state.times.filter(j1 => {
        return j1.divisao === '2'
      })
    },
    times3divisao (state) {
      return state.times.filter(j1 => {
        return j1.divisao === '3'
      })
    },
    times4divisao (state) {
      return state.times.filter(j1 => {
        return j1.divisao === '4'
      })
    },
    jogadorByID (state) {
      return jogadorId => {
        return state.jogadores.find(jogador => {
          return jogador.id === jogadorId
        })
      }
    },
    timeByID (state) {
      return timeId => {
        return state.times.find(time => {
          return time.id === timeId
        })
      }
    },
    timeByNome (state) {
      return nome => {
        return state.times.find(time => {
          return time.nome === nome
        })
      }
    },
    timeSaveByID (state) {
      return timeId => {
        return state.save.times.find(time => {
          return time.id === timeId
        })
      }
    },
    jogadoresByTime (state) {
      return timeId => {
        return state.jogadores.filter(jogador => {
          return jogador.time === timeId
        })
      }
    },
    user (state) {
      return state.user
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    },
    save (state) {
      return state.save
    },
    totalRodadas (state) {
      return state.save.totalRodadas
    },
    savesByUser (state) {
      return state.saves.filter(save => {
        return save.user === state.user.uid
      })
    },
    rodadaAtual (state) {
      return state.save.rodadaAtual
    },
    meutime (state, getters) {
      console.log('meutime', getters.timeSaveByID(state.save.meutime))
      return getters.timeSaveByID(state.save.meutime)
    },
    terminouRodada (state) {
      var terminou = true
      if (state.save.rodadaAtual) {
        var jogos = state.save.timesJogo[state.save.rodadaAtual - 1].jogos
        jogos.forEach((jogo) => {
          if (jogo.timeVencedor == null) {
            terminou = false
          }
        })
      }
      return terminou
    }
  }
})
