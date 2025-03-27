import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const cells = ref([]);
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
    if (screenWidth < 400)
        return 17;
    if (screenWidth < 650)
        return 25;
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
let gameInterval;
const generateCells = (rows, cols, mines) => {
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
        if (cell.isMine)
            return;
        const surroundingCells = getSurroundingCells(cell.id, rows, cols);
        cell.surroundingMines = surroundingCells.filter(c => cellArray[c].isMine).length;
    });
    return cellArray;
};
const getSurroundingCells = (index, rows, cols) => {
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
const openCell = (cell) => {
    if (cell.isOpen || cell.mark === 'flag' || gameOver.value)
        return;
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
const checkWin = () => {
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
const toggleMark = (cell) => {
    if (cell.isOpen)
        return;
    const marks = ['flag', 'question', null];
    const currentIndex = marks.indexOf(cell.mark);
    const nextIndex = (currentIndex + 1) % marks.length;
    cell.mark = marks[nextIndex];
    if (cell.mark === 'flag') {
        remainingMines.value -= 1;
    }
    else if (marks[currentIndex] === 'flag') {
        remainingMines.value += 1;
    }
    if (checkWin()) {
        gameOver.value = true;
        isWin.value = true;
        showModal.value = true;
        clearInterval(gameInterval);
    }
};
const closeModal = (event) => {
    if (event.target === event.currentTarget) {
        showModal.value = false;
    }
};
onMounted(() => {
    restartGame();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "game" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "buttons" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.restartGame) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.goToHomePage) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
(__VLS_ctx.timer);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
(__VLS_ctx.remainingMines);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid" },
    ...{ style: (__VLS_ctx.gridStyle) },
});
for (const [cell] of __VLS_getVForSourceType((__VLS_ctx.cells))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.openCell(cell);
            } },
        ...{ onContextmenu: (...[$event]) => {
                __VLS_ctx.toggleMark(cell);
            } },
        key: (cell.id),
        ...{ class: "cell" },
        ...{ class: ({ opened: cell.isOpen }) },
    });
    if (cell.mark === 'flag' && !cell.isOpen) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: "/images/flag_icon.png",
            alt: "Flag",
            ...{ class: "mark-icon" },
        });
    }
    else if (cell.mark === 'question' && !cell.isOpen) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: "/images/question_icon.png",
            alt: "Question",
            ...{ class: "mark-icon" },
        });
    }
    else if (cell.isOpen && cell.isMine) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mine-container" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: "/images/mine_icon.png",
            alt: "Mine",
            ...{ class: "mine-icon" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: (`number-${cell.display}`) },
        });
        (cell.display);
    }
}
if (__VLS_ctx.showModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.closeModal) },
        ...{ class: "modal" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: () => { } },
        ...{ class: "modal-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    (__VLS_ctx.isWin ? 'YOU WIN' : 'GAME OVER');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        placeholder: "name",
    });
    (__VLS_ctx.playerName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.saveResult) },
    });
}
/** @type {__VLS_StyleScopedClasses['game']} */ ;
/** @type {__VLS_StyleScopedClasses['buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['opened']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['mine-container']} */ ;
/** @type {__VLS_StyleScopedClasses['mine-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['modal']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cells: cells,
            timer: timer,
            remainingMines: remainingMines,
            showModal: showModal,
            playerName: playerName,
            isWin: isWin,
            gridStyle: gridStyle,
            openCell: openCell,
            saveResult: saveResult,
            restartGame: restartGame,
            goToHomePage: goToHomePage,
            toggleMark: toggleMark,
            closeModal: closeModal,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
