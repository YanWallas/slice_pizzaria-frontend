"use client";

import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { use } from "react";
import { OrderContext } from "@/providers/order";
import { api } from "@/services/api";
import { getCookieClient } from "@/lib/cookieClient";
import { toast } from "sonner";
import { Trash2 } from 'lucide-react';
import { useRouter } from "next/navigation";

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
  const { orderOpen, onRequestClose } = use(OrderContext);
  const router = useRouter();

  const [category, setCategory] = useState<CategoryProps[] | []>([]);
  const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>();
  const [product, setProduct] = useState<productsProps[] | []>([]);
  const [productSelected, setProductSelected] = useState<productsProps | undefined>();
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
      setCategorySelected(response.data[0]);
    }
    loadCategory();
  }, []);

  useEffect(() => {
    async function loadProducts(){
      const token = await getCookieClient();    
      
      const response = await api.get('/category/product', {
        params:{
          category_id: categorySelected?.id
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setProduct(response.data);
      setProductSelected(response.data[0]);
    }
    loadProducts();
  }, [categorySelected]);

  async function handleAddItem(){
    if(!productSelected || !categorySelected){
      toast.error("Selecione um produto e uma categoria.");
      return;
    }

    if(amount < 1){
      toast.error("A quantidade deve ser maior que 0.");
      return;
    }

    if (!orderOpen.length) {
      toast.error("Nenhum pedido em aberto.");
      return;
    }    

    const token = await getCookieClient();

    try{
      const response = await api.post("/order/add", {
        order_id: orderOpen[0].id,
        product_id: productSelected.id,
        amount
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItems((prev) => [...prev, {
        id: response.data.id,
        product_id: productSelected.id,
        name: productSelected.name,
        amount: response.data.amount
      }]);
      setAmount(1);
    }catch(err){
      console.error("Erro ao adicionar item:", err);
      toast.error("Não foi possível adicionar o item. Tente novamente.");
    }
    
  }

  async function handleDeleteOrder(order_id: String) {
    const token = await getCookieClient();
  
    await api.delete("/order", {
      params: {
        order_id: String(order_id),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((err) => {
      toast.warning("Erro ao deletar pedido!!!");
      console.log(err);
      return;
    });
    toast.success("Pedido deletado com sucesso!");
    onRequestClose();
  }

  async function handleDeleteItem(item_id: String) {
    const token = await getCookieClient();

    try {
      await api.delete("/order/remove", {
        params: {
          item_id: String(item_id),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setItems((prev) => prev.filter(item => item.id !== item_id));
      toast.success("Item deletado com sucesso!");

    }catch(err) {
      console.error("Erro ao deletar item:", err);
      toast.error("Não foi possível deletar o item. Tente novamente.");
    }
  }

  async function handleFinishOrder(){
    const token = await getCookieClient();

    try{
      await api.put('/order/send', {
        order_id: orderOpen[0].id
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success("Pedido finalizado com sucesso!");
      onRequestClose();
      router.push("/dashboard");
    }catch(err){
      console.log("ERRO AO FINALIZAR, tente mais tarde")
    }
  }
  

  return (
    <dialog className={styles.dialogContainer}>
      <section className={styles.dialogContent}>
        <h2>Faça seu pedido!</h2>
        <span className={styles.info}>
          Mesa <b>{orderOpen[0].table}</b>

          {items.length == 0 && (
            <Trash2 
              size={24} 
              className={styles.buttonLi} 
              onClick={() => handleDeleteOrder(orderOpen[0].id)} 
            />
          )}
        </span>

        {orderOpen[0].name && (
          <span className={styles.info}>
            Nome do cliente: <b>{orderOpen[0].name}</b>
          </span>
        )}

        {category.length > 0 && (
          <>
            <span>Categoria</span>
            <select 
              className={styles.selectOptions}
              value={categorySelected?.id} 
              onChange={(e) => setCategorySelected(category.find(category => category.id === e.target.value))}
            >
            {category.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
        </select>
          </>
        )}

        {product.length > 0 &&(
          <>
            <span>Produto</span>
            <select 
              className={styles.selectOptions}
              value={productSelected?.id} 
              onChange={(e) => setProductSelected(product.find(product => product.id === e.target.value))}
            >
              {product.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </>
        )}

        <span>Quantidade</span>
        <input 
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min={1}
        />

        <section className={styles.containerButton}>
          <button className={styles.buttonAdd} onClick={handleAddItem}>
            Adicionar
          </button>
          
          
          <button className={styles.buttonFinish} onClick={handleFinishOrder} disabled={items.length === 0}>
            Finalizar pedido
          </button>
        </section>
     

        {items.length > 0 && (
          <div className={styles.selectItems}>
            <h3>Itens do pedido</h3>
            {items.map(item => (
              <span key={item.id} className={styles.item}>
                Qtd: {item.amount} - {item.name}
                <Trash2 
                  size={20} 
                  className={styles.buttonitem} 
                  onClick={() => handleDeleteItem(item.id)} 
                />
              </span>
            ))}
          </div>
        )}
      </section>
    </dialog>
  );
}