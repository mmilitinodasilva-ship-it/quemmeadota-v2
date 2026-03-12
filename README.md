# Quem Me Adota 🐾❤️

Uma plataforma profissional de adoção de pets desenvolvida com as melhores tecnologias modernas (MERN stack). O projeto foi desenhado para ser intuitivo tanto para os usuários que buscam um novo amigo quanto para o administrador que gerencia a plataforma.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React.js** (Vite)
- **TailwindCSS** (Estilização moderna e responsiva)
- **Framer Motion** (Animações fluidas)
- **Lucide Icons** (Iconografia moderna)
- **Socket.IO Client** (Chat e notificações em tempo real)
- **Chart.js** (Gráficos no dashboard administrativo)
- **Leaflet** (Mapas das ONGs parceiras)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Banco de dados NoSQL)
- **JWT & bcryptjs** (Autenticação segura)
- **Socket.IO** (Comunicação bidirecional em tempo real)
- **Multer** (Upload de imagens)

---

## 📂 Estrutura do Projeto

```text
/client
  /src
    /assets       -> Imagens e vetores estáticos
    /components   -> Componentes reutilizáveis (Navbar, Footer, PetCard, etc.)
    /context      -> Gerenciamento de estado global (Auth, Pets)
    /pages        -> Páginas principais (Home, Pets, Detalhes, Admin, Login)
    /styles       -> Configurações globais de CSS e Tailwind
/server
  /config         -> Configurações de DB e variáveis de ambiente
  /controllers    -> Lógica de negócio (MVC - Controller)
  /middleware     -> Autenticação e validações
  /models         -> Esquemas do banco de dados (MVC - Model)
  /routes         -> Definição de endpoints da API (MVC - Routes)
  /uploads        -> Armazenamento de imagens de pets e ONGs
```

---

## 🛠️ Como Executar o Projeto

Siga os passos abaixo para rodar o projeto localmente:

### 1. Pré-requisitos
- Node.js instalado (v16 ou superior)
- MongoDB rodando localmente (ou uma URI do MongoDB Atlas)

### 2. Configuração do Backend
1. Abra o terminal na pasta `/server`:
   ```bash
   cd server
   npm install
   ```
2. Crie ou edite o arquivo `.env` com suas credenciais:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/quem-me-adota
   JWT_SECRET=sua_chave_secreta_super_segura
   ```
3. (Opcional) Popule o banco com dados de exemplo:
   ```bash
   node seed.js
   ```
4. Inicie o servidor:
   ```bash
   npm run dev
   ```

### 3. Configuração do Frontend
1. Abra um novo terminal na pasta `/client`:
   ```bash
   cd client
   npm install
   ```
2. Inicie o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```
3. O projeto estará disponível em `http://localhost:5173`.

---

## 🔐 Acesso Administrativo
Para acessar o painel administrativo:
- **URL:** `http://localhost:5173/login`
- **Usuário:** `admin`
- **Senha:** `adminpassword`

---

## ✨ Funcionalidades Principais
- **Busca e Filtros:** Encontre pets por espécie, porte e idade.
- **Favoritos:** Salve pets que você gostou para ver depois.
- **Chat Real-time:** Converse diretamente com a ONG responsável pelo pet.
- **Painel Administrativo:** Dashboard com métricas, gerenciamento de pets, ONGs e solicitações de adoção.
- **Design Emocional:** Interface inspirada em startups modernas como Airbnb e Notion.

---
Desenvolvido com ❤️ para ajudar nossos amigos de quatro patas.
