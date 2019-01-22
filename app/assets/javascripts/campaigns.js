class Campaigns {
  constructor(element) {
    this.campaignDash = element.find("#campaign-dash")
    this.campaignTemplate = element.find("#campaign-template-quill");
    this.showTemplateBtn = element.find("#show-template-btn");
    this.showDataBtn = element.find("#show-data-btn");
    this.showRunCampaignModalBtn = element.find("#show-run-campaign-modal-btn");


    this.campaignDash.on("keyup", ".ql-editor", this.autoSave);
    this.campaignDash.on("keyup", "#campaign-subject", this.autoSave);
    this.campaignDash.on("keyup", ".ql-editor", this.updateVariables);
    this.campaignDash.on("keyup", "#campaign-subject", this.updateVariables);
    this.campaignDash.on("click", "#show-template-btn", this.showTemplate);
    this.campaignDash.on("click", "#show-data-btn", this.showData);
    this.campaignDash.on("click", "#show-history-btn", this.showHistory);
    this.campaignDash.on("click", "#show-run-campaign-modal-btn", this.displayRunCampaignModal);
    this.campaignDash.on("click", "#run-campaign-btn", this.runCampaign);

    if(this.campaignDash.length !== 0) {
      this.showCorrectView();
      this.updateVariables();
    }
  }

  displayRunCampaignModal() {
    $(`#run-campaign-modal`).modal('show', 'focus');
  }

  runCampaign() {
    const campaign = window.location.href.match(/[^\/]*$/)[0].split("#")[0];
    const credential = $("#user-credential-select").val();

    if(!campaign || !credential) return;

    const data = {
      credential: credential
    }

    fetch(`/campaigns/${campaign}/run`, 
    { 
        method: 'POST',  
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': Rails.csrfToken()
        },
    })
    .then(res => res.json())
    .then((response) => {
      if(response.success) {
        toastr.success(response.message);
        $("#run-campaign-modal").modal('hide');
      } else {
        toastr.error(response.message);
      }
    });
  }

  showCorrectView() {
    const view = window.location.href.split("#")[1];

    if(view == "data") this.showData();
    else if(view == "history") this.showHistory();
    else this.showTemplate();
  }

  autoSave() {
    const template = window['quill-container-0'].root;
    const templateText = template.innerText;
    const templateHTML = template.innerHTML;
    const subject = $("#campaign-subject");
    const subjectText = subject.val();
    const campaign = window.location.href.match(/[^\/]*$/)[0];

    const data = {
      "template": templateHTML,
      "subject": subjectText
    };

    fetch(campaign, 
    { 
        method: 'PUT',  
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': Rails.csrfToken()
        },
    });
  }

  showTemplate() {
    $("#template-view").show();
    $("#data-view").hide();
    $("#history-view").hide();
  }

  showData() {
    $("#template-view").hide();
    $("#data-view").show();
    $("#history-view").hide();
  }

  showHistory() {
    $("#template-view").hide();
    $("#data-view").hide();
    $("#history-view").show();
  }

  updateVariables(e) {
    const campaignTemplate = window['quill-container-0'].root;
    const campaignSubject = $("#campaign-subject");

    const variableList = $("#variables");
    let availableVars = [];
    variableList.children().each((index, child) => availableVars.push(child));

    let match = [];
    const templateMatch = campaignTemplate.innerHTML.match(/{{\s*[\w\.]+\s*}}/g);
    const subjecMatch = campaignSubject.val().match(/{{\s*[\w\.]+\s*}}/g);

    if(templateMatch) {
      match = match.concat(templateMatch);
    }

    if(subjecMatch) {
      match = match.concat(subjecMatch);
    }

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