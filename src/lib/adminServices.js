// This file would handle service data for admin purposes
// In a real application, this would connect to a database
// For this implementation, we'll use the existing servicesData as base

import { servicesData } from './servicesData';

// In a real application, you would use a database
// This is just for demonstration purposes
let adminServices = [...servicesData];

export const getServices = () => {
  return adminServices;
};

export const getServiceBySlug = (slug) => {
  return adminServices.find(service => service.slug === slug);
};

export const updateService = (slug, { definition, benefits }) => {
  const serviceIndex = adminServices.findIndex(service => service.slug === slug);
  
  if (serviceIndex === -1) {
    throw new Error('Service not found');
  }

  adminServices[serviceIndex] = {
    ...adminServices[serviceIndex],
    definition: definition,
    benefits: benefits
  };

  return adminServices[serviceIndex];
};