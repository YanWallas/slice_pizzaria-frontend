"use client";

import styles from "../../../components/modal/styles.module.scss";
import { X } from "lucide-react";
import { use } from "react";
import { OrderContext } from "@/providers/order";


export function ModalRequests() {
  const { onRequestClose, finishOrder, order } = use(OrderContext);
  

  return (
    <dialog className={styles.dialogContainer}>
      <section className={styles.dialogContent}>
        <button className={styles.dialogBack} onClick={onRequestClose}>
          <X size={40} color="#9c3434"/>
        </button>
        <h2>Faça seu pedido!</h2>
        <span className={styles.table}>
          Mesa <b>{order[0].order.table}</b>
        </span>
        

      </section>
    </dialog>
  );
}