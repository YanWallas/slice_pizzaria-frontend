"use client"
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { Button } from '@/app/dashboard/components/button/';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DeleteIcon } from 'lucide-react';

export default function Category(){
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  async function handleRegisterCategory(formData: FormData) {
    const name = formData.get("name")

    if(name === "") return;

    const data = {
      name: name,
    }
    
    const token = await getCookieClient();
    
    await api.post("/category", data, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    .catch((err) => {
      toast.warning("Erro ao cadastrar categoria!!!")
      console.log(err);
      return;
    })

    toast.success("Categoria cadastrada com sucesso!")
    router.push("/dashboard")
  }

  async function fetchCategories(){
    try{
      //Buscando o token
      const token = await getCookieClient();

      //Buscando as categorias
      const response = await api.get("/category", {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })

      setCategories(response.data);
    } catch(err){
      console.log("Erro ao buscar categories", err);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleDeleteCategory(category_id : Number){
    const token = await getCookieClient();


    await api.delete(`/category/remove`, {
      params:{
        category_id: String(category_id),
      },
      headers:{
        Authorization: `Bearer ${token}`
       }
    })
    .catch((err) => {
      toast.warning("Erro ao deletar categoria!!!")
      console.log(err);
      return;
    })

    toast.success("Categoria deletada com sucesso!")
    fetchCategories();
  }

  return(
    <main className={styles.container}>
      <h1>Nova Categoria</h1>

      <form className={styles.form} action={handleRegisterCategory}>
        <input 
          type="text" 
          name='name'
          placeholder='Nome da categoria, ex: pizzas'
          required
          className={styles.input}
        />

        <Button name="Cadastrar"/>
      </form>

      <section className={styles.list}>
        <h2>Categorias ja cadastradas:</h2>
        <ul>
         {categories.length > 0 ? (
            categories.map((category: { id: number, name: string }) => (
              <li key={category.id}>
                {category.name}
                <DeleteIcon 
                  size={24} 
                  className={styles.buttonLi} 
                  onClick={() => handleDeleteCategory(category.id)} />
              </li>
              
            ))
          ): (
            <p>Nehuma categoria cadastrada...</p>
         )}
        </ul>
      </section>
    </main>
  )
}