
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faGraduationCap,
  faHatWizard,
  faHouse,
  faKey,
  faLocationDot,
  faPaw,
  faPen,
  faTrash,
  faUser,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { deleteWizard, getCurrentUser, getWizardProfile, updateWizard } from "../services";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profil, setProfil] = useState(null);
  const [chargementProfil, setChargementProfil] = useState(true);
  const [modifier, setModifier] = useState(false);
  const [confirmationSuppression, setConfirmationSuppression] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [maison, setMaison] = useState("");
  const [classe, setClasse] = useState("");
  const [ville, setVille] = useState("");
  const [animal, setAnimal] = useState("");
  const [bois, setBois] = useState("");
  const [coeur, setCoeur] = useState("");
  const [longueur, setLongueur] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  function synchroniserFormulaire(donnees) {
    setPrenom(donnees.prenom);
    setNom(donnees.nom);
    setEmail(donnees.email);
    setMaison(donnees.houseId || "");
    setClasse(donnees.classId || "");
    setVille(donnees.villeOrigine || "");
    setAnimal(donnees.animal || "");
    setBois(donnees.baguette?.bois || "");
    setCoeur(donnees.baguette?.coeur || "");
    setLongueur(donnees.baguette?.longueur || "");
  }

//   utilisateur pas connecté
  useEffect(() => {
    if (!getCurrentUser()) {
      navigate("/connexion");
      return;
    }

    async function chargerProfil() {
      setChargementProfil(true);
      setErreur("");

      try {
        const donnees = await getWizardProfile(id);
        setProfil(donnees);
        synchroniserFormulaire(donnees);
      } catch (error) {
        setErreur(error.message);
      } finally {
        setChargementProfil(false);
      }
    }

    chargerProfil();
  }, [id, navigate]);

  if (chargementProfil) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="rounded-full bg-parchment-light px-5 py-3 text-stone-dark shadow-sm">
          <FontAwesomeIcon icon={faHatWizard} className="mr-2 text-brass" />
          Chargement du profil...
        </p>
      </div>
    );
  }

  if (!profil) {
    return <p className="py-10 text-center text-red-700">{erreur || "Profil introuvable."}</p>;
  }

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
      const donneesActualisees = await getWizardProfile(profil.id);
      setProfil(donneesActualisees);
      synchroniserFormulaire(donneesActualisees);
      setModifier(false);
      setMotDePasse("");
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
    <div className="min-h-screen bg-parchment px-4 py-10 text-castle sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h1 className="font-title text-3xl font-bold sm:text-4xl">Fiche du sorcier</h1>
          </div>
        </div>

        <section className="mb-6 overflow-hidden rounded-2xl bg-parchment-light shadow-[0_12px_35px_rgba(42,36,32,0.10)]">
          <div className="h-2" />
          <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:p-8">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-light text-3xl font-bold shadow-lg">
              <span>{profil.prenom[0]}{profil.nom[0]}</span>
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              {modifier ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="w-full rounded-lg border border-stone-light bg-white px-4 py-3 outline-none focus:border-brass focus:ring-2 focus:ring-brass/20" value={prenom}
                    onChange={(e) => setPrenom(e.target.value)} placeholder="Prénom" />
                  <input className="w-full rounded-lg border border-stone-light bg-white px-4 py-3 outline-none focus:border-brass focus:ring-2 focus:ring-brass/20" value={nom}
                    onChange={(e) => setNom(e.target.value)} placeholder="Nom" />
                </div>
              ) : (
                <>
                  <h2 className="truncate font-title text-3xl font-bold">{profil.prenom} {profil.nom}</h2>
                  <p className="mt-2 flex items-center justify-center gap-2 text-stone-dark sm:justify-start">
                    <FontAwesomeIcon icon={faEnvelope} className="text-brass" />
                    {profil.email}
                  </p>
                </>
              )}

              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                {profil.roles.map((role) => (
                  <span className="rounded-full bg-stone-light px-3 py-1 text-sm font-bold" key={role}>
                    <FontAwesomeIcon icon={faHatWizard} className="mr-2 text-brass-dark" />
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 overflow-hidden rounded-2xl bg-parchment-light shadow-[0_12px_35px_rgba(42,36,32,0.08)]">
          <div className="flex items-center gap-3 border-b border-stone-light px-6 py-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-castle text-parchment">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <h3 className="font-title text-xl font-bold">Informations personnelles</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-dark">
                <FontAwesomeIcon icon={faEnvelope} className="text-brass" /> Adresse mail
              </label>
              {modifier ? (
                <input type="email" className="w-full rounded-lg border border-stone-light px-3 py-2 outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              ) : <p className="font-semibold">{profil.email}</p>}
            </div>

            <div className="rounded-xl bg-white p-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-dark">
                <FontAwesomeIcon icon={faLocationDot} className="text-brass" /> Ville d'origine
              </label>
              {modifier ? (
                <input className="w-full rounded-lg border border-stone-light px-3 py-2 outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
                  value={ville} onChange={(e) => setVille(e.target.value)} />
              ) : <p className="font-semibold">{profil.villeOrigine || "Non renseignée"}</p>}
            </div>

            <div className="rounded-xl bg-white p-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-dark">
                <FontAwesomeIcon icon={faPaw} className="text-brass" /> Animal de compagnie
              </label>
              {modifier ? (
                <select className="w-full rounded-lg bg-white px-3 py-2 outline-none focus:border-brass focus:ring-2 focus:ring-brass/20" value={animal}
                  onChange={(e) => setAnimal(e.target.value)}>
                  <option value="">Aucun</option>
                  <option value="Hibou">Hibou</option>
                  <option value="Chouette">Chouette</option>
                  <option value="Chat">Chat</option>
                  <option value="Rat">Rat</option>
                  <option value="Crapaud">Crapaud</option>
                </select>
              ) : <p className="font-semibold">{profil.animal || "Aucun"}</p>}
            </div>

            <div className="rounded-xl bg-white p-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-dark">
                <FontAwesomeIcon icon={faHatWizard} className="text-brass" /> Baguette magique
              </label>
              {modifier ? (
                <div className="space-y-2">
                  <input className="w-full rounded-lg border border-stone-light px-3 py-2 outline-none focus:border-brass" value={bois}
                    onChange={(e) => setBois(e.target.value)} placeholder="Bois" />
                  <input className="w-full rounded-lg border border-stone-light px-3 py-2 outline-none focus:border-brass" value={coeur}
                    onChange={(e) => setCoeur(e.target.value)} placeholder="Cœur" />
                  <input className="w-full rounded-lg border border-stone-light px-3 py-2 outline-none focus:border-brass" value={longueur}
                    onChange={(e) => setLongueur(e.target.value)} placeholder="Longueur" />
                </div>
              ) : (
                <div className="space-y-1 font-semibold">
                  <p>{profil.baguette?.bois || "Bois non renseigné"}</p>
                  <p>{profil.baguette?.coeur || "Cœur non renseigné"}</p>
                  <p>{profil.baguette?.longueur || "Longueur non renseignée"}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mb-6 overflow-hidden rounded-2xl bg-parchment-light shadow-[0_12px_35px_rgba(42,36,32,0.08)]">
          <div className="flex items-center gap-3 border-b border-stone-light px-6 py-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-castle text-parchment">
              <FontAwesomeIcon icon={faGraduationCap} />
            </span>
            <h3 className="font-title text-xl font-bold">Informations scolaires</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-dark">
                <FontAwesomeIcon icon={faHouse} className="text-brass" /> Maison
              </label>
              {modifier ? (
                <select className="w-full rounded-lg border border-stone-light bg-white px-3 py-2 outline-none focus:border-brass focus:ring-2 focus:ring-brass/20" value={maison}
                  onChange={(e) => setMaison(e.target.value)}>
                  <option value="">Choisir une maison</option>
                  {profil.maisons.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              ) : <p className="font-semibold">{profil.maison || "Non renseignée"}</p>}
            </div>

            <div className="rounded-xl  bg-white p-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-dark">
                <FontAwesomeIcon icon={faGraduationCap} className="text-brass" /> Classe
              </label>
              {modifier ? (
                <select className="w-full rounded-lg border border-stone-light bg-white px-3 py-2 outline-none focus:border-brass focus:ring-2 focus:ring-brass/20" value={classe}
                  onChange={(e) => setClasse(e.target.value)}>
                  <option value="">Choisir une classe</option>
                  {profil.classes.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              ) : <p className="font-semibold">{profil.classe || "Non renseignée"}</p>}
            </div>
          </div>
        </section>

        {modifier && (
          <section className="mb-6 overflow-hidden rounded-2xl bg-parchment-light shadow-[0_12px_35px_rgba(42,36,32,0.08)]">
            <div className="flex items-center gap-3 border-b border-stone-light px-6 py-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-castle text-parchment">
                <FontAwesomeIcon icon={faKey} />
              </span>
              <h3 className="font-title text-xl font-bold">Modifier le mot de passe</h3>
            </div>
            <div className="p-6">
              <label className="mb-2 block text-sm font-bold text-stone-dark">Nouveau mot de passe</label>
              <input type="password" className="w-full rounded-lg border border-stone-light bg-white px-4 py-3 outline-none focus:border-brass focus:ring-2 focus:ring-brass/20" value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)} placeholder="Laisser vide pour conserver l'ancien" />
            </div>
          </section>
        )}

        {erreur && (
          <div className="mb-4 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-error">
            {erreur}
          </div>
        )}

        <div className="mb-6 flex flex-wrap justify-end gap-3">
          {modifier ? (
            <>
              <button className="inline-flex items-center gap-2 rounded-lg border border-stone px-5 py-2.5 font-bold text-stone-dark transition hover:bg-stone-light"
                onClick={() => setModifier(false)} type="button" disabled={chargement}>
                <FontAwesomeIcon icon={faXmark} /> Annuler
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-success px-5 py-2.5 font-bold text-white transition hover:brightness-110"
                onClick={enregistrer} type="button" disabled={chargement}>
                <FontAwesomeIcon icon={faCheck} /> {chargement ? "Enregistrement..." : "Enregistrer"}
              </button>
            </>
          ) : (
            <>
              <button className="inline-flex items-center gap-2 rounded-lg bg-brass px-5 py-2.5 font-bold text-white transition hover:bg-brass-dark"
                onClick={() => setModifier(true)} type="button" disabled={chargement}>
                <FontAwesomeIcon icon={faPen} /> Modifier
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-error px-5 py-2.5 font-bold text-white transition hover:brightness-90"
                onClick={() => setConfirmationSuppression(true)} type="button" disabled={chargement}>
                <FontAwesomeIcon icon={faTrash} /> Supprimer
              </button>
            </>
          )}
        </div>

        {confirmationSuppression && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-castle/70 p-5 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-parchment-light p-8 shadow-2xl">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
                <FontAwesomeIcon icon={faTrash} className="text-xl" />
              </span>
              <h4 className="mb-3 font-title text-xl font-bold">Supprimer ce profil ?</h4>
              <p className="mb-6 text-stone-dark">
                Voulez-vous vraiment supprimer le profil de {profil.prenom} {profil.nom} ?
              </p>
              <div className="flex justify-end gap-3">
                <button className="rounded-lg border border-stone px-4 py-2 font-bold text-stone-dark"
                  onClick={() => setConfirmationSuppression(false)} disabled={chargement}>
                  Annuler
                </button>
                <button className="rounded-lg bg-error px-4 py-2 font-bold text-white"
                  onClick={supprimer} disabled={chargement}>
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  {chargement ? "Suppression..." : "Confirmer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
