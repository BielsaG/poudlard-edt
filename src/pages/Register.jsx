import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWizard, getBois, getClasses, getCoeurs, getHouses, login } from "../services";
import couverturePoudlard from "../assets/photos/photo-poudlard-accueil.jpg";

function ListeDeroulante({ valeur, options, onChange, placeholder }) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <div className="relative" onBlur={() => setOuvert(false)}>
      <button type="button" onClick={() => setOuvert(!ouvert)}
        className={`flex w-full items-center justify-between rounded-md bg-white p-2 text-left shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F] ${valeur ? "" : "text-[#6E6459]"}`}>
        {valeur || placeholder}
        <span className="text-xs text-[#8A9597]">▼</span>
      </button>
      {ouvert && (
        <ul className="absolute inset-x-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-md bg-white shadow-md [scrollbar-color:#8A9597_#E5E7E8] [scrollbar-width:thin]">
          {options.map((o) => (
            <li key={o.id} onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(o.name); setOuvert(false); }}
              className={`cursor-pointer px-3 py-2 hover:bg-[#E5E7E8] ${o.name === valeur ? "font-semibold" : ""}`}>
              {o.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Register() {

  const navigate = useNavigate();

  const [maisons, setMaisons] = useState([]);
  const [classes, setClasses] = useState([]);
  const [listeBois, setListeBois] = useState([]);
  const [listeCoeurs, setListeCoeurs] = useState([]);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const [chargementDonnees, setChargementDonnees] = useState(true);
  const [succes, setSucces] = useState("");

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");
  const [maison, setMaison] = useState("");
  const [classe, setClasse] = useState("");
  const [ville, setVille] = useState("");
  const [animal, setAnimal] = useState("");
  const [bois, setBois] = useState("");
  const [coeur, setCoeur] = useState("");
  const [longueur, setLongueur] = useState("");

  useEffect(() => {
    async function chargerDonnees() {
      try {
        const maisonsData = await getHouses();
        const classesData = await getClasses();
        setMaisons(maisonsData);
        setClasses(classesData);
        setListeBois(await getBois());
        setListeCoeurs(await getCoeurs());
      } catch {
        setErreur("Impossible de charger les données");
      } finally {
        setChargementDonnees(false);
      }
    }

    chargerDonnees();
  }, []);

  async function inscrire(e) {
    e.preventDefault();
    setErreur("");
    setSucces("");

    if (motDePasse !== confirmationMotDePasse) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    setChargement(true);

    const wizard = {
      firstName: prenom,
      lastName: nom,
      email,
      password: motDePasse,
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(`${prenom} ${nom}`)}`,
      roleIds: ["f924"],
      houseId: maison,
      classId: classe,
      headOfHouseId: null,
      villeOrigine: ville,
      animal,
      baguette: { bois, coeur, longueur: longueur ? `${longueur} cm` : "" },
    };

    try {
      const nouveauWizard = await createWizard(wizard);
      await login(email, motDePasse);
      setSucces("Inscription réussie.");
      navigate(`/sorciers/${nouveauWizard.id}`);
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

      <div className="mx-auto max-w-3xl rounded-2xl border border-white/20 bg-parchment-light/95 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-8">
        <div className="mb-8">
          <h1 className="font-title text-3xl font-bold">Inscription</h1>
        </div>

        {erreur && <p className="mb-5 rounded-xl border border-error/20 bg-error/10 p-3 text-error">{erreur}</p>}
        {succes && <p className="mb-5 rounded-xl border border-success/20 bg-success/10 p-3 text-success">{succes}</p>}

        <form className="space-y-7" onSubmit={inscrire}>
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-stone-dark">Prénom</label>
              <input className="w-full rounded-xl border border-stone-light bg-white px-4 py-3 shadow-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" value={prenom}
                onChange={(e) => setPrenom(e.target.value)} required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-stone-dark">Nom</label>
              <input className="w-full rounded-xl border border-stone-light bg-white px-4 py-3 shadow-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" value={nom}
                onChange={(e) => setNom(e.target.value)} required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-stone-dark">Adresse mail</label>
              <input type="email" className="w-full rounded-xl border border-stone-light bg-white px-4 py-3 shadow-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" value={email}
                onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-stone-dark">Ville d'origine</label>
              <input className="w-full rounded-xl border border-stone-light bg-white px-4 py-3 shadow-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" value={ville}
                onChange={(e) => setVille(e.target.value)} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-stone-dark">Mot de passe</label>
              <input type="password" className="w-full rounded-xl border border-stone-light bg-white px-4 py-3 shadow-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)} required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-stone-dark">Confirmer le mot de passe</label>
              <input type="password" className="w-full rounded-xl border border-stone-light bg-white px-4 py-3 shadow-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" value={confirmationMotDePasse}
                onChange={(e) => setConfirmationMotDePasse(e.target.value)} required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-stone-dark">Maison</label>
              <select className="w-full rounded-xl border border-stone-light bg-white px-4 py-3 shadow-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" value={maison}
                onChange={(e) => setMaison(e.target.value)} required disabled={chargementDonnees}>
                <option value="">Choisir une maison</option>
                {maisons.map((maison) => (
                  <option key={maison.id} value={maison.id}>{maison.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-stone-dark">Classe</label>
              <select className="w-full rounded-xl border border-stone-light bg-white px-4 py-3 shadow-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" value={classe}
                onChange={(e) => setClasse(e.target.value)} required disabled={chargementDonnees}>
                <option value="">Choisir une classe</option>
                {classes.map((classe) => (
                  <option key={classe.id} value={classe.id}>{classe.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-light bg-stone-light/30 p-5">
            <h2 className="mb-4 font-title text-2xl font-bold">Vos items magiques</h2>
            <label className="mb-2 block text-sm font-bold text-stone-dark">Baguette magique</label>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <ListeDeroulante valeur={bois} options={listeBois} onChange={setBois} placeholder="Bois" />
              <ListeDeroulante valeur={coeur} options={listeCoeurs} onChange={setCoeur} placeholder="Cœur" />
              <input type="number" min="1" className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={longueur}
                onChange={(e) => setLongueur(e.target.value)} placeholder="Longueur (cm)" />
              <input className="w-full rounded-xl border border-stone-light bg-white px-4 py-3 shadow-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" value={bois}
                onChange={(e) => setBois(e.target.value)} placeholder="Bois" />
              <input className="w-full rounded-xl border border-stone-light bg-white px-4 py-3 shadow-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" value={coeur}
                onChange={(e) => setCoeur(e.target.value)} placeholder="Cœur" />
              <input className="w-full rounded-xl border border-stone-light bg-white px-4 py-3 shadow-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" value={longueur}
                onChange={(e) => setLongueur(e.target.value)} placeholder="Longueur" />
            </div>

            <label className="mb-2 mt-5 block text-sm font-bold text-stone-dark">Animal de compagnie</label>
            <select className="w-full rounded-xl border border-stone-light bg-white px-4 py-3 shadow-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" value={animal}
              onChange={(e) => setAnimal(e.target.value)}>
              <option value="">Aucun</option>
              <option value="Hibou">Hibou</option>
              <option value="Chouette">Chouette</option>
              <option value="Chat">Chat</option>
              <option value="Rat">Rat</option>
              <option value="Crapaud">Crapaud</option>
            </select>
          </div>

          <button className="w-full rounded-xl bg-brass px-5 py-3.5 font-bold text-white shadow-lg shadow-brass/20 transition hover:-translate-y-0.5 hover:bg-brass-dark disabled:cursor-not-allowed disabled:opacity-60"
            type="submit" disabled={chargement || chargementDonnees}>
            {chargement ? "Inscription..." : "Créer mon profil"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;