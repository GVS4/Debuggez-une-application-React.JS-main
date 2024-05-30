import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";
import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // Trie les données par date de manière décroissante
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) > new Date(evtB.date) ? -1 : 1 // Ajout
  );

  // Utilise useEffect pour mettre à jour l'index toutes les 5 secondes
  useEffect(() => {
    const timeout = setTimeout(
      () => setIndex(index < byDateDesc?.length - 1 ? index + 1 : 0),
      5000
    );

    // Nettoie le timeout à chaque changement de dépendance pour éviter les fuites de mémoire
    return () => clearTimeout(timeout);
  }, [byDateDesc, index]);

  return (
    <div className="SlideCardList">
      <div>
        {/* Mapping des éléments triés pour les afficher dans le diaporama */}
        {byDateDesc?.map((event, idx) => (
          <div
            key={event.id} // Ajout
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            {/* Image de couverture de l'événement */}
            <img src={event.cover} alt="forum" key={event.id} />

            {/* Conteneur de la description de l'événement */}
            <div key={event.title} className="SlideCard__descriptionContainer">
              <div className="SlideCard__description" key={event.title}>
                {/* Titre de l'événement */}
                <h3 key={event.cover}>{event.title}</h3>
                {/* Description de l'événement */}
                <p key={event.description}>{event.description}</p>
                {/* Affichage du mois de l'événement */}
                <div key={event.title}>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Pagination pour les éléments du diaporama */}
        <div className="SlideCard__paginationContainer">
          <div className="SlideCard__pagination" />

          {/* Création des boutons de pagination en utilisant les dates des éléments */}
          {byDateDesc?.map((e, radioIdx) => (
            <input
              key={`${e.date}`}
              type="radio"
              name="radio-button"
              // Vérifie si l'index correspond à l'index actuel pour cocher le bouton
              checked={index === radioIdx}
              readOnly
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
