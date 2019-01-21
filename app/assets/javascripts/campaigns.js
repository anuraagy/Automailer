class Campaigns {
  constructor(element) {
    this.campaignDash = element.find("#campaign-dash")
    this.campaignTemplate = element.find("#campaign-template-quill");
    this.showTemplateBtn = element.find("#show-template-btn");
    this.showDataBtn = element.find("#show-data-btn");

    this.campaignDash.on("keyup", ".ql-editor", this.updateVariables);
    this.campaignDash.on("click", "#show-template-btn", this.showTemplate);
    this.campaignDash.on("click", "#show-data-btn", this.showData);

  }

  showTemplate() {
    $("#template").show();
    $("#data").hide();
  }

  showData() {
    $("#template").hide();
    $("#data").show();
  }

  createNewCampaign()  {
    const name = $("#new-campaign-name").val();

    if(!name || name === "") {
      toastr.error("You need a name for your campaign!");
      return;
    }

    const data = {
      "name": name
    }

    fetch("campaigns/", 
    { 
        method: 'POST',  
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': Rails.csrfToken()
        },
    }).then(res => res.json())
    .then((response) => {
      if(response.success) {
        location.reload();
        toastr.success(response.message);
      } else {
        toastr.error(response.message);
      }
    });
  }

  updateVariables(e) {
    const campaignTemplate = window['quill-container-0'].root;
    const variableList = $("#variables");
    let availableVars = [];
    variableList.children().each((index, child) => availableVars.push(child));

    let match = campaignTemplate.innerHTML.match(/{{\s*[\w\.]+\s*}}/g);
    if(match) {
      
      match = Array.from(new Set(match)); //Removes duplicates

      match.forEach((variable) => { 
        let cleanV = variable.match(/[\w\.]+/)[0];
        availableVars = availableVars.filter((variable) => {
          const found = variable.innerText === cleanV;
          
          if(found) {
            variable.className ="badge badge-success";
          }

          return !found;
        })
      });
    }

    availableVars.forEach(variable => variable.className = "badge badge-primary");
  }
}

$(document).on('turbolinks:load', () => new Campaigns($("body")));