import { createRouter, createWebHistory } from "vue-router";
import Settings from './components/Settings.vue';
import Game from './components/Game.vue';
import LeaderBoard from './components/LeaderBoard.vue';
import HomePage from "./components/HomePage.vue";
const routes = [
    { path: '/', component: HomePage },
    { path: '/settings', component: Settings },
    { path: '/game', component: Game },
    { path: '/leaderboard', component: LeaderBoard },
];
const router = createRouter({
    history: createWebHistory('/minesweeper/'), 
    routes
  })
export default router;
