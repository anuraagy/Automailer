class Pages {
  constructor(element) {
    this.dash = element.find("#dash")

    this.dash.on("click", "#new-campaign-btn", this.displayNewCampaignModal);
    this.dash.on("click", "#create-campaign-btn", this.createNewCampaign);
    this.dash.on("keyup", "#new-campaign-name", this.updateCharacterCount);
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

  displayNewCampaignModal(e) {
    let modalHTML = `
      <div class="modal fade" id="new-campaign-modal">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Create A New Campaign</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <input id="new-campaign-name" class="form-control" maxlength=30 placeholder="Campaign name" required></input>
            </div>
            <div class="modal-footer">
              <input type="submit" name="commit" value="Create" class="btn btn-primary" data-disable-with="Create Campaign" id="create-campaign-btn">
              <button type="button" style="margin-left: 5px" class="btn btn-secondary" data-dismiss="modal" id="new-campaign-close-modal">Cancel</button>
              <span id="character-count" style="margin-left: auto" class="pull-left">50 characters remaining</span>
            </div>
          </div>
        </div>
      </div>
    `;

    $(`#modal-container`).html(modalHTML);
      $(`#new-campaign-modal`).modal('show', 'focus');
  }

  updateCharacterCount(e) {
    $("#character-count").html((50 - e.target.value.length) + " characters remaining");
  }
}

$(document).on('turbolinks:load', () => new Pages($("body")));