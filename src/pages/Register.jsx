import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWizard, getClasses, getHouses, login } from "../services";

function Register() {

  const navigate = useNavigate();

  const [maisons, setMaisons] = useState([]);
  const [classes, setClasses] = useState([]);
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
      } catch {
        setErreur("Impossible de charger les données du formulaire.");
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
      baguette: { bois, coeur, longueur },
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
        <p className="mt-2 text-[#6E6459]">Crée ton profil de sorcier</p>

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
              <input className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={bois}
                onChange={(e) => setBois(e.target.value)} placeholder="Bois" />
              <input className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={coeur}
                onChange={(e) => setCoeur(e.target.value)} placeholder="Cœur" />
              <input className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={longueur}
                onChange={(e) => setLongueur(e.target.value)} placeholder="Longueur" />
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