import { robotFactory } from "./robot-factory.js";
import { learningEngine } from "./learning-engine.js";
import { deriveTaskSignature } from "@severino-learning/curated-context.js";
import { houseForDomain } from "./houses.js";
import { TaskRequest } from "../types.js";

export interface PostmanDecision {
  action: 'use-existing' | 'create-new';
  teamId: string;      // houseId (ex: casa-dev)
  robotId?: string;
  domain: string;      // domínio original da tarefa
  houseId: string;     // casa destino
  houseName: string;
  room?: string;       // quarto sugerido (role)
  roles?: string[];
  reason: string;
}

export class PostmanAgent {
  async route(objective: string, hints: { domain?: string; teamId?: string } = {}): Promise<PostmanDecision> {
    const domain = hints.domain || this.inferDomainFromObjective(objective);
    const taskSignature = deriveTaskSignature(objective);
    const house = houseForDomain(domain);
    const wantedRoom = this.inferRolesFromObjective(objective, domain)[0] || "generalist";

    // Override manual: respeita teamId explícito (legado), mas sugere a casa
    if (hints.teamId) {
      const team = robotFactory.getTeam(hints.teamId);
      if (!team) {
        return {
          action: 'create-new',
          teamId: hints.teamId,
          houseId: house.houseId,
          houseName: house.name,
          room: wantedRoom,
          domain,
          roles: this.inferRolesFromObjective(objective, domain),
          reason: `Equipe '${hints.teamId}' não encontrada — Carteiro sugere a ${house.name}.`
        };
      }
      const robots = team.robotIds.map(id => robotFactory.getRobot(id)).filter(Boolean);
      const idleRobots = robots.filter(r => r && r.status === 'idle');
      // Prefere morador do quarto certo
      const roomMatch = idleRobots.find(r => r!.role === wantedRoom);
      const chosen = roomMatch || idleRobots[0];
      if (chosen) {
        return {
          action: 'use-existing',
          teamId: hints.teamId,
          robotId: chosen!.robotId,
          houseId: house.houseId,
          houseName: house.name,
          room: chosen!.role,
          domain,
          reason: `Entrega manual em '${hints.teamId}' — quarto '${chosen!.role}' (${chosen!.robotId}) atendeu.`
        };
      }
      return {
        action: 'create-new',
        teamId: hints.teamId,
        houseId: house.houseId,
        houseName: house.name,
        room: wantedRoom,
        domain,
        roles: this.inferRolesFromObjective(objective, domain),
        reason: `Casa '${hints.teamId}' lotada — abrindo novo quarto '${wantedRoom}'.`
      };
    }

    // Fluxo padrão: Carteiro entrega na CASA do domínio
    const team = robotFactory.getTeam(house.houseId);
    if (team) {
      const robots = team.robotIds.map(id => robotFactory.getRobot(id)).filter(Boolean);
      const idleRobots = robots.filter(r => r && r.status === 'idle');
      // 1) quarto exato 2) qualquer morador ocioso da casa
      const roomMatch = idleRobots.find(r => r!.role === wantedRoom);
      const chosen = roomMatch || idleRobots[0];
      if (chosen) {
        const via = roomMatch ? `quarto '${wantedRoom}'` : `quarto '${chosen!.role}' (cobertura)`;
        return {
          action: 'use-existing',
          teamId: house.houseId,
          robotId: chosen!.robotId,
          houseId: house.houseId,
          houseName: house.name,
          room: chosen!.role,
          domain,
          reason: `📬 Carteiro entregou na ${house.name} — ${via}, morador ${chosen!.robotId} atendeu.`
        };
      }
      // Casa existe mas lotada: Tech Lead abre novo quarto
      return {
        action: 'create-new',
        teamId: house.houseId,
        houseId: house.houseId,
        houseName: house.name,
        room: wantedRoom,
        domain,
        roles: [wantedRoom],
        reason: `📬 Carteiro entregou na ${house.name}, mas todos os quartos ocupados — Tech Lead abrindo quarto '${wantedRoom}'.`
      };
    }

    // Casa ainda não fundada: Severino constrói a casa pré-fabricada
    return {
      action: 'create-new',
      teamId: house.houseId,
      houseId: house.houseId,
      houseName: house.name,
      room: wantedRoom,
      domain,
      roles: house.rooms,
      reason: `📬 Nenhuma casa para '${domain}' — Severino fundou a ${house.name} com quartos [${house.rooms.join(', ')}].`
    };
  }

  private inferDomainFromObjective(objective: string): string {
    const lowerObj = objective.toLowerCase();
    
    // Simple keyword mapping - could be enhanced with ML
    if (lowerObj.includes('frontend') || lowerObj.includes('ui') || lowerObj.includes('react') || 
        lowerObj.includes('vue') || lowerObj.includes('angular') || lowerObj.includes('svelte') ||
        lowerObj.includes('css') || lowerObj.includes('html') || lowerObj.includes('tailwind')) {
      return 'frontend';
    }
    
    if (lowerObj.includes('backend') || lowerObj.includes('api') || lowerObj.includes('server') || 
        lowerObj.includes('endpoint') || lowerObj.includes('rest') || lowerObj.includes('graphql') ||
        lowerObj.includes('database') || lowerObj.includes('sql') || lowerObj.includes('nosql') ||
        lowerObj.includes('postgres') || lowerObj.includes('mysql') || lowerObj.includes('mongodb')) {
      return 'backend';
    }
    
    if (lowerObj.includes('test') || lowerObj.includes('qa') || lowerObj.includes('testing') || 
        lowerObj.includes('jest') || lowerObj.includes('vitest') || lowerObj.includes('cypress') ||
        lowerObj.includes('playwright') || lowerObj.includes('unit test') || lowerObj.includes('e2e')) {
      return 'qa';
    }
    
    if (lowerObj.includes('devops') || lowerObj.includes('docker') || lowerObj.includes('kubernetes') || 
        lowerObj.includes('k8s') || lowerObj.includes('ci/cd') || lowerObj.includes('jenkins') ||
        lowerObj.includes('github actions') || lowerObj.includes('terraform') || lowerObj.includes('aws') ||
        lowerObj.includes('azure') || lowerObj.includes('gcp') || lowerObj.includes('linux') ||
        lowerObj.includes('bash') || lowerObj.includes('script')) {
      return 'devops';
    }
    
    if (lowerObj.includes('security') || lowerObj.includes('sec') || lowerObj.includes('auth') || 
        lowerObj.includes('encryption') || lowerObj.includes('cipher') || lowerObj.includes('vulnerability') ||
        lowerObj.includes('penetration') || lowerObj.includes('firewall') || lowerObj.includes('owasp')) {
      return 'security';
    }
    
    if (lowerObj.includes('data') || lowerObj.includes('analytics') || lowerObj.includes('etl') || 
        lowerObj.includes('pipeline') || lowerObj.includes('spark') || lowerObj.includes('hadoop') ||
        lowerObj.includes('kafka') || lowerObj.includes('elasticsearch') || lowerObj.includes('elasticsearch')) {
      return 'data';
    }
    
    if (lowerObj.includes('research') || lowerObj.includes('study') || lowerObj.includes('investigate') || 
        lowerObj.includes('analyze') || lowerObj.includes('survey') || lowerObj.includes('experiment')) {
      return 'research';
    }
    
    if (lowerObj.includes('sales') || lowerObj.includes('crm') || lowerObj.includes('lead') || 
        lowerObj.includes('pipeline') || lowerObj.includes('hubspot') || lowerObj.includes('salesforce')) {
      return 'sales';
    }
    
    if (lowerObj.includes('product') || lowerObj.includes('pm') || lowerObj.includes('product manager') || 
        lowerObj.includes('roadmap') || lowerObj.includes('feature') || lowerObj.includes('specification')) {
      return 'product';
    }
    
    // Default fallback
    return 'backend';
  }

  private inferRolesFromObjective(objective: string, domain: string): string[] {
    const lowerObj = objective.toLowerCase();
    const roles: string[] = [];
    
    // Domain-specific role inference
    switch (domain) {
      case 'backend':
        if (lowerObj.includes('api') || lowerObj.includes('endpoint')) roles.push('backend-developer');
        if (lowerObj.includes('database') || lowerObj.includes('sql')) roles.push('database-engineer');
        if (lowerObj.includes('auth') || lowerObj.includes('authentication')) roles.push('security-specialist');
        if (lowerObj.includes('websocket') || lowerObj.includes('realtime')) roles.push('realtime-engineer');
        if (roles.length === 0) roles.push('backend-developer');
        break;
        
      case 'frontend':
        if (lowerObj.includes('ui') || lowerObj.includes('ux')) roles.push('frontend-developer');
        if (lowerObj.includes('react')) roles.push('react-developer');
        if (lowerObj.includes('vue')) roles.push('vue-developer');
        if (lowerObj.includes('css') || lowerObj.includes('styling')) roles.push('ui-designer');
        if (lowerObj.includes('animation')) roles.push('frontend-animator');
        if (roles.length === 0) roles.push('frontend-developer');
        break;
        
      case 'qa':
        if (lowerObj.includes('automated') || lowerObj.includes('automation')) roles.push('test-automation-engineer');
        if (lowerObj.includes('performance') || lowerObj.includes('load test')) roles.push('performance-test-engineer');
        if (lowerObj.includes('security test') || lowerObj.includes('penetration test')) roles.push('security-test-engineer');
        if (roles.length === 0) roles.push('qa-engineer');
        break;
        
      case 'devops':
        if (lowerObj.includes('docker') || lowerObj.includes('container')) roles.push('docker-specialist');
        if (lowerObj.includes('kubernetes') || lowerObj.includes('k8s')) roles.push('kubernetes-admin');
        if (lowerObj.includes('ci/cd') || lowerObj.includes('pipeline')) roles.push('devops-engineer');
        if (lowerObj.includes('terraform') || lowerObj.includes('iac')) roles.push('terraform-engineer');
        if (roles.length === 0) roles.push('devops-engineer');
        break;
        
      case 'security':
        if (lowerObj.includes('audit') || lowerObj.includes('compliance')) roles.push('compliance-auditor');
        if (lowerObj.includes('penetration') || lowerObj.includes('pentest')) roles.push('penetration-tester');
        if (lowerObj.includes('crypto') || lowerObj.includes('cryptography')) roles.push('cryptography-engineer');
        if (roles.length === 0) roles.push('security-engineer');
        break;
        
      default:
        // Generic roles based on objective keywords
        if (lowerObj.includes('lead') || lowerObj.includes('manager') || lowerObj.includes('architect')) 
          roles.push('tech-lead');
        else if (lowerObj.includes('research') || lowerObj.includes('investigate')) 
          roles.push('researcher');
        else 
          roles.push('generalist');
        break;
    }
    
    // Ensure we have at least one role
    if (roles.length === 0) roles.push('generalist');
    
    return roles;
  }
}

export const postman = new PostmanAgent();