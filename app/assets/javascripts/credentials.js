class Credentials {
  constructor(element) {
    this.credentialsDash = element.find("#credentials-dash")

    this.credentialsDash.on("click", "#new-credential-btn", this.displayNewCredentialModal);
    this.credentialsDash.on("click", "#create-credential-btn", this.createNewCredential);
  }

  createNewCredential()  {
    const name = $("#new-credential-name").val();
    const provider = $("#new-credential-provider").val();
    const username = $("#new-credential-username").val();

    if(!name || name === "" || !provider || provider === "" || !username || username === "") {
      toastr.error("You need to fill out all the fields for your credential!");
      return;
    }

    const data = new FormData();

    data.append("credential[name]", name);
    data.append("credential[provider]", provider);
    data.append("credential[username]", username);

    fetch("/credentials", 
    { 
        method: 'POST',  
        body: data,
        headers: {
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


  displayNewCredentialModal(e) {
    let modalHTML = `
      <div class="modal fade" id="new-credential-modal">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add A New Credential</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <input id="new-credential-name" class="form-control" maxlength=30 placeholder="Account name" required></input>
              </div>
              <div class="form-group">
                <select id="new-credential-provider" class="form-control" placeholder="Provider" required>
                  <option value="" disabled selected hidden>Select a provider </option>
                  <option value="Google"><i class="fa fa-google"></i>Google</option>
                  <option value="Outlook"><i class="fa fa-microsoft"></i>Outlook</option>
                </select>
              </div>
              <div class="form-group">
                <input id="new-credential-username" class="form-control" maxlength=30 placeholder="Email address" required></input>
              </div>
            </div>
            <div class="modal-footer">
              <input type="submit" name="commit" value="Create" class="btn btn-primary" data-disable-with="Add Credential" id="create-credential-btn">
              <button type="button" style="margin-left: 5px" class="btn btn-secondary" data-dismiss="modal" id="new-credential-close-modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `;

    $(`#modal-container`).html(modalHTML);
      $(`#new-credential-modal`).modal('show', 'focus');
  }
}

$(document).on('turbolinks:load', () => new Credentials($("body")));