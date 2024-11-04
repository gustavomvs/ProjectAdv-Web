const CLIENT_ID = "1000.WTU36HCZ6AMQN1HGW83TY4IE0NFOSI";
const REDIRECT_URI =
  "https://e55c-2804-56c-d746-a700-fdff-8dd7-4c0-bfee.ngrok-free.app/callback"; // Redireciona para o backend

const Login = () => {
  const handleLogin = () => {
    const authUrl = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${CLIENT_ID}&scope=ZohoBigin.modules.ALL&access_type=offline&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}`;
    window.location.href = authUrl;
  };

  return (
    <div>
      <h1>Integração OAuth 2.0 com Bigin</h1>
      <button onClick={handleLogin}>Login com Bigin</button>
    </div>
  );
};

export default Login;
