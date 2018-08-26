import React, { Component } from 'react';
import axiosClient from './axiosClient';
import Gallery from "react-photo-gallery";

class Main extends Component {

  state = { 
  	negas: []
  };

  componentWillMount() {
    axiosClient.get('/negas.json').then(response => {
      this.setState({ negas: response.data });
    });
  }

  render() {
    return (
      <div>
        <Gallery photos={defaultPhotos} />
        <div>
        {this.renderAllNegaFilmFiles()}
        </div>
      </div>
    );
  }

  renderAllNegaFilmFiles() {
  	return this.state.negas.map(nega => {
      return(
        <img
          src={nega.film_photos[0].url }
            width={400}
            height={400}
        />
       );
    });
  }
}

const defaultPhotos = [
  {
    src: "https://source.unsplash.com/2ShvY8Lf6l0/800x599",
    width: 4,
    height: 3
  },
  {
    src: "https://source.unsplash.com/Dm-qxdynoEc/800x799",
    width: 1,
    height: 1
  },
  {
    src: "https://source.unsplash.com/qDkso9nvCg0/600x799",
    width: 3,
    height: 4
  },
  {
    src: "https://source.unsplash.com/iecJiKe_RNg/600x799",
    width: 3,
    height: 4
  },
  {
    src: "https://source.unsplash.com/epcsn8Ed8kY/600x799",
    width: 3,
    height: 4
  },
  {
    src: "https://source.unsplash.com/NQSWvyVRIJk/800x599",
    width: 4,
    height: 3
  },
  {
    src: "https://source.unsplash.com/zh7GEuORbUw/600x799",
    width: 3,
    height: 4
  },
  {
    src: "https://source.unsplash.com/PpOHJezOalU/800x599",
    width: 4,
    height: 3
  },
  {
    src: "https://source.unsplash.com/I1ASdgphUH4/800x599",
    width: 4,
    height: 3
  }
];

export default Main
;