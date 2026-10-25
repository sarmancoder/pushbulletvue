<script setup lang="ts">

const params = new URLSearchParams({
    client_id: '2XB7HT0nMjXPzNea96sVsRlU108Mi5VL',
    redirect_uri: 'http://localhost:5173/authenticate',
    response_type: 'token'
})
const url = 'https://www.pushbullet.com/authorize?' + params.toString()

</script>

<template>
    <div>
        <a :href="url">Autenticar</a>
    </div>
</template>

<style lang="scss" scoped></style>