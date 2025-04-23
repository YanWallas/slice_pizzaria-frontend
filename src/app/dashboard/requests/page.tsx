"use client";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Button } from "../components/button";
import { getCookieClient } from "@/lib/cookieClient";
import { api } from "@/services/api";
import { toast } from "sonner";

interface Order{
  id: string;
  table: number;
  name?: string;
}

export default function Requests() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function handleRequests(formData: FormData) {
    const table = formData.get("table");
    const client = formData.get("client");

    if (table === "") return;

    const data = {
      table: Number(table),
      name: String(client),
    };
    
    const token = await getCookieClient();

    const response = await api.post("/order", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        console.log(err);
        return;
      });

    toast.success("Pedido criado com sucesso!");
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

  return (
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
        placeholder="Digite o nome do cliente."
        className={styles.input} 
      />

      
        <Button name='Fazer Pedido'/>
      </form>

      {orders.length === 0 && (
        <span className={styles.emptyItem}>
          Nenhum pedido em aberto no momento...
        </span>
      )}

      {orders.map((order) => (
        <button key={order.id} className={styles.orderItem}>
          <div className={styles.tag}></div>
          <span>Mesa: {order.table}</span>
          {order.name ? (
            <span className={styles.name}>Nome: {order.name}</span>
          ) : (
            ""
          )}
        </button>
      ))}
 
    </main>
  );
}
