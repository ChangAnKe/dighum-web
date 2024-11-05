import { createRouter, createWebHistory } from 'vue-router';
import Homepage from './views/Homepage.vue';
import Login from '@/views/login/Login.vue';
import Calender from './views/Calender.vue';
import CreateVideo from './views/resources/CreateVideo.vue';
import MyResources from './views/resources/MyResources.vue';
import Register from './views/login/Register.vue';
import VoiceClone from './views/resources/VoiceClone.vue';
import SubUsersReg from './views/users/SubUsersReg.vue';
import PointsMan from './views/users/PointsMan.vue';
import SubUsersLists from './views/users/SubUsersLists.vue';
import ChangePwd from './views/users/ChangePwd.vue';
import UserMenuMan from './views/priman/UserMenuMan.vue';
import AIHistory from './views/users/AIHistory.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  { path: '/register',  component: Register },
  {
    path: '/homepage', name: 'homepage', component: Homepage,
    children: [
      { path: '', component: Calender },
      { path: '/createVideo', component: CreateVideo },
      { path: '/myResources', component: MyResources },
      { path: '/voiceClone', component: VoiceClone },
      { path: '/subusers/reg', component: SubUsersReg },
      { path: '/subusers/pointsMan', component: PointsMan },
      { path: '/subusers/lists', component: SubUsersLists },
      { path: '/changePwd', component:ChangePwd },
      { path: '/priman/userMenusMan', component:UserMenuMan },
      { path: '/aiHistory', component: AIHistory }
    ]
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;