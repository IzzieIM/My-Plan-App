import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import MyPlanPage from '@/views/MyPlanPage.vue'
import Plan from '@/views/Plan.vue'
import AddPlanForm from '@/views/AddPlanForm.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/myplan',
    name: 'MyPlanPage',
    component: MyPlanPage
  },
  {
    path: '/plans',
    name: 'Plan',
    component: Plan

  },
  {
    path: '/addplan',
    name: 'AddPlanForm',
    component: AddPlanForm

  }


]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
