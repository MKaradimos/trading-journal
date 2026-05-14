import { loginWithGoogle } from "../firebase";

export default function LoginScreen() {
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Login error:", err);
      alert("Αποτυχία σύνδεσης. Δοκίμασε ξανά.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center px-4">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 w-full max-w-sm text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-2 h-8 bg-emerald-400 rounded-sm" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Trading Journal</h1>
        </div>
        <p className="text-slate-500 text-xs font-mono mb-8">// καταγραφή • ανάλυση • βελτίωση</p>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-lg transition-colors"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Σύνδεση με Google
        </button>
      </div>
    </div>
  );
}
