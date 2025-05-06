"use client";

import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { X } from "lucide-react";
import { use } from "react";
import { OrderContext } from "@/providers/order";
import { api } from "@/services/api";
import { getCookieClient } from "@/lib/cookieClient";

type CategoryProps = {
  id: string;
  name: string;
}

type productsProps = {
  id: string;
  name: string;
}

type ItemProps ={
  id: string;
  product_id: string;
  name: string;
  amount: string | number;
}

export function ModalRequests() {
  const { onRequestClose, orderOpen } = use(OrderContext);

  const [category, setCategory] = useState<CategoryProps[] | []>([]);
  const [product, setProduct] = useState<productsProps[] | []>([]);
  const [amount, setAmount] = useState(1);
  const [items, setItems] = useState<ItemProps[]>([]);

  useEffect(() => {
    async function loadCategory(){
      const token = await getCookieClient();

      const response = await api.get(`/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategory(response.data);
    }
    loadCategory();
  }, []);
  

  return (
    <dialog className={styles.dialogContainer}>
      <section className={styles.dialogContent}>
        <button className={styles.dialogBack} onClick={onRequestClose}>
          <X size={40} color="#9c3434"/>
        </button>
        <h2>Faça seu pedido!</h2>
        <span className={styles.info}>
          
          Mesa <b>{orderOpen[0].table}</b>
        </span>

        {orderOpen[0].name && (
          <span className={styles.info}>
            Nome do cliente: <b>{orderOpen[0].name}</b>
          </span>
        )}

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

        <section className={styles.containerButton}>
          <button className={styles.buttonAdd}>
            Adicionar
          </button>
          
          <button className={styles.buttonFinish}>
            Finalizar pedido
          </button>
        </section>
        {category.map(item => {
          return (
            <section key={item.id} className={styles.category}>
              <h3>{item.name}</h3>
            </section>
          )
        })}
      </section>
    </dialog>
  );
}