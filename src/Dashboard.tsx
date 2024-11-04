// src/Dashboard.js

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const location = useLocation();
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loadingFetch, setLoadingFetch] = useState(false); // Estado para mostrar carregamento ao buscar usuários
  const [loadingCreate, setLoadingCreate] = useState(false); // Estado para mostrar carregamento ao criar usuário
  const [createSuccess, setCreateSuccess] = useState(""); // Mensagem de sucesso ao criar usuário

  useEffect(() => {
    // Função para extrair os parâmetros da URL
    const getQueryParams = () => {
      const params = new URLSearchParams(location.search);
      return {
        access_token: params.get("access_token"),
        refresh_token: params.get("refresh_token"),
        expires_in: params.get("expires_in"),
      };
    };

    const { access_token, refresh_token, expires_in }: any = getQueryParams();

    if (access_token && refresh_token) {
      console.log("Tokens recebidos:", {
        access_token,
        refresh_token,
        expires_in,
      });
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      setExpiresIn(expires_in);

      // Armazene os tokens no localStorage para persistência
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("expires_in", expires_in);
    } else {
      console.warn("Access token ou refresh token não recebidos.");
    }
  }, [location.search]);

  const fetchDeactiveUsers = async () => {
    if (!accessToken) {
      setError("Access Token não disponível.");
      return;
    }

    setLoadingFetch(true);
    setError("");
    setCreateSuccess("");

    try {
      const response = await axios.get(
        "https://4af0-2804-56c-d746-a700-fdff-8dd7-4c0-bfee.ngrok-free.app/api/deactive-users",
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
        }
      );

      setUsers(response.data.data); // Ajuste conforme a estrutura da resposta da API
    } catch (err: any) {
      console.error("Erro ao buscar usuários deativos:", err.response?.data);
      setError("Falha ao buscar usuários de ativos.");
    } finally {
      setLoadingFetch(false);
    }
  };

  const createUser = async () => {
    if (!accessToken) {
      setError("Access Token não disponível.");
      return;
    }

    setLoadingCreate(true);
    setError("");
    setCreateSuccess("");

    try {
      const response = await axios.post(
        "https://4af0-2804-56c-d746-a700-fdff-8dd7-4c0-bfee.ngrok-free.app/api/create-user",
        {}, // Corpo vazio, pois os dados são estáticos no backend
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Usuário criado:", response.data);
      setCreateSuccess("Usuário criado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao criar usuário:", err.response?.data);
      setError("Falha ao criar usuário.");
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {accessToken ? (
        <div>
          <p>
            <strong>Access Token:</strong> {accessToken}
          </p>
          <p>
            <strong>Refresh Token:</strong> {refreshToken}
          </p>
          <p>
            <strong>Expira em:</strong> {expiresIn} segundos
          </p>

          <button onClick={fetchDeactiveUsers} disabled={loadingFetch}>
            {loadingFetch ? "Buscando..." : "Buscar Usuários Deativos"}
          </button>

          <button
            onClick={createUser}
            disabled={loadingCreate}
            style={{ marginLeft: "10px" }}
          >
            {loadingCreate ? "Criando..." : "Criar Usuário"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {createSuccess && <p style={{ color: "green" }}>{createSuccess}</p>}

          {users.length > 0 ? (
            <div>
              <h3>Usuários Deativos:</h3>
              <ul>
                {users.map((user: any) => (
                  <li key={user.id}>{user.name}</li> // Ajuste conforme a estrutura do usuário
                ))}
              </ul>
            </div>
          ) : (
            <p>Nenhum usuário deativo encontrado.</p>
          )}
        </div>
      ) : (
        <p>Faça login para obter os tokens.</p>
      )}
    </div>
  );
};

export default Dashboard;
