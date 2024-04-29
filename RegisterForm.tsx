import React, { useState } from 'react';
import { IonContent, IonInput, IonButton, IonText } from '@ionic/react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name: name,
        email: email,
        password: password,
      });
      // Handle successful registration 
      console.log('Registration successful:', response.data);
      setRegistered(true); // Set registered state to true
    } catch (error: any) { // Explicitly type 'error' as 'any'
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while processing your request');
      }
    }
  };

  return (
    <IonContent className="register-form">
      <h2>Register</h2>
      {registered && <p className="success">Registration successful!</p>}
      <form onSubmit={handleSubmit}>
        <IonInput
          type="text"
          value={name}
          onIonChange={(e) => setName(e.detail.value!)}
          placeholder="Name"
        />
        <IonInput
          type="email"
          value={email}
          onIonChange={(e) => setEmail(e.detail.value!)}
          placeholder="Email"
        />
        <IonInput
          type="password"
          value={password}
          onIonChange={(e) => setPassword(e.detail.value!)}
          placeholder="Password"
        />
        <IonInput
          type="password"
          value={confirmPassword}
          onIonChange={(e) => setConfirmPassword(e.detail.value!)}
          placeholder="Confirm Password"
        />
        <IonButton type="submit">Register</IonButton>
        {error && <IonText color="danger">{error}</IonText>}
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </IonContent>
  );
};

export default RegisterForm;
