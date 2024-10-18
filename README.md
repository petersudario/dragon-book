# Dragon Book

Este é um projeto Laravel 11 configurado para rodar em um ambiente Docker, utilizando Laravel Breeze como sistema de autenticação. 
Este guia o ajudará a configurar e executar o projeto localmente.

## Requisitos

- **Docker**: Certifique-se de que você tem o Docker version 27.3.1, build ce12230  instalado.
- **Node**: Certifique-se de que você tem o Node version v18.20.4 instalado.
- **NPM**: Certifique-se de que você tem o Node Package Manager version 10.7.0 instalado.
- **Docker Compose**: Certifique-se de que você tem o Docker Compose version v2.5.0 instalado.
- **Composer**: Composer version 2.7.1 também deve estar instalado localmente para instalar as dependências PHP.

## Configuração

### 1. Clonar o repositório.

Primeiro, clone o repositório do projeto para o seu ambiente local:

```bash
git clone git@github.com:petersudario/dragon-book.git
cd dragon-book
```


### 2. Inicie o container do Docker. Após a build, inicie o terminal do container "app".

```bash
docker-compose up -d --build
docker-compose exec app bash
```

### 3. Instale a node_modules e a vendor no container.

```bash
npm install
composer install
```


### 4. Copie e renomeie o arquivo ".env.example" para ".env" na root do projeto e altere as seguintes linhas para as configurações necessárias:
Certifique-se de ter a porta 3306 liberada em seu computador. Caso não puder, troque a configuração de porta do container no docker-compose.yml para "3307:3306".

```bash
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=root

VITE_GOOGLE_MAPS_API_KEY=Sua chave de API da Google Maps
GOOGLE_MAPS_API_KEY=Sua chave de API da Google Maps
```

### 5. Realize o seguintes comando do npm:

```bash
npm run build
```

### 6. Realize os seguintes comandos do artisan:

```bash
php artisan key:generate
php artisan migrate
```

### 7. Inicie o artisan e abra a aplicação no navegador: http://localhost:8000.

```bash
php artisan serve --host=0.0.0.0 --port=8000
```
