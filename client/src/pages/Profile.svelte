<script>
  import { onMount } from "svelte";
  import axios from "axios";

  import MealCard from "../components/MealCard.svelte";

  let { id } = $props();

  let profile = $state(null);
  let unauthorizedText = $state('');
  let isLoading = $state(true);

  onMount(async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));

        if(!user || !user.header_token) {
            unauthorizedText = "You are not authorized to see this page, please exit the page and log in.";
            return;
        }

        const response = await axios.get(`http://localhost:8080/users/${id}`, {
            headers: {
                Authorization: user.header_token
            }
        });

        profile = response.data;
    } catch (error) {
        console.log(error);
        unauthorizedText ="An error occurred while loading this page, please try again.";
    } finally {
        isLoading = false;
    }
  });
</script>

<div class="profile-container">
    {#if isLoading}
        <div>Loading profile..</div>
    {:else if unauthorizedText}
        <h2>{unauthorizedText}</h2>
    {:else}
        <h1>Welcome, {profile.username}!</h1>
        {#if profile.preferences.length == 0}
            <h2>You currently don't have any preferences!</h2>
        {:else}
            <h2>Your preferences: {profile.preferences}</h2>
        {/if}
        <hr/>
        <h1>Mealplans</h1>
            {#if profile.mealplans.length === 0}
                <p>No mealplans found.</p>
            {:else}
                <div class="mealplan-container">
                {#each profile.mealplans as mealplan}
                    <h2>Week: {mealplan.week}</h2>
                    <div class="meal-list">
                        <MealCard mealplan={mealplan}/>
                    </div>
                {/each}
                </div>
            {/if}
    {/if}
</div>

<style>
.mealplan-container {
    justify-content: center;
    margin-top: 20px;
}
.profile-container {
    margin: 2rem auto;
    padding: 2rem;
    text-align: left;
}
h1 {
    font-family: 'Montserrat', sans-serif;
    font-size: 2rem;
}
h2 {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.5rem;
}

.meal-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>