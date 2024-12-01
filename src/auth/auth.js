import supabase from '../supabase';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export function useAuth() {
    const router = useRouter();
    const user = ref(null);
    const isLogin = ref(false);

    const checkLoginStatus = async () => {
        const {
            data: { user: _user },
        } = await supabase.auth.getUser();
        user.value = _user; // 사용자 정보 저장

        if (_user) {
            isLogin.value = true;
        } else {
            isLogin.value = false;
            router.push('/');
        }
    };

    return {
        user,
        isLogin,
        checkLoginStatus,
    };
}
