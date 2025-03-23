// src/modules/email/infrastructure/SequelizeLeadRepository.ts
import { LeadRepository } from '../domain/LeadRepository';
import { Lead } from '../domain/Lead';
import { LeadModel } from './Lead.Model';

export class SequelizeLeadRepository implements LeadRepository {
  async create(lead: Lead): Promise<Lead> {
    const leadCreated = await LeadModel.create(lead as any);
    return leadCreated.get({ plain: true }) as Lead;
  }
}
