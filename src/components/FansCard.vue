<template>
  <div class="fans-card">
    <div class="flex flex-col justify-between h-full">
      <div class="flex">
        <img class="avatar" :src="Avatar" />
        <span class="user-name">科科Cole</span>
      </div>
      <div>
        <div>FANS NO.</div>
        <div>004597</div>
      </div>
      <div>
        <div>DATE</div>
        <div>2022/04/21</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from "@/assets/avatar.jpg";
</script>

<style lang="scss" scoped>
.fans-card {
  padding: 14px 18px;
  box-sizing: border-box;
  height: 200px;
  width: 486px;
  border-radius: 6px;
  background-image: url("../assets/bg.jpg");
  background-color: rgb(255, 227, 195);
  background-size: contain;
  box-shadow: 0 0 5px 2px #ccc;
}

.avatar {
  width: 31px;
  height: 31px;
  border-radius: 999px;
  outline: 1px solid #fff;
}

.user-name {
  padding-top: 7px;
  margin-left: 13px;
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
}

.fans-mono {
  font-family: "Google Sans Text", Arial, Helvetica, sans-serif;
}
</style>
