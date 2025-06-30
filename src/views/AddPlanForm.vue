<template>
    <form>
        <div class="mb-3">
            <label for="PlanTitle" class="form-label">Plan Title</label>
            <input type="PlanTitle" class="form-control" id="PlanTitle" aria-describedby="PlanTitle" />

            <label for="PlanDesc" class="form-label">Describe your Plan</label>
            <input type="PlanDesc" class="form-control" id="PlanDesc" aria-describedby="PlanDesc" />
        </div>

        <VueDatePicker v-model="date" :transitions="false" />

        <button type="submit" class="btn btn-primary mt-3">Submit</button>
    </form>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
</script>

<style>
/* Add any custom styling if needed */
</style>