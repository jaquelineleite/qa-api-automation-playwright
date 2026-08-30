# Test Architecture — API Quality Engineering

## 1. Objetivo

Este documento descreve a arquitetura de testes adotada no projeto e os critérios utilizados para decidir em qual camada cada risco deve ser validado.

O objetivo é evitar automação orientada apenas por ferramenta e priorizar a camada que forneça o melhor equilíbrio entre:

- confiança;
- velocidade;
- isolamento;
- manutenibilidade;
- custo de execução;
- risco coberto.

---

## 2. Visão da arquitetura

```text
                    QUALITY STRATEGY
                           |
                           v
                    RISK ANALYSIS
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
        Functional      Contract     Non-functional
             |             |             |
             v             v             v
          API Tests    JSON Schema    Rate Limit
             |
             +-----------------------------+
             |
             v
        Test Evidence
             |
             v
       Failure Analysis
             |
             v
        Quality Gate
