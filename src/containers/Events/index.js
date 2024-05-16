import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  // Utilisation du contexte pour obtenir les données des événements et les erreurs potentielles
  const { data, error } = useData();
  // État pour stocker le type d'événement sélectionné et la page actuelle
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrage des événements en fonction du type sélectionné et pagination
  const filteredEvents = (
    (!type
      ? data?.events
      // Ajout
      : data?.events.filter((event) => event.type === type)) || []
  ) 
    .filter((events, index) => {
      // Pagination : vérifier si l'événement se trouve dans la plage de la page actuelle
      if (
        (currentPage - 1) * PER_PAGE <= index &&
        PER_PAGE * currentPage > index
      ) {
        return true;
      }
      return false;
    });

  const onChange = (evtType) => {
    // Ajout : ChangeType -> onChange
    setCurrentPage(1);
    setType(evtType);
  };

  // Calcul du nombre total de pages
  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
  // Création d'une liste unique des types d'événements
  const typeList = new Set(data?.events.map((event) => event.type));

  return (
    <>
      {error && <div>An error occured</div>}{" "}
      {/* Afficher un message d'erreur si une erreur se produit */}
      {data === null ? ( // Afficher "loading" si les données sont en cours de chargement
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)} // Passer la liste des types d'événements au composant Select
            onChange={(value) => (value ? onChange(value) : onChange(null))} // Mettre à jour le type sélectionné lors d'un changement
          />

          <div id="events" className="ListContainer">
            {/* Affichage des événements filtrés */}
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {/* Affichage des numéros de page pour la pagination */}
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
