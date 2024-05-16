import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

// Définition d'une fonction qui simule une API de contact
const mockContactApi = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 500); 
  });

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);

  // Définition d'une fonction de rappel pour envoyer le formulaire
  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      setSending(true);

      // On tente d'appeler l'API simulée
      try {
        await mockContactApi(); 
        setSending(false);
        onSuccess(); // Ajout
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    [onSuccess, onError]
  );

  // Le composant Form renvoie un formulaire avec des champs et un bouton
  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          {/* Champs de formulaire pour le nom et le prénom */}
          <Field placeholder="" label="Nom" name="Nom" />
          <Field placeholder="" label="Prénom" name="Prénom" />

          {/* Sélecteur pour le type de contact (Personel / Entreprise) */}
          <Select
            selection={["Personel", "Entreprise"]}
            onChange={() => null}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
          />

          {/* Champ de formulaire pour l'email */}
          <Field
            placeholder=""
            label="Email"
            name="Email" // Ajout
            type={FIELD_TYPES.InputEmail} // Ajout
          />

          {/* Bouton d'envoi du formulaire */}
          <Button
            type={BUTTON_TYPES.SUBMIT}
            disabled={sending}
            onClick={onSuccess} // Ajout
          >
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>

        <div className="col">
          <Field
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
            name="msg" // Ajout
          />
        </div>
      </div>
    </form>
  );
};


Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};


Form.defaultProps = {
  onError: () => null,
  onSuccess: () => !null,
};

export default Form;
