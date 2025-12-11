import { servicesData } from '@/lib/servicesData';

// In a real application, you would use a database
// This is just for demonstration purposes
let adminServices = [...servicesData];

export const GET = async (request, { params }) => {
  try {
    const { slug } = params;

    // Find the service
    const service = adminServices.find(service => service.slug === slug);
    
    if (!service) {
      return Response.json({ error: 'Service not found' }, { status: 404 });
    }

    return Response.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const PUT = async (request, { params }) => {
  try {
    const { slug } = params;
    const { definition, benefits } = await request.json();

    // Find the service to update
    const serviceIndex = adminServices.findIndex(service => service.slug === slug);
    
    if (serviceIndex === -1) {
      return Response.json({ error: 'Service not found' }, { status: 404 });
    }

    // Update the service data
    adminServices[serviceIndex] = {
      ...adminServices[serviceIndex],
      definition: definition,
      benefits: benefits
    };

    return Response.json({ 
      message: 'Service updated successfully', 
      service: adminServices[serviceIndex] 
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
};