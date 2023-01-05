import React, { useEffect, useRef, useState } from "react";
import { ButtonToDo, TaskDiv, InputDiv } from "./StyledComponents";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const DisplayTasks = ({ savedNotes, setSavedNotes, updateState, setUpdateState }) => {
  const [isListeningEdit, setIsListeningEdit] = useState(false);

  const selectedTask = useRef([]);

  const completeTask = (id) => {
    savedNotes[id].complete = !savedNotes[id].complete;
    setUpdateState(!updateState);
  };

  const edit = (id) => {
    setUpdateState(!updateState);

    savedNotes[id].edit = !savedNotes[id].edit;
  };

  const saveChanges = (id) => {
    if (selectedTask.current[id].value === "") {
    } else {
      let arrayNotes = savedNotes;

      arrayNotes[id].taskNotes = selectedTask.current[id].value;

      setSavedNotes(arrayNotes);
    }
    savedNotes[id].edit = !savedNotes[id].edit;
    setUpdateState(!updateState);
    savedNotes[id].isListeningEdit = false; // Cerramos el micro por si al usuario se le olvida para que no dé error
  };

  const deleteTask = (id) => {
    let savedNotesNew = savedNotes.filter(
      (name) => savedNotes.indexOf(name) !== id
    );

    setSavedNotes(savedNotesNew);
  };

  const microEdit = (id) => {
    savedNotes[id].isListeningEdit = !savedNotes[id].isListeningEdit;
    setUpdateState(!updateState);
    setIsListeningEdit(!isListeningEdit);
    if (savedNotes[id].isListeningEdit) {
      SpeechRecognition.startListening();
    } else {
      SpeechRecognition.stopListening();
    }
  };

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    savedNotes.forEach((element, id) => {
      if (savedNotes[id].isListeningEdit) {
        selectedTask.current[id].value = transcript;
      }
      if (transcript.length > 50) {
        savedNotes[id].isListeningEdit = false; /* Limitar caracteres */
      }
    });
  }, [transcript]);

  useEffect(() => {
    savedNotes.forEach((element, id) => {
      if (listening === false) {
        savedNotes[id].isListeningEdit = false; /* Sincronizar con listening */
        setUpdateState(!updateState); /* Para que se actualice el estado */
      }
    });
  }, [listening]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="dn">
      {savedNotes.map((task, id) =>
        savedNotes[id].edit ? (
          <InputDiv key={id} className="td">
            <ButtonToDo onClick={() => microEdit(id)}>
              {savedNotes[id].isListeningEdit ? <MicIcon fontSize="large" /> : <MicOffIcon fontSize="large" />}
            </ButtonToDo>
            <input
              type="text"
              maxlength="50"
              ref={(ref) => (selectedTask.current[id] = ref)}
              key={id}
              placeholder={savedNotes[id].isListeningEdit ? "¡Voz activada!" : "Escribe algo..."}
              defaultValue={task.taskNotes}
            />
            <ButtonToDo onClick={() => saveChanges(id)}>Actualizar</ButtonToDo>
          </InputDiv>
        ) : (
          <TaskDiv className={savedNotes[id].complete ? "td td--complete" : "td"} key={id}>
            <h3 className="td__text" onClick={() => completeTask(id)}>
              {task.taskNotes}
            </h3>
            <div className="td__div">
              <IconButton onClick={() => deleteTask(id)}>
                <DeleteIcon className="td__icon" />
              </IconButton>
              <IconButton onClick={() => edit(id)}>
                <EditIcon className="td__icon" />
              </IconButton>
            </div>
          </TaskDiv>
        )
      )}
    </div>
  );
};

export default DisplayTasks;
