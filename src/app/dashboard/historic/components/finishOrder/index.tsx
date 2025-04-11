"use client"
import styles from './styles.module.scss';

import { OrderProps } from '@/lib/order.type';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


interface Props{
  finishOrder: OrderProps[]
}

export default function FinishOrder({finishOrder}: Props){
  const router = useRouter();

  function handleRefresh(){
    router.refresh();
    toast.success("Historicos atualizados com sucesso!")
  }

  return(
    <>
      <main className={styles.container}>
        <section className={styles.containerHeader}>
          <h1>Histórico: Últimos pedidos</h1>
          <button onClick={handleRefresh}>
            <RefreshCw size={24} color='#ff2038'/>
          </button>
        </section>

        <section className={styles.listOrders}>
          {finishOrder.length === 0 && (
            <span className={styles.emptyItem}>
              Nenhum pedido finalizado no momento...
            </span>
          )}

          {finishOrder.map(order => (
            <div key={order.id} className={styles.orderItem}>
            <div className={styles.tag}></div>
            <span>Mesa: {order.table}</span>
            {order.name? (<span className={styles.name}>Nome: {order.name}</span>) : ''}
            </div>
          ))}
        </section>
      </main>
      
    </>
  )
}