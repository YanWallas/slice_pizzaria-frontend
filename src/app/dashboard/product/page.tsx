import { Form } from './components/form'
import { api } from '@/services/api'
import { getCookieServer } from '@/lib/cookieServer'

export default async function Product(){
  //Buscando o token
  const token = await getCookieServer();

  //Buscando as categorias
  const response = await api.get("/category", {
    headers:{
      Authorization: `Bearer ${token}`
    }
  })

  return(
    <Form categories={response.data}/>//Enviando categorias como props 
  )
}