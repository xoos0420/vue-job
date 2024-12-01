import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../view/Login.vue";
import About from "../view/About.vue";
import Signup from "../view/SignUp.vue";
import JobList from "../view/JobList.vue";
import JobPost from "../view/JobPost.vue";
import JobDetail from "../view/JobDetail.vue";
import UserProfile from "../view/UserProfile.vue";
import JobPostUpdate from "../view/JobPostUpdate.vue";

const routes = [
    {
        path: "/",
        component: Login,
    },
    {
        path: "/about",
        component: About,
    },
    {
        path: "/signup",
        component: Signup,
    },
    {
        path: "/job-list",
        component: JobList,
    },
    {
        path: "/job-post",
        component: JobPost,
    },
    {
        path: "/job-post-update/:id",
        component: JobPostUpdate,
    },
    {
        path: "/job-detail/:id",
        component: JobDetail,
    },
    {
        path: "/user-profile",
        component: UserProfile,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
