document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const resetBtn = document.getElementById("resetBtn");
  const searchBtn = document.getElementById("searchBtn");

  // Clear input function
  function clearInput() {
    const divResult = document.getElementById("result");
    divResult.innerHTML = "";
    searchInput.value = "";
  }

  // Event listener for reset button
  resetBtn.addEventListener("click", function (event) {
    event.preventDefault();
    clearInput();
  });

  // Search function
  function search(event) {
    event.preventDefault();
    const input = searchInput.value.toLowerCase();
    const divResult = document.getElementById("result");
    divResult.innerHTML = "";

    fetch("../data/travel_recommendation_api.json")
      .then((response) => response.json())
      .then((data) => {
        let filteredData = [];

        if (input.includes("beach")) {
          filteredData = data.beaches;
        } else if (input.includes("temple")) {
          filteredData = data.temples;
        } else {
          filteredData = data.countries.filter((country) => {
            return (
              country.name.toLowerCase().includes(input) ||
              country.cities.some((city) =>
                city.name.toLowerCase().includes(input)
              )
            );
          });
        }

        if (filteredData.length > 0) {
          filteredData.forEach((item) => {
            if (item.cities) {
              item.cities.forEach((city) => {
                const div = document.createElement("div");
                div.innerHTML = `
                  <h3>${city.name}</h3>
                  <p>${item.name}</p>
                  <p>${city.description}</p>
                  <img src="${city.imageUrl}" alt="${city.name}" style="width:100%; height:auto;">
                `;
                divResult.appendChild(div);
              });
            } else {
              const div = document.createElement("div");
              div.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <img src="${item.imageUrl}" alt="${item.name}" style="width:100%; height:auto;">
              `;
              divResult.appendChild(div);
            }
          });
        } else {
          divResult.innerHTML =
            "No recommendations found for the given keyword.";
        }
      })
      .catch((error) => {
        console.error(error);
        divResult.innerHTML = "An error occurred while trying to fetch data.";
      });
  }

  searchBtn.addEventListener("click", search);
});
