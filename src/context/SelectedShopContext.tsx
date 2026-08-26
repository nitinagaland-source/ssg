import React, { createContext, useContext, useState, useEffect } from 'react';
import { Shop } from '../types';
import { fetchShops, fetchShopById } from '../api/shops';

interface SelectedShopContextType {
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop) => void;
  isLoadingShop: boolean;
  isShopModalOpen: boolean;
  setIsShopModalOpen: (open: boolean) => void;
  availableShops: Shop[];
}

const SelectedShopContext = createContext<SelectedShopContextType | undefined>(undefined);

const SHOP_STORAGE_KEY = 'ssg_selected_shop';

export const SelectedShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedShop, setSelectedShopState] = useState<Shop | null>(null);
  const [availableShops, setAvailableShops] = useState<Shop[]>([]);
  const [isLoadingShop, setIsLoadingShop] = useState(true);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);

  useEffect(() => {
    async function initShop() {
      try {
        const shops = await fetchShops();
        setAvailableShops(shops);

        const savedShopId = localStorage.getItem(SHOP_STORAGE_KEY);
        if (savedShopId) {
          const matched = shops.find((s) => s.id === savedShopId || s.slug === savedShopId);
          if (matched) {
            setSelectedShopState(matched);
          } else {
            const fetched = await fetchShopById(savedShopId);
            if (fetched) {
              setSelectedShopState(fetched);
            } else if (shops.length > 0) {
              setSelectedShopState(shops[0]);
              localStorage.setItem(SHOP_STORAGE_KEY, shops[0].id);
            }
          }
        } else if (shops.length > 0) {
          setSelectedShopState(shops[0]);
          localStorage.setItem(SHOP_STORAGE_KEY, shops[0].id);
        }
      } catch (err) {
        console.error('Error loading shops', err);
      } finally {
        setIsLoadingShop(false);
      }
    }

    initShop();
  }, []);

  const setSelectedShop = (shop: Shop) => {
    setSelectedShopState(shop);
    localStorage.setItem(SHOP_STORAGE_KEY, shop.id);
  };

  return (
    <SelectedShopContext.Provider
      value={{
        selectedShop,
        setSelectedShop,
        isLoadingShop,
        isShopModalOpen,
        setIsShopModalOpen,
        availableShops,
      }}
    >
      {children}
    </SelectedShopContext.Provider>
  );
};

export function useSelectedShop() {
  const context = useContext(SelectedShopContext);
  if (!context) {
    throw new Error('useSelectedShop must be used within a SelectedShopProvider');
  }
  return context;
}
