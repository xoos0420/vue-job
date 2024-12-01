<template>
    <div
        v-if="isLoading"
        class="loading_info"
    >
        <p>저장중...</p>
    </div>
    <div
        class="form-container"
        v-if="isLogin"
    >
        <form @submit.prevent="handleSubmit">
            <!-- 제목 -->
            <div class="form-group">
                <label for="title">제목</label>
                <input
                    type="text"
                    id="title"
                    required
                    placeholder="공고 내용을 요약해주세요"
                    v-model="title"
                />
            </div>

            <!-- 하는 일 -->
            <div class="form-group">
                <label for="todo">하는 일</label>
                <input
                    type="text"
                    id="todo"
                    required
                    placeholder="해야할 업무를 입력해주세요."
                    v-model="todo"
                />
            </div>

            <!-- 급여 조건 -->
            <div class="form-group">
                <input
                    type="radio"
                    id="pay_rule1"
                    name="pay_rule"
                    value="시급"
                    v-model="pay_rule"
                    required
                    checked
                />
                <input
                    type="radio"
                    id="pay_rule2"
                    name="pay_rule"
                    value="월급"
                    v-model="pay_rule"
                    required
                />
                <div class="tab-group">
                    <label for="pay_rule1">시급</label>
                    <label for="pay_rule2">월급</label>
                </div>

                <!-- 금액 입력 -->
                <input
                    type="number"
                    id="pay"
                    v-model="pay"
                    required
                    placeholder="시급 또는 월급을 입력하세요"
                />
            </div>

            <!-- 설명 -->
            <div class="form-group">
                <label for="desc">자세한 설명</label>
                <textarea
                    name="desc"
                    id="desc"
                    rows="6"
                    required
                    placeholder="구체적인 업무 내용, 근무 여건, 지원자가  갖추어야 할 능력 등"
                    v-model="desc"
                />
            </div>

            <!-- 업체명 -->
            <div class="form-group">
                <label for="company_name">업체명</label>
                <input
                    type="text"
                    id="company_name"
                    required
                    placeholder="업체명"
                    v-model="company_name"
                />
            </div>

            <!-- 위치,주소 -->
            <div class="form-group">
                <label for="location">위치</label>
                <input
                    type="text"
                    id="location"
                    required
                    placeholder="업체명"
                    v-model="location"
                />
            </div>

            <!-- 연락처 -->
            <div class="form-group">
                <label for="tel">연락처</label>
                <input
                    type="text"
                    id="tel"
                    required
                    placeholder="연락처를 입력해주세요"
                    v-model="tel"
                />
            </div>

            <!-- 파일 업로드 -->
            <div class="form-group">
                <label for="photo">
                    <p class="title">사진(선택)</p>
                    <figure>
                        <Icon
                            icon="mdi-light:camera"
                            width="64"
                            height="64"
                            style="color: #1e1e1e"
                        />
                        <img
                            :src="previewImage || `/box64.jpg`"
                            alt="미리보기"
                            width="64"
                            height="64"
                        />
                    </figure>
                </label>
                <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    @change="onFileChange"
                />
            </div>

            <button class="btn-submit">등록하기</button>
        </form>
    </div>
</template>

<script setup>
import supabase from "../supabase";
import { useRouter } from "vue-router";
import { useAuth } from "../auth/auth";
import { onMounted, onUnmounted, ref } from "vue";
import { Icon } from "@iconify/vue";

const router = useRouter();
const isLoading = ref(false);

const { isLogin, user, checkLoginStatus } = useAuth();

onMounted(async () => {
    await checkLoginStatus();
});

onUnmounted(() => {
    if (previewImage.value) {
        URL.revokeObjectURL(previewImage.value);
    }
});

const title = ref("");
const todo = ref("");
const pay_rule = ref("시급");
const pay = ref("");
const desc = ref("");
const company_name = ref("");
const location = ref("");
const tel = ref("");
const previewImage = ref("");

const img_url = ref("");

let file = null;

const onFileChange = (e) => {
    file = e.target.files[0];
    if (file) {
        previewImage.value = URL.createObjectURL(file);
        console.log("previewImage", previewImage.value);
    }
};

const uploadImage = async () => {
    const { data, error } = await supabase.storage
        .from("images")
        .upload(file.name, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        alert("이미지 업로드 실패");
    } else {
        console.log("upload file:", data);
        const { data: imgData } = supabase.storage
            .from("images")
            .getPublicUrl(file.name);

        console.log("file url:", imgData.publicUrl);

        img_url.value = imgData.publicUrl;
    }
};

const handleSubmit = async () => {
    isLoading.value = true;

    if (previewImage.value) {
        await uploadImage();
    }

    const { error } = await supabase.from("job_posts").insert({
        title: title.value,
        todo: todo.value,
        pay_rule: pay_rule.value,
        pay: pay.value,
        desc: desc.value,
        company_name: company_name.value,
        location: location.value,
        tel: tel.value,
        img_url: img_url.value,
    });
    if (error) {
        alert(error.message);
        isLoading.value = false;
    } else {
        router.push("/job-list");
    }
    isLoading.value = false;
};
</script>

<style lang="scss" scoped>
@use "../style/form.scss";

.form-container {
    margin-top: 1.25rem;
    padding-bottom: 3.125rem;

    .tab-group {
        display: flex;
        gap: 0.9375rem;
        label {
            flex: 1;
            border: 0.0625rem solid var(--main-color-dark);
            border-radius: 0.5rem;
            text-align: center;
            padding: 0.75rem;
        }
    }

    input[type="radio"] {
        display: none;
    }

    input[type="radio"]:nth-child(1):checked ~ .tab-group label:nth-child(1) {
        background: var(--main-color-dark);
        color: #fff;
    }

    input[type="radio"]:nth-child(2):checked ~ .tab-group label:nth-child(2) {
        background: var(--main-color-dark);
        color: #fff;
    }

    #pay {
        margin-top: 0.5rem;
    }

    // for=photo를 가진 form-group의 후손 input의 보더 스타일 제거
    .form-group:has(label[for="photo"]) input {
        border: none;
    }

    //file 아이콘
    label[for="photo"] {
        figure {
            display: flex;
            align-items: center;
            img {
                border: 0.0625rem solid red;
                margin-left: 1.875rem;
            }
        }
    }
    input[type="file"] {
        display: none;
    }
}

.btn-submit {
    background: var(--main-color-light);
}

.form-group:has(label[for="photo"]) {
    padding-bottom: 1.5625rem;
    border-bottom: 0.3125rem solid #ccc;
}
</style>
