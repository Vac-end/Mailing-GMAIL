import { Lead } from './Lead';

export interface LeadRepository {
  create(lead: Lead): Promise<Lead>;
}
