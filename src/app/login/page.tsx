import { authenticate } from "@/app/actions";
import { Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 premium-shadow">
        <div className="flex justify-center mb-8">
          <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-inner">
            <Lock className="h-10 w-10" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 text-center mb-2 tracking-tight">
          Acesso Restrito
        </h1>
        <p className="text-slate-500 text-center mb-8 font-medium">
          Digite a senha de administrador para gerenciar a agenda de caronas.
        </p>

        <form action={authenticate} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Senha de Acesso
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold placeholder:font-normal"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
          >
            <LogIn className="h-5 w-5" />
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
