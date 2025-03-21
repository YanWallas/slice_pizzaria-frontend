import { NextRequest, NextResponse } from "next/server";
import { getCookieServer } from "@/lib/cookieServer";
import { api } from "./services/api";

// middleware cuidando das rotas provadas 
export async function middleware(req: NextRequest){
  const { pathname } = req.nextUrl //Pegando a url de rota e jogando na variavel.

  // Se for na rota padrao ou "/", deixa prosseguir. 
  if(pathname.startsWith("/_next") || pathname === "/"){
    return NextResponse.next();
  }

  //pegando o token la da pasta lib
  const token = await getCookieServer();

  // Se o usuario for na rota /dashboard
  if(pathname.startsWith("/dashboard")){
    //se nao tiver token, volta para rota de login
    if(!token){
      return NextResponse.redirect(new URL("/", req.url))
    }

    //Depoid de validar o token, joga se esta true ou false na const.
    const isValid = await validateToken(token)

    // se tiver false, ele retorna para pagina de login
    if(!isValid){
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // se nao barrar em nada, prossegue normal. 
  return NextResponse.next();
}

// Função para validar o token se é true ou false. 
async function validateToken(token: string){
  if(!token) return false;

  try{
    await api.get("/me", {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return true;

  }catch(err){
    return false;
  }
}