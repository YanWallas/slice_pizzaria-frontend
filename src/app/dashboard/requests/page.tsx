"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import styles from './styles.module.scss';
import { getCookieClient } from "@/lib/cookieClient";

export default function PedidoPage() {
  const searchParams = useSearchParams();
  const params = useParams();

  const number = searchParams.get("number");
  const order_id = params.id as string;

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const token = await getCookieClient();

        const response = await api.get("/order/detail", {
          params: { 
            order_id: Number(number)
          },
          headers:{
            Authorization: `Bearer ${token}`
          }
        });

        setOrder(response.data);
      } catch (err) {
        console.error("Erro ao buscar os dados do pedido:", err);
      }
    }

    fetchOrder();
  }, [order_id]);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Pedido da Mesa {number}</h1>

      {order ? (
        <div className={styles.infoBox}>
          <p><strong>ID do Pedido:</strong> {order_id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Responsável:</strong> {order.name || "N/A"}</p>
          {/* Mais detalhes aqui */}
        </div>
      ) : (
        <p>Carregando detalhes do pedido...</p>
      )}
    </main>
  );
}
