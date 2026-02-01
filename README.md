# Projeto Commissions

Bem-vindo ao repositório do Projeto Commissions! Este projeto é uma aplicação web completa composta por um backend .NET e um frontend React (Vite).

## Objetivo

Desenvolver uma plataforma digital que permita a artistas divulgar, publicar e comercializar seus trabalhos de forma profissional e acessível. O ambiente deverá possibilitar que os artistas definam e gerenciem a precificação de suas obras, ofereçam serviços personalizados por meio de encomendas e mantenham um portfólio organizado e atrativo.

| | |
|---|---|
| ![1](https://github.com/user-attachments/assets/0285a007-44d7-4413-967b-c4472146d85e) | ![2](https://github.com/user-attachments/assets/b6e97274-3bac-46ac-a5b2-e5f23c1c36cc) |
| ![3](https://github.com/user-attachments/assets/f8d74d6b-e888-47d2-9cc3-38cb2826ba6c) | ![4](https://github.com/user-attachments/assets/2ec066eb-dfae-42e1-bf0d-a317b59960a2) |






## Estrutura do Projeto

- **Backend**: `SMT.Back.Comissoes` (.NET 9 Web API)
- **Frontend**: `SMT.Front.Comissoes` (React + Vite + TailwindCSS + Shadcn/ui)

## Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- [.NET 9 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (versão LTS recomendada)

## Como Rodar o Projeto

Para facilitar o desenvolvimento, configuramos um comando unificado que roda tanto o backend quanto o frontend simultaneamente.

1. **Instalar Dependências**
   Abra o terminal na raiz do projeto e execute:
   ```bash
   npm install
   ```
   *Isso instalará o `concurrently` na raiz e também as dependências do frontend (via script `postinstall`)*.

2. **Rodar a Aplicação**
   Ainda na raiz, execute:
   ```bash
   npm run dev
   ```

   Isso iniciará:
   - **Backend API**: Geralmente em `https://localhost:7048` (ou porta similar configurada)
   - **Frontend**: Geralmente em `http://localhost:5173`

   Acesse o frontend no seu navegador para utilizar a aplicação.

## Comandos Úteis

- `npm run install:front`: Instala apenas as dependências da pasta do frontend.
- `dotnet run --project SMT.Back.Comissoes/SMT.Back.Comissoes.csproj`: Roda apenas o backend.
- `npm run dev --prefix SMT.Front.Comissoes`: Roda apenas o frontend.
