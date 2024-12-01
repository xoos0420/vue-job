<template>
    <div
        v-if="isLoading"
        class="loading_info"
    >
        로그인 중...
    </div>

    <div class="form-container">
        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <label for="email">Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="이메일 입력"
                    required
                    v-model="email"
                />
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="비밀번호 입력"
                    required
                    v-model="password"
                />
            </div>

            <button type="submit">로그인</button>

            <router-link to="/signup">회원가입</router-link>
            <span> | </span>
            <router-link to="/about">앱 소개</router-link>
        </form>
    </div>
</template>

<script setup>
import supabase from "../supabase";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const isLoading = ref(false);

const email = ref("");
const password = ref("");

const handleLogin = async () => {
    isLoading.value = true;
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    });

    if (error) {
        alert(error.message);
        isLoading.value = false;
    } else {
        console.log("data", data);
        isLoading.value = false;
        router.push("/job-list");
    }
};
</script>

<style scoped lang="scss">
/* @import "../style/form.scss"; */
@use "../style/form.scss";
</style>
