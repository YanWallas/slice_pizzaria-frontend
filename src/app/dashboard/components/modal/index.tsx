"use client"
import styles from './styles.module.scss';
import { X } from 'lucide-react'
import { use } from 'react'
import { OrderContext } from '@/providers/order';
import { calculateTotalOrder } from '@/lib/helper';

export function Modaloarder(){
  const { onRequestClose, finishOrder, order } = use(OrderContext);

  async function handleFinishOrder(){
    await finishOrder(order[0].order.id)

  }

  return(
    <dialog className={styles.dialogContainer}>
      <section className={styles.dialogContent}>
        <button className={styles.dialogBack} onClick={onRequestClose}>
          <X size={40} color="#9c3434"/>
        </button>

        <article className={styles.container}>
          <h2>Detalhes do Pedido</h2>

          <div className={styles.tableName}>
            <span className={styles.table}>
              Mesa <b>{order[0].order.table}</b>
            </span>

            {order[0].order?.name && (
              <span className={styles.name}>
              Nome <b>{order[0].order.name}</b>
            </span>
            )}
          </div>

          {order.map(item => (
            <section className={styles.item} key={item.id}>
              <span>
                Qtd: {item.amount} - <b>{item.product.name}</b> - R$ {parseFloat(item.product.price)*item.amount}
                <img src={item.product.banner} width={40} height={40}/><br />
                <span className={styles.description}>{item.product.description}</span>
              </span>
            </section>
          ))}

          <h3 className={styles.total}>Valor Total: <span className={styles.totalcor}>R$ {calculateTotalOrder(order)}</span></h3>

          <button className={styles.buttonOrder} onClick={handleFinishOrder}>
            Concluir pedido
          </button>
        </article>
      </section>
    </dialog>
  )
}