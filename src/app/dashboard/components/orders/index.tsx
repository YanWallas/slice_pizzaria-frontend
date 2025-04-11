"use client"
import styles from './styles.module.scss';
import { RefreshCw } from 'lucide-react';
import { OrderProps } from '@/lib/order.type';
import { Modaloarder } from '@/app/dashboard/components/modal';
import { use } from 'react'
import { OrderContext } from '@/providers/order';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/app/dashboard/components/button/';

interface Props{
  orders: OrderProps[]
}

export default function Orders({ orders }: Props){
  const { isOpen, onRequestOpren } = use(OrderContext)
  const router = useRouter();

  async function handleDetailOrder(order_id: string){
    await onRequestOpren(order_id)
  }

  function handleRefresh(){
    router.refresh();
    toast.success("Pedidos atualizados com sucesso!")
  }

  function handleOpenOrder(formData: FormData){
    const numMesaRaw = formData.get("numMesa");

    // Verifica se o valor existe
    if (!numMesaRaw) {
      console.error("Número da mesa não informado.");
      return;
    }
    // Converte para número
    const numMesa = Number(numMesaRaw);
  
    // Verifica se é um número válido e positivo
    if (isNaN(numMesa) || numMesa < 1) {
      console.error("Número da mesa inválido. Deve ser um número positivo.");
      return;
    }
  
    // Aqui você pode seguir com o número válido
    alert(`Número da mesa válido: ${numMesa}`);
  }

  return(
    <>
      
        <section className={styles.container}>
          <h1 className={styles.h1}>Novo Pedido</h1>

          <form className={styles.form} action={handleOpenOrder}>
            <input 
              type="number"
              name='numMesa'
              min='1'
              placeholder='número da Mesa'
              required
              className={styles.inputOpen}
            />

            <Button name="Abrir Mesa"/>
          </form>
        </section>

      <main className={styles.container}>

        <section className={styles.containerHeader}>
          <h1>Últimos pedidos</h1>
          <button onClick={handleRefresh}>
            <RefreshCw size={24} color='#3fffa3'/>
          </button>
        </section>

        <section className={styles.listOrders}>
          {orders.length === 0 && (
            <span className={styles.emptyItem}>
              Nenhum pedido aberto no momento...
            </span>
          )}

          {orders.map(order => (
            <button key={order.id} className={styles.orderItem} onClick={() => handleDetailOrder(order.id)}>
            <div className={styles.tag}></div>
            <span>Mesa {order.table}</span>
            </button>
          ))}
        </section>
      </main>

      { isOpen && <Modaloarder/> }
    </>
  )
}
