const renderDiv = document.querySelector(".filtered-characters");

class FilterApp {
  static allData = [];

  static async getData(url) {
    try {
      const response = await fetch(url);
      const json = await response.json();
      return json;
    } catch (err) {
      return err;
    }
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

    if (gender.value !== "") {
      params.append("gender", gender.value);
    }

    if (species !== "") {
      params.append("species", species);
    }

    if (status.value !== "") {
      params.append("status", status.value);
    }

    const url = "https://rickandmortyapi.com/api/character?";
    const data = await FilterApp.getData(url + params.toString());
    //push the first page into allData array.
    FilterApp.allData.push(data.results);
    // console.log(data);

    //push all other pages (if they exist) into allData
    if (data.info.pages > 1) {
      for (let page = 2; page <= data.info.pages; page++) {
        //when i used append it kept adding the pages parameters instead of replacing it, .set method should be used.
        params.set("page", page);
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
    // filterBtn.disabled = true;

    const count = await FilterApp.FilteredData();
    const countPara = document.createElement("p");
    countPara.innerText = `No. of characters: ${count}`;
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("container");
    renderDiv.append(countPara, containerDiv);

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

    allCharacters.forEach((character) => {
      let profileCard = document.createElement("div");
      profileCard.classList.add("profile-card");
      let image = document.createElement("img");
      image.classList.add("profile-img");
      image.setAttribute("loading", "lazy");
      let name = document.createElement("p");
      let gender = document.createElement("p");
      let species = document.createElement("p");
      let status = document.createElement("p");

      image.src = character.image;
      name.innerText = `Name: ${character.name}`;
      gender.innerText = `Gender: ${character.gender}`;
      species.innerText = `Species: ${character.species}`;
      status.innerText = `Status: ${character.status}`;

      profileCard.append(image, name, gender, species, status);
      containerDiv.append(profileCard);
    });

    // filterBtn.disabled = false;
  }
}

const filterBtn = document.querySelector("#filter-btn");
filterBtn.addEventListener("click", FilterApp.renderData);
