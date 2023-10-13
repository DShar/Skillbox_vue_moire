<template>
<main class="content container">
    <div class="content__top">
        <h1 class="content__title">404! Страница не существует</h1>
        <router-link class="error__link" v-bind:to="{name:'main'}">
            Вернуться на главную
        </router-link>
    </div>
</main>
</template>