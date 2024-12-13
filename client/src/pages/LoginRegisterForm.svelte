<script>
    import { navigate } from 'svelte-routing';
    import axios from 'axios';

    //initial variables
    let username = $state('');
    let password = $state('');
    let diets = $state('');

    let formType = $state('login');
    let invalidAccount = $state(null);
    let validationMessage = $state('');

    const formConfig = {
        login: {
            title: 'Login',
            button_text: 'Login',
            toggle_text: 'No account? Register'
        },
        register: {
            title: 'Register',
            button_text: 'Register',
            toggle_text: 'Already have an account? Log In'
        }
    };

    const formTypeToggle = () => {
        formType = formType === 'login' ? 'register' : 'login';
    }

    const userSubmit = async () => {
        const endpoint = `http://localhost:8080/users/${formType}`;

        //system checks to see if both the username and password is filled out.
        if(!username || !password) {
            validationMessage = "The username and password is required, please fill out your username and password.";
            return;
        }
        try {
            const preferences = diets.trim().split(",");
            const response = await axios.post(endpoint, {username, password, preferences});
            console.log(response.data);

            if(formType === 'login' && response.data.id) {
                const { id, token_type, access_token } = response.data;

                const user = { id, header_token: `${token_type} ${access_token}`};
                localStorage.setItem('user', JSON.stringify(user));
                window.dispatchEvent(new Event('storage-updated'));
                navigate(`/profile/${id}`);
            }

            //after registering, the user will be directed to log in their credientials.
            if(formType == 'register' && response.data.id) {
                validationMessage = "Registration successful! Please log in.";
                formTypeToggle();
            }
        } catch (error) {
            //validation message will explain to the user that corrections will need to be made.
            validationMessage = 'An error occurred: please see the following:';
            if(formType === 'login') {
                invalidAccount = true;
            }
            console.log(error);
        }
    }
    
</script>

<div class="form-container">
    <h1>{formConfig[formType].title}</h1>
    {#if validationMessage} 
            <p>{validationMessage}</p>
        {/if}
    {#if formType === 'register'}
        <input type="text" bind:value={username} placeholder="username">
        <input type="password" bind:value={password} placeholder="password">
        <input type="text" bind:value={diets} placeholder="preferences (optional)">
    {:else}
        {#if invalidAccount === true} 
            <p>Your username or password is invalid, please try again.</p>
        {/if}
        <input type="text" bind:value={username} placeholder="username">
        <input type="password" bind:value={password} placeholder="password">
    {/if}

    <button class="submit-btn" onclick={userSubmit}>
        {formConfig[formType].button_text}
    </button>

    <div class="toggle-container">
        <label for="toggle" class="toggle-label">
            {formConfig[formType].toggle_text}
        </label>
        <button 
            class="toggle-btn"
            role="switch" 
            aria-label="Toggle between login and register"
            aria-checked={formType === 'login' ? false : true}
            class:active={formType === 'login'} 
            onclick={formTypeToggle}
        ></button>
    </div>
</div>

<style>
.form-container {
    background-color: #1d2531;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 32rem;
    margin: 2.5rem auto;
    text-align: center;
}

.form-container h1 {
    text-transform: uppercase;
}

.form-container input {
    width: 100%;
    padding: 1rem;
    margin: 1rem 0;
    border: none;
    border-radius: 0.5rem;
    background: #0f1621;
    color: #a0a0a0;
}

.form-container input:focus {
    outline: none;
    box-shadow: 0 0 0.3125rem #394961;
}

.form-container .submit-btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 0.5rem;
    background: #f2c069;
    cursor: pointer;
    margin-bottom: 1rem;
}

.form-container .submit-btn:hover {
    background: #d9ac5e;
}

.toggle-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.toggle-label {
    font-size: 1rem;
}

.toggle-btn {
    width: 3rem;
    height: 1.5rem;
    background-color: #555;
    border-radius: 1.875rem;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    padding: 0;
    outline: none;
    border: none;
}

.toggle-btn:before {
    content: '';
    position: absolute;
    top: 0.125rem;
    left: 0.125rem;
    width: 1.25rem;
    height: 1.25rem;
    background-color: #d6dbe4;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.toggle-btn.active {
    background-color: #d9ac5e;
}

.toggle-btn.active:before {
    transform: translateX(1.5rem);
}

.toggle-btn:focus {
    outline: none;
    box-shadow: none;
}

</style>