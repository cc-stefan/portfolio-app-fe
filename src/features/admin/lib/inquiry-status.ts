import type { PortfolioDictionary } from '@/features/portfolio/i18n/types';
import type { InquiryStatus } from '../model/types';

export const inquiryStatusOrder: InquiryStatus[] = ['NEW', 'IN_REVIEW', 'RESOLVED', 'ARCHIVED'];

export function getInquiryBadgeVariant(status: InquiryStatus) {
  if (status === 'RESOLVED') {
    return 'success';
  }

  if (status === 'NEW') {
    return 'accent';
  }

  if (status === 'IN_REVIEW') {
    return 'warning';
  }

  if (status === 'ARCHIVED') {
    return 'outline';
  }

  return 'neutral';
}

export function formatInquiryStatus(status: InquiryStatus, copy: PortfolioDictionary['admin']) {
  if (status === 'NEW') {
    return copy.inquiryStatusNew;
  }

  if (status === 'IN_REVIEW') {
    return copy.inquiryStatusInReview;
  }

  if (status === 'RESOLVED') {
    return copy.inquiryStatusResolved;
  }

  return copy.inquiryStatusArchived;
}
