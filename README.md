
# Sobre
É uma API desenvolvida em linguagem NodeJS utilizando framework Express.js e ORM Sequelize com banco de dados SQLite3. Para validação da request, foi utilizado joi, e para os testes, foi escolhido o chai e mocha.
Seu objetivo é atender ao desafio backend proposto pela Texo, ou seja, gerenciar uma lista de filmes, cada qual com seu ano de lançamento, título, estúdio, produtores e se foi premiado, sendo possível cadastrar, apagar e consultar filmes. 
Além disto, é possível obter o resultado proposto pelo desafio, ou seja, obter os produtores premiados no menor e maior espaço de tempo consecutivos.
Para maiores informações sobre o referido desafio, suas especificações podem ser vistas no arquivo: `/docs/Especificação Backend.pdf`.

# Pré Requisitos
É necesário ter previamente instalado no local de execução o NodeJS e npm.
Ref: https://nodejs.org/en/download

# Instalação
Para instalar o projeto, é necessário executar o comando no terminal de comando dentro da pasta do projeto: `npm install`.

# Execução
Para inicializar o projeto, é necessário executar o comando no terminal de comando dentro da pasta do projeto: `npm start`.
Após isto, a API estará disponível no seguinte endereço/porta: `localhost:3030`.
Ao executar o comando e inicializar a API, a lista de filmes padão (/docs/movielist.csv) é carregada automaticamente.

# Rotas
As seguintes rotas estão disponíveis:

* POST '/'
  Esta rota cadastrará um novo filme.
  Request body:
  ```
    {
	   "year": 2024,
	   "title": "Duro de Matar 2",
	   "studios": "20th Century Fox",
	   "producers": ["Renny Harlin", "Eduardo Kopper"],
	   "winner": true
    } 
  ```
  Os campos acima deve atender aos seguintes requisitos:
  ```
    year: número inteiro, obrigatório
	title: string, obrigatório
	studios: string, obrigatório
	producers: array de string, obrigatório
	winner: boleano, aceita vazio, padrão é falso
  ```
  Response:
  ```
    {
       "message": "Movie created successfully"
    }
  ``` 


* POST '/file'
  Esta rota cadastrará todos filmes presentes em um arquivo CSV
  Request body:
  ```
    { 
       "file": "docs/movielist.csv"
    }
  ```
  Response:
  ```
    {
       "message": "Movies created successfully"
    }
  ```  

* GET '/'
  Esta rota retornará todos os filmes cadastrados
  Response:
  ```
  [
	{
	  "id": 2063,
	  "year": 1980,
	  "title": "Can't Stop the Music",
	  "studios": "Associated Film Distribution",
      "producers": ["Allan Carr"],
	  "winner": true,
	  "createdAt": "2023-12-29T19:11:59.356Z",
	  "updatedAt": "2023-12-29T19:11:59.356Z"
	},
    {
      "id": 2064,
	  "year": 1980,
	  "title": "Cruising",
	  "studios": "Lorimar Productions, United Artists",
      "producers": ["Jerry Weintraub"],
	  "winner": false,
	  "createdAt": "2023-12-29T19:11:59.357Z",
	  "updatedAt": "2023-12-29T19:11:59.357Z"
	}
  ]
  ```  

* GET '/{movieId}'
  Esta rota retornará especificamente um filme, de acordo com o id informado
  Response:
  ```
	{
	  "id": 2063,
	  "year": 1980,
	  "title": "Can't Stop the Music",
	  "studios": "Associated Film Distribution",
      "producers": ["Allan Carr"],
	  "winner": true,
	  "createdAt": "2023-12-29T19:11:59.356Z",
	  "updatedAt": "2023-12-29T19:11:59.356Z"
	}
  ```  

* GET '/winners'
  Esta rota retornará todos produtores premiados, ordenados pelo primeiro ano de premiação do produtor.
  Response:
  ```
  [
	{
		"name": "Allan Carr",
		"awards": [1980, 1981]
	},
	{
		"name": "Frank Yablans",
		"awards": [1981]
	},
    {
		"name": "Mitsuharu Ishii",
		"awards": [1982]
	},
  ]
  ``` 

* GET '/answer'
  Esta rota retornará a resposta do desafio, onde constará os produtores premiados no menor e maior espaço de tempo
  Response:
  ```
  {
	"min": [
		{
			"producer": "Allan Carr",
			"interval": 1,
			"previousWin": 1980,
			"followingWin": 1981
		},
		{
			"producer": "Joel Silver",
			"interval": 1,
			"previousWin": 1990,
			"followingWin": 1991
		}
	],
	"max": [
		{
			"producer": "Matthew Vaughn",
			"interval": 13,
			"previousWin": 2002,
			"followingWin": 2015
		}
	]
  }
  ```

* DELETE '/'
  Esta rota apagará todos os filmes cadastrados
  Response:
  ```
  {
	"message": "Movies deleted successfully"
  }
  ```

* DELETE '/{movieId}'
  Esta rota apagará especificamente um filme, de acordo com o id informado.
  Response:
  ```
  {
	"message": "Movie id 123 deleted successfully"
  }
  ```


# Testes
Para executar os testes desenvolvidos para o projeto, é necessário executar o comando no terminal de comando dentro da pasta do projeto, podendo ser as seguintes opções: 
- Todos os testes: `npm test`
- Testes de aceitação: `npm run test-acceptance`
- Testes de integração: `npm run test-integration`

Obs.: Ao executar os testes, a base de dados será apagada. Em um ambiente real, deve-se separar estas bases de dados em test e production.

# Observações
 O arquivo a ser importado na rota POST '/file' deve ser no formato CSV, separando os campos por ";" e as linhas por quebra de linhas.

 Na primeira linha deve conter os títulos das colunas, sendo: "year;title;studios;producers;winner", conforme exemplo presente no diretório /docs/movielist.csv