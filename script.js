const countries = document.getElementById("countries");
const searchResult = document.getElementById("searchResult");
async function getCountriesByRegion(region) {
  const response = await fetch(
    `https://restcountries.eu/rest/v2/region/${region}`
  );
  return response.json();
}
function showCountries(region) {
  getCountriesByRegion(region).then((res) => {
    drawCountries(res, region);
  });
}
function drawCountries(res, region, fromSearch = false) {
  const div = document.createElement("div");
  if (region) {
    let regionTitle = document.createElement("h1");
    regionTitle.textContent = region.toUpperCase();
    div.appendChild(regionTitle);
  }
  res.forEach((v) => {
    const innerDiv = document.createElement("div");
    innerDiv.className = "countryName";
    innerDiv.addEventListener("click", function () {
      onCountryNameClick(v.name);
    });
    innerDiv.innerHTML += v.name;
    div.appendChild(innerDiv);
  });
  if (fromSearch) {
    searchResult.innerHTML = "";
    searchResult.appendChild(div);
  } else {
    countries.appendChild(div);
  }
}
function onCountryNameClick(name) {
  fetch(`https://restcountries.eu/rest/v2/name/${name}`)
    .then((response) => response.json())
    .then((data) => showSelectedCountry(data));
}
function showSelectedCountry(countryArr) {
  let c1 = document.getElementById("selectedCountry");
  c1.innerHTML = "";
  for (let c of countryArr) {
    let countriesWrapper = document.createElement("div");
    let nameDiv = document.createElement("div");
    let areaDiv = document.createElement("div");
    let capitalDiv = document.createElement("div");
    let populationDiv = document.createElement("div");
    let flagDiv = document.createElement("div");
    nameDiv.textContent = `Name: ${c.name}`;
    areaDiv.textContent = `Area: ${c.area}`;
    capitalDiv.textContent = `Capital: ${c.capital}`;
    populationDiv.textContent = `Population: ${c.population}`;
    let flagImg = document.createElement("img");
    flagDiv.appendChild(flagImg);
    flagImg.src = c.flag;
    flagImg.className = "flag";
    countriesWrapper.appendChild(nameDiv);
    countriesWrapper.appendChild(areaDiv);
    countriesWrapper.appendChild(capitalDiv);
    countriesWrapper.appendChild(populationDiv);
    countriesWrapper.appendChild(flagDiv);
    c1.appendChild(countriesWrapper);
  }
}
showCountries("europe");
showCountries("asia");
showCountries("americas");
showCountries("africa");
showCountries("oceania");

let search = document.getElementById("input");
search.addEventListener("input", debounce(searchCountry, 300));

function searchCountry() {
  const value = search.value;
  if (value) {
    fetch(`https://restcountries.eu/rest/v2/name/${value}`)
      .then((res) => res.json())
      .then((data) => {
        countries.style.display = "none";
        searchResult.style.display = "block";
        if (Array.isArray(data)) {
          drawCountries(data, null, true);
        } else {
          searchResult.innerHTML = "Not Found";
        }
      });
  } else {
    countries.style.display = "flex";
    searchResult.style.display = "none";
  }
}
function debounce(func, ms) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), ms);
  };
}
