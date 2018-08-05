import React, { Component } from 'react';
import axiosClient from '../../axiosClient';
import './index.css';

class NegaForm extends Component {
  state = {
  selectedNegaFilmFiles: [],
  submitFormProgress: 0,
  isSubmittingForm: false,
  didFormSubmissionComplete: false,
  nega: {
    id: this.props.match.params.id,
    type: '',
    description: '',
    errors: {}
  }
};

  componentWillMount() {
    if (this.props.match.params.id) {
      axiosClient.get(`/negas/${this.props.match.params.id}`).then(response => {
        this.setState({
          selectedNegaFilmFiles: response.data.film_photos,
          nega: {
            id: response.data.id,
            type: response.data.type,
            description: response.data.description,
            errors: {}
          }
        });
      });
    }
  }


  render() {
  return (
    <div className="NegaForm">
      <form>

        <div className="form-group">
          <label>Type</label>
          <input
            type="text"
            onChange={e => this.handleNegaFilmChange(e)}
            value={this.state.nega.type}
            className="form-control"
          />
          {this.renderNegaFilmInlineError()}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            type="text"
            onChange={e => this.handleNegaDescriptionChange(e)}
            value={this.state.nega.description}
            className="form-control"
          />
          {this.renderNegaDescriptionInlineError()}
        </div>

        <div className="form-group">
          <label>films</label>
          {this.renderUploadfilmsButton()}
          {this.renderSelectedNegaFilmFiles()}
        </div>

        {this.renderUploadFormProgress()}

        <button
          disabled={this.state.isSubmittingForm}
          onClick={e => this.handleFormSubmit()}
          className="btn btn-primary">
          {this.state.isSubmittingForm ? 'Saving...' : 'Save'}
        </button>
        &nbsp;
        <button
          disabled={this.state.isSubmittingForm}
          onClick={e => this.handleCancel()}
          className="btn btn-default">
          Cancel
        </button>

      </form>
      <br />
    </div>
   );
  }

  handleCancel() {}
  handleFormSubmit() {}


  handleNegaTypeChange(e) {
    let { nega } = this.state;
    nega.type = e.target.value;
    this.setState({ nega: nega });
  }

  handleNegaDescriptionChange(e) {
    let { nega } = this.state;
    nega.description = e.target.value;
    this.setState({ nega: nega });
  }

  renderNegaTypeInlineError() {
    if (this.state.nega.errors.type) {
      return (
        <div className="inline-error alert alert-danger">
          {this.state.nega.errors.type.join(', ')}
        </div>
      );
    } else {
      return null;
    }
  }

  renderNegaDescriptionInlineError() {
    if (this.state.nega.errors.description) {
      return (
        <div className="inline-error alert alert-danger">
          {this.state.nega.errors.description.join(', ')}
        </div>
      );
    } else {
      return null;
    }
  }

  getNumberOfSelectedFiles() {
  return this.state.selectedNegaFilmFiles.filter(el => {
    return el._destroy !== true;
  }).length;
}

  renderUploadFilmsButton() {
    let numberOfSelectedFilms = this.getNumberOfSelectedFiles();
    return (
      <div>
        <input
          name="films[]"
          ref={field => (this.negaFilmsField = field)}
          type="file"
          disabled={this.state.isSubmittingForm}
          multiple={true}
          accept="image/*"
          style={{
            width: 0.1,
            height: 0.1,
            opacity: 0,
            overflow: 'hidden',
            position: 'absolute',
            zIndex: -1
          }}
          id="nega_films"
          onChange={e => this.handleNegaFilmsChange(e)}
          className="form-control"
        />
        <label
          disabled={this.state.isSubmittingForm}
          className="btn btn-success"
          htmlFor="nega_films">
          <span className="glyphicon glyphicon-cloud-upload" />
          &nbsp; &nbsp;
          {numberOfSelectedFilms === 0
            ? 'Upload Files'
            : `${numberOfSelectedFilms} file${numberOfSelectedFilms !== 1
                ? 's'
                : ''} selected`}
        </label>
      </div>
    );
  }

  handleNegaFilmsChange() {
    let selectedFiles = this.negaFilmsField.files;
    let { selectedNegaFilmFiles } = this.state;
    for (let i = 0; i < selectedFiles.length; i++) {
      selectedNegaFilmFiles.push(selectedFiles.item(i));
    } //end for

    this.setState(
      {
        selectedNegaFilmFiles: selectedNegaFilmFiles
      },
      () => {
        this.negaFilmsField.value = null;
      }
    );
  }

  renderSelectedNegaFilmFiles() {
  let fileDOMs = this.state.selectedNegaFilmFiles.map((el, index) => {
    if (el._destroy) { // we use _destroy to mark the removed photo
      return null;
    }

    return (
      <li key={index}>
        <div className="photo">
          <img
            width={150}
            src={el.id ? el.url : URL.createObjectURL(el)}
            style={{ alignSelf: 'center' }}
          />
          <div
            className="remove"
            onClick={() => this.removeSelectedNegaFilmFile(el, index)}>
            <span style={{ top: 2 }} className="glyphicon glyphicon-remove" />
          </div>
        </div>
        <div className="file-name">
          {el.name}
        </div>
      </li>
    );
  });

  return (
    <ul className="selected-films">
      {fileDOMs}
    </ul>
    );
  }

    removeSelectedNegaFilmFile(film, index) {
    let { selectedNegaFilmFiles } = this.state;
    if (film.id) { // film file that has been uploaded will be marked as destroy
      selectedNegaFilmFiles[index]._destroy = true;
    } else {
      selectedNegaFilmFiles.splice(index, 1);
    }

    this.setState({
      selectedNegaFilmFiles: selectedNegaFilmFiles
    });
  }

  handleCancel() {
    this.props.history.push('/negas');
  }

  handleFormSubmit() {
    let { nega } = this.state;
    nega.errors = {};
    this.setState(
      {
        isSubmittingForm: true,
        nega: nega
      },
      () => {
        this.submitForm();
      }
    );
  }

  buildFormData() {
    let formData = new FormData();
    formData.append('nega[type]', this.state.nega.type);
    formData.append('nega[description]', this.state.nega.description);

    let { selectedNegaFilmFiles } = this.state;
    for (let i = 0; i < selectedNegaFilmFiles.length; i++) {
      let file = selectedNegaFilmFiles[i];
      if (file.id) {
        if (file._destroy) {
          formData.append(`nega[films_attributes][${i}][id]`, file.id);
          formData.append(`nega[films_attributes][${i}][_destroy]`, '1');
        }
      } else {
        formData.append(
          `nega[films_attributes][${i}][photo]`,
          file,
          file.name
        );
      }
    }
    return formData;
  }

  submitForm() {
    let submitMethod = this.state.nega.id ? 'patch' : 'post';
    let url = this.state.nega.id
      ? `/negas/${this.state.nega.id}.json`
      : '/negas.json';

    axiosClient
      [submitMethod](url, this.buildFormData(), {
        onUploadProgress: progressEvent => {
          let percentage = progressEvent.loaded * 100.0 / progressEvent.total;
          this.setState({
            submitFormProgress: percentage
          });
        }
      })
      .then(response => {
        this.setState({
          didFormSubmissionComplete: true
        });
        this.props.history.push('/negas');
      })
      .catch(error => {
        let { nega } = this.state;
        nega.errors = error.response.data;
        this.setState({
          isSubmittingForm: false,
          submitFormProgress: 0,
          nega: nega
        });
    });
  }

  renderUploadFormProgress() {
    if (this.state.isSubmittingForm === false) {
      return null;
    }

    return (
      <div className="progress">
        <div
          className={
            'progress-bar progress-bar-info progress-bar-striped' +
            (this.state.submitFormProgress < 100 ? 'active' : '')
          }
          role="progressbar"
          aria-valuenow={this.state.submitFormProgress}
          areaValuemin="0"
          areaValuemax="100"
          style={{ width: this.state.submitFormProgress + '%' }}>
          {this.state.submitFormProgress}% Complete
        </div>
      </div>
    );
  }
}



export default NegaForm;