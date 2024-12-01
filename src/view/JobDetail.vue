<template>
    <section
        class="container"
        v-if="isLogin && post"
    >
        <figure v-if="post.img_url">
            <img
                :src="post.img_url"
                alt="head_image"
            />
        </figure>

        <div
            class="container"
            v-if="post"
        >
            <h2>{{ post.title }}</h2>
            <p class="top_info">
                {{ post.company_name }}
                <span>&middot;</span>
                {{ post.location }}
            </p>

            <p class="pay">
                {{ post.pay_rule }}: <b>{{ post.pay.toLocaleString() }}</b>
            </p>
            <textarea
                class="desc"
                rows="8"
                disabled
                >{{ post.desc }}</textarea
            >
        </div>

        <p
            v-else
            class="loading_info"
        >
            글 내용 가져오는 중...
        </p>

        <!-- 하단 고정 버튼 -->
        <div
            v-if="post && post.author !== user.id"
            class="bottom-btn-group"
        >
            <a
                class="btn-tel"
                :href="`tel:{{ post.tel }}`"
                >전화문의</a
            >
            <button
                class="btn-apply-disable"
                v-if="isApplied"
            >
                지원완료
            </button>
            <button
                class="btn-apply"
                @click="handleApply"
                v-if="!isApplied"
            >
                지원하기
            </button>
        </div>

        <div
            v-if="post && post.author === user.id"
            class="bottom-btn-group"
        >
            <router-link
                class="btn-tel"
                :to="`/job-post-update/${post.id}`"
                >수정</router-link
            >
            <button
                class="btn-apply"
                @click="handleDelete"
            >
                삭제
            </button>
        </div>
    </section>
</template>

<script setup>
import { useAuth } from "../auth/auth";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import supabase from "../supabase";

const router = useRouter();
const route = useRoute();
const id = route.params.id;
const post = ref("");
const isApplied = ref(false);

const { isLogin, user, checkLoginStatus } = useAuth();

// 지원내역 확인 함수
const checkApply = async () => {
    const { data, error } = await supabase
        .from("job_apply_list")
        .select()
        .eq("applicant_id", user.value.id)
        .eq("post_id", id);

    if (error) {
        alert("오류가 발생했습니다");
        return;
    }

    if (data.length > 0) {
        isApplied.value = true;
    }
};

// 이미지 삭제
const deleteImage = async () => {
    if (post.value.img_url) {
        const { data, error } = await supabase.storage
            .from("images")
            .remove([post.value.img_url.split("/").pop()]);

        if (error) {
            alert("이미지 삭제 실패");
        }
    }
};

const handleDelete = async () => {
    const conf = confirm("정말로 삭제하시겠습니까?");
    if (!conf) {
        return;
    }

    await deleteImage();

    const { error } = await supabase.from("job_posts").delete().eq("id", id);
    if (error) {
        alert("삭제 실패");
    } else {
        router.push("/job-list");
    }
};

const handleApply = async () => {
    const { data, error } = await supabase
        .from("user_table")
        .select()
        .eq("id", user.value.id)
        .single();
    if (error) {
        alert(error.message);
        return;
    }

    const { error: err } = await supabase.from("job_apply_list").insert({
        job_title: post.value.title,
        employer_id: post.value.author,
        applicant_id: user.value.id,
        applicant_tel: data.tel,
        applicant_name: data.name,
        post_id: post.value.id,
    });

    if (err) {
        alert(err.message);
        return;
    } else {
        alert("지원 완료");
        router.push("/job-list");
    }
};

onMounted(async () => {
    await checkLoginStatus();

    if (user.value) {
        const { data, error } = await supabase
            .from("job_posts")
            .select("*")
            .eq("id", id)
            .single();

        post.value = data;

        if (error) {
            alert("글 가져오기 실패");
            router.push("/job-list");
        }
    }

    checkApply();
});
</script>

<style scoped lang="scss">
figure {
    aspect-ratio: 16 / 9;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

h2 {
    font-size: 1rem;
    margin-bottom: 0.3125rem;
}

.top_info {
    font-size: 0.75rem;
    color: #666;
    margin-bottom: 1rem;
}

.pay {
    font-size: 0.875rem;
    font-weight: bold;
    color: #444;
    padding: 0.625rem 0;
    margin-bottom: 1rem;
}

.desc {
    width: 100%;
    padding: 0rem;
    border: none;
    line-height: 1.375rem;
    margin-bottom: 0.625rem;
    outline: none;
    background: #fff;
}

.bottom-btn-group {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;

    button,
    .btn-tel {
        width: 50%;
        border-radius: 0;
        padding-top: 0.875rem;
        padding-bottom: 0.875rem;
        margin: 0;
        cursor: pointer;
        text-align: center;
        color: #fff;
        text-decoration: none;
    }

    .btn-tel {
        background-color: var(--main-color-dark);
    }

    .btn-apply {
        background-color: var(--main-color-light);
    }

    .btn-apply-disable {
        background-color: #ccc;
    }
}
</style>
