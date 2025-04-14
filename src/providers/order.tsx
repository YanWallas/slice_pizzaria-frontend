"use client"

import { createContext, useContext, ReactNode, useState} from "react"
import { api } from "@/services/api";
import { getCookieClient } from "@/lib/cookieClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface OrderItemProps{
  id: string;
  amount: number;
  created_at: string;
  order_id: string;
  product_id: string;
  product:{
    id: string;
    name: string;
    price: string;
    description: string;
    banner: string;
    category_id: string;
  };
  order:{
    id: string;
    table:number;
    name: string | null;
    draft: boolean;
    status: boolean;
  }
}

type OrderContextData = {
  isOpen: boolean;
  onRequestOpren: (order_id: string) => Promise<void>;
  onRequestClose: () => void;
  order: OrderItemProps[];
  finishOrder: (order_id: string) => Promise<void>;
}

type OrderProviderProps = {
  children: ReactNode;
}

export const OrderContext = createContext({} as OrderContextData)

export function OrderProvider({ children }: OrderProviderProps){
  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState<OrderItemProps[]>([])
  const router = useRouter();

  async function onRequestOpren(order_id: string){
    //console.log(order_id);

    const token = await getCookieClient();

    const response = await api.get("order/detail", {
      headers:{
        Authorization: `Bearer ${token}`
      },
      params:{
        order_id: order_id
      }
    })

    setOrder(response.data);
    setIsOpen(true);
  }

  function onRequestClose(){
    setIsOpen(false);
  }

  async function finishOrder(order_id: string){
    const token = await getCookieClient();

    const data = {
      order_id: order_id,
    }

    try{
      await api.put("/order/finish", data, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
    }catch(err){
      console.log(err);
      toast.error("Falha ao finalizar esse pedido!")
      return;
    }

    toast.success("Pedido finalizado com sucesso!")
    setIsOpen(false);
    router.refresh();
  }

  return(
    <OrderContext.Provider
      value={{
        isOpen,
        onRequestOpren,
        onRequestClose,
        finishOrder,
        order
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

// Exporte o hook useOrder
export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder deve ser usado dentro de um OrderProvider");
  }
  return context;
}