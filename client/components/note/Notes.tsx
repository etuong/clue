import * as React from "react";
import Form from "./Form";
import NoteCell from "./NoteCell";
import NoteType from "./NoteType";
import "./Note.scss";

interface NotesProps { }

interface NotesState {
  notes: NoteType[];
}

export default class Notes extends React.Component<NotesProps, NotesState> {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    };

    this.createNote = this.createNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }

  createNote = async (noteType: NoteType) => {
    const notes = [noteType, ...this.state.notes];
    this.setState({ notes });
  };

  deleteNote = async (id: number) => {
    const notes = this.state.notes.filter(n => n.id !== id);
    this.setState({ notes });
  };

  render() {
    return (
      <div className="note-container">
        <p className="title">Notes</p>
        <Form createNote={this.createNote} />
        {this.state.notes.map((t, i) => (
          <NoteCell
            key={i}
            note={t.note}
            id={t.id}
            deleteNote={this.deleteNote}
          />
        ))}
      </div>
    );
  }
}
