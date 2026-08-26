import { useSelectedShop } from '../context/SelectedShopContext';

export function useWhatsApp() {
  const { selectedShop } = useSelectedShop();

  const getWhatsAppUrl = (message: string, customPhone?: string) => {
    const rawNumber = customPhone || selectedShop?.whatsapp || '919862512340';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  };

  const getProductWhatsAppUrl = (productName: string, price: number, productUrl?: string) => {
    const fullUrl = productUrl || window.location.href;
    const msg = `Hi, I want to buy: ${productName} (Rs. ${price}) — ${fullUrl}`;
    return getWhatsAppUrl(msg);
  };

  const getSchoolWhatsAppUrl = (schoolName: string) => {
    const msg = `Hi, I need help finding books for ${schoolName}`;
    return getWhatsAppUrl(msg);
  };

  const getCartWhatsAppUrl = (itemsListStr: string) => {
    const msg = `Hi, I want to place this order:\n${itemsListStr}`;
    return getWhatsAppUrl(msg);
  };

  const getOrderWhatsAppUrl = (orderId: string) => {
    const msg = `Hi, I want to track my order ${orderId}`;
    return getWhatsAppUrl(msg);
  };

  const getGeneralQueryUrl = () => {
    return getWhatsAppUrl('Hi, I have a query about SSG');
  };

  return {
    getWhatsAppUrl,
    getProductWhatsAppUrl,
    getSchoolWhatsAppUrl,
    getCartWhatsAppUrl,
    getOrderWhatsAppUrl,
    getOrderTrackingWhatsAppUrl: getOrderWhatsAppUrl,
    getGeneralQueryUrl,
    phone: selectedShop?.phone || '+91 98625 12340',
  };
}
