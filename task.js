const autoComplete = document.querySelector(".autocomplete-list")
const reposInfo = document.querySelector(".repos-info");

function debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  }

  
  async function searchRepo(query){
    if(!query){
      autoComplete.innerHTML = " ";
      return;
    }
    try{
      const response =await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`);
      if(response.ok){
         const data = await response.json();
         return data;
       }else{
           console .error("request failed:",response.status);
          }
        }catch{
          console.error("Error fetching repositories:", error);
    }
  }
  const inputField = document.querySelector("input");
  inputField.addEventListener("input", debounce(async (event) => {
    const query = event.target.value.trim(); 
    const matchings = await searchRepo(query);
    autoComplete.innerHTML = "";

    if (matchings && matchings.items) {
      matchings.items.forEach((repo) => {
        const listItem = document.createElement("div");
        listItem.setAttribute("class","lists")
        listItem.textContent = repo.name; 
        listItem.addEventListener("click", () => {
          const div = document.createElement("div");
          div.innerHTML = `
            <div class = "repos-items">
            <div class ="details">
            Name: ${repo.name}<br>
            Owner: ${repo.owner.login}<br>
            Stars: ${repo.stargazers_count}
            </div>
            <button class="delete-btn"><img src ="cross.png"></button>
            </div>`;
          reposInfo.append(div);

          
          const deleteButton = div.querySelector(".delete-btn");
          deleteButton.addEventListener("click", () => div.remove());

          
          autoComplete.innerHTML = "";
          inputField.value = ""; 
        });

        autoComplete.append(listItem); 
      });
    }
    
  }, 200)); 
  

  