import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { observable, action, extendObservable, computed, reaction } from 'mobx';
import cities from 'cities';

const InfoBit = ({ label, data }) => (
  <div className="city__info--bit">
    <span>{label}</span>
    <span>{data}</span>
  </div>
)

const City = ({ name, icon, language, currency, population  }) => (
  <div className="city">
    <img className="city__icon" src={icon} />
    <ul className="city__info">
      <InfoBit label="Name:" data={name} />
      <InfoBit label="Language:" data={language} />
      <InfoBit label="Currency:" data={currency} />
      <InfoBit label="Population:" data={population} />
    </ul>
  </div>
)

@observer class TravelLog extends React.Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      cities,
      sortedCities: computed(function() {
        return this.cities.sort((a, b) => a.name > b.name ? 1 : -1);
      }),
      selectedCity: computed(function() {
        return this.cities.find(city => city.id === this.selectedCityId);
      })
    })

    const updatedLog = reaction(
      () => this.visited,
      () => {
        if (this.clearAlert) {
          clearTimeout(this.clearAlert)
        }

        this.clearAlert = setTimeout(() => {
          this.showAlert = false;
        }, 3000)
        this.showAlert = true
      }
    );
  }

  @observable selectedCityId;
  @action selectCity(cityId) {
    this.selectedCityId = cityId;
  }

  @observable visited = {};
  @action toggleCity(cityId) {
    if (this.visited[cityId]) {
      const { [cityId]: city, ...rest } = this.visited;
      this.visited = rest;
    } else {
      this.visited = { ...this.visited, [cityId]: true };
    }
  }

  @observable showAlert = false;
  @observable clearAlert;

  render() {
    return (
      <div className="travel-log">
        <div className="travel-log__alert"
          style={{ opacity: this.showAlert ? 1 : 0 }}>
          <span>Travel log updated!</span>
        </div>
        <div className="travel-log__content">
          <div className="travel-log__selected">
            {this.selectedCityId
              ? <City {...this.selectedCity}/>
              : <span className="travel-log__selected--none">Please select a city</span>
            }
          </div>
          <ul className="travel-log__cities">
          {this.sortedCities
            .map(city =>
            <div className="travel-log__cities--single" key={city.id}>
              <h2 className={city.id === this.selectedCityId && 'selected'} onClick={() => this.selectCity(city.id)}>{city.name}</h2>
              <div className={`travel-log__cities--single-visit ${this.visited[city.id] ? 'visited' : ''}`} onClick={() => this.toggleCity(city.id)}/>
            </div>)}
          </ul>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<TravelLog />, document.getElementById('app'));