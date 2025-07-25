"use client";
import React, { useEffect, useState, use } from "react";
import { OrderContext } from "@/providers/order";
import styles from "./styles.module.scss";
import { Button } from "../components/button";
import { getCookieClient } from "@/lib/cookieClient";
import { api } from "@/services/api";
import { toast } from "sonner";
//import { RefreshCw, SquarePen } from "lucide-react";
import { ModalRequests } from "@/app/dashboard/requests/components/modalRequests";

interface Order{
  id: string;
  table: number;
  name?: string;
}

export default function Requests() {
  const { isOpen, requestOpen } = use(OrderContext);
  const [orders, setOrders] = useState<Order[]>([]);

  async function handleRequests(formData: FormData) {
    const table = formData.get("table");
    const client = formData.get("client");

    if (!table || isNaN(Number(table))) {
      toast.error("Número da mesa inválido!");
      return;
    }

    const data = {
      table: Number(table),
      name: String(client),
    };
    
    const token = await getCookieClient();

    try {
      const response = await api.post("/order", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Pedido criado com sucesso!");
      if (response && response.data) {
        await requestOpen({
          id: response.data.id,
          table: Number(table),
          name: String(client),
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("Erro ao criar pedido!");
    }
    
  }

  async function fetchOrders() {
    try {
      const token = await getCookieClient();

      const response = await api.get("/orders/open", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data);

    } catch (err) {
      console.log("Erro ao buscar pedidos", err);
    }
  }

  useEffect(() => {
    fetchOrders();
  },[]);

  // function handleRefresh() {
  //   fetchOrders();
  //   toast.success("Pedidos abertos atualizados com sucesso!");
  // }

  // async function handleDetailOrder(order_id: string){
  //   await 
  // }

  return (
    <>
      <main className={styles.container}>
        <h1>Digite o número da mesa para fazer o pedido.</h1>

        <form className={styles.form} action={handleRequests}>
        <input 
          type="number" 
          placeholder="Digite o numero da mesa."
          required
          name="table"
          className={styles.input}
        />

        <input 
          type="text"
          name="client"
          placeholder="Digite o nome do cliente.(opicional)"
          className={styles.input} 
        />

        
          <Button name='Fazer Pedido'/>
        </form>

        {/* <section className={styles.containerHeader}>
          <h2>Pedidos em aberto</h2>
          <button onClick={handleRefresh}>
            <RefreshCw size={24} color="#ff2038" />
          </button>
        </section> */}

        {/* {orders.length === 0 ? (
          <span className={styles.emptyItem}>
            Nenhum pedido em aberto no momento...
          </span>
        ) : (
          orders.map((order) => (
            <section key={order.id} className={styles.orderItem}>
              <div className={styles.orderInfo}>
                <span>Mesa: {order.table}</span>
                {order.name ? (
                  <span>Nome: {order.name}</span>
                ) : (
                  ""
                )}
              </div>

              <button className={styles.ButtonDeleteIcon}>
                <SquarePen
                  size={24}
                  onClick={() => {handleDetailOrder()}}
                />
                
              </button>
            </section>
          ))
        )} */}
      </main>

      {isOpen && <ModalRequests />}
    </>
  );
}
