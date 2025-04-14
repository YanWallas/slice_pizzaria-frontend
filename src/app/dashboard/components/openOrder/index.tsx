"use client"
import React, { useState } from "react";
import styles from '../orders/styles.module.scss';
import { Button } from '@/app/dashboard/components/button/';
import { api } from "@/services/api";
import { getCookieClient } from "@/lib/cookieClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useOrder } from "@/providers/order"

export default function OpenOrder(){
  const router = useRouter();
  const { onRequestOpren } = useOrder();

  const [numMesa, setNumMesa] = useState("");
  const [nomeMesa, setNomeMesa] = useState('');

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();

    const numero = Number(numMesa);
    // Verifica se o valor existe
    if (isNaN(numero) || numero < 1) {
      console.error("Número da mesa invalido!");
      return;
    }

    try{
      const token = await getCookieClient();

      const response = await api.post('/order', {
        table: numero,
        name: nomeMesa,
      }, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });

    const orderId = response.data.id;

    await onRequestOpren(orderId);

    router.push(`/dashboard/requests/`)

    }catch(err){
      console.log(err);
      toast.warning("Falha ao Abrir a Mesa!")
      return;
    }

  }

  return (
    <>
      <main>
        <section className={styles.container}>
          <h1 className={styles.h1}>Novo Pedido</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input 
              type="number"
              name='numMesa'
              min='1'
              placeholder='número da Mesa'
              required
              value={numMesa}
              onChange={(e) => setNumMesa(e.target.value)}
              className={styles.inputOpen}
            />

            <input 
              type='text'
              name='nomeMesa'
              placeholder='Nome do responsável da mesa'
              value={nomeMesa}
              onChange={(e) => setNomeMesa(e.target.value)}
              className={styles.inputOpen}
            />

            <Button name="Abrir Mesa"/>
          </form>
        </section>
      </main>
    </>
  )
}