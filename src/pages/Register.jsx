import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWizard, getBois, getClasses, getCoeurs, getHouses, login } from "../services";

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
    <div className="min-h-screen bg-[#F4EDE1] px-4 py-10 text-[#2A2420] sm:px-8">
      <div className="mx-auto max-w-3xl rounded-lg bg-[#FFFDFA] p-6 shadow-md sm:p-8">
        <h1 className="font-serif text-3xl font-bold">Inscription</h1>

        {erreur && <p className="mt-5 rounded-md bg-red-100 p-3 text-red-700">{erreur}</p>}
        {succes && <p className="mt-5 rounded-md bg-green-100 p-3 text-green-700">{succes}</p>}

        <form className="mt-8 space-y-6" onSubmit={inscrire}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Prénom</label>
              <input className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={prenom}
                onChange={(e) => setPrenom(e.target.value)} required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Nom</label>
              <input className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={nom}
                onChange={(e) => setNom(e.target.value)} required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Adresse mail</label>
              <input type="email" className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={email}
                onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Ville d'origine</label>
              <input className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={ville}
                onChange={(e) => setVille(e.target.value)} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Mot de passe</label>
              <input type="password" className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)} required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Confirmer le mot de passe</label>
              <input type="password" className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={confirmationMotDePasse}
                onChange={(e) => setConfirmationMotDePasse(e.target.value)} required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Maison</label>
              <select className="w-full rounded-md bg-white p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={maison}
                onChange={(e) => setMaison(e.target.value)} required disabled={chargementDonnees}>
                <option value="">Choisir une maison</option>
                {maisons.map((maison) => (
                  <option key={maison.id} value={maison.id}>{maison.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Classe</label>
              <select className="w-full rounded-md bg-white p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={classe}
                onChange={(e) => setClasse(e.target.value)} required disabled={chargementDonnees}>
                <option value="">Choisir une classe</option>
                {classes.map((classe) => (
                  <option key={classe.id} value={classe.id}>{classe.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Animal de compagnie</label>
              <select className="w-full rounded-md bg-white p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={animal}
                onChange={(e) => setAnimal(e.target.value)}>
                <option value="">Aucun</option>
                <option value="Hibou">Hibou</option>
                <option value="Chouette">Chouette</option>
                <option value="Chat">Chat</option>
                <option value="Rat">Rat</option>
                <option value="Crapaud">Crapaud</option>
              </select>
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-xl font-bold">Baguette magique</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <ListeDeroulante valeur={bois} options={listeBois} onChange={setBois} placeholder="Bois" />
              <ListeDeroulante valeur={coeur} options={listeCoeurs} onChange={setCoeur} placeholder="Cœur" />
              <input type="number" min="1" className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={longueur}
                onChange={(e) => setLongueur(e.target.value)} placeholder="Longueur (cm)" />
            </div>
          </div>

          <button className="w-full rounded-md bg-[#A8813F] px-5 py-3 font-semibold text-white transition hover:bg-[#89672F]"
            type="submit" disabled={chargement || chargementDonnees}>
            {chargement ? "Inscription..." : "Créer mon profil"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;