import rawData from '../../../public/data/certifications.json';

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string; // 'YYYY-MM'
  category: 'cloud' | 'devops' | 'language' | 'platform' | 'degree' | 'course';
  credentialUrl?: string;
  /** Path under /public/certifications/ e.g. '/certifications/cert.pdf' */
  fileUrl?: string;
  badgeUrl?: string;
  featured?: boolean;
}

export const certifications: Certification[] = rawData as Certification[];
