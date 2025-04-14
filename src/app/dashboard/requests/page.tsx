"use client";
import React, { useEffect } from "react";
import { useOrder } from "@/providers/order";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RequestsPage() {
  const { order, isOpen, onRequestClose } = useOrder();
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      toast.warning("Nenhuma mesa foi aberta.");
      router.push("/dashboard");
    }
  }, [isOpen, router]);

  const currentOrder = order[0]; // Pegamos o primeiro item
  const mesa = currentOrder?.order;

  if (!isOpen || !order || order.length === 0 || !mesa) {
    return <div>Carregando ...</div>;
  }

  return (
    <main>
      <h1>Pedidos da Mesa</h1>
      <div>
        <h3>Mesa #{mesa.table}</h3>
        <p>Responsável: {mesa.name || "Não especificado"}</p>
        <button onClick={onRequestClose}>Fechar Pedido</button>
      </div>
    </main>
  );
}
