
import { useState } from "react";
import { useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import { deleteWizard, updateWizard } from "../services";

function Profile() {

  const profil = useLoaderData();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const [modifier, setModifier] = useState(false);
  const [confirmationSuppression, setConfirmationSuppression] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  const [prenom, setPrenom] = useState(profil.prenom);
  const [nom, setNom] = useState(profil.nom);
  const [email, setEmail] = useState(profil.email);
  const [maison, setMaison] = useState(profil.houseId || "");
  const [classe, setClasse] = useState(profil.classId || "");
  const [ville, setVille] = useState(profil.villeOrigine || "");
  const [animal, setAnimal] = useState(profil.animal || "");
  const [bois, setBois] = useState(profil.baguette?.bois || "");
  const [coeur, setCoeur] = useState(profil.baguette?.coeur || "");
  const [longueur, setLongueur] = useState(profil.baguette?.longueur || "");
  const [motDePasse, setMotDePasse] = useState("");

  const estEleve = profil.roles.includes("Élève");

  async function enregistrer() {
    setChargement(true);
    setErreur("");

    const donnees = {
      firstName: prenom,
      lastName: nom,
      email,
      houseId: maison || null,
      classId: classe || null,
      villeOrigine: ville,
      animal,
      baguette: { bois, coeur, longueur },
    };

    if (motDePasse) {
      donnees.password = motDePasse;
    }

    try {
      await updateWizard(profil.id, donnees);
      setModifier(false);
      setMotDePasse("");
      revalidator.revalidate();
    } catch (error) {
      setErreur(error.message);
    } finally {
      setChargement(false);
    }
  }

  async function supprimer() {
    setChargement(true);
    setErreur("");

    try {
      await deleteWizard(profil.id);
      navigate("/");
    } catch (error) {
      setErreur(error.message);
      setChargement(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4EDE1] px-4 py-10 text-[#2A2420] sm:px-8">

      <div className="mx-auto mb-8 flex max-w-5xl items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Fiche du sorcier</h1>
          <p className="mt-2 text-[#6E6459]">Registre officiel de Poudlard</p>
        </div>
      </div>

      <div className="mx-auto mb-6 max-w-5xl rounded-lg bg-[#FFFDFA] p-6 shadow-md">
        <div className="flex flex-col items-center gap-6 sm:flex-row">

          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8DFD1] text-3xl font-bold shadow-md">
            {profil.photo ? (
              <img src={profil.photo} alt="Portrait" className="h-full w-full object-cover" />
            ) : (
              <span>{profil.prenom[0]}{profil.nom[0]}</span>
            )}
          </div>

          <div className="w-full">
            {modifier ? (<>
                <input className="mb-2 w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={prenom}
                  onChange={(e) => setPrenom(e.target.value)} placeholder="Prénom"/>

                <input className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={nom}
                  onChange={(e) => setNom(e.target.value)} placeholder="Nom"/>
                </>) : 
            ( <>
                <h2 className="font-serif text-2xl font-bold">{profil.prenom} {profil.nom}</h2>
                <p className="mt-1 text-[#6E6459]">{profil.email}</p>
              </>)}

            {profil.roles.map((role) => (
              <span className="mr-2 mt-3 inline-block rounded bg-[#E8DFD1] px-3 py-1 text-sm font-semibold text-[#2A2420]" key={role}> {role}</span>))}
          </div>
        </div>
      </div>

      <div className="mx-auto mb-6 max-w-5xl overflow-hidden rounded-lg bg-[#FFFDFA] shadow-md">
        <div className="bg-[#E8DFD1] px-6 py-4">
          <h3 className="font-serif text-xl font-bold">Informations personnelles</h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Adresse mail</label>

              {modifier ? (<input type="email" className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]"
                value={email} onChange={(e) => setEmail(e.target.value)}/>) : 
                (<p className="font-medium">{profil.email}</p>)}
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Ville d'origine</label>

              {modifier ? (<input className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]"
                  value={ville} onChange={(e) => setVille(e.target.value)}/>) : 
                  (<p className="font-medium">{profil.villeOrigine}</p>)}
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Animal de compagnie</label>

              {modifier ? (<select className="w-full rounded-md bg-white p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={animal}
                  onChange={(e) => setAnimal(e.target.value)}>
                  <option value="">Aucun</option>
                  <option value="Hibou">Hibou</option>
                  <option value="Chouette">Chouette</option>
                  <option value="Chat">Chat</option>
                  <option value="Rat">Rat</option>
                  <option value="Crapaud">Crapaud</option>
                </select>) : (<p className="font-medium">{profil.animal}</p>)}
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Baguette magique</label>

              {modifier ? (<div className="space-y-2">
                  <input className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={bois}
                    onChange={(e) => setBois(e.target.value)} placeholder="Bois"/>

                  <input className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={coeur}
                    onChange={(e) => setCoeur(e.target.value)} placeholder="Cœur"/>

                  <input className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={longueur}
                    onChange={(e) => setLongueur(e.target.value)} placeholder="Longueur"/>
                </div>) : (<div className="space-y-1 font-medium">
                  <p>{profil.baguette?.bois}</p>
                  <p>{profil.baguette?.coeur}</p>
                  <p>{profil.baguette?.longueur}</p>
                </div>)}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mb-6 max-w-5xl overflow-hidden rounded-lg bg-[#FFFDFA] shadow-md">
        <div className="bg-[#E8DFD1] px-6 py-4">
          <h3 className="font-serif text-xl font-bold">Informations scolaires</h3>
        </div>

        <div className="p-6">

          {estEleve ? (<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="mb-3">
                <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Maison</label>
                {modifier ? (<select className="w-full rounded-md bg-white p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={maison}
                    onChange={(e) => setMaison(e.target.value)}>
                    <option value="">Choisir une maison</option>
                    {profil.maisons.map((maison) => (
                      <option key={maison.id} value={maison.id}>{maison.name}</option>
                    ))}
                </select>) : (<p className="font-medium">{profil.maison}</p>)}
              </div>

              <div className="mb-3">
                <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Classe</label>

                {modifier ? (<select className="w-full rounded-md bg-white p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={classe}
                    onChange={(e) => setClasse(e.target.value)}>
                    <option value="">Choisir une classe</option>
                    {profil.classes.map((classe) => (
                      <option key={classe.id} value={classe.id}>{classe.name}</option>))}
                  </select>) : (<p className="font-medium">{profil.classe}</p>)}
              </div>

            </div>) : (<p>Ce sorcier fait partie du personnel de Poudlard.</p>)}

        </div>
      </div>

      {modifier && (<div className="mx-auto mb-6 max-w-5xl overflow-hidden rounded-lg bg-[#FFFDFA] shadow-md">
          <div className="bg-[#E8DFD1] px-6 py-4">
            <h3 className="font-serif text-xl font-bold">Modifier le mot de passe</h3>
          </div>

          <div className="p-6">
            <label className="mb-2 block text-sm font-semibold text-[#6E6459]">Nouveau mot de passe</label>

            <input type="password" className="w-full rounded-md p-2 shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F]" value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="Laisser vide pour conserver l'ancien"/>
          </div>
        </div>)}

      <div className="mx-auto mb-6 flex max-w-5xl justify-end gap-3">

        {erreur && <p className="mr-auto text-red-700">{erreur}</p>}

        {modifier ? (<>
            <button className="rounded-md bg-gray-500 px-5 py-2 font-semibold text-white transition hover:bg-gray-600" onClick={() => setModifier(false)} type="button" disabled={chargement}>
              Annuler
            </button>

            <button className="rounded-md bg-green-700 px-5 py-2 font-semibold text-white transition hover:bg-green-800" onClick={enregistrer} type="button" disabled={chargement}>
              {chargement ? "Enregistrement..." : "Enregistrer"}
            </button>
          </>) : 
          (<>
            <button className="rounded-md bg-[#A8813F] px-5 py-2 font-semibold text-white transition hover:bg-[#89672F]" onClick={() => setModifier(true)} type="button" disabled={chargement}>
              Modifier
            </button>

            <button className="rounded-md bg-red-700 px-5 py-2 font-semibold text-white transition hover:bg-red-800" onClick={() => setConfirmationSuppression(true)}
              type="button" disabled={chargement}>
              Supprimer
            </button>
          </>
        )}

      </div>

      {confirmationSuppression && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">
          <div className="w-full max-w-md rounded-lg bg-[#FFFDFA] p-8 shadow-2xl">
            <h4 className="mb-4 font-serif text-xl font-bold">Supprimer ce profil ?</h4>

            <p className="mb-6"> Voulez-vous vraiment supprimer le profil de{" "}
              {profil.prenom} {profil.nom} ?
            </p>

            <button className="mr-2 rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600" onClick={() => setConfirmationSuppression(false)} disabled={chargement}>
              Annuler
            </button>

            <button className="rounded-md bg-red-700 px-4 py-2 text-white hover:bg-red-800" onClick={supprimer} disabled={chargement}>
              {chargement ? "Suppression..." : "Confirmer"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;
