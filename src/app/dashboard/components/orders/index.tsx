"use client"
import styles from './styles.module.scss';
import { RefreshCw } from 'lucide-react';
import { OrderProps } from '@/lib/order.type';
import { Modaloarder } from '@/app/dashboard/components/modal';
import { useContext } from 'react'
import { OrderContext } from '@/providers/order';
import { useRouter } from 'next/navigation';
import { Button } from '../button';

interface Props{
  orders: OrderProps[]
}

export default function Orders({ orders }: Props){
  const { isOpen, onRequestOpren } = useContext(OrderContext)
  const router = useRouter();

  async function handleDetailOrder(order_id: string){
    await onRequestOpren(order_id)
  }

  function handleRefresh(){
    router.push("/dashboard/requests")
  }

  return(
    <>
      <form className={styles.container} action={handleRefresh}>
        <Button name='Fazer Pedido'/>
      </form>

      <main className={styles.container}>
        <section className={styles.containerHeader}>
          <h1>Pedidos em aberto</h1>
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
            {order.name? (<span className={styles.name}> Nome: {order.name}</span>) : ''}
            </button>
          ))}
        </section>
      </main>

      { isOpen && <Modaloarder/> }
    </>
  )
}
