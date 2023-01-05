import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { ButtonToDo, InputDiv, CustomTitle } from "./StyledComponents";
import DisplayTasks from "./DisplayTasks";
import { useEffect, useState } from "react";
import { useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const AddTask = () => {
  const [updateState, setUpdateState] = useState(false); 

  const [savedNotes, setSavedNotes] = useState([]);

  const [inst, setInst] = useState(false);

  const [listeningMain, setListeningMain] = useState(false);

  const inputValue = useRef("");

  const addNotes = (e) => {
    inputValue.current.value === ""
      ? setSavedNotes([...savedNotes])
      : setSavedNotes([
          ...savedNotes,
          { taskNotes: inputValue.current.value, edit: false, isListeningEdit: false, complete: false },
        ]);
  };

  const micro = () => {
    setListeningMain(!listeningMain);

    if (listeningMain) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening();
    }
  };

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (listeningMain) {
      inputValue.current.value = transcript;
    }

    if (transcript.length > 50) {
      setListeningMain(false); /* Limitar caracteres */
    }
  }, [transcript]);

  useEffect(() => {
    if (listening === false) {
      setListeningMain(false); /* Sincronizar con listening */
    }
  }, [listening]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <>
      <div className="notes">
        <CustomTitle>¿Qué tienes que hacer hoy?</CustomTitle>
        <div className="instructions">
          <button onClick={() => setInst(!inst)}>{inst ? "Cerrar instrucciones" : "Mostrar instrucciones"}</button>
          {inst ? (
            <>
              <h4> - Puedes añadir una tarea usando teclado o usando el micro.</h4>
              <h4> - Para usar el micro pulsa en el botón con el signo del micrófono.</h4>
              <h4>
                - El signo del micrófono tachado indica que el micrófono esta cerrado mientras que el signo del
                micrófono sin tachar indica que el micrófono está abierto.
              </h4>
              <h4>
                - Puedes editar tus tareas pulsando el signo del lápiz (a la derecha) y puedes borrarla pulsando el
                signo de la papelera.
              </h4>
              <h4> - Si pulsas encima del texto de una tarea, la tarea pasará al estado "Completada".</h4>
            </>
          ) : (
            <></>
          )}
        </div>

        <InputDiv className="td__first">
          <ButtonToDo onClick={micro}>
            {/* prevstate se refiere al estado previo de useState, en este caso le decimos que sea lo contrario al estado previo (true/false) */}
            {listeningMain ? <MicIcon fontSize="large" /> : <MicOffIcon fontSize="large" />}
          </ButtonToDo>
          <input
            type="text"
            maxlength="50"
            placeholder={listeningMain ? "¡Voz activada!" : "Escribe algo..."}
            ref={inputValue}
          />
          <ButtonToDo onClick={addNotes}>Añadir Tarea</ButtonToDo>
        </InputDiv>
        {listeningMain ? <h4>Microfono activado. Habla ahora.</h4> : ""}
        <DisplayTasks
          savedNotes={savedNotes}
          setSavedNotes={setSavedNotes}
          updateState={updateState}
          setUpdateState={setUpdateState}
        />
      </div>
    </>
  );
};

export default AddTask;
