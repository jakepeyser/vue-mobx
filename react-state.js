import React from 'react';
import cities from './cities';

class City extends React.Component {
  render() {
    const { name, icon, language, currency, population  } = this.props;
    return (
      <div className="city">
        <img className="city__icon" src={icon} />
        <ul className="city__info">
          <div className="city__info--bit"><span>Name:</span>{name}</div>
          <div className="city__info--bit"><span>Language:</span>{language}</div>
          <div className="city__info--bit"><span>Currency:</span>{currency}</div>
          <div className="city__info--bit"><span>Population:</span>{population}</div>
        </ul>
      </div>
    )
  }
}

/*
 * A simple React component
 */
class TravelLog extends React.Component {
  constructor(props) {
    super(props);
    this.cities = cities;
    this.state = {
      selectedCity: null,
      visited: {},
      showAlert: false,
      clearAlert: null
    };
  }

  showAlert() {
    if (this.state.clearAlert) {
      clearTimeout(this.state.clearAlert)
    }

    const clear = setTimeout(() => {
      this.setState({
        showAlert: false,
        clearAlert: null
      })
    }, 3000)

    this.setState({
      showAlert: true,
      clearAlert: clear
    })
  }

  selectCity(cityId) {
    this.setState({
      selectedCity: cityId
    });
  }

  toggleCity(cityId) {
    if (this.state.visited[cityId]) {
      delete this.state.visited[cityId];
    } else {
      this.state.visited[cityId] = true;
    }
    this.showAlert()
    this.setState({
      visited: this.state.visited
    });
  }

  render() {
    return (
      <div className="travel-log">
        <div className="travel-log__alert"
          style={{ opacity: this.state.showAlert ? 1 : 0 }}>
          <span>Travel log updated!</span>
        </div>
        <div className="travel-log__content">
          <div className="travel-log__selected">
            {this.state.selectedCity
              ? <City {...this.cities.find(city => city.id === this.state.selectedCity)}/>
              : <span className="travel-log__selected--none">Please select a city</span>
            }
          </div>
          <ul className="travel-log__cities">
          {this.cities
            .sort((a, b) => a.name > b.name ? 1 : -1)
            .map(city =>
            <div className="travel-log__cities--single" key={city.id}>
              <h2 className={city.id === this.state.selectedCity ? 'selected' : ''} onClick={() => this.selectCity(city.id)}>{city.name}</h2>
              <div className={`travel-log__cities--single-visit ${this.state.visited[city.id] ? 'visited' : ''}`} onClick={() => this.toggleCity(city.id)}/>
            </div>)}
          </ul>
        </div>
      </div>
    );
  }
}

React.render(<TravelLog />, document.getElementById('app'));