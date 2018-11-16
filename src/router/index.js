import Vue from 'vue'
import Router from 'vue-router'

import CarregarJogo from '@/components/Jogo/CarregarJogo'
import CoreJogo from '@/components/Jogo/CoreJogo'
import JogosRodada from '@/components/Jogo/JogosRodada'
import Rodadas from '@/components/Jogo/Rodadas'
import EscolheTime from '@/components/Jogo/EscolheTime'

import Login from '@/components/Login'

import Jogadores from '@/components/Jogador/Jogadores'
import Jogador from '@/components/Jogador/Jogador'

import Times from '@/components/Time/Times'
import Time from '@/components/Time/Time'

import AuthGuard from './auth-guard'
import AuthGuardAdmin from './auth-guard-admin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/carregarJogo',
      name: 'Carregar Jogo',
      component: CarregarJogo,
      beforeEnter: AuthGuard
    },
    {
      path: '/jogosRodada',
      name: 'Jogos Rodada',
      component: JogosRodada,
      beforeEnter: AuthGuard
    },
    {
      path: '/escolheTime',
      name: 'Escolhe Time',
      component: EscolheTime,
      beforeEnter: AuthGuard
    },
    {
      path: '/rodadas',
      name: 'Rodadas',
      component: Rodadas,
      beforeEnter: AuthGuard
    },
    {
      path: '/coreJogo',
      name: 'Core Jogo',
      component: CoreJogo,
      beforeEnter: AuthGuard
    },
    {
      path: '/jogadores',
      name: 'Jogadores',
      component: Jogadores,
      beforeEnter: AuthGuardAdmin
    },
    {
      path: '/jogador/:id',
      name: 'Jogador',
      props: true,
      component: Jogador,
      beforeEnter: AuthGuardAdmin
    },
    {
      path: '/times',
      name: 'Times',
      component: Times,
      beforeEnter: AuthGuardAdmin
    },
    {
      path: '/time/:id',
      name: 'Time',
      props: true,
      component: Time,
      beforeEnter: AuthGuardAdmin
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '*',
      redirect: '/carregarJogo'
    }
  ]
})
