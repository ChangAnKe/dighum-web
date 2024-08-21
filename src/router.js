import { createRouter, createWebHistory } from 'vue-router';
import Homepage from './views/Homepage.vue';
import Login from '@/views/login/Login.vue';
import Calender from './views/Calender.vue';
import Upload from './views/resources/Upload.vue';
import MyResources from './views/resources/MyResources.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/login', component: Login },
  {
    path: '/homepage', component: Homepage,
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