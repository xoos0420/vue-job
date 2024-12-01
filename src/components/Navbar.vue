<template>
    <nav>
        <h1>{{ title }}</h1>
        <router-link
            v-if="
                currentPath === '/' ||
                currentPath === '/signup' ||
                currentPath === '/job-post' ||
                currentPath.startsWith('/job-post-update')
            "
            to="/job-list"
            class="btn-close"
            ><Icon
                icon="material-symbols:close"
                width="24"
                height="24"
                style="color: var(--text-color-dark)"
            />
        </router-link>

        <router-link
            v-if="
                currentPath.startsWith('/job-detail') ||
                currentPath === '/user-profile'
            "
            to="/job-list"
            class="btn-close"
            ><Icon
                icon="ic:baseline-arrow-back"
                width="24"
                height="24"
                style="color: var(--text-color-dark)"
            />
        </router-link>

        <div v-if="currentPath === '/job-list'" class="right-icons">
            <router-link to="/user-profile">
                <Icon
                    icon="teenyicons:user-circle-solid"
                    width="24"
                    height="24"
                    style="color: var(--text-color-dark)"
                />
            </router-link>
            <router-link to="/job-post">
                <Icon
                    icon="mdi:pencil-outline"
                    width="24"
                    height="24"
                    style="color: var(--text-color-dark)"
                />
            </router-link>
        </div>
    </nav>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { watch, ref } from 'vue';
import { useRoute } from 'vue-router';

let route = useRoute();
let currentPath = route.path;
let title = ref('');
let icon = ref('');

watch(route, (newPath) => {
    currentPath = newPath.path;
    console.log(currentPath);

    // 경로 별로 제목을 다르게 설정
    if (currentPath === '/') {
        title.value = '로그인';
    } else if (currentPath === '/signup') {
        title.value = '회원가입';
    } else if (currentPath === '/job-list') {
        title.value = '땅콩알바';
    } else if (currentPath.startsWith('/job-detail')) {
        title.value = '상세보기';
    } else if (currentPath === '/job-post') {
        title.value = '구인등록';
    } else if (currentPath.startsWith('/job-post-update')) {
        title.value = '구인등록 수정하기';
    } else if (currentPath === '/user-profile') {
        title.value = '프로필';
    }
});
</script>

<style lang="scss" scoped>
nav {
    position: relative;
    // background: pink;
    border-bottom: 0.0625rem solid #ccc;
    width: 100%;
    height: 2.75rem;
    padding: 0.625rem;
    display: flex;
    align-items: center;
    justify-content: center;
    h1 {
        font-size: 1rem;
        color: var(--text-color-dark);
    }
    .btn-close {
        position: absolute;
        left: 0.9375rem;
        text-decoration: none;
    }
}

.right-icons {
    position: absolute;
    top: 0.625rem;
    right: 0.9375rem;
    display: flex;
    gap: 0.625rem;
}
</style>
