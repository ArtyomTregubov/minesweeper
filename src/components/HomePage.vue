<template>
    <div class="hp-container">
      <div class="titles">
        <h1>MINESWEEPER</h1>
        <h2>for IQ Group</h2>
      </div>
      <div class="buttons">
        <button @click="startGame">New Game</button>
        <button @click="goToSettings">Settings</button>
        <button @click="goToLeaderBoard">LeaderBoard</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const difficulty = ref('easy');
  const router = useRouter();
  
  const startGame = () => {
    router.push({ path: '/game', query: { difficulty: difficulty.value } });
  };

  const goToSettings = () => {
    router.push({ path: '/settings', query: { difficulty: difficulty.value } });
  };

  const goToLeaderBoard = () => {
    router.push({ path: '/leaderboard', query: { difficulty: difficulty.value } });
  };
  </script>
  
  <style scoped>
  h1 {
    margin: 0;
    font-family: 'Frijole', cursive;
    -webkit-text-stroke: 1px black;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    color: white;
  }

  @media (max-width: 650px) {
  h1 {
    font-size: 24px;
  }
}

  h2 {
    margin: 0;
    font-family: 'Frijole', cursive;
    color: #213547;
  }

  .hp-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 0 60px;
    justify-content: space-between;
    background-image: url(/images/minesweeper_image.jpg);
    background-size: cover;
    height: 100%; 
  }

  @media (max-width: 650px) {
    .hp-container {
      background-image: url(/images/minesweeper_image2.png);
    }
  }

  .buttons {
    display: flex;
    flex-direction: column;
  }

  button {
    margin: 0 0 5px;
    font-family: 'Frijole', cursive;
    color: #213547;
  }
  </style>
  