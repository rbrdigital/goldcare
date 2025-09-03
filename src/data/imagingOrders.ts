// Imaging orders dataset - imported from goldcare_imaging_orders_master.json
import imagingOrdersData from '../../goldcare_imaging_orders_master.json';

export interface ImagingOrderData {
  OrderID: string;
  OrderName: string;
  Category: string;
  Subcategory: string;
  Modality: string;
  Contrast: string;
  BodyPart: string;
  Laterality: string;
  PriorityDefault: string;
  CodingSystem: string;
  Code: string;
  Keywords: string;
}

// Type the imported data
export const IMAGING_ORDERS_DATA = imagingOrdersData as ImagingOrderData[];

// Extract unique categories from the dataset
export const IMAGING_CATEGORIES = Array.from(
  new Set(IMAGING_ORDERS_DATA.map(order => order.Category))
).sort();

// Extract unique subcategories for grouping
export const getSubcategoriesForCategory = (category: string): string[] => {
  return Array.from(
    new Set(
      IMAGING_ORDERS_DATA
        .filter(order => order.Category === category)
        .map(order => order.Subcategory)
    )
  ).sort();
};

// Get orders by category
export const getOrdersByCategory = (category: string): ImagingOrderData[] => {
  return IMAGING_ORDERS_DATA.filter(order => order.Category === category);
};

// Get orders by category and subcategory
export const getOrdersByCategoryAndSubcategory = (
  category: string, 
  subcategory: string
): ImagingOrderData[] => {
  return IMAGING_ORDERS_DATA.filter(
    order => order.Category === category && order.Subcategory === subcategory
  );
};

// Get most common orders for a category (first 15)
export const getMostCommonOrders = (category: string): ImagingOrderData[] => {
  return getOrdersByCategory(category).slice(0, 15);
};

// Search orders by name and keywords
export const searchOrders = (query: string, category?: string): ImagingOrderData[] => {
  const searchTerm = query.toLowerCase();
  
  let ordersToSearch = category ? getOrdersByCategory(category) : IMAGING_ORDERS_DATA;
  
  return ordersToSearch.filter(order =>
    order.OrderName.toLowerCase().includes(searchTerm) ||
    order.Keywords.toLowerCase().includes(searchTerm)
  );
};

// Format order display name (OrderName + Modality + Contrast + Laterality)
export const formatOrderDisplayName = (order: ImagingOrderData): string => {
  const parts = [order.OrderName];
  
  if (order.Contrast && order.Contrast !== 'N/A') {
    parts.push(`(${order.Contrast})`);
  }
  
  if (order.Laterality) {
    parts.push(`- ${order.Laterality}`);
  }
  
  return parts.join(' ');
};