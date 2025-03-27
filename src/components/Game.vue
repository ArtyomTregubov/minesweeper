<template>
   <div class="game">
    <h1>MINESWEEPER</h1>
    <div class="buttons">
      <button @click="restartGame">RESTART</button>
      <button @click="goToHomePage">HOMEPAGE</button>
    </div>
    <div>Таймер: {{ timer }}</div>
    <div>Осталось мин: {{ remainingMines }}</div>
    <div class="grid" :style="gridStyle">
      <div 
        v-for="cell in cells" 
        :key="cell.id" 
        @click="openCell(cell)" 
        @contextmenu.prevent="toggleMark(cell)" 
        class="cell" 
        :class="{ opened: cell.isOpen }"
      >
        <img 
          v-if="cell.mark === 'flag' && !cell.isOpen" 
          src="/images/flag_icon.png" 
          alt="Flag" 
          class="mark-icon" 
        />
        <img 
          v-else-if="cell.mark === 'question' && !cell.isOpen" 
          src="/images/question_icon.png" 
          alt="Question" 
          class="mark-icon" 
        />
        <div class="mine-container" v-else-if="cell.isOpen && cell.isMine">
          <img src="/images/mine_icon.png" alt="Mine" class="mine-icon" />
        </div>
        <span v-else :class="`number-${cell.display}`">{{ cell.display }}</span>
      </div>
    </div>
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ isWin ? 'YOU WIN' : 'GAME OVER' }}</h2>
        <p>Enter your name :</p>
        <input v-model="playerName" placeholder="name" />
        <button @click="saveResult">SAVE</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

interface Cell {
  id: number;
  isOpen: boolean;
  isMine: boolean;
  display: string;
  surroundingMines: number;
  mark: 'flag' | 'question' | null; 
}

const cells = ref<Cell[]>([]);
const timer = ref(0);
const remainingMines = ref(10);
const showModal = ref(false);
const playerName = ref('');
const gameOver = ref(false);
const router = useRouter();
const route = useRoute();
const isWin = ref(false);

const cellSize = computed(() => {
  const screenWidth = window.innerWidth;
  if (screenWidth < 400) return 17;
  if (screenWidth < 650) return 25;
  return 35;
});

const gridStyle = computed(() => {
  const size = Math.sqrt(cells.value.length);
  return {
    gridTemplateColumns: `repeat(${size}, ${cellSize.value}px)`,
    gridTemplateRows: `repeat(${size}, ${cellSize.value}px)`,
  };
});

const difficulty = ref(route.query.difficulty || 'easy');

let gameInterval: ReturnType<typeof setInterval>;

const generateCells = (rows: number, cols: number, mines: number) => {
  const totalCells = rows * cols;
  const cellArray = Array.from({ length: totalCells }, (_, index) => ({
    id: index,
    isOpen: false,
    isMine: false,
    display: '',
    surroundingMines: 0,
    mark: null, 
  }));

  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const randomIndex = Math.floor(Math.random() * totalCells);
    if (!cellArray[randomIndex].isMine) {
      cellArray[randomIndex].isMine = true;
      minesPlaced++;
    }
  }

  cellArray.forEach((cell) => {
    if (cell.isMine) return;
    const surroundingCells = getSurroundingCells(cell.id, rows, cols);
    cell.surroundingMines = surroundingCells.filter(c => cellArray[c].isMine).length;
  });

  return cellArray;
};

const getSurroundingCells = (index: number, rows: number, cols: number) => {
  const surrounding = [];
  const row = Math.floor(index / cols);
  const col = index % cols;

  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < rows && c >= 0 && c < cols && !(r === row && c === col)) {
        surrounding.push(r * cols + c);
      }
    }
  }
  return surrounding;
};

const openCell = (cell: Cell) => {
  if (cell.isOpen || cell.mark === 'flag' || gameOver.value) return;
  cell.isOpen = true;

  if (cell.isMine) {
    gameOver.value = true;
    isWin.value = false;
    showModal.value = true;
    clearInterval(gameInterval);
    return;
  }

  if (cell.surroundingMines === 0) {
    const surroundingCells = getSurroundingCells(cell.id, Math.sqrt(cells.value.length), Math.sqrt(cells.value.length));
    surroundingCells.forEach(index => openCell(cells.value[index]));
  }

  cell.display = cell.surroundingMines > 0 ? cell.surroundingMines.toString() : '';

  if (checkWin()) {
    gameOver.value = true;
    isWin.value = true;
    showModal.value = true;
    clearInterval(gameInterval);
  }
};

const checkWin = (): boolean => {
  const allMinesFlaggedOrClosed = cells.value
    .filter(cell => cell.isMine)
    .every(mineCell => mineCell.mark === 'flag' || !mineCell.isOpen);

  const allSafeCellsOpened = cells.value
    .filter(cell => !cell.isMine)
    .every(safeCell => safeCell.isOpen);

  return allMinesFlaggedOrClosed && allSafeCellsOpened;
};

const saveResult = () => {
  if (playerName.value.trim()) {
    const result = {
      name: playerName.value,
      time: timer.value,
      difficulty: difficulty.value,
      isWin: isWin.value, 
    };

    const savedLeaderboard = localStorage.getItem('leaderboard');
    const leaderboard = savedLeaderboard ? JSON.parse(savedLeaderboard) : [];

    leaderboard.push(result);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    showModal.value = false;
    router.push('/leaderboard');
  }
};

const restartGame = () => {
  clearInterval(gameInterval);
  timer.value = 0;

  switch (difficulty.value) {
    case 'easy':
      remainingMines.value = 10;
      cells.value = generateCells(8, 8, remainingMines.value);
      break;
    case 'medium':
      remainingMines.value = 20;
      cells.value = generateCells(12, 12, remainingMines.value);
      break;
    case 'hard':
      remainingMines.value = 40;
      cells.value = generateCells(16, 16, remainingMines.value);
      break;
    default:
      remainingMines.value = 10;
      cells.value = generateCells(8, 8, remainingMines.value);
  }

  gameOver.value = false;
  startTimer();
};

const startTimer = () => {
  gameInterval = setInterval(() => {
    timer.value++;
  }, 1000);
};

const goToHomePage = () => {
  clearInterval(gameInterval);
  router.push('/');
};

const toggleMark = (cell: Cell) => {
  if (cell.isOpen) return;

  const marks = ['flag', 'question', null] as const;
  const currentIndex = marks.indexOf(cell.mark);
  const nextIndex = (currentIndex + 1) % marks.length;
  cell.mark = marks[nextIndex];

  if (cell.mark === 'flag') {
    remainingMines.value -= 1;
  } else if (marks[currentIndex] === 'flag') {
    remainingMines.value += 1;
  }

  if (checkWin()) {
    gameOver.value = true;
    isWin.value = true;
    showModal.value = true;
    clearInterval(gameInterval);
  }
};

const closeModal = (event: MouseEvent) => {
  if (event.target === event.currentTarget) { 
    showModal.value = false;
  }
};

onMounted(() => {
  restartGame();
});
</script>

<style scoped>
.game {
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

.buttons {
  display: flex;
  justify-content: space-between;
  width: 300px;
  margin: 0 0 10px;
}

button {
  background-color: #e0e0e0;
  font-size: 14px;
  font-family: 'Frijole', cursive;
  color: #213547;
}

.grid {
  display: grid;
  gap: 2px;
}

.cell {
  width: 35px;
  height: 35px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

@media (max-width: 650px) {
  .cell {
    width: 25px;
    height: 25px;
  }
}

@media (max-width: 400px) {
  .cell {
    width: 17px;
  height: 17px;
  }
}


.cell.opened {
  background-color: #e0e0e0;
}

.number-1 {
  color: #0000FF; 
}
.number-2 {
  color: #008000; 
}
.number-3 {
  color: #FF0000; 
}
.number-4 {
  color: #00008B; 
}
.number-5 {
  color: #800000; 
}
.number-6 {
  color: #40E0D0; 
}
.number-7 {
  color: #000000; 
}
.number-8 {
  color: #FFFFFF; 
}

.mark-icon {
  width: 100%;
  height: 100%;
}

.mine-container {
  width: 100%;
  height: 100%;
}

.mine-icon {
  width: 100%;
  height: 100%;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; 
}

.modal-content {
  display: flex;
  flex-direction: column;
  width: 290px;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
}

@media (max-width: 400px) {
  .modal-content {
    width: 225px;
  }
}

.modal-content h2 {
  margin-top: 0;
  font-family: 'Frijole', cursive;
  color: #213547;
}

.modal-content input {
  margin: 10px 0;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 84%;
  font-family: 'Frijole', cursive;
}

.modal-content button {
  width: 90%;
  background-color: #e0e0e0;
  font-size: 14px;
  font-family: 'Frijole', cursive;
  color: #213547;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.modal-content button:hover {
  background-color: #d0d0d0;
}
</style>
