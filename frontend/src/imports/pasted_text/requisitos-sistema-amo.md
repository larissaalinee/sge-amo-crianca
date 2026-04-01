Análise de requisitos v1.0
“Os requisitos funcionais descrevem o que o sistema deve fazer, ou seja, os serviços que ele oferece. Já os requisitos não funcionais estabelecem limitações e condições, como
desempenho, segurança e usabilidade, garantindo que o sistema funcione de forma eficiente e atenda aos padrões esperados.”

Requisitos funcionais
Login, cadastro e hierarquia entre usuários do sistema com diferentes níveis de permissão: Deve permitir o cadastro dos colaboradores, cada um com apenas o nível mínimo de permissão para desempenhar seu serviço.
Cadastro de pacientes e familiares: O sistema deve registrar os pacientes e seu núcleo familiar, incluindo características alimentares importantes, como intolerâncias e alergias, uso de cadeirinha, ou alguma necessidade específica para o transporte.
Parametrização dos usuários: Equipe multidisciplinar é composta de vários profissionais, e cada um pode ter características específicas, portanto precisamos averiguar quais informações são diferentes para cada cadastro, e dessa forma parametrizar os usuários em diferentes grupos.
Agenda semanal: Ao ingressar no atendimento, o sistema deve permitir o agendamento das atividades para o paciente com os profissionais que ele necessita nos horários disponibilizados pelos funcionários.
Atendimentos múltiplos e conjuntos: O sistema deve permitir agendar mais de um serviço diferente no mesmo dia e turno para um paciente, bem como permitir a criação de atividades em grupo, com outros pacientes ou familiares.
Resolução e sinalização de conflitos: O sistema deve cruzar dados e sinalizar automaticamente agendas e transportes conflitantes
Gestão de vagas: Deve sinalizar claramente os horários de atendimento vagos, bem como os horários disponibilizados após a alta de um paciente para aquele atendimento.
Organização do transporte: O sistema deve coordenar os veículos, permitindo se possível agrupar mais de um paciente em uma mesma viagem.
Controle de lanches: O sistema deve contabilizar os lanches servidos individualmente, cruzando com as restrições alimentares de cada cadastrado.
Emissão de relatórios: O sistema deve gerar relatórios e controles semanais, mensais e anuais sobre atendimentos, cancelamentos, transporte e lanches.
Carro após último atendimento: Sistema deve agendar um carro para levar paciente para casa após último atendimento, caso paciente necessite do transporte.
Lembretes: O sistema deve gerar avisos sobre eventos não conformes, bem como eventos importantes na agenda diária.
Responsividade: A interface deve ser híbrida, com versão desktop (focada na gestão da coordenação técnica) e versão mobile (para motoristas, cozinha e equipe de apoio visualizarem os dados).
Manter atendimento semanal se possível:  Como é prioridade manter a agenda do assistido durante a semana, no caso de feriado no dia do agendamento ou cancelamento por motivos pessoais do assistido, o sistema deve fazer essa sinalização e tentar reagendar para a mesma semana as consultas.
Eventos: na ocorrência de eventos especiais em toda a AMO que não são classificados nem como atendimento individual ou em grupo, nem com um técnico multidisciplinar responsável, deve ser possível adicioná-lo na agenda mesmo assim, e sinalizar que é um evento especial ao invés de uma consulta normal.

Requisitos não funcionais:
Disponibilidade: O sistema deve poder ser acessado de fora da rede física da AMO, operando em nuvem com alta disponibilidade
Acessibilidade: As telas devem seguir as diretrizes de acessibilidade visual, garantindo leitura fácil para todos os membros da instituição.
Rastreabilidade: O Sistema deve manter um histórico de atualizações informando quem realizou alterações, agendamentos e cancelamentos.
Otimização automática de rotas: O sistema deve automatizar as rotas dos carros, otimizando as distâncias e os tempos de percurso.
Gestão do estoque de insumos: O sistema deve possuir um gerenciador de estoque dos insumos utilizados pela cozinha para fazer os lanches.
Chatbot de comunicação: Integração para avisos automáticos de agendamentos e cancelamentos via whatsapp

MVP (Produto Mínimo Viável):
“MVP (Minimum Viable Product ou Produto Mínimo Viável) é a versão mais simples de um produto, contendo apenas funcionalidades essenciais para atender a uma necessidade e validar hipóteses com usuários reais gastando o mínimo de tempo e recursos.”

Módulo de autenticação: Login seguro com permissões diferenciadas.
Cadastros Básicos: Cadastro de pacientes (com informações como endereço, alergias, etc), cadastro de profissionais (com horários de trabalho) e frota de carros.
Agenda Compartilhada: Tela central onde a coordenação técnica vincula os pacientes aos atendimentos profissionais.
Lógica de conflito: O sistema deve impedir que o mesmo paciente ou profissional seja alocado em duas atividades no mesmo horário e dois ou mais pacientes com o mesmo profissional no mesmo horário em atividades individuais.
Lista da semana: Com base na agenda, o sistema deve gerar automaticamente uma lista das atividades semanais, mostradas em um calendário com informações simples de “Quem busca, em qual endereço e em qual horário”, “Os atendimentos serão realizados por quem e para quem” e “Quantos lanches preparar”

Fases futuras:
Otimização automática de rotas: No MVP o motorista vê apenas a lista e o endereço, a inteligência de qual caminho fazer fica para próxima fase
Chatbot integrado: MVP não possui integração com WhatsApp, adicionado sistema em fase futura.
Gestão complexa do estoque da cozinha: O sistema deveria ser atualizado pelos funcionários com frequência.
