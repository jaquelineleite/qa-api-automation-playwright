# Quality Strategy — API Automation

## 1. Objetivo

Este documento descreve a estratégia de qualidade adotada no projeto `qa-api-automation-playwright`.

O objetivo da suíte não é apenas automatizar endpoints, mas produzir um sinal de qualidade confiável sobre os principais riscos funcionais e de integração da API utilizada no projeto.

A estratégia considera:

* criticidade da funcionalidade;
* impacto de falhas;
* tipo de validação mais adequado;
* isolamento e confiabilidade dos testes;
* custo e benefício da automação;
* limitações do ambiente de testes;
* evidências produzidas para investigação de falhas.

---

## 2. Contexto

O projeto utiliza a API pública ServeRest como sistema sob teste.

A automação foi construída com Playwright e TypeScript e cobre principalmente:

* gerenciamento de usuários;
* autenticação;
* autorização;
* cenários negativos;
* validação de contrato;
* geração de massa de testes;
* rate limit de forma controlada;
* execução automatizada em CI/CD.

Por se tratar de uma API pública e externa ao projeto, algumas decisões foram tomadas para evitar testes invasivos ou sinais de qualidade pouco confiáveis.

---

## 3. Princípios de Quality Engineering

A estratégia utiliza os seguintes princípios:

### Risk-based testing

A prioridade dos testes é determinada pelo impacto potencial de uma falha.

Fluxos relacionados a autenticação, autorização e integridade do ciclo de vida do usuário possuem prioridade maior.

### Testes na camada adequada

Como o objetivo deste repositório é validar comportamento de serviços REST, os testes são executados diretamente na camada de API.

Não é utilizada uma interface gráfica apenas para validar comportamentos que podem ser comprovados de forma mais rápida e isolada através dos endpoints.

### Independência dos testes

Sempre que possível, os dados necessários para execução são criados dinamicamente.

Isso reduz:

* dependência de massa pré-existente;
* conflitos entre execuções;
* acoplamento entre cenários;
* falhas provocadas por dados compartilhados.

### Evidência antes de diagnóstico

Uma falha de automação não deve ser automaticamente classificada como defeito de produto.

O resultado deve ser analisado considerando:

* resposta HTTP;
* corpo retornado;
* contrato;
* dados utilizados;
* ambiente;
* comportamento esperado;
* possível falha da própria automação.

---

## 4. Principais riscos de qualidade

| Área            | Risco                                                     |    Impacto | Prioridade | Estratégia                           |
| --------------- | --------------------------------------------------------- | ---------: | ---------: | ------------------------------------ |
| Autenticação    | Usuário válido não conseguir autenticar                   |       Alto |    Crítica | Teste positivo de login              |
| Autenticação    | Credenciais inválidas concederem acesso                   |       Alto |    Crítica | Teste negativo                       |
| Autorização     | Rota protegida aceitar requisição sem token               |       Alto |    Crítica | Teste sem JWT                        |
| Autorização     | Token válido não conceder acesso esperado                 |       Alto |    Crítica | Teste utilizando JWT real            |
| Usuários        | Criação retornar sucesso sem persistir dados corretamente |       Alto |       Alta | Criação + consulta posterior         |
| Usuários        | Atualização não persistir novo estado                     |       Alto |       Alta | Update + nova consulta               |
| Usuários        | Exclusão não remover recurso                              |       Alto |       Alta | Delete + validação posterior         |
| Integridade     | Permitir usuários duplicados indevidamente                | Médio/Alto |       Alta | Cenário negativo de e-mail duplicado |
| Validação       | Campos obrigatórios serem aceitos ausentes                |      Médio |       Alta | Testes negativos parametrizados      |
| Contrato        | Mudança estrutural quebrar consumidores                   |       Alto |       Alta | JSON Schema + AJV                    |
| Disponibilidade | Excesso de requisições não ser controlado                 |   Variável |      Média | Rate limit opt-in                    |
| Massa de teste  | Execuções entrarem em conflito                            |      Médio |       Alta | Dados dinâmicos com Faker            |

---

## 5. Estratégia de cobertura

### Testes funcionais

Validam o comportamento esperado dos endpoints.

Exemplos:

* criação;
* consulta;
* atualização;
* exclusão;
* autenticação.

### Testes negativos

Verificam se entradas inválidas são rejeitadas corretamente.

Incluem:

* ausência de campos obrigatórios;
* credenciais inválidas;
* usuário inexistente;
* exclusão de recurso inexistente;
* e-mail duplicado.

### Testes de autenticação e autorização

A validação não termina na existência de um token.

O projeto também utiliza o token retornado pelo login para acessar uma rota protegida e compara esse comportamento com uma tentativa sem autenticação.

Dessa maneira, o teste valida o uso efetivo da credencial no fluxo de autorização.

### Testes de contrato

JSON Schema e AJV são utilizados para detectar alterações inesperadas na estrutura das respostas.

A cobertura de contrato atual está concentrada no recurso de usuários e pode ser expandida conforme novos serviços forem incorporados ao projeto.

### Rate limit

O cenário de rate limit não faz parte da regressão padrão.

Sua execução é opt-in porque:

* utiliza uma API pública;
* produz um volume elevado de requisições;
* a política pode variar conforme o ambiente;
* uma falha provocada pela ausência dessa configuração não representa necessariamente um defeito funcional da aplicação.

Essa decisão evita transformar um teste não determinístico em um falso quality gate.

---

## 6. Estratégia de dados

Os testes utilizam dados gerados dinamicamente com Faker.

Objetivos:

* permitir execuções repetíveis;
* minimizar colisões;
* reduzir dependência de massa fixa;
* facilitar execução paralela futura.

Quando o cenário cria um recurso exclusivamente para teste, é realizada limpeza dos dados quando aplicável.

Dados permanentes e credenciais sensíveis não devem ser armazenados diretamente no código-fonte.

---

## 7. Quality Gates

Uma execução da suíte principal é considerada saudável quando:

* o projeto passa na validação TypeScript;
* os testes obrigatórios são executados;
* não existem falhas funcionais;
* os testes críticos de autenticação e autorização passam;
* as validações de contrato permanecem compatíveis;
* os relatórios e evidências são produzidos corretamente.

O cenário de rate limit não bloqueia a suíte principal porque possui execução controlada e dependência de configuração específica do ambiente.

---

## 8. CI/CD

O pipeline atua como mecanismo de feedback de qualidade.

A sequência esperada é:

```text
Instalação
    ↓
Validação TypeScript
    ↓
Testes automatizados
    ↓
Relatórios
    ↓
Artefatos
```

Falhas de tipagem ou da suíte obrigatória devem impedir que a execução seja considerada bem-sucedida.

Os relatórios gerados permitem análise posterior das falhas e rastreabilidade da execução.

---

## 9. Classificação de falhas

Uma falha encontrada pela automação deve inicialmente ser classificada em uma das categorias:

### Product defect

O comportamento observado viola uma regra ou contrato esperado.

### Test defect

A implementação do teste, massa, assertion ou lógica de automação está incorreta.

### Environment issue

A indisponibilidade ou configuração do ambiente impede a validação confiável.

### Data issue

A massa utilizada não atende às pré-condições necessárias.

### Contract change

A estrutura da resposta mudou e precisa ser avaliada para determinar se a mudança é esperada ou representa quebra de compatibilidade.

Essa classificação evita tratar toda falha automatizada como defeito do produto.

---

## 10. O que não é tratado como cobertura completa

A existência de testes para todos os endpoints do desafio não significa cobertura absoluta do sistema.

Neste projeto, cobertura representa os requisitos e riscos explicitamente selecionados.

Não são tratados como parte da cobertura atual:

* code coverage do backend, pois o código-fonte da API não pertence ao projeto;
* pentest ou avaliação completa de segurança;
* validação criptográfica da assinatura JWT;
* testes extensivos de performance/carga;
* banco de dados interno da ServeRest;
* observabilidade interna e logs do serviço;
* comportamento de infraestrutura da API pública.

Esses itens exigiriam níveis de acesso ou ambientes controlados diferentes.

---

## 11. Critério de evolução da suíte

Um novo teste deve ser adicionado quando existir uma justificativa de qualidade, como:

* risco de negócio relevante;
* regressão já observada;
* contrato importante entre sistemas;
* cenário crítico de autorização;
* comportamento de alto uso;
* condição de erro relevante;
* mudança que possa afetar consumidores.

A quantidade de testes não é utilizada isoladamente como indicador de qualidade.

Uma suíte menor, estável e orientada a riscos pode produzir um sinal mais útil do que uma suíte extensa composta por cenários redundantes.

---

## 12. Próximas evoluções

Evoluções planejadas para fortalecer a arquitetura de Quality Engineering:

* ampliar validações de contrato para outros recursos;
* criar classificação formal entre smoke e regression;
* adicionar matriz de rastreabilidade entre risco, requisito e teste;
* criar quality gates explícitos no pipeline;
* incluir métricas de execução e estabilidade;
* documentar estratégia para flaky tests;
* ampliar análise automatizada de falhas;
* avaliar integração futura com observabilidade e agentes de IA.

---

## Decisão de engenharia

O objetivo deste projeto não é maximizar a quantidade de cenários automatizados.

O objetivo é produzir testes que sejam:

**relevantes, isolados, repetíveis, rastreáveis e capazes de gerar confiança sobre os riscos que estão sendo avaliados.**
