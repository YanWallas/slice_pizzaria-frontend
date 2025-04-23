"use client";
import React from "react";
import styles from "./styles.module.scss";
import { Button } from "../components/button";
import { getCookieClient } from "@/lib/cookieClient";
import { api } from "@/services/api";
import { toast } from "sonner";

export default function Requests() {

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
      <h1>Pedidos não finalizados.</h1>
 
    </main>
  );
}
