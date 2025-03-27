<template>
  <div class="liders">
    <h1>LEADERBOARD</h1>
    <button @click="goToHomePage">HOMEPAGE</button>
    <table v-if="leaderboard.length">
      <thead>
        <tr>
          <th>№</th>
          <th>Name</th>
          <th>level of difficulty</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in sortedLeaderboard" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ player.name }}</td>
          <td>{{ player.difficulty }}</td>
          <td>
            <span v-if="player.isWin">{{ player.time }} сек</span>
            <span v-else>—</span>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>Нет данных для отображения.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

interface Player {
  name: string;
  time: number;
  difficulty: string;
  isWin: boolean;
}

const router = useRouter();
const leaderboard = ref<Player[]>([]);

const difficultyOrder = {
  easy: 1,
  medium: 2,
  hard: 3,
} as const;

type Difficulty = keyof typeof difficultyOrder;

const sortedLeaderboard = computed(() => {
  return leaderboard.value
    .sort((a, b) => {
      const aDifficulty = difficultyOrder[a.difficulty as Difficulty];
      const bDifficulty = difficultyOrder[b.difficulty as Difficulty];

      if (aDifficulty !== bDifficulty) {
        return bDifficulty - aDifficulty; 
      }

      return a.time - b.time;
    })
    .map((player, index) => ({ ...player, index }));
});

onMounted(() => {
  const savedLeaderboard = localStorage.getItem('leaderboard') || '[]';
  leaderboard.value = JSON.parse(savedLeaderboard);
});

const goToHomePage = () => {
  router.push('/');
};
</script>

<style scoped>
.liders {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 30px;
  font-family: 'Frijole', cursive;
}

@media (max-width: 650px) {
  h1 {
    font-size: 24px;
  }
}

button {
  background-color: #e0e0e0;
  font-size: 14px;
  font-family: 'Frijole', cursive;
  color: #213547;
}

table {
  width: 90%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f0f0f0;
}
</style>