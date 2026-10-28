<script setup lang="ts">
import ChatBox from '../components/ChatBox.vue';
import HomeHeader from '../components/HomeHeader.vue';
import MessageList from '../components/MessageList.vue';
</script>

<template>
  <div class="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
    <HomeHeader />
    <main class="pt-20 pb-28">
      <div class="mx-auto w-full max-w-4xl px-3 sm:px-4 lg:px-6">
        <section
          class="flex flex-col rounded-2xl border mb-20 border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-sm overflow-hidden min-h-[calc(100vh-12rem)]">
          <MessageList />
        </section>
      </div>
    </main>
    <ChatBox />
  </div>
</template>
