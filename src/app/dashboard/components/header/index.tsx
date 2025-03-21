"use client"
import Image from 'next/image';
import styles from './styles.module.scss';
import Link from 'next/link';
import logoImg from '/public/Slice Pizza - brancovermelho.png';
import { LogOutIcon } from 'lucide-react';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function Header(){
  const router = useRouter();

  async function handleLogout(){
    deleteCookie("session", { path: "/" })
    toast.success("Logout feito com sucesso!")
    router.replace("/")
  }


  return(
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard" >
          <Image
            alt='Logo Slice Pizza'
            src={logoImg}
            width={160}
            height={30}
            priority={true}
            quality={100}
            className={styles.img}
          />
        </Link>

        <nav>
          <Link href='/dashboard/category'>
            Categorias
          </Link>
          <Link href="/dashboard/product">
            Produto
          </Link>

          <form action={handleLogout}>
            <button type='submit'>
              <LogOutIcon size={24}/>
            </button>
          </form>
        </nav>
      </div>
    </header>
  )
}