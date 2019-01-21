class Campaigns {
  constructor(element) {
    this.campaignDash = element.find("#campaign-dash")

    this.campaignDash.on("keyup", ".ql-editor", this.updateCharacterCount);
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

  updateCharacterCount(e) {
    console.log(e.target.innerHTML);
  }
}

$(document).on('turbolinks:load', () => new Campaigns($("body")));