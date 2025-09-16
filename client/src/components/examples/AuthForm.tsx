import AuthForm from '../AuthForm';

export default function AuthFormExample() {
  return (
    <AuthForm
      onLogin={(data) => console.log('Login:', data)}
      onSignup={(data) => console.log('Signup:', data)}
      onGoogleAuth={() => console.log('Google auth')}
      isLoading={false}
    />
  );
}