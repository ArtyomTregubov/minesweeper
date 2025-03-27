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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['hp-container']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hp-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "titles" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "buttons" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.startGame) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.goToSettings) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.goToLeaderBoard) },
});
/** @type {__VLS_StyleScopedClasses['hp-container']} */ ;
/** @type {__VLS_StyleScopedClasses['titles']} */ ;
/** @type {__VLS_StyleScopedClasses['buttons']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            startGame: startGame,
            goToSettings: goToSettings,
            goToLeaderBoard: goToLeaderBoard,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
