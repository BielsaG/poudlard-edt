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

      <div className="mx-auto max-w-md rounded-lg bg-[#FFFDFA] p-6 shadow-md sm:p-8">
        <img src={logo} alt="Poudlard" className="relative z-10 mx-auto -mt-24 h-36 w-36 object-contain" />
        <h1 className="text-center font-serif text-3xl font-bold">Connexion</h1>

        {erreur && <p className="mt-5 rounded-md bg-red-100 p-3 text-red-700">{erreur}</p>}

        <form className="mt-8 space-y-5" onSubmit={connecter}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Adresse mail</label>
            <input type="email" className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Mot de passe</label>
            <input type="password" className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)} required />
          </div>

          <button className="w-full rounded-md bg-[#A8813F] px-5 py-3 font-semibold text-white transition hover:bg-[#89672F]"
            type="submit" disabled={chargement}>
            {chargement ? "Connexion" : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-[#6E6459]">
          Pas encore de compte ?{" "}
          <Link to="/inscription" className="font-semibold text-[#89672F]">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
