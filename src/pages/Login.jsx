import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services";
import logo from "../assets/logos/logo-hogward.png";
import couverturePoudlard from "../assets/photos/photo-poudlard-accueil.jpg";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function connecter(e) {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    try {
      await login(email, motDePasse);
      navigate("/");
    } catch (error) {
      setErreur(error.message);
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden px-4 py-16 text-[#2A2420] sm:px-8">
      <img src={couverturePoudlard} alt="" className="absolute inset-0 -z-20 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-castle/75" />

      <div className="mx-auto max-w-md rounded-2xl border border-white/20 bg-parchment-light/95 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-8">
        <img src={logo} alt="Poudlard" className="relative z-10 mx-auto -mt-24 h-36 w-36 object-contain" />
        <div className="mb-8 text-center">
          <h1 className="font-title text-3xl font-bold">Connexion</h1>
        </div>

        {erreur && <p className="mb-5 rounded-xl border border-error/20 bg-error/10 p-3 text-error">{erreur}</p>}

        <form className="space-y-5" onSubmit={connecter}>
          <div>
            <label className="mb-2 block text-sm font-bold text-stone-dark">Adresse mail</label>
            <input type="email" className="w-full rounded-xl border border-stone-light bg-white px-4 py-3 shadow-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-stone-dark">Mot de passe</label>
            <input type="password" className="w-full rounded-xl border border-stone-light bg-white px-4 py-3 shadow-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)} required />
          </div>

          <button className="w-full rounded-xl bg-brass px-5 py-3.5 font-bold text-white shadow-lg shadow-brass/20 transition hover:-translate-y-0.5 hover:bg-brass-dark disabled:cursor-not-allowed disabled:opacity-60"
            type="submit" disabled={chargement}>
            {chargement ? "Connexion" : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-stone-dark">
          Pas encore de compte ?{" "}
          <Link to="/inscription" className="font-bold text-brass-dark transition hover:text-brass">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
