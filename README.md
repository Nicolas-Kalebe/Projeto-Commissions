# Projeto Commissions

Bem-vindo ao repositório do Projeto Commissions! Este projeto é uma aplicação web completa composta por um backend .NET e um frontend React (Vite).

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
