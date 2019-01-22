class Credentials {
  constructor(element) {
    this.campaignDash = element.find("#campaign-dash")
    this.campaignTemplate = element.find("#campaign-template-quill");
    this.showTemplateBtn = element.find("#show-template-btn");
    this.showDataBtn = element.find("#show-data-btn");

    this.campaignDash.on("keyup", ".ql-editor", this.updateVariables);
    this.campaignDash.on("keyup", ".ql-editor", this.autoSave);
    this.campaignDash.on("click", "#show-template-btn", this.showTemplate);
    this.campaignDash.on("click", "#show-data-btn", this.showData);
    this.campaignDash.on("click", "#show-history-btn", this.showHistory);


    this.showCorrectView();
    this.updateVariables();
  }

  displayNewCredentialModal(e) {
    let modalHTML = `
      <div class="modal fade" id="new-credential-modal">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Create A New Campaign</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <input id="new-credential-name" class="form-control" maxlength=30 placeholder="Campaign name" required></input>
            </div>
            <div class="modal-footer">
              <input type="submit" name="commit" value="Create" class="btn btn-primary" data-disable-with="Add Credential" id="create-campaign-btn">
              <button type="button" style="margin-left: 5px" class="btn btn-secondary" data-dismiss="modal" id="new-campaign-close-modal">Cancel</button>
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