import styles from '../styles.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import logoImg from '/public/Slice Pizza - brancovermelho.png'
import { api } from '@/services/api'
import { redirect } from 'next/navigation'
import { toast } from 'sonner';

export default function Signup(){

  async function handleRegister(formData: FormData){
    "use server"

    const name = formData.get("name")
    const email = formData.get("email")
    const password = formData.get("password")

    if(name === "" || email === "" || password === ""){
      toast.warning("Preencha todos os campos!")

      return;
    }

    try{
      await api.post("/users", {
        name,
        email,
        password
      })

    } catch(err){
      console.log("error")
      console.log(err)
    }

    toast.success("Conta criada com sucesso!")
    redirect("/")
  }

  return(
    <>
     <div className={styles.containerCenter}>
        <Image
          src={logoImg}
          alt='logo da pizzaria'
          width={300}
          height={70}
        />

        <section className={styles.login}>
          <h1>Criando sua conta</h1>

          <form action={handleRegister}>
            <input 
              type="text" 
              required
              name="name"
              placeholder="Digite seu nome..."
              className={styles.input}
            />

            <input 
              type="email" 
              required
              name="email"
              placeholder="Digite seu email..."
              className={styles.input}
            />

            <input 
              type="password" 
              required
              name="password"
              placeholder="********"
              className={styles.input}
            />

            <button type='submit' className={styles.button}>Cadastrar</button>
          </form>

          <Link href="/" className={styles.text}>
            Já possui uma conta? Faça login
          </Link>
        </section>
      </div>
    </>
  )
}