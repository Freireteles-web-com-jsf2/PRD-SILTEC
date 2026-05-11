#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para traduzir descrições de skills GSD para português brasileiro
"""

import os
import re
from pathlib import Path

# Mapeamento de traduções para os comandos GSD
TRANSLATIONS = {
    "gsd-add-tests": "Gerar testes para uma fase concluida com base em critérios UAT e implementação",
    "gsd-ai-integration-phase": "Gerar um contrato de design AI-SPEC.md para fases que envolvem construção de sistemas de IA",
    "gsd-audit-fix": "Pipeline autônomo de auditoria para correção — encontrar problemas, classificar, corrigir, testar, commitar",
    "gsd-audit-milestone": "Auditar conclusão de milestone contra a intenção original antes de arquivar",
    "gsd-audit-uat": "Auditoria cruzada de todas as pendências UAT e itens de verificação",
    "gsd-autonomous": "Executar todas as fases restantes de forma autônoma — discuss→plan→execute por fase",
    "gsd-capture": "Capturar ideias, tarefas, notas e sementes para seus destinos",
    "gsd-cleanup": "Arquivar diretórios de fase acumulados de milestones concluídos",
    "gsd-code-review": "Revisar arquivos fonte alterados durante uma fase para bugs, problemas de segurança e qualidade de código",
    "gsd-complete-milestone": "Arquivar milestone concluído e preparar para a próxima versão",
    "gsd-config": "Configurar configurações GSD — alternâncias de workflow, controles avançados, integrações e perfil de modelo",
    "gsd-debug": "Depuração sistemática com estado persistente através de resets de contexto",
    "gsd-discuss-phase": "Reunir contexto de fase através de questionamento adaptativo antes do planejamento",
    "gsd-docs-update": "Gerar ou atualizar documentação de projeto verificada contra a codebase",
    "gsd-eval-review": "Auditar cobertura de avaliação de uma fase de IA executada e produzir plano de remediação EVAL-REVIEW.md",
    "gsd-execute-phase": "Executar todos os planos em uma fase com paralelização baseada em ondas",
    "gsd-explore": "Ideação socrática e roteamento de ideias — pensar através de ideias antes de comprometer com planos",
    "gsd-extract-learnings": "Extrair decisões, lições, padrões e surpresas de artefatos de fase concluídos",
    "gsd-fast": "Executar uma tarefa trivial inline — sem subagentes, sem sobrecarga de planejamento",
    "gsd-forensics": "Investigação post-mortem para workflows GSD falhados — diagnosticar o que deu errado",
    "gsd-graphify": "Construir, consultar e inspecionar o grafo de conhecimento do projeto em .planning/graphs/",
    "gsd-health": "Diagnosticar saúde do diretório de planejamento e opcionalmente reparar problemas",
    "gsd-help": "Mostrar comandos GSD disponíveis e guia de uso",
    "gsd-import": "Ingerir planos externos com detecção de conflito contra decisões de projeto antes de escrever qualquer coisa",
    "gsd-inbox": "Triar e revisar issues e PRs abertos do GitHub contra templates de projeto e diretrizes de contribuição",
    "gsd-ingest-docs": "Inicializar ou mesclar uma configuração .planning/ de ADRs, PRDs, SPECs e docs existentes em um repo",
    "gsd-manager": "Centro de comando interativo para gerenciar múltiplas fases de um terminal",
    "gsd-map-codebase": "Analisar codebase com agentes mappers paralelos para produzir documentos .planning/codebase/",
    "gsd-milestone-summary": "Gerar um resumo de projeto abrangente de artefatos de milestone para onboarding e revisão da equipe",
    "gsd-mvp-phase": "Planejar uma fase como fatia MVP vertical — user story, divisão SPIDR, então plan-phase",
    "gsd-new-milestone": "Iniciar um novo ciclo de milestone — atualizar PROJECT.md e rotear para requisitos",
    "gsd-new-project": "Inicializar um novo projeto com coleta de contexto profundo e PROJECT.md",
    "gsd-ns-context": "inteligência de codebase | map graphify docs learnings",
    "gsd-ns-ideate": "exploração capture | explore sketch spike spec capture",
    "gsd-ns-manage": "config workspace | workstreams thread update ship inbox",
    "gsd-ns-project": "ciclo de vida do projeto | milestones audits summary",
    "gsd-ns-review": "portas de qualidade | code review debug audit security eval ui",
    "gsd-ns-workflow": "workflow | discuss plan execute verify phase progress",
    "gsd-pause-work": "Criar handoff de contexto ao pausar trabalho no meio de uma fase",
    "gsd-phase": "CRUD para fases em ROADMAP.md — adicionar, inserir, remover ou editar fases",
    "gsd-plan-phase": "Criar plano de fase detalhado (PLAN.md) com loop de verificação",
    "gsd-plan-review-convergence": "Loop de convergência de plano cross-AI — replanejar com feedback de revisão até que nenhuma preocupação ALTA permaneça",
    "gsd-pr-branch": "Criar um branch de PR limpo filtrando commits .planning/ — pronto para code review",
    "gsd-profile-user": "Gerar perfil comportamental de desenvolvedor e criar artefatos descobríveis pelo Claude",
    "gsd-progress": "Verificar progresso, avançar workflow ou despachar intenção livre — o comando situacional unificado GSD",
    "gsd-quick": "Executar uma tarefa rápida com garantias GSD (commits atômicos, rastreamento de estado) mas pular agentes opcionais",
    "gsd-resume-work": "Retomar trabalho de sessão anterior com restauração completa de contexto",
    "gsd-review": "Solicitar revisão cross-AI peer de planos de fase de CLIs AI externos",
    "gsd-review-backlog": "Revisar e promover itens de backlog para milestone ativo",
    "gsd-secure-phase": "Auditar e fortalecer segurança de uma fase implementada",
    "gsd-settings": "Gerenciar configurações do GSD",
    "gsd-ship": "Preparar e entregar uma fase ou milestone",
    "gsd-sketch": "Criar esboços rápidos e protótipos",
    "gsd-spec-phase": "Criar especificações técnicas detalhadas",
    "gsd-spike": "Investigar e validar hipóteses técnicas",
    "gsd-stats": "Mostrar estatísticas do projeto",
    "gsd-thread": "Gerenciar threads de discussão",
    "gsd-ui-phase": "Planejar e implementar interfaces de usuário",
    "gsd-ui-review": "Auditar interfaces de usuário implementadas",
    "gsd-ultraplan-phase": "Criar planos ultra detalhados",
    "gsd-undo": "Desfazer alterações recentes",
    "gsd-update": "Atualizar artefatos do projeto",
    "gsd-validate-phase": "Validar implementação de uma fase",
    "gsd-verify-work": "Verificar trabalho concluído",
    "gsd-workspace": "Gerenciar workspace do projeto",
    "gsd-workstreams": "Gerenciar fluxos de trabalho",
}


def translate_skill_file(skill_path):
    """Traduz a descrição de um arquivo SKILL.md"""
    skill_name = skill_path.name
    skill_file = skill_path / "SKILL.md"

    if not skill_file.exists():
        # Usar apenas ASCII para evitar problemas de encoding
        print("[AVISO] Arquivo SKILL.md nao encontrado em {}".format(skill_path))
        return False

    # Ler o arquivo
    with open(skill_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Traduzir
    if skill_name in TRANSLATIONS:
        new_desc = TRANSLATIONS[skill_name]
        # Substituir a descrição
        new_content = re.sub(
            r'description:\s*"[^"]+"',
            'description: "{}"'.format(new_desc),
            content
        )

        # Escrever de volta em UTF-8
        with open(skill_file, 'w', encoding='utf-8') as f:
            f.write(new_content)

        # Usar apenas ASCII para imprimir
        print("[OK] {}: {}".format(skill_name, new_desc.encode('ascii', 'replace').decode('ascii')))
        return True
    else:
        print("[AVISO] Tradução nao encontrada para {}".format(skill_name))
        return False


def main():
    """Função principal"""
    skills_dir = Path.home() / ".claude" / "skills"

    if not skills_dir.exists():
        print("[ERRO] Diretorio de skills nao encontrado: {}".format(skills_dir))
        return

    print("[INFO] Diretorio de skills: {}".format(skills_dir))

    # Encontrar todos os diretórios gsd-*
    gsd_skills = sorted([d for d in skills_dir.iterdir() if d.is_dir() and d.name.startswith("gsd-")])

    print("[INFO] Encontrados {} skills GSD\n".format(len(gsd_skills)))

    # Traduzir cada skill
    translated = 0
    for skill_path in gsd_skills:
        if translate_skill_file(skill_path):
            translated += 1

    print("\n[OK] Concluido! {} de {} skills traduzidas.".format(translated, len(gsd_skills)))


if __name__ == "__main__":
    main()
