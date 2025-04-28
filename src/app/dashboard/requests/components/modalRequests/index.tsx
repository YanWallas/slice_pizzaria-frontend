"use client";

import styles from "./styles.module.scss";
import { X } from "lucide-react";
import { use } from "react";
import { OrderContext } from "@/providers/order";


export function ModalRequests() {
  const { onRequestClose, orderOpen } = use(OrderContext);
  

  return (
    <dialog className={styles.dialogContainer}>
      <section className={styles.dialogContent}>
        <button className={styles.dialogBack} onClick={onRequestClose}>
          <X size={40} color="#9c3434"/>
        </button>
        <h2>Faça seu pedido!</h2>
        <span className={styles.table}>
          Mesa <b>{orderOpen[0].table}</b>
        </span>

        <span>Categoria</span>
        <input 
          type="text"
          name="category"
          placeholder="Digite a categoria do produto"
        />

        <span>Produto</span>
        <input 
          type="text"
          name="category"
          placeholder="Digite a categoria do produto"
        />

        <span>Quantidade</span>
        <input 
          type="number"
          name="amount"
          placeholder="Digite a quantidade do produto"
        />

        <button className={styles.buttonAdd}>
          Adicionar
        </button>
        
        <button className={styles.buttonFinish}>
          Finalizar pedido
        </button>

      </section>
    </dialog>
  );
}