import * as React from "react";
import { MdAdd } from "react-icons/md";
import NoteType from "./NoteType";

interface FormProps {
  createNote: (note: NoteType) => Promise<void>;
}

interface FormState {
  note: string;
  id: number;
}

export default class Form extends React.Component<FormProps, FormState> {
  constructor(props) {
    super(props);
    this.state = {
      note: "",
      id: 0,
    };
  }

  onChange = (e) => {
    this.setState({ note: e.target.value });
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter" && this.state.note !== "") {
      const { note, id } = this.state;
      this.props.createNote({ note, id });
      this.setState({ note: "", id: id + 1 });
    }
  };

  render() {
    return (
      <div className="form">
        <MdAdd size={28} />
        <input
          placeholder="Write new note here.."
          onKeyPress={this.handleKeyPress}
          onChange={(e) => this.onChange(e)}
          value={this.state.note}
        />
      </div>
    );
  }
}
