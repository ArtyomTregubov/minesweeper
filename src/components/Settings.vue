<template>
  <div class="settings">
    <h1>SETTINGS</h1>
    <div class="settings-container">
      <select v-model="difficulty">
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>
      <button @click="startGame">START GAME</button>
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
</script>

<style scoped>
.settings-container {
  display: flex;
  align-items: center;
  justify-content: center;
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

select {
  height: 39px;
  border-radius: 8px;
  font-size: 19px;
  font-family: 'Frijole', cursive;
  color: #213547;
  margin: 0 10px 0 0;
}

button {
  background-color: #e0e0e0;
  font-size: 14px;
  font-family: 'Frijole', cursive;
  color: #213547;
}
</style>
