import styles from './styles.module.scss';
import { api } from '@/services/api';
import { getCookieServer } from '@/lib/cookieServer';
import { OrderProps } from '@/lib/order.type';
import FinishOrder from './components/finishOrder';

async function getOrderFinish(): Promise<OrderProps[] | []>{
  try{
    const token = await getCookieServer();

    const response = await api.get("/order/finish", {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

    return response.data || []

  }catch(err){
    console.log(err);
    return [];
  }
}

export default async function Historic(){
  const finishOrder = await getOrderFinish();

  return(
    <>
      <FinishOrder finishOrder={finishOrder}/> 
    </>
  )
}