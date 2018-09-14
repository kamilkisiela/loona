import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';

export class SubmitForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    if (this.state.value && this.state.value.trim().length) {
      this.props.onValue(this.state.value);
      this.setState({
        value: '',
      });
    }
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          label={this.props.label}
          value={this.state.value}
          onChange={this.handleChange}
          margin="normal"
        />
        <Button
          size="small"
          color="primary"
          aria-label="Submit"
          onClick={this.handleSubmit}
        >
          <AddIcon />
        </Button>
      </form>
    );
  }
}
