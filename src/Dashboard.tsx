import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

interface Contact {
  id: string;
  Name: string;
  Email: string;
}

const Dashboard: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const location = useLocation();

  useEffect(() => {
    // Extrair tokens dos parâmetros da URL
    const params = new URLSearchParams(location.search);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    // Verifique se os tokens foram obtidos corretamente
    if (!access_token || !refresh_token) {
      alert("Token de acesso não encontrado.");
      window.location.href = "/";
      return;
    }

    // Armazenar os tokens no localStorage
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);

    // Remover os tokens da URL para limpar a barra de endereços
    window.history.replaceState({}, document.title, "/dashboard");
  }, [location]);

  useEffect(() => {
    const fetchContacts = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        try {
          const response = await axios.get<{ data: Contact[] }>(
            "https://www.bigin.com/api/v2/contacts",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          setContacts(response.data.data);
        } catch (error) {
          console.error("Erro ao obter contatos:", error);
          alert("Falha ao obter contatos.");
        }
      }
    };

    fetchContacts();
  }, []);

  return (
    <div>
      <h1>Contatos da Bigin</h1>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.Name} - {contact.Email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
