import { createRouter, createWebHistory } from 'vue-router';
import Homepage from './views/Homepage.vue';
import Login from '@/views/login/Login.vue';
import Calender from './views/Calender.vue';
import Upload from './views/resources/Upload.vue';
import MyResources from './views/resources/MyResources.vue';
import Register from './views/login/Register.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  { path: '/register',  component: Register },
  {
    path: '/homepage', name: 'homepage', component: Homepage,
    children: [
      { path: '', component: Calender },
      { path: '/uploadRes', component: Upload },
      { path: '/myResources', component: MyResources },
    ]
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;