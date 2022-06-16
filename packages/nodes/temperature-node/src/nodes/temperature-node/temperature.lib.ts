export const TemperatureFormat = Object.freeze({
  Kelvin: "kelvin",
  Celcius: "celcius",
});

export class TemperatureConverter {

  kelvinToCelcius(value) {
    return value - 273.15;
  }

  celciusToKelvin(value) {
    return value + 273.15;
  }
}
