const renderDiv = document.querySelector(".filtered-characters");

class FilterApp {
  static allData = [];

  static async getData(url) {
    const response = await fetch(url);
    const json = response.json();
    return json;
  }

  static async FilteredData() {
    //get values from inputs
    const name = document.querySelector("#name").value;
    const gender = document.querySelector("[name=Gender]:checked");
    const species = document.querySelector("#species").value;
    const status = document.querySelector("[name=status]:checked");

    let params = new URLSearchParams();

    if (name !== "") {
      params.append("name", name);
    }

    if (gender && gender.value !== "") {
      params.append("gender", gender.value);
    }

    if (species !== "") {
      params.append("species", species);
    }

    if (status && status.value !== "") {
      params.append("status", status.value);
    }

    const url = "https://rickandmortyapi.com/api/character?";
    const data = await FilterApp.getData(url + params.toString());
    //push the first page into allData array.
    FilterApp.allData.push(data.results);
    // console.log(data);

    //push all other pages (if they exist) into allData
    if (data.info.pages > 1) {
      for (let i = 2; i <= data.info.pages; i++) {
        //when i used append it kept adding the pages parameters instead of replacing it, .set method should be used.
        params.set("page", i);
        const data = await FilterApp.getData(url + params.toString());
        FilterApp.allData.push(data.results);
      }
    }

    console.log(data.info.count, params.toString(), FilterApp.allData);
    const count = data.info.count;
    return count;
  }

  static async renderData() {
    //empty everything when button is pressed.
    renderDiv.innerHTML = "";
    FilterApp.allData = [];

    const count = await FilterApp.FilteredData();
    const countPara = document.createElement("p");
    countPara.innerText = count;
    renderDiv.append(countPara);

    //allData is an array of arrays. This gives an error that foreach can't be run.
    // this.allData.forEach((dataArr) => {
    //   dataArr.forEach((data) => {
    //     let profileCard = document.createElement("div");
    //     let name = document.createElement("p");
    //     let gender = document.createElement("p");
    //     let species = document.createElement("p");
    //     let status = document.createElement("p");

    //     name.innerText = data.name;
    //     gender.innerText = data.gender;
    //     species.innerText = data.species;
    //     status.innerText = data.status;

    //     profileCard.append(name, gender, species, status);
    //     renderDiv.append(count, profileCard);
    //   });
    // });

    //flatten allData to get 1 array with all characters
    const allCharacters = FilterApp.allData.flat();
    console.log(allCharacters);

    allCharacters.forEach((character) => {
      let profileCard = document.createElement("div");
      profileCard.classList.add("profile-card");
      let name = document.createElement("p");
      let gender = document.createElement("p");
      let species = document.createElement("p");
      let status = document.createElement("p");

      name.innerText = character.name;
      gender.innerText = character.gender;
      species.innerText = character.species;
      status.innerText = character.status;

      profileCard.append(name, gender, species, status);
      renderDiv.append(profileCard);
    });
  }
}

const filterBtn = document.querySelector("#filter-btn");
filterBtn.addEventListener("click", FilterApp.renderData);
