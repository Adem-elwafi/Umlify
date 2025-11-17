<template>
  <div class="signup-container">
    <div class="signup-card">
      <div class="signup-header">
        <h1>UMLify</h1>
        <p>Create your account</p>
      </div>
      
      <form @submit.prevent="handleSignup" class="signup-form">
        <div class="form-group">
          <label for="fullname">Full Name</label>
          <input
            id="fullname"
            v-model="fullname"
            type="text"
            placeholder="Enter your full name"
            required
            autocomplete="name"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            autocomplete="email"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Create a password"
            required
            autocomplete="new-password"
            minlength="8"
          />
          <span class="helper-text">Minimum 8 characters</span>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
            autocomplete="new-password"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div class="terms">
          <label class="terms-checkbox">
            <input type="checkbox" v-model="acceptTerms" required />
            <span>I agree to the <a href="#" @click.prevent="showTerms">Terms of Service</a> and <a href="#" @click.prevent="showPrivacy">Privacy Policy</a></span>
          </label>
        </div>
        
        <button type="submit" class="btn-signup" :disabled="isLoading">
          {{ isLoading ? 'Creating account...' : 'Create Account' }}
        </button>
        
        <div class="divider">
          <span>or</span>
        </div>
        
        <button type="button" class="btn-google" @click="handleGoogleSignup">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
            <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </form>
      
      <div class="login-link">
        Already have an account? <a href="#" @click.prevent="handleLogin">Sign in</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['signupSuccess', 'switchToLogin']);

const fullname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const acceptTerms = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const handleSignup = async () => {
  errorMessage.value = '';
  
  // Validate passwords match
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  // Validate password length
  if (password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters';
    return;
  }

  isLoading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    console.log('Signup:', { 
      fullname: fullname.value, 
      email: email.value, 
      password: password.value 
    });
    // Add your signup logic here
    // On success, emit the signup-success event
    emit('signupSuccess');
    isLoading.value = false;
  }, 1000);
};

const handleGoogleSignup = () => {
  console.log('Google signup clicked');
  // Add Google OAuth logic here
  // emit('signupSuccess'); // Uncomment after implementing Google OAuth
};

const handleLogin = () => {
  emit('switchToLogin');
};

const showTerms = () => {
  console.log('Show terms of service');
  // Add logic to show terms
};

const showPrivacy = () => {
  console.log('Show privacy policy');
  // Add logic to show privacy policy
};
</script>

<style scoped lang="css">
.signup-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--c-beige) 0%, #e8d5cf 100%);
  padding: 2rem;
}

.signup-card {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(23, 65, 67, 0.15);
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.signup-header {
  text-align: center;
  margin-bottom: 2rem;
}

.signup-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--c-dark-teal);
  margin: 0 0 0.5rem;
  background: linear-gradient(135deg, var(--c-teal), var(--c-dark-teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.signup-header p {
  color: var(--text-light);
  margin: 0;
  font-size: 1rem;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: var(--c-teal);
  box-shadow: 0 0 0 3px var(--c-teal-transparent);
}

.form-group input::placeholder {
  color: #999;
}

.helper-text {
  font-size: 0.85rem;
  color: var(--text-light);
}

.error-message {
  padding: 0.75rem 1rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  font-size: 0.9rem;
  text-align: center;
}

.terms {
  font-size: 0.9rem;
}

.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-primary);
}

.terms-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--c-teal);
  margin-top: 2px;
  flex-shrink: 0;
}

.terms-checkbox a {
  color: var(--c-teal);
  text-decoration: none;
  font-weight: 500;
}

.terms-checkbox a:hover {
  text-decoration: underline;
}

.btn-signup {
  padding: 1rem;
  background: linear-gradient(135deg, var(--c-teal), var(--c-dark-teal));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(66, 122, 118, 0.3);
}

.btn-signup:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 122, 118, 0.4);
}

.btn-signup:active:not(:disabled) {
  transform: translateY(0);
}

.btn-signup:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.divider {
  position: relative;
  text-align: center;
  margin: 0.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background: #e0e0e0;
}

.divider span {
  position: relative;
  background: white;
  padding: 0 1rem;
  color: #999;
  font-size: 0.9rem;
}

.btn-google {
  padding: 1rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--text-primary);
}

.btn-google:hover {
  background: #f8f8f8;
  border-color: #d0d0d0;
}

.login-link {
  text-align: center;
  margin-top: 2rem;
  color: var(--text-light);
  font-size: 0.95rem;
}

.login-link a {
  color: var(--c-teal);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.login-link a:hover {
  color: var(--c-dark-teal);
}

@media (max-width: 640px) {
  .signup-card {
    padding: 2rem 1.5rem;
  }
  
  .signup-header h1 {
    font-size: 2rem;
  }
}
</style>
